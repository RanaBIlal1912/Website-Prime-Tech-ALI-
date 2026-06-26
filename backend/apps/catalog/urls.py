from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    ProductViewSet,
    ServiceViewSet,
    TestimonialViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("services", ServiceViewSet, basename="service")
router.register("products", ProductViewSet, basename="product")
router.register("testimonials", TestimonialViewSet, basename="testimonial")

urlpatterns = router.urls
