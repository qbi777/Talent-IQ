from rest_framework.routers import DefaultRouter
from .views import ExaminationViewSet, QuestionViewSet

router = DefaultRouter()
router.register(r'exams', ExaminationViewSet, basename='examinations')
router.register(r'questions', QuestionViewSet, basename='questions')

urlpatterns = router.urls
