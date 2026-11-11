from django.contrib import admin
from .models import StudentAttempt, StudentAnswer

class StudentAnswerInline(admin.TabularInline):
    model = StudentAnswer
    extra = 0
    readonly_fields = ('question', 'selected_option', 'code_submission', 'is_correct', 'marks_awarded')

@admin.register(StudentAttempt)
class StudentAttemptAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'register_number', 'college', 'examination', 'score_obtained', 'percentage', 'integrity_status', 'is_completed')
    list_filter = ('integrity_status', 'is_completed', 'college__district', 'examination__exam_type')
    search_fields = ('student_name', 'register_number', 'email', 'attempt_id')
    inlines = [StudentAnswerInline]

@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'is_correct', 'marks_awarded')
    list_filter = ('is_correct',)
