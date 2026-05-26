from django.db import models
from apps.core.models import BaseModel


class Route(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    stops = models.JSONField(default=list, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'transport_route'
        ordering = ['name']
        verbose_name = 'Itinéraire'
        verbose_name_plural = 'Itinéraires'

    def __str__(self):
        return self.name


class Bus(BaseModel):
    plate = models.CharField(max_length=20, unique=True)
    model = models.CharField(max_length=100, blank=True)
    capacity = models.PositiveIntegerField(default=30)
    route = models.ForeignKey(
        Route,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='buses',
    )
    driver_name = models.CharField(max_length=150)
    driver_phone = models.CharField(max_length=20)

    class Meta(BaseModel.Meta):
        db_table = 'transport_bus'
        ordering = ['plate']
        verbose_name = 'Bus'
        verbose_name_plural = 'Bus'

    def __str__(self):
        return f"{self.plate} — {self.driver_name}"


class StudentTransport(BaseModel):
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='transports',
    )
    bus = models.ForeignKey(
        Bus,
        on_delete=models.CASCADE,
        related_name='student_transports',
    )
    academic_year = models.ForeignKey(
        'academic.AcademicYear',
        on_delete=models.CASCADE,
        related_name='student_transports',
    )
    pickup_point = models.CharField(max_length=200)
    dropoff_point = models.CharField(max_length=200, blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'transport_student'
        ordering = ['student__last_name']
        verbose_name = 'Transport élève'
        verbose_name_plural = 'Transport élèves'
        unique_together = ['student', 'academic_year']

    def __str__(self):
        return f"{self.student} — {self.bus} ({self.academic_year})"
