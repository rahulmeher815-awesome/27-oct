import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, SlidersHorizontal, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { Expert, AiDiagnosis } from '../types';
import { ExpertMatchResult } from '../utils/matchingEngine';
import { ExpertCard } from './ExpertCard';

interface MatchedExpertsSectionProps {
  crop: string;
  symptoms: string;
  matchResults: ExpertMatchResult[];
  diagnosis: AiDiagnosis;
  onBookExpert: (expert: Expert) => void;
  onModifyProblem: () => void;
}

export const MatchedExpertsSection: React.FC<MatchedExpertsSectionProps> = ({
  crop,
  symptoms,
  matchResults,
  diagnosis,
  onBookExpert,
  onModifyProblem,
}) => {
  const [sortBy, setSortBy] = useState<'match' | 'fee-asc' | 'fee-desc' | 'experience'>('match');

  const sortedResults = [...matchResults].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'fee-asc') return a.expert.fee - b.expert.fee;
    if (sortBy === 'fee-desc') return b.expert.fee - a.expert.fee;
    if (sortBy === 'experience') return b.expert.experienceYears - a.expert.experienceYears;
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Problem Summary & Diagnosis Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Diagnostic Assessment for {crop}</span>
            </div>
            <p className="text-xs text-stone-700">
              <strong className="text-stone-900">Observed Symptoms:</strong> "{symptoms}"
            </p>
          </div>

          <button
            type="button"
            onClick={onModifyProblem}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer self-start sm:self-center"
          >
            Modify Problem Details
          </button>
        </div>

        {/* Likely Causes & Immediate Advice */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Likely Pathogens / Deficiencies */}
          <div className="md:col-span-7 space-y-2.5">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
              Likely Identified Causes
            </span>
            <div className="space-y-2">
              {diagnosis.likelyCauses.map((cause, i) => (
                <div
                  key={i}
                  className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900">{cause.name}</span>
                    <span className="font-mono-num font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      {cause.probability} Probability
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    {cause.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action & Urgency */}
          <div className="md:col-span-5 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Recommended Specialist Domain
              </span>
              <p className="text-xs font-semibold text-stone-900 mt-0.5">
                {diagnosis.recommendedSpecialistField}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Urgency Level
              </span>
              <span className={`inline-block mt-0.5 text-xs font-bold font-mono-num px-2 py-0.5 rounded ${
                diagnosis.urgency === 'High'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {diagnosis.urgency} Action Recommended
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Immediate Grower Action
              </span>
              <p className="text-xs text-stone-700 leading-relaxed mt-0.5">
                {diagnosis.immediateFieldAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Experts List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Suggested Agricultural Experts ({matchResults.length})
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Ranked by specialized competence in {crop} pathology and described symptoms.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
          >
            <option value="match">Highest Match Score</option>
            <option value="fee-asc">Consultation Fee (Lowest First)</option>
            <option value="fee-desc">Consultation Fee (Highest First)</option>
            <option value="experience">Years of Experience</option>
          </select>
        </div>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedResults.map((result) => (
          <ExpertCard
            key={result.expert.id}
            expert={result.expert}
            matchScore={result.matchScore}
            matchReasons={result.matchReasons}
            isTopMatch={result.isTopMatch}
            onBook={onBookExpert}
          />
        ))}
      </div>

    </div>
  );
};
