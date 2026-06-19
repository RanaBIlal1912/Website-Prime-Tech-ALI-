from rest_framework.routers import DefaultRouter

from .views import (
    ActivityViewSet,
    CustomerViewSet,
    FollowUpViewSet,
    LeadViewSet,
    PublicLeadViewSet,
)

router = DefaultRouter()
router.register("customers", CustomerViewSet, basename="customer")
router.register("leads", LeadViewSet, basename="lead")
router.register("followups", FollowUpViewSet, basename="followup")
router.register("activities", ActivityViewSet, basename="activity")
router.register("public/leads", PublicLeadViewSet, basename="public-lead")

urlpatterns = router.urls
