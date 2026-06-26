from rest_framework import serializers

from .models import Quotation, QuotationItem


class QuotationItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = QuotationItem
        fields = [
            "id", "description", "product", "service",
            "quantity", "unit_price", "line_total", "order",
        ]
        read_only_fields = ["id", "line_total"]


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True)
    subtotal = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True)

    class Meta:
        model = Quotation
        fields = [
            "id", "number", "customer", "lead",
            "customer_name", "customer_email", "customer_phone", "customer_address",
            "status", "issue_date", "valid_until", "notes", "terms", "currency",
            "tax_percent", "discount_percent",
            "subtotal", "discount_amount", "tax_amount", "total",
            "items", "created_by", "created_by_name", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "number", "issue_date", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        items = validated_data.pop("items", [])
        quotation = Quotation.objects.create(**validated_data)
        for item in items:
            QuotationItem.objects.create(quotation=quotation, **item)
        return quotation

    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items is not None:
            # Replace the line items wholesale (simplest correct semantics).
            instance.items.all().delete()
            for item in items:
                QuotationItem.objects.create(quotation=instance, **item)
        return instance
