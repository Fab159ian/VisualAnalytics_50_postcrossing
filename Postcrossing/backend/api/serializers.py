from rest_framework import serializers
from .models import Postcard, Tag, TopicCluster, ColorCluster

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class TopicClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicCluster
        fields = ['id', 'cluster_id', 'label']

class ColorClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorCluster
        fields = ['id', 'cluster_id', 'label']

class PostcardSerializer(serializers.ModelSerializer):
    topic_cluster = TopicClusterSerializer(read_only=True)
    color_cluster = ColorClusterSerializer(read_only=True)
    
    class Meta:
        model = Postcard
        fields = [
            'id', 'title', 'country', 'image',
            'topic_cluster', 'color_cluster',
            'avg_color_red', 'avg_color_green', 'avg_color_blue',
            'avg_brightness', 'avg_saturation',
            'red_tendency', 'blue_tendency',
            'tags'
        ]