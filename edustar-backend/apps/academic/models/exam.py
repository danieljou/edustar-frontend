from django.db import models
from apps.core.models import BaseModel


class ExamType(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)

    class Meta(BaseModel.Meta):
        db_table = 'academic_exam_type'
        verbose_name = "Type d'examen"
        verbose_name_plural = "Types d'examen"

    def __str__(self):
        return self.name


class Exam(BaseModel):
    TERM_CHOICES = [
        (1, 'Trimestre 1'),
        (2, 'Trimestre 2'),
        (3, 'Trimestre 3'),
    ]

    title = models.CharField(max_length=200)
    exam_type = models.ForeignKey(
        ExamType, on_delete=models.CASCADE, related_name='exams',
    )
    subject = models.ForeignKey(
        'Subject', on_delete=models.CASCADE, related_name='exams',
    )
    school_class = models.ForeignKey(
        'SchoolClass', on_delete=models.CASCADE, related_name='exams',
    )
    academic_year = models.ForeignKey(
        'AcademicYear', on_delete=models.CASCADE, related_name='exams',
    )
    term = models.IntegerField(choices=TERM_CHOICES, default=1)
    date = models.DateField()
    duration_minutes = models.PositiveIntegerField(default=60)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=20)
    room = models.ForeignKey(
        'Room', null=True, blank=True, on_delete=models.SET_NULL,
    )

    class Meta(BaseModel.Meta):
        db_table = 'academic_exam'
        verbose_name = 'Examen'
        verbose_name_plural = 'Examens'

    def __str__(self):
        return f"{self.title} — {self.school_class} ({self.date})"


class ExamResult(BaseModel):
    exam = models.ForeignKey(
        Exam, on_delete=models.CASCADE, related_name='results',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='exam_results',
    )
    score = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
    )
    absent = models.BooleanField(default=False)
    comment = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'academic_exam_result'
        unique_together = ['exam', 'student']
        verbose_name = 'Résultat'
        verbose_name_plural = 'Résultats'

    def __str__(self):
        return f"{self.student} — {self.exam} : {self.score}"
