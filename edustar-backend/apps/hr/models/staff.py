from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Staff(BaseModel):
    CONTRACT_CHOICES = [
        ('CDI', 'CDI'),
        ('CDD', 'CDD'),
        ('VACATAIRE', 'Vacataire'),
        ('STAGIAIRE', 'Stagiaire'),
        ('BENEVOLE', 'Bénévole'),
    ]

    campus = models.ForeignKey(
        'campus.Campus',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='staff',
        verbose_name='Établissement',
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='staff_profile',
    )
    matricule = models.CharField(max_length=30, unique=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField()
    contract_type = models.CharField(
        max_length=20, choices=CONTRACT_CHOICES, default='CDI',
    )
    salary = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
    )
    qualifications = models.TextField(blank=True)
    subjects_taught = models.ManyToManyField(
        'academic.Subject', blank=True, related_name='teachers',
    )

    class Meta(BaseModel.Meta):
        db_table = 'hr_staff'
        ordering = ['user__last_name', 'user__first_name']
        verbose_name = 'Personnel'
        verbose_name_plural = 'Personnels'

    def __str__(self):
        name = self.user.get_full_name()
        return f"{name} — {self.position} ({self.matricule})"


class Leave(BaseModel):
    TYPE_CHOICES = [
        ('ANNUAL', 'Congé annuel'),
        ('SICK', 'Congé maladie'),
        ('MATERNITY', 'Congé maternité'),
        ('PATERNITY', 'Congé paternité'),
        ('UNPAID', 'Congé sans solde'),
        ('OTHER', 'Autre'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('APPROVED', 'Approuvé'),
        ('REJECTED', 'Refusé'),
        ('CANCELLED', 'Annulé'),
    ]

    staff = models.ForeignKey(
        Staff, on_delete=models.CASCADE, related_name='leaves',
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING',
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_leaves',
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'hr_leave'
        verbose_name = 'Congé'
        verbose_name_plural = 'Congés'

    def __str__(self):
        t = self.get_type_display()
        return f"{self.staff} — {t} ({self.start_date} → {self.end_date})"
