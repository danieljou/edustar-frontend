from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
    openapi.Info(
        title="EduStar API",
        default_version='v1',
        description="API de gestion scolaire EduStar",
        contact=openapi.Contact(email="danieltiomelajou@gmail.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

_redoc = schema_view.with_ui('redoc', cache_timeout=0)
_swagger = schema_view.with_ui('swagger', cache_timeout=0)

urlpatterns = [
    path('', _redoc, name='schema-redoc'),
    path('v1/admin/', admin.site.urls),
    path('v1/doc/swagger/', _swagger, name='schema-swagger-ui'),
    path('v1/auth/', include('apps.authentication.urls')),
    path('v1/students/', include('apps.students.urls')),
    path('v1/academic/', include('apps.academic.urls')),
    path('v1/attendance/', include('apps.attendance.urls')),
    path('v1/hr/', include('apps.hr.urls')),
    path('v1/payments/', include('apps.payments.urls')),
    path('v1/communication/', include('apps.communication.urls')),
    path('v1/library/', include('apps.library.urls')),
    path('v1/transport/', include('apps.transport.urls')),
    path('v1/network/', include('apps.campus.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
