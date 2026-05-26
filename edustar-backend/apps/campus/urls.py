from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import CampusViewSet, StudentTransferViewSet

app_name = 'campus'

router = SimpleRouter()
router.register(r'campus', CampusViewSet, basename='campus')
router.register(r'transfers', StudentTransferViewSet, basename='transfer')

urlpatterns = [
    path('', include(router.urls)),
]
