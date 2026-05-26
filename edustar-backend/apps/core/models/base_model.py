import uuid
from django.db import models
from django.conf import settings
from simple_history.models import HistoricalRecords


class BaseModel(models.Model):
    """
    Modèle abstrait de base pour EduStar.
    Fournit : UUID PK, horodatage, traçabilité créateur/modificateur,
    soft-delete via is_active, et historique automatique (simple-history).
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='%(class)s_created',
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='%(class)s_updated',
    )
    is_active = models.BooleanField(default=True)

    history = HistoricalRecords(inherit=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']

    def soft_delete(self, user=None):
        self.is_active = False
        if user:
            self.updated_by = user
        self.save(update_fields=['is_active', 'updated_at', 'updated_by'])

    def restore(self, user=None):
        self.is_active = True
        if user:
            self.updated_by = user
        self.save(update_fields=['is_active', 'updated_at', 'updated_by'])
