from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Attendance(BaseModel):
    STATUS_CHOICES = [
        ('PRESENT', 'Présent'),
        ('ABSENT', 'Absent'),
        ('LATE', 'En retard'),
        ('EXCUSED', 'Excusé'),
        ('HALF_DAY', 'Demi-journée'),
    ]

    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='attendances',
    )
    school_class = models.ForeignKey(
        'academic.SchoolClass',
        on_delete=models.CASCADE,
        related_name='attendances',
    )
    subject = models.ForeignKey(
        'academic.Subject',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='attendances',
    )
    date = models.DateField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PRESENT',
    )
    note = models.TextField(blank=True)
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='recorded_attendances',
    )

    class Meta(BaseModel.Meta):
        db_table = 'attendance_record'
        ordering = ['-date', 'student__last_name']
        verbose_name = 'Présence'
        verbose_name_plural = 'Présences'
        unique_together = ['student', 'date', 'subject']

    def __str__(self):
        return f"{self.student} — {self.date} — {self.get_status_display()}"
