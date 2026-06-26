"""Root URL configuration for the Prime Tech platform API."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from apps.core.views import health_check

api_v1 = [
    path("auth/", include("apps.accounts.urls")),
    path("crm/", include("apps.crm.urls")),
    path("quotations/", include("apps.quotations.urls")),
    path("catalog/", include("apps.catalog.urls")),
    path("portfolio/", include("apps.portfolio.urls")),
    path("blog/", include("apps.blog.urls")),
    path("support/", include("apps.support.urls")),
    path("media-library/", include("apps.mediahub.urls")),
    path("audit/", include("apps.audit.urls")),
    path("cms/", include("apps.core.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health"),
    path("api/v1/", include((api_v1, "api"), namespace="v1")),
    # OpenAPI schema & docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
