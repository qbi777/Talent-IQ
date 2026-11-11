from django.db import models

class College(models.Model):
    DISTRICT_CHOICES = [
        ('Chennai', 'Chennai'),
        ('Coimbatore', 'Coimbatore'),
        ('Madurai', 'Madurai'),
        ('Tiruchirappalli', 'Tiruchirappalli'),
        ('Salem', 'Salem'),
        ('Tirunelveli', 'Tirunelveli'),
        ('Thoothukudi', 'Thoothukudi'),
        ('Kanyakumari', 'Kanyakumari'),
        ('Vellore', 'Vellore'),
        ('Thanjavur', 'Thanjavur'),
        ('Erode', 'Erode'),
        ('Dindigul', 'Dindigul'),
        ('Chengalpattu', 'Chengalpattu'),
    ]

    TYPE_CHOICES = [
        ('Autonomous', 'Autonomous'),
        ('Government', 'Government'),
        ('Deemed University', 'Deemed University'),
        ('Self-Financing', 'Self-Financing'),
    ]

    NAAC_CHOICES = [
        ('A++', 'A++'),
        ('A+', 'A+'),
        ('A', 'A'),
        ('B++', 'B++'),
    ]

    college_id = models.CharField(max_length=16, unique=True, help_text="e.g. COL001")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=32, help_text="TNEA or college code, e.g. 1315")
    district = models.CharField(max_length=64, choices=DISTRICT_CHOICES)
    city = models.CharField(max_length=128)
    established = models.PositiveIntegerField(default=2000)
    college_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default='Autonomous')
    naac_grade = models.CharField(max_length=8, choices=NAAC_CHOICES, default='A++')
    nirf_rank = models.PositiveIntegerField(null=True, blank=True)
    website = models.URLField(blank=True, default='')
    participating_in_public_rankings = models.BooleanField(default=True)
    total_students_assessed = models.PositiveIntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.college_id} - {self.name} ({self.district})"

    class Meta:
        ordering = ['-average_score', 'name']
