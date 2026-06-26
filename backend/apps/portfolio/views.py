from rest_framework import viewsets

from apps.accounts.permissions import HasModulePermission

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.filter(is_deleted=False)
    serializer_class = ProjectSerializer
    permission_classes = [HasModulePermission]
    required_module = "portfolio"
    public_actions = ["list", "retrieve"]
    filterset_fields = ["is_published", "is_featured", "category"]
    search_fields = ["title", "client_name", "location", "description"]
    ordering_fields = ["order", "completion_date", "created_at"]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action in self.public_actions and not (
            self.request.user and self.request.user.is_authenticated
        ):
            qs = qs.filter(is_published=True)
        return qs

    def perform_destroy(self, instance):
        instance.soft_delete()
