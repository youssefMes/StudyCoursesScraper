# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy_djangoitem import DjangoItem
from scraperApp.models import Course
from scrapy.item import Field
from itemloaders.processors import TakeFirst, Identity

class CourseItem(DjangoItem):
    django_model = Course
    comments = Field(
        input_processor=Identity(),
        output_processor=Identity()
    )

class ScraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
