from django.contrib import admin
from .models import Examination, Question

class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1

@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'college', 'exam_type', 'duration_minutes', 'total_marks', 'is_published')
    list_filter = ('exam_type', 'is_published', 'college__district')
    search_fields = ('code', 'title', 'description')
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('examination', 'order', 'question_type', 'marks')
    list_filter = ('question_type', 'examination')
    search_fields = ('question_text',)
