from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "client_name", "location", "completion_date", "is_published"]
    list_filter = ["is_published", "is_featured", "category"]
    search_fields = ["title", "client_name", "location"]
    prepopulated_fields = {"slug": ("title",)}
