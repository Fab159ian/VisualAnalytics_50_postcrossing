from rest_framework import viewsets, filters
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Postcard
from .serializers import PostcardSerializer
import random

class PostcardViewSet(viewsets.ModelViewSet):
    queryset = Postcard.objects.all()
    serializer_class = PostcardSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country'] #TODO set to correct fields from data analysis

def debug_postcards(request):
    postcards = Postcard.objects.order_by('?')[:40]
    return HttpResponse('<br>'.join([f"{p.image.url} - {p.country} - {p.topic_cluster.label} - {p.color_cluster.label}" for p in postcards]))

def random_postcard(request):
    postcard = Postcard.objects.order_by('?').first()
    if postcard:
        return JsonResponse({
            'image_url': postcard.image.url,
            'title': postcard.title,
            'country': postcard.country,
            'topic_cluster_label': postcard.topic_cluster.label,
            'color_cluster_label': postcard.color_cluster.label
        })
    return JsonResponse({'error': 'No postcards available'}, status=404)