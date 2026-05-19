from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import PyPDF2
from groq import Groq
import json
from api.models import History, ResumeAnalyzer , RoadmapGenerator , Activity

import os

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)




@csrf_exempt
def analyze_resume(request):

    if request.method == "POST":

        # GET FILE + ROLE

        uploaded_file = request.FILES.get("resume")
        role = request.POST.get("role", "Software Engineer")

        if not uploaded_file:

            return JsonResponse({
                "error": "No file uploaded"
            })

        # READ PDF

        pdf_reader = PyPDF2.PdfReader(uploaded_file)

        text = ""

        for page in pdf_reader.pages:

            extracted = page.extract_text()

            if extracted:

                text += extracted

        # AI PROMPT

        prompt = f"""
        Analyze this resume for the role: {role}

        Resume Text:
        {text}

        IMPORTANT:
        Return ONLY pure JSON.
        Do not add explanations.
        Do not add markdown.
        Do not write anything before or after JSON.
        Do not use ```json.

        Return format:

        {{
            "ats_score": 85,
            "skills": ["Python", "AWS", "Docker"],
            "missing_keywords": ["Kubernetes", "CI/CD"],
            "strengths": [
                "Strong technical skills",
                "Good projects",
                "Cloud exposure",
                "Problem solving",
                "Team collaboration"
            ],
            "suggestions": [
                "Add certifications",
                "Improve ATS keywords",
                "Add metrics",
                "Improve summary",
                "Add internship details"
            ]
        }}
        """

        # SEND TO GROQ

        response = client.chat.completions.create(

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            model="llama-3.1-8b-instant"

        )

        # AI RESPONSE

        result = response.choices[0].message.content

        parsed_result = json.loads(result)

        # ACTIVITY TEXT USING GROQ

        activity_prompt = f"""
        Convert this sentence into one professional short activity line.

        Sentence:
        Resume analyzed for {role}

        Return only one short sentence.
        """

        activity_response = client.chat.completions.create(

            messages=[
                {
                    "role": "user",
                    "content": activity_prompt
                }
            ],

            model="llama-3.1-8b-instant"

        )

        activity_text = \
        activity_response.choices[0].message.content.strip()

        # STORE ACTIVITY

        Activity.objects.create(

            email=request.user.email,

            feature_name="Resume Analyze",

            text=activity_text

        )

        print(result)

        # SEND TO FRONTEND

        return JsonResponse({

            "message": "Resume analyzed successfully",

            "result": result

        })

    return JsonResponse({

        "error": "Invalid request"

    })






def start_interview(request):

    if request.method == "POST":

        data = json.loads(request.body)

        role = data.get("role")

        difficulty = data.get("difficulty")

        history = data.get("history")

        prompt = f"""
        You are an AI interviewer.

        Role:
        {role}

        Difficulty:
        {difficulty}

        Interview Conversation:
        {history}

        Based on previous questions and candidate answers, give a short appreciation sentence for the candidates last answer.
        Based on previous questions
        and candidate answers,
        ask ONLY ONE next interview
        question.

        Do not give explanations.

        Return only question text.
        """

        response = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            messages=[
                {
                    "role":"user",
                    "content":prompt
                }
            ]

        )

        question = \
        response.choices[0].message.content

        return JsonResponse({

            "question":question

        })

    return JsonResponse({

        "error":"Invalid Request"

    })






def interview_feedback(request):

    if request.method == "POST":

        data = json.loads(request.body)

        history = data.get("history")

        prompt = f"""
        Analyze this interview.

        Interview:
        {history}

        Return ONLY valid JSON.

        Do not add markdown.
        Do not add explanation.
        Do not add headings.

        Format:

        {{
            "confidence":85,
            "communication":90,
            "technical":80
        }}
        """

        response = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            messages=[
                {
                    "role":"user",
                    "content":prompt
                }
            ]

        )

        text = response.choices[0].message.content

        # ACTIVITY VERDICT

        verdict_prompt = f"""
        Give one professional short verdict sentence
        for this interview history.

        Interview:
        {history}

        Return only one sentence.
        """

        verdict_response = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            messages=[
                {
                    "role":"user",
                    "content":verdict_prompt
                }
            ]

        )

        verdict = \
        verdict_response.choices[0].message.content.strip()

        # STORE ACTIVITY

        Activity.objects.create(

            email=request.user.email,

            feature_name="Interview Preparation",

            text=verdict

        )

        return JsonResponse(

            json.loads(text),

            safe=False

        )

    return JsonResponse({

        "error":"Invalid Request"

    })








def home(request):
    return render(request, 'home.html')

def resume_analyzer(request):
    return render(request, 'analyzer.html')

def roadmap(request):
    return render(request, 'roadmap.html')

def resume_generator(request):
    return render(request, 'resumegenrator.html')

def interview_prep(request):
    return render(request, 'interviewprep.html')








