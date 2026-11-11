from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from rest_framework import viewsets
from rest_framework.response import Response
from .models import College

# 1. Django MVT Views (Template Rendering)
class CollegeListView(ListView):
    model = College
    template_name = 'colleges/list.html'
    context_object_name = 'colleges'

    def get_queryset(self):
        district = self.request.GET.get('district')
        if district and district != 'All':
            return College.objects.filter(district=district)
        return College.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['selected_district'] = self.request.GET.get('district', 'All')
        context['districts'] = [d[0] for d in College.DISTRICT_CHOICES]
        return context

class CollegeDetailView(DetailView):
    model = College
    template_name = 'colleges/detail.html'
    context_object_name = 'college'
    slug_field = 'college_id'
    slug_url_kwarg = 'college_id'

# 2. REST API ViewSet
from rest_framework import serializers

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    lookup_field = 'college_id'
