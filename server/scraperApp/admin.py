from django.contrib import admin

# Register your models here.
from .models import Course, Information, Comment, Rating, Percentage, Star, Portal, History

class scraperApp(admin.ModelAdmin):
    pass
admin.site.register([Course, Information, Comment, Percentage, Star, Portal, History], scraperApp)
