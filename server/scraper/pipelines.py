# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scraperApp.models import Course, Information, Comment, Star, Percentage, Logo
from asgiref.sync import sync_to_async
from scraperApp.models import Portal
import pprint
import datetime
import logging, requests
from django.core import files
from io import BytesIO

class ScraperPipeline(object):
    @sync_to_async
    def process_item(self, item, spider):
        portal = Portal.objects.get(name=getattr(spider, 'portal_name'))
        course = Course.objects.filter(name=item['name'], portal=portal).first()
        if course:
            logging.log(logging.WARNING, 'Course {0} exists already! updating ...'.format(course.name))
            for key in item['information']:
                setattr(course.information, key, item['information'][key])           
                course.information.save()
            if 'comments' in item.keys():
                entries = []
                for comment in item['comments']:
                    comment_record = Comment.objects.filter(portal=portal, title=comment['title'], course=course, course__information__university=course.information.university)
                    if not comment_record.exists():
                        comment['course'] = course
                        comment['date'] = datetime.datetime.strptime(comment['date'], "%d.%m.%Y").strftime("%Y-%m-%d")
                        entries.append(Comment(**comment))
                if len(entries) > 0:
                    Comment.objects.bulk_create(entries)
            
            if 'star_reports' in item.keys():
                for report in item['star_reports']:
                    Star.objects.update_or_create(course=course, name=report['name'], defaults={'value': report['value']})

            if 'reports_stats' in item.keys():
                for report in item['reports_stats']:
                    Percentage.objects.update_or_create(course=course, title=report['title'], defaults={'value': report['value']})
        else:
            information = {}
            if 'information' in item.keys():
                information = self.create_course_information(item['information'])
            logo = None
            if 'logo' in item.keys():
                logo = self.create_logo(item['logo'])
            link = item['link'] if 'link' in item.keys() else None
            evaluation_count = item['evaluation_count'] if 'evaluation_count' in item.keys() else None
            course = self.create_course(item['name'], portal, link, information, logo, evaluation_count)
            
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

    @staticmethod
    def create_course_information(information):
        return Information.objects.create(**information)
    
    @staticmethod
    def create_course(name, portal, link, information, logo , evaluation_count):
        return Course.objects.create(
            name=name,
            link=link,
            portal=portal,
            information=information,
            evaluation_count=evaluation_count,
            logo=logo
        )

    @staticmethod
    def create_logo(logo_url):
        response = requests.get(logo_url)
        fp = BytesIO()
        fp.write(response.content)
        file_name = logo_url.split('/')[-1]
        file_name = file_name.split('?')[0]
        found = Logo.objects.filter(path=file_name).exists()
        if found:
            return Logo.objects.get(path=file_name)
        else:
            logo = Logo(path=file_name)
            logo.image.save(file_name, files.File(fp))
            return logo
