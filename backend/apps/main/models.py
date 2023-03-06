from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.main.utils import ModelTimeStampMixin


class Entity(ModelTimeStampMixin):

    class Meta:
        verbose_name_plural = "entities"

    class Kind(models.IntegerChoices):
        UNKNOWN = 1, 'unknown'
        SCHOOL = 2, 'school'
        COMPANY = 3, 'company'

    name = models.CharField(max_length=254)
    kind = models.IntegerField(choices=Kind.choices, default=Kind.UNKNOWN)
    address = models.CharField(max_length=254)
    zip_code = models.CharField(max_length=254)
    city = models.CharField(max_length=254)
    country = models.CharField(max_length=254)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    siret = models.CharField(max_length=14, blank=True)
    activity = models.CharField(max_length=254)

    def __str__(self):
        return f'{ Entity.Kind(self.kind).label} : {self.name}'


# TODO set is_entity_staff to false when entity is null
class User(AbstractUser):

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    entity = models.ForeignKey('main.entity', on_delete=models.SET_NULL, null=True)
    is_entity_staff = models.BooleanField(default=False)
