"""
URL configuration for careerbuddy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('api.urls')),
    path('api/',include('api.urls')),
    path('home/', views.home, name='home'),
    path('resume_analyzer/', views.resume_analyzer, name='resume_analyzer'),
    path('analyze-resume/', views.analyze_resume, name='analyze_resume'),
    path('roadmap/', views.roadmap, name='roadmap'),
    path('roadmap-generator/', views.roadmap_generator, name='roadmap_generator'),
    path('resume-generator/', views.resume_generator, name='resume_generator'),
    path('interview_prep/', views.interview_prep, name='interview_prep'),
    path('start-interview/',views.start_interview,name='start_interview'),
    path('interview-feedback/',views.interview_feedback,name='interview_feedback'),
    path('resume-generator/', views.resume_generation, name='resume_generator'),
    path('activity/', views.get_activity, name='get_activity'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('progress-stats/', views.progress_stats, name='progress_stats'),
    path('authentication/', views.authentication, name='authentication'),
]
