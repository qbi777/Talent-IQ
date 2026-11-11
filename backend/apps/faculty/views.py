from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView, ListView, DetailView
from rest_framework import viewsets, permissions
from rest_framework.serializers import ModelSerializer
from .models import FacultyProfile

# DRF Serializer & ViewSet
class FacultyProfileSerializer(ModelSerializer):
    username = serializers = None # fallback
    class Meta:
        model = FacultyProfile
        fields = '__all__'
        depth = 1

class FacultyProfileViewSet(viewsets.ModelViewSet):
    queryset = FacultyProfile.objects.all().select_related('college', 'user')
    serializer_class = FacultyProfileSerializer
    permission_classes = [permissions.AllowAny]

# Django MVT Views
class FacultyDashboardView(TemplateView):
    template_name = 'faculty/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['faculty_list'] = FacultyProfile.objects.all().select_related('college', 'user')[:10]
        context['total_faculty'] = FacultyProfile.objects.count()
        return context

class FacultyListView(ListView):
    model = FacultyProfile
    template_name = 'faculty/list.html'
    context_object_name = 'faculty_members'
    paginate_by = 15
