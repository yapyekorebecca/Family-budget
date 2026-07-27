from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class CustomUserManager(BaseUserManager):
    """
    Manager for CustomUser - handles creating users & superusers.
    Django uses this when you run `createsuperuser` or `User.objects.create_user()`.
    """

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a regular user with email + password."""
        if not email:
            raise ValueError("Users MUST have an email address!")
        
        # Normalize email (lowercase the domain part)
        email = self.normalize_email(email)
        
        # Create the user object (in memory, not saved yet)
        user = self.model(email=email, **extra_fields)
        
        # This hashes the password with PBKDF2/SHA256 - NEVER store plain text!
        user.set_password(password)
        
        # Save to database
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create, save and return a SUPERUSER (admin panel access)."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model that uses EMAIL as the login field,
    instead of Django's default username.
    
    Fields:
      - email: unique, used for login (USERNAME_FIELD)
      - first_name, last_name: optional user info
      - is_active: can the user log in? (True by default)
      - is_staff: can access Django admin? (for team)
      - is_superuser: full admin privileges
      - date_joined: auto-set on creation
    """
    
    # -------------------------
    # Core Identity Fields
    # -------------------------
    email = models.EmailField(
        verbose_name="Email Address",
        max_length=255,
        unique=True,                   # ← NO duplicate emails allowed!
        db_index=True,                 # ← Speed up email lookups
        error_messages={
            "unique": "A user with that email already exists.",
        },
    )
    
    # -------------------------
    # Optional Profile Fields
    # -------------------------
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    
    # -------------------------
    # Django Permissions / Status
    # -------------------------
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active. "
                  "Unselect this instead of deleting accounts.",
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into this admin site.",
    )
    is_superuser = models.BooleanField(
        default=False,
        help_text="Designates that this user has all permissions without "
                  "explicitly assigning them.",
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    # -------------------------
    # CRITICAL: Tell Django to use EMAIL for login
    # -------------------------
    USERNAME_FIELD = "email"       # ← Login with email, not username!
    
    # Fields required when creating superuser (email + password are always required)
    REQUIRED_FIELDS = []           # ← empty because email is USERNAME_FIELD
    
    # -------------------------
    # Use our custom manager
    # -------------------------
    objects = CustomUserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]     # Newest users first

    def __str__(self):
        """How the user is represented as a string (e.g., in admin panel)."""
        return self.email

    def get_full_name(self):
        """Return first_name + last_name, or just email if empty."""
        full = f"{self.first_name} {self.last_name}".strip()
        return full or self.email

    def get_short_name(self):
        """Return short identifier for the user."""
        return self.first_name or self.email.split("@")[0]
