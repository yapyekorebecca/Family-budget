
from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def api_root(request):
    return Response({
        "success": True,
        "message": "Welcome to FamBudget API",
        "version": "v1",
        "endpoints": {
            "admin": "/admin/",
            "api_auth_login": "/api-auth/login/",
            "authentication": {
                "register": {
                    "method": "POST",
                    "url": "/api/auth/register/",
                    "description": "Create a new user account",
                    "body": "{email, password, password_confirm, first_name?, last_name?}",
                },
                "login": {
                    "method": "POST",
                    "url": "/api/auth/login/",
                    "description": "Log in and get JWT tokens",
                    "body": "{email, password}",
                },
                "refresh": {
                    "method": "POST",
                    "url": "/api/auth/refresh/",
                    "description": "Get new access token using refresh token",
                    "body": "{refresh}",
                },
                "profile": {
                    "method": "GET",
                    "url": "/api/auth/profile/",
                    "description": "Get current user profile (needs Bearer token)",
                    "headers": "Authorization: Bearer <access_token>",
                },
                "logout": {
                    "method": "POST",
                    "url": "/api/auth/logout/",
                    "description": "Blacklist refresh token",
                    "body": "{refresh}",
                },
            },
        },
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', api_root, name='api-root'),

    # -------------------------
    # Our App URLs
    # -------------------------
    path('api/auth/', include('accounts.urls', namespace='accounts')),

    # Future app URLs (ready for later tasks):
    # path('api/family/', include('family.urls', namespace='family')),
    # path('api/expenses/', include('expenses.urls', namespace='expenses')),
    # path('api/budgets/', include('budgets.urls', namespace='budgets')),
    # path('api/goals/', include('goals.urls', namespace='goals')),
]
