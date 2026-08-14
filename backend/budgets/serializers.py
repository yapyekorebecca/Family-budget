from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["id", "category", "amount", "month", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Budget amount must be greater than zero.")
        return value

    def validate_month(self, value):
        import re
        if not re.match(r"^\d{4}-(0[1-9]|1[0-2])$", value):
            raise serializers.ValidationError("Month must be in YYYY-MM format (e.g. 2026-08).")
        return value

    def validate(self, data):
        """Prevent duplicate category+month for the same user."""
        request = self.context.get("request")
        if not request:
            return data

        category = data.get("category", getattr(self.instance, "category", None))
        month = data.get("month", getattr(self.instance, "month", None))

        qs = Budget.objects.filter(user=request.user, category=category, month=month)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                f"You already have a budget for {category} in {month}."
            )
        return data
