from django.urls import path
from .views import ExportCohortCSVView, SyncToGoogleDriveView

urlpatterns = [
    path('export-csv/<int:exam_id>/', ExportCohortCSVView.as_view(), name='export-csv'),
    path('sync-drive/<int:exam_id>/', SyncToGoogleDriveView.as_view(), name='sync-drive'),
]
