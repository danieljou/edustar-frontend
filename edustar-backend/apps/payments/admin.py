from django.contrib import admin
from .models import FeeType, FeeStructure, Payment

admin.site.register(FeeType)
admin.site.register(FeeStructure)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'student', 'fee_type', 'amount', 'payment_date', 'status', 'method']
    list_filter = ['status', 'method', 'fee_type', 'academic_year']
    search_fields = ['reference', 'student__first_name', 'student__last_name', 'student__matricule']
    date_hierarchy = 'payment_date'
