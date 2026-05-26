from rest_framework import serializers
from ..models import Campus, StudentTransfer

_ro = {'read_only': True}


class CampusSerializer(serializers.ModelSerializer):
    director_name = serializers.CharField(
        source='director.full_name',
        default=None,
        **_ro,
    )
    type_display = serializers.CharField(
        source='get_type_display', **_ro,
    )
    student_count = serializers.IntegerField(**_ro)
    class_count = serializers.IntegerField(**_ro)
    teacher_count = serializers.IntegerField(**_ro)

    class Meta:
        model = Campus
        fields = [
            'id', 'code', 'name', 'type', 'type_display',
            'address', 'city', 'phone', 'email',
            'director', 'director_name',
            'color', 'active_session',
            'student_count', 'class_count', 'teacher_count',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_color(self, value):
        import re
        if not re.match(r'^#[0-9a-fA-F]{6}$', value):
            raise serializers.ValidationError(
                "La couleur doit être au format hexadécimal (#rrggbb)."
            )
        return value


class CampusSummarySerializer(serializers.ModelSerializer):
    """Serializer léger pour les listes et la comparaison."""
    type_display = serializers.CharField(
        source='get_type_display', **_ro,
    )
    student_count = serializers.IntegerField(**_ro)
    class_count = serializers.IntegerField(**_ro)
    teacher_count = serializers.IntegerField(**_ro)

    class Meta:
        model = Campus
        fields = [
            'id', 'code', 'name', 'type', 'type_display',
            'city', 'color', 'active_session', 'is_active',
            'student_count', 'class_count', 'teacher_count',
        ]


class StudentTransferSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_code = serializers.CharField(
        source='student.matricule', **_ro,
    )
    campus_source_name = serializers.CharField(
        source='campus_source.name', **_ro,
    )
    campus_dest_name = serializers.CharField(
        source='campus_dest.name', **_ro,
    )
    campus_source_color = serializers.CharField(
        source='campus_source.color', **_ro,
    )
    campus_dest_color = serializers.CharField(
        source='campus_dest.color', **_ro,
    )
    approved_by_name = serializers.CharField(
        source='approved_by.full_name',
        default=None,
        **_ro,
    )
    status_display = serializers.CharField(
        source='get_status_display', **_ro,
    )

    class Meta:
        model = StudentTransfer
        fields = [
            'id',
            'student', 'student_name', 'student_code',
            'campus_source', 'campus_source_name',
            'campus_source_color',
            'campus_dest', 'campus_dest_name',
            'campus_dest_color',
            'date_effective', 'reason',
            'status', 'status_display',
            'approved_by', 'approved_by_name', 'approved_at',
            'rejection_reason',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'approved_by', 'approved_at',
        ]

    def get_student_name(self, obj):
        return f"{obj.student.last_name} {obj.student.first_name}"

    def validate(self, data):
        src = data.get('campus_source')
        dst = data.get('campus_dest')
        if src and dst and src == dst:
            raise serializers.ValidationError(
                "L'établissement source et la destination "
                "doivent être différents."
            )
        return data
