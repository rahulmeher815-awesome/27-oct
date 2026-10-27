import React from 'react';
import { Sprout, UserCheck, ShieldCheck, RefreshCw, Calendar, MessageSquare, BookOpen, User } from 'lucide-react';
import { UserRole, Expert } from '../types';

interface NavbarProps {
  currentTab: 'diagnose' | 'experts' | 'my-bookings' | 'how-it-works';
  setCurrentTab: (tab: 'diagnose' | 'experts' | 'my-bookings' | 'how-it-works') => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeExpert: Expert;
  activeAppointmentsCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  role,
  setRole,
  activeExpert,
  activeAppointmentsCount,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div 
            onClick={() => setCurrentTab('diagnose')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                AgriConnect
              </span>
              <span className="text-[11px] text-stone-500 font-medium tracking-wide">
                Crop Health & Expert Advisory
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line unboxed text) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            {role === 'farmer' ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentTab('diagnose')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap cursor-pointer ${
                    currentTab === 'diagnose' ? 'text-emerald-800 font-semibold underline underline-offset-8 decoration-2 decoration-emerald-800' : ''
                  }`}
                >
                  Diagnose Problem
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('experts')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap cursor-pointer ${
                    currentTab === 'experts' ? 'text-emerald-800 font-semibold underline underline-offset-8 decoration-2 decoration-emerald-800' : ''
                  }`}
                >
                  Browse Experts
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('my-bookings')}
                  className={`flex items-center gap-1.5 hover:text-emerald-800 transition-colors whitespace-nowrap cursor-pointer ${
                    currentTab === 'my-bookings' ? 'text-emerald-800 font-semibold underline underline-offset-8 decoration-2 decoration-emerald-800' : ''
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Consultations</span>
                  {activeAppointmentsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[11px] font-mono-num font-semibold bg-emerald-100 text-emerald-800 rounded-sm">
                      {activeAppointmentsCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentTab('experts')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap cursor-pointer ${
                    currentTab === 'experts' ? 'text-emerald-800 font-semibold underline underline-offset-8 decoration-2 decoration-emerald-800' : ''
                  }`}
                >
                  Consultation Queue & Messages
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('diagnose')}
                  className={`hover:text-emerald-800 transition-colors whitespace-nowrap cursor-pointer ${
                    currentTab === 'diagnose' ? 'text-emerald-800 font-semibold underline underline-offset-8 decoration-2 decoration-emerald-800' : ''
                  }`}
                >
                  Diagnostic Simulator
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('how-it-works')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'how-it-works' ? 'text-emerald-800 font-semibold underline underline-offset-8 decoration-2 decoration-emerald-800' : ''
              }`}
            >
              How It Works
            </button>
          </nav>

          {/* Zone 3: Interactive Role Switcher & Status */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  role === 'farmer'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to Farmer View"
              >
                <User className="w-3.5 h-3.5" />
                <span>Farmer View</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('expert')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  role === 'expert'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to Expert View"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Expert View</span>
              </button>
            </div>

            {/* Quick Reset Data for testing */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
