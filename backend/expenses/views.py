from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseListCreateView(APIView):
    """
    GET  /api/expenses/  – list the authenticated user's expenses
    POST /api/expenses/  – create a new expense
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Optional query params: ?category=Food&month=2026-08
        qs = Expense.objects.filter(user=request.user)

        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)

        month = request.query_params.get("month")
        if month:
            qs = qs.filter(date__startswith=month)

        serializer = ExpenseSerializer(qs, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(
            {"success": True, "message": "Expense added.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class ExpenseDetailView(APIView):
    """
    PATCH  /api/expenses/{id}/  – update an expense
    DELETE /api/expenses/{id}/  – delete an expense
    """
    permission_classes = [IsAuthenticated]

    def _get_expense(self, request, pk):
        return get_object_or_404(Expense, pk=pk, user=request.user)

    def patch(self, request, pk):
        expense = self._get_expense(request, pk)
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "message": "Expense updated.", "data": serializer.data})

    def delete(self, request, pk):
        expense = self._get_expense(request, pk)
        expense.delete()
        return Response({"success": True, "message": "Expense deleted."}, status=status.HTTP_200_OK)
