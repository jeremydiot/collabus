from django.db import models
from django.contrib.auth import get_user_model
from apps.main.utils import delete_file, upload_to_file


class FolderEntity(models.Model):
    folder = models.ForeignKey('folder.folder', on_delete=models.CASCADE)
    entity = models.ForeignKey('main.entity', on_delete=models.CASCADE)
    is_author = models.BooleanField(default=False)

    class Meta:
        unique_together = ('folder', 'entity',)


class Folder(models.Model):

    class Type(models.IntegerChoices):
        UNKNOW = 0, 'unknow'
        WEBSITE_DEVELOPMENT = 1, 'website development'
        WEBSITE_DESIGN = 2, 'website design'
        GRAPHIC_CHARTER = 3, 'graphic charter'
        COMMUNICATION_STRATEGY = 4, 'communication strategy'
        DIGITAL_STRATEGY = 5, 'digital strategy'

    name = models.CharField(max_length=254)
    description = models.TextField()
    note = models.TextField()
    type = models.IntegerField(choices=Type.choices, default=Type.UNKNOW)
    is_closed = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateField(null=True)

    def __str__(self):
        return f'{self.name} : {Folder.Type(self.type).label}'


# TODO delete file on delete row ? unique name file in folder storage ?
class Attachment(models.Model):
    folder = models.ForeignKey('folder.folder', on_delete=models.CASCADE)
    file = models.FileField(upload_to=upload_to_file)
    name = models.CharField(max_length=254, blank=True)

    def __init__(self, *args, **kwargs):
        self.original_file = getattr(self, 'file', None)
        super().__init__(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if getattr(self, 'file', None):
            delete_file(self.file.path)
        return super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        if not getattr(self, 'name', None):
            if getattr(self, 'file', None):
                self.name = self.file.name

        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Message(models.Model):
    folder = models.ForeignKey('folder.folder', on_delete=models.CASCADE)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
