from django.db import models
from django.contrib.auth.models import User

class Institution(models.Model):
    INSTITUTION_TYPES = [
        ('university', 'University'),
        ('college', 'College'),
        ('school', 'School'),
        ('training_center', 'Training Center'),
        ('government', 'Government Body'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('suspended', 'Suspended'),
        ('rejected', 'Rejected'),
    ]
    
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    institution_type = models.CharField(max_length=20, choices=INSTITUTION_TYPES)
    registration_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Digital signature related fields
    public_key = models.TextField(blank=True, null=True)
    public_key_uploaded_at = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_institutions')
    
    class Meta:
        db_table = 'institutions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.registration_number})"
