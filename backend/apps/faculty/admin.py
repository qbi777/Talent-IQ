from django.contrib import admin
from .models import FacultyProfile

@admin.register(FacultyProfile)
class FacultyProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'college', 'department', 'designation', 'employee_id', 'can_create_exams')
    list_filter = ('department', 'designation', 'college__district', 'can_create_exams')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'employee_id', 'college__name')
