from django.contrib import admin
from .models import Book, BookLoan

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'quantity', 'available', 'isbn']
    list_filter = ['category']
    search_fields = ['title', 'author', 'isbn']

@admin.register(BookLoan)
class BookLoanAdmin(admin.ModelAdmin):
    list_display = ['book', 'student', 'loan_date', 'due_date', 'return_date', 'status']
    list_filter = ['status']
    search_fields = ['book__title', 'student__first_name', 'student__last_name']
    date_hierarchy = 'loan_date'