@csrf_exempt
def roadmap_generator(request):

    if request.method == "POST":

        data = json.loads(request.body)

        role = data.get("role")

        duration = data.get("duration")

        current_education = data.get("currentEducation")

        # AI PROMPT

        prompt = f"""
        Generate a professional career roadmap.

        Role: {role}

        Duration: {duration}

        Current Education: {current_education}

        IMPORTANT:
        Return ONLY pure JSON.
        Do not add explanations.
        Do not add markdown.
        Do not write anything before or after JSON.
        Do not use ```json.

        Return EXACTLY 5 phases.

        Return format:

        {{
            "phases": [

                {{
                    "phase_title": "Phase 1 - Fundamentals",

                    "duration": "1 Month",

                    "skills": [
                        "HTML",
                        "CSS",
                        "JavaScript"
                    ],

                    "project_recommendation":
                        "Build a responsive portfolio website",

                    "reference_links": [
                        "https://developer.mozilla.org/",
                        "https://www.freecodecamp.org/",
                        "https://www.w3schools.com/",
                        "https://www.youtube.com/"
                    ]
                }}

            ]
        }}
        """

        # GROQ REQUEST

        response = client.chat.completions.create(

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            model="llama-3.1-8b-instant"

        )

        # AI RESPONSE

        result = response.choices[0].message.content

        # ACTIVITY TEXT USING GROQ

        activity_prompt = f"""
        Convert this sentence into one professional short activity line.

        Sentence:
        Roadmap generated for {role}

        Return only one short sentence.
        """

        activity_response = client.chat.completions.create(

            messages=[
                {
                    "role": "user",
                    "content": activity_prompt
                }
            ],

            model="llama-3.1-8b-instant"

        )

        activity_text = \
        activity_response.choices[0].message.content.strip()

        # STORE ACTIVITY

        Activity.objects.create(

            email=request.user.email,

            feature_name="Roadmap Generator",

            text=activity_text

        )

        print(result)

        # SEND TO FRONTEND

        return JsonResponse({

            "message": "Roadmap generated successfully",

            "result": result

        })

    return JsonResponse({

        "error": "Invalid request"

    })




@csrf_exempt
def resume_generation(request):

    if request.method == "POST":

        Activity.objects.create(

            email=request.user.email,

            feature_name="Resume Generation",

            text="User provided details and generated resume"

        )

        return JsonResponse({

            "message": "Resume generated successfully"

        })

    return JsonResponse({

        "error": "Invalid request"

    })








@csrf_exempt
def get_activity(request):

    if request.method == "GET":

        if not request.user.is_authenticated:

            return JsonResponse({

                "activities": []

            })

        activities = Activity.objects.filter(

            email=request.user.email

        ).order_by("-created_at")

        activity_data = []

        for activity in activities:

            activity_data.append({

                "feature_name": activity.feature_name,

                "text": activity.text,

                "created_at": activity.created_at.astimezone().strftime(
                    "%d %b %Y %I:%M %p IST"
                )

            })

        return JsonResponse({

            "activities": activity_data

        })

    return JsonResponse({

        "error": "Invalid Request"

    })





@csrf_exempt
def dashboard_stats(request):

    if request.method == "GET":

        if not request.user.is_authenticated:

            return JsonResponse({

                "resume_analyzed": 0,

                "roadmaps_created": 0,

                "interviews_prepared": 0,

                "average_ats_score": 0

            })

        email = request.user.email

        resume_count = Activity.objects.filter(

            email=email,

            feature_name="Resume Analyze"

        ).count()

        roadmap_count = Activity.objects.filter(

            email=email,

            feature_name="Roadmap Generator"

        ).count()

        interview_count = Activity.objects.filter(

            email=email,

            feature_name="Interview Preparation"

        ).count()

        return JsonResponse({

            "resume_analyzed": resume_count,

            "roadmaps_created": roadmap_count,

            "interviews_prepared": interview_count,

            "average_ats_score": 86

        })

    return JsonResponse({

        "error": "Invalid Request"

    })




from django.db.models import Count
from datetime import datetime
from django.db.models.functions import TruncMonth


@csrf_exempt
def progress_stats(request):

    if request.method == "POST":

        if not request.user.is_authenticated:

            return JsonResponse({

                "values": [0, 0, 0, 0]

            })

        data = json.loads(request.body)

        months = data.get("months", [])

        email = request.user.email

        values = []

        for month in months:

            count = Activity.objects.filter(

                email=email,

                created_at__month=datetime.strptime(
                    month,
                    "%b"
                ).month

            ).count()

            values.append(count)

        return JsonResponse({

            "values": values

        })

    return JsonResponse({

        "error": "Invalid Request"

    })




@csrf_exempt
def authentication(request):

    if request.user.is_authenticated:

        return JsonResponse({

            "authenticated": True,

            "email": request.user.email

        })

    return JsonResponse({

        "authenticated": False

    })