"""Idempotent seeder: permissions, roles, super admin, site settings, and
content ported from the legacy static site's DEFAULT_DATA.

Admin credentials are taken from the environment — never hard-coded::

    SEED_ADMIN_EMAIL=you@primetech.pk SEED_ADMIN_PASSWORD=... python manage.py seed

If no password is supplied a strong random one is generated and printed ONCE.
"""
import os
import secrets

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import ACTIONS, MODULES, Permission, Role, User
from apps.catalog.models import Category, Product, Service, Testimonial
from apps.core.models import HomeSection, PageBackground, SiteSetting
from apps.portfolio.models import Project

# Which modules each non-super role can act on, and with which actions.
ROLE_MATRIX = {
    "sales-manager": {
        "name": "Sales Manager",
        "modules": {
            "dashboard": ["read"],
            "leads": ACTIONS, "crm": ACTIONS, "customers": ACTIONS,
            "quotations": ACTIONS, "contacts": ["read", "update"],
            "products": ["read"], "services": ["read"], "portfolio": ["read"],
        },
    },
    "support-manager": {
        "name": "Support Manager",
        "modules": {
            "dashboard": ["read"],
            "support": ACTIONS, "contacts": ["read", "update"],
            "customers": ["read"], "services": ["read"], "products": ["read"],
        },
    },
    "content-manager": {
        "name": "Content Manager",
        "modules": {
            "dashboard": ["read"],
            "blog": ACTIONS, "services": ACTIONS, "products": ACTIONS,
            "portfolio": ACTIONS, "media": ACTIONS, "testimonials": ACTIONS,
            "seo": ACTIONS, "cms": ACTIONS,
        },
    },
    "technician": {
        "name": "Technician",
        "modules": {
            "dashboard": ["read"],
            "support": ["read", "update"], "projects": ["read"],
        },
    },
}


