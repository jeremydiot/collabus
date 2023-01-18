from django.contrib import admin
from apps.folder.models import Folder, FolderEntity, Attachment, Message


class MessageInline(admin.TabularInline):
    model = Message
    fk_name = 'folder'
    extra = 1


class AttachmentInline(admin.TabularInline):
    model = Attachment
    fk_name = 'folder'
    extra = 1


class FolderEntityInline(admin.TabularInline):
    model = FolderEntity
    fk_name = 'folder'
    extra = 1


class FolderAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'kind',
        'is_closed',
        'is_verified',
        'is_hidden',
        'deadline',
        'created_at',
        'updated_at',
        'pk'
    )
    inlines = [FolderEntityInline, AttachmentInline, MessageInline]


admin.site.register(Folder, FolderAdmin)
