from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Attendance
from ..serializers import AttendanceSerializer, AttendanceBulkSerializer


class AttendanceViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Attendance.objects.select_related(
        'student', 'school_class', 'subject', 'recorded_by'
    ).all()
    serializer_class = AttendanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'school_class', 'subject', 'date', 'status']

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
            recorded_by=self.request.user,
        )

    @action(detail=False, methods=['POST'])
    def bulk_create(self, request):
        serializer = AttendanceBulkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        records = [
            Attendance(
                student_id=r['student'],
                school_class_id=data['school_class'],
                subject_id=data.get('subject'),
                date=data['date'],
                status=r.get('status', 'PRESENT'),
                note=r.get('note', ''),
                recorded_by=request.user,
                created_by=request.user,
                updated_by=request.user,
            )
            for r in data['records']
        ]

        Attendance.objects.bulk_create(
            records,
            update_conflicts=True,
            update_fields=['status', 'note', 'updated_by'],
            unique_fields=['student', 'date', 'subject'],
        )
        return Response({'created': len(records)}, status=status.HTTP_201_CREATED)
