from django.db import models
    
class TopicCluster(models.Model):
    cluster_id = models.IntegerField(unique=True)
    label = models.CharField(max_length=100)

class ColorCluster(models.Model):
    cluster_id = models.IntegerField(unique=True)
    label = models.CharField(max_length=100)

class Tag(models.Model):
    name = models.CharField(max_length=50)

class Postcard(models.Model):
    title = models.CharField(max_length=255)
    country = models.CharField(max_length=4, blank=True, default='UNKN')
    image = models.ImageField(upload_to='postcards/')
    
    color_cluster = models.ForeignKey(ColorCluster, on_delete=models.SET_NULL, null=True)
    topic_cluster = models.ForeignKey(TopicCluster, on_delete=models.SET_NULL, null=True)
    
    avg_color_red = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    avg_color_green = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    avg_color_blue = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    
    avg_brightness = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    avg_saturation = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    
    red_tendency = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    blue_tendency = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    
    tags = models.ManyToManyField(Tag)
    similar_postcards = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return f"Postcard: {self.title}, {self.country}, color: {self.color_cluster.label}, topic: {self.topic_cluster.label}"  # type: ignore