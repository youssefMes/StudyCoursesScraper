import email
from urllib import response
from django.test import TestCase
from .models import Bookmark, Course, Information, Portal, User
from rest_framework.test import APIClient
import json


class CourseTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        portal_1 = Portal.objects.create(name='Test Portal 1' , link='https://test_1.com')
        portal_2 = Portal.objects.create(name='Test Portal 2' , link='https://test_2.com')
        portal_3 = Portal.objects.create(name='Test Portal 3' , link='https://test_3.com')
        information_1 = Information.objects.create(city='CITY_1')
        information_2 = Information.objects.create(city='CITY_2, CITY_3')
        information_3 = Information.objects.create(city='CITY_4')
        Course.objects.create(name="Game Design und Management 1", portal=portal_1, information=information_1)
        Course.objects.create(name="Digitales Management & Leadership 2", portal=portal_2, information=information_2)
        Course.objects.create(name="Mediendesign & Management 3", portal=portal_3, information=information_3)

    def test_course_results(self):
        """courses page loads properly"""
        response = self.client.get('http://localhost:8000/api/courses/')
        self.assertEqual(response.status_code, 200)

    def test_course_results_search(self):
        """search fonctionalities"""
        response = self.client.get('http://localhost:8000/api/courses/', {'search': 'Management'})
        for result in response.data['results']:
            self.assertIn('Management', result['name'])
    
    def test_course_results_filter(self):
        """fitler fonctionalities"""
        response = self.client.get('http://localhost:8000/api/courses/', {'city': 'CITY_1'})
        self.assertEqual(len(response.data['results']), 1)
        for result in response.data['results']:
            self.assertIn('CITY_1', result['information']['city'])    

        response = self.client.get('http://localhost:8000/api/courses/', {'city': 'CITY_1', 'portal': 'Test Portal 1'})
        self.assertEqual(len(response.data['results']), 1)
        self.assertIn('CITY_1', response.data['results'][0]['information']['city'])
        self.assertEqual('Test Portal 1', response.data['results'][0]['portal']['name'])

        response = self.client.get('http://localhost:8000/api/courses/', {'city': 'CITY_1', 'portal': 'Test Portal 2'})
        self.assertEqual(len(response.data['results']), 0)
        
    def test_course_pagination(self):
        """ Pagination """
        response = self.client.get('http://localhost:8000/api/courses/', {'limit': 2})
        self.assertIn('page=2', response.data['next'])
        self.assertEqual(3, response.data['count'])


class BookmarkTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.api_client = APIClient()
        cls.portal = Portal.objects.create(name='Test Portal 1' , link='https://test_1.com')
        cls.course_1 = Course.objects.create(name="Test Study Course 1", portal=cls.portal)
        cls.course_2 = Course.objects.create(name="Test Study Course 2", portal=cls.portal)
        cls.course_3 = Course.objects.create(name="Test Study Course 3", portal=cls.portal)
        cls.user = User.objects.create_user(email="user@test.com", password='12345678')
        cls.user.is_active = True
        cls.user.save()
        Bookmark.objects.create(user = cls.user, course= cls.course_1)
        Bookmark.objects.create(user = cls.user, course= cls.course_2)
        resp = cls.api_client.post('http://localhost:8000/api/jwt/create/', {'email': cls.user.email, 'password': '12345678'}, format='json')
        cls.token = resp.data['access']
                
    def test_bookmark_creation(self):
        """Create bookmark"""
        response = self.api_client.post('http://localhost:8000/api/bookmarks/', {'user': self.user.id, 'course': self.course_3.id}, format='json')
        self.assertEqual(response.status_code, 401)
        self.api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.api_client.post('http://localhost:8000/api/bookmarks/', {'user': self.user.id, 'course': self.course_1.id}, format='json')
        self.assertEqual(response.status_code, 400)
        response = self.api_client.post('http://localhost:8000/api/bookmarks/', {'user': self.user.id, 'course': self.course_3.id}, format='json')
        self.assertEqual(response.status_code, 201)


    def test_bookmarks_listing(self):
        """retrieve user bookmarks"""
        self.api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.api_client.get('http://localhost:8000/api/bookmarks/', {'page': 2, 'limit': 1}, format='json')
        self.assertEqual(response.status_code, 200)        
        self.assertEqual(2, response.data['count'])
        self.assertIn('page=1', response.data['previous'])



class UserTestCase(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.api_client = APIClient()
        cls.user_register = {
            'email': 'user_register@test.com',
            'password': 'test123@',
            're_password': 'test123@',
            'first_name': 'User',
            'last_name': 'Admin',
        }
        cls.user_login = {
            'email': 'user_login@test.com',
            'password': '12345678'
        }
        cls.current_user = {
            'email': 'current_user@test.com',
            'password': '12345678'
        }

        cls.user = User.objects.create_user(**cls.user_login)
        user = User.objects.create_user(**cls.current_user)
        user.is_active = True
        user.save()
        response = cls.api_client.post('http://localhost:8000/api/jwt/create/', cls.current_user , format='json')
        cls.token = response.data['access']
                
    def test_user_registration(self):
        """user register"""
        response = self.api_client.post('http://localhost:8000/api/users/', self.user_register, format='json')
        self.assertEqual(response.status_code, 201)
    
    def test_user_login(self):
        """user login"""
        response = self.api_client.post('http://localhost:8000/api/jwt/create/', self.user_login, format='json')
        self.assertEqual(response.status_code, 401)
        error = json.loads(response.content)['detail']
        self.assertEqual(error, 'No active account found with the given credentials')
        self.user.is_active = True
        self.user.save()
        response = self.api_client.post('http://localhost:8000/api/jwt/create/', self.user_login, format='json')
        self.assertEqual(response.status_code, 200)
        self.token = json.loads(response.content)['access']

    def test_current_user(self):
        """user me"""
        self.api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.api_client.get('http://localhost:8000/api/users/me/', format='json')
        self.assertEqual(response.status_code, 200)