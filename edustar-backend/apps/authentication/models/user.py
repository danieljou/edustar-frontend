import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator


class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Administrateur'),
        ('DIRECTOR', 'Directeur'),
        ('TEACHER', 'Enseignant'),
        ('STUDENT', 'Élève'),
        ('PARENT', 'Parent'),
        ('STAFF', 'Personnel'),
        ('HR', 'Ressources Humaines'),
        ('ACCOUNTANT', 'Comptable'),
    ]

    LANGUAGE_CHOICES = [
        ('FR', 'Français'),
        ('EN', 'English'),
    ]

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False,
    )
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default='STAFF',
    )
    avatar = models.ImageField(
        upload_to='avatars/', null=True, blank=True,
    )

    # Sécurité
    failed_login_attempts = models.PositiveSmallIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    last_ip_address = models.GenericIPAddressField(null=True, blank=True)
    password_changed_at = models.DateTimeField(null=True, blank=True)

    # 2FA / OTP
    otp_secret = models.CharField(max_length=32, blank=True)
    otp_enabled = models.BooleanField(default=False)
    otp_verified = models.BooleanField(default=False)

    # Campus d'appartenance (null = accès réseau complet)
    campus = models.ForeignKey(
        'campus.Campus',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='users',
        verbose_name='Établissement',
    )

    # Contact
    phone = models.CharField(
        max_length=20, blank=True,
        validators=[RegexValidator(r'^[+]?[0-9\s\-\(\)]{8,20}$')],
    )
    preferred_language = models.CharField(
        max_length=2, choices=LANGUAGE_CHOICES, default='FR',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'auth_user'
        ordering = ['-date_joined']
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'

    def __str__(self):
        name = self.get_full_name() or self.username
        return f"{name} ({self.email})"

    @property
    def is_locked(self):
        return bool(
            self.locked_until and self.locked_until > timezone.now()
        )

    @property
    def full_name(self):
        return self.get_full_name() or self.username

    def record_failed_login(self):
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:
            self.locked_until = (
                timezone.now() + timezone.timedelta(minutes=30)
            )
        self.save(update_fields=['failed_login_attempts', 'locked_until'])

    def record_successful_login(self, ip_address=None):
        self.failed_login_attempts = 0
        self.locked_until = None
        if ip_address:
            self.last_ip_address = ip_address
        self.save(update_fields=[
            'failed_login_attempts', 'locked_until', 'last_ip_address',
        ])

    def set_password(self, raw_password):
        super().set_password(raw_password)
        self.password_changed_at = timezone.now()
        self.failed_login_attempts = 0
        self.locked_until = None
