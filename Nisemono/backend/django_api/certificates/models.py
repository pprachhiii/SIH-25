from django.db import models
from django.contrib.auth.models import User
from institutions.models import Institution
import hashlib

class Certificate(models.Model):
    CERTIFICATE_TYPES = [
        ('degree', 'Degree Certificate'),
        ('diploma', 'Diploma Certificate'),
        ('course', 'Course Completion'),
        ('achievement', 'Achievement Certificate'),
        ('participation', 'Participation Certificate'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('revoked', 'Revoked'),
        ('expired', 'Expired'),
    ]
    
    # Basic certificate info
    certificate_id = models.CharField(max_length=100, unique=True)
    student_name = models.CharField(max_length=255)
    student_email = models.EmailField()
    course_name = models.CharField(max_length=255)
    certificate_type = models.CharField(max_length=20, choices=CERTIFICATE_TYPES)
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    
    # Institution relationship
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='certificates')
    
    # Blockchain and hash fields
    certificate_hash = models.CharField(max_length=64)  # SHA-256 hash
    blockchain_hash = models.CharField(max_length=100, blank=True, null=True)
    blockchain_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    revoked_at = models.DateTimeField(blank=True, null=True)
    revoked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='revoked_certificates')
    revocation_reason = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'certificates'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['certificate_id']),
            models.Index(fields=['student_email']),
            models.Index(fields=['status']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.certificate_hash:
            # Generate SHA-256 hash of certificate data
            cert_data = f"{self.certificate_id}{self.student_name}{self.student_email}{self.course_name}{self.issue_date}"
            self.certificate_hash = hashlib.sha256(cert_data.encode()).hexdigest()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.certificate_id} - {self.student_name}"
