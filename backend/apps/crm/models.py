"""CRM domain: Customers, Leads, Notes, Follow-ups, and an Activity timeline."""
from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Customer(TimeStampedModel):
    """A converted/known customer (company or individual)."""

    class Type(models.TextChoices):
        RESIDENTIAL = "residential", "Residential"
        COMMERCIAL = "commercial", "Commercial"
        CORPORATE = "corporate", "Corporate Office"
        FACTORY = "factory", "Factory"
        SCHOOL = "school", "School"
        HOSPITAL = "hospital", "Hospital"
        RETAIL = "retail", "Retail Store"
        GOVERNMENT = "government", "Government"

    name = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    customer_type = models.CharField(
        max_length=20, choices=Type.choices, default=Type.RESIDENTIAL
    )
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=80, default="Bahawalpur")
    notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="customers",
    )

    class Meta(TimeStampedModel.Meta):
        indexes = [models.Index(fields=["name"]), models.Index(fields=["phone"])]

    def __str__(self):
        return self.name


class Lead(TimeStampedModel):
    class Source(models.TextChoices):
        WEBSITE = "website", "Website Form"
        WHATSAPP = "whatsapp", "WhatsApp"
        PHONE = "phone", "Phone Call"
        REFERRAL = "referral", "Referral"
        FACEBOOK = "facebook", "Facebook"
        GOOGLE = "google", "Google"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUOTATION_SENT = "quotation_sent", "Quotation Sent"
        NEGOTIATION = "negotiation", "Negotiation"
        WON = "won", "Won"
        LOST = "lost", "Lost"

    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    company = models.CharField(max_length=150, blank=True)
    service_interest = models.CharField(max_length=200, blank=True)
    message = models.TextField(blank=True)

    source = models.CharField(max_length=20, choices=Source.choices, default=Source.WEBSITE)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW, db_index=True
    )
    estimated_value = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="leads",
    )
    customer = models.ForeignKey(
        Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name="leads"
    )
    city = models.CharField(max_length=80, default="Bahawalpur")

    class Meta(TimeStampedModel.Meta):
        indexes = [models.Index(fields=["status", "source"])]

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"


class LeadNote(TimeStampedModel):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="lead_notes")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL
    )
    body = models.TextField()

    def __str__(self):
        return f"Note on {self.lead_id}"


class FollowUp(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        DONE = "done", "Done"
        MISSED = "missed", "Missed"

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="followups")
    due_at = models.DateTimeField(db_index=True)
    note = models.CharField(max_length=300, blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="followups",
    )

    class Meta(TimeStampedModel.Meta):
        ordering = ["due_at"]

    def __str__(self):
        return f"Follow-up {self.lead_id} @ {self.due_at:%Y-%m-%d}"


class Activity(TimeStampedModel):
    """Immutable timeline entry for a lead (status changes, calls, emails...)."""

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="activities")
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL
    )
    verb = models.CharField(max_length=60)  # e.g. "status_changed", "note_added"
    description = models.CharField(max_length=300, blank=True)
    meta = models.JSONField(default=dict, blank=True)

    class Meta(TimeStampedModel.Meta):
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.verb} on {self.lead_id}"
