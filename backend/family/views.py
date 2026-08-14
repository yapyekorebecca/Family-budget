from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Family, FamilyMember
from .serializers import FamilySerializer, FamilyMemberSerializer
from .permissions import IsFamilyOwner


# ──────────────────────────────────────────────
# FAMILY endpoints
# ──────────────────────────────────────────────

class FamilyView(APIView):
    """
    GET    /api/family/   – get the authenticated user's family
    POST   /api/family/   – create a family (one per user)
    PATCH  /api/family/   – update the family name
    DELETE /api/family/   – delete the family (and all members)
    """
    permission_classes = [IsAuthenticated]

    def _get_family_or_none(self, request):
        try:
            return request.user.family
        except Family.DoesNotExist:
            return None

    # ── GET ──────────────────────────────────
    def get(self, request):
        family = self._get_family_or_none(request)
        if family is None:
            return Response(
                {"success": False, "message": "You have not created a family yet."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = FamilySerializer(family, context={"request": request})
        return Response({"success": True, "data": serializer.data})

    # ── POST ─────────────────────────────────
    def post(self, request):
        if self._get_family_or_none(request) is not None:
            return Response(
                {"success": False, "message": "You already have a family. Each user can only own one family."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = FamilySerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(
            {"success": True, "message": "Family created successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    # ── PATCH ────────────────────────────────
    def patch(self, request):
        family = self._get_family_or_none(request)
        if family is None:
            return Response(
                {"success": False, "message": "You have not created a family yet."},
                status=status.HTTP_404_NOT_FOUND,
            )
        self.check_object_permissions(request, family)
        serializer = FamilySerializer(
            family, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"success": True, "message": "Family updated successfully.", "data": serializer.data}
        )

    # ── DELETE ───────────────────────────────
    def delete(self, request):
        family = self._get_family_or_none(request)
        if family is None:
            return Response(
                {"success": False, "message": "No family found to delete."},
                status=status.HTTP_404_NOT_FOUND,
            )
        self.check_object_permissions(request, family)
        family.delete()
        return Response(
            {"success": True, "message": "Family deleted successfully."},
            status=status.HTTP_200_OK,
        )

    def get_permissions(self):
        permissions = super().get_permissions()
        # Apply object-level IsFamilyOwner for PATCH / DELETE
        if self.request.method in ("PATCH", "DELETE"):
            permissions.append(IsFamilyOwner())
        return permissions


# ──────────────────────────────────────────────
# FAMILY MEMBER endpoints
# ──────────────────────────────────────────────

class FamilyMemberListCreateView(APIView):
    """
    GET  /api/family/members/   – list all members of the user's family
    POST /api/family/members/   – add a new member
    """
    permission_classes = [IsAuthenticated]

    def _get_family_or_403(self, request):
        try:
            return request.user.family
        except Family.DoesNotExist:
            return None

    def get(self, request):
        family = self._get_family_or_403(request)
        if family is None:
            return Response(
                {"success": False, "message": "You have not created a family yet."},
                status=status.HTTP_404_NOT_FOUND,
            )
        members = family.members.all()
        serializer = FamilyMemberSerializer(members, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        family = self._get_family_or_403(request)
        if family is None:
            return Response(
                {"success": False, "message": "Create a family first before adding members."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = FamilyMemberSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(family=family)
        return Response(
            {"success": True, "message": "Member added successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class FamilyMemberDetailView(APIView):
    """
    PATCH  /api/family/members/{id}/  – update a member
    DELETE /api/family/members/{id}/  – remove a member
    """
    permission_classes = [IsAuthenticated, IsFamilyOwner]

    def _get_member(self, request, pk):
        member = get_object_or_404(FamilyMember, pk=pk)
        self.check_object_permissions(request, member)
        return member

    def patch(self, request, pk):
        member = self._get_member(request, pk)
        serializer = FamilyMemberSerializer(
            member, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"success": True, "message": "Member updated successfully.", "data": serializer.data}
        )

    def delete(self, request, pk):
        member = self._get_member(request, pk)
        member.delete()
        return Response(
            {"success": True, "message": "Member removed successfully."},
            status=status.HTTP_200_OK,
        )
