from rest_framework.routers import DefaultRouter

from .views import BlogCategoryViewSet, PostViewSet, TagViewSet

router = DefaultRouter()
router.register("categories", BlogCategoryViewSet, basename="blog-category")
router.register("tags", TagViewSet, basename="blog-tag")
router.register("posts", PostViewSet, basename="post")

urlpatterns = router.urls
