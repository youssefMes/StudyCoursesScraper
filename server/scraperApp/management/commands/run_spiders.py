from django.core.management.base import BaseCommand, CommandError
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scraper.spiders import studycheckSpider, medienStudierenSpider, studiengaengeZeitSpider
from scrapy.settings import Settings
from scraper import settings as my_settings
import logging
logging.getLogger('scrapy').setLevel(logging.ERROR)

class Command(BaseCommand):
    help = 'Run scrapy spiders'

    def handle(self, *args, **options):
        crawler_settings = Settings()
        crawler_settings.setmodule(my_settings)
        process = CrawlerProcess(settings=crawler_settings)

        process.crawl(studycheckSpider.StudycheckSpider)
        process.crawl(studiengaengeZeitSpider.StudiengaengezeitSpider)        
        process.crawl(medienStudierenSpider.MedienstudierenSpider)        
        self.stdout.write(self.style.WARNING('Starting'))
        process.start()
        self.stdout.write(self.style.WARNING('Done'))