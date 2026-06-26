from django.contrib import admin

from .models import MediaFile, MediaFolder


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ["title", "kind", "folder", "size", "usage_count", "created_at"]
    list_filter = ["kind", "folder"]
    search_fields = ["title", "alt_text"]


admin.site.register(MediaFolder)
