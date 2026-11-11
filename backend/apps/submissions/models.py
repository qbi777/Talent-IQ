from django.db import models
from apps.colleges.models import College
from apps.examinations.models import Examination, Question

class StudentAttempt(models.Model):
    INTEGRITY_CHOICES = [
        ('Clean', 'Clean / Verified (No Suspicious Events)'),
        ('Flagged', 'Flagged for Review (Minor Warnings)'),
        ('Disqualified', 'Disqualified (Multiple Critical Violations)'),
    ]

    attempt_id = models.CharField(max_length=64, unique=True)
    student_name = models.CharField(max_length=128)
    register_number = models.CharField(max_length=64, db_index=True)
    email = models.EmailField()
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='student_attempts')
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='attempts')
    
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    
    # Results & Proctoring summary
    score_obtained = models.FloatField(default=0.0)
    percentage = models.FloatField(default=0.0)
    proctoring_violations_count = models.PositiveIntegerField(default=0)
    integrity_status = models.CharField(max_length=32, choices=INTEGRITY_CHOICES, default='Clean')
    
    google_drive_sheet_synced = models.BooleanField(default=False)
    google_drive_file_id = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return f"{self.student_name} ({self.register_number}) - {self.examination.code} [{self.score_obtained} pts]"

    class Meta:
        ordering = ['-start_time']


class StudentAnswer(models.Model):
    attempt = models.ForeignKey(StudentAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    
    # Answers submitted
    selected_option = models.CharField(max_length=255, blank=True)
    code_submission = models.TextField(blank=True)
    descriptive_response = models.TextField(blank=True)
    
    # Evaluation
    is_correct = models.BooleanField(default=False)
    marks_awarded = models.FloatField(default=0.0)
    ai_evaluation_notes = models.TextField(blank=True)
    evaluated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ans: {self.attempt.student_name} - Q{self.question.order} ({self.marks_awarded} marks)"

    class Meta:
        unique_together = ('attempt', 'question')
