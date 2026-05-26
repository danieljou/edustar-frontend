from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import StaffViewSet, LeaveViewSet

app_name = 'hr'

router = SimpleRouter()
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'leaves', LeaveViewSet, basename='leave')

urlpatterns = [
    path('', include(router.urls)),
]
