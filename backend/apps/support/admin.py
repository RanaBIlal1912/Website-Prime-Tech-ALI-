from django.contrib import admin

from .models import Ticket, TicketReply


class TicketReplyInline(admin.TabularInline):
    model = TicketReply
    extra = 0


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ["ticket_number", "subject", "status", "priority", "assigned_to", "created_at"]
    list_filter = ["status", "priority"]
    search_fields = ["ticket_number", "subject", "requester_email"]
    readonly_fields = ["ticket_number"]
    inlines = [TicketReplyInline]
