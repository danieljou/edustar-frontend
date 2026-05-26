from django.db import models
from apps.core.models import BaseModel


class Enrollment(BaseModel):
    STATUS_CHOICES = [
        ('ACTIVE', 'Actif'),
        ('TRANSFERRED', 'Transféré'),
        ('WITHDRAWN', 'Retiré'),
        ('GRADUATED', 'Diplômé'),
        ('SUSPENDED', 'Suspendu'),
    ]

    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    school_class = models.ForeignKey(
        'academic.SchoolClass',
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    academic_year = models.ForeignKey(
        'academic.AcademicYear',
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='ACTIVE',
    )
    enrollment_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'students_enrollment'
        ordering = ['-enrollment_date']
        verbose_name = 'Inscription'
        verbose_name_plural = 'Inscriptions'
        unique_together = ['student', 'academic_year']

    def __str__(self):
        return f"{self.student} — {self.school_class} ({self.academic_year})"
