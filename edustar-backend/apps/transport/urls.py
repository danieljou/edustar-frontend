from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import RouteViewSet, BusViewSet, StudentTransportViewSet

app_name = 'transport'

router = SimpleRouter()
router.register(r'routes', RouteViewSet, basename='route')
router.register(r'buses', BusViewSet, basename='bus')
router.register(r'student-transport', StudentTransportViewSet, basename='student-transport')

urlpatterns = [
    path('', include(router.urls)),
]
