from django.urls import path, include

urlpatterns = [
    path('institutions/', include('institutions.urls')),
    path('certificates/', include('certificates.urls')),
    path('verification/', include('verification.urls')),
    # Note: Authentication is handled by Node.js auth_service
    # Django will validate tokens sent from Node.js service
]
