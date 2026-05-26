from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Campus, StudentTransfer
from ..serializers import (
    CampusSerializer,
    CampusSummarySerializer,
    StudentTransferSerializer,
)

_FILTER_BACKENDS = [
    DjangoFilterBackend,
    filters.SearchFilter,
    filters.OrderingFilter,
]


class CampusViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Campus.objects.select_related('director').all()
    serializer_class = CampusSerializer
    filter_backends = _FILTER_BACKENDS
    filterset_fields = ['type', 'is_active']
    search_fields = ['name', 'code', 'city']
    ordering_fields = ['name', 'type', 'created_at']

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """Résumé comparatif de tous les campus actifs."""
        qs = self.get_queryset().filter(is_active=True)
        serializer = CampusSummarySerializer(qs, many=True)
        totals = {
            'total_campus': qs.count(),
            'total_students': sum(c.student_count for c in qs),
            'total_classes': sum(c.class_count for c in qs),
            'total_teachers': sum(c.teacher_count for c in qs),
        }
        return Response({'campus': serializer.data, 'totals': totals})

    @action(detail=True, methods=['get'], url_path='stats')
    def stats(self, request, pk=None):
        """Statistiques détaillées d'un campus."""
        campus = self.get_object()
        pending = StudentTransfer.objects.filter(
            campus_dest=campus, status='PENDING',
        ).count()
        return Response({
            'id': str(campus.id),
            'name': campus.name,
            'student_count': campus.student_count,
            'class_count': campus.class_count,
            'teacher_count': campus.teacher_count,
            'pending_transfers': pending,
        })


_ERR_NOT_PENDING_APPROVE = (
    'Seuls les transferts en attente peuvent être approuvés.'
)
_ERR_NOT_PENDING_REJECT = (
    'Seuls les transferts en attente peuvent être rejetés.'
)


class StudentTransferViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = StudentTransfer.objects.select_related(
        'student', 'campus_source', 'campus_dest', 'approved_by',
    ).all()
    serializer_class = StudentTransferSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = [
        'status', 'campus_source', 'campus_dest', 'student',
    ]
    ordering_fields = ['date_effective', 'created_at']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approuver un transfert en attente."""
        transfer = self.get_object()
        if transfer.status != 'PENDING':
            return Response(
                {'detail': _ERR_NOT_PENDING_APPROVE},
                status=status.HTTP_400_BAD_REQUEST,
            )
        transfer.approve(request.user)
        return Response(StudentTransferSerializer(transfer).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rejeter un transfert en attente."""
        transfer = self.get_object()
        if transfer.status != 'PENDING':
            return Response(
                {'detail': _ERR_NOT_PENDING_REJECT},
                status=status.HTTP_400_BAD_REQUEST,
            )
        reason = request.data.get('reason', '')
        transfer.reject(request.user, reason)
        return Response(StudentTransferSerializer(transfer).data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Transferts en attente de validation."""
        qs = self.get_queryset().filter(status='PENDING')
        return Response(StudentTransferSerializer(qs, many=True).data)
