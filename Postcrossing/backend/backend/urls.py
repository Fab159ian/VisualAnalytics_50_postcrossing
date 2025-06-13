from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static
import os

def home(request):
    return HttpResponse("This is the Postcard Project 50 API backend.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    #path('', home), #Temporary home page
    re_path(r'^$', TemplateView.as_view(template_name="index.html")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)