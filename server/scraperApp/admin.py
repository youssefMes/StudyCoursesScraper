from django.contrib import admin

# Register your models here.
from .models import Course, Information, Comment, Rating, Percentage, Star, Portal, History

class scraperApp(admin.ModelAdmin):
    pass
admin.site.register(Course, scraperApp)
admin.site.register(Information, scraperApp)
admin.site.register(Comment, scraperApp)
admin.site.register(Percentage, scraperApp)
admin.site.register(Star, scraperApp)
admin.site.register(Portal, scraperApp)
admin.site.register(History, scraperApp)
