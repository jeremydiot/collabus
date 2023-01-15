from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from .models import Entity


class _UserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password',)}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'entity',)}),
        (
            'Permissions',
            {
                'fields': (
                    'is_active',
                    'is_entity_staff',
                    'is_staff',
                    'is_superuser',
                ),
            },
        ),
    )
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'is_entity_staff',
        'entity',
        'is_active',
        'pk',
        'phone',
        'last_login',
        'date_joined',
        'is_staff',
        'is_superuser'
    )
    list_filter = ('is_entity_staff', 'is_active', 'entity',)
    search_fields = ('username', 'first_name', 'last_name', 'email', 'entity__name', 'entity__email')
    ordering = ('username',)


admin.site.register(get_user_model(), _UserAdmin)
admin.site.unregister(Group)


class EntityAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('name', 'kind', 'address', 'zip_code', 'city', 'country', 'phone', 'email', 'siret',)}),
    )
    list_display = (
        'name',
        'kind',
        'address',
        'zip_code',
        'city',
        'country',
        'phone',
        'email',
        'siret',
        'pk',
        'updated_at',
        'created_at',
    )
    list_filter = ('kind', 'city', 'country',)
    search_fields = ('name', 'email', 'siret', 'phone', 'address',)
    ordering = ('name',)


admin.site.register(Entity, EntityAdmin)
