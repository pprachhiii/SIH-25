from django.db import models
from django.contrib.auth.models import User
from institutions.models import Institution

class UserRole(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('institution_admin', 'Institution Admin'),
        ('verifier', 'Verifier'),
        ('auditor', 'Auditor'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_role')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_roles'
        unique_together = ['user', 'role', 'institution']
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

class NodeAuthToken(models.Model):
    """
    Model to store and validate tokens from Node.js auth service
    """
    token_hash = models.CharField(max_length=256, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='node_tokens')
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'node_auth_tokens'
        indexes = [
            models.Index(fields=['token_hash']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"Token for {self.user.username}"
