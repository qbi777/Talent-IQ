import React, { useState } from 'react';
import { College, FacultyUser, DistrictName } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Building2, 
  Users, 
  Plus, 
  ShieldCheck, 
  CheckCircle, 
  Server,
  X
} from 'lucide-react';

interface SuperAdminPanelProps {
  colleges: College[];
  faculty: FacultyUser[];
  onSelectFacultyLogin: (facultyId: string) => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({
  colleges,
  faculty,
  onSelectFacultyLogin
}) => {
  const [activeTab, setActiveTab] = useState<'colleges' | 'faculty' | 'system'>('colleges');
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);

  // New College Form State
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeCode, setNewCollegeCode] = useState('');
  const [newCollegeDistrict, setNewCollegeDistrict] = useState<DistrictName>('Chennai');
  const [newCollegeCity, setNewCollegeCity] = useState('');
  const [newCollegeType, setNewCollegeType] = useState<College['type']>('Autonomous');
  const [newCollegeNaac, setNewCollegeNaac] = useState<College['naacGrade']>('A++');
  const [newCollegePublicConsent, setNewCollegePublicConsent] = useState(true);

  // New Faculty Form State
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyCollegeId, setNewFacultyCollegeId] = useState(colleges[0]?.id || '');
  const [newFacultyDept, setNewFacultyDept] = useState('Computer Science & Engineering');
  const [newFacultyDesignation, setNewFacultyDesignation] = useState('Associate Professor');

  const handleCreateCollege = () => {
    if (!newCollegeName.trim() || !newCollegeCode.trim()) {
      alert('Please fill in College Name and Code.');
      return;
    }

    StorageService.addCollege({
      name: newCollegeName.trim(),
      code: newCollegeCode.trim(),
      district: newCollegeDistrict,
      city: newCollegeCity.trim() || `${newCollegeDistrict}, Tamil Nadu`,
      established: 2001,
      type: newCollegeType,
      naacGrade: newCollegeNaac,
      website: 'https://example-college.edu.in',
      participatingInPublicRankings: newCollegePublicConsent,
      departments: ['Computer Science', 'Information Technology', 'ECE', 'Mechanical']
    });

    setShowAddCollegeModal(false);
    setNewCollegeName('');
    setNewCollegeCode('');
  };

  const handleCreateFaculty = () => {
    if (!newFacultyName.trim() || !newFacultyEmail.trim()) {
      alert('Please fill in Faculty Name and Email.');
      return;
    }

    const assignedCollege = colleges.find(c => c.id === newFacultyCollegeId) || colleges[0];

    StorageService.addFaculty({
      collegeId: assignedCollege.id,
      collegeName: assignedCollege.name,
      name: newFacultyName.trim(),
      email: newFacultyEmail.trim(),
      department: newFacultyDept.trim(),
      designation: newFacultyDesignation.trim(),
      googleDriveConnected: false,
      status: 'Active'
    });

    setShowAddFacultyModal(false);
    setNewFacultyName('');
    setNewFacultyEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Super Admin Header (Apple System Settings look) */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#5856d6]/10 text-[#5856d6] px-3 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Talent IQ Platform Administration
            </span>
            <span className="text-xs bg-black/[0.04] text-[#515154] px-2.5 py-0.5 rounded-full font-medium">
              Multi-Tenant Security Console
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            Institutional Access & Tenant Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-2xl leading-relaxed">
            Provision colleges with unique system IDs (COL001, COL002), manage faculty accounts, audit multi-tenant data isolation, and manage public ranking consents for Talent IQ.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-center min-w-[95px]">
            <span className="text-[10px] text-[#86868b] block font-semibold uppercase">Colleges</span>
            <span className="text-2xl font-black text-[#1d1d1f]">{colleges.length}</span>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04] text-center min-w-[95px]">
            <span className="text-[10px] text-[#86868b] block font-semibold uppercase">Faculty</span>
            <span className="text-2xl font-black text-[#0071e3]">{faculty.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Segmented Tabs */}
      <div className="apple-segmented-container flex p-1 text-xs max-w-xl">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'colleges'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Colleges ({colleges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'faculty'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Faculty ({faculty.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-full transition-all ${
            activeTab === 'system'
              ? 'apple-segmented-item-active'
              : 'text-[#515154] hover:text-[#1d1d1f]'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Tenant Audit</span>
        </button>
      </div>

      {/* TAB 1: COLLEGES */}
      {activeTab === 'colleges' && (
        <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                Registered Institutions
              </h3>
              <p className="text-xs text-[#86868b]">
                Auto-assigned unique College IDs (COL001, COL002...) with strict tenant boundary enforcement
              </p>
            </div>

            <button
              onClick={() => setShowAddCollegeModal(true)}
              className="apple-btn-primary px-5 py-2.5 text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register College</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">College ID</th>
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Type & NAAC</th>
                  <th className="py-3 px-4 text-center">Faculty Accounts</th>
                  <th className="py-3 px-4 text-center">Public Ranking</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
                {colleges.map((c) => {
                  const facultyCount = faculty.filter(f => f.collegeId === c.id).length;

                  return (
                    <tr key={c.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1d1d1f] text-sm">{c.name}</div>
                        <div className="text-[10px] text-[#86868b] font-mono">TNEA Code: {c.code} · {c.city}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#515154] font-medium">
                        {c.district}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] bg-black/[0.04] text-[#515154] px-2 py-0.5 rounded-full font-mono mr-1.5">
                          {c.type}
                        </span>
                        <span className="text-[10px] font-bold text-[#28a745]">
                          {c.naacGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="font-bold text-[#1d1d1f]">{facultyCount}</span> accounts
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          c.participatingInPublicRankings 
                            ? 'bg-[#34c759]/15 text-[#28a745]' 
                            : 'bg-black/[0.04] text-[#86868b]'
                        }`}>
                          {c.participatingInPublicRankings ? 'Consented' : 'Private'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="text-[#28a745] font-bold">Active</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY */}
      {activeTab === 'faculty' && (
        <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                Faculty Credentials & Department Assignments
              </h3>
              <p className="text-xs text-[#86868b]">
                Assigned unique Faculty IDs (FAC001, FAC002...) with individual Google Drive token bindings
              </p>
            </div>

            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="apple-btn-primary px-5 py-2.5 text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Faculty Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Faculty ID</th>
                  <th className="py-3 px-4">Faculty Name & Email</th>
                  <th className="py-3 px-4">Assigned College</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4 text-center">Google Drive</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Switch As Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
                {faculty.map((f) => (
                  <tr key={f.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">
                      {f.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1d1d1f] text-sm">{f.name}</div>
                      <div className="text-[10px] text-[#86868b] font-mono">{f.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#515154] font-medium">
                      {f.collegeName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#1d1d1f] font-medium">{f.department}</div>
                      <div className="text-[10px] text-[#86868b]">{f.designation}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        f.googleDriveConnected ? 'bg-[#34c759]/15 text-[#28a745]' : 'bg-[#ff9500]/15 text-[#d97706]'
                      }`}>
                        {f.googleDriveConnected ? 'Linked' : 'Not Linked'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectFacultyLogin(f.id)}
                        className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold text-[#0071e3]"
                      >
                        Launch Portal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT */}
      {activeTab === 'system' && (
        <div className="apple-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-black/[0.05]">
            <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
              <Server className="w-5 h-5 text-[#34c759]" />
              <span>Multi-Tenant Isolation Architecture (Section 18)</span>
            </h3>
            <p className="text-xs text-[#86868b]">
              Technical rules enforced on PostgreSQL query layers, Google OAuth bindings, and exam access tokens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-2">
              <div className="flex items-center gap-2 text-[#28a745] font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Tenant Isolation</span>
              </div>
              <p className="text-[11px] text-[#515154] leading-relaxed">
                Every examination record requires a verified Foreign Key link to College ID and Faculty ID. Cross-faculty ID tampering is blocked at the data access layer.
              </p>
            </div>

            <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-2">
              <div className="flex items-center gap-2 text-[#28a745] font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Faculty-Owned Google Drive</span>
              </div>
              <p className="text-[11px] text-[#515154] leading-relaxed">
                FAC001's tokens are strictly isolated from FAC002. Generated Google Docs and Sheets never pool into a shared administrator Google account.
              </p>
            </div>

            <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-2">
              <div className="flex items-center gap-2 text-[#28a745] font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Student Attempt Integrity</span>
              </div>
              <p className="text-[11px] text-[#515154] leading-relaxed">
                Unguessable exam hashes (`EXM-TN8F29K`), roll number uniqueness validation, and server-side evaluation prevent duplicate submissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New College */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-8 space-y-5 shadow-2xl relative border border-black/[0.06]">
            <button
              onClick={() => setShowAddCollegeModal(false)}
              className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f] w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
              Register Institution
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#1d1d1f]">College Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore Institute of Technology"
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1d1d1f]">TNEA / Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. 2007"
                    value={newCollegeCode}
                    onChange={(e) => setNewCollegeCode(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1d1d1f]">District *</label>
                  <select
                    value={newCollegeDistrict}
                    onChange={(e) => setNewCollegeDistrict(e.target.value as DistrictName)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Tiruchirappalli">Tiruchirappalli</option>
                    <option value="Salem">Salem</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Thoothukudi">Thoothukudi</option>
                    <option value="Kanyakumari">Kanyakumari</option>
                    <option value="Vellore">Vellore</option>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Erode">Erode</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1d1d1f]">Type</label>
                  <select
                    value={newCollegeType}
                    onChange={(e) => setNewCollegeType(e.target.value as any)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="Autonomous">Autonomous</option>
                    <option value="Government">Government</option>
                    <option value="Deemed University">Deemed University</option>
                    <option value="Self-Financing">Self-Financing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1d1d1f]">NAAC Grade</label>
                  <select
                    value={newCollegeNaac}
                    onChange={(e) => setNewCollegeNaac(e.target.value as any)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f] font-medium"
                  >
                    <option value="A++">A++</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B++">B++</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#1d1d1f]">
                  <input
                    type="checkbox"
                    checked={newCollegePublicConsent}
                    onChange={(e) => setNewCollegePublicConsent(e.target.checked)}
                    className="w-4 h-4 text-[#0071e3] rounded bg-white border-black/[0.2]"
                  />
                  <span>Opt-in to Talent IQ Statewide Public Benchmark</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex justify-end gap-2">
              <button
                onClick={() => setShowAddCollegeModal(false)}
                className="text-xs text-[#86868b] hover:text-[#1d1d1f] px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollege}
                className="apple-btn-primary px-5 py-2.5 text-xs font-semibold shadow-sm"
              >
                Create College & Assign ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Faculty */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-8 space-y-5 shadow-2xl relative border border-black/[0.06]">
            <button
              onClick={() => setShowAddFacultyModal(false)}
              className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f] w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
              Create Faculty Account
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#1d1d1f]">Assign to College *</label>
                <select
                  value={newFacultyCollegeId}
                  onChange={(e) => setNewFacultyCollegeId(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f] font-medium"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1d1d1f]">Faculty Name & Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. R. Muthukumar, Ph.D."
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1d1d1f]">Institutional Email *</label>
                <input
                  type="email"
                  placeholder="muthukumar.r@college.edu.in"
                  value={newFacultyEmail}
                  onChange={(e) => setNewFacultyEmail(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1d1d1f]">Department</label>
                  <input
                    type="text"
                    value={newFacultyDept}
                    onChange={(e) => setNewFacultyDept(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1d1d1f]">Designation</label>
                  <input
                    type="text"
                    value={newFacultyDesignation}
                    onChange={(e) => setNewFacultyDesignation(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-black/[0.08] rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex justify-end gap-2">
              <button
                onClick={() => setShowAddFacultyModal(false)}
                className="text-xs text-[#86868b] hover:text-[#1d1d1f] px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFaculty}
                className="apple-btn-primary px-5 py-2.5 text-xs font-semibold shadow-sm"
              >
                Generate ID & Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
