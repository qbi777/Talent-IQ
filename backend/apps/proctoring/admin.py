from django.contrib import admin
from .models import ProctoringEvent

@admin.register(ProctoringEvent)
class ProctoringEventAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'attempt', 'severity', 'timestamp')
    list_filter = ('event_type', 'severity', 'timestamp')
    search_fields = ('attempt__student_name', 'attempt__register_number', 'description')
    readonly_fields = ('timestamp',)
