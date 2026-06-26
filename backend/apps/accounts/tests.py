from django.core.cache import cache
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import Permission, Role, User


def make_permissions():
    for module in ["leads", "support", "quotations"]:
        for action in ["read", "create", "update", "delete"]:
            Permission.objects.get_or_create(
                codename=f"{module}.{action}", module=module, action=action
            )


class AuthTests(TestCase):
    def setUp(self):
        # Reset throttle history between tests (login scope = 5/min).
        cache.clear()
        make_permissions()
        self.super_role = Role.objects.create(
            name="Super Admin", slug="super-admin", is_superuser_role=True, is_system=True
        )
        self.admin = User.objects.create_superuser(
            email="a@b.com", password="StrongPass@123", full_name="Admin", role=self.super_role
        )
        self.client = APIClient()

    def test_login_returns_tokens_and_user(self):
        res = self.client.post(
            reverse("v1:login"), {"email": "a@b.com", "password": "StrongPass@123"}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertEqual(res.data["user"]["email"], "a@b.com")

    def test_wrong_password_rejected(self):
        res = self.client.post(
            reverse("v1:login"), {"email": "a@b.com", "password": "nope"}, format="json"
        )
        self.assertEqual(res.status_code, 401)

    def test_account_lockout_after_max_attempts(self):
        # Five failed attempts (the login throttle budget) trips the lockout.
        for _ in range(5):
            self.client.post(
                reverse("v1:login"), {"email": "a@b.com", "password": "wrong"}, format="json"
            )
        self.admin.refresh_from_db()
        self.assertTrue(self.admin.is_locked)
        self.assertIsNotNone(self.admin.locked_until)

    def test_login_throttled_after_burst(self):
        # The 6th request within a minute is rate-limited (429) regardless of credentials.
        codes = [
            self.client.post(
                reverse("v1:login"), {"email": "a@b.com", "password": "wrong"}, format="json"
            ).status_code
            for _ in range(6)
        ]
        self.assertEqual(codes[-1], 429)

    def test_me_requires_auth(self):
        self.assertEqual(self.client.get(reverse("v1:me")).status_code, 401)


class RBACTests(TestCase):
    def setUp(self):
        make_permissions()
        sales = Role.objects.create(name="Sales", slug="sales")
        sales.permissions.set(Permission.objects.filter(module="leads"))
        tech = Role.objects.create(name="Tech", slug="tech")
        tech.permissions.set(Permission.objects.filter(codename="support.read"))

        self.sales_user = User.objects.create_user(
            email="s@b.com", password="StrongPass@123", role=sales
        )
        self.tech_user = User.objects.create_user(
            email="t@b.com", password="StrongPass@123", role=tech
        )

    def _client(self, user):
        c = APIClient()
        c.force_authenticate(user=user)
        return c

    def test_sales_can_read_leads(self):
        self.assertEqual(self._client(self.sales_user).get("/api/v1/crm/leads/").status_code, 200)

    def test_tech_cannot_read_leads(self):
        self.assertEqual(self._client(self.tech_user).get("/api/v1/crm/leads/").status_code, 403)

    def test_tech_cannot_create_quotation(self):
        res = self._client(self.tech_user).post(
            "/api/v1/quotations/", {"customer_name": "x", "items": []}, format="json"
        )
        self.assertEqual(res.status_code, 403)
