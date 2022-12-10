from django.db import models

class Information(models.Model):
    university = models.CharField(max_length=100)
    description = models.TextField(null=True)
    city = models.CharField(max_length=200)
    study_start = models.CharField(max_length=100, null=True)
    study_form = models.CharField(max_length=100, null=True)
    study_periode = models.CharField(max_length=100, null=True)
    degree = models.CharField(max_length=100, null=True)
    languages = models.CharField(max_length=100, null=True)
    website_link = models.CharField(max_length=200, null=True)
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
    name = models.CharField(max_length=100)
    link = models.CharField(max_length=100)
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