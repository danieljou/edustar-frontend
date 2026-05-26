from django.contrib import admin
from .models import Announcement, Notification

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'target', 'is_published', 'published_at', 'created_at']
    list_filter = ['target', 'is_published']
    search_fields = ['title', 'content']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read']
    search_fields = ['title', 'message', 'user__username']
