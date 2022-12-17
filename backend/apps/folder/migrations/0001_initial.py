# Generated by Django 4.1.3 on 2022-12-17 18:02

import apps.main.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=apps.main.utils.upload_to_file)),
                ('name', models.CharField(blank=True, max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254)),
                ('description', models.TextField()),
                ('note', models.TextField()),
                ('type', models.IntegerField(choices=[(0, 'unknow'), (1, 'website development'), (2, 'website design'), (3, 'graphic charter'), (4, 'communication strategy'), (5, 'digital strategy')], default=0)),
                ('is_closed', models.BooleanField(default=False)),
                ('is_hidden', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('deadline', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FolderEntity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_author', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
