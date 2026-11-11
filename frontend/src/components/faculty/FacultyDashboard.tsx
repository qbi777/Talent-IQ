import React, { useState } from 'react';
import { Examination, FacultyUser, StudentAttempt } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  Users, 
  Award, 
  ShieldAlert, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Cloud, 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface FacultyDashboardProps {
  faculty: FacultyUser;
  examinations: Examination[];
  attempts: StudentAttempt[];
  onCreateExam: () => void;
  onViewResults: (examId: string) => void;
  onOpenGoogleDriveHub: (examId?: string) => void;
  onOpenMalpracticeReview: (examId?: string) => void;
  onLaunchStudentTest: (examId: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  faculty,
  examinations,
  attempts,
  onCreateExam,
  onViewResults,
  onOpenGoogleDriveHub,
  onOpenMalpracticeReview,
  onLaunchStudentTest
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [copiedExamId, setCopiedExamId] = useState<string | null>(null);

  const facultyExams = examinations.filter(e => e.facultyId === faculty.id);

  const filteredExams = facultyExams.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || e.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['All', ...Array.from(new Set(facultyExams.map(e => e.subject)))];

  const totalAssessed = facultyExams.reduce((sum, e) => sum + e.totalAttempts, 0);
  const pendingReviews = attempts.filter(a => a.status === 'Review Required').length;
  const malpracticeFlags = attempts.filter(a => a.malpracticeFlag).length;

  const handleCopyLink = (examId: string) => {
    const link = `${window.location.origin}?exam=${examId}&role=student`;
    navigator.clipboard.writeText(link);
    setCopiedExamId(examId);
    setTimeout(() => setCopiedExamId(null), 2500);
  };

  const handleToggleDrive = () => {
    StorageService.toggleFacultyGoogleDrive(faculty.id);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Faculty Welcome Card (Apple Studio styling) */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-3 py-0.5 rounded-full font-mono font-semibold">
              ID: {faculty.id}
            </span>
            <span className="text-xs bg-black/[0.04] text-[#515154] px-3 py-0.5 rounded-full font-medium">
              {faculty.collegeName}
            </span>
            <span className="text-xs bg-[#34c759]/10 text-[#28a745] px-3 py-0.5 rounded-full font-semibold">
              {faculty.department}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            Welcome back, {faculty.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b]">
            {faculty.designation} · Talent IQ Assessment & Rubric Studio
          </p>
        </div>

        {/* Google Drive Status Pill */}
        <div className="bg-[#f5f5f7] rounded-2xl p-4 flex items-center justify-between gap-4 w-full md:w-auto border border-black/[0.04]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              faculty.googleDriveConnected ? 'bg-[#34c759]/15 text-[#28a745]' : 'bg-[#ff9500]/15 text-[#d97706]'
            }`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                <span>Google Drive</span>
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                  faculty.googleDriveConnected ? 'bg-[#34c759]/15 text-[#28a745]' : 'bg-[#ff9500]/15 text-[#d97706]'
                }`}>
                  {faculty.googleDriveConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              <div className="text-[11px] text-[#86868b] truncate max-w-[190px]">
                {faculty.googleDriveConnected ? faculty.googleDriveEmail : 'Link to auto-sync Docs & Sheets'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenGoogleDriveHub()}
              className="text-xs text-[#0071e3] hover:text-[#0077ED] font-semibold px-3 py-1.5 rounded-full bg-white shadow-sm border border-black/[0.05] transition-all"
            >
              Open Hub
            </button>
            <button
              onClick={handleToggleDrive}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                faculty.googleDriveConnected 
                  ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                  : 'apple-btn-primary'
              }`}
            >
              {faculty.googleDriveConnected ? 'Unlink' : 'Link'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (Apple Health / Dashboard look) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="apple-card p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-xs font-semibold uppercase tracking-wider">Examinations</span>
            <FileText className="w-4 h-4 text-[#0071e3]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1d1d1f] font-mono tracking-tight">{facultyExams.length}</span>
            <span className="text-xs text-[#0071e3] font-semibold">active</span>
          </div>
          <p className="mt-1 text-[11px] text-[#86868b]">Semester assessment papers</p>
        </div>

        <div className="apple-card p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-xs font-semibold uppercase tracking-wider">Assessed Students</span>
            <Users className="w-4 h-4 text-[#5856d6]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1d1d1f] font-mono tracking-tight">{totalAssessed}</span>
            <span className="text-xs text-[#5856d6] font-semibold">candidates</span>
          </div>
          <p className="mt-1 text-[11px] text-[#86868b]">Verified roll number attempts</p>
        </div>

        <div 
          onClick={() => onOpenMalpracticeReview()}
          className="apple-card p-6 shadow-sm cursor-pointer hover:border-[#ff9500]/40 transition-all group"
        >
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-xs font-semibold uppercase tracking-wider">Malpractice Flags</span>
            <ShieldAlert className="w-4 h-4 text-[#ff9500] group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono tracking-tight ${malpracticeFlags > 0 ? 'text-[#ff9500]' : 'text-[#1d1d1f]'}`}>
              {malpracticeFlags}
            </span>
            <span className="text-xs text-[#ff9500] font-semibold">events</span>
          </div>
          <p className="mt-1 text-[11px] text-[#86868b] flex items-center gap-1">
            <span>Tab switches recorded</span>
            <ChevronRight className="w-3 h-3 text-[#ff9500]" />
          </p>
        </div>

        <div className="apple-card p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Reviews Pending</span>
            <Sparkles className="w-4 h-4 text-[#34c759]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono tracking-tight ${pendingReviews > 0 ? 'text-[#34c759]' : 'text-[#1d1d1f]'}`}>
              {pendingReviews}
            </span>
            <span className="text-xs text-[#34c759] font-semibold">provisional</span>
          </div>
          <p className="mt-1 text-[11px] text-[#86868b]">Awaiting faculty sign-off</p>
        </div>
      </div>

      {/* Main Examination List Section */}
      <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
          <div>
            <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
              Examination Management
            </h2>
            <p className="text-xs text-[#86868b]">
              Create assessments, export Google Docs/Sheets, monitor tab-switching, and review AI scoring
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateExam}
              className="apple-btn-primary px-5 py-2.5 text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Examination</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by test name, code, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#86868b]">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-[#f5f5f7] border border-black/[0.06] rounded-full px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none font-medium"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Examinations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Examination Title & ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Duration & Marks</th>
                <th className="py-3 px-4 text-center">Attempts</th>
                <th className="py-3 px-4 text-center">Avg Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div 
                      className="font-bold text-[#1d1d1f] text-sm hover:text-[#0071e3] cursor-pointer transition-colors" 
                      onClick={() => onViewResults(exam.id)}
                    >
                      {exam.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-black/[0.05] text-[#86868b] px-2 py-0.5 rounded-md font-mono">
                        {exam.id}
                      </span>
                      <span className="text-[11px] text-[#86868b] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exam.scheduledDate}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#515154] font-medium">
                    {exam.subject}
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <div className="flex items-center gap-1 text-[#1d1d1f]">
                      <Clock className="w-3 h-3 text-[#86868b]" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div className="text-[10px] text-[#86868b] mt-0.5">
                      {exam.totalMarks} marks · {exam.questions.length} questions
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-mono">
                    <span className="font-bold text-[#1d1d1f] text-sm">{exam.totalAttempts}</span>
                    <span className="text-[10px] text-[#86868b] block">students</span>
                  </td>

                  <td className="py-4 px-4 text-center font-mono">
                    {exam.averageScore ? (
                      <span className="font-bold text-[#0071e3] text-sm">
                        {exam.averageScore} / {exam.totalMarks}
                      </span>
                    ) : (
                      <span className="text-[#86868b]">-</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      exam.status === 'Active' ? 'bg-[#34c759]/15 text-[#28a745]' :
                      exam.status === 'Completed' ? 'bg-[#0071e3]/15 text-[#0071e3]' :
                      'bg-black/[0.05] text-[#86868b]'
                    }`}>
                      {exam.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCopyLink(exam.id)}
                        title="Copy student link"
                        className="p-2 rounded-full bg-[#f5f5f7] hover:bg-black/[0.06] text-[#515154] hover:text-[#1d1d1f] transition-colors"
                      >
                        {copiedExamId === exam.id ? (
                          <Check className="w-3.5 h-3.5 text-[#34c759]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onLaunchStudentTest(exam.id)}
                        title="Launch student test experience"
                        className="apple-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                      >
                        <span>Test Drive</span>
                        <ExternalLink className="w-3 h-3 text-[#86868b]" />
                      </button>

                      <button
                        onClick={() => onViewResults(exam.id)}
                        className="apple-btn-secondary px-3 py-1.5 text-xs font-semibold text-[#0071e3]"
                      >
                        Results & Ranks
                      </button>

                      <button
                        onClick={() => onOpenGoogleDriveHub(exam.id)}
                        title="Open Google Sheet report & Google Doc"
                        className="p-2 rounded-full bg-[#f5f5f7] hover:bg-black/[0.06] text-[#34c759] transition-colors"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-10 text-[#86868b]">
            <p className="text-sm">No examinations found matching your filter.</p>
            <button
              onClick={onCreateExam}
              className="mt-3 text-xs text-[#0071e3] font-semibold hover:underline"
            >
              + Create your first examination
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section: Top Performers & Drive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Performers Podium */}
        <div className="lg:col-span-2 apple-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#ff9500]" />
                <span>Top Academic Performers (CS301 Midterm)</span>
              </h3>
              <p className="text-xs text-[#86868b]">Talent IQ standardized score distribution</p>
            </div>
            <button
              onClick={() => onViewResults('EXM-TN8F29K')}
              className="text-xs text-[#0071e3] font-semibold hover:underline"
            >
              Full Marksheet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {attempts.slice(0, 3).map((student, i) => (
              <div 
                key={student.id}
                className="bg-[#f5f5f7] rounded-2xl p-4 text-center relative overflow-hidden border border-black/[0.03]"
              >
                <div className={`absolute top-2 right-2 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  i === 0 ? 'bg-[#ff9500]/15 text-[#d97706]' :
                  i === 1 ? 'bg-black/[0.06] text-[#515154]' :
                  'bg-[#ff9500]/10 text-[#b45309]'
                }`}>
                  Rank #{student.rank || i + 1}
                </div>

                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-[#0071e3] to-[#5856d6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {student.studentName.split(' ')[0][0]}{student.studentName.split(' ')[1]?.[0] || ''}
                </div>

                <h4 className="font-bold text-[#1d1d1f] text-xs mt-2.5 truncate">{student.studentName}</h4>
                <p className="text-[10px] text-[#86868b] font-mono mt-0.5">{student.studentRollNo}</p>

                <div className="mt-3 pt-2 border-t border-black/[0.05] flex items-center justify-center gap-1 font-mono">
                  <span className="text-lg font-black text-[#0071e3]">{student.totalMarksAwarded}</span>
                  <span className="text-xs text-[#86868b]">/ {student.totalMarksPossible}</span>
                  <span className="text-xs font-bold text-[#28a745] ml-1">({student.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Drive Card */}
        <div className="apple-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[#28a745]">
              <Cloud className="w-5 h-5 text-[#34c759]" />
              <h3 className="text-base font-bold text-[#1d1d1f]">Faculty Google Drive</h3>
            </div>
            <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed font-normal">
              Every assessment automatically exports to your personal Google Drive folder with official Google Docs papers and formatted 4-sheet workbooks.
            </p>
          </div>

          <div className="space-y-2 text-xs bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04]">
            <div className="flex items-center justify-between text-[#515154]">
              <span>Google Docs Paper</span>
              <span className="text-[#28a745] font-semibold">Ready</span>
            </div>
            <div className="flex items-center justify-between text-[#515154]">
              <span>4-Sheet Rank List Workbook</span>
              <span className="text-[#28a745] font-semibold">Synced</span>
            </div>
            <div className="flex items-center justify-between text-[#515154]">
              <span>Malpractice Evidence Vault</span>
              <span className="text-[#0071e3] font-semibold">Encrypted</span>
            </div>
          </div>

          <button
            onClick={() => onOpenGoogleDriveHub()}
            className="apple-btn-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#34c759]" />
            <span>Open Google Drive Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
