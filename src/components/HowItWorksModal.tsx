import React from 'react';
import { X, Sprout, ShieldCheck, Calendar, MessageSquare, DollarSign, Github, Terminal, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDiagnose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartDiagnose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Sprout className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                How AgriConnect Works
              </h3>
              <p className="text-xs text-stone-500">
                Farmer & Expert Agricultural Consultation Workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Step-by-Step Flow */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Platform Workflow Steps
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <div className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-mono-num">
                  1
                </div>
                <h5 className="text-xs font-bold text-stone-900">
                  Farmer Enters Crop Problem
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter your crop (e.g., Banana, Tomato) and describe symptoms like "yellowing in banana leaves with brown streaks".
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <div className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-mono-num">
                  2
                </div>
                <h5 className="text-xs font-bold text-stone-900">
                  Experts Suggested by Field
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The matching engine ranks agricultural doctors whose documented specialties directly cover your pathogen and crop.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <div className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-mono-num">
                  3
                </div>
                <h5 className="text-xs font-bold text-stone-900">
                  Book by Schedule & Fee
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Consultation fees are set transparently by each expert. Pick an available date and time slot from their active calendar.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <div className="w-7 h-7 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-mono-num">
                  4
                </div>
                <h5 className="text-xs font-bold text-stone-900">
                  Chat & Receive Prescriptions
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter the consultation room to chat directly, ask follow-up questions, and receive step-by-step treatment prescriptions.
                </p>
              </div>

            </div>
          </div>

          {/* Dual Role Testing Note */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Testing Both Farmer & Expert Views</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Use the top-right role switcher to switch between <strong>Farmer View</strong> and <strong>Expert View</strong>. In Expert View, you can customize your consultation fee, update your expertise tags, and reply to farmer cases in real time.
            </p>
          </div>

          {/* GitHub Upload & Hosting Guide */}
          <div className="p-4 bg-stone-900 text-white rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
              <Github className="w-4 h-4 text-emerald-400" />
              <span>Ready for GitHub & Zero-Config Deployment</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              This repository is structured cleanly with Vite, React, and Tailwind CSS. All data persists safely in local browser storage so it works standalone anywhere.
            </p>
            <div className="bg-stone-950 p-3 rounded-lg font-mono-num text-[11px] text-emerald-400 space-y-1">
              <div># 1. Clone your repo & install</div>
              <div className="text-stone-300">npm install</div>
              <div># 2. Run locally</div>
              <div className="text-stone-300">npm run dev</div>
              <div># 3. Build for static hosting (GitHub Pages / Vercel)</div>
              <div className="text-stone-300">npm run build</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartDiagnose();
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Try Farmer Diagnosis Now
          </button>
        </div>

      </div>
    </div>
  );
};
