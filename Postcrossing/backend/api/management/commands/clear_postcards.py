from django.core.management.base import BaseCommand
from backend.api.models import Postcard
import os

class Command(BaseCommand):
    help = 'Delete all Postcard entries and their image files'

    def handle(self, *args, **options):
        for postcard in Postcard.objects.all():
            if postcard.image:
                if os.path.isfile(postcard.image.path):
                    os.remove(postcard.image.path)
        Postcard.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All postcards and image files deleted.'))
