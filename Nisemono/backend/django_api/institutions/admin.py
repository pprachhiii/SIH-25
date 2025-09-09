from django.contrib import admin
from .models import Institution

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ['name', 'registration_number', 'institution_type', 'status', 'created_at']
    list_filter = ['status', 'institution_type', 'created_at']
    search_fields = ['name', 'registration_number', 'email']
    readonly_fields = ['created_at', 'updated_at', 'verified_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'email', 'phone', 'address')
        }),
        ('Institution Details', {
            'fields': ('institution_type', 'registration_number', 'status')
        }),
        ('Digital Signature', {
            'fields': ('public_key', 'public_key_uploaded_at'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'verified_at', 'verified_by'),
            'classes': ('collapse',)
        }),
    )
