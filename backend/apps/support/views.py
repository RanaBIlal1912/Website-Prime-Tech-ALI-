from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.accounts.permissions import HasModulePermission
from apps.audit.utils import log_action

from .models import Ticket, TicketReply
from .serializers import (
    PublicTicketSerializer,
    TicketReplySerializer,
    TicketSerializer,
)


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.filter(is_deleted=False).select_related(
        "assigned_to", "customer"
    ).prefetch_related("replies")
    serializer_class = TicketSerializer
    permission_classes = [HasModulePermission]
    required_module = "support"
    search_fields = ["ticket_number", "subject", "requester_name", "requester_email"]
    filterset_fields = ["status", "priority", "assigned_to"]
    ordering_fields = ["created_at", "priority"]

    def perform_update(self, serializer):
        ticket = serializer.save()
        if ticket.status in (Ticket.Status.COMPLETED, Ticket.Status.CLOSED) and not ticket.resolved_at:
            ticket.resolved_at = timezone.now()
            ticket.save(update_fields=["resolved_at"])
        log_action(self.request, "update", "Ticket", ticket.ticket_number)

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=True, methods=["get", "post"])
    def replies(self, request, pk=None):
        ticket = self.get_object()
        if request.method == "POST":
            serializer = TicketReplySerializer(data={**request.data, "ticket": ticket.id})
            serializer.is_valid(raise_exception=True)
            reply = serializer.save(author=request.user)
            return Response(TicketReplySerializer(reply).data, status=status.HTTP_201_CREATED)
        return Response(TicketReplySerializer(ticket.replies.all(), many=True).data)


class PublicTicketViewSet(viewsets.GenericViewSet):
    """Unauthenticated support request intake (throttled)."""

    serializer_class = PublicTicketSerializer
    permission_classes = [AllowAny]
    throttle_scope = "public_form"

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        log_action(request, "public_ticket_created", "Ticket", ticket.ticket_number)
        return Response(
            {"success": True, "ticket_number": ticket.ticket_number,
             "message": "Support request received. We'll be in touch."},
            status=status.HTTP_201_CREATED,
        )
