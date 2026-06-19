from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Permission, Role, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ["-created_at"]
    list_display = ["email", "full_name", "role", "is_active", "is_staff", "last_login"]
    list_filter = ["is_active", "is_staff", "role"]
    search_fields = ["email", "full_name"]
    readonly_fields = ["last_login", "created_at", "updated_at", "last_login_ip"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("full_name", "phone", "avatar")}),
        ("Access", {"fields": ("role", "is_active", "is_staff", "is_superuser")}),
        ("Security", {"fields": ("failed_login_attempts", "locked_until",
                                  "is_two_factor_enabled", "last_login_ip")}),
        ("Timestamps", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "role", "password1", "password2"),
        }),
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_system", "is_superuser_role"]
    filter_horizontal = ["permissions"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ["codename", "module", "action"]
    list_filter = ["module", "action"]
    search_fields = ["codename"]
