from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from django.utils import timezone
from .models import StudentAttempt, StudentAnswer
from apps.examinations.models import Examination, Question

class StudentAnswerSerializer(ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'

class StudentAttemptSerializer(ModelSerializer):
    answers = StudentAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudentAttempt
        fields = '__all__'

class StudentAttemptViewSet(viewsets.ModelViewSet):
    queryset = StudentAttempt.objects.all().prefetch_related('answers')
    serializer_class = StudentAttemptSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'])
    def finalize_attempt(self, request, pk=None):
        """
        Finalizes an attempt, calculates total score, sets completion time.
        """
        attempt = self.get_object()
        attempt.is_completed = True
        attempt.end_time = timezone.now()

        # Recalculate total score from answers
        total = sum(a.marks_awarded for a in attempt.answers.all())
        attempt.score_obtained = total
        
        max_marks = attempt.examination.total_marks or 100
        attempt.percentage = round((total / max_marks) * 100, 2)
        
        if attempt.proctoring_violations_count >= attempt.examination.max_violations_allowed:
            attempt.integrity_status = 'Disqualified'
        elif attempt.proctoring_violations_count > 0:
            attempt.integrity_status = 'Flagged'
        else:
            attempt.integrity_status = 'Clean'

        attempt.save()
        return Response({
            'status': 'finalized',
            'score': attempt.score_obtained,
            'percentage': attempt.percentage,
            'integrity_status': attempt.integrity_status
        })

class StudentAnswerViewSet(viewsets.ModelViewSet):
    queryset = StudentAnswer.objects.all()
    serializer_class = StudentAnswerSerializer
    permission_classes = [permissions.AllowAny]
