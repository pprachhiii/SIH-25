from django.urls import path
from . import views

app_name = 'institutions'

urlpatterns = [
    path('', views.InstitutionListCreateView.as_view(), name='institution-list-create'),
    path('<int:pk>/', views.InstitutionDetailView.as_view(), name='institution-detail'),
    path('<int:pk>/verify/', views.InstitutionVerifyView.as_view(), name='institution-verify'),
    path('<int:pk>/suspend/', views.InstitutionSuspendView.as_view(), name='institution-suspend'),
]
