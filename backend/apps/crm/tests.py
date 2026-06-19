from django.test import TestCase
from rest_framework.test import APIClient

from apps.crm.models import Activity, Lead


class PublicLeadIntakeTests(TestCase):
    def test_public_can_submit_lead_without_auth(self):
        client = APIClient()
        res = client.post(
            "/api/v1/crm/public/leads/",
            {"name": "Jane", "phone": "0300", "service_interest": "CCTV"},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        lead = Lead.objects.get(name="Jane")
        self.assertEqual(lead.source, Lead.Source.WEBSITE)
        self.assertEqual(lead.status, Lead.Status.NEW)
        # An activity timeline entry is created on intake.
        self.assertTrue(Activity.objects.filter(lead=lead, verb="created").exists())

    def test_public_cannot_list_leads(self):
        self.assertEqual(APIClient().get("/api/v1/crm/leads/").status_code, 401)
