from rest_framework import serializers
from apps.core.serializers import BaseModelSerializer
from ..models import Attendance


class AttendanceSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['student_name'] = str(instance.student)
        data['status_label'] = instance.get_status_display()
        return data

    class Meta:
        model = Attendance
        fields = '__all__'


class AttendanceBulkSerializer(serializers.Serializer):
    school_class = serializers.UUIDField()
    date = serializers.DateField()
    subject = serializers.UUIDField(required=False, allow_null=True)
    records = serializers.ListField(child=serializers.DictField())
