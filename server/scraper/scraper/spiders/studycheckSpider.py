from ast import parse
from json import load
from pprint import pprint
from this import d
from scrapy import Spider, Request
from itemloaders.processors import TakeFirst
from scrapy.loader import ItemLoader
from scraper.items import CourseItem
from pprint import pprint
from inline_requests import inline_requests

class StudycheckspiderSpider(Spider):
    name = 'studycheckSpider'
    allowed_domains = ['www.studycheck.de']
    start_urls = ['https://www.studycheck.de/suche?rt=2&q=&c=1&modal=1']
    portal_name = 'studyCheck'
    custom_settings = {
     'CONCURRENT_REQUESTS': 1
    }       
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
    
    def parse(self, response):
        for course in response.css('div.rfv1-media-layout__row.rfv1-media-layout__row--relative.rfv1-display--flex')[0:1]:
            url = course.css('a::attr(href)').extract_first()
            yield Request(url, callback = self.parse_item_informations)

        next_page = response.xpath('//nav[contains(@class, "rfv1-pagination")]/*[last()]')[0]
        if ('a' == next_page.root.tag):
            page = next_page.xpath('@href').extract_first().split('&')[-1]
            
            next_page_url = getattr(self, 'start_urls')[0] + '&' + page
            if '3' in page:
                return
            if next_page_url:
                yield Request(next_page_url, callback = self.parse)



    @inline_requests
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
        loader.default_input_processor = TakeFirst()
        loader.default_output_processor = TakeFirst()
        loader.add_xpath('name', 'normalize-space(//h1[@class="course-title"]/text())')
        loader.add_value('link', response._url)
        loader.add_value('information', informations)
        comments = []
        resp = yield Request(response._url + '/bewertungen')
        comments += self.parse_item_evaluations(response=resp)
        next_page = resp.xpath('//ul[@class="pagination"]/li[last()]/a/@href').extract_first()                 
        if isinstance(next_page, str):
            next_page = next_page.split('/')[-1]   
        while (next_page): 
            next_page_url = ''
            url_parts = resp._url.split('/')
            last_part = url_parts[-1] 
            if ('seite' in last_part):
                url_parts[-1:] = [next_page]
                next_page_url = '/'.join(url_parts)
            else:
                next_page_url = resp._url + '/' + next_page
            resp = yield Request(next_page_url)
            comments += self.parse_item_evaluations(response=resp)
            next_page = resp.xpath('//ul[@class="pagination"]/li[last()]/a/@href').extract_first()
            next_page = next_page.split('/')[-1] if next_page else None

        loader.add_value('comments', comments)
        yield loader.load_item()

    @staticmethod    
    def parse_item_evaluations(response):
        headline = response.xpath('normalize-space(//h2[@class="reports-headline"])').extract_first()
        reports = response.xpath('//section[contains(@class, "reports")]/div[@data-report-id]')
        comments = []
        for report in reports:
            is_archived = 'Bericht archiviert' == report.xpath('normalize-space(header/div[@class="item-rating"]/span)').extract_first()
            if is_archived:
                continue
            title = report.xpath('header/h3[@class="item-title"]//text()').extract_first()
            content = report.xpath('normalize-space(div[@class="card-block"]/p[@class="item-text"])').extract_first()
            star_rating = report.xpath('normalize-space(header//div[@class="rating-value"])').extract_first()
            date = report.xpath('div[contains(@class,"card-footer")]/span[@class="item-date"]/text()').extract_first()
            digital_feedback = report.xpath('div[@class="card-block"]/div[@class="item-digital-feedback"]')
            additonial = {}
            if digital_feedback:
                additonial = {
                    'question': digital_feedback.xpath('strong/text()[normalize-space()]').extract_first(),
                    'answer': digital_feedback.xpath('normalize-space(text()[last()])').extract_first(),
                }
            comments.append({
                'title': title,
                'content': content,
                'additional_evaluation': additonial,
                'star_rating': star_rating,
                'date': date
            })

        return comments    
    
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
        mapping = getattr(self, 'mapping')
        excluded = ['Bewertung', 'Bewertungen', 'Weiterempfehlung', 'Virtueller Campus']
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
            mapping = getattr(self, 'mapping')
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