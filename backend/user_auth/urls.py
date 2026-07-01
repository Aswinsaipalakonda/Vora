from django.urls import path
from .views import LoginView, RegisterView, ProfileView, ChangePasswordView

urlpatterns = [
    path('login/', LoginView.as_view(), name='api-login'),
    path('register/', RegisterView.as_view(), name='api-register'),
    path('profile/', ProfileView.as_view(), name='api-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='api-change-password'),
]
