from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Institution
from .serializers import (
    InstitutionSerializer, 
    InstitutionCreateSerializer,
    InstitutionStatusSerializer,
    InstitutionPublicKeySerializer
)

class InstitutionListCreateView(generics.ListCreateAPIView):
    queryset = Institution.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InstitutionCreateSerializer
        return InstitutionSerializer
    
    def get_queryset(self):
        queryset = Institution.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

class InstitutionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [IsAuthenticated]

class InstitutionVerifyView(generics.UpdateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionStatusSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        institution = self.get_object()
        institution.status = 'verified'
        institution.verified_at = timezone.now()
        institution.verified_by = request.user
        institution.save()
        
        serializer = InstitutionSerializer(institution)
        return Response(serializer.data)

class InstitutionSuspendView(generics.UpdateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionStatusSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        institution = self.get_object()
        institution.status = 'suspended'
        institution.save()
        
        serializer = InstitutionSerializer(institution)
        return Response(serializer.data)
