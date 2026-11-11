from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, TemplateView
from rest_framework import viewsets, permissions
from rest_framework.serializers import ModelSerializer
from .models import Examination, Question

# DRF Serializers & ViewSets
class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class ExaminationSerializer(ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Examination
        fields = '__all__'

class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all().prefetch_related('questions')
    serializer_class = ExaminationSerializer
    permission_classes = [permissions.AllowAny]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]

# Django MVT Views
class ExamListView(ListView):
    model = Examination
    template_name = 'examinations/list.html'
    context_object_name = 'examinations'
    queryset = Examination.objects.filter(is_published=True)

class ExamDetailView(DetailView):
    model = Examination
    template_name = 'examinations/detail.html'
    context_object_name = 'exam'
    slug_field = 'code'
    slug_url_kwarg = 'code'

class TakeExamView(DetailView):
    model = Examination
    template_name = 'examinations/take_exam.html'
    context_object_name = 'exam'
    slug_field = 'code'
    slug_url_kwarg = 'code'
