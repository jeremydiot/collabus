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
        'is_staff',
        'is_active',
        'is_superuser',
        'pk',
        'phone',
        'entity',
        'last_login',
        'date_joined',
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'entity',)
    search_fields = ('username', 'first_name', 'last_name', 'email',)
    ordering = ('username',)
    filter_horizontal = (
        'groups',
        'user_permissions',
    )


class EntityAdmin(admin.ModelAdmin):
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


admin.site.register(get_user_model(), _UserAdmin)
admin.site.register(Entity, EntityAdmin)
admin.site.unregister(Group)
