from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.db import models


class Entity(models.Model):

    class Meta:
        verbose_name_plural = "entities"

    class Type(models.IntegerChoices):
        STANDARD = 0, 'standard'
        SCHOOL = 1, 'school'
        COMPANY = 2, 'company'

    name = models.CharField(max_length=254)
    type = models.IntegerField(choices=Type.choices, default=Type.STANDARD)
    address = models.CharField(max_length=254)
    zip_code = models.CharField(max_length=254)
    city = models.CharField(max_length=254)
    country = models.CharField(max_length=254)
    phone = models.CharField(max_length=15)
    email = models.EmailField()

    def __str__(self):
        return f'{ Entity.Type(self.type).label} : {self.name}'


class User(AbstractUser):

    email = models.EmailField(
        _("email address"),
        unique=True,
        help_text=_(
            "Required. 254 characters or fewer. Email format only."
        ),
        error_messages={
            "unique": _("A user with this email already exists."),
        }
    )

    phone = models.CharField(max_length=15)
    entity = models.ForeignKey(Entity, on_delete=models.SET_NULL, null=True)
