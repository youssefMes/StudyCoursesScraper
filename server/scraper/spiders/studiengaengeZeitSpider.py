from scrapy import Request, Spider
import urllib.parse
import json
from itemloaders.processors import TakeFirst
from scrapy.loader import ItemLoader
from scraper.items import CourseItem
import logging
#logging.getLogger('scrapy').setLevel(logging.ERROR)
logging.getLogger('scrapy').propagate = False

class StudiengaengezeitSpider(Spider):
    name = 'studiengaengeZeit'
    allowed_domains = ['studiengaenge.zeit.de']
    citys = ["albstadt","bad liebenzell","bad mergentheim","baden-baden","biberach","bruchsal","böblingen","esslingen","freiburg","friedrichshafen","furtwangen","geislingen","gengenbach","göppingen","heidelberg","heidenheim","heilbronn","horb","karlsruhe","kehl","konstanz","künzelsau","lahr","ludwigsburg","lörrach","mannheim","mosbach","nürtingen","offenburg","pforzheim","ravensburg","reutlingen","riedlingen","rottenburg","schwetzingen","schwäbisch gmünd","schwäbisch hall","sigmaringen","stuttgart","trossingen","tuttlingen","tübingen","ulm","villingen-schwenningen","waldshut-tiengen","weingarten","amberg","ansbach","aschaffenburg","augsburg","bad reichenhall","bamberg","bayreuth","benediktbeuern","coburg","deggendorf","eichstätt","erlangen","freising","fürstenfeldbruck","fürth","garching","herrsching a. ammersee","hof","ingolstadt","ismaning","kaufbeuren","kempten","landshut","münchberg","münchen","neu-ulm","neubiberg","neuendettelsau","neumarkt","nürnberg","passau","regensburg","rosenheim","schweinfurt","starnberg","straubing","sulzbach-rosenberg","treuchtlingen","triesdorf","wasserburg am inn","weiden","weihenstephan","würzburg","berlin","brandenburg","cottbus","cottbus/sachsendorf","eberswalde","frankfurt (oder)","königs wusterhausen","neuruppin","oranienburg","potsdam","senftenberg","wildau","wustermark","bremen","bremerhaven","hamburg","bad homburg","bad sooden-allendorf","darmstadt","dieburg","dietzhölztal","frankfurt am main","friedberg","fulda","geisenheim","gießen","idstein","kassel","langen","marburg","mühlheim","oberursel","offenbach","rotenburg","rüsselsheim","schwalmstadt","wetzlar","wiesbaden","greifswald","güstrow","neubrandenburg","rostock","schwerin","stralsund","wismar","braunschweig","buxtehude","clausthal-zellerfeld","diepholz","elsfleth","emden","göttingen","hameln","hann. münden","hannover","hermannsburg","hildesheim","holzminden","leer","lingen (ems)","lüneburg","nienburg","oldenburg","osnabrück","ottersberg","salzgitter","stade","suderburg","vechta","wilhelmshaven","wolfenbüttel","wolfsburg","aachen","alfter","bad münstereifel","bergisch gladbach","bielefeld","bocholt","bochum","bonn","bottrop","brühl","detmold","dortmund","duisburg","düren","düsseldorf","essen","frechen","gelsenkirchen","gummersbach","gütersloh","hagen","hamm","hamminkeln","hennef","herford","herne","höxter","iserlohn","jülich","kamp-lintfort","kleve","krefeld","köln","lemgo","leverkusen","lippstadt","meschede","mettmann","minden","mönchengladbach","mülheim an der ruhr","münster","neuss","nordkirchen","paderborn","recklinghausen","rheinbach","rheine","sankt augustin","siegen","soest","solingen","steinfurt","unna","velbert/ heiligenhaus","wesel","witten","wuppertal","bingen","birkenfeld","büchenbeuren","edenkoben","germersheim","hachenburg","höhr-grenzhausen","idar-oberstein","kaiserslautern","koblenz","landau","ludwigshafen","mainz","mayen","pirmasens","remagen","speyer","trier","vallendar","worms","zweibrücken","homburg","quierschied","saarbrücken","chemnitz","dresden","freiberg","görlitz","leipzig","markneukirchen","meißen","mittweida","moritzburg","reichenbach","rothenburg","schneeberg","zittau","zwickau","aschersleben","bernburg","dessau","friedensau","halberstadt","halle","köthen","magdeburg","merseburg","stendal","wernigerode","altenholz","elmshorn","flensburg","heide","kiel","lübeck","osterrönfeld","reinfeld","wedel","eisenach","erfurt","gera","gotha","ilmenau","jena","meiningen","nordhausen","schmalkalden","weimar"]
    url = 'https://studiengaenge.zeit.de/api/search/courses?'
    params = {'limit': 100, 'page': 1, 'ort[]' : citys}
    start_urls = [url + urllib.parse.urlencode(params, True)]
    portal_link = 'https://studiengaenge.zeit.de'
    portal_name = 'studiengaenge.zeit'
    custom_settings = {
     'CONCURRENT_REQUESTS': 1
    }

    def parse(self, response):
        data = json.loads(response.text)
        results = data['results']
        next_page = data['nextPage']

        for result in results[0:1]: 
            periods = {}
            for key in result['college']['periods'].keys():
                text = result['college']['periods'][key]['vorlesungszeit_str']
                if isinstance(text, str):
                    text = text.replace('\n\n', ',').replace('\n', ' ')
                periods[key] = text
            
            information = {
                'university': result['college']['name'],
                'city': result['location_names'],
                'study_start': result['start'],
                'study_form': ','.join(result['types']),
                'study_periode': result['length'],
                'degree': result['degree'],
                'languages': result['languages'],
                'website_link': result['url'],
                'costs': result['fee'],
                'contents': ','.join(result['subjects']),
                'requirements': result['applicationRestriction'],
                'other_information': {
                    'applicationModus': result['applicationModus'],
                    'feeNote': result['feeNote'],
                    'coreAreas': result['coreAreas'],
                    'periods': periods,
                    'note': result['note'].replace('\n\n', ',')
                },
            }
            course_link = getattr(self, 'portal_link') + result['path']
            loader = ItemLoader(item=CourseItem(), response=response)
            loader.default_input_processor = TakeFirst()
            loader.default_output_processor = TakeFirst()
            loader.add_value('name', result['name'])
            loader.add_value('link', course_link)
            loader.add_value('information', information)
            yield loader.load_item()
            
        #if next_page:
        if next_page != '2':
            params = {**getattr(self, 'params'), 'page': next_page}
            yield Request(getattr(self, 'url') + urllib.parse.urlencode(params, True), callback=self.parse)
