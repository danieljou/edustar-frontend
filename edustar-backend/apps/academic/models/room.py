from django.db import models
from apps.core.models import BaseModel


class Room(BaseModel):
    TYPE_CHOICES = [
        ('CLASSROOM', 'Salle de cours'),
        ('LAB', 'Laboratoire'),
        ('LIBRARY', 'Bibliothèque'),
        ('GYM', 'Salle de sport'),
        ('COMPUTER', 'Salle informatique'),
        ('ART', 'Salle d\'art'),
        ('OFFICE', 'Bureau'),
        ('OTHER', 'Autre'),
    ]

    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='CLASSROOM')
    capacity = models.PositiveIntegerField(default=40)
    floor = models.CharField(max_length=20, blank=True)
    building = models.CharField(max_length=100, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'academic_room'
        ordering = ['name']
        verbose_name = 'Salle'
        verbose_name_plural = 'Salles'

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
