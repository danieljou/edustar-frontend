from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Staff, Leave
from ..serializers import StaffSerializer, StaffListSerializer, LeaveSerializer


class StaffViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Staff.objects.select_related('user').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['contract_type', 'department', 'is_active']
    search_fields = [
        'matricule', 'position',
        'user__first_name', 'user__last_name', 'user__email',
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return StaffListSerializer
        return StaffSerializer


class LeaveViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Leave.objects.select_related('staff', 'approved_by').all()
    serializer_class = LeaveSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['staff', 'type', 'status']

    @action(detail=True, methods=['POST'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'APPROVED'
        leave.approved_by = request.user
        leave.approved_at = timezone.now()
        leave.updated_by = request.user
        leave.save(update_fields=[
            'status', 'approved_by', 'approved_at', 'updated_by', 'updated_at',
        ])
        return Response(LeaveSerializer(leave).data)

    @action(detail=True, methods=['POST'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'REJECTED'
        leave.approved_by = request.user
        leave.approved_at = timezone.now()
        leave.updated_by = request.user
        leave.save(update_fields=[
            'status', 'approved_by', 'approved_at', 'updated_by', 'updated_at',
        ])
        return Response(LeaveSerializer(leave).data)
