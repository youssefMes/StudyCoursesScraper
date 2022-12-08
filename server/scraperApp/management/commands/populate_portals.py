from django.core.management.base import BaseCommand, CommandError
from scraperApp.models import Portal
# use django logger 
#import logging
#logging.basicConfig(level=logging.INFO)
#logger = logging.getLogger(__name__)

protals = [
    {
        'name': 'studyCheck',
        'link': 'https://www.studycheck.de/suche?rt=2&q=&c=1&modal=1'
    }
]


class Command(BaseCommand):
    help = 'Populates Portals'

    def handle(self, *args, **options):
        for portal in protals:
            try:
                exists = Portal.objects.filter(name=portal['name']).exists()
                if exists:
                    self.stdout.write(self.style.WARNING('protal {0} exists already!'.format(portal['name'])))
                    continue
                item = Portal(name=portal['name'], link=portal['link'])
                item.save()
                self.stdout.write(self.style.SUCCESS('Successfully created portal %s' % item.name))
            except Exception as err:
                self.stderr.write('Error creating protal {0} reason {1}'.format(portal['name'], str(err)))

            