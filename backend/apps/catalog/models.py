"""Services, Products and Testimonials (public website catalogue)."""
from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel


class Category(TimeStampedModel):
    """Shared category for services/products with full media + SEO support."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    kind = models.CharField(
        max_length=20,
        choices=[("service", "Service"), ("product", "Product")],
        default="product",
    )
    description = models.TextField(blank=True)
    featured_image = models.CharField(max_length=500, blank=True)
    banner_image = models.CharField(max_length=500, blank=True)
    background_image = models.CharField(max_length=500, blank=True)
    background_video = models.CharField(max_length=500, blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta(TimeStampedModel.Meta):
        ordering = ["order", "name"]
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Service(TimeStampedModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    icon = models.CharField(max_length=20, blank=True)  # emoji/icon key
    short_desc = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    benefits = models.JSONField(default=list, blank=True)   # ["...", "..."]
    faqs = models.JSONField(default=list, blank=True)       # [{"q":..,"a":..}]

    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="services"
    )
    featured_image = models.CharField(max_length=500, blank=True)
    banner_image = models.CharField(max_length=500, blank=True)
    background_image = models.CharField(max_length=500, blank=True)
    background_video = models.CharField(max_length=500, blank=True)
    gallery = models.JSONField(default=list, blank=True)

    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)

    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta(TimeStampedModel.Meta):
        ordering = ["order", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Product(TimeStampedModel):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="products"
    )
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    price_label = models.CharField(max_length=60, blank=True)  # e.g. "Rs. 5,500"
    badge = models.CharField(max_length=40, blank=True)        # "Best Seller"
    description = models.TextField(blank=True)
    specs = models.JSONField(default=list, blank=True)         # [{"key":..,"value":..}]

    featured_image = models.CharField(max_length=500, blank=True)
    gallery = models.JSONField(default=list, blank=True)
    video = models.CharField(max_length=500, blank=True)

    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    stock_status = models.CharField(
        max_length=20,
        choices=[("in_stock", "In Stock"), ("out", "Out of Stock"), ("order", "On Order")],
        default="in_stock",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta(TimeStampedModel.Meta):
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Testimonial(TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    avatar = models.CharField(max_length=500, blank=True)
    kind = models.CharField(
        max_length=10, choices=[("text", "Text"), ("video", "Video")], default="text"
    )
    body = models.TextField(blank=True)
    video = models.CharField(max_length=500, blank=True)  # youtube id / url
    rating = models.PositiveSmallIntegerField(default=5)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta(TimeStampedModel.Meta):
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.name
