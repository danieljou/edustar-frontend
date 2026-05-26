from apps.core.serializers import BaseModelSerializer
from ..models import Announcement, Notification


class AnnouncementSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['author_name'] = (
            instance.author.get_full_name() or instance.author.username
        )
        return data

    class Meta:
        model = Announcement
        fields = '__all__'


class NotificationSerializer(BaseModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
