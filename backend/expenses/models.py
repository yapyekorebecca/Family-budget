from django.db import models
from django.conf import settings


class Expense(models.Model):
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
        related_name="expenses",
    )
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="Other")
    date = models.DateField()
    notes = models.TextField(blank=True, default="")
    # Optional: link to a family member (stored as name string for simplicity)
    family_member_name = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "Expense"
        verbose_name_plural = "Expenses"

    def __str__(self):
        return f"{self.title} – {self.amount} ({self.user.email})"
