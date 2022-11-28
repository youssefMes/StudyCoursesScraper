from ast import parse
from json import load
from pprint import pprint
from this import d
from scrapy import Spider, Request
from itemloaders.processors import TakeFirst
from scrapy.loader import ItemLoader
from scraper.items import CourseItem
from pprint import pprint

class StudycheckspiderSpider(Spider):
    name = 'studycheckSpider'
    allowed_domains = ['www.studycheck.de']
    start_urls = ['https://www.studycheck.de/suche?rt=2&q=&c=1&modal=1']
    portal_name = 'studyCheck'
    mapping = {
        'Regelstudienzeit': 'study_periode',
        'Studienbeginn': 'study_start',
        'Abschluss': 'degree',
        'Unterrichtssprachen': 'languages',
        'Inhalte': 'contents',
        'Standorte': 'city',
        'Link zur Website': 'website_link',
        'Gesamtkosten': 'costs',
        'Creditpoints': 'credit_points',
    }
    course = {}
    
    def parse(self, response):
      for course in response.css('div.rfv1-media-layout__row.rfv1-media-layout__row--relative.rfv1-display--flex')[0:10]:
        url = course.css('a::attr(href)').extract_first()
        yield Request(url, callback = self.parse_item_informations)
    
    def parse_item_informations(self, response):
        cards = response.xpath(
            "//div[contains(concat(' ', normalize-space(@class), ' '), ' courses-details ')]/div[contains(@class, 'card')]"
            )
        informations = {
            'university': response.xpath('normalize-space(//div[@class="institute-text"]/a/text())').extract_first()
        }
        for card in cards:
            informations = {**informations, **self.parse_card(card)} 
        
        loader = ItemLoader(item=CourseItem(), response=response)
        loader.default_output_processor = TakeFirst()
        loader.add_xpath('name', 'normalize-space(//h1[@class="course-title"]/text())')
        loader.add_value('link', response._url)
        loader.add_value('information', informations)

        yield loader.load_item()
        #yield Request(response._url + '/bewertungen', callback = self.parse_item_evaluations)

    def parse_item_evaluations(self, response):
        loader = ItemLoader(item=CourseItem(), response=response)
        
       
        yield loader.load_item()
    
    def parse_card(self, card):
        blocTitle = card.xpath("normalize-space(header[contains(@class, 'card-header')]/h2/text())").extract_first()
        
        informations = {}
        match blocTitle:
            case 'Vollzeitstudium' | 'Berufsbegleitendes Studium' | 'Duales Studium':
                informations = {
                    'study_form': blocTitle,
                    **self.parse_card_informations(card)
                }
            case 'Studiengangdetails':
                description = card.xpath("normalize-space(div[contains(@class, 'card-block')]/p/text())").extract_first()
                if (description == ''):
                    informations = self.parse_card_informations(card)
                else:
                    informations = {**informations, 'description': description}
            case 'Studienmodelle':
                informations['models'] = self.parse_models(card=card.xpath('div[@class="card-block"]')[0])
        return informations

    def parse_card_informations(self, card):
        informationDivs = card.xpath("//div[contains(@class, 'card-row') and contains(@class, 'card-row--no-border')]")
        mapping = {
            'Regelstudienzeit': 'study_periode',
            'Studienbeginn': 'study_start',
            'Abschluss': 'degree',
            'Unterrichtssprachen': 'languages',
            'Inhalte': 'contents',
            'Standorte': 'city',
            'Link zur Website': 'website_link',
            'Gesamtkosten': 'costs',
            'Creditpoints': 'credit_points',
        }
        excluded = ['Bewertung', 'Bewertungen', 'Weiterempfehlung']
        informations = {}
        for div in informationDivs:
            label = div.xpath("normalize-space(div[contains(@class, 'card-row-label')]//text())").extract_first()
            if label in excluded:
                continue
            value = ''
            if label in ['Inhalte', 'Voraussetzungen']:
                value = ''.join(div.xpath("div[contains(@class, 'card-row-content')]//*").getall())
            else:
                value = div.xpath("normalize-space(div[contains(@class, 'card-row-content')])").extract_first()

            if label in mapping:    
                informations[mapping[label]] = value
        
        return informations

    def parse_models(self, card):
        headers = card.xpath("//div[@class='variant-accordion-header']")
        informationDivs = card.xpath("div/div[contains(@class, 'tab-content')]")
        modelsInformations = []
        for index, header in enumerate(headers):    
            informations = {
                'name': header.xpath("normalize-space(span[contains(@class, 'variant-accordion-header__title')])").extract_first(),
                'duration': header.xpath("normalize-space(span[contains(@class, 'variant-accordion-header__duration')])").extract_first(),
                'price': header.xpath("normalize-space(span[contains(@class, 'variant-accordion-header__price')])").extract_first()
            }
            contentDiv = informationDivs[index]
            rows = contentDiv.xpath("div[contains(@class, 'card-row') and contains(@class, 'card-row--no-border')]")
            mapping = {
                'Regelstudienzeit': 'study_periode',
                'Studienbeginn': 'study_start',
                'Abschluss': 'degree',
                'Unterrichtssprachen': 'languages',
                'Inhalte': 'contents',
                'Standorte': 'city',
                'Link zur Website': 'website_link',
                'Gesamtkosten': 'costs',
                'Hinweise': 'hints',
                'Creditpoints': 'credit_points',
            }
            excluded = ['Bewertung', 'Bewertungen', 'Weiterempfehlung']
            for row in rows:
                label = row.xpath("normalize-space(div[contains(@class, 'card-row-label')]//text())").extract_first()
                if label in excluded:
                    continue
                value = ''
                if label in ['Inhalte', 'Voraussetzungen']:
                    value = ''.join(row.xpath("div[contains(@class, 'card-row-content')]//*").getall())
                else:
                    value = row.xpath("normalize-space(div[contains(@class, 'card-row-content')])").extract_first()
                informations[mapping[label]] = value
            modelsInformations.append(informations)  
        
        return modelsInformations