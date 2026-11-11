import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  Cloud, 
  RotateCcw,
  Check
} from 'lucide-react';
import { UserRole } from '../types';
import { StorageService } from '../services/storage';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeExamId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, activeExamId }) => {
  const currentFaculty = StorageService.getCurrentFaculty();
  const colleges = StorageService.getColleges();
  const currentCollege = colleges.find(c => c.id === currentFaculty.collegeId) || colleges[0];

  const handleResetData = () => {
    if (window.confirm('Reset all demo colleges, faculty, examinations, and student attempts back to initial state?')) {
      StorageService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06] text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Apple Sub-Navbar Ribbon */}
      <div className="bg-[#f5f5f7]/90 border-b border-black/[0.04] px-4 sm:px-8 py-1.5 text-[11px] text-[#86868b] flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1d1d1f] tracking-tight">Talent IQ</span>
          <span>·</span>
          <span className="hidden sm:inline">Institutional Examination & Assessment SaaS</span>
          <span className="hidden md:inline">· Anna University & Autonomous Network</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full ${currentFaculty.googleDriveConnected ? 'bg-[#34c759]' : 'bg-[#ff9500]'}`} />
            <span className={currentFaculty.googleDriveConnected ? 'text-[#1d1d1f]' : 'text-[#86868b]'}>
              Drive {currentFaculty.googleDriveConnected ? 'Synced' : 'Offline'}
            </span>
          </div>

          <span className="text-black/10">|</span>

          <button 
            onClick={handleResetData}
            title="Reset platform demo data"
            className="flex items-center gap-1 hover:text-[#1d1d1f] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Apple Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => onRoleChange('public')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#5856d6] flex items-center justify-center shadow-[0_2px_10px_rgba(0,113,227,0.25)] text-white transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#1d1d1f]">
                Talent IQ
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-black/[0.05] text-[#86868b] px-1.5 py-0.2 rounded-md">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-[#86868b] leading-none hidden sm:block">
              Assessment Intelligence
            </p>
          </div>
        </div>

        {/* Apple Segmented Control for Role Switching */}
        <nav className="hidden md:flex items-center apple-segmented-container">
          <button
            onClick={() => onRoleChange('public')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all ${
              currentRole === 'public'
                ? 'apple-segmented-item-active'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>TN College Map</span>
          </button>

          <button
            onClick={() => onRoleChange('faculty')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all ${
              currentRole === 'faculty'
                ? 'apple-segmented-item-active'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Faculty Studio</span>
          </button>

          <button
            onClick={() => onRoleChange('student')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all ${
              currentRole === 'student'
                ? 'apple-segmented-item-active'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Portal</span>
            {activeExamId && (
              <span className="bg-[#0071e3] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                Live
              </span>
            )}
          </button>

          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all ${
              currentRole === 'admin'
                ? 'apple-segmented-item-active'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right Info: Current Faculty Context */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-end gap-1.5">
              <span>{currentFaculty.name}</span>
              <span className="text-[10px] bg-black/[0.05] text-[#86868b] px-1.5 py-0.2 rounded font-mono">
                {currentFaculty.id}
              </span>
            </div>
            <div className="text-[11px] text-[#86868b] truncate max-w-[210px]">
              {currentCollege.name}
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0071e3] to-[#5856d6] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
            {currentFaculty.name.split(' ').slice(1, 2)[0]?.[0] || 'F'}
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around bg-[#ffffff]/90 px-2 py-2 border-t border-black/[0.06] text-xs">
        <button
          onClick={() => onRoleChange('public')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-colors ${
            currentRole === 'public' ? 'text-[#0071e3] font-semibold bg-[#0071e3]/10' : 'text-[#86868b]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[10px]">Map</span>
        </button>
        <button
          onClick={() => onRoleChange('faculty')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-colors ${
            currentRole === 'faculty' ? 'text-[#0071e3] font-semibold bg-[#0071e3]/10' : 'text-[#86868b]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Faculty</span>
        </button>
        <button
          onClick={() => onRoleChange('student')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-colors ${
            currentRole === 'student' ? 'text-[#0071e3] font-semibold bg-[#0071e3]/10' : 'text-[#86868b]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[10px]">Student</span>
        </button>
        <button
          onClick={() => onRoleChange('admin')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-colors ${
            currentRole === 'admin' ? 'text-[#0071e3] font-semibold bg-[#0071e3]/10' : 'text-[#86868b]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px]">Admin</span>
        </button>
      </div>
    </header>
  );
};
