from rest_framework import viewsets, filters
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Postcard
from .serializers import PostcardSerializer
import random

class PostcardViewSet(viewsets.ModelViewSet):
    queryset = Postcard.objects.all()  # type: ignore
    serializer_class = PostcardSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country'] #TODO set to correct fields from data analysis

def debug_postcards(request):
    postcards = Postcard.objects.order_by('?')[:40]  # type: ignore
    return HttpResponse('<br>'.join([f"{p.image.url} - {p.country} - {p.topic_cluster.label} - {p.color_cluster.label}" for p in postcards]).encode('utf-8'))

def random_postcard(request):
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
    postcard = get_object_or_404(Postcard, id=postcard_id)
    similar = postcard.similar_postcards.all()[:10]  # type: ignore
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
        } for p in similar]
    })