from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Type(models.IntegerChoices):
        STANDARD = 0, "standard"
        ADMIN = 1, "administrateur"
        SCHOOL = 2, "école"
        COMPANY = 3, "entreprise"

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

    phone = models.CharField(max_length=15, null=True)
    entity = models.CharField(max_length=254, null=True)
    type = models.IntegerField(choices=Type.choices, default=Type.STANDARD)
