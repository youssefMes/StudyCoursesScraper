import scrapy


class MyguidespiderSpider(scrapy.Spider):
    name = 'myGuideSpider'
    allowed_domains = ['www.myguide.de']
    start_urls = ['https://www.myguide.de/en/degree-programmes']
    user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1"

    def parse(self, response):
      print('response', response)
      for course in response.css('li.qa-hsk-result-item u-list-unset mb-2')[0:2]:
        print('course')
        print(course)
        url = response.join_url(course.css('a::attr(href)').extract_first())
        print('url url url url url', url)

        yield scrapy.Request(url, callback = self.parse_item)
    
    
    def parse_item(self, response):
        print(response.css('h3.collapsible__headline-text.h4.m-0::text'))
        item = {
            'description': response.css('h3.collapsible__headline-text.h4.m-0::text').get
        }
        yield item