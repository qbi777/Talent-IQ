from django.urls import path
from .views import CollegeListView, CollegeDetailView

urlpatterns = [
    path('', CollegeListView.as_view(), name='college_list'),
    path('colleges/<str:college_id>/', CollegeDetailView.as_view(), name='college_detail'),
]
