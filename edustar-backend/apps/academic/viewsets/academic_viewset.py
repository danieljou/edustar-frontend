from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import (
    AcademicYear, Room, SchoolClass,
    Subject, ClassSubject,
    ExamType, Exam, ExamResult,
    Timetable,
)
from ..serializers import (
    AcademicYearSerializer, RoomSerializer, SchoolClassSerializer,
    SubjectSerializer, ClassSubjectSerializer,
    ExamTypeSerializer, ExamSerializer, ExamResultSerializer,
    TimetableSerializer,
)


class AcademicYearViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer


class RoomViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'is_active']
    search_fields = ['name', 'building']


class SchoolClassViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = SchoolClass.objects.select_related(
        'academic_year', 'homeroom_teacher', 'room'
    ).all()
    serializer_class = SchoolClassSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['level', 'academic_year']
    search_fields = ['name', 'level', 'section']


class SubjectViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'code']


class ClassSubjectViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ClassSubject.objects.select_related(
        'school_class', 'subject', 'teacher'
    ).all()
    serializer_class = ClassSubjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school_class', 'subject', 'teacher']


class ExamTypeViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ExamType.objects.all()
    serializer_class = ExamTypeSerializer


class ExamViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Exam.objects.select_related(
        'exam_type', 'subject', 'school_class', 'academic_year'
    ).all()
    serializer_class = ExamSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['school_class', 'subject', 'academic_year', 'term']
    search_fields = ['title']


class ExamResultViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ExamResult.objects.select_related('exam', 'student').all()
    serializer_class = ExamResultSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exam', 'student', 'absent']


class TimetableViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Timetable.objects.select_related(
        'school_class', 'subject', 'teacher', 'room', 'academic_year'
    ).all()
    serializer_class = TimetableSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'school_class', 'subject', 'teacher', 'academic_year', 'day',
    ]
