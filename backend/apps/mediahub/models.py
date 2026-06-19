"""Media Library: folders + files with type detection and usage tracking.

Files are saved through Django's configured storage backend (Local / S3 / R2 /
GCS / Spaces / Azure — selected in settings), so the same model works on any provider.
"""
from django.db import models

from apps.core.models import TimeStampedModel

IMAGE_EXT = {"jpg", "jpeg", "png", "webp", "svg", "gif"}
VIDEO_EXT = {"mp4", "webm", "mov"}
DOC_EXT = {"pdf", "docx", "xlsx", "doc", "xls"}


class MediaFolder(TimeStampedModel):
    name = models.CharField(max_length=120)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="children"
    )

    class Meta(TimeStampedModel.Meta):
        ordering = ["name"]

    def __str__(self):
        return self.name


class MediaFile(TimeStampedModel):
    class Kind(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        DOCUMENT = "document", "Document"
        OTHER = "other", "Other"

    file = models.FileField(upload_to="library/%Y/%m/")
    title = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    kind = models.CharField(max_length=12, choices=Kind.choices, default=Kind.OTHER)
    folder = models.ForeignKey(
        MediaFolder, null=True, blank=True, on_delete=models.SET_NULL, related_name="files"
    )
    tags = models.JSONField(default=list, blank=True)
    size = models.PositiveBigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    usage_count = models.PositiveIntegerField(default=0)

    def detect_kind(self):
        ext = (self.file.name.rsplit(".", 1)[-1] if "." in self.file.name else "").lower()
        if ext in IMAGE_EXT:
            return self.Kind.IMAGE
        if ext in VIDEO_EXT:
            return self.Kind.VIDEO
        if ext in DOC_EXT:
            return self.Kind.DOCUMENT
        return self.Kind.OTHER

    def __str__(self):
        return self.title or self.file.name
