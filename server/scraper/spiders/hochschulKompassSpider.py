import scrapy


class HochschulkompassspiderSpider(scrapy.Spider):
    name = 'hochschulKompassSpider'
    allowed_domains = ['www.hochschulkompass.de']
    start_urls = ['https://www.hochschulkompass.de/studium/studiengangsuche/erweiterte-studiengangsuche/search/1/studtyp/3.html?tx_szhrksearch_pi1[results_at_a_time]=100']
    user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1"
    ROBOTSTXT_OBEY = False

    def parse(self, response):
      print('selfselfselfselfselfselfself', self)
      print('response', response)
      for course in response.css('section.result-box')[0:2]:
        print('course')
        print(course)
        url = response.join_url(course.css('a::attr(href)').extract_first())
        yield scrapy.Request(url, callback = self.parse_item)
    
    
    def parse_item(self, response):
        print(response.css('div.content-box').css('h2::text').get())
        item = {
            'description': response.css('div.content-box').css('h2::text').get()
        }
        yield item