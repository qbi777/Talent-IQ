import React, { useState } from 'react';
import { Examination, StudentAttempt, StudentAnswer, ProctoringEvent } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  ArrowLeft, 
  Search, 
  FileSpreadsheet, 
  Award, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Edit3, 
  X,
  ChevronRight,
  BarChart2
} from 'lucide-react';

interface ExamResultsViewProps {
  examination: Examination;
  attempts: StudentAttempt[];
  onBack: () => void;
  onOpenGoogleDriveHub: () => void;
}

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  examination,
  attempts,
  onBack,
  onOpenGoogleDriveHub
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Evaluated' | 'Review Required'>('All');
  const [selectedAttemptModal, setSelectedAttemptModal] = useState<StudentAttempt | null>(null);

  // Override modal state
  const [overrideQuestionId, setOverrideQuestionId] = useState<string | null>(null);
  const [overrideMarks, setOverrideMarks] = useState<number>(0);
  const [overrideFeedback, setOverrideFeedback] = useState<string>('');

  const filteredAttempts = attempts.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSubmissions = attempts.length;
  const passedCount = attempts.filter(a => a.passed).length;
  const passRate = totalSubmissions ? Math.round((passedCount / totalSubmissions) * 100) : 0;
  const highestMarks = totalSubmissions ? Math.max(...attempts.map(a => a.totalMarksAwarded)) : 0;
  const lowestMarks = totalSubmissions ? Math.min(...attempts.map(a => a.totalMarksAwarded)) : 0;
  const averageMarks = totalSubmissions 
    ? Math.round((attempts.reduce((acc, a) => acc + a.totalMarksAwarded, 0) / totalSubmissions) * 10) / 10 
    : 0;

  const questionStats = examination.questions.map(q => {
    let totalScore = 0;
    let count = 0;
    attempts.forEach(a => {
      if (a.answers[q.id]) {
        totalScore += a.answers[q.id].awardedMarks || 0;
        count++;
      }
    });
    const avg = count ? Math.round((totalScore / count) * 10) / 10 : 0;
    const avgPercentage = Math.round((avg / q.marks) * 100);
    return {
      ...q,
      avgScore: avg,
      avgPercentage
    };
  });

  const handleOpenOverride = (qId: string, currentMarks: number, currentFeedback?: string) => {
    setOverrideQuestionId(qId);
    setOverrideMarks(currentMarks);
    setOverrideFeedback(currentFeedback || '');
  };

  const handleSaveOverride = () => {
    if (!selectedAttemptModal || !overrideQuestionId) return;

    StorageService.overrideStudentMarks(
      selectedAttemptModal.id,
      overrideQuestionId,
      overrideMarks,
      overrideFeedback
    );

    const updated = StorageService.getAttempts().find(a => a.id === selectedAttemptModal.id);
    if (updated) setSelectedAttemptModal(updated);

    setOverrideQuestionId(null);
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
            onClick={onOpenGoogleDriveHub}
            className="apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#34c759]" />
            <span>Open Google Sheet Workbook</span>
          </button>
        </div>
      </div>

      {/* Examination Summary Card */}
      <div className="apple-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#0071e3]/10 text-[#0071e3] px-2.5 py-0.5 rounded-full font-mono font-semibold">
              {examination.id}
            </span>
            <span className="text-xs bg-black/[0.04] text-[#515154] px-2.5 py-0.5 rounded-full font-medium">
              {examination.subject}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            {examination.title}
          </h1>
          <p className="text-xs text-[#86868b]">
            Conducted by {examination.facultyName} ({examination.collegeName}) · Max Marks: {examination.totalMarks}
          </p>
        </div>

        {/* Aggregate KPI chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] font-mono text-center">
          <div>
            <span className="text-[10px] text-[#86868b] uppercase font-semibold block">Submissions</span>
            <span className="text-xl font-black text-[#1d1d1f]">{totalSubmissions}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#86868b] uppercase font-semibold block">Avg Score</span>
            <span className="text-xl font-black text-[#0071e3]">{averageMarks}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#86868b] uppercase font-semibold block">Pass Rate</span>
            <span className="text-xl font-black text-[#28a745]">{passRate}%</span>
          </div>
          <div>
            <span className="text-[10px] text-[#86868b] uppercase font-semibold block">Top Score</span>
            <span className="text-xl font-black text-[#ff9500]">{highestMarks}</span>
          </div>
        </div>
      </div>

      {/* Podium View (Apple Fitness / Rings look) */}
      <div className="apple-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ff9500]" />
            <span>Examination Rank Podium</span>
          </h3>
          <span className="text-xs text-[#86868b] font-mono">
            Talent IQ Standardized Scoring Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {attempts.slice(0, 3).map((student, i) => (
            <div
              key={student.id}
              onClick={() => setSelectedAttemptModal(student)}
              className="bg-[#f5f5f7] hover:bg-[#ebebee] rounded-2xl p-5 text-center cursor-pointer transition-all border border-black/[0.03] group"
            >
              <div className="flex justify-center mb-3">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  i === 0 ? 'bg-[#ff9500]/15 text-[#d97706]' :
                  i === 1 ? 'bg-black/[0.06] text-[#515154]' :
                  'bg-[#ff9500]/10 text-[#b45309]'
                }`}>
                  {i === 0 ? '🥇 Rank #1' : i === 1 ? '🥈 Rank #2' : '🥉 Rank #3'}
                </span>
              </div>

              <h4 className="font-bold text-[#1d1d1f] text-sm group-hover:text-[#0071e3] transition-colors">
                {student.studentName}
              </h4>
              <p className="text-[11px] text-[#86868b] font-mono mt-0.5">{student.studentRollNo}</p>

              <div className="mt-3 pt-3 border-t border-black/[0.05] flex items-center justify-center gap-2 font-mono">
                <span className="text-2xl font-black text-[#0071e3]">{student.totalMarksAwarded}</span>
                <span className="text-xs text-[#86868b]">/ {student.totalMarksPossible}</span>
                <span className="text-xs font-bold text-[#28a745]">({student.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question-wise Performance analytics */}
      <div className="apple-card p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#0071e3]" />
          <span>Question-Wise Conceptual Mastery</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {questionStats.map((qs, i) => (
            <div key={qs.id} className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.03] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#1d1d1f]">Q{i + 1} ({qs.type.replace('_', ' ')})</span>
                <span className="text-[#86868b]">{qs.marks}m</span>
              </div>

              <div className="w-full bg-black/[0.06] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    qs.avgPercentage >= 75 ? 'bg-[#34c759]' :
                    qs.avgPercentage >= 50 ? 'bg-[#0071e3]' :
                    'bg-[#ff9500]'
                  }`}
                  style={{ width: `${Math.min(100, qs.avgPercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#86868b]">Class Avg:</span>
                <span className="font-bold text-[#0071e3]">{qs.avgScore} ({qs.avgPercentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marksheet Table */}
      <div className="apple-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
          <div>
            <h3 className="text-lg font-bold text-[#1d1d1f]">
              Student Results & Rank List
            </h3>
            <p className="text-xs text-[#86868b]">
              Click any candidate to review AI rubric breakdowns, model answers, and adjust scores
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#f5f5f7] border border-black/[0.06] rounded-full px-4 py-2 text-xs text-[#1d1d1f] font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Evaluated">Evaluated</option>
              <option value="Review Required">Review Required</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Rank</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Marks Awarded</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Proctoring Flags</th>
                <th className="py-3 px-4 text-center">Evaluation Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
              {filteredAttempts.map((attempt) => (
                <tr 
                  key={attempt.id}
                  onClick={() => setSelectedAttemptModal(attempt)}
                  className="hover:bg-black/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold">
                    {attempt.rank === 1 && <span className="text-[#ff9500]">🥇 #1</span>}
                    {attempt.rank === 2 && <span className="text-[#86868b]">🥈 #2</span>}
                    {attempt.rank === 3 && <span className="text-[#d97706]">🥉 #3</span>}
                    {attempt.rank && attempt.rank > 3 && <span className="text-[#86868b]">#{attempt.rank}</span>}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#515154]">
                    {attempt.studentRollNo}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                    {attempt.studentName}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0071e3]">
                    {attempt.totalMarksAwarded} / {attempt.totalMarksPossible}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span className={attempt.passed ? 'text-[#28a745]' : 'text-[#ff3b30]'}>
                      {attempt.percentage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {attempt.tabSwitchCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#ff9500]/15 text-[#d97706] px-2.5 py-0.5 rounded-full font-bold">
                        <ShieldAlert className="w-3 h-3 text-[#ff9500]" />
                        {attempt.tabSwitchCount} {attempt.tabSwitchCount === 1 ? 'switch' : 'switches'}
                      </span>
                    ) : (
                      <span className="text-[#86868b] font-mono text-[10px]">Clean (0)</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      attempt.status === 'Evaluated' 
                        ? 'bg-[#34c759]/15 text-[#28a745]' 
                        : 'bg-[#ff9500]/15 text-[#d97706]'
                    }`}>
                      {attempt.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAttemptModal(attempt);
                      }}
                      className="text-xs text-[#0071e3] font-semibold hover:underline flex items-center justify-end gap-1 ml-auto"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Attempt Review Modal (Apple iOS Sheet style) */}
      {selectedAttemptModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative border border-black/[0.06]">
            <button
              onClick={() => setSelectedAttemptModal(null)}
              className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f] w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="pb-4 border-b border-black/[0.05] space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-3 py-0.5 rounded-full font-mono font-semibold">
                  Roll No: {selectedAttemptModal.studentRollNo}
                </span>
                <span className="text-xs bg-black/[0.05] text-[#515154] px-3 py-0.5 rounded-full font-medium">
                  Rank #{selectedAttemptModal.rank}
                </span>
                {selectedAttemptModal.malpracticeFlag && (
                  <span className="text-xs bg-[#ff9500]/15 text-[#d97706] px-3 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Proctoring Review Flagged
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                {selectedAttemptModal.studentName} — Evaluation Review
              </h2>

              <div className="flex items-center gap-4 text-xs font-mono text-[#86868b]">
                <span>Total Marks: <strong className="text-[#0071e3] font-bold">{selectedAttemptModal.totalMarksAwarded} / {selectedAttemptModal.totalMarksPossible}</strong></span>
                <span>•</span>
                <span>Percentage: <strong className="text-[#28a745] font-bold">{selectedAttemptModal.percentage}%</strong></span>
                <span>•</span>
                <span>Tab Switches: <strong className="text-[#ff9500] font-bold">{selectedAttemptModal.tabSwitchCount}</strong></span>
              </div>
            </div>

            {/* Questions & Student Answers */}
            <div className="space-y-6">
              {examination.questions.map((q, idx) => {
                const answer: StudentAnswer | undefined = selectedAttemptModal.answers[q.id];

                return (
                  <div key={q.id} className="bg-[#f5f5f7] rounded-2xl p-5 space-y-3 border border-black/[0.04]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-[#1d1d1f] flex gap-2">
                          <span className="text-[#0071e3] font-mono">Q{idx + 1}.</span>
                          <span>{q.question}</span>
                        </div>
                        {q.scenario && (
                          <p className="text-[11px] text-[#515154] italic bg-white p-2.5 rounded-xl border border-black/[0.04]">
                            Scenario: {q.scenario}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-[#0071e3] bg-white px-3 py-1 rounded-full shadow-xs border border-black/[0.04]">
                          {answer?.awardedMarks ?? 0} / {q.marks} Marks
                        </span>
                        <button
                          onClick={() => handleOpenOverride(q.id, answer?.awardedMarks ?? 0, answer?.facultyFeedback)}
                          className="block text-[10px] text-[#0071e3] hover:underline mt-1 text-right font-medium"
                        >
                          Override Score
                        </button>
                      </div>
                    </div>

                    {/* Answer Display */}
                    <div className="bg-white p-4 rounded-xl border border-black/[0.04] text-xs">
                      <span className="text-[10px] text-[#86868b] uppercase font-mono block mb-1 font-semibold">
                        Student's Submitted Answer:
                      </span>
                      <div className="text-[#1d1d1f] leading-relaxed">
                        {q.type === 'multiple_choice' ? (
                          <span className="font-semibold">
                            Selected: {answer?.selectedOption || 'None'}
                            {answer?.isCorrect ? (
                              <span className="text-[#28a745] ml-2 font-mono">✓ Correct</span>
                            ) : (
                              <span className="text-[#ff3b30] ml-2 font-mono">✗ Incorrect (Expected: {q.correctAnswer})</span>
                            )}
                          </span>
                        ) : (
                          answer?.textAnswer || <em className="text-[#86868b]">No response entered</em>
                        )}
                      </div>
                    </div>

                    {/* AI Rubric Score breakdown */}
                    {answer?.aiEvaluation && (
                      <div className="bg-[#0071e3]/5 border border-[#0071e3]/15 rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#28a745] font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-[#34c759]" />
                            <span className="text-[#1d1d1f]">Talent IQ Rubric Breakdown:</span>
                          </div>
                          <span className="text-[10px] text-[#86868b] font-mono">
                            Benchmarked against model rubric
                          </span>
                        </div>

                        {/* 4 Pillars in Apple Pills */}
                        <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px] bg-white p-2.5 rounded-xl border border-black/[0.04]">
                          <div>
                            <span className="text-[#86868b] block font-semibold">Relevance</span>
                            <span className="font-bold text-[#1d1d1f]">{answer.aiEvaluation.relevanceScore} pts</span>
                          </div>
                          <div>
                            <span className="text-[#86868b] block font-semibold">Accuracy</span>
                            <span className="font-bold text-[#1d1d1f]">{answer.aiEvaluation.technicalAccuracyScore} pts</span>
                          </div>
                          <div>
                            <span className="text-[#86868b] block font-semibold">Reasoning</span>
                            <span className="font-bold text-[#1d1d1f]">{answer.aiEvaluation.reasoningScore} pts</span>
                          </div>
                          <div>
                            <span className="text-[#86868b] block font-semibold">Depth</span>
                            <span className="font-bold text-[#1d1d1f]">{answer.aiEvaluation.depthScore} pts</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#515154]">
                          {answer.aiEvaluation.reasoningText}
                        </p>

                        {answer.aiEvaluation.strengths.length > 0 && (
                          <div className="text-[11px] text-[#28a745]">
                            <strong>Strengths:</strong> {answer.aiEvaluation.strengths.join(' • ')}
                          </div>
                        )}
                        {answer.aiEvaluation.improvements.length > 0 && (
                          <div className="text-[11px] text-[#d97706]">
                            <strong>Suggestions:</strong> {answer.aiEvaluation.improvements.join(' • ')}
                          </div>
                        )}
                      </div>
                    )}

                    {answer?.facultyOverrideMarks !== undefined && (
                      <div className="bg-[#5856d6]/10 border border-[#5856d6]/20 rounded-xl p-3 text-xs text-[#5856d6]">
                        <strong>Faculty Adjustment:</strong> Manually adjusted to {answer.facultyOverrideMarks} marks.
                        {answer.facultyFeedback && <p className="mt-0.5 text-[#515154] italic">{answer.facultyFeedback}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex justify-end">
              <button
                onClick={() => setSelectedAttemptModal(null)}
                className="apple-btn-primary px-6 py-2.5 text-xs font-semibold shadow-sm"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Sub-Modal */}
      {overrideQuestionId && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-black/[0.06]">
            <h3 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#0071e3]" />
              <span>Override Question Marks</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1d1d1f]">New Awarded Marks</label>
                <input
                  type="number"
                  step="0.5"
                  value={overrideMarks}
                  onChange={(e) => setOverrideMarks(Number(e.target.value))}
                  className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#1d1d1f] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1d1d1f]">Faculty Rationale / Feedback</label>
                <textarea
                  rows={2}
                  value={overrideFeedback}
                  onChange={(e) => setOverrideFeedback(e.target.value)}
                  placeholder="Rationale for adjustment..."
                  className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-end gap-2">
              <button
                onClick={() => setOverrideQuestionId(null)}
                className="text-xs text-[#86868b] hover:text-[#1d1d1f] px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="apple-btn-primary px-4 py-2 text-xs font-bold shadow-sm"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
