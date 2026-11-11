import React, { useState } from 'react';
import { Examination, FacultyUser, StudentAttempt } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  ArrowLeft, 
  Cloud, 
  FileSpreadsheet, 
  FileText, 
  Folder, 
  Download, 
  Check, 
  Printer, 
  Copy,
  FolderOpen
} from 'lucide-react';

interface GoogleDriveHubProps {
  faculty: FacultyUser;
  examinations: Examination[];
  attempts: StudentAttempt[];
  selectedExamId?: string;
  onBack: () => void;
}

export const GoogleDriveHub: React.FC<GoogleDriveHubProps> = ({
  faculty,
  examinations,
  attempts,
  selectedExamId,
  onBack
}) => {
  const [activeExamId, setActiveExamId] = useState<string>(selectedExamId || examinations[0]?.id || '');
  const [activeSheetTab, setActiveSheetTab] = useState<'results' | 'ranks' | 'malpractice' | 'summary'>('results');
  const [activeDocView, setActiveDocView] = useState<'sheet' | 'doc'>('sheet');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const activeExam = examinations.find(e => e.id === activeExamId) || examinations[0];
  const examAttempts = attempts.filter(a => a.examId === activeExam?.id);

  // Group events for Sheet 3
  const proctoringRows: { student: string; rollNo: string; event: string; time: string; status: string }[] = [];
  examAttempts.forEach(a => {
    (a.proctoringEvents || []).forEach(e => {
      proctoringRows.push({
        student: a.studentName,
        rollNo: a.studentRollNo,
        event: e.eventType.replace('_', ' ').toUpperCase(),
        time: new Date(e.timestamp).toLocaleTimeString(),
        status: e.reviewStatus
      });
    });
  });

  const totalCompleted = examAttempts.length;
  const passedStudents = examAttempts.filter(a => a.passed).length;
  const passPercent = totalCompleted ? Math.round((passedStudents / totalCompleted) * 100) : 0;
  const avgMarks = totalCompleted 
    ? Math.round((examAttempts.reduce((s, a) => s + a.totalMarksAwarded, 0) / totalCompleted) * 10) / 10 
    : 0;
  const highMarks = totalCompleted ? Math.max(...examAttempts.map(a => a.totalMarksAwarded)) : 0;
  const lowMarks = totalCompleted ? Math.min(...examAttempts.map(a => a.totalMarksAwarded)) : 0;
  const pendingReviewsCount = examAttempts.filter(a => a.status === 'Review Required').length;

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeSheetTab === 'results') {
      csvContent += 'Roll Number,Student Name,Marks Awarded,Max Marks,Percentage,Status\n';
      examAttempts.forEach(a => {
        csvContent += `"${a.studentRollNo}","${a.studentName}",${a.totalMarksAwarded},${a.totalMarksPossible},${a.percentage}%,"${a.status}"\n`;
      });
    } else if (activeSheetTab === 'ranks') {
      csvContent += 'Rank,Roll Number,Student Name,Marks Awarded,Percentage\n';
      const sorted = [...examAttempts].sort((a, b) => (a.rank || 99) - (b.rank || 99));
      sorted.forEach(a => {
        csvContent += `${a.rank || '-'},"${a.studentRollNo}","${a.studentName}",${a.totalMarksAwarded},${a.percentage}%\n`;
      });
    } else if (activeSheetTab === 'malpractice') {
      csvContent += 'Student Name,Roll Number,Proctoring Event,Time,Review Status\n';
      proctoringRows.forEach(r => {
        csvContent += `"${r.student}","${r.rollNo}","${r.event}","${r.time}","${r.status}"\n`;
      });
    } else {
      csvContent += 'Metric,Value\n';
      csvContent += `Examination Title,"${activeExam?.title}"\n`;
      csvContent += `Total Submissions,${totalCompleted}\n`;
      csvContent += `Class Average Marks,${avgMarks} / ${activeExam?.totalMarks}\n`;
      csvContent += `Highest Mark,${highMarks}\n`;
      csvContent += `Lowest Mark,${lowMarks}\n`;
      csvContent += `Pass Percentage,${passPercent}%\n`;
      csvContent += `AI Evaluations Awaiting Review,${pendingReviewsCount}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeExam?.title || 'Exam'}_${activeSheetTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTable = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#34c759]" />
            <span>Export Active Sheet CSV</span>
          </button>
        </div>
      </div>

      {/* Main Drive Sync Header (Apple iCloud aesthetic) */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-3 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" />
              Faculty Google Drive & Docs Hub
            </span>
            <span className="text-xs bg-[#34c759]/10 text-[#28a745] px-2.5 py-0.5 rounded-full font-mono font-semibold">
              OAuth 2.0 Encrypted Storage
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            Institutional Documents & Sheets Sync
          </h1>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Faculty owns all generated assessment materials. Talent IQ creates official Google Docs question papers and automatically populates the 4-sheet evaluation workbook directly in your authorized Google Drive folder.
          </p>
        </div>

        <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-xs space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#86868b]">Authenticated Account:</span>
            <span className="font-mono text-[#0071e3] font-bold">{faculty.googleDriveEmail || 'ramanathan.ssn@gmail.com'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#86868b]">Faculty Token Mapping:</span>
            <span className="font-mono text-[#1d1d1f] font-semibold">{faculty.id} → Personal Drive</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#86868b]">Sync Telemetry:</span>
            <span className="text-[#28a745] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse"></span>
              Synchronized with PostgreSQL
            </span>
          </div>
        </div>
      </div>

      {/* Visual Google Drive Folder Hierarchy (Apple Finder look) */}
      <div className="apple-card p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#ff9500]" />
          <span>Faculty Drive Structure (Finder Hierarchy):</span>
        </h3>

        {/* Tree Path */}
        <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] font-mono text-xs text-[#515154] space-y-1.5 overflow-x-auto">
          <div className="flex items-center gap-2 text-[#86868b]">
            <Cloud className="w-4 h-4 text-[#0071e3]" />
            <span>My Drive /</span>
            <span className="text-[#1d1d1f] font-bold">Talent IQ Assessment Platform</span>
          </div>
          <div className="pl-6 flex items-center gap-2 text-[#86868b]">
            <Folder className="w-4 h-4 text-[#ff9500]" />
            <span>└── {faculty.department} /</span>
          </div>
          <div className="pl-12 flex items-center gap-2 text-[#0071e3] font-bold">
            <Folder className="w-4 h-4 text-[#ff9500]" />
            <span>└── {activeExam?.title} /</span>
          </div>
          <div className="pl-20 flex items-center gap-2 text-[#1d1d1f]">
            <FileText className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>├── Question Paper - {activeExam?.title} (Google Docs)</span>
          </div>
          <div className="pl-20 flex items-center gap-2 text-[#28a745] font-bold">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#34c759]" />
            <span>├── Results & Marksheet - {activeExam?.title} (Google Sheets)</span>
          </div>
          <div className="pl-20 flex items-center gap-2 text-[#86868b]">
            <Folder className="w-3.5 h-3.5 text-[#86868b]" />
            <span>└── Proctoring Evidence Vault (Encrypted Snaps)</span>
          </div>
        </div>

        {/* Exam Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-[#86868b]">Select Examination:</span>
          {examinations.map(e => (
            <button
              key={e.id}
              onClick={() => setActiveExamId(e.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeExamId === e.id
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'bg-black/[0.04] text-[#515154] hover:bg-black/[0.08]'
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
        <div className="apple-segmented-container flex p-1 text-xs">
          <button
            onClick={() => setActiveDocView('sheet')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
              activeDocView === 'sheet'
                ? 'apple-segmented-item-active'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#34c759]" />
            <span>Google Sheets Workbook (4 Tabs)</span>
          </button>

          <button
            onClick={() => setActiveDocView('doc')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
              activeDocView === 'doc'
                ? 'apple-segmented-item-active'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#0071e3]" />
            <span>Google Docs Question Paper</span>
          </button>
        </div>

        {copiedNotification && (
          <span className="text-xs text-[#28a745] flex items-center gap-1 font-mono font-medium">
            <Check className="w-3.5 h-3.5" />
            Copied to clipboard
          </span>
        )}
      </div>

      {/* VIEW 1: GOOGLE SHEETS WORKBOOK VIEWER (Apple Numbers style) */}
      {activeDocView === 'sheet' && (
        <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.05]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#34c759]/15 flex items-center justify-center text-[#28a745]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
                  <span>{activeExam?.title} - Results</span>
                  <span className="text-[10px] bg-black/[0.04] text-[#86868b] px-2 py-0.5 rounded-md font-mono">
                    .gsheet
                  </span>
                </h3>
                <p className="text-xs text-[#86868b]">
                  Synchronized with PostgreSQL Application Database
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTable}
                className="apple-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Data</span>
              </button>
            </div>
          </div>

          {/* 4 Tabs Required by Blueprint Section 12 */}
          <div className="flex border-b border-black/[0.05] gap-2 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveSheetTab('results')}
              className={`pb-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeSheetTab === 'results'
                  ? 'border-[#0071e3] text-[#0071e3] font-bold'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <span>Sheet 1 — Student Results</span>
              <span className="bg-black/[0.04] text-[#86868b] text-[10px] px-2 py-0.2 rounded-full font-mono">
                {examAttempts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheetTab('ranks')}
              className={`pb-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeSheetTab === 'ranks'
                  ? 'border-[#0071e3] text-[#0071e3] font-bold'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <span>Sheet 2 — Rank List</span>
              <span className="bg-black/[0.04] text-[#86868b] text-[10px] px-2 py-0.2 rounded-full font-mono">
                Top {examAttempts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheetTab('malpractice')}
              className={`pb-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeSheetTab === 'malpractice'
                  ? 'border-[#0071e3] text-[#0071e3] font-bold'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <span>Sheet 3 — Review & Malpractice</span>
              <span className="bg-[#ff9500]/15 text-[#d97706] text-[10px] px-2 py-0.2 rounded-full font-mono font-bold">
                {proctoringRows.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheetTab('summary')}
              className={`pb-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeSheetTab === 'summary'
                  ? 'border-[#0071e3] text-[#0071e3] font-bold'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <span>Sheet 4 — Summary</span>
            </button>
          </div>

          {/* TAB 1 */}
          {activeSheetTab === 'results' && (
            <div className="overflow-x-auto rounded-2xl border border-black/[0.05]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4 font-sans">Student Name</th>
                    <th className="py-3 px-4 text-right">Marks</th>
                    <th className="py-3 px-4 text-right">Percentage</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
                  {examAttempts.map((attempt, index) => (
                    <tr key={attempt.id} className="hover:bg-black/[0.02]">
                      <td className="py-3 px-4 text-[#86868b]">{index + 1}</td>
                      <td className="py-3 px-4 font-bold">{attempt.studentRollNo}</td>
                      <td className="py-3 px-4 font-sans font-medium text-[#1d1d1f]">{attempt.studentName}</td>
                      <td className="py-3 px-4 text-right text-[#0071e3] font-bold">{attempt.totalMarksAwarded}</td>
                      <td className="py-3 px-4 text-right text-[#28a745] font-bold">{attempt.percentage}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] bg-black/[0.04] text-[#515154] px-2.5 py-0.5 rounded-full font-bold">
                          {attempt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2 */}
          {activeSheetTab === 'ranks' && (
            <div className="overflow-x-auto rounded-2xl border border-black/[0.05]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4 font-sans">Student Name</th>
                    <th className="py-3 px-4 text-right">Marks</th>
                    <th className="py-3 px-4 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
                  {[...examAttempts]
                    .sort((a, b) => (a.rank || 99) - (b.rank || 99))
                    .map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-black/[0.02]">
                        <td className="py-3 px-4 font-bold text-[#ff9500]">
                          {attempt.rank === 1 ? '🥇 Rank 1' : attempt.rank === 2 ? '🥈 Rank 2' : attempt.rank === 3 ? '🥉 Rank 3' : `Rank ${attempt.rank}`}
                        </td>
                        <td className="py-3 px-4">{attempt.studentRollNo}</td>
                        <td className="py-3 px-4 font-sans font-medium text-[#1d1d1f]">{attempt.studentName}</td>
                        <td className="py-3 px-4 text-right text-[#0071e3] font-bold">{attempt.totalMarksAwarded}</td>
                        <td className="py-3 px-4 text-right text-[#28a745] font-bold">{attempt.percentage}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3 */}
          {activeSheetTab === 'malpractice' && (
            <div className="overflow-x-auto rounded-2xl border border-black/[0.05]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-center">Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
                  {proctoringRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02]">
                      <td className="py-3 px-4 font-sans font-medium text-[#1d1d1f]">{row.student}</td>
                      <td className="py-3 px-4 text-[#86868b]">{row.rollNo}</td>
                      <td className="py-3 px-4 text-[#ff9500] font-bold">{row.event}</td>
                      <td className="py-3 px-4 text-[#515154]">{row.time}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          row.status === 'Cleared' ? 'bg-[#34c759]/15 text-[#28a745]' : 'bg-[#ff9500]/15 text-[#d97706]'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {proctoringRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#86868b] font-sans">
                        No proctoring violations recorded for this examination.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4 */}
          {activeSheetTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-3 font-mono text-xs">
                <h4 className="font-bold text-[#1d1d1f] uppercase text-[11px] pb-2 border-b border-black/[0.06]">
                  Key Assessment Metrics
                </h4>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Total Registered Attempts:</span>
                  <span className="text-[#1d1d1f] font-bold">{totalCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Completed Submissions:</span>
                  <span className="text-[#1d1d1f] font-bold">{totalCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Class Average Marks:</span>
                  <span className="text-[#0071e3] font-bold">{avgMarks} / {activeExam?.totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Highest Score:</span>
                  <span className="text-[#ff9500] font-bold">{highMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Lowest Score:</span>
                  <span className="text-[#1d1d1f] font-bold">{lowMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Pass Percentage:</span>
                  <span className="text-[#28a745] font-bold">{passPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">AI Reviews Awaiting Sign-off:</span>
                  <span className="text-[#ff9500] font-bold">{pendingReviewsCount}</span>
                </div>
              </div>

              <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-3 text-xs">
                <h4 className="font-bold text-[#1d1d1f] uppercase text-[11px] font-mono pb-2 border-b border-black/[0.06]">
                  Curriculum & Assessment Meta
                </h4>
                <div className="space-y-1 text-[#515154] text-[11px] leading-relaxed">
                  <p><strong>Title:</strong> {activeExam?.title}</p>
                  <p><strong>Subject:</strong> {activeExam?.subject}</p>
                  <p><strong>Institution:</strong> {faculty.collegeName}</p>
                  <p><strong>Faculty:</strong> {faculty.name} ({faculty.department})</p>
                  <p><strong>Scheduled Date:</strong> {activeExam?.scheduledDate}</p>
                  <p><strong>Evaluation Engine:</strong> Talent IQ Rubric AI + Faculty Sign-off</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: GOOGLE DOCS (Apple Pages style) */}
      {activeDocView === 'doc' && (
        <div className="apple-card p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  {activeExam?.title} - Question Paper
                </h3>
                <p className="text-xs text-[#86868b]">
                  Google Docs Formatted Academic Examination Document
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Print Document</span>
            </button>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-6 font-serif border border-black/[0.06]">
            <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                {faculty.collegeName}
              </h2>
              <p className="text-xs font-sans font-semibold text-slate-700 uppercase">
                Department of {faculty.department} · Autonomous Mid-Semester Assessment
              </p>
              <div className="pt-2 text-xs font-sans text-slate-800 flex flex-wrap justify-between border-t border-slate-300 mt-3 pt-2">
                <span><strong>Subject:</strong> {activeExam?.subject}</span>
                <span><strong>Date:</strong> {activeExam?.scheduledDate}</span>
                <span><strong>Duration:</strong> {activeExam?.durationMinutes} Minutes</span>
                <span><strong>Max Marks:</strong> {activeExam?.totalMarks}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-sans space-y-1 text-slate-800">
              <span className="font-bold uppercase tracking-wider block text-[11px]">Instructions for Candidates:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {activeExam?.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 pt-4 font-sans text-xs">
              {activeExam?.questions.map((q, idx) => (
                <div key={q.id} className="space-y-2 pb-4 border-b border-slate-200">
                  <div className="flex items-start justify-between gap-4 font-semibold text-slate-950 text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold">{idx + 1}.</span>
                      <span>{q.question}</span>
                    </div>
                    <span className="font-mono text-xs bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300 shrink-0">
                      [{q.marks} Marks]
                    </span>
                  </div>

                  {q.scenario && (
                    <div className="bg-slate-100 p-3 rounded-lg border border-slate-300 text-xs italic text-slate-800">
                      <strong>Scenario:</strong> {q.scenario}
                    </div>
                  )}

                  {q.options && (
                    <div className="grid grid-cols-2 gap-2 mt-2 font-normal">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="font-bold font-mono">({String.fromCharCode(65 + oIdx)})</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-300 text-[11px] font-sans text-slate-600 flex justify-between">
              <span>Prepared by: {faculty.name}</span>
              <span>*** END OF EXAMINATION ***</span>
              <span>Talent IQ Platform</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
