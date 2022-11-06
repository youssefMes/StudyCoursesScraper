from json import load
from scrapy import Spider, Request
from scrapy.loader.processors import TakeFirst
from scrapy.loader import ItemLoader
from scraper.items import CourseItem

class StudycheckspiderSpider(Spider):
    name = 'studycheckSpider'
    allowed_domains = ['www.studycheck.de']
    start_urls = ['https://www.studycheck.de/suche?rt=2&q=&c=1&modal=1']
    portal_name = 'studyCheck'
    def parse(self, response):
      for course in response.css('div.rfv1-media-layout__row.rfv1-media-layout__row--relative.rfv1-display--flex')[0:2]:
        url = course.css('a::attr(href)').extract_first()
        yield Request(url, callback = self.parse_item)
    
    
    def parse_item(self, response):
        #portal = Portal.objects.get(name=self.portal_name)
        loader = ItemLoader(item=CourseItem(), response=response)
        loader.default_output_processor = TakeFirst()
        loader.add_xpath('name', 'normalize-space(//h1[@class="course-title"]/text())')
        #item = {
            #'name': response.css('h1.course-title::text').get(),
            #'description': response.css('div.card.courses-introtext div::text').get()
        #}
        yield loader.load_item()
