from django.urls import path
from . import views

app_name = 'certificates'

urlpatterns = [
    path('', views.CertificateListCreateView.as_view(), name='certificate-list-create'),
    path('<int:pk>/', views.CertificateDetailView.as_view(), name='certificate-detail'),
    path('<int:pk>/revoke/', views.CertificateRevokeView.as_view(), name='certificate-revoke'),
    path('verify/<str:certificate_id>/', views.CertificateVerifyView.as_view(), name='certificate-verify'),
]
