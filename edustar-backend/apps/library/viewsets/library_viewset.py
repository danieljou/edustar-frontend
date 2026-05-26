from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseModelViewSetMixin
from ..models import Book, BookLoan
from ..serializers import BookSerializer, BookLoanSerializer


class BookViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'author', 'isbn', 'publisher']


class BookLoanViewSet(BaseModelViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = BookLoan.objects.select_related('book', 'student').all()
    serializer_class = BookLoanSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['book', 'student', 'status']

    def perform_create(self, serializer):
        loan = serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
        )
        loan.book.available = max(0, loan.book.available - 1)
        loan.book.save(update_fields=['available'])

    @action(detail=True, methods=['POST'])
    def return_book(self, request, pk=None):
        loan = self.get_object()
        loan.status = 'RETURNED'
        loan.return_date = timezone.now().date()
        loan.updated_by = request.user
        loan.save(update_fields=['status', 'return_date', 'updated_by', 'updated_at'])
        loan.book.available += 1
        loan.book.save(update_fields=['available'])
        return Response(BookLoanSerializer(loan).data)
