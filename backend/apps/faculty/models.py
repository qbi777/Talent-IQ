from django.db import models
from django.contrib.auth.models import User
from apps.colleges.models import College

class FacultyProfile(models.Model):
    DEPARTMENT_CHOICES = [
        ('CSE', 'Computer Science and Engineering'),
        ('IT', 'Information Technology'),
        ('ECE', 'Electronics & Communication'),
        ('EEE', 'Electrical & Electronics'),
        ('MECH', 'Mechanical Engineering'),
        ('AIDS', 'AI & Data Science'),
        ('CIVIL', 'Civil Engineering'),
        ('MATH', 'Mathematics & Sciences'),
    ]

    DESIGNATION_CHOICES = [
        ('Professor', 'Professor'),
        ('Associate Professor', 'Associate Professor'),
        ('Assistant Professor', 'Assistant Professor'),
        ('HOD', 'Head of the Department'),
        ('Dean', 'Dean / Academic Director'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='faculty_profile')
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='faculty_members')
    employee_id = models.CharField(max_length=32, unique=True)
    department = models.CharField(max_length=32, choices=DEPARTMENT_CHOICES)
    designation = models.CharField(max_length=64, choices=DESIGNATION_CHOICES)
    phone = models.CharField(max_length=20, blank=True)
    can_create_exams = models.BooleanField(default=True)
    can_publish_results = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.department}, {self.college.name})"

    class Meta:
        verbose_name = 'Faculty Profile'
        verbose_name_plural = 'Faculty Profiles'
