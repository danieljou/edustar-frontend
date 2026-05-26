from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.models import BaseModel


class StudentTransfer(BaseModel):
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('APPROVED', 'Approuvé'),
        ('REJECTED', 'Rejeté'),
    ]

    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='campus_transfers',
    )
    campus_source = models.ForeignKey(
        'campus.Campus',
        on_delete=models.CASCADE,
        related_name='transfers_out',
        verbose_name='Établissement source',
    )
    campus_dest = models.ForeignKey(
        'campus.Campus',
        on_delete=models.CASCADE,
        related_name='transfers_in',
        verbose_name='Établissement destination',
    )
    date_effective = models.DateField(verbose_name='Date effective')
    reason = models.TextField(verbose_name='Motif')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING',
        db_index=True,
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_transfers',
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'campus_student_transfer'
        ordering = ['-created_at']
        verbose_name = 'Transfert d\'élève'
        verbose_name_plural = 'Transferts d\'élèves'

    def __str__(self):
        return (
            f"{self.student} : {self.campus_source.code} → "
            f"{self.campus_dest.code} [{self.status}]"
        )

    def approve(self, user):
        self.status = 'APPROVED'
        self.approved_by = user
        self.approved_at = timezone.now()
        self.save(update_fields=[
            'status', 'approved_by', 'approved_at', 'updated_at', 'updated_by'
        ])

    def reject(self, user, reason=''):
        self.status = 'REJECTED'
        self.approved_by = user
        self.approved_at = timezone.now()
        self.rejection_reason = reason
        self.save(update_fields=[
            'status', 'approved_by', 'approved_at',
            'rejection_reason', 'updated_at', 'updated_by',
        ])
