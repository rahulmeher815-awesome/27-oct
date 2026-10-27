import React, { useState } from 'react';
import { Search, Sparkles, UploadCloud, AlertCircle, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';

interface ProblemSubmissionFormProps {
  onAnalyze: (crop: string, symptoms: string, affectedPart: string, duration: string, imageUrl?: string) => void;
  isLoading: boolean;
}

const COMMON_CROPS = [
  'Banana',
  'Tomato',
  'Rice',
  'Citrus',
  'Maize / Corn',
  'Cotton',
  'Mango',
  'Potato',
  'Chili / Pepper'
];

const SAMPLE_PROBLEMS = [
  {
    crop: 'Banana',
    symptom: 'Yellowing in banana leaves starting from margins with brown necrotic tips and drooping',
    part: 'Leaves',
    duration: '1-2 weeks'
  },
  {
    crop: 'Tomato',
    symptom: 'Brown concentric ring spots on lower foliage with curled leaf edges',
    part: 'Leaves',
    duration: '3-5 days'
  },
  {
    crop: 'Rice',
    symptom: 'Pale yellow streaks along leaf blades with water-soaked margins',
    part: 'Leaves',
    duration: '1 week'
  }
];

export const ProblemSubmissionForm: React.FC<ProblemSubmissionFormProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [crop, setCrop] = useState('Banana');
  const [customCrop, setCustomCrop] = useState('');
  const [symptoms, setSymptoms] = useState('Yellowing in banana leaves starting from outer edges, progressing inward with brownish streaks.');
  const [affectedPart, setAffectedPart] = useState('Leaves');
  const [duration, setDuration] = useState('1-2 weeks');
  const [imageUrl, setImageUrl] = useState<string>('');

  const activeCrop = crop === 'Other' ? customCrop : crop;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCrop.trim() || !symptoms.trim()) return;
    onAnalyze(activeCrop, symptoms, affectedPart, duration, imageUrl);
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PROBLEMS[0]) => {
    setCrop(preset.crop);
    setSymptoms(preset.symptom);
    setAffectedPart(preset.part);
    setDuration(preset.duration);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header banner */}
      <div className="p-6 md:p-8 bg-stone-900 text-white relative">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Intelligent Agricultural Matching Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Describe Your Crop Problem
          </h1>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Specify the crop and visual symptoms you are observing in your field. Our system will analyze the issue and match you with certified agronomists and plant doctors in that exact field.
          </p>
        </div>

        {/* Quick sample problem pills */}
        <div className="mt-5 pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">Try quick example:</span>
          {SAMPLE_PROBLEMS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(sample)}
              className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1 rounded-md border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>{sample.crop}: {sample.symptom.slice(0, 32)}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Crop Selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-2">
            1. Select Affected Crop
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_CROPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCrop(c)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  crop === c
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCrop('Other')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                crop === 'Other'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              Other Crop...
            </button>
          </div>

          {crop === 'Other' && (
            <input
              type="text"
              placeholder="Enter crop name (e.g. Soybeans, Cardamom, Grapes)"
              value={customCrop}
              onChange={(e) => setCustomCrop(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              required
            />
          )}
        </div>

        {/* Symptoms Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-stone-900">
              2. Describe Symptoms in Detail
            </label>
            <span className="text-xs text-stone-500">
              Include color changes, spots, wilting, or drying
            </span>
          </div>
          <textarea
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have yellowing in banana leaves starting from outer edges. The leaves are curling down and tips drying up."
            className="w-full px-4 py-3 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent leading-relaxed"
            required
          />
        </div>

        {/* Affected Part and Duration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Primary Plant Part Affected
            </label>
            <select
              value={affectedPart}
              onChange={(e) => setAffectedPart(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
            >
              <option value="Leaves">Leaves & Foliage</option>
              <option value="Stem">Stem / Pseudostem / Trunk</option>
              <option value="Fruit">Fruit / Grain Head</option>
              <option value="Roots">Roots / Soil Zone</option>
              <option value="Whole Plant">Whole Plant Collapse / Wilting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Symptom Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
            >
              <option value="1-3 days">Just appeared (1-3 days)</option>
              <option value="1-2 weeks">Active for 1-2 weeks</option>
              <option value="3-4 weeks">Persistent (3-4 weeks)</option>
              <option value="Over a month">Chronic / Over a month</option>
            </select>
          </div>
        </div>

        {/* Optional Photo Attachment */}
        <div className="p-4 bg-stone-50 rounded-lg border border-dashed border-stone-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 shrink-0">
                <UploadCloud className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-800">
                  Attach Symptom Photo (Optional)
                </p>
                <p className="text-[11px] text-stone-500">
                  Helps agronomists pinpoint chlorosis vs. fungal sporulation
                </p>
              </div>
            </div>

            <label className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors shrink-0">
              <span>{imageUrl ? 'Change Photo' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {imageUrl && (
            <div className="mt-3 flex items-center gap-3 p-2 bg-white rounded border border-stone-200">
              <img
                src={imageUrl}
                alt="Selected crop symptom"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="text-xs text-stone-600 truncate flex-1">
                Photo attached successfully
              </div>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="text-xs text-red-600 hover:text-red-700 px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Instant heuristic & AI matching against verified agronomists</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !activeCrop.trim() || !symptoms.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <span>Matching Agronomists...</span>
            ) : (
              <>
                <span>Match Qualified Experts</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
