from django.urls import path
from .permissions_views import CheckPermissionView, AllPermissionsView

urlpatterns = [
    path('check/', CheckPermissionView.as_view(), name='permission-check'),
    path('all/', AllPermissionsView.as_view(), name='permissions-all'),
]
