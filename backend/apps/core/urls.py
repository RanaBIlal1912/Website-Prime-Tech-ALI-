from rest_framework.routers import DefaultRouter

from .views import (
    HomeSectionViewSet,
    PageBackgroundViewSet,
    SeoSettingViewSet,
    SiteSettingViewSet,
)

router = DefaultRouter()
router.register("settings", SiteSettingViewSet, basename="site-setting")
router.register("seo", SeoSettingViewSet, basename="seo-setting")
router.register("backgrounds", PageBackgroundViewSet, basename="page-background")
router.register("home-sections", HomeSectionViewSet, basename="home-section")

urlpatterns = router.urls
