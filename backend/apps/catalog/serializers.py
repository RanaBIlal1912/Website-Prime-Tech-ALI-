from rest_framework import serializers

from .models import Category, Product, Service, Testimonial


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ["id", "slug", "created_at", "updated_at", "is_deleted", "deleted_at"]


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ["id", "slug", "created_at", "updated_at", "is_deleted", "deleted_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["id", "slug", "created_at", "updated_at", "is_deleted", "deleted_at"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "is_deleted", "deleted_at"]
