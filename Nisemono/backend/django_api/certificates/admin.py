from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_id', 'student_name', 'course_name', 'institution', 'status', 'issue_date']
    list_filter = ['status', 'certificate_type', 'institution', 'issue_date']
    search_fields = ['certificate_id', 'student_name', 'student_email', 'course_name']
    readonly_fields = ['certificate_hash', 'blockchain_hash', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Certificate Information', {
            'fields': ('certificate_id', 'student_name', 'student_email', 'course_name', 'certificate_type')
        }),
        ('Dates', {
            'fields': ('issue_date', 'expiry_date')
        }),
        ('Institution', {
            'fields': ('institution',)
        }),
        ('Blockchain & Hash', {
            'fields': ('certificate_hash', 'blockchain_hash', 'blockchain_transaction_id'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('status', 'revoked_at', 'revoked_by', 'revocation_reason')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
