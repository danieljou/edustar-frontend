from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import StudentViewSet, EnrollmentViewSet

app_name = 'students'

router = SimpleRouter()
router.register(r'', StudentViewSet, basename='student')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
]
