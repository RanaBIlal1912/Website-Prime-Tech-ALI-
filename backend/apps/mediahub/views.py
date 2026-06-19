from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from apps.accounts.permissions import HasModulePermission
from apps.audit.utils import log_action

from .models import MediaFile, MediaFolder
from .serializers import MediaFileSerializer, MediaFolderSerializer


class MediaFolderViewSet(viewsets.ModelViewSet):
    queryset = MediaFolder.objects.filter(is_deleted=False)
    serializer_class = MediaFolderSerializer
    permission_classes = [HasModulePermission]
    required_module = "media"
    filterset_fields = ["parent"]
    search_fields = ["name"]


class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.filter(is_deleted=False).select_related("folder")
    serializer_class = MediaFileSerializer
    permission_classes = [HasModulePermission]
    required_module = "media"
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ["kind", "folder"]
    search_fields = ["title", "alt_text"]
    ordering_fields = ["created_at", "size"]

    def perform_create(self, serializer):
        media = serializer.save()
        log_action(self.request, "upload", "MediaFile", media.id)

    def perform_destroy(self, instance):
        instance.soft_delete()
        log_action(self.request, "delete", "MediaFile", instance.id)

    @action(detail=False, methods=["post"], url_path="bulk-upload")
    def bulk_upload(self, request):
        """Accept multiple files in a single multipart request (key: ``files``)."""
        files = request.FILES.getlist("files")
        if not files:
            return Response({"detail": "No files provided."}, status=status.HTTP_400_BAD_REQUEST)
        created, errors = [], []
        for f in files:
            serializer = self.get_serializer(data={"file": f, "title": f.name})
            if serializer.is_valid():
                serializer.save()
                created.append(serializer.data)
            else:
                errors.append({"file": f.name, "errors": serializer.errors})
        log_action(request, "bulk_upload", "MediaFile", f"{len(created)} files")
        return Response(
            {"created": created, "errors": errors},
            status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST,
        )
