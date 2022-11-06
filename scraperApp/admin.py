from django.contrib import admin

# Register your models here.
from .models import Course

class scraperApp(admin.ModelAdmin):
    pass
admin.site.register(Course, scraperApp)