from rest_framework import serializers

BASE_READ_ONLY = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']


class BaseModelSerializer(serializers.ModelSerializer):
    """
    Serializer de base qui rend automatiquement en lecture seule
    les champs communs hérités de BaseModel.
    """

    def get_fields(self):
        fields = super().get_fields()
        for name in BASE_READ_ONLY:
            if name in fields:
                fields[name].read_only = True
        return fields
