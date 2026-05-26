from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class SchoolClass(BaseModel):
    LEVEL_CHOICES = [
        ('MATERNELLE', 'Maternelle'),
        ('CP', 'CP'),
        ('CE1', 'CE1'),
        ('CE2', 'CE2'),
        ('CM1', 'CM1'),
        ('CM2', 'CM2'),
        ('6EME', '6ème'),
        ('5EME', '5ème'),
        ('4EME', '4ème'),
        ('3EME', '3ème'),
        ('2NDE', '2nde'),
        ('1ERE', '1ère'),
        ('TMLR', 'Terminale'),
    ]

    campus = models.ForeignKey(
        'campus.Campus',
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name='classes',
        verbose_name='Établissement',
    )
    name = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    section = models.CharField(max_length=10, blank=True)
    academic_year = models.ForeignKey(
        'AcademicYear',
        on_delete=models.CASCADE,
        related_name='classes',
    )
    homeroom_teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='homeroom_classes',
    )
    room = models.ForeignKey(
        'Room',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='classes',
    )
    max_students = models.PositiveIntegerField(default=40)

    class Meta(BaseModel.Meta):
        db_table = 'academic_school_class'
        ordering = ['level', 'section']
        verbose_name = 'Classe'
        verbose_name_plural = 'Classes'
        unique_together = [['campus', 'name', 'academic_year']]

    def __str__(self):
        return f"{self.name} ({self.academic_year})"
