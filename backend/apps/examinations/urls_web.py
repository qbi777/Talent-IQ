from django.urls import path
from .views import ExamListView, ExamDetailView, TakeExamView

app_name = 'examinations'

urlpatterns = [
    path('', ExamListView.as_view(), name='list'),
    path('<str:code>/', ExamDetailView.as_view(), name='detail'),
    path('<str:code>/take/', TakeExamView.as_view(), name='take'),
]
