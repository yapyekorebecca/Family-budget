from django.db import models
from django.conf import settings


class SavingsGoal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="savings_goals",
    )
    title = models.CharField(max_length=255)
    target_amount = models.DecimalField(max_digits=14, decimal_places=2)
    current_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    deadline = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Savings Goal"
        verbose_name_plural = "Savings Goals"

    def __str__(self):
        return f"{self.title} – {self.user.email}"

    @property
    def progress_percent(self):
        if self.target_amount == 0:
            return 0
        return min(float(self.current_amount / self.target_amount * 100), 100)
