from django.db import models
from django.contrib.auth.models import User
from certificates.models import Certificate

class VerificationLog(models.Model):
    VERIFICATION_STATUS = [
        ('valid', 'Valid'),
        ('invalid', 'Invalid'),
        ('suspicious', 'Suspicious'),
        ('revoked', 'Revoked'),
    ]
    
    AI_FRAUD_RESULTS = [
        ('clean', 'Clean'),
        ('suspicious', 'Suspicious'),
        ('fraudulent', 'Fraudulent'),
        ('needs_review', 'Needs Manual Review'),
    ]
    
    # Verification details
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='verification_logs')
    verifier_ip = models.GenericIPAddressField()
    verifier_user_agent = models.TextField(blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS)
    
    # AI/ML Fraud Detection Results
    ai_fraud_score = models.FloatField(blank=True, null=True)  # 0.0 to 1.0
    ai_fraud_result = models.CharField(max_length=20, choices=AI_FRAUD_RESULTS, blank=True, null=True)
    ai_fraud_details = models.JSONField(blank=True, null=True)  # Store detailed AI analysis
    
    # Verification metadata
    verified_at = models.DateTimeField(auto_now_add=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verifications')
    verification_method = models.CharField(max_length=50, default='api')  # api, web, mobile, etc.
    
    # Additional context
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'verification_logs'
        ordering = ['-verified_at']
        indexes = [
            models.Index(fields=['verified_at']),
            models.Index(fields=['verification_status']),
            models.Index(fields=['ai_fraud_result']),
        ]
    
    def __str__(self):
        return f"Verification of {self.certificate.certificate_id} at {self.verified_at}"

class AuditLog(models.Model):
    ACTION_TYPES = [
        ('certificate_created', 'Certificate Created'),
        ('certificate_updated', 'Certificate Updated'),
        ('certificate_revoked', 'Certificate Revoked'),
        ('institution_verified', 'Institution Verified'),
        ('institution_suspended', 'Institution Suspended'),
        ('verification_performed', 'Verification Performed'),
        ('fraud_detected', 'Fraud Detected'),
    ]
    
    # Audit details
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES)
    object_type = models.CharField(max_length=50)  # certificate, institution, etc.
    object_id = models.CharField(max_length=100)
    
    # User and metadata
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    # Change details
    old_values = models.JSONField(blank=True, null=True)
    new_values = models.JSONField(blank=True, null=True)
    
    # Timestamp
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['action_type']),
            models.Index(fields=['object_type']),
        ]
    
    def __str__(self):
        return f"{self.action_type} on {self.object_type} {self.object_id}"
