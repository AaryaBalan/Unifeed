# Generated by Django 5.1.6 on 2025-03-05 23:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feed',
            name='categories',
        ),
    ]
