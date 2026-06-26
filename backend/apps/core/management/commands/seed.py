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
from django.utils import timezone

from apps.accounts.models import ACTIONS, MODULES, Permission, Role, User
from apps.blog.models import Category as BlogCategory
from apps.blog.models import Post, Tag
from apps.catalog.models import Category, Product, Service, Testimonial
from apps.core.models import HomeSection, PageBackground, SeoSetting, SiteSetting
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
        self.stdout.write("Seeding homepage section content (hero/stats/why-us/industries/cta)…")
        self._seed_home_config()
        self.stdout.write("Seeding blog (categories/tags/posts)…")
        self._seed_blog()
        self.stdout.write("Seeding SEO defaults…")
        self._seed_seo()
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

    # ---------------------------------------------- homepage section content
    def _seed_home_config(self):
        """Populate the JSON `config` of each home section so the homepage is
        fully content-managed (no hard-coded copy in the frontend)."""
        configs = {
            "hero": {
                "badge": "Trusted IT & Security Partner Since 2018",
                "title": "Enterprise Security & IT Infrastructure",
                "highlight": "Built to Protect What Matters",
                "subtitle": (
                    "Prime Tech designs, installs and maintains CCTV, networking, "
                    "fiber optic, access control and biometric systems for homes and "
                    "businesses across Pakistan."
                ),
                "primary_cta": {"label": "Get a Free Quote", "href": "/contact"},
                "secondary_cta": {"label": "Request Site Survey", "href": "/contact"},
            },
            "stats": {
                "items": [
                    {"icon": "📹", "value": 500, "suffix": "+", "label": "Projects Completed"},
                    {"icon": "😀", "value": 300, "suffix": "+", "label": "Happy Clients"},
                    {"icon": "🏆", "value": 8, "suffix": "+", "label": "Years Experience"},
                    {"icon": "🛠️", "value": 24, "suffix": "/7", "label": "Support Available"},
                ]
            },
            "why-us": {
                "subtitle": "Why industry leaders choose Prime Tech",
                "items": [
                    {"icon": "🛡️", "title": "Certified Engineers",
                     "text": "Manufacturer-certified technicians for every install and integration."},
                    {"icon": "⚡", "title": "Fast Turnaround",
                     "text": "Most installations completed within 1–3 days with minimal disruption."},
                    {"icon": "🔧", "title": "End-to-End Support",
                     "text": "From site survey to AMC, a single accountable partner for the lifecycle."},
                    {"icon": "✅", "title": "Genuine Equipment",
                     "text": "Authentic, warranty-backed hardware from trusted global brands."},
                ],
            },
            "industries": {
                "subtitle": "Security & IT solutions tailored to your sector",
                "items": [
                    {"icon": "🏢", "name": "Corporate Offices"},
                    {"icon": "🏭", "name": "Factories & Warehouses"},
                    {"icon": "🏫", "name": "Schools & Campuses"},
                    {"icon": "🏥", "name": "Hospitals & Clinics"},
                    {"icon": "🏬", "name": "Retail & Shops"},
                    {"icon": "🏛️", "name": "Government"},
                ],
            },
            "cta": {
                "title": "Ready to Secure Your Business?",
                "subtitle": (
                    "Book a free site survey and consultation for CCTV, networking, "
                    "or access control. Limited slots available this month."
                ),
                "primary_cta": {"label": "Get Started", "href": "/contact"},
            },
        }
        for key, cfg in configs.items():
            section = HomeSection.objects.filter(key=key).first()
            if section and not section.config:
                section.config = cfg
                section.save(update_fields=["config", "updated_at"])

    # ----------------------------------------------------------------- blog
    def _seed_blog(self):
        admin = User.objects.filter(email="admin@primetech.pk").first()
        cat, _ = BlogCategory.objects.get_or_create(
            name="Security Insights",
            defaults={"description": "Expert guidance on CCTV, networking and physical security."},
        )
        guides, _ = BlogCategory.objects.get_or_create(
            name="Buying Guides",
            defaults={"description": "How to choose the right security and IT equipment."},
        )
        tag_names = ["CCTV", "Networking", "Access Control", "Biometrics", "Fiber Optic", "Tips"]
        tags = {n: Tag.objects.get_or_create(name=n)[0] for n in tag_names}

        posts = [
            {
                "title": "How to Choose the Right CCTV System for Your Business",
                "category": guides,
                "excerpt": "Resolution, night vision, storage and remote access — the four factors that "
                           "decide whether your CCTV investment actually protects your premises.",
                "tags": ["CCTV", "Tips"],
                "content": (
                    "<p>Selecting a CCTV system is one of the most important security decisions a "
                    "business can make. The right setup deters intruders, provides court-admissible "
                    "evidence, and gives owners genuine peace of mind.</p>"
                    "<h2>1. Resolution matters</h2>"
                    "<p>For most commercial sites, 4MP cameras strike the best balance between image "
                    "clarity and storage cost. Higher 4K resolution is ideal for entrances and tills "
                    "where facial detail is critical.</p>"
                    "<h2>2. Night vision &amp; low light</h2>"
                    "<p>Look for cameras with a 30m+ IR range and true WDR so footage remains usable "
                    "after dark and against bright backlight.</p>"
                    "<h2>3. Storage &amp; retention</h2>"
                    "<p>Plan for at least 30 days of retention. An 8-channel DVR with up to 10TB of "
                    "storage comfortably covers most small-to-medium installations.</p>"
                    "<h2>4. Remote viewing</h2>"
                    "<p>Modern systems stream securely to your phone. Prime Tech configures encrypted "
                    "remote access so you can check any camera, anywhere, at any time.</p>"
                    "<p>Need help speccing a system? <a href=\"/contact\">Request a free site survey.</a></p>"
                ),
            },
            {
                "title": "Structured Cabling: The Backbone of a Reliable Office Network",
                "category": cat,
                "excerpt": "Wi-Fi gets the attention, but it's the cabling behind the walls that "
                           "determines whether your network is fast, stable and future-proof.",
                "tags": ["Networking", "Fiber Optic"],
                "content": (
                    "<p>A network is only as reliable as the cabling it runs on. Cutting corners on "
                    "structured cabling leads to dropped connections, slow transfers and costly "
                    "rework down the line.</p>"
                    "<h2>Why Cat6 / fiber matters</h2>"
                    "<p>Cat6 supports gigabit speeds across the office, while fiber backbones connect "
                    "floors and buildings without signal loss. Together they create headroom for years "
                    "of growth.</p>"
                    "<h2>Certified installation</h2>"
                    "<p>Every Prime Tech cabling job is tested and certified, with labelled patch "
                    "panels and clean cable management for effortless future maintenance.</p>"
                    "<p><a href=\"/contact\">Talk to our networking team</a> about your premises.</p>"
                ),
            },
            {
                "title": "Biometric Access Control vs. Traditional Locks",
                "category": cat,
                "excerpt": "Keys get copied and lost. Biometric and card-based access control give you "
                           "audit trails, instant revocation and true accountability.",
                "tags": ["Access Control", "Biometrics"],
                "content": (
                    "<p>Physical keys are a security liability: they can be duplicated, lost, or passed "
                    "on without your knowledge. Biometric access control eliminates these risks.</p>"
                    "<h2>Accountability by design</h2>"
                    "<p>Every entry is logged against an identity. If an incident occurs, you have a "
                    "precise, time-stamped record of who accessed what and when.</p>"
                    "<h2>Instant control</h2>"
                    "<p>Revoke a departed employee's access in seconds — no lock changes, no reissued "
                    "keys. Pair fingerprint or face recognition with attendance for a complete solution.</p>"
                    "<p><a href=\"/contact\">Upgrade your entry security</a> with Prime Tech.</p>"
                ),
            },
        ]
        for i, p in enumerate(posts):
            post, created = Post.objects.get_or_create(
                title=p["title"],
                defaults={
                    "category": p["category"],
                    "excerpt": p["excerpt"],
                    "content": p["content"],
                    "author": admin,
                    "status": "published",
                    "published_at": timezone.now(),
                    "seo_title": p["title"],
                    "seo_description": p["excerpt"],
                },
            )
            if created:
                post.tags.set([tags[t] for t in p["tags"]])

    # ------------------------------------------------------------------ seo
    def _seed_seo(self):
        defaults = [
            ("/", "Prime Tech — Security & IT Solutions in Pakistan",
             "Professional CCTV, networking, fiber optic, access control and biometric "
             "solutions for homes and businesses across Pakistan."),
            ("/services", "Our Services — Prime Tech",
             "CCTV installation, networking, server setup, access control, biometrics and AMC."),
            ("/products", "Products — Prime Tech",
             "Genuine CCTV cameras, DVRs, network switches and routers with full support."),
            ("/portfolio", "Portfolio — Prime Tech",
             "Explore Prime Tech's completed CCTV, networking and security projects."),
            ("/blog", "Blog — Prime Tech",
             "Security insights, buying guides and expert tips from the Prime Tech team."),
            ("/contact", "Contact Prime Tech",
             "Get a free quote or site survey for your security and IT needs."),
        ]
        for path, title, desc in defaults:
            SeoSetting.objects.get_or_create(
                path=path,
                defaults={"meta_title": title, "meta_description": desc,
                          "og_title": title, "og_description": desc,
                          "keywords": "CCTV, networking, security, access control, "
                                      "biometrics, fiber optic, Bahawalpur, Pakistan"},
            )
