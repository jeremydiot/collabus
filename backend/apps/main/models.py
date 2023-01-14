from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.main.utils import ModelTimeStampMixin


class Entity(ModelTimeStampMixin):

    class Meta:
        verbose_name_plural = "entities"

    class Kind(models.IntegerChoices):
        STAFF = 0, 'staff'
        SCHOOL = 1, 'school'
        COMPANY = 2, 'company'

    name = models.CharField(max_length=254)
    kind = models.IntegerField(choices=Kind.choices)
    address = models.CharField(max_length=254)
    zip_code = models.CharField(max_length=254)
    city = models.CharField(max_length=254)
    country = models.CharField(max_length=254)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    siret = models.CharField(max_length=14)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f'{ Entity.Kind(self.kind).label} : {self.name}'


class User(AbstractUser):

    email = models.EmailField(
        "email address",
        unique=True,
        error_messages={
            "unique": "A user with this email already exists.",
        }
    )

    phone = models.CharField(max_length=15)
    entity = models.ForeignKey('main.entity', on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
