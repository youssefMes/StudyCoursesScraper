from scraperApp.models import Course, Information, Rating
class CourseService:
    @staticmethod
    def create(data):
        global information, rating
        if (data.information):
            information = Information(**data.information)
        if (data.rating):
            rating = Rating(**data.rating)

        return Course(name=data.name, information=information, rating=rating)
    
    def get(id):
        return Course.objects.get(id)