# Generated by Django 4.1.3 on 2022-12-19 22:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('folder', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='message',
            name='folder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='folder.folder'),
        ),
        migrations.AddField(
            model_name='folderentity',
            name='entity',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.entity'),
        ),
        migrations.AddField(
            model_name='folderentity',
            name='folder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='folder.folder'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='folder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='folder.folder'),
        ),
        migrations.AlterUniqueTogether(
            name='folderentity',
            unique_together={('folder', 'entity')},
        ),
    ]
