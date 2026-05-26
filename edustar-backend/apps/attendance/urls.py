from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import AttendanceViewSet

app_name = 'attendance'

router = SimpleRouter()
router.register(r'', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
