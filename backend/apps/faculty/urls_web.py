from django.urls import path
from .views import FacultyDashboardView, FacultyListView

app_name = 'faculty'

urlpatterns = [
    path('', FacultyDashboardView.as_view(), name='dashboard'),
    path('directory/', FacultyListView.as_view(), name='directory'),
]
