from django.contrib import admin
from .models import AcademicYear, Room, SchoolClass, Subject, ClassSubject, ExamType, Exam, ExamResult, Timetable

admin.site.register(AcademicYear)
admin.site.register(Room)
admin.site.register(SchoolClass)
admin.site.register(Subject)
admin.site.register(ClassSubject)
admin.site.register(ExamType)
admin.site.register(Exam)
admin.site.register(ExamResult)
admin.site.register(Timetable)
