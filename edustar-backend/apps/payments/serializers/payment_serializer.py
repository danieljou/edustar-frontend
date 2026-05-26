from apps.core.serializers import BaseModelSerializer
from ..models import FeeType, FeeStructure, Payment


class FeeTypeSerializer(BaseModelSerializer):
    class Meta:
        model = FeeType
        fields = '__all__'


class FeeStructureSerializer(BaseModelSerializer):
    class Meta:
        model = FeeStructure
        fields = '__all__'


class PaymentSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['student_name'] = str(instance.student)
        data['fee_type_name'] = instance.fee_type.name
        return data

    class Meta:
        model = Payment
        fields = '__all__'
