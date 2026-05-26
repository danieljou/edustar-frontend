from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Subject(BaseModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    coefficient = models.DecimalField(max_digits=4, decimal_places=2, default=1.0)
    color = models.CharField(max_length=7, default='#3B82F6')

    class Meta(BaseModel.Meta):
        db_table = 'academic_subject'
        ordering = ['name']
        verbose_name = 'Matière'
        verbose_name_plural = 'Matières'

    def __str__(self):
        return f"{self.name} ({self.code})"


class ClassSubject(BaseModel):
    school_class = models.ForeignKey('SchoolClass', on_delete=models.CASCADE, related_name='class_subjects')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='class_subjects')
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='teaching_assignments'
    )
    hours_per_week = models.PositiveSmallIntegerField(default=2)

    class Meta(BaseModel.Meta):
        db_table = 'academic_class_subject'
        unique_together = ['school_class', 'subject']
        verbose_name = 'Matière de classe'
        verbose_name_plural = 'Matières de classe'

    def __str__(self):
        return f"{self.school_class} — {self.subject}"
