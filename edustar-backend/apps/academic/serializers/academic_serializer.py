from apps.core.serializers import BaseModelSerializer
from ..models import (
    AcademicYear, Room, SchoolClass,
    Subject, ClassSubject,
    ExamType, Exam, ExamResult,
    Timetable,
)


class AcademicYearSerializer(BaseModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'


class RoomSerializer(BaseModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class SchoolClassSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['academic_year_name'] = str(instance.academic_year)
        data['student_count'] = (
            instance.enrollments.filter(status='ACTIVE').count()
        )
        return data

    class Meta:
        model = SchoolClass
        fields = '__all__'


class SubjectSerializer(BaseModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class ClassSubjectSerializer(BaseModelSerializer):
    class Meta:
        model = ClassSubject
        fields = '__all__'


class ExamTypeSerializer(BaseModelSerializer):
    class Meta:
        model = ExamType
        fields = '__all__'


class ExamSerializer(BaseModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'


class ExamResultSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['student_name'] = str(instance.student)
        return data

    class Meta:
        model = ExamResult
        fields = '__all__'


class TimetableSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['day_label'] = instance.get_day_display()
        return data

    class Meta:
        model = Timetable
        fields = '__all__'
