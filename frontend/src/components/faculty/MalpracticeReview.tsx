import React, { useState } from 'react';
import { StudentAttempt, ProctoringEvent } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Search, 
  Check, 
  X,
  FileSpreadsheet,
  Info
} from 'lucide-react';

interface MalpracticeReviewProps {
  attempts: StudentAttempt[];
  onBack: () => void;
  onOpenGoogleDriveHub: () => void;
}

export const MalpracticeReview: React.FC<MalpracticeReviewProps> = ({
  attempts,
  onBack,
  onOpenGoogleDriveHub
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'low' | 'medium' | 'high'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Cleared' | 'Flagged'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventModal, setSelectedEventModal] = useState<{ event: ProctoringEvent; attempt: StudentAttempt } | null>(null);
  const [facultyNotesInput, setFacultyNotesInput] = useState('');

  const allEvents: { event: ProctoringEvent; attempt: StudentAttempt }[] = [];
  attempts.forEach(a => {
    (a.proctoringEvents || []).forEach(e => {
      allEvents.push({ event: e, attempt: a });
    });
  });

  allEvents.sort((a, b) => new Date(b.event.timestamp).getTime() - new Date(a.event.timestamp).getTime());

  const filteredEvents = allEvents.filter(({ event, attempt }) => {
    const matchesSearch = attempt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          attempt.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || event.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || event.reviewStatus === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const pendingCount = allEvents.filter(e => e.event.reviewStatus === 'Pending').length;
  const flaggedCount = allEvents.filter(e => e.event.reviewStatus === 'Flagged').length;
  const clearedCount = allEvents.filter(e => e.event.reviewStatus === 'Cleared').length;

  const handleUpdateStatus = (
    attemptId: string, 
    eventId: string, 
    status: ProctoringEvent['reviewStatus'], 
    notes?: string
  ) => {
    StorageService.updateProctoringEventStatus(attemptId, eventId, status, notes);
    if (selectedEventModal && selectedEventModal.event.id === eventId) {
      setSelectedEventModal({
        ...selectedEventModal,
        event: {
          ...selectedEventModal.event,
          reviewStatus: status,
          facultyNotes: notes !== undefined ? notes : selectedEventModal.event.facultyNotes
        }
      });
    }
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
            <span>Open Proctoring Log in Sheets (Sheet 3)</span>
          </button>
        </div>
      </div>

      {/* Banner & Protocol Note */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#ff9500]/15 text-[#d97706] px-3 py-0.5 rounded-full font-bold">
              Malpractice Monitoring & Evidence Review
            </span>
            <span className="text-xs bg-black/[0.04] text-[#515154] px-2.5 py-0.5 rounded-full font-medium">
              Human-in-the-Loop Protocol
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            Proctoring Incident Center
          </h1>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Every browser tab switch, window blur, and fullscreen exit is logged with high-resolution timestamps. In accordance with Talent IQ standards, automated alerts are review flags and require faculty validation.
          </p>
        </div>

        {/* Counter cards */}
        <div className="flex items-center gap-3 font-mono">
          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-center min-w-[90px]">
            <span className="text-[10px] text-[#86868b] block font-semibold uppercase">Pending</span>
            <span className="text-2xl font-black text-[#ff9500]">{pendingCount}</span>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-center min-w-[90px]">
            <span className="text-[10px] text-[#86868b] block font-semibold uppercase">Cleared</span>
            <span className="text-2xl font-black text-[#28a745]">{clearedCount}</span>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-center min-w-[90px]">
            <span className="text-[10px] text-[#86868b] block font-semibold uppercase">Flagged</span>
            <span className="text-2xl font-black text-[#ff3b30]">{flaggedCount}</span>
          </div>
        </div>
      </div>

      {/* Fairness Guideline Box */}
      <div className="apple-card p-5 text-xs text-[#515154] flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#1d1d1f]">Institutional Fairness Guideline:</span>
          <p className="text-[#86868b] leading-relaxed text-[11px]">
            "Treat every event as a review flag, not an automatic accusation. Do not automatically reduce marks without faculty examination. Transient network blurs or OS notifications may cause brief loss of focus."
          </p>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
          <div>
            <h3 className="text-lg font-bold text-[#1d1d1f]">
              Recorded Incident Stream ({filteredEvents.length})
            </h3>
            <p className="text-xs text-[#86868b]">
              Live chronological log of proctoring alerts across all active student attempts
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="bg-[#f5f5f7] border border-black/[0.06] rounded-full px-4 py-2 text-xs text-[#1d1d1f] font-medium"
            >
              <option value="All">All Severities</option>
              <option value="low">Low Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="high">High Severity</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#f5f5f7] border border-black/[0.06] rounded-full px-4 py-2 text-xs text-[#1d1d1f] font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Cleared">Cleared</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Timestamp</th>
                <th className="py-3 px-4">Student Name & Roll No</th>
                <th className="py-3 px-4">Incident Type</th>
                <th className="py-3 px-4">Details / Duration</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-center">Review Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Faculty Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
              {filteredEvents.map(({ event, attempt }) => (
                <tr key={event.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#515154]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <span className="text-[10px] text-[#86868b] block">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1d1d1f]">{attempt.studentName}</div>
                    <div className="text-[10px] text-[#86868b] font-mono">{attempt.studentRollNo}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold bg-[#0071e3]/10 text-[#0071e3] px-2.5 py-0.5 rounded-full">
                      {event.eventType.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#515154] max-w-xs truncate">
                    {event.details}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      event.severity === 'high' ? 'bg-[#ff3b30]/15 text-[#ff3b30]' :
                      event.severity === 'medium' ? 'bg-[#ff9500]/15 text-[#d97706]' :
                      'bg-black/[0.05] text-[#86868b]'
                    }`}>
                      {event.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      event.reviewStatus === 'Cleared' ? 'bg-[#34c759]/15 text-[#28a745]' :
                      event.reviewStatus === 'Flagged' ? 'bg-[#ff3b30]/15 text-[#ff3b30]' :
                      'bg-[#ff9500]/15 text-[#d97706]'
                    }`}>
                      {event.reviewStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedEventModal({ event, attempt });
                          setFacultyNotesInput(event.facultyNotes || '');
                        }}
                        className="apple-btn-secondary px-3 py-1.5 text-xs font-semibold text-[#0071e3]"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(attempt.id, event.id, 'Cleared')}
                        title="Mark as Cleared"
                        className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#28a745] transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(attempt.id, event.id, 'Flagged')}
                        title="Flag for Disciplinary Committee"
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#ff3b30] transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-[#86868b]">
            <CheckCircle className="w-10 h-10 text-[#34c759] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1d1d1f]">No proctoring violations recorded.</p>
            <p className="text-xs text-[#86868b] mt-1">Examinations are adhering to strict integrity guidelines.</p>
          </div>
        )}
      </div>

      {/* Incident Detail Modal (Apple Sheet style) */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-8 space-y-6 shadow-2xl relative border border-black/[0.06]">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f] w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] bg-[#ff9500]/15 text-[#d97706] px-2.5 py-0.5 rounded-full font-mono font-bold">
                INCIDENT ID: {selectedEventModal.event.id}
              </span>
              <h2 className="text-xl font-bold text-[#1d1d1f] mt-1 tracking-tight">
                Proctoring Event Audit
              </h2>
              <p className="text-xs text-[#86868b]">
                Student: <strong>{selectedEventModal.attempt.studentName}</strong> ({selectedEventModal.attempt.studentRollNo})
              </p>
            </div>

            <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#86868b]">Event Type:</span>
                <span className="text-[#0071e3] font-bold">{selectedEventModal.event.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868b]">Timestamp:</span>
                <span className="text-[#1d1d1f]">{new Date(selectedEventModal.event.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868b]">Severity:</span>
                <span className="text-[#d97706] uppercase font-bold">{selectedEventModal.event.severity}</span>
              </div>
              <div className="pt-2 border-t border-black/[0.06] text-[#515154] font-sans leading-relaxed">
                <strong>Event Telemetry:</strong> {selectedEventModal.event.details}
              </div>
            </div>

            {/* Evidence Snapshot Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Restricted Camera Frame Evidence</span>
              </span>
              <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-center space-y-2">
                <div className="h-32 bg-white rounded-xl border border-black/[0.06] flex items-center justify-center text-[#86868b] text-xs">
                  <div className="space-y-1">
                    <ShieldAlert className="w-6 h-6 mx-auto text-[#ff9500]" />
                    <span className="font-medium text-[#1d1d1f]">Focus Blur Trigger Snapshot Captured</span>
                    <span className="text-[10px] text-[#86868b] block">Encrypted in Faculty Drive Vault</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Faculty Review Notes & Action Decision
              </label>
              <textarea
                rows={3}
                value={facultyNotesInput}
                onChange={(e) => setFacultyNotesInput(e.target.value)}
                placeholder="e.g. Verified with student: accidental trackpad gesture during question 4. No unauthorized materials visible. Cleared."
                className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedEventModal.attempt.id, selectedEventModal.event.id, 'Cleared', facultyNotesInput)}
                  className="bg-[#34c759] hover:bg-[#28a745] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  Clear Incident
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedEventModal.attempt.id, selectedEventModal.event.id, 'Flagged', facultyNotesInput)}
                  className="bg-[#ff3b30] hover:bg-[#d70015] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  Flag for Dean
                </button>
              </div>

              <button
                onClick={() => setSelectedEventModal(null)}
                className="text-xs text-[#86868b] hover:text-[#1d1d1f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
