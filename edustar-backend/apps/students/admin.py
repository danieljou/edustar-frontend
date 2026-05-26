from django.contrib import admin
from .models import Student, Enrollment


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['matricule', 'last_name', 'first_name', 'gender', 'date_of_birth', 'is_active']
    list_filter = ['gender', 'is_active', 'nationality']
    search_fields = ['matricule', 'first_name', 'last_name', 'parent_name']
    ordering = ['last_name', 'first_name']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'school_class', 'academic_year', 'status', 'enrollment_date']
    list_filter = ['status', 'academic_year']
    search_fields = ['student__first_name', 'student__last_name', 'student__matricule']
