from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Student, Enrollment
from ..serializers import StudentSerializer, StudentListSerializer, EnrollmentSerializer


class StudentViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['gender', 'is_active', 'nationality']
    search_fields = [
        'matricule', 'first_name', 'last_name',
        'parent_name', 'parent_phone',
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return StudentListSerializer
        return StudentSerializer


class EnrollmentViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Enrollment.objects.select_related(
        'student', 'school_class', 'academic_year'
    ).all()
    serializer_class = EnrollmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'academic_year', 'school_class']
