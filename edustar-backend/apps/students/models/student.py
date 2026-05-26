from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Student(BaseModel):
    GENDER_CHOICES = [('M', 'Masculin'), ('F', 'Féminin')]
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='student_profile',
    )
    matricule = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    photo = models.ImageField(
        upload_to='students/photos/', null=True, blank=True,
    )
    nationality = models.CharField(max_length=100, default='Camerounaise')
    place_of_birth = models.CharField(max_length=150, blank=True)
    address = models.TextField(blank=True)
    blood_group = models.CharField(
        max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True,
    )
    medical_notes = models.TextField(blank=True)

    parent_name = models.CharField(max_length=200)
    parent_phone = models.CharField(max_length=20)
    parent_email = models.EmailField(blank=True)
    parent_address = models.TextField(blank=True)
    parent_relationship = models.CharField(max_length=50, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'students_student'
        ordering = ['last_name', 'first_name']
        verbose_name = 'Élève'
        verbose_name_plural = 'Élèves'

    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.matricule})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
