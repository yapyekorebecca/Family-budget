from django.db import models
from django.conf import settings


class Budget(models.Model):
    CATEGORY_CHOICES = [
        ("Food", "Food"),
        ("Transport", "Transport"),
        ("Rent", "Rent"),
        ("Utilities", "Utilities"),
        ("School", "School"),
        ("Shopping", "Shopping"),
        ("Health", "Health"),
        ("Entertainment", "Entertainment"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    month = models.CharField(max_length=7)  # e.g. "2026-08"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-month", "category"]
        verbose_name = "Budget"
        verbose_name_plural = "Budgets"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "category", "month"],
                name="unique_budget_per_category_month",
            )
        ]

    def __str__(self):
        return f"{self.category} budget for {self.month} – {self.user.email}"
