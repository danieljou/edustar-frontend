from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Route, Bus, StudentTransport
from ..serializers import RouteSerializer, BusSerializer, StudentTransportSerializer


class RouteViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class BusViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Bus.objects.select_related('route').all()
    serializer_class = BusSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['route', 'is_active']
    search_fields = ['plate', 'driver_name', 'driver_phone']


class StudentTransportViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = StudentTransport.objects.select_related(
        'student', 'bus', 'academic_year'
    ).all()
    serializer_class = StudentTransportSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['bus', 'academic_year', 'is_active']
    search_fields = [
        'student__first_name', 'student__last_name',
        'student__matricule', 'pickup_point',
    ]
