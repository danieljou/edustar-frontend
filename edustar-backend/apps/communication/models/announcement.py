from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class Announcement(BaseModel):
    TARGET_CHOICES = [
        ('ALL', 'Tous'),
        ('STUDENTS', 'Élèves'),
        ('TEACHERS', 'Enseignants'),
        ('PARENTS', 'Parents'),
        ('STAFF', 'Personnel'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='announcements',
    )
    target = models.CharField(
        max_length=20, choices=TARGET_CHOICES, default='ALL',
    )
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    attachment = models.FileField(
        upload_to='announcements/', null=True, blank=True,
    )

    class Meta(BaseModel.Meta):
        db_table = 'communication_announcement'
        verbose_name = 'Annonce'
        verbose_name_plural = 'Annonces'

    def __str__(self):
        return self.title
