import React, { useState } from 'react';
import { Examination, FacultyUser, Question, QuestionType } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  ShieldAlert, 
  Sparkles,
  Settings,
  Layers
} from 'lucide-react';

interface ExamCreatorProps {
  faculty: FacultyUser;
  onCancel: () => void;
  onExamCreated: (newExam: Examination) => void;
}

export const ExamCreator: React.FC<ExamCreatorProps> = ({
  faculty,
  onCancel,
  onExamCreated
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(faculty.department || 'Computer Science & Engineering');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [passPercentage, setPassPercentage] = useState(50);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [resultsVisibleToStudents, setResultsVisibleToStudents] = useState(true);

  // Proctoring Settings
  const [tabSwitchDetection, setTabSwitchDetection] = useState(true);
  const [fullscreenRequired, setFullscreenRequired] = useState(true);
  const [cameraPresenceAlerts, setCameraPresenceAlerts] = useState(true);
  const [maxTabSwitchesAllowed, setMaxTabSwitchesAllowed] = useState(3);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'Q1',
      type: 'multiple_choice',
      question: 'What is the worst-case time complexity of searching in a Balanced Binary Search Tree?',
      marks: 4,
      negativeMarks: 1,
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctAnswer: 'O(log N)',
      explanation: 'Balanced BST maintains height at O(log N).'
    },
    {
      id: 'Q2',
      type: 'short_answer',
      question: 'Describe the principle of Locality of Reference in CPU cache memory hierarchy.',
      marks: 6,
      expectedKeywords: ['spatial locality', 'temporal locality', 'cache line', 'consecutive memory', 'recent access'],
      modelAnswer: 'Locality of reference consists of Temporal Locality (recently referenced memory locations are likely to be accessed again soon) and Spatial Locality (memory addresses close to the current location will likely be accessed shortly, exploiting cache lines).',
      rubricCriteria: {
        relevance: 2,
        technicalAccuracy: 2,
        reasoning: 1,
        depth: 1
      }
    }
  ]);

  const [activeTab, setActiveTab] = useState<'details' | 'questions' | 'proctoring' | 'preview'>('details');

  const handleAddQuestion = (type: QuestionType) => {
    const nextQNum = questions.length + 1;
    const newQ: Question = {
      id: `Q${nextQNum}`,
      type,
      question: type === 'multiple_choice' 
        ? 'Enter question text here...' 
        : type === 'situational' 
        ? 'How would you architect the failover mechanism for this situation?' 
        : 'Explain the core theoretical concept...',
      marks: type === 'multiple_choice' ? 4 : type === 'situational' ? 15 : 10,
      options: type === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correctAnswer: type === 'multiple_choice' ? 'Option A' : undefined,
      scenario: type === 'situational' ? 'A production server experiencing high traffic loads...' : undefined,
      expectedKeywords: ['scalability', 'consistency', 'latency'],
      modelAnswer: 'The expected comprehensive model answer goes here...',
      rubricCriteria: {
        relevance: 3,
        technicalAccuracy: 4,
        reasoning: 2,
        depth: 1
      }
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const totalCalculatedMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  const handleSaveExam = () => {
    if (!title.trim()) {
      alert('Please enter an Examination Title.');
      setActiveTab('details');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question to the examination.');
      setActiveTab('questions');
      return;
    }

    const created = StorageService.addExamination({
      collegeId: faculty.collegeId,
      collegeName: faculty.collegeName,
      facultyId: faculty.id,
      facultyName: faculty.name,
      title: title.trim(),
      subject,
      description: description.trim() || 'Talent IQ institutional semester assessment.',
      durationMinutes,
      totalMarks: totalCalculatedMarks,
      passPercentage,
      scheduledDate,
      maxAttempts: 1,
      resultsVisibleToStudents,
      monitoringSettings: {
        tabSwitchDetection,
        fullscreenRequired,
        cameraPresenceAlerts,
        maxTabSwitchesAllowed
      },
      instructions: [
        'Tab-switching is strictly monitored by the Talent IQ proctoring engine.',
        'Fullscreen mode is required throughout the test duration.',
        'Answers are saved automatically.',
        'Descriptive questions are evaluated using AI rubric criteria with faculty verification.'
      ],
      questions,
      status: 'Active',
      googleDocsPaperId: `DOC_${title.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
      googleSheetsResultsId: `SHEET_${title.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
    });

    onExamCreated(created);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('preview')}
            className="apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Preview Paper</span>
          </button>

          <button
            onClick={handleSaveExam}
            className="apple-btn-primary px-5 py-2 text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Examination</span>
          </button>
        </div>
      </div>

      {/* Title & Stats Card */}
      <div className="apple-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-mono font-semibold bg-black/[0.04] text-[#86868b] px-2.5 py-0.5 rounded-full">
            {faculty.collegeName} · {faculty.name}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f] mt-1.5 tracking-tight">
            Create Examination
          </h2>
          <p className="text-xs text-[#86868b]">
            Talent IQ rubric configuration, proctoring controls, and Google Drive generation
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#f5f5f7] px-4 py-2.5 rounded-2xl border border-black/[0.04] text-xs font-mono">
          <div>
            <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Questions</span>
            <span className="text-base font-bold text-[#1d1d1f]">{questions.length}</span>
          </div>
          <div className="w-px h-6 bg-black/[0.08]" />
          <div>
            <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Total Marks</span>
            <span className="text-base font-bold text-[#0071e3]">{totalCalculatedMarks}</span>
          </div>
          <div className="w-px h-6 bg-black/[0.08]" />
          <div>
            <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Duration</span>
            <span className="text-base font-bold text-[#34c759]">{durationMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Apple Segmented Tab Navigation */}
      <div className="apple-segmented-container flex p-1 text-xs">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'details'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>1. Basic Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'questions'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Questions ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proctoring')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'proctoring'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>3. Proctoring</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'preview'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>4. Live Preview</span>
        </button>
      </div>

      {/* Tab 1: Basic Details */}
      {activeTab === 'details' && (
        <div className="apple-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Examination Title *
              </label>
              <input
                type="text"
                placeholder="e.g. CS402: Operating Systems & Kernel Virtualization Midterm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Subject / Department *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Examination Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Passing Mark Threshold (%)
              </label>
              <input
                type="number"
                min={30}
                max={90}
                value={passPercentage}
                onChange={(e) => setPassPercentage(Number(e.target.value))}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Examination Scope & Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of test topics, syllabus coverage, and competencies evaluated..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#1d1d1f]">Student Result Visibility</div>
              <div className="text-[11px] text-[#86868b]">
                Allow students to view preliminary AI rubric scores immediately upon submission
              </div>
            </div>
            {/* Apple Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={resultsVisibleToStudents}
                onChange={(e) => setResultsVisibleToStudents(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-black/[0.12] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34c759]"></div>
            </label>
          </div>
        </div>
      )}

      {/* Tab 2: Question Builder & Rubrics */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="apple-card p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <span className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#0071e3]" />
              <span>Add Question:</span>
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAddQuestion('multiple_choice')}
                className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
              >
                + Multiple Choice (MCQ)
              </button>
              <button
                onClick={() => handleAddQuestion('short_answer')}
                className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
              >
                + Short Answer
              </button>
              <button
                onClick={() => handleAddQuestion('descriptive')}
                className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
              >
                + Descriptive Essay
              </button>
              <button
                onClick={() => handleAddQuestion('image_based')}
                className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
              >
                + Diagram / Image
              </button>
              <button
                onClick={() => handleAddQuestion('situational')}
                className="bg-[#0071e3]/10 hover:bg-[#0071e3]/15 text-[#0071e3] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              >
                + Situational Case
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {questions.map((q, qIndex) => (
              <div 
                key={q.id}
                className="apple-card p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white font-mono font-bold text-xs flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs uppercase font-mono font-bold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full">
                      {q.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#515154]">
                      <span className="font-semibold">Marks:</span>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={q.marks}
                        onChange={(e) => handleUpdateQuestion(q.id, { marks: Number(e.target.value) })}
                        className="w-14 bg-[#f5f5f7] border border-black/[0.08] rounded-lg px-2 py-1 text-center font-mono text-[#1d1d1f] text-xs font-bold"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1d1d1f]">
                    Problem Statement / Question *
                  </label>
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(q.id, { question: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                  />
                </div>

                {/* Situational Context */}
                {q.type === 'situational' && (
                  <div className="space-y-1.5 bg-[#0071e3]/5 p-4 rounded-2xl border border-[#0071e3]/15">
                    <label className="text-xs font-semibold text-[#0071e3]">
                      Engineering Case Scenario / Background Context
                    </label>
                    <textarea
                      rows={2}
                      value={q.scenario || ''}
                      onChange={(e) => handleUpdateQuestion(q.id, { scenario: e.target.value })}
                      placeholder="Specify system constraints, throughput spikes, or incident background..."
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                    />
                  </div>
                )}

                {/* MCQ Options */}
                {q.type === 'multiple_choice' && (
                  <div className="space-y-2 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04]">
                    <label className="text-xs font-semibold text-[#1d1d1f] block">
                      Options & Correct Answer Choice
                    </label>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${q.id}`}
                            checked={q.correctAnswer === opt}
                            onChange={() => handleUpdateQuestion(q.id, { correctAnswer: opt })}
                            className="w-4 h-4 text-[#0071e3] focus:ring-[#0071e3]"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(q.options || [])];
                              newOpts[optIndex] = e.target.value;
                              handleUpdateQuestion(q.id, { 
                                options: newOpts,
                                correctAnswer: q.correctAnswer === opt ? e.target.value : q.correctAnswer 
                              });
                            }}
                            className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rubric for Non-MCQ */}
                {q.type !== 'multiple_choice' && (
                  <div className="space-y-3 bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center gap-2 text-[#28a745]">
                      <Sparkles className="w-4 h-4 text-[#34c759]" />
                      <span className="text-xs font-bold text-[#1d1d1f]">Talent IQ AI Rubric Configuration</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#515154]">
                        Expected Technical Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(q.expectedKeywords || []).join(', ')}
                        onChange={(e) => {
                          const kws = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          handleUpdateQuestion(q.id, { expectedKeywords: kws });
                        }}
                        placeholder="e.g. amortized, geometric doubling, constant time, worst case"
                        className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#515154]">
                        Model Answer Benchmark
                      </label>
                      <textarea
                        rows={2}
                        value={q.modelAnswer || ''}
                        onChange={(e) => handleUpdateQuestion(q.id, { modelAnswer: e.target.value })}
                        placeholder="Benchmark answer against which student explanations will be scored..."
                        className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Proctoring Settings */}
      {activeTab === 'proctoring' && (
        <div className="apple-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#ff9500]" />
              <span>Proctoring & Integrity Parameters</span>
            </h3>
            <p className="text-xs text-[#86868b]">
              Configure browser lockdown tolerance and audit trail settings
            </p>
          </div>

          <div className="space-y-4 divide-y divide-black/[0.05]">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#1d1d1f]">Active Tab Switch Detection</div>
                <div className="text-[11px] text-[#86868b]">
                  Logs moment student switches away from the examination tab with timestamp and duration
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tabSwitchDetection}
                  onChange={(e) => setTabSwitchDetection(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/[0.12] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34c759]"></div>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#1d1d1f]">Mandatory Fullscreen Mode</div>
                <div className="text-[11px] text-[#86868b]">
                  Requests fullscreen on start and records warnings when student exits fullscreen
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={fullscreenRequired}
                  onChange={(e) => setFullscreenRequired(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/[0.12] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34c759]"></div>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#1d1d1f]">Maximum Tab Switches Before Review Flag</div>
                <div className="text-[11px] text-[#86868b]">
                  Tolerance threshold before the attempt is flagged for faculty review
                </div>
              </div>
              <select
                value={maxTabSwitchesAllowed}
                onChange={(e) => setMaxTabSwitchesAllowed(Number(e.target.value))}
                className="bg-[#f5f5f7] border border-black/[0.08] rounded-full px-4 py-1.5 text-xs text-[#1d1d1f] font-mono font-medium"
              >
                <option value={1}>1 switch (Strict)</option>
                <option value={2}>2 switches (Standard)</option>
                <option value={3}>3 switches (Tolerant)</option>
                <option value={5}>5 switches (Lenient)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Live Paper Preview */}
      {activeTab === 'preview' && (
        <div className="apple-card p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="text-center pb-6 border-b border-black/[0.05] space-y-1">
            <span className="text-[11px] font-mono uppercase text-[#0071e3] font-semibold">
              {faculty.collegeName} · Autonomous Examination Paper
            </span>
            <h2 className="text-xl font-bold text-[#1d1d1f]">{title || 'Untitled Examination'}</h2>
            <div className="text-xs text-[#86868b] flex items-center justify-center gap-4 mt-2 font-mono">
              <span>Subject: {subject}</span>
              <span>•</span>
              <span>Duration: {durationMinutes} Mins</span>
              <span>•</span>
              <span>Total Marks: {totalCalculatedMarks}</span>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={q.id} className="space-y-2 border-b border-black/[0.04] pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-bold text-[#1d1d1f] flex gap-2">
                    <span className="text-[#0071e3]">{i + 1}.</span>
                    <span>{q.question}</span>
                  </div>
                  <span className="text-xs font-mono text-[#86868b] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full font-bold">
                    [{q.marks} Marks]
                  </span>
                </div>

                {q.scenario && (
                  <div className="bg-[#f5f5f7] p-3 rounded-xl border border-black/[0.04] text-xs text-[#515154] italic">
                    Scenario: {q.scenario}
                  </div>
                )}

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="bg-[#f5f5f7] p-2.5 rounded-xl border border-black/[0.04] text-xs text-[#1d1d1f] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white text-[#86868b] flex items-center justify-center font-mono text-[10px] font-bold shadow-xs">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveExam}
              className="apple-btn-primary px-6 py-2.5 text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Confirm & Publish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
