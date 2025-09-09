from rest_framework import serializers
from .models import Certificate
from institutions.serializers import InstitutionSerializer

class CertificateSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer(read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'certificate_id', 'student_name', 'student_email',
            'course_name', 'certificate_type', 'issue_date', 'expiry_date',
            'institution', 'certificate_hash', 'blockchain_hash',
            'blockchain_transaction_id', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'certificate_hash', 'blockchain_hash', 
            'blockchain_transaction_id', 'created_at', 'updated_at'
        ]

class CertificateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = [
            'certificate_id', 'student_name', 'student_email',
            'course_name', 'certificate_type', 'issue_date', 
            'expiry_date', 'institution'
        ]

class CertificateVerifySerializer(serializers.Serializer):
    certificate_id = serializers.CharField(max_length=100)
    
class CertificateRevokeSerializer(serializers.ModelSerializer):
    revocation_reason = serializers.CharField(required=True)
    
    class Meta:
        model = Certificate
        fields = ['revocation_reason']
