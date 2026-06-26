from django.contrib import admin

from .models import Activity, Customer, FollowUp, Lead, LeadNote


class LeadNoteInline(admin.TabularInline):
    model = LeadNote
    extra = 0


class FollowUpInline(admin.TabularInline):
    model = FollowUp
    extra = 0


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ["name", "status", "source", "assigned_to", "estimated_value", "created_at"]
    list_filter = ["status", "source", "city"]
    search_fields = ["name", "email", "phone", "company"]
    inlines = [LeadNoteInline, FollowUpInline]


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["name", "company", "customer_type", "city", "assigned_to"]
    list_filter = ["customer_type", "city"]
    search_fields = ["name", "company", "email", "phone"]


admin.site.register(Activity)
admin.site.register(FollowUp)
