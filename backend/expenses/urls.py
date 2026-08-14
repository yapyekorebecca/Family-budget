from django.urls import path
from .views import ExpenseListCreateView, ExpenseDetailView

app_name = "expenses"

urlpatterns = [
    path("", ExpenseListCreateView.as_view(), name="expense-list"),
    path("<int:pk>/", ExpenseDetailView.as_view(), name="expense-detail"),
]
