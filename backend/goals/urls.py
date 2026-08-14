from django.urls import path
from .views import SavingsGoalListCreateView, SavingsGoalDetailView

app_name = "goals"

urlpatterns = [
    path("", SavingsGoalListCreateView.as_view(), name="goal-list"),
    path("<int:pk>/", SavingsGoalDetailView.as_view(), name="goal-detail"),
]
