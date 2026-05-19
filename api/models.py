from django.db import models


class History(models.Model):

    email = models.EmailField()

    feature = models.CharField(
        max_length=100
    )

    reference_id = models.IntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.email



class ResumeAnalyzer(models.Model):

    history_id = models.IntegerField()

    email = models.EmailField()

    ats_score = models.IntegerField()

    strengths = models.TextField()

    suggestions = models.TextField()

    missing_keywords = models.TextField()

    detected_skills = models.TextField()

    resume_pdf = models.FileField(
        upload_to="resumes/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.email
    



class RoadmapGenerator(models.Model):

    history_id = models.IntegerField()

    email = models.EmailField()

    target_role = models.CharField(
        max_length=200
    )

    duration = models.CharField(
        max_length=100
    )

    education = models.CharField(
        max_length=200
    )

    response = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.email
    


class Activity(models.Model):

    email = models.EmailField()

    feature_name = models.CharField(
        max_length=200
    )

    text = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.email