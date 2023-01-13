from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django.contrib.postgres.fields import ArrayField

class Information(models.Model):
    university = models.CharField(max_length=100)
    description = models.TextField(null=True)
    city = models.CharField(max_length=500)
    study_start = models.CharField(max_length=100, null=True)
    study_form = models.CharField(max_length=100, null=True)
    study_periode = models.CharField(max_length=100, null=True)
    degree = models.CharField(max_length=100, null=True)
    languages = models.CharField(max_length=100, null=True)
    website_link = models.CharField(max_length=400, null=True)
    credit_points = models.CharField(max_length=50, null=True)
    costs = models.CharField(max_length=100, null=True)
    contents = models.TextField(null=True)
    requirements = models.TextField(null=True)
    other_information = models.JSONField(null=True)
    models = models.JSONField(null=True)

class Rating(models.Model):
    class Meta:
        abstract = True
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
    )

class Comment(Rating):
    title = models.CharField(max_length=100)
    content = models.TextField()
    star_rating = models.CharField(max_length=5)
    additional_evaluation = models.JSONField(null=True)
    date = models.DateField()

class Star(Rating):
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    report_count = models.IntegerField(null=True)

class Percentage(Rating):
    title = models.CharField(max_length=100)
    value = models.CharField(max_length=100)

class Portal(models.Model):
    name = models.CharField(max_length=20)
    link = models.CharField(max_length=100)

class History(models.Model):
    portal = models.ForeignKey(
        'Portal',
        on_delete=models.CASCADE,)
    link = models.CharField(max_length=100)

class Logo(models.Model):
    path = models.CharField(max_length=100)
    image = models.ImageField(upload_to='./scraperApp/static/', max_length=500, null=True)


class Course(models.Model):
    name = models.CharField(max_length=100, null=True)
    link = models.CharField(max_length=400, null=True)
    portal = models.ForeignKey(
        'Portal',
        on_delete=models.CASCADE,
    )
    information = models.OneToOneField(
        'Information',
        on_delete=models.SET_NULL,
        null=True
    )
    logo = models.ForeignKey(
        'Logo',
        on_delete=models.SET_NULL,
        null=True
    )
    evaluation_count = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_valid = models.BooleanField(default=False)
    validated_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='validation'
    )
    invalidated_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='invalidation'
    )


    
class User(AbstractUser):
    """ class Type(models.TextChoices):
        APPLICANT = 'applicant'
        COURSE_OPERATOR = 'course_operator'
        ADMINISTRATOR = 'admin' """
    
    username = None
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    #type = models.CharField(max_length=20, choices=Type.choices)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] # Email & Password are required by default.
    objects = UserManager()
    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

class Bookmark(models.Model):
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
    )
    class Meta:
       unique_together = ('user', 'course')
