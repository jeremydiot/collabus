from django.db import models
from django.contrib.auth import get_user_model
from apps.main.utils import delete_file, upload_to_file
from apps.main.utils import ModelTimeStampMixin

from apps.main.models import Entity


# TODO restrict school entities queryset in admin
# TODO maximum 2 entity accepted per folder, author can't be removed, minimum 1 entity per folder
class FolderEntity(ModelTimeStampMixin):
    folder = models.ForeignKey('folder.folder', on_delete=models.CASCADE)
    entity = models.ForeignKey('main.entity', on_delete=models.CASCADE)
    is_author = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):

        if getattr(self, 'entity', None):
            if not self.pk and self.entity.kind == Entity.Kind.COMPANY:  # pylint: disable=no-member
                self.is_author = True
                self.is_accepted = True

        return super().save(*args, **kwargs)

    class Meta:
        unique_together = ('folder', 'entity',)
        verbose_name_plural = "folderentities"


class Folder(ModelTimeStampMixin):

    class Kind(models.IntegerChoices):
        WEBSITE_DEVELOPMENT = 1, 'website development'
        WEBSITE_DESIGN = 2, 'website design'
        GRAPHIC_CHARTER = 3, 'graphic charter'
        COMMUNICATION_STRATEGY = 4, 'communication strategy'
        DIGITAL_STRATEGY = 5, 'digital strategy'

    name = models.CharField(max_length=254)
    kind = models.IntegerField(choices=Kind.choices)
    is_closed = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    deadline = models.DateField(null=True, blank=True)
    description = models.TextField()
    note = models.TextField()

    def __str__(self):
        return f'{self.name} : {Folder.Kind(self.kind).label}'


# TODO disable file change to prevent unfollowed file storage
class Attachment(ModelTimeStampMixin):
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


# TODO restrict to associated author queryset in admin
class Message(ModelTimeStampMixin):
    folder = models.ForeignKey('folder.folder', on_delete=models.CASCADE)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
