"""Quotation generator: auto numbering, line items, tax & discount, PDF export."""
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.db.models import Max

from apps.core.models import TimeStampedModel


class Quotation(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        EXPIRED = "expired", "Expired"

    number = models.CharField(max_length=20, unique=True, editable=False, db_index=True)

    # Customer snapshot (denormalised so the quote is stable even if the customer changes)
    customer = models.ForeignKey(
        "crm.Customer", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="quotations",
    )
    lead = models.ForeignKey(
        "crm.Lead", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="quotations",
    )
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField(blank=True)
    customer_phone = models.CharField(max_length=30, blank=True)
    customer_address = models.CharField(max_length=300, blank=True)

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)
    issue_date = models.DateField(auto_now_add=True)
    valid_until = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    terms = models.TextField(blank=True)
    currency = models.CharField(max_length=8, default="PKR")

    tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0"))
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0"))

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="quotations",
    )

    def save(self, *args, **kwargs):
        if not self.number:
            self.number = self._generate_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_number():
        last = Quotation.objects.aggregate(m=Max("number"))["m"]
        seq = 1
        if last and last.startswith("QT-"):
            try:
                seq = int(last.split("-")[-1]) + 1
            except ValueError:
                seq = Quotation.objects.count() + 1
        return f"QT-{seq:05d}"

    # ---- money ----
    @property
    def subtotal(self):
        return sum((i.line_total for i in self.items.all()), Decimal("0"))

    @property
    def discount_amount(self):
        return (self.subtotal * self.discount_percent / Decimal("100")).quantize(Decimal("0.01"))

    @property
    def taxable_amount(self):
        return self.subtotal - self.discount_amount

    @property
    def tax_amount(self):
        return (self.taxable_amount * self.tax_percent / Decimal("100")).quantize(Decimal("0.01"))

    @property
    def total(self):
        return (self.taxable_amount + self.tax_amount).quantize(Decimal("0.01"))

    def __str__(self):
        return f"{self.number} — {self.customer_name}"


class QuotationItem(TimeStampedModel):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=300)
    # Optional links to catalogue records.
    product = models.ForeignKey(
        "catalog.Product", null=True, blank=True, on_delete=models.SET_NULL
    )
    service = models.ForeignKey(
        "catalog.Service", null=True, blank=True, on_delete=models.SET_NULL
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("1"))
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    order = models.PositiveIntegerField(default=0)

    class Meta(TimeStampedModel.Meta):
        ordering = ["order", "created_at"]

    @property
    def line_total(self):
        return (self.quantity * self.unit_price).quantize(Decimal("0.01"))

    def __str__(self):
        return self.description
