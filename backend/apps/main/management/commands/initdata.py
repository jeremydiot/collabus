from django.core.management import BaseCommand, call_command
from django.contrib.auth import get_user_model


class Command(BaseCommand):

    def handle(self, *args, **options):

        call_command('loaddata', 'entities.yaml')
        call_command('loaddata', 'users.yaml')
        call_command('loaddata', 'folders.yaml')

        for user in get_user_model().objects.all():
            if not user.password.startswith('pbkdf2_sha256'):
                user.set_password(user.password)
                user.save()
