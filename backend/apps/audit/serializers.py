from rest_framework import serializers

from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = [
            "id", "actor", "actor_email", "action", "target_model", "target_id",
            "changes", "ip_address", "user_agent", "created_at",
        ]
        read_only_fields = fields
