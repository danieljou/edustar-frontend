from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import AuthViewSet

app_name = 'authentication'

router = SimpleRouter()
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]
