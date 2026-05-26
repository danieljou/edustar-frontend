import uuid
from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Création'),
        ('UPDATE', 'Modification'),
        ('DELETE', 'Suppression'),
        ('LOGIN', 'Connexion'),
        ('LOGOUT', 'Déconnexion'),
        ('VIEW', 'Consultation'),
        ('EXPORT', 'Export'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_audit_log'
        ordering = ['-created_at']
        verbose_name = 'Journal d\'audit'
        verbose_name_plural = 'Journaux d\'audit'

    def __str__(self):
        return f"{self.user} | {self.action} | {self.model_name} | {self.created_at}"

    @classmethod
    def log_action(cls, user, action, instance=None, details='', ip_address=None, user_agent=''):
        model_name = type(instance).__name__ if instance else ''
        object_id = str(instance.pk) if instance and hasattr(instance, 'pk') else ''
        cls.objects.create(
            user=user,
            action=action,
            model_name=model_name,
            object_id=object_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent,
        )
