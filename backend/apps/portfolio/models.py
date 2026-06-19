"""Portfolio / completed projects."""
from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel


class Project(TimeStampedModel):
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)

    client_name = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=150, blank=True)
    completion_date = models.DateField(null=True, blank=True)

    category = models.CharField(max_length=80, blank=True)  # CCTV, Networking...
    featured_image = models.CharField(max_length=500, blank=True)
    gallery = models.JSONField(default=list, blank=True)
    videos = models.JSONField(default=list, blank=True)     # youtube ids / urls
    before_image = models.CharField(max_length=500, blank=True)
    after_image = models.CharField(max_length=500, blank=True)

    background_image = models.CharField(max_length=500, blank=True)
    background_video = models.CharField(max_length=500, blank=True)

    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta(TimeStampedModel.Meta):
        ordering = ["order", "-completion_date", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
