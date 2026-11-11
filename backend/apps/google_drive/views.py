from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import GoogleDriveSyncService

class ExportCohortCSVView(APIView):
    def get(self, request, exam_id):
        csv_data = GoogleDriveSyncService.generate_cohort_csv(exam_id)
        response = HttpResponse(csv_data, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="Talent_IQ_Exam_{exam_id}_Report.csv"'
        return response

class SyncToGoogleDriveView(APIView):
    def post(self, request, exam_id):
        csv_data = GoogleDriveSyncService.generate_cohort_csv(exam_id)
        drive_res = GoogleDriveSyncService.upload_to_drive(
            csv_data,
            f"Talent_IQ_Exam_{exam_id}_Cohort_Results.csv"
        )
        return Response(drive_res)
