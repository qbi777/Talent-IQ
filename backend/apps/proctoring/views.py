from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from .models import ProctoringEvent
from apps.submissions.models import StudentAttempt

class ProctoringEventSerializer(ModelSerializer):
    class Meta:
        model = ProctoringEvent
        fields = '__all__'

class ProctoringEventViewSet(viewsets.ModelViewSet):
    queryset = ProctoringEvent.objects.all().select_related('attempt')
    serializer_class = ProctoringEventSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        event = serializer.save()
        # Increment attempt violations count
        attempt = event.attempt
        if event.severity in ['Medium', 'Critical']:
            attempt.proctoring_violations_count += 1
            if attempt.proctoring_violations_count >= attempt.examination.max_violations_allowed:
                attempt.integrity_status = 'Disqualified'
            else:
                attempt.integrity_status = 'Flagged'
            attempt.save(update_fields=['proctoring_violations_count', 'integrity_status'])
