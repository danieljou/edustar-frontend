from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'model_name', 'ip_address', 'created_at']
    list_filter = ['action']
    readonly_fields = ['user', 'action', 'model_name', 'object_id', 'details', 'ip_address', 'user_agent', 'created_at']
    search_fields = ['user__username', 'action', 'model_name']
    ordering = ['-created_at']
