from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.audit.utils import log_action

from .models import Permission, Role, User
from .permissions import HasModulePermission, IsSuperAdmin
from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    PermissionSerializer,
    RoleSerializer,
    UserSerializer,
)


class LoginView(TokenObtainPairView):
    """POST email/password -> access + refresh tokens + user payload."""

    serializer_class = LoginSerializer
    throttle_scope = "login"

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            log_action(request, "login", "User", request.data.get("email", ""))
        return response


class RefreshView(TokenRefreshView):
    throttle_scope = "login"


class LogoutView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        """Blacklist the supplied refresh token."""
        token = request.data.get("refresh")
        if not token:
            return Response(
                {"detail": "refresh token required"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            RefreshToken(token).blacklist()
        except TokenError:
            return Response({"detail": "invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        log_action(request, "logout", "User", str(request.user.id))
        return Response({"detail": "logged out"}, status=status.HTTP_205_RESET_CONTENT)


class MeViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        return Response(UserSerializer(request.user).data)

    @action(detail=False, methods=["post"])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"old_password": ["Incorrect password."]}, status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        log_action(request, "change_password", "User", str(user.id))
        return Response({"detail": "password changed"})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related("role").all()
    serializer_class = UserSerializer
    permission_classes = [HasModulePermission]
    required_module = "users"
    search_fields = ["email", "full_name", "phone"]
    filterset_fields = ["is_active", "role"]
    ordering_fields = ["created_at", "email", "last_login"]


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.prefetch_related("permissions").all()
    serializer_class = RoleSerializer
    permission_classes = [HasModulePermission]
    required_module = "roles"

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.is_system:
            return Response(
                {"detail": "System roles cannot be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """Catalogue of all permission codenames (used to build the role editor)."""

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsSuperAdmin]
    filterset_fields = ["module", "action"]
