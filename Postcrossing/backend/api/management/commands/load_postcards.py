import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from backend.api.models import Postcard  # Replace with your app/model if different

class Command(BaseCommand):
    help = 'Load postcard images from data/postcards into the database and media folder'

    def handle(self, *args, **options):
        originals_dir = os.path.join(settings.BASE_DIR, 'data', 'postcards')
        media_dir = os.path.join(settings.MEDIA_ROOT, 'postcards')

        os.makedirs(media_dir, exist_ok=True)

        loaded = 0
        skipped = 0

        for filename in os.listdir(originals_dir):
            if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                skipped += 1
                continue

            source_path = os.path.join(originals_dir, filename)
            dest_path = os.path.join(media_dir, filename)

            if os.path.exists(dest_path):
                self.stdout.write(self.style.WARNING(f'Skipping {filename} (already exists)'))
                skipped += 1
                continue

            shutil.copy2(source_path, dest_path)
            relative_path = os.path.join('postcards', filename)

            parts = filename.split('-')
            country = parts[0] if parts[0] != "ANONYMOUS" else "UNKN"
            id = parts[1]
            title = country + "_" + id

            Postcard.objects.create(
                title=title,
                country=country,
                image=relative_path
            )
            loaded += 1

        self.stdout.write(self.style.SUCCESS(f'Postcards loaded: {loaded}, skipped: {skipped}'))
