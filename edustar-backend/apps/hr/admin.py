from django.contrib import admin
from .models import Staff, Leave

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['matricule', 'user', 'position', 'department', 'contract_type', 'is_active']
    list_filter = ['contract_type', 'department', 'is_active']
    search_fields = ['matricule', 'position', 'user__first_name', 'user__last_name']

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ['staff', 'type', 'start_date', 'end_date', 'status']
    list_filter = ['type', 'status']
    search_fields = ['staff__user__first_name', 'staff__user__last_name']
