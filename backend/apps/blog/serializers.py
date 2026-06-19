from rest_framework import serializers

from .models import Category, Post, Tag


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]
        read_only_fields = ["id", "slug"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]


class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    author_name = serializers.CharField(source="author.full_name", read_only=True)
    tags = serializers.SlugRelatedField(
        slug_field="slug", queryset=Tag.objects.all(), many=True, required=False
    )

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "excerpt", "content", "featured_image",
            "category", "category_name", "tags", "author", "author_name",
            "status", "published_at", "seo_title", "seo_description", "keywords",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "slug", "published_at", "created_at", "updated_at"]
