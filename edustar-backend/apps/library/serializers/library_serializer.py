from apps.core.serializers import BaseModelSerializer
from ..models import Book, BookLoan


class BookSerializer(BaseModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BookLoanSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['book_title'] = instance.book.title
        data['student_name'] = str(instance.student)
        return data

    class Meta:
        model = BookLoan
        fields = '__all__'
