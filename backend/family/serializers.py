from rest_framework import serializers
from .models import Family, FamilyMember


class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ["id", "family", "full_name", "relationship", "avatar", "created_at"]
        read_only_fields = ["id", "family", "created_at"]


class FamilySerializer(serializers.ModelSerializer):
    members = FamilyMemberSerializer(many=True, read_only=True)
    owner_email = serializers.EmailField(source="owner.email", read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = [
            "id",
            "family_name",
            "owner_email",
            "member_count",
            "members",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner_email", "member_count", "members", "created_at", "updated_at"]

    def get_member_count(self, obj):
        return obj.members.count()

    def validate_family_name(self, value):
        """Prevent duplicate family names for the same owner."""
        request = self.context.get("request")
        if not request:
            return value

        owner = request.user
        qs = Family.objects.filter(owner=owner, family_name__iexact=value)

        # On update, exclude the current instance
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "You already have a family with this name."
            )
        return value
