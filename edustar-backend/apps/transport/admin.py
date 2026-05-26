from django.contrib import admin
from .models import Route, Bus, StudentTransport

admin.site.register(Route)
admin.site.register(Bus)

@admin.register(StudentTransport)
class StudentTransportAdmin(admin.ModelAdmin):
    list_display = ['student', 'bus', 'academic_year', 'pickup_point', 'is_active']
    list_filter = ['is_active', 'academic_year', 'bus']
    search_fields = ['student__first_name', 'student__last_name', 'student__matricule', 'pickup_point']