class Command(BaseCommand):
    help = "Seed permissions, roles, admin user, site settings and demo content."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Seeding permissions…")
        self._seed_permissions()
        self.stdout.write("Seeding roles…")
        self._seed_roles()
        self.stdout.write("Seeding super admin…")
        self._seed_admin()
        self.stdout.write("Seeding site settings…")
        self._seed_settings()
        self.stdout.write("Seeding content (services/products/portfolio/testimonials)…")
        self._seed_content()
        self.stdout.write("Seeding page backgrounds + home sections…")
        self._seed_backgrounds()
        self.stdout.write(self.style.SUCCESS("Seed complete."))

    # --------------------------------------------------------------- RBAC
    def _seed_permissions(self):
        for module in MODULES:
            for action in ACTIONS:
                Permission.objects.get_or_create(
                    codename=f"{module}.{action}",
                    defaults={"module": module, "action": action,
                              "description": f"Can {action} {module}"},
                )

    def _seed_roles(self):
        Role.objects.get_or_create(
            slug="super-admin",
            defaults={"name": "Super Admin", "is_system": True,
                      "is_superuser_role": True,
                      "description": "Full, unrestricted access."},
        )
        for slug, cfg in ROLE_MATRIX.items():
            role, _ = Role.objects.get_or_create(
                slug=slug, defaults={"name": cfg["name"], "is_system": True}
            )
            codenames = [
                f"{module}.{action}"
                for module, actions in cfg["modules"].items()
                for action in actions
            ]
            role.permissions.set(Permission.objects.filter(codename__in=codenames))

    def _seed_admin(self):
        email = os.environ.get("SEED_ADMIN_EMAIL", "admin@primetech.pk")
        if User.objects.filter(email=email).exists():
            self.stdout.write(f"  admin {email} already exists — skipping.")
            return
        password = os.environ.get("SEED_ADMIN_PASSWORD")
        generated = False
        if not password:
            password = secrets.token_urlsafe(16)
            generated = True
        super_role = Role.objects.filter(slug="super-admin").first()
        User.objects.create_superuser(
            email=email, password=password, full_name="Prime Tech Admin", role=super_role
        )
        if generated:
            self.stdout.write(self.style.WARNING(
                f"  Generated admin password (shown once): {password}"
            ))
        self.stdout.write(self.style.SUCCESS(f"  Super admin created: {email}"))

    # ------------------------------------------------------------ content
    def _seed_settings(self):
        s = SiteSetting.load()
        if not s.company_desc:
            s.company_desc = ("Prime Tech delivers professional CCTV, networking, server "
                              "and security solutions for homes and businesses across Pakistan.")
            s.whatsapp = "923001234567"
            s.phone = "+92 300 1234567"
            s.email = "info@primetech.pk"
            s.address = "Office #12, IT Plaza, Bahawalpur, Punjab, Pakistan"
            s.map_embed = "https://www.google.com/maps?q=Bahawalpur&output=embed"
            s.save()

    def _seed_content(self):
        services = [
            ("📹", "CCTV Camera Installation", "Complete CCTV setup for homes, offices, shops & warehouses with night vision & remote viewing."),
            ("🌐", "Networking & IT Infrastructure", "Structured cabling, LAN/WAN setup, WiFi networks and enterprise-grade networking solutions."),
            ("🖥️", "Server Setup & Maintenance", "Server installation, configuration, backup systems and ongoing maintenance support."),
            ("🔐", "Access Control & Biometrics", "Biometric access control, alarm systems and integrated security solutions for your premises."),
            ("🛒", "Hardware Sales & Support", "Genuine routers, switches, DVRs, cameras and IT hardware with after-sales support."),
            ("🛠️", "Maintenance & AMC", "Annual maintenance contracts for CCTV & networking systems with quick response time."),
        ]
        for i, (icon, title, desc) in enumerate(services):
            Service.objects.get_or_create(
                title=title,
                defaults={"icon": icon, "short_desc": desc, "description": desc,
                          "is_featured": i < 3, "order": i,
                          "benefits": ["Certified technicians", "Genuine equipment",
                                       "Warranty & support", "Fast turnaround"],
                          "faqs": [{"q": f"How long does {title} take?",
                                    "a": "Most installations are completed within 1–3 days "
                                         "depending on site size."}]},
            )

        cat_cctv, _ = Category.objects.get_or_create(name="CCTV Camera", defaults={"kind": "product"})
        cat_dvr, _ = Category.objects.get_or_create(name="DVR", defaults={"kind": "product"})
        cat_net, _ = Category.objects.get_or_create(name="Networking", defaults={"kind": "product"})
        cat_router, _ = Category.objects.get_or_create(name="Router", defaults={"kind": "product"})
        products = [
            ("4MP Dome CCTV Camera", cat_cctv, "Rs. 5,500", "Best Seller", True,
             [{"key": "Resolution", "value": "4MP / 2560x1440"},
              {"key": "Night Vision", "value": "30m IR Range"},
              {"key": "Mount", "value": "Indoor / Outdoor"}]),
            ("8 Channel DVR", cat_dvr, "Rs. 12,000", "New", True,
             [{"key": "Channels", "value": "8"},
              {"key": "Resolution Support", "value": "Up to 5MP"},
              {"key": "Storage", "value": "Up to 10TB HDD"}]),
            ("Gigabit Network Switch", cat_net, "Rs. 7,000", "", False,
             [{"key": "Ports", "value": "24 x Gigabit"},
              {"key": "Throughput", "value": "48 Gbps"}]),
            ("Wireless Router AC1200", cat_router, "Rs. 4,500", "Popular", True,
             [{"key": "Speed", "value": "AC1200 Dual Band"},
              {"key": "Antennas", "value": "4 External"}]),
        ]
        for i, (name, cat, price, badge, feat, specs) in enumerate(products):
            Product.objects.get_or_create(
                name=name,
                defaults={"category": cat, "price_label": price, "badge": badge,
                          "is_featured": feat, "specs": specs, "order": i,
                          "description": f"{name} — genuine hardware with full support."},
            )

        projects = [
            ("Office CCTV Installation Project", "ABC Corporate Office", "Bahawalpur, Punjab",
             "Complete 16-camera CCTV setup with central monitoring for a corporate office."),
            ("Warehouse Networking Setup", "XYZ Logistics", "Multan, Punjab",
             "Structured cabling and enterprise networking for a logistics warehouse."),
            ("School Security System", "Greenfield School", "Bahawalpur, Punjab",
             "Full perimeter CCTV coverage and biometric access control for a school campus."),
        ]
        for i, (title, client, loc, desc) in enumerate(projects):
            Project.objects.get_or_create(
                title=title,
                defaults={"client_name": client, "location": loc, "description": desc,
                          "is_featured": True, "order": i, "category": "CCTV"},
            )

        testimonials = [
            ("Ahmed Raza", "text", "Excellent CCTV installation service. Very professional team and quick response."),
            ("Bilal Khan", "text", "They set up our entire office network. Great quality work and fair pricing."),
            ("Sara Malik", "text", "Highly recommended for security solutions. Very reliable after-sales support."),
        ]
        for i, (name, kind, body) in enumerate(testimonials):
            Testimonial.objects.get_or_create(
                name=name, defaults={"kind": kind, "body": body, "order": i},
            )

    def _seed_backgrounds(self):
        pages = [
            ("home", PageBackground.BgType.VIDEO),
            ("services", PageBackground.BgType.IMAGE),
            ("portfolio", PageBackground.BgType.PARALLAX),
            ("about", PageBackground.BgType.PARALLAX),
            ("contact", PageBackground.BgType.IMAGE),
        ]
        for key, bg in pages:
            PageBackground.objects.get_or_create(
                page_key=key, defaults={"bg_type": bg, "enabled": True, "is_published": True}
            )

        sections = [
            ("hero", "Hero Section"), ("services", "Services Overview"),
            ("why-us", "Why Choose Us"), ("projects", "Featured Projects"),
            ("testimonials", "Client Testimonials"), ("stats", "Company Statistics"),
            ("industries", "Industries Served"), ("cta", "Contact CTA"),
        ]
        for i, (key, title) in enumerate(sections):
            HomeSection.objects.get_or_create(
                key=key, defaults={"title": title, "order": i, "enabled": True}
            )
