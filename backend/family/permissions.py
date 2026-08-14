from rest_framework.permissions import BasePermission


class IsFamilyOwner(BasePermission):
    """
    Object-level permission: only the family owner can modify the family or its members.
    """
    message = "You do not have permission to manage this family."

    def has_object_permission(self, request, view, obj):
        # obj is either a Family or a FamilyMember
        from .models import Family, FamilyMember

        if isinstance(obj, Family):
            return obj.owner == request.user

        if isinstance(obj, FamilyMember):
            return obj.family.owner == request.user

        return False
