from django.db import models
from apps.submissions.models import StudentAttempt

class ProctoringEvent(models.Model):
    EVENT_TYPES = [
        ('tab_switch', 'Browser Tab Switch / Lost Focus'),
        ('no_face', 'Candidate Face Not Detected in Camera'),
        ('multiple_faces', 'Multiple Faces Detected in View'),
        ('looking_away', 'Candidate Eye Gaze Diverted Continuously'),
        ('audio_spike', 'Speech / Acoustic Noise Anomaly Detected'),
        ('devtools_opened', 'Developer Tools / Inspect Element Opened'),
        ('copy_paste', 'Clipboard Copy / Paste Attempted'),
    ]

    SEVERITY_LEVELS = [
        ('Low', 'Low Warning (e.g. Brief glance)'),
        ('Medium', 'Medium Warning (e.g. Background noise)'),
        ('Critical', 'Critical Violation (e.g. Tab switch, multiple faces)'),
    ]

    attempt = models.ForeignKey(StudentAttempt, on_delete=models.CASCADE, related_name='proctoring_events')
    event_type = models.CharField(max_length=32, choices=EVENT_TYPES)
    severity = models.CharField(max_length=16, choices=SEVERITY_LEVELS, default='Medium')
    timestamp = models.DateTimeField(auto_now_add=True)
    snapshot_url = models.TextField(blank=True, help_text="Base64 or image URL captured at event")
    description = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, default=dict)

    def __str__(self):
        return f"[{self.severity}] {self.get_event_type_display()} - {self.attempt.student_name} ({self.timestamp.strftime('%H:%M:%S')})"

    class Meta:
        ordering = ['-timestamp']
