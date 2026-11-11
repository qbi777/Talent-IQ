import React, { useState, useEffect, useRef } from 'react';
import { Examination, Question, StudentAttempt, StudentAnswer, ProctoringEvent } from '../../types';
import { StorageService } from '../../services/storage';
import { evaluateStudentAnswer } from '../../services/aiEvaluation';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertTriangle,
  Sparkles,
  X
} from 'lucide-react';

interface ExamPlayerProps {
  examination: Examination;
  studentName: string;
  studentRollNo: string;
  onFinishExam: () => void;
}

export const ExamPlayer: React.FC<ExamPlayerProps> = ({
  examination,
  studentName,
  studentRollNo,
  onFinishExam
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { option?: string; text?: string }>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(examination.durationMinutes * 60);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('Auto-saved to cloud');
  const [tabSwitchAlert, setTabSwitchAlert] = useState<{ count: number; timestamp: string } | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<StudentAttempt | null>(null);

  const attemptIdRef = useRef<string>(`ATT-${Date.now().toString(36).toUpperCase()}`);
  const startTimeRef = useRef<string>(new Date().toISOString());
  const tabSwitchesCountRef = useRef<number>(0);

  const questions = examination.questions;
  const currentQuestion: Question = questions[currentQuestionIndex];

  // 1. Timer Countdown
  useEffect(() => {
    if (submittedAttempt) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submittedAttempt]);

  // 2. Real-Time Tab Switch & Blur Proctoring Listener
  useEffect(() => {
    if (submittedAttempt) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordTabSwitchEvent();
      }
    };

    const handleWindowBlur = () => {
      recordTabSwitchEvent();
    };

    const recordTabSwitchEvent = () => {
      tabSwitchesCountRef.current += 1;
      const count = tabSwitchesCountRef.current;
      const timeStr = new Date().toLocaleTimeString();

      setTabSwitchAlert({ count, timestamp: timeStr });

      StorageService.recordProctoringEvent(attemptIdRef.current, {
        attemptId: attemptIdRef.current,
        studentRollNo,
        studentName,
        eventType: 'tab_switched',
        details: `Student switched away from examination tab (Violation #${count}).`,
        severity: count >= 3 ? 'high' : count >= 2 ? 'medium' : 'low',
        reviewStatus: 'Pending'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [submittedAttempt, studentRollNo, studentName]);

  const triggerAutoSaveIndicator = () => {
    setAutoSaveStatus(`Saved at ${new Date().toLocaleTimeString()}`);
  };

  const handleSelectOption = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        option
      }
    }));
    triggerAutoSaveIndicator();
  };

  const handleUpdateTextAnswer = (text: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        text
      }
    }));
    triggerAutoSaveIndicator();
  };

  const handleToggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      const answersMap: Record<string, StudentAnswer> = {};
      let totalMarksAwarded = 0;
      let totalMarksPossible = 0;

      for (const q of questions) {
        totalMarksPossible += q.marks;
        const studentAns = answers[q.id];
        const evalResult = await evaluateStudentAnswer(
          q,
          studentAns?.option,
          studentAns?.text
        );

        totalMarksAwarded += evalResult.awardedMarks;

        answersMap[q.id] = {
          questionId: q.id,
          type: q.type,
          selectedOption: studentAns?.option,
          textAnswer: studentAns?.text,
          isCorrect: evalResult.isCorrect,
          awardedMarks: evalResult.awardedMarks,
          maxMarks: q.marks,
          aiEvaluation: evalResult.aiEvaluation
        };
      }

      const totalPercentage = Math.round((totalMarksAwarded / totalMarksPossible) * 100);
      const passed = totalPercentage >= examination.passPercentage;
      const timeSpent = examination.durationMinutes * 60 - timeRemainingSeconds;

      const newAttempt: StudentAttempt = {
        id: attemptIdRef.current,
        examId: examination.id,
        collegeId: examination.collegeId,
        studentName,
        studentRollNo,
        startedAt: startTimeRef.current,
        submittedAt: new Date().toISOString(),
        timeSpentSeconds: timeSpent,
        status: tabSwitchesCountRef.current >= 3 ? 'Review Required' : 'Evaluated',
        totalMarksAwarded,
        totalMarksPossible,
        percentage: totalPercentage,
        passed,
        tabSwitchCount: tabSwitchesCountRef.current,
        malpracticeFlag: tabSwitchesCountRef.current >= 2,
        answers: answersMap,
        proctoringEvents: []
      };

      const submitted = StorageService.submitAttempt(newAttempt);
      setSubmittedAttempt(submitted);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred during submission evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.option || answers[k]?.text?.trim()).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;

  // Post-Submission View (Apple Confirmation Screen)
  if (submittedAttempt) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center p-4 py-12">
        <div className="max-w-2xl w-full apple-card p-8 sm:p-12 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#34c759]/15 text-[#28a745] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#28a745] bg-[#34c759]/10 px-3 py-0.5 rounded-full font-bold">
              Talent IQ Verified Submission
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] tracking-tight">
              Examination Completed
            </h1>
            <p className="text-xs text-[#86868b]">
              Candidate: <strong>{submittedAttempt.studentName}</strong> ({submittedAttempt.studentRollNo})
            </p>
          </div>

          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-xs font-mono space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-[#86868b]">Submission Receipt Token:</span>
              <span className="text-[#0071e3] font-bold">{submittedAttempt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Submission Time:</span>
              <span className="text-[#1d1d1f]">{new Date(submittedAttempt.submittedAt || '').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Elapsed Time:</span>
              <span className="text-[#1d1d1f]">{Math.floor(submittedAttempt.timeSpentSeconds / 60)}m {submittedAttempt.timeSpentSeconds % 60}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Proctoring Tab Switches:</span>
              <span className={submittedAttempt.tabSwitchCount > 0 ? 'text-[#ff9500] font-bold' : 'text-[#28a745] font-bold'}>
                {submittedAttempt.tabSwitchCount}
              </span>
            </div>
          </div>

          {examination.resultsVisibleToStudents ? (
            <div className="bg-[#0071e3]/5 border border-[#0071e3]/15 p-6 rounded-2xl space-y-2">
              <span className="text-xs text-[#0071e3] font-semibold block uppercase tracking-wider">
                Preliminary Talent IQ Score:
              </span>
              <div className="flex items-center justify-center gap-2 font-mono">
                <span className="text-4xl font-black text-[#0071e3]">{submittedAttempt.totalMarksAwarded}</span>
                <span className="text-[#86868b] text-lg">/ {submittedAttempt.totalMarksPossible}</span>
                <span className="text-[#28a745] font-bold text-lg ml-2">({submittedAttempt.percentage}%)</span>
              </div>
              <p className="text-[11px] text-[#86868b]">
                Status: <strong className="text-[#1d1d1f]">{submittedAttempt.status}</strong>. Official score will appear once confirmed by your faculty evaluator.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-black/[0.04] text-xs text-[#86868b]">
              Results are restricted by the faculty evaluator. Official marksheets will be released by your department.
            </div>
          )}

          <button
            onClick={onFinishExam}
            className="apple-btn-primary w-full py-3.5 text-xs font-semibold shadow-md"
          >
            Return to Assessment Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between">
      {/* macOS Style Tab Switch Notification */}
      {tabSwitchAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 apple-glass rounded-2xl p-4 shadow-2xl border-l-4 border-l-[#ff9500] flex items-center gap-3 text-xs max-w-md animate-in slide-in-from-top-4 duration-200">
          <ShieldAlert className="w-5 h-5 text-[#ff9500] shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#1d1d1f] block">
              Proctoring Alert: Tab Switch Logged (#{tabSwitchAlert.count})
            </span>
            <span className="text-[11px] text-[#515154]">
              Window focus lost at {tabSwitchAlert.timestamp}. Repeated infractions will be reported to the faculty dean.
            </span>
          </div>
          <button 
            onClick={() => setTabSwitchAlert(null)}
            className="text-[#86868b] hover:text-[#1d1d1f] p-1 ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header (Apple Frosted Glass) */}
      <header className="sticky top-0 z-40 apple-glass border-b border-black/[0.06] px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] bg-black/[0.04] text-[#86868b] px-2 py-0.5 rounded-full font-mono font-medium">
            {examination.collegeName}
          </span>
          <h2 className="text-sm font-bold text-[#1d1d1f] truncate max-w-xs sm:max-w-md">
            {examination.title}
          </h2>
        </div>

        {/* Center: Apple Pill Timer */}
        <div className="flex items-center gap-2 bg-[#f5f5f7] px-4 py-1.5 rounded-full border border-black/[0.05] shadow-inner">
          <Clock className={`w-3.5 h-3.5 ${timeRemainingSeconds < 180 ? 'text-[#ff3b30] animate-pulse' : timeRemainingSeconds < 600 ? 'text-[#ff9500]' : 'text-[#0071e3]'}`} />
          <span className={`font-mono text-xs sm:text-sm font-bold ${
            timeRemainingSeconds < 180 ? 'text-[#ff3b30]' : timeRemainingSeconds < 600 ? 'text-[#d97706]' : 'text-[#1d1d1f]'
          }`}>
            {formatTimer(timeRemainingSeconds)}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[11px] text-[#86868b] font-mono">
            {autoSaveStatus}
          </span>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="apple-btn-primary px-4 py-2 text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <span>Finish Test</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left 3 Columns */}
        <div className="lg:col-span-3 space-y-5 flex flex-col justify-between">
          <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6 flex-1">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#1d1d1f] text-white font-mono font-bold text-xs flex items-center justify-center">
                  {currentQuestionIndex + 1}
                </span>
                <span className="text-xs uppercase font-mono font-bold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full">
                  {currentQuestion.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#86868b]">
                  of {questions.length} Questions
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleReview}
                  className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                    markedForReview[currentQuestion.id]
                      ? 'bg-[#5856d6]/15 border-[#5856d6]/40 text-[#5856d6] font-bold'
                      : 'bg-[#f5f5f7] border-black/[0.06] text-[#515154] hover:text-[#1d1d1f]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{markedForReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                <span className="text-xs font-mono font-bold text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1 rounded-full border border-black/[0.05]">
                  {currentQuestion.marks} Marks
                </span>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] leading-relaxed">
                {currentQuestion.question}
              </h3>

              {currentQuestion.scenario && (
                <div className="bg-[#0071e3]/5 border border-[#0071e3]/15 p-4 rounded-2xl text-xs text-[#0071e3] leading-relaxed italic">
                  <strong>Engineering Context:</strong> {currentQuestion.scenario}
                </div>
              )}

              {/* Answers Area */}
              {currentQuestion.type === 'multiple_choice' ? (
                <div className="space-y-2.5 pt-2">
                  {(currentQuestion.options || []).map((opt, oIdx) => {
                    const isSelected = answers[currentQuestion.id]?.option === opt;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(opt)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-[#0071e3]/10 border-[#0071e3] text-[#1d1d1f] shadow-xs'
                            : 'bg-[#f5f5f7] hover:bg-[#ebebee] border-black/[0.05] text-[#515154]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'border-[#0071e3] bg-[#0071e3] text-white'
                            : 'border-black/[0.2] text-[#86868b]'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-between">
                    <span>Your Answer (Rubric AI Evaluated):</span>
                    <span className="text-[10px] text-[#86868b] font-mono">
                      {(answers[currentQuestion.id]?.text || '').split(/\s+/).filter(Boolean).length} words
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    value={answers[currentQuestion.id]?.text || ''}
                    onChange={(e) => handleUpdateTextAnswer(e.target.value)}
                    placeholder="Provide clear technical rationale, state your architectural trade-offs, and cite relevant concepts..."
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-2xl p-4 text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 leading-relaxed font-sans"
                  />
                  <p className="text-[11px] text-[#86868b]">
                    💡 Talent IQ Tip: Address technical accuracy, relevant keywords, and reasoning to optimize rubric score.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className="apple-btn-secondary disabled:opacity-40 px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="apple-btn-primary px-5 py-2 text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-[#34c759] hover:bg-[#28a745] text-white px-6 py-2 rounded-full font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Review & Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-5">
          <div className="apple-card p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
              Question Palette
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!(answers[q.id]?.option || answers[q.id]?.text?.trim());
                const isReview = !!markedForReview[q.id];
                const isCurrent = idx === currentQuestionIndex;

                let btnClass = 'bg-[#f5f5f7] text-[#86868b] border-black/[0.04]';
                if (isCurrent) {
                  btnClass = 'ring-2 ring-[#0071e3] bg-[#0071e3] text-white font-bold shadow-xs';
                } else if (isReview) {
                  btnClass = 'bg-[#5856d6]/15 text-[#5856d6] border-[#5856d6]/30 font-bold';
                } else if (isAnswered) {
                  btnClass = 'bg-[#34c759]/15 text-[#28a745] border-[#34c759]/30 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-xl border flex items-center justify-center font-mono text-xs transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-black/[0.05] space-y-1.5 text-[11px] text-[#86868b]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34c759]"></span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5856d6]"></span>
                <span>Marked for Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-black/[0.12]"></span>
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
            </div>
          </div>

          <div className="apple-card p-5 shadow-sm space-y-2 text-xs">
            <h4 className="text-[10px] font-bold text-[#86868b] uppercase">Candidate</h4>
            <div className="font-bold text-[#1d1d1f] text-sm">{studentName}</div>
            <div className="font-mono text-[#86868b] text-xs">{studentRollNo}</div>
            <div className="pt-2 border-t border-black/[0.05] text-[10px] text-[#86868b] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Talent IQ Integrity Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal (Apple iOS Sheet style) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 space-y-6 shadow-2xl relative text-center border border-black/[0.06]">
            <div className="w-12 h-12 rounded-full bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Submit Examination?
              </h3>
              <p className="text-xs text-[#86868b]">
                Please review your progress before finalizing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-xs font-mono">
              <div>
                <span className="text-[#86868b] block font-semibold">Answered:</span>
                <span className="text-[#0071e3] font-bold text-lg">{answeredCount} / {questions.length}</span>
              </div>
              <div>
                <span className="text-[#86868b] block font-semibold">Marked Review:</span>
                <span className="text-[#5856d6] font-bold text-lg">{reviewCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="apple-btn-secondary flex-1 py-2.5 text-xs font-semibold"
              >
                Return to Test
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="apple-btn-primary flex-1 py-2.5 text-xs font-bold shadow-sm"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
