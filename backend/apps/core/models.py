"""Shared base models and site-wide CMS configuration."""
import uuid

from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    """Abstract base: UUID pk, created/updated timestamps, soft-delete support."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at", "updated_at"])

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=["is_deleted", "deleted_at", "updated_at"])


class SiteSetting(models.Model):
    """Singleton holding global site/brand configuration (replaces legacy settings blob)."""

    # Brand / general
    site_title = models.CharField(max_length=200, default="Prime Tech")
    tagline = models.CharField(max_length=200, default="Your Security, Our Priority")
    logo = models.CharField(max_length=500, blank=True)
    favicon = models.CharField(max_length=500, blank=True)
    footer_text = models.CharField(
        max_length=300, default="© Prime Tech. All Rights Reserved."
    )
    company_desc = models.TextField(blank=True)

    # Contact
    whatsapp = models.CharField(max_length=30, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=300, blank=True)
    map_embed = models.URLField(max_length=600, blank=True)

    # Social
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    tiktok = models.URLField(blank=True)

    # Theme tokens (preserved from legacy design system)
    primary_color = models.CharField(max_length=20, default="#00aaff")
    secondary_color = models.CharField(max_length=20, default="#7b2ff7")
    accent_color = models.CharField(max_length=20, default="#00ffc8")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Setting"

    def __str__(self):
        return self.site_title

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce singleton
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SeoSetting(TimeStampedModel):
    """Per-path SEO overrides: meta, OG, Twitter, canonical, structured-data flags."""

    path = models.CharField(max_length=200, unique=True, help_text="e.g. /, /services")
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    keywords = models.CharField(max_length=400, blank=True)
    canonical_url = models.URLField(blank=True)
    og_title = models.CharField(max_length=200, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.CharField(max_length=500, blank=True)
    twitter_card = models.CharField(max_length=40, default="summary_large_image")
    robots = models.CharField(max_length=60, default="index,follow")
    structured_data = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"SEO {self.path}"


class PageBackground(TimeStampedModel):
    """Admin-managed background config for a page (the spec's per-page background system)."""

    class BgType(models.TextChoices):
        IMAGE = "image", "Static Image"
        ANIMATED = "animated", "Animated Image"
        VIDEO = "video", "Background Video"
        GRADIENT = "gradient", "Gradient"
        PARALLAX = "parallax", "Parallax"
        DEFAULT = "default", "Default Theme"

    page_key = models.CharField(
        max_length=60, unique=True, help_text="home | services | portfolio | about | contact ..."
    )
    enabled = models.BooleanField(default=True)
    bg_type = models.CharField(max_length=20, choices=BgType.choices, default=BgType.DEFAULT)
    image_url = models.CharField(max_length=500, blank=True)
    video_url = models.CharField(max_length=500, blank=True)
    gradient_css = models.CharField(max_length=300, blank=True)
    overlay_opacity = models.FloatField(default=0.4)
    is_published = models.BooleanField(default=True, help_text="Unpublished = preview only")

    def __str__(self):
        return f"{self.page_key} [{self.bg_type}]"


class HomeSection(TimeStampedModel):
    """Orderable, toggleable homepage sections (live page-builder backing store)."""

    key = models.CharField(max_length=60, unique=True)
    title = models.CharField(max_length=120)
    enabled = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    config = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.order}. {self.title}"
