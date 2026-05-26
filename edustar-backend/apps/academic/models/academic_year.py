from django.db import models
from apps.core.models import BaseModel


class AcademicYear(BaseModel):
    TERM_CHOICES = [
        (1, 'Trimestre 1'),
        (2, 'Trimestre 2'),
        (3, 'Trimestre 3'),
    ]

    campus = models.ForeignKey(
        'campus.Campus',
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name='academic_years',
        verbose_name='Établissement',
    )
    name = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)
    current_term = models.IntegerField(choices=TERM_CHOICES, default=1)

    class Meta(BaseModel.Meta):
        db_table = 'academic_year'
        verbose_name = 'Année scolaire'
        verbose_name_plural = 'Années scolaires'
        unique_together = [['campus', 'name']]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_current:
            AcademicYear.objects.filter(
                campus=self.campus
            ).exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)
