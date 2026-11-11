import { College, FacultyUser, Examination, StudentAttempt, ProctoringEvent, UserRole } from '../types';
import { INITIAL_COLLEGES, INITIAL_FACULTY, INITIAL_EXAMINATIONS, INITIAL_STUDENT_ATTEMPTS } from '../data/mockData';

const STORAGE_KEYS = {
  COLLEGES: 'evalpulse_colleges_v1',
  FACULTY: 'evalpulse_faculty_v1',
  EXAMS: 'evalpulse_exams_v1',
  ATTEMPTS: 'evalpulse_attempts_v1',
  CURRENT_ROLE: 'evalpulse_current_role_v1',
  CURRENT_FACULTY_ID: 'evalpulse_current_faculty_id_v1',
  CURRENT_COLLEGE_ID: 'evalpulse_current_college_id_v1'
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(l => {
    try { l(); } catch (err) { console.error('Storage listener error:', err); }
  });
}

export const StorageService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getColleges(): College[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLEGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COLLEGES, JSON.stringify(INITIAL_COLLEGES));
      return INITIAL_COLLEGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COLLEGES;
    }
  },

  saveColleges(colleges: College[]) {
    localStorage.setItem(STORAGE_KEYS.COLLEGES, JSON.stringify(colleges));
    notify();
  },

  addCollege(data: Omit<College, 'id' | 'totalStudentsAssessed' | 'averageScore' | 'assessmentsConducted'>): College {
    const colleges = this.getColleges();
    const nextNum = colleges.length + 1;
    const newId = `COL${String(nextNum).padStart(3, '0')}`;
    const newCollege: College = {
      ...data,
      id: newId,
      totalStudentsAssessed: 0,
      averageScore: 0,
      assessmentsConducted: 0
    };
    colleges.unshift(newCollege);
    this.saveColleges(colleges);
    return newCollege;
  },

  getFaculty(): FacultyUser[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FACULTY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY));
      return INITIAL_FACULTY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FACULTY;
    }
  },

  saveFaculty(faculty: FacultyUser[]) {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    notify();
  },

  addFaculty(data: Omit<FacultyUser, 'id' | 'createdAt'>): FacultyUser {
    const list = this.getFaculty();
    const nextNum = list.length + 1;
    const newId = `FAC${String(nextNum).padStart(3, '0')}`;
    const newFaculty: FacultyUser = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newFaculty);
    this.saveFaculty(list);
    return newFaculty;
  },

  getExaminations(): Examination[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMINATIONS));
      return INITIAL_EXAMINATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EXAMINATIONS;
    }
  },

  saveExaminations(exams: Examination[]) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    notify();
  },

  addExamination(exam: Omit<Examination, 'id' | 'totalAttempts' | 'evaluatedAttempts' | 'createdAt'>): Examination {
    const exams = this.getExaminations();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newExam: Examination = {
      ...exam,
      id: `EXM-TN${randomSuffix}`,
      totalAttempts: 0,
      evaluatedAttempts: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    exams.unshift(newExam);
    this.saveExaminations(exams);
    return newExam;
  },

  updateExamination(id: string, updates: Partial<Examination>) {
    const exams = this.getExaminations();
    const idx = exams.findIndex(e => e.id === id);
    if (idx !== -1) {
      exams[idx] = { ...exams[idx], ...updates };
      this.saveExaminations(exams);
    }
  },

  getAttempts(examId?: string): StudentAttempt[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    let attempts: StudentAttempt[] = [];
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_STUDENT_ATTEMPTS));
      attempts = INITIAL_STUDENT_ATTEMPTS;
    } else {
      try {
        attempts = JSON.parse(raw);
      } catch {
        attempts = INITIAL_STUDENT_ATTEMPTS;
      }
    }
    if (examId) {
      return attempts.filter(a => a.examId === examId);
    }
    return attempts;
  },

  saveAttempts(attempts: StudentAttempt[]) {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    notify();
  },

  submitAttempt(attempt: StudentAttempt): StudentAttempt {
    const attempts = this.getAttempts();
    
    // Check if attempt exists, replace or append
    const existingIndex = attempts.findIndex(a => a.id === attempt.id);
    if (existingIndex >= 0) {
      attempts[existingIndex] = attempt;
    } else {
      attempts.unshift(attempt);
    }
    
    // Recalculate ranks for this exam
    const examAttempts = attempts.filter(a => a.examId === attempt.examId && a.status !== 'In Progress');
    examAttempts.sort((a, b) => b.totalMarksAwarded - a.totalMarksAwarded);
    
    let currentRank = 1;
    for (let i = 0; i < examAttempts.length; i++) {
      if (i > 0 && examAttempts[i].totalMarksAwarded < examAttempts[i - 1].totalMarksAwarded) {
        currentRank = i + 1;
      }
      examAttempts[i].rank = currentRank;
    }

    this.saveAttempts(attempts);

    // Update examination summary statistics
    const exam = this.getExaminations().find(e => e.id === attempt.examId);
    if (exam) {
      const allDone = attempts.filter(a => a.examId === exam.id && a.status !== 'In Progress');
      const totalMarksSum = allDone.reduce((acc, curr) => acc + curr.totalMarksAwarded, 0);
      const avg = allDone.length ? Math.round((totalMarksSum / allDone.length) * 10) / 10 : 0;
      const highest = allDone.length ? Math.max(...allDone.map(a => a.totalMarksAwarded)) : 0;
      const lowest = allDone.length ? Math.min(...allDone.map(a => a.totalMarksAwarded)) : 0;

      this.updateExamination(exam.id, {
        totalAttempts: allDone.length,
        evaluatedAttempts: allDone.filter(a => a.status === 'Evaluated').length,
        averageScore: avg,
        highestScore: highest,
        lowestScore: lowest
      });
    }

    return attempt;
  },

  recordProctoringEvent(attemptId: string, event: Omit<ProctoringEvent, 'id' | 'timestamp'>) {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return;

    const fullEvent: ProctoringEvent = {
      ...event,
      id: `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    attempt.proctoringEvents = attempt.proctoringEvents || [];
    attempt.proctoringEvents.push(fullEvent);

    if (event.eventType === 'tab_switched') {
      attempt.tabSwitchCount = (attempt.tabSwitchCount || 0) + 1;
    }

    // Flag malpractice if multiple severe events
    if (attempt.tabSwitchCount >= 2 || attempt.proctoringEvents.length >= 3) {
      attempt.malpracticeFlag = true;
      if (attempt.status === 'Evaluated') {
        attempt.status = 'Review Required';
      }
    }

    this.saveAttempts(attempts);
  },

  updateProctoringEventStatus(
    attemptId: string, 
    eventId: string, 
    reviewStatus: ProctoringEvent['reviewStatus'], 
    facultyNotes?: string
  ) {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return;

    const evt = attempt.proctoringEvents?.find(e => e.id === eventId);
    if (evt) {
      evt.reviewStatus = reviewStatus;
      if (facultyNotes !== undefined) evt.facultyNotes = facultyNotes;
      
      // If all events are cleared, unflag malpractice
      const hasPending = attempt.proctoringEvents?.some(e => e.reviewStatus === 'Pending' || e.reviewStatus === 'Flagged');
      if (!hasPending) {
        attempt.malpracticeFlag = false;
        if (attempt.status === 'Review Required') {
          attempt.status = 'Evaluated';
        }
      }

      this.saveAttempts(attempts);
    }
  },

  overrideStudentMarks(attemptId: string, questionId: string, overrideMarks: number, feedback?: string) {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt || !attempt.answers[questionId]) return;

    attempt.answers[questionId].facultyOverrideMarks = overrideMarks;
    attempt.answers[questionId].awardedMarks = overrideMarks;
    if (feedback) attempt.answers[questionId].facultyFeedback = feedback;

    // Recalculate total marks
    let total = 0;
    Object.values(attempt.answers).forEach(ans => {
      total += ans.awardedMarks || 0;
    });
    attempt.totalMarksAwarded = total;
    attempt.percentage = Math.round((total / attempt.totalMarksPossible) * 100);

    const exam = this.getExaminations().find(e => e.id === attempt.examId);
    if (exam) {
      attempt.passed = attempt.percentage >= exam.passPercentage;
    }

    this.saveAttempts(attempts);
  },

  // Role & active profile management
  getCurrentRole(): UserRole {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as UserRole) || 'faculty';
  },

  setCurrentRole(role: UserRole) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    notify();
  },

  getCurrentFaculty(): FacultyUser {
    const list = this.getFaculty();
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_FACULTY_ID);
    const found = list.find(f => f.id === savedId);
    return found || list[0];
  },

  setCurrentFacultyId(id: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_FACULTY_ID, id);
    notify();
  },

  toggleFacultyGoogleDrive(facultyId: string) {
    const list = this.getFaculty();
    const faculty = list.find(f => f.id === facultyId);
    if (faculty) {
      faculty.googleDriveConnected = !faculty.googleDriveConnected;
      if (faculty.googleDriveConnected && !faculty.googleDriveEmail) {
        faculty.googleDriveEmail = `${faculty.name.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`;
      }
      this.saveFaculty(list);
    }
  },

  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.COLLEGES, JSON.stringify(INITIAL_COLLEGES));
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMINATIONS));
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_STUDENT_ATTEMPTS));
    notify();
  }
};
