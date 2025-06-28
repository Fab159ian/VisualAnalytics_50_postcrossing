import os
import shutil
import ast
import time
import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings
from backend.api.models import Postcard, TopicCluster, ColorCluster, Tag
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.db.models.manager import Manager

class Command(BaseCommand):
    help = 'Load postcard images from data/postcards into the database and media folder'

    def add_arguments(self, parser):
        parser.add_argument(
            '--debug',
            action='store_true',
            help='Enable debug output for similar postcard linking',
        )

    def handle(self, *args, **options):
        start_time = time.time()
        debug = options['debug']
        original_image_dir = os.path.join(settings.BASE_DIR, 'data', 'postcards')
        media_dir = os.path.join(settings.MEDIA_ROOT, 'postcards')
        base_path = os.path.join(settings.BASE_DIR, 'data', 'clustering')

        # 1. Load cluster names (topic + color)
        topic_clusters = pd.read_csv(os.path.join(base_path, 'topic_clusters_summary.csv'))
        color_clusters = pd.read_csv(os.path.join(base_path, 'color_clusters_summary.csv'))

        for _, row in topic_clusters.iterrows():
            TopicCluster.objects.update_or_create(  # type: ignore
                cluster_id=row['topic_cluster'],
                defaults={'label': row['topic_name']}
            )

        for _, row in color_clusters.iterrows():
            ColorCluster.objects.update_or_create(  # type: ignore
                cluster_id=row['color_cluster'],
                defaults={'label': row['color_name']}
            )

        # 2. Load main postcard info
        rec_df = pd.read_csv(os.path.join(base_path, 'comprehensive_recommendations.csv'))
        color_cols = ['filename', 'avg_red', 'avg_green', 'avg_blue', 'brightness', 'saturation', 'red_tendency', 'blue_tendency']
        color_df = pd.read_csv(os.path.join(base_path, 'color_clusters.csv'), usecols=color_cols)  # type: ignore
        info_df = rec_df.merge(color_df, on="filename", how="left")
        os.makedirs(media_dir, exist_ok=True)
        for _, row in info_df.iterrows():
            original_name = str(row['filename'])
            title = original_name.replace('.jpg', '').replace('.png', '')

            topic_cluster = TopicCluster.objects.get(cluster_id=row['topic_cluster'])  # type: ignore
            color_cluster = ColorCluster.objects.get(cluster_id=row['color_cluster'])  # type: ignore

            source_path = os.path.join(original_image_dir, original_name)
            if not os.path.exists(source_path):
                self.stdout.write(self.style.WARNING(f"Image not found for {title}, skipping."))  # type: ignore
                continue
            
            # Copy image to media/postcards
            dest_path = os.path.join(media_dir, original_name)
            relative_path = os.path.join('postcards', original_name)

            if not os.path.exists(dest_path):
                shutil.copy2(source_path, dest_path)

            postcard, _ = Postcard.objects.update_or_create(  # type: ignore
                title=title,
                defaults={
                    'country': row['country_code'] if row['country_code'] != 'ANONYMOUS' else 'UNKN',
                    'image': relative_path,
                    'topic_cluster': topic_cluster,
                    'color_cluster': color_cluster,
                    'avg_color_red': row['avg_red'],
                    'avg_color_green': row['avg_green'],
                    'avg_color_blue': row['avg_blue'],
                    'avg_brightness': row['brightness'],
                    'avg_saturation': row['saturation'],
                    'red_tendency': row['red_tendency'],
                    'blue_tendency': row['blue_tendency'],
                }
            )

        # 3. Assign tags
        tag_df = pd.read_csv(os.path.join(base_path, 'postcard_tags_gpu.csv'))
        merged_df = pd.read_csv(os.path.join(settings.BASE_DIR, 'data', 'merged_labels.csv'), usecols=['filename', 'original_name'])  # type: ignore
        tag_df = tag_df.merge(merged_df, on="filename", how="left")
        for _, row in tag_df.iterrows():
            tags = str(row['tags']).split(";")
            title = str(row['original_name']).replace('.jpg', '').replace('.png', '')
            try:
                postcard = Postcard.objects.get(title=title)  # type: ignore
                for tag_name in tags:
                    tag, _ = Tag.objects.get_or_create(name=tag_name)  # type: ignore
                    postcard.tags.add(tag)
            except Postcard.DoesNotExist:  # type: ignore
                continue

        # 4. Link similar postcards
        if debug:
            print("Linking similar postcards...")
        linked_count = 0
        for _, row in info_df.iterrows():
            original_name = str(row['filename'])
            title = original_name.replace('.jpg', '').replace('.png', '')
            source = Postcard.objects.filter(title=title).first()  # type: ignore
            if not source:
                if debug:
                    print(f"Source postcard not found for title: {title}")
                continue
            try:
                similar_filenames = ast.literal_eval(str(row["topic_similar_images"]))
                if debug:
                    print(f"Found {len(similar_filenames)} similar images for {title}")
            except Exception as e:
                if debug:
                    print(f"Could not parse similar images for {title}: {e}")
                continue
            
            for filename in similar_filenames:
                title = filename.strip().replace('.jpg', '').replace('.png', '')
                target = Postcard.objects.filter(title=title).first()  # type: ignore
                if target:
                    source.similar_postcards.add(target)
                    linked_count += 1
        
        if debug:
            print(f"Linked {linked_count} similar postcard relationships")
        elapsed_time = time.time() - start_time
        self.stdout.write(self.style.SUCCESS(f'Postcards loaded/updated!'))  # type: ignore
        self.stdout.write(self.style.SUCCESS(f"Execution time: {elapsed_time:.2f} seconds"))  # type: ignore