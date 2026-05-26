from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import (
    AcademicYearViewSet, RoomViewSet, SchoolClassViewSet,
    SubjectViewSet, ClassSubjectViewSet,
    ExamTypeViewSet, ExamViewSet, ExamResultViewSet,
    TimetableViewSet,
)

app_name = 'academic'

router = SimpleRouter()
router.register(r'years', AcademicYearViewSet, basename='academic-year')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'classes', SchoolClassViewSet, basename='school-class')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'class-subjects', ClassSubjectViewSet, basename='class-subject')
router.register(r'exam-types', ExamTypeViewSet, basename='exam-type')
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'exam-results', ExamResultViewSet, basename='exam-result')
router.register(r'timetable', TimetableViewSet, basename='timetable')

urlpatterns = [
    path('', include(router.urls)),
]
