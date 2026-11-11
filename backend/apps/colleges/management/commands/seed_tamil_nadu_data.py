from django.core.management.base import BaseCommand
from apps.colleges.models import College
from apps.examinations.models import Examination, Question

class Command(BaseCommand):
    help = 'Seeds initial Tamil Nadu colleges and sample standardized examinations for Talent IQ.'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Tamil Nadu engineering colleges...")
        colleges_data = [
            {
                'college_id': 'COL001',
                'name': 'College of Engineering, Guindy (CEG Anna University)',
                'code': '0001',
                'district': 'Chennai',
                'city': 'Chennai',
                'established': 1794,
                'college_type': 'Government',
                'naac_grade': 'A++',
                'nirf_rank': 13,
                'total_students_assessed': 1240,
                'average_score': 84.6,
            },
            {
                'college_id': 'COL002',
                'name': 'PSG College of Technology',
                'code': '2006',
                'district': 'Coimbatore',
                'city': 'Coimbatore',
                'established': 1951,
                'college_type': 'Autonomous',
                'naac_grade': 'A++',
                'nirf_rank': 63,
                'total_students_assessed': 980,
                'average_score': 81.2,
            },
            {
                'college_id': 'COL003',
                'name': 'Thiagarajar College of Engineering',
                'code': '5008',
                'district': 'Madurai',
                'city': 'Madurai',
                'established': 1957,
                'college_type': 'Autonomous',
                'naac_grade': 'A+',
                'nirf_rank': 85,
                'total_students_assessed': 820,
                'average_score': 78.4,
            },
            {
                'college_id': 'COL004',
                'name': 'SSN College of Engineering',
                'code': '1315',
                'district': 'Chengalpattu',
                'city': 'Kalavakkam',
                'established': 1996,
                'college_type': 'Autonomous',
                'naac_grade': 'A++',
                'nirf_rank': 45,
                'total_students_assessed': 1120,
                'average_score': 82.9,
            },
            {
                'college_id': 'COL005',
                'name': 'Coimbatore Institute of Technology (CIT)',
                'code': '2005',
                'district': 'Coimbatore',
                'city': 'Coimbatore',
                'established': 1956,
                'college_type': 'Autonomous',
                'naac_grade': 'A+',
                'nirf_rank': 90,
                'total_students_assessed': 750,
                'average_score': 77.1,
            },
        ]

        for c_data in colleges_data:
            c, created = College.objects.update_or_create(
                college_id=c_data['college_id'],
                defaults=c_data
            )
            self.stdout.write(f"  {'Created' if created else 'Updated'}: {c.name}")

        self.stdout.write("Seeding sample examinations...")
        ceg = College.objects.get(college_id='COL001')
        exam, created = Examination.objects.update_or_create(
            code='TIQ-TN-CS-2026',
            defaults={
                'title': 'Tamil Nadu State Technical & Algorithmic Benchmark',
                'college': ceg,
                'exam_type': 'Coding',
                'duration_minutes': 60,
                'total_marks': 100,
                'passing_marks': 50,
                'enable_camera_proctoring': True,
                'enable_tab_switch_detection': True,
                'description': 'Comprehensive computer science core assessment evaluating data structures, algorithmic logic, and asynchronous systems.'
            }
        )

        Question.objects.update_or_create(
            examination=exam,
            order=1,
            defaults={
                'question_type': 'MCQ',
                'question_text': 'What is the tight worst-case time complexity of finding the median in an unsorted array of n elements using Quickselect with Median of Medians?',
                'options': ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
                'correct_answer': 'O(n)',
                'marks': 10,
            }
        )

        Question.objects.update_or_create(
            examination=exam,
            order=2,
            defaults={
                'question_type': 'CODING',
                'question_text': 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Write an O(n) solution using a hash map.',
                'starter_code': 'def two_sum(nums, target):\n    # TODO: Implement hash map lookup\n    pass\n',
                'coding_language': 'python',
                'marks': 40,
                'rubric_guidelines': 'Award 40 marks if single-pass dictionary lookup O(N) time and O(N) space. Deduct 20 if nested O(N^2) loops are used.'
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Talent IQ initial data!"))
