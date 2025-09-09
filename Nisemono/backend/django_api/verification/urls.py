from django.urls import path
from . import views

app_name = 'verification'

urlpatterns = [
    path('logs/', views.VerificationLogListView.as_view(), name='verification-logs'),
    path('logs/<int:pk>/', views.VerificationLogDetailView.as_view(), name='verification-log-detail'),
    path('audit/', views.AuditLogView.as_view(), name='audit-logs'),
]
