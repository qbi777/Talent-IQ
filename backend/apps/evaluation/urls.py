from django.urls import path
from .views import TriggerEvaluationView

urlpatterns = [
    path('evaluate-answer/<int:answer_id>/', TriggerEvaluationView.as_view(), name='evaluate-answer'),
]
