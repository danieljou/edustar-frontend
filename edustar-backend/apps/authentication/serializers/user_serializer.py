from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone',
                  'preferred_language', 'avatar', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserMeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name',
                  'role', 'phone', 'preferred_language', 'avatar',
                  'otp_enabled', 'otp_verified', 'is_active', 'is_locked',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_locked']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_is_locked(self, obj):
        return obj.is_locked
