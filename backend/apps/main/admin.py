from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

admin.site.register(get_user_model(), UserAdmin)
UserAdmin.list_display += ('phone', 'entity')
UserAdmin.fieldsets += (('Champs supplémentaires', {'fields': ('phone', 'entity',)},),)
