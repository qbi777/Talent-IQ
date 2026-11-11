import React, { useState, useEffect } from 'react';
import { UserRole, Examination, FacultyUser, College, StudentAttempt } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { PublicCollegePortal } from './components/public/PublicCollegePortal';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { ExamCreator } from './components/faculty/ExamCreator';
import { ExamResultsView } from './components/faculty/ExamResultsView';
import { MalpracticeReview } from './components/faculty/MalpracticeReview';
import { GoogleDriveHub } from './components/faculty/GoogleDriveHub';
import { StudentPortal } from './components/student/StudentPortal';
import { ExamPlayer } from './components/student/ExamPlayer';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';

type FacultySubView = 'dashboard' | 'create_exam' | 'results' | 'drive_hub' | 'malpractice';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('public');
  const [facultySubView, setFacultySubView] = useState<FacultySubView>('dashboard');
  
  // Data state
  const [colleges, setColleges] = useState<College[]>(StorageService.getColleges());
  const [facultyList, setFacultyList] = useState<FacultyUser[]>(StorageService.getFaculty());
  const [currentFaculty, setCurrentFaculty] = useState<FacultyUser>(StorageService.getCurrentFaculty());
  const [examinations, setExaminations] = useState<Examination[]>(StorageService.getExaminations());
  const [attempts, setAttempts] = useState<StudentAttempt[]>(StorageService.getAttempts());

  // Active examination context
  const [selectedExamId, setSelectedExamId] = useState<string>('EXM-TN8F29K');

  // Student active session state
  const [activeStudentExam, setActiveStudentExam] = useState<Examination | null>(null);
  const [activeStudentName, setActiveStudentName] = useState<string>('');
  const [activeStudentRollNo, setActiveStudentRollNo] = useState<string>('');

  // 1. Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      setColleges([...StorageService.getColleges()]);
      setFacultyList([...StorageService.getFaculty()]);
      setCurrentFaculty(StorageService.getCurrentFaculty());
      setExaminations([...StorageService.getExaminations()]);
      setAttempts([...StorageService.getAttempts()]);
    });
    return unsubscribe;
  }, []);

  // 2. Check URL search parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlExam = params.get('exam');
      const urlRole = params.get('role') as UserRole | null;

      if (urlRole && ['public', 'faculty', 'student', 'admin'].includes(urlRole)) {
        setCurrentRole(urlRole);
      }
      if (urlExam) {
        setSelectedExamId(urlExam);
      }
    } catch {
      // In case of non-standard environment
    }
  }, []);

  // Handlers
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role !== 'student') {
      setActiveStudentExam(null);
    }
    if (role === 'faculty') {
      setFacultySubView('dashboard');
    }
  };

  const handleOpenResults = (examId: string) => {
    setSelectedExamId(examId);
    setFacultySubView('results');
  };

  const handleOpenDriveHub = (examId?: string) => {
    if (examId) setSelectedExamId(examId);
    setFacultySubView('drive_hub');
  };

  const handleOpenMalpractice = (examId?: string) => {
    if (examId) setSelectedExamId(examId);
    setFacultySubView('malpractice');
  };

  const handleLaunchStudentTest = (examId: string) => {
    setSelectedExamId(examId);
    setCurrentRole('student');
    setActiveStudentExam(null);
  };

  const handleStartExamAsStudent = (exam: Examination, name: string, rollNo: string) => {
    setActiveStudentExam(exam);
    setActiveStudentName(name);
    setActiveStudentRollNo(rollNo);
  };

  const handleFinishExamAsStudent = () => {
    setActiveStudentExam(null);
    setCurrentRole('faculty');
    setFacultySubView('results');
  };

  const handleSwitchFacultyLogin = (facultyId: string) => {
    StorageService.setCurrentFacultyId(facultyId);
    setCurrentFaculty(StorageService.getCurrentFaculty());
    setCurrentRole('faculty');
    setFacultySubView('dashboard');
  };

  const activeExam = examinations.find(e => e.id === selectedExamId) || examinations[0];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans selection:bg-[#0071e3] selection:text-white antialiased">
      {/* Hide global navbar when student is inside the active exam player for zero distraction */}
      {!activeStudentExam && (
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeExamId={selectedExamId}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: PUBLIC DISCOVERY PORTAL & TAMIL NADU MAP */}
        {currentRole === 'public' && (
          <PublicCollegePortal
            colleges={colleges}
            onOpenFacultyDemo={(collegeId) => {
              const fac = facultyList.find(f => f.collegeId === collegeId);
              if (fac) StorageService.setCurrentFacultyId(fac.id);
              setCurrentRole('faculty');
              setFacultySubView('dashboard');
            }}
            onOpenStudentExam={() => {
              setCurrentRole('student');
            }}
          />
        )}

        {/* VIEW 2: FACULTY DASHBOARD & EXAM STUDIO */}
        {currentRole === 'faculty' && (
          <div>
            {facultySubView === 'dashboard' && (
              <FacultyDashboard
                faculty={currentFaculty}
                examinations={examinations}
                attempts={attempts}
                onCreateExam={() => setFacultySubView('create_exam')}
                onViewResults={handleOpenResults}
                onOpenGoogleDriveHub={handleOpenDriveHub}
                onOpenMalpracticeReview={handleOpenMalpractice}
                onLaunchStudentTest={handleLaunchStudentTest}
              />
            )}

            {facultySubView === 'create_exam' && (
              <ExamCreator
                faculty={currentFaculty}
                onCancel={() => setFacultySubView('dashboard')}
                onExamCreated={(newExam) => {
                  setSelectedExamId(newExam.id);
                  setFacultySubView('dashboard');
                }}
              />
            )}

            {facultySubView === 'results' && activeExam && (
              <ExamResultsView
                examination={activeExam}
                attempts={attempts.filter(a => a.examId === activeExam.id)}
                onBack={() => setFacultySubView('dashboard')}
                onOpenGoogleDriveHub={() => setFacultySubView('drive_hub')}
              />
            )}

            {facultySubView === 'malpractice' && (
              <MalpracticeReview
                attempts={attempts}
                onBack={() => setFacultySubView('dashboard')}
                onOpenGoogleDriveHub={() => setFacultySubView('drive_hub')}
              />
            )}

            {facultySubView === 'drive_hub' && (
              <GoogleDriveHub
                faculty={currentFaculty}
                examinations={examinations}
                attempts={attempts}
                selectedExamId={selectedExamId}
                onBack={() => setFacultySubView('dashboard')}
              />
            )}
          </div>
        )}

        {/* VIEW 3: STUDENT PORTAL & LIVE TEST PLAYER */}
        {currentRole === 'student' && (
          <div>
            {!activeStudentExam ? (
              <StudentPortal
                examinations={examinations.filter(e => e.status === 'Active')}
                initialExamId={selectedExamId}
                onStartExam={handleStartExamAsStudent}
              />
            ) : (
              <ExamPlayer
                examination={activeStudentExam}
                studentName={activeStudentName}
                studentRollNo={activeStudentRollNo}
                onFinishExam={handleFinishExamAsStudent}
              />
            )}
          </div>
        )}

        {/* VIEW 4: SUPER ADMIN PLATFORM CONSOLE */}
        {currentRole === 'admin' && (
          <SuperAdminPanel
            colleges={colleges}
            faculty={facultyList}
            onSelectFacultyLogin={handleSwitchFacultyLogin}
          />
        )}
      </main>

      {/* Global Apple Footer */}
      {!activeStudentExam && (
        <footer className="bg-[#f5f5f7] border-t border-black/[0.06] text-[#86868b] py-8 px-4 sm:px-8 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1d1d1f]">Talent IQ</span>
              <span>—</span>
              <span>Higher Education Examination & Assessment Intelligence</span>
            </div>
            <div className="flex items-center gap-4 text-[#86868b] font-medium">
              <span>PostgreSQL Schema v1.4</span>
              <span>•</span>
              <span>Faculty Google Drive Encrypted</span>
              <span>•</span>
              <span>AI Rubric Evaluator Active</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
