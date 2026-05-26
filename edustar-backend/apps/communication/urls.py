from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import AnnouncementViewSet, NotificationViewSet

app_name = 'communication'

router = SimpleRouter()
router.register(r'announcements', AnnouncementViewSet, basename='announcement')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
