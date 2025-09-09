from rest_framework import serializers
from .models import Institution

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            'id', 'name', 'email', 'phone', 'address', 
            'institution_type', 'registration_number', 'status',
            'public_key', 'public_key_uploaded_at',
            'created_at', 'updated_at', 'verified_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'verified_at', 'verified_by']

class InstitutionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            'name', 'email', 'phone', 'address', 
            'institution_type', 'registration_number'
        ]

class InstitutionStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['status']
        
class InstitutionPublicKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['public_key']
