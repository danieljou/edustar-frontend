from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class FeeType(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'payments_fee_type'
        verbose_name = 'Type de frais'
        verbose_name_plural = 'Types de frais'

    def __str__(self):
        return self.name


class FeeStructure(BaseModel):
    fee_type = models.ForeignKey(
        FeeType, on_delete=models.CASCADE, related_name='structures',
    )
    class_level = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    academic_year = models.ForeignKey(
        'academic.AcademicYear',
        on_delete=models.CASCADE,
        related_name='fee_structures',
    )
    due_date = models.DateField(null=True, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'payments_fee_structure'
        unique_together = ['fee_type', 'class_level', 'academic_year']
        verbose_name = 'Structure tarifaire'
        verbose_name_plural = 'Structures tarifaires'

    def __str__(self):
        return (
            f"{self.fee_type} — {self.class_level}"
            f" ({self.academic_year}) : {self.amount} XAF"
        )


class Payment(BaseModel):
    METHOD_CHOICES = [
        ('CASH', 'Espèces'),
        ('MOBILE_MONEY', 'Mobile Money'),
        ('BANK_TRANSFER', 'Virement bancaire'),
        ('CHECK', 'Chèque'),
        ('CARD', 'Carte bancaire'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('PAID', 'Payé'),
        ('PARTIAL', 'Partiel'),
        ('FAILED', 'Échoué'),
        ('REFUNDED', 'Remboursé'),
    ]

    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='payments',
    )
    fee_type = models.ForeignKey(
        FeeType, on_delete=models.CASCADE, related_name='payments',
    )
    academic_year = models.ForeignKey(
        'academic.AcademicYear',
        on_delete=models.CASCADE,
        related_name='payments',
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
    )
    payment_date = models.DateField()
    method = models.CharField(
        max_length=20, choices=METHOD_CHOICES, default='CASH',
    )
    reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING',
    )
    notes = models.TextField(blank=True)
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='received_payments',
    )

    class Meta(BaseModel.Meta):
        db_table = 'payments_payment'
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'

    def __str__(self):
        return (
            f"{self.student} — {self.fee_type}"
            f" — {self.amount_paid}/{self.amount} XAF ({self.status})"
        )
