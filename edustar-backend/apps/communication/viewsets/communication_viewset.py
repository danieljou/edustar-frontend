from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Announcement, Notification
from ..serializers import AnnouncementSerializer, NotificationSerializer


class AnnouncementViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Announcement.objects.select_related('author').all()
    serializer_class = AnnouncementSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['target', 'is_published']
    search_fields = ['title', 'content']

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
            created_by=self.request.user,
            updated_by=self.request.user,
        )

    @action(detail=True, methods=['POST'])
    def publish(self, request, pk=None):
        obj = self.get_object()
        obj.is_published = True
        obj.published_at = timezone.now()
        obj.updated_by = request.user
        obj.save(update_fields=[
            'is_published', 'published_at', 'updated_by', 'updated_at',
        ])
        return Response(AnnouncementSerializer(obj).data)


class NotificationViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'is_read']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['POST'])
    def mark_all_read(self, request):
        Notification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True)
        return Response({'status': 'Toutes les notifications marquées comme lues.'})

    @action(detail=True, methods=['POST'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notification).data)
