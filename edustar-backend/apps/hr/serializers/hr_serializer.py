from apps.core.serializers import BaseModelSerializer
from ..models import Staff, Leave


class StaffListSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['full_name'] = instance.user.get_full_name()
        data['email'] = instance.user.email
        return data

    class Meta:
        model = Staff
        fields = [
            'id', 'matricule', 'position', 'department',
            'contract_type', 'is_active', 'created_at',
        ]


class StaffSerializer(BaseModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'


class LeaveSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['staff_name'] = str(instance.staff)
        return data

    class Meta:
        model = Leave
        fields = '__all__'
