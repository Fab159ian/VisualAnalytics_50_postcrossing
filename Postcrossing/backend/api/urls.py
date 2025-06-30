from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostcardViewSet, TagViewSet, TopicClusterViewSet, ColorClusterViewSet
from .views import debug_postcards, get_postcard, similar_postcards, color_similar_postcards, get_tags

router = DefaultRouter()
router.register(r'postcards', PostcardViewSet)
router.register(r'tags', TagViewSet)
router.register(r'topic-clusters', TopicClusterViewSet)
router.register(r'color-clusters', ColorClusterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('debug/db/', debug_postcards),
    path('get-postcard/', get_postcard, name='get_postcard'),
    path('similar-postcards/<int:postcard_id>/', similar_postcards, name='similar_postcards'),
    path('color-similar/', color_similar_postcards, name='color_similar_postcards'),
    path('tags/', get_tags, name='get_tags'),
]