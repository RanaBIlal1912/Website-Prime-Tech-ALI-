from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.decorators import action

from apps.accounts.permissions import HasModulePermission
from apps.audit.utils import log_action

from .models import Quotation
from .pdf import render_quotation_pdf
from .serializers import QuotationSerializer


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.filter(is_deleted=False).prefetch_related(
        "items"
    ).select_related("customer", "created_by")
    serializer_class = QuotationSerializer
    permission_classes = [HasModulePermission]
    required_module = "quotations"
    search_fields = ["number", "customer_name", "customer_email"]
    filterset_fields = ["status", "customer"]
    ordering_fields = ["created_at", "issue_date"]

    def perform_create(self, serializer):
        q = serializer.save(created_by=self.request.user)
        log_action(self.request, "create", "Quotation", q.number)

    def perform_update(self, serializer):
        q = serializer.save()
        log_action(self.request, "update", "Quotation", q.number)

    def perform_destroy(self, instance):
        instance.soft_delete()
        log_action(self.request, "delete", "Quotation", instance.number)

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        """Download the quotation as a PDF (also used for the print option)."""
        quotation = self.get_object()
        buffer = render_quotation_pdf(quotation)
        log_action(request, "export_pdf", "Quotation", quotation.number)
        return FileResponse(
            buffer, as_attachment=True, filename=f"{quotation.number}.pdf",
            content_type="application/pdf",
        )
