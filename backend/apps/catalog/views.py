from rest_framework import viewsets

from apps.accounts.permissions import HasModulePermission

from .models import Category, Product, Service, Testimonial
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ServiceSerializer,
    TestimonialSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategorySerializer
    permission_classes = [HasModulePermission]
    required_module = "services"
    public_actions = ["list", "retrieve"]
    filterset_fields = ["kind"]
    search_fields = ["name"]
    lookup_field = "slug"

    def perform_destroy(self, instance):
        instance.soft_delete()


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_deleted=False).select_related("category")
    serializer_class = ServiceSerializer
    permission_classes = [HasModulePermission]
    required_module = "services"
    public_actions = ["list", "retrieve"]
    filterset_fields = ["is_published", "is_featured", "category"]
    search_fields = ["title", "short_desc", "description"]
    ordering_fields = ["order", "created_at"]
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


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_deleted=False).select_related("category")
    serializer_class = ProductSerializer
    permission_classes = [HasModulePermission]
    required_module = "products"
    public_actions = ["list", "retrieve"]
    filterset_fields = ["is_published", "is_featured", "category", "stock_status"]
    search_fields = ["name", "description"]
    ordering_fields = ["order", "price", "created_at"]
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


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(is_deleted=False)
    serializer_class = TestimonialSerializer
    permission_classes = [HasModulePermission]
    required_module = "testimonials"
    public_actions = ["list", "retrieve"]
    filterset_fields = ["is_published", "kind"]

    def perform_destroy(self, instance):
        instance.soft_delete()
