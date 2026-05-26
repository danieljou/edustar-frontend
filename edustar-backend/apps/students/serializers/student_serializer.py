from apps.core.serializers import BaseModelSerializer
from ..models import Student, Enrollment


class StudentListSerializer(BaseModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id', 'matricule', 'first_name', 'last_name',
            'gender', 'date_of_birth', 'photo', 'nationality',
            'is_active', 'created_at',
        ]


class StudentSerializer(BaseModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class EnrollmentSerializer(BaseModelSerializer):
    student_name = None
    class_name = None
    year_name = None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['student_name'] = str(instance.student)
        data['class_name'] = str(instance.school_class)
        data['year_name'] = str(instance.academic_year)
        return data

    class Meta:
        model = Enrollment
        fields = '__all__'
