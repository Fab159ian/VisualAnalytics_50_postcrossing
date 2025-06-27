from django.core.management.base import BaseCommand
from backend.api.models import Postcard
import os
import time

class Command(BaseCommand):
    help = 'Delete all Postcard entries and their image files'

    def handle(self, *args, **options):
        start_time = time.time()
        for postcard in Postcard.objects.all():
            if postcard.image:
                if os.path.isfile(postcard.image.path):
                    os.remove(postcard.image.path)
        Postcard.objects.all().delete()
        elapsed_time = time.time() - start_time
        self.stdout.write(self.style.SUCCESS('All postcards and image files deleted.'))
        self.stdout.write(self.style.SUCCESS(f"Execution time: {elapsed_time:.2f} seconds"))
