from rest_framework import serializers
from .models import Postcard, Tag, TopicCluster, ColorCluster

class PostcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postcard
        fields = '__all__'

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