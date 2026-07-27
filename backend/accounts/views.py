from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
)


class RegisterView(CreateAPIView):
    """
    POST /api/auth/register/
    Creates a new user account.

    Permission: Anyone can register (AllowAny)

    Request body (JSON):
    {
        "email": "user@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "password": "MyStr0ngPass!",
        "password_confirm": "MyStr0ngPass!"
    }

    Response (201 Created):
    {
        "id": 1,
        "email": "user@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "access_token": "eyJ0eXAiOiJKV1Qi...",
        "refresh_token": "eyJ0eXAiOiJKV1Qi...",
        "message": "User registered successfully."
    }
    """
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    # Use 201 CREATED (HTTP standard for resource creation)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # This runs ALL our validators. If invalid, raises 400 automatically.
        serializer.is_valid(raise_exception=True)
        # Runs serializer.create() → makes user, hashes password, generates JWT
        user = serializer.save()

        # Customize response format (return clean JSON)
        return Response(
            {
                "success": True,
                "message": serializer.data.get("message", "Registration successful."),
                "data": {
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "full_name": user.get_full_name(),
                    },
                    "tokens": {
                        "access": serializer.data.get("access_token"),
                        "refresh": serializer.data.get("refresh_token"),
                    },
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(GenericAPIView):
    """
    POST /api/auth/login/
    Authenticates a user and returns JWT tokens.

    Permission: Anyone (AllowAny)

    Request body:
    {
        "email": "user@example.com",
        "password": "MyStr0ngPass!"
    }

    Response (200 OK):
    {
        "success": true,
        "message": "Login successful.",
        "data": {
            "user": { ... },
            "tokens": { "access": "...", "refresh": "..." }
        }
    }
    """
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},  # Pass request for authenticate()
        )
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data

        return Response(
            {
                "success": True,
                "message": validated.get("message", "Login successful."),
                "data": {
                    "user": {
                        "id": validated.get("user_id"),
                        "email": validated.get("email"),
                        "first_name": validated.get("first_name"),
                        "last_name": validated.get("last_name"),
                    },
                    "tokens": {
                        "access": validated.get("access_token"),
                        "refresh": validated.get("refresh_token"),
                    },
                },
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(RetrieveAPIView):
    """
    GET /api/auth/profile/
    Retrieves the CURRENTLY LOGGED-IN user's profile.

    Permission: MUST be authenticated (IsAuthenticated)

    Required Request Header:
    Authorization: Bearer <access_token>

    Response (200 OK):
    {
        "success": true,
        "message": "Profile retrieved successfully.",
        "data": {
            "id": 1,
            "email": "...",
            "first_name": "...",
            "last_name": "...",
            "full_name": "...",
            "is_active": true,
            "is_staff": false,
            "date_joined": "2026-07-27T12:00:00Z",
            "last_login": "2026-07-27T14:30:00Z"
        }
    }
    """
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']

    def get_object(self):
        """
        Override RetrieveAPIView.get_object() - we don't look up by pk in URL.
        Instead, ALWAYS return the user from the JWT token (request.user).
        """
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {
                "success": True,
                "message": "Profile retrieved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(GenericAPIView):
    """
    POST /api/auth/logout/
    Blacklists the refresh token (so it can't be used again).
    Frontend should also DELETE tokens from localStorage.

    Permission: Must be authenticated

    Request body:
    {
        "refresh": "<refresh_token>"
    }
    """
    permission_classes = (IsAuthenticated,)
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"success": False, "message": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            # Blacklist the refresh token
            token.blacklist()

            return Response(
                {
                    "success": True,
                    "message": "Logged out successfully. Token has been invalidated.",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired refresh token.",
                    "error": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# We inherit Simple JWT's built-in TokenRefreshView
# and just wrap the response in our standard JSON format.
class CustomTokenRefreshView(TokenRefreshView):
    """
    POST /api/auth/refresh/
    Get a NEW access token using a valid refresh token.

    Use this when the access token expires (~15 min).

    Request body:
    {
        "refresh": "<refresh_token>"
    }

    Response:
    {
        "success": true,
        "message": "Access token refreshed successfully.",
        "data": {
            "access": "<new_access_token>",
            "refresh": "<new_refresh_token>"  # Because ROTATE_REFRESH_TOKENS=True
        }
    }
    """

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # response.data is {"access": "...", "refresh": "..."}
        return Response(
            {
                "success": True,
                "message": "Access token refreshed successfully.",
                "data": response.data,
            },
            status=response.status_code,
        )
