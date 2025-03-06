from django.db import models
from django.urls import reverse

# Create your models here.
class UserKeywordClicks(models.Model):
    user_id = models.CharField(unique=True, max_length=500)
    keyword_clicks = models.JSONField(default=dict)
       
    def __str__(self):
        return f"{self.keyword_clicks}"
    
    
    