from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Budget
from .serializers import BudgetSerializer


class BudgetListCreateView(APIView):
    """
    GET  /api/budgets/  – list the authenticated user's budgets
    POST /api/budgets/  – create a new budget
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Budget.objects.filter(user=request.user)

        month = request.query_params.get("month")
        if month:
            qs = qs.filter(month=month)

        serializer = BudgetSerializer(qs, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = BudgetSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(
            {"success": True, "message": "Budget created.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class BudgetDetailView(APIView):
    """
    PATCH  /api/budgets/{id}/  – update a budget
    DELETE /api/budgets/{id}/  – delete a budget
    """
    permission_classes = [IsAuthenticated]

    def _get_budget(self, request, pk):
        return get_object_or_404(Budget, pk=pk, user=request.user)

    def patch(self, request, pk):
        budget = self._get_budget(request, pk)
        serializer = BudgetSerializer(budget, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "message": "Budget updated.", "data": serializer.data})

    def delete(self, request, pk):
        budget = self._get_budget(request, pk)
        budget.delete()
        return Response({"success": True, "message": "Budget deleted."}, status=status.HTTP_200_OK)
