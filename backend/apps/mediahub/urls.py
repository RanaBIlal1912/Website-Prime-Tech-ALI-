from rest_framework.routers import DefaultRouter

from .views import MediaFileViewSet, MediaFolderViewSet

router = DefaultRouter()
router.register("folders", MediaFolderViewSet, basename="media-folder")
router.register("files", MediaFileViewSet, basename="media-file")

urlpatterns = router.urls
