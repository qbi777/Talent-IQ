from rest_framework.routers import DefaultRouter
from .views import StudentAttemptViewSet, StudentAnswerViewSet

router = DefaultRouter()
router.register(r'attempts', StudentAttemptViewSet, basename='attempts')
router.register(r'answers', StudentAnswerViewSet, basename='answers')

urlpatterns = router.urls
