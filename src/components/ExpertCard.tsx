import React from 'react';
import { Calendar, Clock, Star, Award, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Expert } from '../types';

interface ExpertCardProps {
  expert: Expert;
  matchScore?: number;
  matchReasons?: string[];
  isTopMatch?: boolean;
  onBook: (expert: Expert) => void;
  onViewProfile?: (expert: Expert) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
  expert,
  matchScore,
  matchReasons,
  isTopMatch,
  onBook,
  onViewProfile,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border transition-all ${
        isTopMatch
          ? 'border-emerald-800 shadow-sm ring-1 ring-emerald-800/20'
          : 'border-stone-200 hover:border-stone-300 shadow-xs'
      } flex flex-col justify-between overflow-hidden`}
    >
      <div className="p-5 md:p-6">
        
        {/* Top matching kicker (unboxed, clean typography) */}
        {matchScore && (
          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-emerald-800 font-mono-num">
                {matchScore}% Match
              </span>
              <span className="text-stone-300" aria-hidden="true">·</span>
              <span className="text-stone-600 font-medium">
                {isTopMatch ? 'Primary Field Specialist' : 'Qualified Specialist'}
              </span>
            </div>
            {isTopMatch && (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Top Recommendation
              </span>
            )}
          </div>
        )}

        {/* Header: Avatar, Name, Title */}
        <div className="flex items-start gap-4">
          <img
            src={expert.avatarUrl}
            alt={expert.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 md:w-16 md:md-16 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-100"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-stone-900 truncate">
                {expert.name}
              </h3>
              {expert.isVerified && (
                <span title="Verified Agricultural Specialist" className="inline-flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-stone-700 truncate">
              {expert.title}
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 flex-wrap">
              <span>{expert.institution}</span>
              <span aria-hidden="true">·</span>
              <span>{expert.experienceYears} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Why matched bullet points if present */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Why Matched For Your Issue:
            </p>
            <ul className="space-y-1">
              {matchReasons.map((reason, idx) => (
                <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Crop Proficiencies & Specialties */}
        <div className="mt-4 space-y-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Crop Focus
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-700 flex-wrap">
              {expert.crops.map((c, i) => (
                <React.Fragment key={c}>
                  {i > 0 && <span className="text-stone-300" aria-hidden="true">·</span>}
                  <span>{c}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Key Diagnostic Specialties
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-600 flex-wrap">
              {expert.specialties.slice(0, 3).map((spec, i) => (
                <React.Fragment key={spec}>
                  {i > 0 && <span className="text-stone-300" aria-hidden="true">·</span>}
                  <span>{spec}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bio summary */}
        <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {expert.bio}
        </p>

        {/* Rating and Available days */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-semibold text-stone-900 font-mono-num">{expert.rating.toFixed(2)}</span>
            <span className="text-stone-400">({expert.reviewsCount} reviews)</span>
          </div>

          <div className="flex items-center gap-1 text-stone-500">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Next: {expert.availableDays[0]} ({expert.timeSlots[0]})</span>
          </div>
        </div>

      </div>

      {/* Card Footer: Consultation Fee & Booking CTA */}
      <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-stone-500 block leading-tight">
            Consultation Fee (Set by expert)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-stone-900 font-mono-num">
              ${expert.fee}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              USD / 30-min
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onBook(expert)}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Book Appointment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
