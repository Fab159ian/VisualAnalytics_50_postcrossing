import subprocess
from django.core.management.base import BaseCommand, CommandError
import os

class Command(BaseCommand):
    help = 'Build the React frontend and sync it to Django static directory'

    def handle(self, *args, **kwargs):
        script_path = os.path.abspath('build_and_sync_frontend.sh')

        if not os.path.exists(script_path):
            raise CommandError(f"Script not found: {script_path}")

        self.stdout.write(f"Running: {script_path}")

        try:
            result = subprocess.run(
                [script_path],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            self.stdout.write(self.style.SUCCESS("Frontend build and sync successful!"))
            self.stdout.write(result.stdout)

        except subprocess.CalledProcessError as e:
            self.stderr.write(self.style.ERROR("ERROR Frontend build failed:"))
            self.stderr.write(e.stderr)
            raise CommandError("Build process failed.")
