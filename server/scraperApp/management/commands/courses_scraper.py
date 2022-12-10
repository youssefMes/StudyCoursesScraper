from unicodedata import name
from django.core.management.base import BaseCommand, CommandError
from scraperApp.models import Portal
import requests

from scraperApp.models import Information, Course

class Command(BaseCommand):
    help = 'Scrapes studiengaenge.zeit'
    portal_link = 'https://studiengaenge.zeit.de'
    citys = ["albstadt","bad liebenzell","bad mergentheim","baden-baden","biberach","bruchsal","böblingen","esslingen","freiburg","friedrichshafen","furtwangen","geislingen","gengenbach","göppingen","heidelberg","heidenheim","heilbronn","horb","karlsruhe","kehl","konstanz","künzelsau","lahr","ludwigsburg","lörrach","mannheim","mosbach","nürtingen","offenburg","pforzheim","ravensburg","reutlingen","riedlingen","rottenburg","schwetzingen","schwäbisch gmünd","schwäbisch hall","sigmaringen","stuttgart","trossingen","tuttlingen","tübingen","ulm","villingen-schwenningen","waldshut-tiengen","weingarten","amberg","ansbach","aschaffenburg","augsburg","bad reichenhall","bamberg","bayreuth","benediktbeuern","coburg","deggendorf","eichstätt","erlangen","freising","fürstenfeldbruck","fürth","garching","herrsching a. ammersee","hof","ingolstadt","ismaning","kaufbeuren","kempten","landshut","münchberg","münchen","neu-ulm","neubiberg","neuendettelsau","neumarkt","nürnberg","passau","regensburg","rosenheim","schweinfurt","starnberg","straubing","sulzbach-rosenberg","treuchtlingen","triesdorf","wasserburg am inn","weiden","weihenstephan","würzburg","berlin","brandenburg","cottbus","cottbus/sachsendorf","eberswalde","frankfurt (oder)","königs wusterhausen","neuruppin","oranienburg","potsdam","senftenberg","wildau","wustermark","bremen","bremerhaven","hamburg","bad homburg","bad sooden-allendorf","darmstadt","dieburg","dietzhölztal","frankfurt am main","friedberg","fulda","geisenheim","gießen","idstein","kassel","langen","marburg","mühlheim","oberursel","offenbach","rotenburg","rüsselsheim","schwalmstadt","wetzlar","wiesbaden","greifswald","güstrow","neubrandenburg","rostock","schwerin","stralsund","wismar","braunschweig","buxtehude","clausthal-zellerfeld","diepholz","elsfleth","emden","göttingen","hameln","hann. münden","hannover","hermannsburg","hildesheim","holzminden","leer","lingen (ems)","lüneburg","nienburg","oldenburg","osnabrück","ottersberg","salzgitter","stade","suderburg","vechta","wilhelmshaven","wolfenbüttel","wolfsburg","aachen","alfter","bad münstereifel","bergisch gladbach","bielefeld","bocholt","bochum","bonn","bottrop","brühl","detmold","dortmund","duisburg","düren","düsseldorf","essen","frechen","gelsenkirchen","gummersbach","gütersloh","hagen","hamm","hamminkeln","hennef","herford","herne","höxter","iserlohn","jülich","kamp-lintfort","kleve","krefeld","köln","lemgo","leverkusen","lippstadt","meschede","mettmann","minden","mönchengladbach","mülheim an der ruhr","münster","neuss","nordkirchen","paderborn","recklinghausen","rheinbach","rheine","sankt augustin","siegen","soest","solingen","steinfurt","unna","velbert/ heiligenhaus","wesel","witten","wuppertal","bingen","birkenfeld","büchenbeuren","edenkoben","germersheim","hachenburg","höhr-grenzhausen","idar-oberstein","kaiserslautern","koblenz","landau","ludwigshafen","mainz","mayen","pirmasens","remagen","speyer","trier","vallendar","worms","zweibrücken","homburg","quierschied","saarbrücken","chemnitz","dresden","freiberg","görlitz","leipzig","markneukirchen","meißen","mittweida","moritzburg","reichenbach","rothenburg","schneeberg","zittau","zwickau","aschersleben","bernburg","dessau","friedensau","halberstadt","halle","köthen","magdeburg","merseburg","stendal","wernigerode","altenholz","elmshorn","flensburg","heide","kiel","lübeck","osterrönfeld","reinfeld","wedel","eisenach","erfurt","gera","gotha","ilmenau","jena","meiningen","nordhausen","schmalkalden","weimar"]
    
    def handle(self, *args, **options):
        try:
            portal = Portal.objects.get(name='studiengaenge.zeit')
            link = portal.link
            next_page = 1
            while(next_page != 3):
                params = {'limit': 1, 'page': next_page, 'ort[]' : getattr(self, 'citys')}
                response = requests.get(link, params=params)
                results = response.json()['results'] 
                for result in results: 
                    periods = {}
                    for key in result['college']['periods'].keys():
                        text = result['college']['periods'][key]['vorlesungszeit_str']
                        if isinstance(text, str):
                            text = text.replace('\n\n', ',').replace('\n', ' ')
                        periods[key] = text
                    
                    information = {
                        'university': result['college']['name'],
                        'city': ','.join(result['location_names']),
                        'study_start': result['start'],
                        'study_form': ','.join(result['types']),
                        'study_periode': result['length'],
                        'degree': result['degree'],
                        'languages': ','.join(result['languages']),
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
                    course = {}
                    try:
                        course = Course.objects.get(link=course_link)
                    except Exception as err:
                        pass

                    if course:
                        for key in information.keys():
                            setattr(course.information, key, information[key])
                            
                        course.information.save() 
                        self.stdout.write(self.style.WARNING('Course {0} exists already! updating ...'.format(course.name)))
                        continue
                    item = Information.objects.create(**information)
                    course = Course.objects.create(information=item, name=result['name'], link=course_link, portal=portal)
                    self.stdout.write(self.style.SUCCESS('Successfully created course {0}'.format(course.name)))
                
                next_page = response.json()['nextPage']
        except Exception as err:
                self.stderr.write('Error occured reason {0}'.format(str(err)))
    

