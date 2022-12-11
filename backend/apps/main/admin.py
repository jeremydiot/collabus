from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Entity


UserAdmin.list_display += ('pk', 'phone', 'entity')
UserAdmin.fieldsets += (('Champs supplémentaires', {'fields': ('phone', 'entity',)},),)

admin.site.register(get_user_model(), UserAdmin)
admin.site.register(Entity)
