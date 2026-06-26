from rest_framework import viewsets

from apps.accounts.permissions import HasModulePermission

from .models import Category, Post, Tag
from .serializers import BlogCategorySerializer, PostSerializer, TagSerializer


class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = BlogCategorySerializer
    permission_classes = [HasModulePermission]
    required_module = "blog"
    public_actions = ["list", "retrieve"]
    lookup_field = "slug"

    def perform_destroy(self, instance):
        instance.soft_delete()


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.filter(is_deleted=False)
    serializer_class = TagSerializer
    permission_classes = [HasModulePermission]
    required_module = "blog"
    public_actions = ["list", "retrieve"]
    lookup_field = "slug"


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(is_deleted=False).select_related(
        "category", "author"
    ).prefetch_related("tags")
    serializer_class = PostSerializer
    permission_classes = [HasModulePermission]
    required_module = "blog"
    public_actions = ["list", "retrieve"]
    filterset_fields = ["status", "category"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["published_at", "created_at"]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        # The public sees only published posts; authenticated staff see drafts too.
        if self.action in self.public_actions and not (
            self.request.user and self.request.user.is_authenticated
        ):
            qs = qs.filter(status=Post.Status.PUBLISHED)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_destroy(self, instance):
        instance.soft_delete()
