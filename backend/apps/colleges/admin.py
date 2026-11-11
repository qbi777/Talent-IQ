from django.contrib import admin
from .models import College

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('college_id', 'name', 'district', 'code', 'naac_grade', 'average_score', 'total_students_assessed')
    list_filter = ('district', 'naac_grade', 'college_type', 'participating_in_public_rankings')
    search_fields = ('name', 'college_id', 'code', 'city')
