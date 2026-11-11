export type DistrictName = 
  | 'Chennai'
  | 'Coimbatore'
  | 'Madurai'
  | 'Tiruchirappalli'
  | 'Salem'
  | 'Tirunelveli'
  | 'Thoothukudi'
  | 'Kanyakumari'
  | 'Vellore'
  | 'Thanjavur'
  | 'Erode'
  | 'Dindigul'
  | 'Kanchipuram'
  | 'Chengalpattu';

export interface College {
  id: string; // e.g. COL001
  name: string;
  code: string; // e.g. 1315
  district: DistrictName;
  city: string;
  established: number;
  type: 'Autonomous' | 'Government' | 'Deemed University' | 'Self-Financing';
  naacGrade: 'A++' | 'A+' | 'A' | 'B++';
  nirfRank?: number;
  website: string;
  logoUrl?: string;
  participatingInPublicRankings: boolean;
  totalStudentsAssessed: number;
  averageScore: number;
  assessmentsConducted: number;
  departments: string[];
}

export interface FacultyUser {
  id: string; // e.g. FAC001
  collegeId: string;
  collegeName: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  googleDriveConnected: boolean;
  googleDriveEmail?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export type QuestionType = 
  | 'multiple_choice' 
  | 'short_answer' 
  | 'descriptive' 
  | 'image_based' 
  | 'situational';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  marks: number;
  negativeMarks?: number;
  // For MCQ
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  // For Image-based
  imageUrl?: string;
  imageCaption?: string;
  // For Short/Descriptive/Situational
  expectedKeywords?: string[];
  modelAnswer?: string;
  rubricCriteria?: {
    relevance: number;
    technicalAccuracy: number;
    reasoning: number;
    depth: number;
  };
  scenario?: string; // For situational
}

export interface Examination {
  id: string; // e.g. EXM-TN8F29K
  collegeId: string;
  facultyId: string;
  facultyName: string;
  collegeName: string;
  title: string;
  subject: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  instructions: string[];
  maxAttempts: number;
  resultsVisibleToStudents: boolean;
  monitoringSettings: {
    tabSwitchDetection: boolean;
    fullscreenRequired: boolean;
    cameraPresenceAlerts: boolean;
    maxTabSwitchesAllowed: number;
  };
  questions: Question[];
  status: 'Draft' | 'Active' | 'Completed' | 'Archived';
  scheduledDate: string;
  totalAttempts: number;
  evaluatedAttempts: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  googleDocsPaperId?: string;
  googleSheetsResultsId?: string;
  createdAt: string;
}

export type ProctoringEventType = 
  | 'tab_switched'
  | 'fullscreen_exited'
  | 'window_blurred'
  | 'camera_unfocused'
  | 'multiple_faces_detected';

export interface ProctoringEvent {
  id: string;
  attemptId: string;
  studentRollNo: string;
  studentName: string;
  eventType: ProctoringEventType;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  reviewStatus: 'Pending' | 'Cleared' | 'Flagged' | 'Action Taken';
  facultyNotes?: string;
  snapshotUrl?: string;
}

export interface StudentAnswer {
  questionId: string;
  type: QuestionType;
  selectedOption?: string | string[];
  textAnswer?: string;
  isCorrect?: boolean;
  awardedMarks: number;
  maxMarks: number;
  aiEvaluation?: {
    relevanceScore: number;
    technicalAccuracyScore: number;
    reasoningScore: number;
    depthScore: number;
    totalScore: number;
    reasoningText: string;
    strengths: string[];
    improvements: string[];
    reviewRequired: boolean;
    evaluatedAt: string;
  };
  facultyOverrideMarks?: number;
  facultyFeedback?: string;
}

export interface StudentAttempt {
  id: string; // attempt token
  examId: string;
  collegeId: string;
  studentName: string;
  studentRollNo: string;
  studentEmail?: string;
  department?: string;
  startedAt: string;
  submittedAt?: string;
  timeSpentSeconds: number;
  status: 'In Progress' | 'Submitted' | 'Evaluated' | 'Review Required';
  totalMarksAwarded: number;
  totalMarksPossible: number;
  percentage: number;
  rank?: number;
  passed: boolean;
  tabSwitchCount: number;
  answers: Record<string, StudentAnswer>;
  proctoringEvents: ProctoringEvent[];
  malpracticeFlag: boolean;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  type: 'folder' | 'doc' | 'sheet';
  updatedAt: string;
  url?: string;
  children?: GoogleDriveFolder[];
}

export type UserRole = 'public' | 'faculty' | 'student' | 'admin';
