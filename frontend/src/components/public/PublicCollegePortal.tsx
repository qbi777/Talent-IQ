import React, { useState } from 'react';
import { College, DistrictName } from '../../types';
import { TamilNaduMap } from './TamilNaduMap';
import { 
  Building2, 
  MapPin, 
  Award, 
  Users, 
  Search, 
  ExternalLink, 
  TrendingUp,
  ShieldCheck,
  Info,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PublicCollegePortalProps {
  colleges: College[];
  onOpenFacultyDemo: (collegeId: string) => void;
  onOpenStudentExam: () => void;
}

export const PublicCollegePortal: React.FC<PublicCollegePortalProps> = ({
  colleges,
  onOpenFacultyDemo,
  onOpenStudentExam
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [accreditationFilter, setAccreditationFilter] = useState<string>('All');
  const [selectedCollegeModal, setSelectedCollegeModal] = useState<College | null>(null);

  // Filter colleges based on district, search, and accreditation
  const filteredColleges = colleges.filter(college => {
    const matchesDistrict = selectedDistrict === 'All' || college.district === selectedDistrict;
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          college.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccreditation = accreditationFilter === 'All' || college.naacGrade === accreditationFilter;
    return matchesDistrict && matchesSearch && matchesAccreditation;
  });

  const leaderboard = [...colleges]
    .filter(c => c.participatingInPublicRankings)
    .sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Hero Section (Apple Keynote Aesthetic) */}
        <div className="relative rounded-[32px] bg-gradient-to-b from-[#ffffff] to-[#fafafc] border border-black/[0.06] p-8 sm:p-14 shadow-sm overflow-hidden text-center max-w-5xl mx-auto">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#0071e3]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-black/[0.04] text-[#1d1d1f] px-3.5 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Talent IQ · Higher Education Assessment</span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-[#1d1d1f] leading-tight font-sans">
              Statewide Assessment.<br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0071e3] to-[#5856d6] bg-clip-text text-transparent">
                Engineered for Integrity.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto font-normal">
              Standardized examination intelligence, AI rubric grading, and inter-collegiate benchmarks across Tamil Nadu's leading autonomous colleges.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSelectedDistrict('All')}
                className="apple-btn-primary px-6 py-3 text-sm font-semibold shadow-md flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore Tamil Nadu Map</span>
              </button>

              <button
                onClick={onOpenStudentExam}
                className="apple-btn-secondary px-6 py-3 text-sm font-semibold flex items-center gap-2"
              >
                <span>Take a Test as Student</span>
                <ChevronRight className="w-4 h-4 text-[#86868b]" />
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="mt-12 pt-8 border-t border-black/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-mono tracking-tight">13+</div>
              <div className="text-xs text-[#86868b] mt-0.5">Districts Mapped</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-mono tracking-tight">12</div>
              <div className="text-xs text-[#86868b] mt-0.5">Premier Colleges</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-mono tracking-tight">22,400+</div>
              <div className="text-xs text-[#86868b] mt-0.5">Students Assessed</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#0071e3] font-mono tracking-tight">83.2%</div>
              <div className="text-xs text-[#86868b] mt-0.5">State Average</div>
            </div>
          </div>
        </div>

        {/* Section 1: Tamil Nadu Map */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
                Tamil Nadu District Explorer
              </h2>
              <p className="text-xs sm:text-sm text-[#86868b]">
                Select any district to inspect participating engineering institutions and autonomous clusters
              </p>
            </div>
            {selectedDistrict !== 'All' && (
              <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-3.5 py-1.5 rounded-full font-semibold">
                District: {selectedDistrict}
              </span>
            )}
          </div>

          <TamilNaduMap
            colleges={colleges}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
            onSelectCollege={(c) => setSelectedCollegeModal(c)}
          />
        </section>

        {/* Section 2: College Directory & Filter */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                <span>Participating Colleges</span>
                <span className="text-xs bg-black/[0.05] text-[#86868b] px-2.5 py-0.5 rounded-full font-mono">
                  {filteredColleges.length}
                </span>
              </h3>
              <p className="text-xs text-[#86868b]">
                Verified higher education profiles with standardized evaluation metrics
              </p>
            </div>

            {/* Apple Style Search & Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search college, city, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 shadow-sm"
                />
              </div>

              <select
                value={accreditationFilter}
                onChange={(e) => setAccreditationFilter(e.target.value)}
                className="bg-white border border-black/[0.08] rounded-full px-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 shadow-sm font-medium"
              >
                <option value="All">All NAAC Grades</option>
                <option value="A++">NAAC A++</option>
                <option value="A+">NAAC A+</option>
                <option value="A">NAAC A</option>
              </select>
            </div>
          </div>

          {/* College Cards Grid (Apple App Store / Product Card style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredColleges.map((college) => (
              <div
                key={college.id}
                onClick={() => setSelectedCollegeModal(college)}
                className="apple-card p-6 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-semibold bg-black/[0.04] text-[#86868b] px-2 py-0.5 rounded-md">
                        Code: {college.code}
                      </span>
                      <h4 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors mt-1.5 leading-snug">
                        {college.name}
                      </h4>
                      <p className="text-xs text-[#86868b] flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
                        <span>{college.city} · {college.district}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block bg-[#34c759]/10 text-[#28a745] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                        {college.naacGrade}
                      </span>
                      {college.nirfRank && (
                        <div className="text-[10px] text-[#86868b] mt-1 font-mono">
                          NIRF #{college.nirfRank}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Departments chip list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {college.departments.slice(0, 3).map((dept, i) => (
                      <span key={i} className="text-[10px] bg-black/[0.04] text-[#515154] px-2.5 py-0.5 rounded-full font-medium">
                        {dept}
                      </span>
                    ))}
                    {college.departments.length > 3 && (
                      <span className="text-[10px] bg-black/[0.04] text-[#86868b] px-2 py-0.5 rounded-full font-medium">
                        +{college.departments.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="mt-5 pt-3.5 border-t border-black/[0.05] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Avg Score</span>
                    <span className="font-bold text-[#0071e3] font-mono text-sm">{college.averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Assessed</span>
                    <span className="font-bold text-[#1d1d1f] font-mono text-sm">{college.totalStudentsAssessed.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Type</span>
                    <span className="text-[#515154] font-medium text-[11px]">{college.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="apple-card p-12 text-center text-[#86868b]">
              <Building2 className="w-10 h-10 text-black/20 mx-auto mb-3" />
              <p className="text-sm font-medium">No institutions found matching your filter in {selectedDistrict}.</p>
              <button 
                onClick={() => { setSelectedDistrict('All'); setSearchQuery(''); setAccreditationFilter('All'); }}
                className="mt-3 text-xs text-[#0071e3] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Section 3: State Institutional Leaderboard */}
        <section className="apple-card p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/[0.05]">
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#34c759]" />
                <span>Statewide Inter-Collegiate Benchmark</span>
              </h3>
              <p className="text-xs text-[#86868b]">
                Verified performance under standardized Talent IQ assessment protocols
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#d97706] bg-[#ff9500]/10 px-3.5 py-1.5 rounded-full font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#ff9500] shrink-0" />
              <span>Consensual Ranking Protocol</span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-[#f5f5f7] rounded-2xl p-4 text-xs text-[#515154] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-[#1d1d1f]">Institutional Privacy & Benchmarking Standards:</span>
              <p className="text-[#86868b] leading-relaxed text-[11px]">
                Rankings represent standardized assessments conducted under Talent IQ proctoring. Only institutions consenting to public performance comparison are displayed. Student identities and individual raw marks are protected.
              </p>
            </div>
          </div>

          {/* Leaderboard Table (Apple Health / Settings style) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f5f7] text-[#86868b] uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Rank</th>
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Type & NAAC</th>
                  <th className="py-3 px-4 text-center">Students Assessed</th>
                  <th className="py-3 px-4 text-right">Standardized Avg</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-[#1d1d1f]">
                {leaderboard.map((item, index) => (
                  <tr key={item.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {index === 0 && <span className="text-[#ff9500] font-black text-sm">🥇 #1</span>}
                      {index === 1 && <span className="text-[#86868b] font-black text-sm">🥈 #2</span>}
                      {index === 2 && <span className="text-[#d97706] font-black text-sm">🥉 #3</span>}
                      {index > 2 && <span className="text-[#86868b]">#{index + 1}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1d1d1f]">{item.name}</div>
                      <div className="text-[10px] text-[#86868b] font-mono">TNEA Code: {item.code}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#515154]">
                      {item.district}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-black/[0.04] text-[#515154] px-2 py-0.5 rounded-full font-mono mr-1.5">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-bold text-[#34c759]">
                        {item.naacGrade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#515154]">
                      {item.totalStudentsAssessed.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0071e3] text-sm">
                      {item.averageScore}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedCollegeModal(item)}
                        className="text-xs text-[#0071e3] hover:text-[#0077ED] font-semibold hover:underline"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* College Profile Modal (Apple Sheet style) */}
      {selectedCollegeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 border border-black/[0.06]">
            <button
              onClick={() => setSelectedCollegeModal(null)}
              className="absolute top-6 right-6 text-[#86868b] hover:text-[#1d1d1f] w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-3 py-0.5 rounded-full font-mono font-semibold">
                  {selectedCollegeModal.id} · TNEA {selectedCollegeModal.code}
                </span>
                <span className="text-xs bg-[#34c759]/10 text-[#28a745] px-3 py-0.5 rounded-full font-bold">
                  NAAC {selectedCollegeModal.naacGrade}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                {selectedCollegeModal.name}
              </h3>
              <p className="text-xs text-[#86868b] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedCollegeModal.city}, {selectedCollegeModal.district} District</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-[#f5f5f7] rounded-2xl text-center">
              <div>
                <span className="text-[10px] text-[#86868b] block uppercase font-semibold">Overall Benchmark</span>
                <span className="text-xl font-bold text-[#0071e3] font-mono">{selectedCollegeModal.averageScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-[#86868b] block uppercase font-semibold">Assessed Students</span>
                <span className="text-xl font-bold text-[#1d1d1f] font-mono">{selectedCollegeModal.totalStudentsAssessed}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#86868b] block uppercase font-semibold">Founded</span>
                <span className="text-xl font-bold text-[#1d1d1f] font-mono">{selectedCollegeModal.established}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#86868b] block uppercase tracking-wider">
                Engineering & Technology Departments
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCollegeModal.departments.map((dept, i) => (
                  <span key={i} className="text-xs bg-[#f5f5f7] text-[#1d1d1f] px-3 py-1.5 rounded-full font-medium border border-black/[0.04]">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
              <a
                href={selectedCollegeModal.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setSelectedCollegeModal(null);
                  onOpenFacultyDemo(selectedCollegeModal.id);
                }}
                className="apple-btn-primary px-5 py-2.5 text-xs font-semibold shadow-sm"
              >
                Open Faculty Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
