from scrapy import Spider, Request
from inline_requests import inline_requests
from itemloaders.processors import TakeFirst
from scrapy.loader import ItemLoader
from scraper.items import CourseItem
import re
import lxml.html
import json
import requests

class MedienstudierenSpider(Spider):
    name = 'medienStudierenSpider'
    allowed_domains = ['www.medien-studieren.net']
    start_urls = ['https://www.medien-studieren.net/hochschulen-finden/?tx_drshochschulen_hochschulen[land]=Deutschland&tx_drshochschulen_hochschulen[action]=search&tx_drshochschulen_hochschulen[controller]=Hochschule']
    portal_name = 'medien-studieren'

    mapping = {
        'Dauer': 'study_periode',
        'Art': 'study_form',
        'Abschluss': 'degree',
        'Studienverlauf': 'study_course',
        'Studienschwerpunkte': 'core_areas',
        'Besonderheiten': 'specifics',
        'Besonderheiten des Studiengangs': 'course_specifics',
        'Zugangsvoraussetzungen': 'requirements',
        'Zugangsvoraussetzungen & Studiengebühren': 'reqs_costs',
        'Studieninhalte': 'study_content',
        'Studiengebühren': 'costs',

    }
    course = {}
    def parse(self, response):
        rows = response.xpath('//div[@class="row flex-row"]/div[@data-pid]')
        for row in rows[0:1]:
            domain = getattr(self, 'allowed_domains')[0]
            href = row.xpath('a/@href').extract_first()
            yield Request('https://' + domain + href, callback=self.parse_courses)
            
    def parse_courses(self, response):
        domain = getattr(self, 'allowed_domains')[0]
        title_tabs = response.xpath('//ul[@class= "tabs"]/li')
        content_tabs = response.xpath('//div[@class= "tabs-content"]/div[contains(@class, "isTabContent")]')
        allowed_tabs = ['Bachelor', 'Master']
        for index, tab in enumerate(title_tabs):
            tab_name = tab.xpath('normalize-space(a/text())').extract_first()
            if tab_name not in allowed_tabs:
                continue
            course_list = content_tabs[index].xpath('ul[contains(@class, "tab-list")]/li/div[@class="studiengang-item"]')
            for course in course_list:
                link = course.xpath('a/@href').extract_first()
                study_form = course.xpath('normalize-space(//small)').extract_first()
                study_form = re.sub(r'[()]', '', study_form)
                
                if link:
                    setattr(self, 'course', {'study_form': study_form})
                    yield Request('https://' + domain + link, callback=self.parse_single_course)
                    continue
                loader = ItemLoader(item=CourseItem(), response=response)
                loader.default_input_processor = TakeFirst()
                loader.default_output_processor = TakeFirst()
                name = course.xpath('normalize-space(span[@class="sgang"]/span/text())').extract_first()
                loader.add_value('name', name)
                loader.add_value('information', {'study_form': study_form, 'degree': tab_name})
                yield loader.load_item()

    def parse_single_course(self, response):
        loader = ItemLoader(item=CourseItem(), response=response)
        loader.default_input_processor = TakeFirst()
        loader.default_output_processor = TakeFirst()
        loader.add_xpath('name', 'normalize-space((//div[@class="content"])[1]/h1/text())')
        loader.add_value('link', response._url)
        mapping = getattr(self, 'mapping')
        university = response.xpath('//div[@class="content"][1]/div[@class="row"]//a[@title]/@title').extract_first()
        if len(university.split('-')) > 1 and university.split('-')[-1].strip() in ['Vollzeit', 'Berufsbegleitend']:
            university = university.split('-')[0].strip()
            
        information = {
            'university': university,
        }
        form_path = response.xpath('//div[@class="info_request"]//drs-form/@form-path').extract_first()
        cities = self.extract_cities(link= 'https://' + getattr(self, 'allowed_domains')[0] + form_path)
        details = response.xpath('//div[@class= "content"]//span[@class="drs-course_details__text"]')
        for detail in details:
            label = detail.xpath('normalize-space(span/text())').extract_first()
            value = detail.xpath('normalize-space(child::text()[last()])').extract_first()
            information[mapping[label]] = value

        information['description'] = ','.join(response.xpath('//div[@class="content"]/p/text()').extract())
        
        details = response.xpath('//div[@class="content"][1]/div[@class="mb-50"]')
        for detail in details:      
            bloc_name = detail.xpath('normalize-space(h3/text())').extract_first()
            if 'other_information' not in information.keys():
                information['other_information'] = {}
            nodes_string = ''.join(detail.xpath('*[not(self::div[@class="media"])]').getall())
            html = lxml.html.fromstring(nodes_string)
            for tag in html.xpath('//*[@class]'):
                tag.attrib.pop('class')
            information['other_information'][mapping[bloc_name]] =  lxml.html.tostring(html).decode('utf-8')
        
        loader.add_value('information', {
            **information,
            'study_form': getattr(self, 'course')['study_form'],
            'city': cities
        })
        yield loader.load_item()


    def extract_cities(self, link):
        response = requests.get(link)
        fields = response.json()['data']['attributes']['pages'][0]['fieldGroups'][0]['fields']
        locations = [] 
        for field in fields:
            if field['label'] == 'Standort':
                for option in field['options']:
                    if option['label'] not in locations:
                        locations.append(option['label'])

        return ','.join(locations)