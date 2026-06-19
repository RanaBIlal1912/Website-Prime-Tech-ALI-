"""DRF permission class implementing module/action RBAC.

A ViewSet declares::

    required_module = "crm"
    public_actions = ["list", "retrieve"]   # optional: open to anyone (AllowAny)

The DRF action is mapped to an RBAC action and checked against the user's role.
"""
from rest_framework.permissions import SAFE_METHODS, BasePermission

# DRF viewset action -> RBAC action
ACTION_MAP = {
    "list": "read",
    "retrieve": "read",
    "create": "create",
    "update": "update",
    "partial_update": "update",
    "destroy": "delete",
}


class HasModulePermission(BasePermission):
    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        module = getattr(view, "required_module", None)
        public_actions = getattr(view, "public_actions", []) or []

        action = getattr(view, "action", None)

        # Publicly readable endpoints (e.g. website content, lead intake).
        if action in public_actions:
            return True

        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        if module is None:
            return True  # authenticated, no module gate

        # Map action; fall back to safe-method => read.
        rbac_action = ACTION_MAP.get(action)
        if rbac_action is None:
            rbac_action = "read" if request.method in SAFE_METHODS else "update"

        return request.user.has_module_action(module, rbac_action)


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_superuser or getattr(request.user.role, "is_superuser_role", False))
        )
