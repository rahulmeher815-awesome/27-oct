import React from 'react';
import { Calendar, Clock, DollarSign, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Appointment, Expert } from '../types';

interface FarmerConsultationsListProps {
  appointments: Appointment[];
  experts: Expert[];
  onOpenChat: (apt: Appointment) => void;
  onNewConsultation: () => void;
}

export const FarmerConsultationsList: React.FC<FarmerConsultationsListProps> = ({
  appointments,
  experts,
  onOpenChat,
  onNewConsultation,
}) => {
  const getExpert = (expertId: string) => experts.find(e => e.id === expertId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            My Booked Consultations
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Track your appointments with agricultural doctors, review diagnoses, and continue chat consultations.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewConsultation}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Report New Crop Problem</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800">No Consultations Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You have not booked any agricultural consultations yet. Describe your crop problem to match with a specialist.
          </p>
          <button
            type="button"
            onClick={onNewConsultation}
            className="mt-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Start Crop Diagnosis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((apt) => {
            const expert = getExpert(apt.expertId);
            return (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 p-5 md:p-6 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Expert & Appointment Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={expert?.avatarUrl || '/src/assets/images/expert_portrait_agronomist_1793084096093.jpg'}
                    alt={expert?.name || 'Expert'}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-stone-900">
                        {expert?.name || 'Crop Specialist'}
                      </h4>
                      <span className="text-stone-300" aria-hidden="true">·</span>
                      <span className="text-xs font-semibold text-emerald-800">
                        {apt.crop} Diagnosis
                      </span>
                      <span className="text-stone-300" aria-hidden="true">·</span>
                      <span className="text-[11px] font-mono-num uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-stone-600">
                      {expert?.title} · {expert?.institution}
                    </p>

                    <p className="text-xs text-stone-700 line-clamp-1 max-w-xl">
                      <span className="font-semibold text-stone-800">Issue:</span> {apt.problemDescription}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-stone-500 font-mono-num pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{apt.date}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{apt.timeSlot}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                        <span>${apt.feePaid} USD Paid</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Chat CTA */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => onOpenChat(apt)}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Consultation Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
