from django.contrib import admin
from .models import Family, FamilyMember


class FamilyMemberInline(admin.TabularInline):
    model = FamilyMember
    extra = 0


@admin.register(Family)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ["family_name", "owner", "created_at"]
    search_fields = ["family_name", "owner__email"]
    inlines = [FamilyMemberInline]


@admin.register(FamilyMember)
class FamilyMemberAdmin(admin.ModelAdmin):
    list_display = ["full_name", "relationship", "family", "created_at"]
    search_fields = ["full_name", "family__family_name"]
    list_filter = ["relationship"]
