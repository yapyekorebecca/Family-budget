from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """
    Custom admin panel for CustomUser model.
    Adapts Django's built-in UserAdmin to work with EMAIL login instead of username.
    """

    # Which fields appear in the list view (admin/users/)
    list_display = (
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'date_joined',
    )

    # Filters on the right sidebar
    list_filter = (
        'is_active',
        'is_staff',
        'is_superuser',
        'date_joined',
    )

    # Search box fields
    search_fields = (
        'email',
        'first_name',
        'last_name',
    )

    # Default ordering: newest users first
    ordering = ('-date_joined',)

    # Fieldsets for the "edit user" form page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            ),
        }),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fieldsets for the "add new user" form page
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'password1',
                'password2',
                'first_name',
                'last_name',
                'is_active',
                'is_staff',
            ),
        }),
    )

    # Fields that are READ-ONLY in the admin
    readonly_fields = ('date_joined', 'last_login')
    # Make email clickable (to go to edit form)
    list_display_links = ('email',)
