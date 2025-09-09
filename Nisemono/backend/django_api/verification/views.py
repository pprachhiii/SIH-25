from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import VerificationLog, AuditLog
from rest_framework import serializers

class VerificationLogSerializer(serializers.ModelSerializer):
    certificate_id = serializers.CharField(source='certificate.certificate_id', read_only=True)
    student_name = serializers.CharField(source='certificate.student_name', read_only=True)
    institution_name = serializers.CharField(source='certificate.institution.name', read_only=True)
    
    class Meta:
        model = VerificationLog
        fields = [
            'id', 'certificate_id', 'student_name', 'institution_name',
            'verifier_ip', 'verification_status', 'ai_fraud_score',
            'ai_fraud_result', 'verified_at', 'verification_method'
        ]

class AuditLogSerializer(serializers.ModelSerializer):
    performed_by_username = serializers.CharField(source='performed_by.username', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'action_type', 'object_type', 'object_id',
            'performed_by_username', 'timestamp', 'old_values', 'new_values'
        ]

class VerificationLogListView(generics.ListAPIView):
    queryset = VerificationLog.objects.select_related('certificate', 'certificate__institution')
    serializer_class = VerificationLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        certificate_id = self.request.query_params.get('certificate_id')
        verification_status = self.request.query_params.get('status')
        fraud_result = self.request.query_params.get('fraud_result')
        
        if certificate_id:
            queryset = queryset.filter(certificate__certificate_id=certificate_id)
        if verification_status:
            queryset = queryset.filter(verification_status=verification_status)
        if fraud_result:
            queryset = queryset.filter(ai_fraud_result=fraud_result)
            
        return queryset

class VerificationLogDetailView(generics.RetrieveAPIView):
    queryset = VerificationLog.objects.select_related('certificate', 'certificate__institution')
    serializer_class = VerificationLogSerializer
    permission_classes = [IsAuthenticated]

class AuditLogView(generics.ListAPIView):
    queryset = AuditLog.objects.select_related('performed_by')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        action_type = self.request.query_params.get('action_type')
        object_type = self.request.query_params.get('object_type')
        object_id = self.request.query_params.get('object_id')
        
        if action_type:
            queryset = queryset.filter(action_type=action_type)
        if object_type:
            queryset = queryset.filter(object_type=object_type)
        if object_id:
            queryset = queryset.filter(object_id=object_id)
            
        return queryset
