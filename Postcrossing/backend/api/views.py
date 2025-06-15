from rest_framework import viewsets
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Postcard
from .serializers import PostcardSerializer
import random

class PostcardViewSet(viewsets.ModelViewSet):
    queryset = Postcard.objects.all()
    serializer_class = PostcardSerializer

def debug_postcards(request):
    postcards = Postcard.objects.order_by('?')[:40]
    return HttpResponse('<br>'.join([f"{p.image.url} - {p.country}" for p in postcards]))

def random_postcard(request):
    postcard = Postcard.objects.order_by('?').first()
    if postcard:
        return JsonResponse({
            'image_url': postcard.image.url,
            'title': postcard.title,
            'country': postcard.country
        })
    return JsonResponse({'error': 'No postcards available'}, status=404)