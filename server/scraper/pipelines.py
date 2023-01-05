# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scraperApp.models import Course, Information, Comment, Star, Percentage
from asgiref.sync import sync_to_async
from scraperApp.models import Portal
import pprint
import datetime
import logging

class ScraperPipeline(object):
    @sync_to_async
    def process_item(self, item, spider):
        portal = Portal.objects.get(name=getattr(spider, 'portal_name'))
        """ course = Course.objects.get(name=item['name'], portal=portal)
        if course:
            logging.log(logging.WARNING, 'Course {0} exists already! updating ...'.format(course.name))
            for key in item['information']:
                setattr(course.information, key, information[key])                
                course.information.save() 
         """
        
        information = {}
        if 'information' in item.keys():
            information = Information.objects.create(**item['information'])
        course = Course.objects.create(
            name=item['name'],
            link=item['link'] if 'link' in item.keys() else None,
            portal=portal,
            information=information,
            evaluation_count=item['evaluation_count']
        )

        if 'comments' in item.keys():
            entries = []
            for comment in item['comments']:
                comment['course'] = course
                comment['date'] = datetime.datetime.strptime(comment['date'], "%d.%m.%Y").strftime("%Y-%m-%d")
                entries.append(Comment(**comment))
            Comment.objects.bulk_create(entries)

        if 'star_reports' in item.keys():
            entries = []
            for report in item['star_reports']:
                report['course'] = course
                entries.append(Star(**report))
            Star.objects.bulk_create(entries)

        if 'reports_stats' in item.keys():
            entries = []
            for report in item['reports_stats']:
                report['course'] = course
                entries.append(Percentage(**report))
            Percentage.objects.bulk_create(entries)


        logging.log(logging.INFO, 'Successfully created course {0} from {1}'.format(course.name, portal.name))

        return item
