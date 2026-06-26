from rest_framework import viewsets

from apps.accounts.permissions import HasModulePermission

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only audit trail. Append-only by design — no create/update/delete."""

    queryset = AuditLog.objects.select_related("actor").all()
    serializer_class = AuditLogSerializer
    permission_classes = [HasModulePermission]
    required_module = "audit"
    search_fields = ["actor_email", "action", "target_model", "target_id"]
    filterset_fields = ["action", "target_model", "actor"]
    ordering_fields = ["created_at"]
