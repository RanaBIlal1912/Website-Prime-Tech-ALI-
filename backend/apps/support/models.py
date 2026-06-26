"""Support ticket system with auto ticket numbers, priorities and reply history."""
from django.conf import settings
from django.db import models
from django.db.models import Max

from apps.core.models import TimeStampedModel


class Ticket(TimeStampedModel):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        IN_PROGRESS = "in_progress", "In Progress"
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        CLOSED = "closed", "Closed"

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        URGENT = "urgent", "Urgent"

    ticket_number = models.CharField(max_length=20, unique=True, editable=False, db_index=True)
    subject = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    requester_name = models.CharField(max_length=150, blank=True)
    requester_email = models.EmailField(blank=True)
    requester_phone = models.CharField(max_length=30, blank=True)
    customer = models.ForeignKey(
        "crm.Customer", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="tickets",
    )

    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.OPEN, db_index=True
    )
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="assigned_tickets",
    )
    resolution = models.TextField(blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = self._generate_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_number():
        last = Ticket.objects.aggregate(m=Max("ticket_number"))["m"]
        seq = 1
        if last and last.startswith("TKT-"):
            try:
                seq = int(last.split("-")[-1]) + 1
            except ValueError:
                seq = Ticket.objects.count() + 1
        return f"TKT-{seq:05d}"

    def __str__(self):
        return f"{self.ticket_number}: {self.subject}"


class TicketReply(TimeStampedModel):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="replies")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL
    )
    body = models.TextField()
    is_internal = models.BooleanField(
        default=False, help_text="Internal note — not shown to the customer."
    )

    class Meta(TimeStampedModel.Meta):
        ordering = ["created_at"]
        verbose_name_plural = "Ticket replies"

    def __str__(self):
        return f"Reply on {self.ticket_id}"
