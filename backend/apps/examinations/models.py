from django.db import models
from django.contrib.auth.models import User
from apps.colleges.models import College

class Examination(models.Model):
    EXAM_TYPES = [
        ('Aptitude', 'General Aptitude & Reasoning'),
        ('Domain_Core', 'Engineering Core Domain'),
        ('Coding', 'Algorithmic Coding & Problem Solving'),
        ('Comprehensive', 'Comprehensive Assessment'),
    ]

    title = models.CharField(max_length=255)
    code = models.CharField(max_length=64, unique=True, help_text="e.g. TIQ-APT-2026-01")
    description = models.TextField(blank=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='examinations', null=True, blank=True)
    exam_type = models.CharField(max_length=32, choices=EXAM_TYPES, default='Aptitude')
    duration_minutes = models.PositiveIntegerField(default=60)
    total_marks = models.PositiveIntegerField(default=100)
    passing_marks = models.PositiveIntegerField(default=40)
    
    # Proctoring configurations
    enable_camera_proctoring = models.BooleanField(default=True)
    enable_tab_switch_detection = models.BooleanField(default=True)
    enable_audio_monitoring = models.BooleanField(default=True)
    max_violations_allowed = models.PositiveIntegerField(default=3)

    is_published = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.title} ({self.get_exam_type_display()})"

    class Meta:
        ordering = ['-created_at']


class Question(models.Model):
    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice Question'),
        ('CODING', 'Coding Challenge'),
        ('DESCRIPTIVE', 'Descriptive / Short Answer'),
    ]

    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='questions')
    order = models.PositiveIntegerField(default=1)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='MCQ')
    question_text = models.TextField()
    
    # For MCQ
    options = models.JSONField(blank=True, default=list, help_text="Array of string choices")
    correct_answer = models.CharField(max_length=255, blank=True, help_text="Index or exact answer string")
    
    # For Coding questions
    starter_code = models.TextField(blank=True, help_text="Starter boilerplate code")
    coding_language = models.CharField(max_length=32, default='python', blank=True)
    test_cases = models.JSONField(blank=True, default=list, help_text="[{'input': '...', 'expected': '...'}]")
    
    marks = models.PositiveIntegerField(default=5)
    rubric_guidelines = models.TextField(blank=True, help_text="AI evaluation guidelines for open responses")

    def __str__(self):
        return f"Q{self.order} ({self.get_question_type_display()}) - {self.examination.code}"

    class Meta:
        ordering = ['examination', 'order']
