from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Certificate
from .serializers import (
    CertificateSerializer,
    CertificateCreateSerializer,
    CertificateVerifySerializer,
    CertificateRevokeSerializer
)
from verification.models import VerificationLog

class CertificateListCreateView(generics.ListCreateAPIView):
    queryset = Certificate.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CertificateCreateSerializer
        return CertificateSerializer
    
    def get_queryset(self):
        queryset = Certificate.objects.select_related('institution')
        status_filter = self.request.query_params.get('status')
        institution_id = self.request.query_params.get('institution')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if institution_id:
            queryset = queryset.filter(institution_id=institution_id)
            
        return queryset

class CertificateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Certificate.objects.select_related('institution')
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

class CertificateVerifyView(generics.GenericAPIView):
    serializer_class = CertificateVerifySerializer
    
    def post(self, request, certificate_id):
        try:
            certificate = get_object_or_404(Certificate, certificate_id=certificate_id)
            
            # Determine verification status
            if certificate.status == 'revoked':
                verification_status = 'revoked'
            elif certificate.status == 'expired':
                verification_status = 'invalid'
            else:
                verification_status = 'valid'
            
            # Log the verification
            verification_log = VerificationLog.objects.create(
                certificate=certificate,
                verifier_ip=self.get_client_ip(request),
                verifier_user_agent=request.META.get('HTTP_USER_AGENT', ''),
                verification_status=verification_status,
                verified_by=request.user if request.user.is_authenticated else None,
                verification_method='api'
            )
            
            # TODO: Integrate with AI/ML fraud detection service
            
            response_data = {
                'certificate_id': certificate.certificate_id,
                'student_name': certificate.student_name,
                'course_name': certificate.course_name,
                'institution': certificate.institution.name,
                'issue_date': certificate.issue_date,
                'status': verification_status,
                'certificate_hash': certificate.certificate_hash,
                'blockchain_hash': certificate.blockchain_hash,
                'verification_id': verification_log.id
            }
            
            return Response(response_data)
            
        except Certificate.DoesNotExist:
            return Response(
                {'error': 'Certificate not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class CertificateRevokeView(generics.UpdateAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateRevokeSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        certificate = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            certificate.status = 'revoked'
            certificate.revoked_at = timezone.now()
            certificate.revoked_by = request.user
            certificate.revocation_reason = serializer.validated_data['revocation_reason']
            certificate.save()
            
            response_serializer = CertificateSerializer(certificate)
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
