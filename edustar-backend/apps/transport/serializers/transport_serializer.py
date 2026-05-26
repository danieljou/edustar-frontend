from apps.core.serializers import BaseModelSerializer
from ..models import Route, Bus, StudentTransport


class RouteSerializer(BaseModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class BusSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['route_name'] = instance.route.name if instance.route else None
        return data

    class Meta:
        model = Bus
        fields = '__all__'


class StudentTransportSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['student_name'] = str(instance.student)
        data['bus_plate'] = instance.bus.plate
        return data

    class Meta:
        model = StudentTransport
        fields = '__all__'
