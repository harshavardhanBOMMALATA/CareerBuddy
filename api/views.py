from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def home(request):

    return render(request, "login.html")





def register(request):

    if request.method == "POST":

        name = request.POST.get("name")
        email = request.POST.get("email")
        password = request.POST.get("password")

        if User.objects.filter(email=email).exists():

            return JsonResponse({
                "status": "error",
                "message": "Email already exists"
            })

        user = User.objects.create_user(
            username=email,
            first_name=name,
            email=email,
            password=password
        )

        user.save()

        return JsonResponse({
            "status": "success"
        })


@csrf_exempt
def login_view(request):

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=email,
            password=password
        )

        if user is not None:

            login(request, user)

            return JsonResponse({
                "status": "success"
            })

        else:

            return JsonResponse({
                "status": "error",
                "message": "Invalid credentials"
            })




@csrf_exempt
def logout_view(request):

    logout(request)

    return JsonResponse({

        "message": "Logout Successful"

    })


def register_page(request):

    return render(request, "register.html")


def login_page(request):

    return render(request, "login.html")






