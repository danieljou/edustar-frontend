from django.db import models
from apps.core.models import BaseModel


class Book(BaseModel):
    CATEGORY_CHOICES = [
        ('TEXTBOOK', 'Manuel scolaire'),
        ('NOVEL', 'Roman'),
        ('SCIENCE', 'Sciences'),
        ('HISTORY', 'Histoire'),
        ('MATH', 'Mathématiques'),
        ('LANGUAGE', 'Langue'),
        ('RELIGION', 'Religion'),
        ('REFERENCE', 'Référence'),
        ('OTHER', 'Autre'),
    ]

    title = models.CharField(max_length=300)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=20, unique=True, blank=True)
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default='TEXTBOOK',
    )
    published_year = models.PositiveIntegerField(null=True, blank=True)
    publisher = models.CharField(max_length=200, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    available = models.PositiveIntegerField(default=1)
    location = models.CharField(max_length=100, blank=True)
    cover_image = models.ImageField(
        upload_to='library/covers/', null=True, blank=True,
    )
    description = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'library_book'
        ordering = ['title']
        verbose_name = 'Livre'
        verbose_name_plural = 'Livres'

    def __str__(self):
        return f"{self.title} — {self.author}"


class BookLoan(BaseModel):
    STATUS_CHOICES = [
        ('ACTIVE', 'En cours'),
        ('RETURNED', 'Retourné'),
        ('OVERDUE', 'En retard'),
        ('LOST', 'Perdu'),
    ]

    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name='loans',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='book_loans',
    )
    loan_date = models.DateField()
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='ACTIVE',
    )
    notes = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = 'library_book_loan'
        verbose_name = 'Emprunt'
        verbose_name_plural = 'Emprunts'

    def __str__(self):
        return f"{self.book} → {self.student} ({self.loan_date})"
