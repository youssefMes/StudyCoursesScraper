# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scraperApp.models import Course, Information, Comment
from asgiref.sync import sync_to_async
from scraperApp.models import Portal
import pprint
import datetime


def clean_name(param):
    return param

def clean_critics_consensus(param):
    return ' '.join(param)

def clean_average_grade(param):
    param = param.strip().replace('/5', '')
    return param

def clean_poster(param):
    if param:
        param = param[0]['path']
    return param

def clean_amount_reviews(param):
    return param.strip()

def clean_approval_percentage(param):
    return param.strip().replace('%', '')


class ScraperPipeline(object):
    @sync_to_async
    def process_item(self, item, spider):
        portal = Portal.objects.get(name=getattr(spider, 'portal_name'))
        #pp = pprint.PrettyPrinter(depth=2)
        #pp.pprint(item)
        information = {}
        if 'information' in item.keys():
            information = Information.objects.create(**item['information'])
        course = Course.objects.create(
            name=item['name'],
            link=item['link'],
            portal=portal,
            information=information
        )

        if 'comments' in item.keys():
            entries = []
            for comment in item['comments']:
                comment['course'] = course
                comment['date'] = datetime.datetime.strptime(comment['date'], "%d.%m.%Y").strftime("%Y-%m-%d")
                entries.append(Comment(**comment))
            Comment.objects.bulk_create(entries)

        return item
