from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostcardViewSet
from .views import debug_postcards, random_postcard, similar_postcards

router = DefaultRouter()
router.register(r'postcards', PostcardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('debug/db/', debug_postcards),
    path('random-postcard/', random_postcard, name='random_postcard'),
    path('similar-postcards/<int:postcard_id>/', similar_postcards, name='similar_postcards')
]