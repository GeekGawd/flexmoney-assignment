# Generated by Django 5.0 on 2023-12-19 03:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yoga', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='offer',
            name='code',
            field=models.CharField(default='offer', max_length=30, unique=True),
            preserve_default=False,
        ),
    ]
