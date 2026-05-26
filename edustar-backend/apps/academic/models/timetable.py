from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Timetable(BaseModel):
    DAYS = [
        (1, 'Lundi'), (2, 'Mardi'), (3, 'Mercredi'),
        (4, 'Jeudi'), (5, 'Vendredi'), (6, 'Samedi'),
    ]

    school_class = models.ForeignKey(
        'SchoolClass', on_delete=models.CASCADE, related_name='timetables',
    )
    subject = models.ForeignKey(
        'Subject', on_delete=models.CASCADE, related_name='timetables',
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='timetable_slots',
    )
    room = models.ForeignKey(
        'Room', null=True, blank=True, on_delete=models.SET_NULL,
    )
    academic_year = models.ForeignKey(
        'AcademicYear',
        on_delete=models.CASCADE,
        related_name='timetables',
    )
    day = models.IntegerField(choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta(BaseModel.Meta):
        db_table = 'academic_timetable'
        ordering = ['day', 'start_time']
        verbose_name = 'Emploi du temps'
        verbose_name_plural = 'Emplois du temps'

    def __str__(self):
        day = self.get_day_display()
        return f"{self.school_class} | {day} {self.start_time}-{self.end_time} | {self.subject}"
