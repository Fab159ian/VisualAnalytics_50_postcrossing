from django.db import models

class Postcard(models.Model):
    title = models.CharField(max_length=255)
    country = models.CharField(max_length=4, blank=True, default='UNKN')
    image = models.ImageField(upload_to='postcards/')
    #TODO add other info from clustering etc...

    def __str__(self):
        return f"Postcard: {self.title}"