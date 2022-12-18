from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Entity


UserAdmin.list_display += ('pk', 'phone', 'entity')
UserAdmin.fieldsets += (('Additional fields', {'fields': ('phone', 'entity',)},),)

admin.site.register(get_user_model(), UserAdmin)


class EntityAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'type',
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


admin.site.register(Entity, EntityAdmin)
