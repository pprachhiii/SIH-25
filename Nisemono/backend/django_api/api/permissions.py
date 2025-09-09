from rest_framework.permissions import BasePermission
from authentication.models import UserRole

class IsSuperAdmin(BasePermission):
    """
    Custom permission to only allow super admins to access certain views.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_role = request.user.user_role
            return user_role.role == 'super_admin' and user_role.is_active
        except UserRole.DoesNotExist:
            return False

class IsInstitutionAdmin(BasePermission):
    """
    Custom permission to only allow institution admins to access their own data.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_role = request.user.user_role
            return user_role.role in ['super_admin', 'institution_admin'] and user_role.is_active
        except UserRole.DoesNotExist:
            return False
    
    def has_object_permission(self, request, view, obj):
        try:
            user_role = request.user.user_role
            if user_role.role == 'super_admin':
                return True
            elif user_role.role == 'institution_admin':
                # Institution admins can only access their own institution's data
                if hasattr(obj, 'institution'):
                    return obj.institution == user_role.institution
                elif hasattr(obj, 'id') and obj.__class__.__name__ == 'Institution':
                    return obj == user_role.institution
            return False
        except UserRole.DoesNotExist:
            return False

class IsVerifier(BasePermission):
    """
    Custom permission for verifiers - can only verify certificates.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_role = request.user.user_role
            return user_role.role in ['super_admin', 'institution_admin', 'verifier'] and user_role.is_active
        except UserRole.DoesNotExist:
            return False

class IsAuditor(BasePermission):
    """
    Custom permission for auditors - read-only access.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Auditors only have read access
        if request.method not in ['GET', 'HEAD', 'OPTIONS']:
            return False
        
        try:
            user_role = request.user.user_role
            return user_role.is_active
        except UserRole.DoesNotExist:
            return False
