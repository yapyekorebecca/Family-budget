from django.urls import path
from .views import FamilyView, FamilyMemberListCreateView, FamilyMemberDetailView

app_name = "family"

urlpatterns = [
    path("", FamilyView.as_view(), name="family"),
    path("members/", FamilyMemberListCreateView.as_view(), name="member-list"),
    path("members/<int:pk>/", FamilyMemberDetailView.as_view(), name="member-detail"),
]
