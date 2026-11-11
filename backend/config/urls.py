"""
URL configuration for Talent IQ backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # MVT HTML Web Routes
    path('', include('apps.colleges.urls_web')),
    path('faculty/', include('apps.faculty.urls_web')),
    path('examinations/', include('apps.examinations.urls_web')),
    
    # REST API Endpoints
    path('api/colleges/', include('apps.colleges.urls')),
    path('api/faculty/', include('apps.faculty.urls')),
    path('api/examinations/', include('apps.examinations.urls')),
    path('api/submissions/', include('apps.submissions.urls')),
    path('api/proctoring/', include('apps.proctoring.urls')),
    path('api/evaluation/', include('apps.evaluation.urls')),
    path('api/google-drive/', include('apps.google_drive.urls')),
]
