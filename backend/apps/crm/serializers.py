from rest_framework import serializers

from .models import Activity, Customer, FollowUp, Lead, LeadNote


class CustomerSerializer(serializers.ModelSerializer):
    lead_count = serializers.IntegerField(source="leads.count", read_only=True)
    assigned_to_name = serializers.CharField(source="assigned_to.full_name", read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id", "name", "company", "email", "phone", "whatsapp", "customer_type",
            "address", "city", "notes", "assigned_to", "assigned_to_name",
            "lead_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class LeadNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = LeadNote
        fields = ["id", "lead", "author", "author_name", "body", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class FollowUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUp
        fields = ["id", "lead", "due_at", "note", "status", "assigned_to", "created_at"]
        read_only_fields = ["id", "created_at"]


class ActivitySerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.full_name", read_only=True)

    class Meta:
        model = Activity
        fields = ["id", "lead", "actor", "actor_name", "verb", "description", "meta", "created_at"]
        read_only_fields = fields


class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source="assigned_to.full_name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    source_display = serializers.CharField(source="get_source_display", read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    lead_notes = LeadNoteSerializer(many=True, read_only=True)
    followups = FollowUpSerializer(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id", "name", "email", "phone", "company", "service_interest", "message",
            "source", "source_display", "status", "status_display", "estimated_value",
            "assigned_to", "assigned_to_name", "customer", "city",
            "activities", "lead_notes", "followups", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class LeadListSerializer(serializers.ModelSerializer):
    """Lighter representation for list views (no nested timeline)."""

    assigned_to_name = serializers.CharField(source="assigned_to.full_name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id", "name", "email", "phone", "company", "service_interest",
            "source", "status", "status_display", "estimated_value",
            "assigned_to", "assigned_to_name", "city", "created_at",
        ]


class PublicLeadSerializer(serializers.ModelSerializer):
    """Public website intake — restricted writable fields, source forced to website."""

    class Meta:
        model = Lead
        fields = ["name", "email", "phone", "company", "service_interest", "message", "city"]

    def create(self, validated_data):
        validated_data["source"] = Lead.Source.WEBSITE
        validated_data["status"] = Lead.Status.NEW
        return super().create(validated_data)
