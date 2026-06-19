"""Users, Roles and Permissions — the RBAC core.

Permissions are data (``<module>.<action>`` codenames), so an admin can edit
what each role can do at runtime without a code change.
"""
import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager

# Canonical modules and actions used to generate the permission matrix.
MODULES = [
    "dashboard", "users", "roles", "leads", "crm", "customers", "projects",
    "portfolio", "blog", "media", "services", "products", "testimonials",
    "careers", "support", "contacts", "quotations", "seo", "settings",
    "audit", "cms",
]
ACTIONS = ["read", "create", "update", "delete"]


class Permission(models.Model):
    """A single capability, e.g. ``crm.update``."""

    codename = models.CharField(max_length=60, unique=True)
    module = models.CharField(max_length=40, db_index=True)
    action = models.CharField(max_length=20)
    description = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["module", "action"]

    def __str__(self):
        return self.codename


class Role(models.Model):
    """A named, configurable set of permissions."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(max_length=60, unique=True)
    description = models.CharField(max_length=200, blank=True)
    permissions = models.ManyToManyField(Permission, blank=True, related_name="roles")
    is_system = models.BooleanField(
        default=False, help_text="System roles cannot be deleted."
    )
    is_superuser_role = models.BooleanField(
        default=False, help_text="Grants all permissions implicitly."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def permission_codenames(self):
        if self.is_superuser_role:
            return set(Permission.objects.values_list("codename", flat=True))
        return set(self.permissions.values_list("codename", flat=True))


class User(AbstractBaseUser, PermissionsMixin):
    """Custom email-login user with an RBAC Role."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    avatar = models.CharField(max_length=500, blank=True)

    role = models.ForeignKey(
        Role, null=True, blank=True, on_delete=models.SET_NULL, related_name="users"
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Django admin access

    # Login-attempt limiting (account lockout)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)

    # 2FA-ready
    is_two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=64, blank=True)

    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.email

    # ---- lockout helpers ----
    @property
    def is_locked(self):
        return bool(self.locked_until and self.locked_until > timezone.now())

    # ---- RBAC helpers ----
    def get_permission_codenames(self):
        if self.is_superuser:
            return set(Permission.objects.values_list("codename", flat=True))
        if not self.role:
            return set()
        return self.role.permission_codenames()

    def has_module_action(self, module, action):
        if self.is_superuser:
            return True
        return f"{module}.{action}" in self.get_permission_codenames()
