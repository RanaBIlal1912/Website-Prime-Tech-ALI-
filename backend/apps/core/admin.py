from django.contrib import admin

from .models import HomeSection, PageBackground, SeoSetting, SiteSetting


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ["site_title", "tagline", "phone", "email"]


@admin.register(SeoSetting)
class SeoSettingAdmin(admin.ModelAdmin):
    list_display = ["path", "meta_title", "robots"]
    search_fields = ["path", "meta_title"]


@admin.register(PageBackground)
class PageBackgroundAdmin(admin.ModelAdmin):
    list_display = ["page_key", "bg_type", "enabled", "is_published"]
    list_filter = ["bg_type", "enabled", "is_published"]


@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ["title", "key", "order", "enabled"]
    list_display_links = ["title"]
    list_editable = ["order", "enabled"]
