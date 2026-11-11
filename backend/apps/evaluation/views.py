from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import AIEvaluationService
from apps.submissions.models import StudentAnswer

class TriggerEvaluationView(APIView):
    def post(self, request, answer_id):
        try:
            answer = StudentAnswer.objects.select_related('question').get(id=answer_id)
            q = answer.question
            if q.question_type == 'MCQ':
                eval_result = AIEvaluationService.evaluate_mcq(
                    answer.selected_option,
                    q.correct_answer,
                    q.marks
                )
            else:
                eval_result = AIEvaluationService.evaluate_code_submission(
                    answer.code_submission or answer.descriptive_response,
                    q.question_text,
                    q.rubric_guidelines,
                    q.marks
                )
            
            answer.is_correct = eval_result.get('is_correct', False)
            answer.marks_awarded = eval_result.get('marks_awarded', 0)
            answer.ai_evaluation_notes = eval_result.get('feedback', '')
            answer.save()

            return Response({
                'answer_id': answer.id,
                'is_correct': answer.is_correct,
                'marks_awarded': answer.marks_awarded,
                'feedback': answer.ai_evaluation_notes
            })
        except StudentAnswer.DoesNotExist:
            return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
