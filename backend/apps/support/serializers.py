from rest_framework import serializers

from .models import Ticket, TicketReply


class TicketReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = TicketReply
        fields = ["id", "ticket", "author", "author_name", "body", "is_internal", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class TicketSerializer(serializers.ModelSerializer):
    replies = TicketReplySerializer(many=True, read_only=True)
    assigned_to_name = serializers.CharField(source="assigned_to.full_name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id", "ticket_number", "subject", "description",
            "requester_name", "requester_email", "requester_phone", "customer",
            "status", "status_display", "priority", "assigned_to", "assigned_to_name",
            "resolution", "resolved_at", "replies", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "ticket_number", "resolved_at", "created_at", "updated_at"]


class PublicTicketSerializer(serializers.ModelSerializer):
    """Public support request intake."""

    class Meta:
        model = Ticket
        fields = ["subject", "description", "requester_name", "requester_email", "requester_phone"]
