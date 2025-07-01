from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import F
from .models import Postcard, Tag, TopicCluster, ColorCluster
from .serializers import PostcardSerializer, TagSerializer, TopicClusterSerializer, ColorClusterSerializer
import random
import math

class PostcardViewSet(viewsets.ModelViewSet):
    queryset = Postcard.objects.all()  # type: ignore
    serializer_class = PostcardSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['id', 'country', 
                        'topic_cluster__cluster_id', 'color_cluster__cluster_id',
                        'topic_cluster__label', 'color_cluster__label',
                        'tags__name']
    search_fields = ['title', 'country', 'topic_cluster__label', 'color_cluster__label']
    ordering_fields = ['title', 'country', 'avg_brightness', 'avg_saturation', 
                      'avg_color_red', 'avg_color_green', 'avg_color_blue',
                      'red_tendency', 'blue_tendency']

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()  # type: ignore
    serializer_class = TagSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    
    def get_queryset(self):
        queryset = Tag.objects.all()  # type: ignore
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset.order_by('name')

class TopicClusterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TopicCluster.objects.all()  # type: ignore
    serializer_class = TopicClusterSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['label', 'cluster_id']
    ordering_fields = ['label', 'cluster_id']
    
    def get_queryset(self):
        queryset = TopicCluster.objects.all()  # type: ignore
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(label__icontains=search)
        return queryset.order_by('label')

class ColorClusterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ColorCluster.objects.all()  # type: ignore
    serializer_class = ColorClusterSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['label', 'cluster_id']
    ordering_fields = ['label', 'cluster_id']
    
    def get_queryset(self):
        queryset = ColorCluster.objects.all()  # type: ignore
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(label__icontains=search)
        return queryset.order_by('label')

def debug_postcards(request):
    postcards = Postcard.objects.order_by('?')[:40]  # type: ignore
    return HttpResponse('<br>'.join([f"{p.image.url} - {p.country} - {p.topic_cluster.label} - {p.color_cluster.label}" for p in postcards]).encode('utf-8'))

def get_postcard(request):
    # Check if an ID is provided in the query parameters
    postcard_id = request.GET.get('id')
    
    if postcard_id:
        # Return specific postcard by ID
        try:
            postcard = Postcard.objects.get(id=postcard_id)  # type: ignore
            return JsonResponse({
                'id': postcard.id,
                'image_url': postcard.image.url,
                'title': postcard.title,
                'country': postcard.country,
                'topic_cluster_label': postcard.topic_cluster.label,  # type: ignore
                'color_cluster_label': postcard.color_cluster.label  # type: ignore
            })
        except Postcard.DoesNotExist:  # type: ignore
            return JsonResponse({'error': f'Postcard with ID {postcard_id} not found'}, status=404)
    else:
        # Return random postcard
        postcard = Postcard.objects.order_by('?').first()  # type: ignore
        if postcard:
            return JsonResponse({
                'id': postcard.id,
                'image_url': postcard.image.url,
                'title': postcard.title,
                'country': postcard.country,
                'topic_cluster_label': postcard.topic_cluster.label,  # type: ignore
                'color_cluster_label': postcard.color_cluster.label  # type: ignore
            })
        return JsonResponse({'error': 'No postcards available'}, status=404)

def similar_postcards(request, postcard_id):
    # Get limit parameter, default to 10, max 15
    try:
        limit = min(int(request.GET.get('limit', 10)), 15)
    except (ValueError, TypeError):
        limit = 10
    
    postcard = get_object_or_404(Postcard, id=postcard_id)
    similar = list(postcard.similar_postcards.all())  # Convert to list to get length
    
    # Limit the results
    similar = similar[:limit]
    
    return JsonResponse({
        'postcard': {
            'id': postcard.id,
            'title': postcard.title,
            'image_url': postcard.image.url,
            'country': postcard.country,
            'topic_cluster_label': postcard.topic_cluster.label,  # type: ignore
            'color_cluster_label': postcard.color_cluster.label  # type: ignore
        },
        'similar_postcards': [{
            'id': p.id,
            'title': p.title,
            'image_url': p.image.url,
            'country': p.country,
            'topic_cluster_label': p.topic_cluster.label,  # type: ignore
            'color_cluster_label': p.color_cluster.label  # type: ignore
        } for p in similar],
        'requested_limit': limit,
        'actual_count': len(similar),
        'total_available': postcard.similar_postcards.count()  # type: ignore
    })

def color_similar_postcards(request):
    # Get query parameters
    red = request.GET.get('red', 0)
    green = request.GET.get('green', 0)
    blue = request.GET.get('blue', 0)
    saturation = request.GET.get('saturation', 0)
    
    # Get limit parameter, default to 10, max 50
    try:
        limit = min(int(request.GET.get('limit', 10)), 500)
    except (ValueError, TypeError):
        limit = 10
    
    try:
        red = float(red)
        green = float(green)
        blue = float(blue)
        saturation = float(saturation)
    except ValueError:
        return JsonResponse({'error': 'Invalid color values. All values must be numbers.'}, status=400)
    
    postcards = Postcard.objects.all()  # type: ignore
    
    # Calculate color distance for each postcard
    postcards_with_distance = []
    for postcard in postcards:
        # Calculate Euclidean distance in 5D space (RGB + brightness + saturation)
        distance = math.sqrt(
            (red - float(postcard.avg_color_red)) ** 2 +
            (green - float(postcard.avg_color_green)) ** 2 +
            (blue - float(postcard.avg_color_blue)) ** 2 +
            (saturation - float(postcard.avg_saturation)) ** 2
        )
        postcards_with_distance.append((postcard, distance))
    
    # Sort by distance and get top results
    postcards_with_distance.sort(key=lambda x: x[1])
    closest_postcards = postcards_with_distance[:limit]
    
    return JsonResponse({
        'query_colors': {
            'red': red,
            'green': green,
            'blue': blue,
            'saturation': saturation
        },
        'closest_postcards': [{
            'id': postcard.id,
            'title': postcard.title,
            'image_url': postcard.image.url,
            'country': postcard.country,
            'topic_cluster_label': postcard.topic_cluster.label,  # type: ignore
            'color_cluster_label': postcard.color_cluster.label,  # type: ignore
            'distance': round(distance, 4),
            'postcard_colors': {
                'red': float(postcard.avg_color_red),
                'green': float(postcard.avg_color_green),
                'blue': float(postcard.avg_color_blue),
                'saturation': float(postcard.avg_saturation)
            }
        } for postcard, distance in closest_postcards],
        'requested_limit': limit,
        'actual_count': len(closest_postcards),
        'total_available': len(postcards_with_distance)
    })

def get_tags(request):
    # This function is now deprecated in favor of TagViewSet
    # TODO: if not used remove it
    tags = Tag.objects.all()  # type: ignore
    return JsonResponse({
        'tags': [{
            'id': tag.id,
            'name': tag.name
        } for tag in tags]
    })