from django.contrib import admin
from .models import Budget


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ["category", "amount", "month", "user"]
    list_filter = ["category", "month"]
    search_fields = ["user__email"]
    ordering = ["-month", "category"]
