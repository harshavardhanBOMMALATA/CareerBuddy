from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.home, name='home'),
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path('registerpage/', views.register_page, name='register_page'),
    path('loginpage/', views.login_page, name='login_page'),

]