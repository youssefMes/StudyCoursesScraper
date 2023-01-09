from json import load
from pprint import pprint
from this import d
from scrapy import Spider, Request
from itemloaders.processors import TakeFirst
from scrapy.loader import ItemLoader
from scraper.items import CourseItem
from pprint import pprint
from inline_requests import inline_requests
from re import sub, findall
import requests
from django.core import files
from io import BytesIO

from scraperApp.models import Logo


class StudycheckSpider(Spider):
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
        'Creditpoints': 'credit_points',
        'Voraussetzungen': 'requirements'
    }
    image = ''
    
    def parse(self, response):
        for course in response.css('div.rfv1-media-layout__row.rfv1-media-layout__row--relative.rfv1-display--flex'):
            url = course.css('a::attr(href)').extract_first()
            image = course.xpath('substring-before(substring-after(//div[contains(@class, "rfv1-media-layout__logo")]/@style, "background: url("), ")")').extract_first()
            setattr(self, 'image', image)
            yield Request(url, callback = self.parse_item_informations)
        next_page = response.xpath('//nav[contains(@class, "rfv1-pagination")]/*[last()]')[0]
        if ('a' == next_page.root.tag):
            page = next_page.xpath('@href').extract_first().split('&')[-1]
            
            next_page_url = getattr(self, 'start_urls')[0] + '&' + page
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
        loader.add_xpath('logo', getattr(self, 'image'))
        loader.add_value('link', response._url)
        loader.add_value('information', informations)
        
        comments = []
        resp = yield Request(response._url + '/bewertungen')
        headline = resp.xpath('normalize-space(//h2[@class="reports-headline"])').extract_first()
        headline_parts = findall(r'\d+', headline)
        evaluation_count = headline_parts[0] if len(headline_parts) > 0 else None
        if evaluation_count and int(evaluation_count) > 0:
            star_reports = self.parse_item_reports(response=resp)
            reports_stats = self.parse_item_statistics(response=resp)
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
            loader.add_value('star_reports', star_reports)
            loader.add_value('reports_stats', reports_stats)
            loader.add_value('evaluation_count', evaluation_count)
        yield loader.load_item()

    @staticmethod    
    def parse_item_evaluations(response):
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
    
    @staticmethod    
    def parse_item_reports(response):
        list = response.xpath('//div[contains(@class, "reports-details")]/div[@class="card-block"]/ul')
        star_reports = []
        for item in list.xpath('li'):
            if item.xpath('@class').extract_first() == 'total':
                name = item.xpath('normalize-space(strong[@class="criteria-name"])').extract_first()
            else:
                name = item.xpath('normalize-space(span[@class="criteria-name"])').extract_first()
            value = item.xpath('normalize-space(div/div[@class="rating-value"])').extract_first()
            star_reports.append({
                'name': name,
                'value': value
            })
        return star_reports

    @staticmethod    
    def parse_item_statistics(response):
        title = response.xpath('normalize-space(//div[contains(@class, "statistics-recommendations")]/div[@class="card-header"]/h2)').extract_first()
        value = response.xpath('normalize-space(//div[contains(@class, "statistics-recommendations")]//svg[contains(@class, "svg-icon-smiley-positive")]/following-sibling::span)').extract_first()
        digits = findall(r'\d+', value)
        if title != '' and len(digits) > 0:
            return [
                {
                'title': title,
                'value': digits[0]
                }
        ]
        return []


    def parse_card(self, card):
        blocTitle = card.xpath("normalize-space(header[contains(@class, 'card-header')]/h2/text())").extract_first()
        
        informations = {}
        match blocTitle:
            case 'Vollzeitstudium' | 'Berufsbegleitendes Studium' | 'Duales Studium' | 'Studium neben dem Beruf':
                informations = {
                    'study_form': blocTitle if blocTitle != 'Studium neben dem Beruf' else 'Berufsbegleitendes Studium',
                    **self.parse_card_informations(card)
                }
            case 'Studiengangdetails':
                description = card.xpath("normalize-space(div[contains(@class, 'card-block')]/p/text())").extract_first()
                if (description == ''):
                    informations = self.parse_card_informations(card)
                else:
                    informations = {**informations, 'description': description}
            case 'Studienmodelle':
                informations['models'] = self.parse_models(card=card.xpath('div[contains(@class,"card-block")]')[0])
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
            
            if label not in mapping.keys():
                    if 'other_information' not in informations.keys():
                        informations['other_information'] = {}
                    informations['other_information'][self.to_snake_case(str=label)] = value
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
                
                if label not in mapping.keys():    
                    informations[self.to_snake_case(str=label)] = value
                    continue

                informations[mapping[label]] = value
            modelsInformations.append(informations)  
        
        return modelsInformations
    
    @staticmethod
    def to_snake_case(str):
        return '_'.join(
        sub('([A-Z][a-z]+)', r' \1',
        sub('([A-Z]+)', r' \1',
        str.replace('-', ' '))).split()).lower()
