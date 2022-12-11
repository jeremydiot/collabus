
import csv
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import Group


class Command(BaseCommand):

    def handle(self, *args, **options):
        # populate groups table
        with open(settings.DATA_DIR / 'database' / 'groups.csv', 'r', encoding='utf-8') as file:
            for row in csv.DictReader(file, delimiter=','):
                Group.objects.update_or_create(
                    pk=row['id'],
                    defaults={'name': row['name']}
                )
