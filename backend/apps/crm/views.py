from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.accounts.permissions import HasModulePermission
from apps.audit.utils import log_action

from .models import Activity, Customer, FollowUp, Lead, LeadNote
from .serializers import (
    ActivitySerializer,
    CustomerSerializer,
    FollowUpSerializer,
    LeadListSerializer,
    LeadNoteSerializer,
    LeadSerializer,
    PublicLeadSerializer,
)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.filter(is_deleted=False).select_related("assigned_to")
    serializer_class = CustomerSerializer
    permission_classes = [HasModulePermission]
    required_module = "customers"
    search_fields = ["name", "company", "email", "phone"]
    filterset_fields = ["customer_type", "city", "assigned_to"]
    ordering_fields = ["created_at", "name"]

    def perform_destroy(self, instance):
        instance.soft_delete()


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.filter(is_deleted=False).select_related(
        "assigned_to", "customer"
    ).prefetch_related("activities", "lead_notes", "followups")
    permission_classes = [HasModulePermission]
    required_module = "leads"
    search_fields = ["name", "email", "phone", "company", "service_interest"]
    filterset_fields = ["status", "source", "assigned_to", "city"]
    ordering_fields = ["created_at", "estimated_value", "status"]

    def get_serializer_class(self):
        return LeadListSerializer if self.action == "list" else LeadSerializer

    def perform_create(self, serializer):
        lead = serializer.save()
        Activity.objects.create(
            lead=lead, actor=self.request.user, verb="created",
            description=f"Lead created (source: {lead.get_source_display()})",
        )
        log_action(self.request, "create", "Lead", lead.id)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        lead = serializer.save()
        if "status" in serializer.validated_data and lead.status != old_status:
            Activity.objects.create(
                lead=lead, actor=self.request.user, verb="status_changed",
                description=f"{old_status} → {lead.status}",
                meta={"from": old_status, "to": lead.status},
            )
        log_action(self.request, "update", "Lead", lead.id)

    def perform_destroy(self, instance):
        instance.soft_delete()
        log_action(self.request, "delete", "Lead", instance.id)

    # ---- nested timeline actions ----
    @action(detail=True, methods=["get", "post"])
    def notes(self, request, pk=None):
        lead = self.get_object()
        if request.method == "POST":
            serializer = LeadNoteSerializer(data={**request.data, "lead": lead.id})
            serializer.is_valid(raise_exception=True)
            note = serializer.save(author=request.user)
            Activity.objects.create(
                lead=lead, actor=request.user, verb="note_added", description="Note added"
            )
            return Response(LeadNoteSerializer(note).data, status=status.HTTP_201_CREATED)
        qs = lead.lead_notes.all()
        return Response(LeadNoteSerializer(qs, many=True).data)

    @action(detail=True, methods=["get", "post"])
    def followups(self, request, pk=None):
        lead = self.get_object()
        if request.method == "POST":
            serializer = FollowUpSerializer(data={**request.data, "lead": lead.id})
            serializer.is_valid(raise_exception=True)
            fu = serializer.save()
            Activity.objects.create(
                lead=lead, actor=request.user, verb="followup_scheduled",
                description=f"Follow-up scheduled for {fu.due_at:%Y-%m-%d %H:%M}",
            )
            return Response(FollowUpSerializer(fu).data, status=status.HTTP_201_CREATED)
        return Response(FollowUpSerializer(lead.followups.all(), many=True).data)

    @action(detail=True, methods=["get"])
    def timeline(self, request, pk=None):
        lead = self.get_object()
        return Response(ActivitySerializer(lead.activities.all(), many=True).data)


class FollowUpViewSet(viewsets.ModelViewSet):
    queryset = FollowUp.objects.select_related("lead", "assigned_to").all()
    serializer_class = FollowUpSerializer
    permission_classes = [HasModulePermission]
    required_module = "crm"
    filterset_fields = ["status", "assigned_to", "lead"]
    ordering_fields = ["due_at"]


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Activity.objects.select_related("actor", "lead").all()
    serializer_class = ActivitySerializer
    permission_classes = [HasModulePermission]
    required_module = "crm"
    filterset_fields = ["lead", "verb"]


class PublicLeadViewSet(viewsets.GenericViewSet):
    """Unauthenticated website lead intake (throttled)."""

    serializer_class = PublicLeadSerializer
    permission_classes = [AllowAny]
    throttle_scope = "public_form"

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        Activity.objects.create(
            lead=lead, verb="created", description="Submitted via website form"
        )
        log_action(request, "public_lead_created", "Lead", lead.id)
        return Response(
            {"success": True, "message": "Thank you — our team will contact you shortly."},
            status=status.HTTP_201_CREATED,
        )
