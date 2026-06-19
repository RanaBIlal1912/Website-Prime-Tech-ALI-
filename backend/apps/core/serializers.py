from rest_framework import serializers

from .models import HomeSection, PageBackground, SeoSetting, SiteSetting


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        exclude = ()
        read_only_fields = ["updated_at"]


class SeoSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeoSetting
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "is_deleted", "deleted_at"]


class PageBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageBackground
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "is_deleted", "deleted_at"]


class HomeSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeSection
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "is_deleted", "deleted_at"]
