import uuid

from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    """Append-only record of significant actions (who did what, from where)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_logs",
    )
    actor_email = models.CharField(max_length=254, blank=True)
    action = models.CharField(max_length=60, db_index=True)
    target_model = models.CharField(max_length=80, blank=True)
    target_id = models.CharField(max_length=80, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["target_model", "target_id"])]

    def __str__(self):
        return f"{self.actor_email or 'anon'} {self.action} {self.target_model}#{self.target_id}"
