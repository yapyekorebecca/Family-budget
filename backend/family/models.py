from django.db import models
from django.conf import settings


class Family(models.Model):
    """
    One household per user. All budgets, expenses, and goals belong to this family.
    """
    family_name = models.CharField(max_length=255)
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="family",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Family"
        verbose_name_plural = "Families"
        ordering = ["-created_at"]
        # One user cannot have two families with the same name (extra guard)
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "family_name"],
                name="unique_family_name_per_owner",
            )
        ]

    def __str__(self):
        return f"{self.family_name} (owner: {self.owner.email})"


class FamilyMember(models.Model):
    """
    Individual members belonging to a Family.
    """

    RELATIONSHIP_CHOICES = [
        ("Father", "Father"),
        ("Mother", "Mother"),
        ("Child", "Child"),
        ("Guardian", "Guardian"),
        ("Sibling", "Sibling"),
        ("Grandparent", "Grandparent"),
        ("Other", "Other"),
    ]

    family = models.ForeignKey(
        Family,
        on_delete=models.CASCADE,
        related_name="members",
    )
    full_name = models.CharField(max_length=255)
    relationship = models.CharField(
        max_length=50,
        choices=RELATIONSHIP_CHOICES,
        default="Other",
    )
    avatar = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Family Member"
        verbose_name_plural = "Family Members"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.relationship}) – {self.family.family_name}"
