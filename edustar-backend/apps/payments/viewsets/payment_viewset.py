import uuid
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import FeeType, FeeStructure, Payment
from ..serializers import FeeTypeSerializer, FeeStructureSerializer, PaymentSerializer


class FeeTypeViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = FeeType.objects.all()
    serializer_class = FeeTypeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class FeeStructureViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = FeeStructure.objects.select_related(
        'fee_type', 'academic_year'
    ).all()
    serializer_class = FeeStructureSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['fee_type', 'class_level', 'academic_year']


class PaymentViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Payment.objects.select_related(
        'student', 'fee_type', 'academic_year', 'received_by'
    ).all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['student', 'fee_type', 'status', 'method', 'academic_year']
    search_fields = [
        'reference',
        'student__first_name', 'student__last_name', 'student__matricule',
    ]

    def perform_create(self, serializer):
        ref = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
            received_by=self.request.user,
            reference=ref,
        )
