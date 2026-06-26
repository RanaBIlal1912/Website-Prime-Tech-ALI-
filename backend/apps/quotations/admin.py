from django.contrib import admin

from .models import Quotation, QuotationItem


class QuotationItemInline(admin.TabularInline):
    model = QuotationItem
    extra = 1


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ["number", "customer_name", "status", "total", "issue_date"]
    list_filter = ["status"]
    search_fields = ["number", "customer_name", "customer_email"]
    readonly_fields = ["number"]
    inlines = [QuotationItemInline]
