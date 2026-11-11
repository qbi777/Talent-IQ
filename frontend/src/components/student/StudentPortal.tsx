import React, { useState } from 'react';
import { Examination } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';

interface StudentPortalProps {
  examinations: Examination[];
  initialExamId?: string;
  onStartExam: (exam: Examination, studentName: string, studentRollNo: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  examinations,
  initialExamId,
  onStartExam
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId || examinations[0]?.id || '');
  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedExam = examinations.find(e => e.id === selectedExamId) || examinations[0];
  const existingAttempts = StorageService.getAttempts(selectedExam?.id);

  const handleBegin = () => {
    setErrorMessage('');
    if (!studentName.trim()) {
      setErrorMessage('Please enter your full name as registered in college records.');
      return;
    }
    if (!studentRollNo.trim()) {
      setErrorMessage('Please enter your official university register / roll number.');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please agree to the examination & proctoring guidelines before proceeding.');
      return;
    }

    const duplicate = existingAttempts.find(
      a => a.studentRollNo.trim().toLowerCase() === studentRollNo.trim().toLowerCase() && a.status !== 'In Progress'
    );

    if (duplicate && selectedExam.maxAttempts <= 1) {
      setErrorMessage(`Roll number ${studentRollNo} has already completed this examination. Re-attempts are restricted.`);
      return;
    }

    onStartExam(selectedExam, studentName.trim(), studentRollNo.trim());
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full apple-card p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-b from-[#0071e3]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Institution & Exam Header */}
        <div className="space-y-3 pb-6 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-3 py-0.5 rounded-full font-mono font-semibold">
              Assessment Code: {selectedExam?.id}
            </span>
            <span className="text-xs bg-black/[0.04] text-[#515154] px-3 py-0.5 rounded-full font-medium">
              {selectedExam?.collegeName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            {selectedExam?.title}
          </h1>

          <p className="text-xs text-[#86868b]">
            Faculty Examiner: {selectedExam?.facultyName} · {selectedExam?.subject}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#515154] pt-2">
            <span className="flex items-center gap-1.5 text-[#0071e3] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Duration: {selectedExam?.durationMinutes} Mins
            </span>
            <span>•</span>
            <span>
              Total Marks: {selectedExam?.totalMarks}
            </span>
            <span>•</span>
            <span>
              Questions: {selectedExam?.questions.length}
            </span>
          </div>
        </div>

        {/* Select Exam Dropdown if multiple active */}
        {examinations.length > 1 && (
          <div className="space-y-1.5 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04]">
            <label className="text-xs font-semibold text-[#86868b]">
              Examination Paper:
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] font-medium"
            >
              {examinations.map(e => (
                <option key={e.id} value={e.id}>{e.title} ({e.collegeName})</option>
              ))}
            </select>
          </div>
        )}

        {/* Student Credentials Form */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
            Candidate Verification (Direct Link Access)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Full Name (As in College Records) *
              </label>
              <input
                type="text"
                placeholder="e.g. Soundarya Natarajan"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Register / Roll Number *
              </label>
              <input
                type="text"
                placeholder="e.g. 312221104089"
                value={studentRollNo}
                onChange={(e) => setStudentRollNo(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-[#1d1d1f] font-mono placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>
          </div>
        </div>

        {/* Guidelines Box */}
        <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#d97706] font-bold">
            <ShieldAlert className="w-4 h-4 text-[#ff9500]" />
            <span className="text-[#1d1d1f]">Talent IQ Proctoring Guidelines:</span>
          </div>

          <ul className="space-y-2 text-[#515154] text-[11px] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0" />
              <span><strong>Tab Switch Monitoring:</strong> Navigating away from this tab logs an immediate timestamped infraction in the faculty review log.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0" />
              <span><strong>Auto-Save:</strong> Responses are encrypted and saved continuously.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 shrink-0" />
              <span><strong>Timer:</strong> At 0:00, responses are automatically finalized and submitted.</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-black/[0.06]">
            <label className="flex items-start gap-2.5 cursor-pointer text-[#1d1d1f]">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-4 h-4 text-[#0071e3] rounded bg-white border-black/[0.2] mt-0.5 focus:ring-[#0071e3]"
              />
              <span className="text-[11px] text-[#515154]">
                I agree to the academic honor code and acknowledge that tab-switching and window focus are actively monitored by Talent IQ.
              </span>
            </label>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={handleBegin}
          className="apple-btn-primary w-full py-3.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
        >
          <span>Start Examination</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
