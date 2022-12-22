from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, AbstractUser
)
class Information(models.Model):
    university = models.CharField(max_length=100)
    description = models.TextField(null=True)
    city = models.CharField(max_length=200)
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
    title = models.CharField(max_length=30)
    name = models.CharField(max_length=30)
    value = models.CharField(max_length=30)
    report_count = models.IntegerField(null=True)

class Percentage(Rating):
    title = models.CharField(max_length=30)
    value = models.CharField(max_length=30)

class Portal(models.Model):
    name = models.CharField(max_length=20)
    link = models.CharField(max_length=100)

class History(models.Model):
    portal = models.ForeignKey(
        'Portal',
        on_delete=models.CASCADE,)
    link = models.CharField(max_length=100)


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
    evaluation_count = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
            **extra_fields
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user
    
    def create_staffuser(self, email, password, **extra_fields):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
            **extra_fields
        )
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractUser):
    class Type(models.TextChoices):
        APPLICANT = 'applicant'
        COURSE_OPERATOR = 'course_operator'
        ADMINISTRATOR = 'admin'
    
    username = None
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    type = models.CharField(max_length=20, choices=Type.choices)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Email & Password are required by default.
    objects = UserManager()
    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True
