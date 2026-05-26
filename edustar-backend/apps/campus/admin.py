from django.contrib import admin
from .models import Campus, StudentTransfer


@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'name', 'type', 'city',
        'director', 'is_active', 'created_at',
    ]
    list_filter = ['type', 'is_active']
    search_fields = ['code', 'name', 'city']
    readonly_fields = ['id', 'created_at', 'updated_at']
    fieldsets = (
        ('Identification', {
            'fields': (
                'id', 'code', 'name', 'type',
                'color', 'active_session',
            ),
        }),
        ('Coordonnées', {
            'fields': ('address', 'city', 'phone', 'email'),
        }),
        ('Direction', {'fields': ('director',)}),
        ('Statut', {
            'fields': ('is_active', 'created_at', 'updated_at'),
        }),
    )


@admin.register(StudentTransfer)
class StudentTransferAdmin(admin.ModelAdmin):
    list_display = [
        'student', 'campus_source', 'campus_dest',
        'date_effective', 'status', 'approved_by', 'created_at',
    ]
    list_filter = ['status', 'campus_source', 'campus_dest']
    search_fields = [
        'student__last_name',
        'student__first_name',
        'student__matricule',
    ]
    readonly_fields = ['id', 'created_at', 'updated_at', 'approved_at']
    actions = ['approve_transfers', 'reject_transfers']

    def approve_transfers(self, request, queryset):
        count = 0
        for t in queryset.filter(status='PENDING'):
            t.approve(request.user)
            count += 1
        self.message_user(request, f"{count} transfert(s) approuvé(s).")

    approve_transfers.short_description = (
        "Approuver les transferts sélectionnés"
    )

    def reject_transfers(self, request, queryset):
        reason = "Rejeté en masse via l'administration"
        count = 0
        for t in queryset.filter(status='PENDING'):
            t.reject(request.user, reason=reason)
            count += 1
        self.message_user(request, f"{count} transfert(s) rejeté(s).")

    reject_transfers.short_description = (
        "Rejeter les transferts sélectionnés"
    )
