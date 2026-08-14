from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import SavingsGoal
from .serializers import SavingsGoalSerializer


class SavingsGoalListCreateView(APIView):
    """
    GET  /api/goals/  – list the authenticated user's savings goals
    POST /api/goals/  – create a new savings goal
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        goals = SavingsGoal.objects.filter(user=request.user)
        serializer = SavingsGoalSerializer(goals, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = SavingsGoalSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(
            {"success": True, "message": "Savings goal created.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class SavingsGoalDetailView(APIView):
    """
    PATCH  /api/goals/{id}/  – update a savings goal
    DELETE /api/goals/{id}/  – delete a savings goal
    """
    permission_classes = [IsAuthenticated]

    def _get_goal(self, request, pk):
        return get_object_or_404(SavingsGoal, pk=pk, user=request.user)

    def patch(self, request, pk):
        goal = self._get_goal(request, pk)
        serializer = SavingsGoalSerializer(goal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "message": "Goal updated.", "data": serializer.data})

    def delete(self, request, pk):
        goal = self._get_goal(request, pk)
        goal.delete()
        return Response({"success": True, "message": "Goal deleted."}, status=status.HTTP_200_OK)
