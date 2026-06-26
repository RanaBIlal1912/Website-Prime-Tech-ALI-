from decimal import Decimal

from django.test import TestCase

from apps.quotations.models import Quotation, QuotationItem
from apps.quotations.pdf import render_quotation_pdf


class QuotationModelTests(TestCase):
    def _quote(self, tax="17", disc="5"):
        q = Quotation.objects.create(
            customer_name="ABC Corp",
            tax_percent=Decimal(tax),
            discount_percent=Decimal(disc),
        )
        QuotationItem.objects.create(quotation=q, description="Camera", quantity=Decimal("8"),
                                     unit_price=Decimal("5500"))
        QuotationItem.objects.create(quotation=q, description="Install", quantity=Decimal("1"),
                                     unit_price=Decimal("15000"))
        return q

    def test_auto_number_increments(self):
        q1 = Quotation.objects.create(customer_name="A")
        q2 = Quotation.objects.create(customer_name="B")
        self.assertEqual(q1.number, "QT-00001")
        self.assertEqual(q2.number, "QT-00002")

    def test_totals_math(self):
        q = self._quote()
        self.assertEqual(q.subtotal, Decimal("59000.00"))
        self.assertEqual(q.discount_amount, Decimal("2950.00"))   # 5%
        self.assertEqual(q.tax_amount, Decimal("9528.50"))        # 17% of 56050
        self.assertEqual(q.total, Decimal("65578.50"))

    def test_pdf_renders(self):
        q = self._quote()
        buf = render_quotation_pdf(q)
        data = buf.read()
        self.assertTrue(data.startswith(b"%PDF"))
        self.assertGreater(len(data), 1000)
