from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.audit.utils import client_ip

from .models import Permission, Role, User


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "codename", "module", "action", "description"]


class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.SlugRelatedField(
        slug_field="codename",
        queryset=Permission.objects.all(),
        many=True,
        required=False,
    )
    user_count = serializers.IntegerField(source="users.count", read_only=True)

    class Meta:
        model = Role
        fields = [
            "id", "name", "slug", "description", "permissions",
            "is_system", "is_superuser_role", "user_count",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=False)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "phone", "avatar", "role", "role_name",
            "is_active", "is_staff", "is_two_factor_enabled", "permissions",
            "password", "last_login", "created_at",
        ]
        read_only_fields = ["id", "last_login", "created_at", "is_staff"]

    def get_permissions(self, obj):
        return sorted(obj.get_permission_codenames())

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class LoginSerializer(TokenObtainPairSerializer):
    """JWT obtain with account lockout + audit-friendly claims."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["full_name"] = user.full_name
        token["role"] = user.role.slug if user.role else None
        token["is_superuser"] = user.is_superuser
        return token

    def validate(self, attrs):
        request = self.context.get("request")
        email = attrs.get(self.username_field)

        user = User.objects.filter(email=email).first()
        if user and user.is_locked:
            mins = int((user.locked_until - timezone.now()).total_seconds() // 60) + 1
            raise serializers.ValidationError(
                {"detail": f"Account locked due to failed attempts. Try again in ~{mins} min."}
            )

        try:
            data = super().validate(attrs)
        except Exception:
            # Wrong password / inactive: count the failed attempt.
            if user:
                self._register_failed_attempt(user)
            raise

        # Success: reset counters, record IP.
        if user:
            user.failed_login_attempts = 0
            user.locked_until = None
            if request:
                user.last_login_ip = client_ip(request)
            user.save(update_fields=["failed_login_attempts", "locked_until", "last_login_ip"])

        data["user"] = UserSerializer(self.user).data
        return data

    @staticmethod
    def _register_failed_attempt(user):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= settings.LOGIN_MAX_ATTEMPTS:
            user.locked_until = timezone.now() + timezone.timedelta(
                minutes=settings.LOGIN_LOCKOUT_MINUTES
            )
            user.failed_login_attempts = 0
        user.save(update_fields=["failed_login_attempts", "locked_until"])


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value, user=self.context["request"].user)
        return value
