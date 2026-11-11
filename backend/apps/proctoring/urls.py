from rest_framework.routers import DefaultRouter
from .views import ProctoringEventViewSet

router = DefaultRouter()
router.register(r'events', ProctoringEventViewSet, basename='proctoring-events')

urlpatterns = router.urls
