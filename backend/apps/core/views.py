from django.db import connection
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.accounts.permissions import HasModulePermission

from .models import HomeSection, PageBackground, SeoSetting, SiteSetting
from .serializers import (
    HomeSectionSerializer,
    PageBackgroundSerializer,
    SeoSettingSerializer,
    SiteSettingSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """Liveness/readiness probe — verifies DB connectivity."""
    db_ok = True
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:
        db_ok = False
    return Response({"status": "ok" if db_ok else "degraded", "database": db_ok})


class SiteSettingViewSet(viewsets.ModelViewSet):
    """Singleton site settings; public can GET, only cms.update can write."""

    serializer_class = SiteSettingSerializer
    permission_classes = [HasModulePermission]
    required_module = "cms"
    public_actions = ["list", "retrieve"]

    def get_queryset(self):
        return SiteSetting.objects.filter(pk=1)

    def get_object(self):
        return SiteSetting.load()


class SeoSettingViewSet(viewsets.ModelViewSet):
    queryset = SeoSetting.objects.filter(is_deleted=False)
    serializer_class = SeoSettingSerializer
    permission_classes = [HasModulePermission]
    required_module = "cms"
    public_actions = ["list", "retrieve"]
    lookup_field = "path"
    lookup_value_regex = ".+"


class PageBackgroundViewSet(viewsets.ModelViewSet):
    queryset = PageBackground.objects.filter(is_deleted=False)
    serializer_class = PageBackgroundSerializer
    permission_classes = [HasModulePermission]
    required_module = "cms"
    public_actions = ["list", "retrieve"]
    lookup_field = "page_key"


class HomeSectionViewSet(viewsets.ModelViewSet):
    queryset = HomeSection.objects.filter(is_deleted=False)
    serializer_class = HomeSectionSerializer
    permission_classes = [HasModulePermission]
    required_module = "cms"
    public_actions = ["list", "retrieve"]
