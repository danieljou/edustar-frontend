from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import BookViewSet, BookLoanViewSet

app_name = 'library'

router = SimpleRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'loans', BookLoanViewSet, basename='book-loan')

urlpatterns = [
    path('', include(router.urls)),
]
