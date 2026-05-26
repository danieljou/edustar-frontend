from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Campus(BaseModel):
    TYPE_CHOICES = [
        ('PRINCIPAL', 'Principal'),
        ('ANNEXE', 'Annexe'),
        ('PARTENAIRE', 'Partenaire'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    type = models.CharField(
        max_length=20, choices=TYPE_CHOICES, default='ANNEXE',
    )
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    director = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='directed_campus',
        limit_choices_to={'role__in': ['ADMIN', 'DIRECTOR']},
    )
    color = models.CharField(
        max_length=7, default='#0099cc',
        help_text='Code couleur hexadécimal (#rrggbb)',
    )
    active_session = models.CharField(max_length=30, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'campus'
        ordering = ['type', 'name']
        verbose_name = 'Établissement'
        verbose_name_plural = 'Établissements'

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

    @property
    def student_count(self):
        return self.enrollments.filter(is_active=True).count()

    @property
    def class_count(self):
        return self.classes.filter(is_active=True).count()

    @property
    def teacher_count(self):
        from apps.hr.models import Staff
        return Staff.objects.filter(campus=self, is_active=True).count()
