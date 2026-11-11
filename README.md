# Talent IQ — Institutional Assessment & AI Proctoring Platform

[![Python Django MVT](https://img.shields.io/badge/Backend-Django_5.0_MVT-0C4B33?logo=django&logoColor=white)](#backend-python-django-mvt)
[![React 19 Vite](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react&logoColor=black)](#frontend-react--vite)
[![Apple Design](https://img.shields.io/badge/UI_Design-Apple_Design_Language-0071E3?logo=apple&logoColor=white)](#apple-design-language-system)
[![Tamil Nadu Institutions](https://img.shields.io/badge/Institutional_Coverage-Tamil_Nadu_38_Districts-34C759)](#institutions-and-assessments)

Talent IQ is an enterprise-grade academic evaluation, AI proctoring, and institutional benchmarking system designed specifically for higher education engineering institutions across Tamil Nadu (Autonomous, Government, and Affiliated colleges). Built with an **Apple-inspired UI design language**, a **React 19 frontend**, and a **Python Django MVT + REST backend**.

---

## Table of Contents
1. [Project Directory Architecture](#1-project-directory-architecture)
2. [Apple Design Language System](#2-apple-design-language-system)
3. [Step-by-Step Setup & Execution Guide](#3-step-by-step-setup--execution-guide)
   - [Running the Frontend (React + Vite)](#a-running-the-frontend-react--vite)
   - [Running the Backend (Python Django MVT)](#b-running-the-backend-python-django-mvt)
   - [Seeding Sample Tamil Nadu Colleges & Exams](#c-seeding-sample-tamil-nadu-colleges--exams)
4. [Backend (Python Django MVT) Deep Dive](#4-backend-python-django-mvt-deep-dive)
   - [Colleges App (`apps.colleges`)](#colleges-app-appscolleges)
   - [Faculty App (`apps.faculty`)](#faculty-app-appsfaculty)
   - [Examinations App (`apps.examinations`)](#examinations-app-appsexaminations)
   - [Submissions App (`apps.submissions`)](#submissions-app-appssubmissions)
   - [AI Proctoring App (`apps.proctoring`)](#ai-proctoring-app-appsproctoring)
   - [AI Evaluation Engine (`apps.evaluation`)](#ai-evaluation-engine-appsevaluation)
   - [Google Drive / Sheets Sync (`apps.google_drive`)](#google-drive--sheets-sync-appsgoogle_drive)
5. [Frontend Architecture & Asset Management](#5-frontend-architecture--asset-management)
   - [Images & Logos Folder (`frontend/images/`)](#images--logos-folder-frontendimages)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Environment Variables Reference](#7-environment-variables-reference)

---

## 1. Project Directory Architecture

The repository is modularized into `frontend/` and `backend/` layers:

```
talent-iq/
├── frontend/                     # React 19 + TypeScript + Vite SPA
│   ├── images/                   # Asset folder for logos and branding
│   │   ├── README.md             # Guidelines for logo resolutions and formats
│   │   └── talent_iq_logo.svg    # Vector Apple-style Talent IQ brand icon
│   └── src/
│       ├── App.tsx               # Main SPA view router and shell
│       ├── index.css             # Tailwind CSS imports & global SF typography
│       └── main.tsx              # React DOM entry point
│
├── backend/                      # Python Django 5 MVT & REST Backend
│   ├── manage.py                 # Django command-line execution entry point
│   ├── requirements.txt          # Python dependencies (Django, DRF, Celery, etc.)
│   ├── config/                   # Core Django project settings & routing
│   │   ├── settings.py           # Database, middleware, apps, and Gemini AI config
│   │   ├── urls.py               # Root URL router (combines MVT + REST)
│   │   ├── wsgi.py               # WSGI production server hook
│   │   └── asgi.py               # ASGI async server hook
│   ├── templates/                # Django MVT Server-Side Rendered Templates
│   │   ├── base.html             # Apple-aesthetic master layout with blur header
│   │   ├── colleges/             # College directory and institutional metrics
│   │   │   ├── list.html
│   │   │   └── detail.html
│   │   ├── faculty/              # Faculty evaluation control center
│   │   │   ├── dashboard.html
│   │   │   └── list.html
│   │   └── examinations/         # Assessment catalog & proctored testing room
│   │       ├── list.html
│   │       ├── detail.html
│   │       └── take_exam.html
│   └── apps/                     # Modular Django Applications
│       ├── colleges/             # Tamil Nadu colleges, NAAC, NIRF, stats
│       ├── faculty/              # Faculty profiles, departments, permissions
│       ├── examinations/         # Exam builder, question banks, rubrics
│       ├── submissions/          # Student attempts, answers, scoring
│       ├── proctoring/           # AI webcam, face detection, tab-switch watcher
│       ├── evaluation/           # Gemini AI automated code & rubric grading
│       └── google_drive/         # Google Drive, Docs & Sheets cohort sync
│
├── index.html                    # Root HTML entry point
├── metadata.json                 # AI Studio metadata & capabilities
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build and dev configuration
└── README.md                     # Master platform documentation
```

---

## 2. Apple Design Language System

Talent IQ is designed in adherence to Apple Human Interface Guidelines:

- **Background & Canvas**: Apple pure canvas (`#f5f5f7`) with high-contrast content cards (`#ffffff`).
- **Accent Palette**: 
  - Apple Blue (`#0071e3` / hover `#0077ed`) for primary actions.
  - Apple Mint Green (`#34c759`) for verified candidates and high accuracy scores.
  - Apple Amber (`#ff9500`) for proctoring warnings and review flags.
  - Apple Coral Red (`#ff3b30`) for disqualified attempts and integrity violations.
- **Glassmorphism**: Headers feature `backdrop-filter: blur(20px)` with translucent borders (`rgba(210, 210, 215, 0.6)`).
- **Curvatures & Squircle**: 18px (`rounded-2xl`) and 24px (`rounded-3xl`) squircle cards with subtle borders (`border-apple-border/60`).
- **Typography**: `-apple-system`, `SF Pro Display`, `SF Pro Text`, with deliberate tracking (`tracking-tight`, `tracking-wide`) and zero visual clutter.

---

## 3. Step-by-Step Setup & Execution Guide

### A. Running the Frontend (React + Vite)

The frontend runs with Node.js and Vite:

```bash
# 1. Install Node.js dependencies
npm install

# 2. Start Vite development server (Default: Port 3000)
npm run dev

# 3. Build for production
npm run build
```

The React app will be live at `http://localhost:3000`.

---

### B. Running the Backend (Python Django MVT)

The backend runs on Python 3.10+ with Django 5.0 and Django REST Framework:

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python3 -m venv venv
# On Linux / macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Run database migrations (creates SQLite or PostgreSQL tables)
python manage.py makemigrations
python manage.py migrate

# 5. Create a Superuser / Admin account (for Django Admin portal)
python manage.py createsuperuser

# 6. Start the Django development server
python manage.py runserver 8000
```

The Django application is accessible at:
- **MVT Web Portal**: `http://localhost:8000/`
- **Faculty Portal**: `http://localhost:8000/faculty/`
- **Examinations Catalog**: `http://localhost:8000/examinations/`
- **Django Admin Interface**: `http://localhost:8000/admin/`
- **REST API Explorer**: `http://localhost:8000/api/`

---

### C. Seeding Sample Tamil Nadu Colleges & Exams

To instantly populate the database with engineering colleges (CEG Anna University, PSG Tech, Thiagarajar, SSN, CIT) and sample examinations:

```bash
cd backend
python manage.py seed_tamil_nadu_data
```

---

## 4. Backend (Python Django MVT) Deep Dive

### Colleges App (`apps.colleges`)
- **`College` Model**:
  - `college_id`: Unique identifier (e.g., `COL001`).
  - `name`: Institutional name.
  - `code`: TNEA or Anna University counseling code (e.g., `0001`, `1315`).
  - `district`: One of the 38 Tamil Nadu revenue districts (Chennai, Coimbatore, Madurai, etc.).
  - `college_type`: Autonomous, Government, Deemed University, or Self-Financing.
  - `naac_grade`: A++, A+, A, B++.
  - `nirf_rank`: National Institutional Ranking Framework rank.
  - `total_students_assessed`: Aggregated tally of evaluated candidates.
  - `average_score`: Rolling percentage average for the institution.
- **Views**:
  - `CollegeListView`: Server-side rendered filterable list by district and accreditation.
  - `CollegeDetailView`: Detailed profile showcasing institutional performance metrics.
  - `CollegeViewSet`: REST API for programmatic querying and external integrations.

---

### Faculty App (`apps.faculty`)
- **`FacultyProfile` Model**:
  - Linked to Django `User` via `OneToOneField`.
  - `department`: CSE, IT, ECE, EEE, MECH, AIDS, CIVIL, MATH.
  - `designation`: Professor, Associate Professor, Assistant Professor, HOD, Dean.
  - `can_create_exams` & `can_publish_results`: Role-based access control.
- **Views**:
  - `FacultyDashboardView`: Management overview of student attempts, pass rates, and active exam sessions.
  - `FacultyProfileViewSet`: REST endpoints for faculty management.

---

### Examinations App (`apps.examinations`)
- **`Examination` Model**:
  - `code`: Unique code (e.g., `TIQ-TN-CS-2026`).
  - `exam_type`: General Aptitude, Engineering Core Domain, or Algorithmic Coding.
  - `duration_minutes`: Time limit enforced by countdown timers.
  - `total_marks` & `passing_marks`.
  - Proctoring Flags: `enable_camera_proctoring`, `enable_tab_switch_detection`, `enable_audio_monitoring`, `max_violations_allowed`.
- **`Question` Model**:
  - `question_type`: `MCQ` (Multiple Choice), `CODING` (Python/JS solution), `DESCRIPTIVE`.
  - `options`: JSON list of choices for MCQs.
  - `starter_code`: Starter snippet provided to candidate for coding problems.
  - `rubric_guidelines`: Guidelines used by the AI Evaluation Engine.
- **Views**:
  - `ExamListView`: Public and student-facing examination schedule.
  - `ExamDetailView`: Syllabus, time constraints, and integrity requirements.
  - `TakeExamView`: Interactive test environment with countdown timer and proctoring feed simulation.

---

### Submissions App (`apps.submissions`)
- **`StudentAttempt` Model**:
  - Tracks student info (`register_number`, `student_name`, `email`, `college`).
  - Tracks timestamps (`start_time`, `end_time`), completion flag, and calculated score.
  - Tracks `integrity_status`: `Clean` (Verified), `Flagged` (Warnings), or `Disqualified`.
- **`StudentAnswer` Model**:
  - Stores submitted option, coding snippet, or descriptive text.
  - Caches `marks_awarded` and `ai_evaluation_notes`.
- **Views**:
  - `StudentAttemptViewSet.finalize_attempt`: Automatically tallies scores, updates integrity classification based on violations count, and sets the timestamp.

---

### AI Proctoring App (`apps.proctoring`)
- **`ProctoringEvent` Model**:
  - `event_type`: `tab_switch`, `no_face`, `multiple_faces`, `looking_away`, `audio_spike`, `devtools_opened`.
  - `severity`: `Low`, `Medium`, `Critical`.
  - `snapshot_url`: Snapshot image or base64 evidence recorded at timestamp.
- **Automatic Enforcement**:
  - When a `Medium` or `Critical` event is logged, `attempt.proctoring_violations_count` is incremented.
  - If `violations >= exam.max_violations_allowed`, the attempt is automatically marked as **`Disqualified`**.

---

### AI Evaluation Engine (`apps.evaluation`)
- **`AIEvaluationService` (`services.py`)**:
  - **MCQ Evaluation**: Instant exact-match verification against question answer key.
  - **Coding Evaluation**: Uses Google Gemini 2.5 (`gemini-2.5-flash`) via the official `@google/genai` TypeScript / Python SDK to evaluate time complexity, edge-case coverage, and rubric conformity.
  - **Deterministic Fallback**: In the absence of an API key, executes AST syntax and pattern matching so testing runs offline seamlessly.

---

### Google Drive / Sheets Sync (`apps.google_drive`)
- **`GoogleDriveSyncService` (`services.py`)**:
  - `generate_cohort_csv`: Compiles examination attempts, student register numbers, percentages, and integrity audit trails into a spreadsheet format.
  - `SyncToGoogleDriveView`: Synchronizes institutional results directly to Google Drive and generates Google Sheets links for academic review committees.

---

## 5. Frontend Architecture & Asset Management

### Images & Logos Folder (`frontend/images/`)
Located at `/frontend/images/`, this directory is designated for your brand graphics, university emblems, and UI badges:

- **`talent_iq_logo.svg`**: Pre-installed Apple-style Talent IQ vector emblem.
- **Recommended Asset Formats**:
  - Logos: `.svg` (vector) or `.png` with transparent background (512x512px).
  - Institution Seals: `.png` or `.webp` (256x256px).
- **Importing in React**:
  ```tsx
  // Example usage in any React component
  <img src="/frontend/images/talent_iq_logo.svg" alt="Talent IQ" className="w-8 h-8 rounded-xl" />
  ```

---

## 6. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/colleges/` | List all colleges with scores & district filters |
| `POST` | `/api/colleges/` | Register a new college institution |
| `GET` | `/api/examinations/exams/` | List all active examinations |
| `POST` | `/api/examinations/exams/` | Create a new examination (Faculty only) |
| `GET` | `/api/submissions/attempts/` | List candidate examination attempts |
| `POST` | `/api/submissions/attempts/{id}/finalize_attempt/` | Finalize attempt & compute score |
| `POST` | `/api/proctoring/events/` | Log an AI proctoring incident (tab switch, face lost) |
| `POST` | `/api/evaluation/evaluate-answer/{id}/` | Trigger Gemini AI rubric grading |
| `GET` | `/api/google-drive/export-csv/{exam_id}/` | Download cohort assessment CSV |
| `POST` | `/api/google-drive/sync-drive/{exam_id}/` | Upload cohort results to Google Drive |

---

## 7. Environment Variables Reference

Configure environment variables in `.env` (or via AI Studio secrets):

| Variable | Default | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | `""` | Gemini 2.5 Flash for automated code evaluation & rubric feedback |
| `DJANGO_SECRET_KEY` | Dev Default | Secret cryptographic key for Django session signing |
| `DEBUG` | `True` | Set to `False` in production environments |
| `DB_ENGINE` | `django.db.backends.sqlite3` | Database engine (`django.db.backends.postgresql` in prod) |
| `DB_NAME` | `db.sqlite3` | Database name or path |
| `GOOGLE_DRIVE_CLIENT_ID` | `""` | Google Workspace OAuth client ID for Drive sync |
| `GOOGLE_DRIVE_CLIENT_SECRET` | `""` | Google Workspace OAuth client secret |

---

&copy; 2026 Talent IQ Assessment Platform &bull; Built with Apple Design Philosophy.
