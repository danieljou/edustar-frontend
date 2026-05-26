from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import FeeTypeViewSet, FeeStructureViewSet, PaymentViewSet

app_name = 'payments'

router = SimpleRouter()
router.register(r'fee-types', FeeTypeViewSet, basename='fee-type')
router.register(r'fee-structures', FeeStructureViewSet, basename='fee-structure')
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
]
