from django.contrib import admin

from .models import Category, Product, Service, Testimonial


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "kind", "order"]
    list_filter = ["kind"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "is_published", "is_featured", "order"]
    list_filter = ["is_published", "is_featured", "category"]
    search_fields = ["title"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price_label", "stock_status", "is_published"]
    list_filter = ["is_published", "category", "stock_status"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["name", "kind", "rating", "is_published"]
    list_filter = ["kind", "is_published"]
