import React, { useState } from 'react';
import { 
  User, DollarSign, Clock, Calendar, ShieldCheck, Check, Plus, 
  Trash2, MessageSquare, Edit3, Save, Sparkles, BookOpen, AlertCircle 
} from 'lucide-react';
import { Expert, Appointment } from '../types';

interface ExpertDashboardProps {
  experts: Expert[];
  activeExpert: Expert;
  onSelectExpert: (expertId: string) => void;
  onUpdateExpert: (updated: Expert) => void;
  appointments: Appointment[];
  onOpenChat: (apt: Appointment) => void;
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ExpertDashboard: React.FC<ExpertDashboardProps> = ({
  experts,
  activeExpert,
  onSelectExpert,
  onUpdateExpert,
  appointments,
  onOpenChat,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Expert>(activeExpert);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCrop, setNewCrop] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync formData when active expert changes
  React.useEffect(() => {
    setFormData(activeExpert);
    setIsEditing(false);
  }, [activeExpert]);

  // Filter appointments for this expert
  const expertAppointments = appointments.filter(a => a.expertId === activeExpert.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateExpert(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleDay = (day: string) => {
    const current = formData.availableDays;
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    setFormData({ ...formData, availableDays: updated });
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;
    if (!formData.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()]
      });
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (spec: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== spec)
    });
  };

  const handleAddCrop = () => {
    if (!newCrop.trim()) return;
    if (!formData.crops.includes(newCrop.trim())) {
      setFormData({
        ...formData,
        crops: [...formData.crops, newCrop.trim()]
      });
    }
    setNewCrop('');
  };

  const handleRemoveCrop = (crop: string) => {
    setFormData({
      ...formData,
      crops: formData.crops.filter(c => c !== crop)
    });
  };

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.trim()) return;
    if (!formData.timeSlots.includes(newTimeSlot.trim())) {
      setFormData({
        ...formData,
        timeSlots: [...formData.timeSlots, newTimeSlot.trim()]
      });
    }
    setNewTimeSlot('');
  };

  const handleRemoveTimeSlot = (slot: string) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter(s => s !== slot)
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Expert Profile Selector */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Agricultural Specialist Control Panel</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Expert Advisory Portal
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Set your consultation fees, manage crop expertise, configure consultation slots, and advise growers.
          </p>
        </div>

        {/* Switch expert account for testing */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 whitespace-nowrap">Testing Profile:</span>
          <select
            value={activeExpert.id}
            onChange={(e) => onSelectExpert(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            {experts.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.crops.slice(0, 2).join(', ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Profile changes, consultation fee, and available schedule saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Profile & Fee Editor (Left) + Schedule & Appointments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Expert Profile & Fee Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-stone-900">Expertise & Fee Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile & Fee'}
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-5">
              
              {/* Photo & Name */}
              <div className="flex items-center gap-4">
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-2.5 py-1 text-sm font-bold border border-stone-300 rounded"
                    />
                  ) : (
                    <h4 className="text-base font-bold text-stone-900 truncate">{formData.name}</h4>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs border border-stone-300 rounded mt-1"
                    />
                  ) : (
                    <p className="text-xs text-stone-600 truncate">{formData.title}</p>
                  )}

                  <p className="text-[11px] text-stone-500 mt-0.5">{formData.institution}</p>
                </div>
              </div>

              {/* Consultation Fee Section (Highlighted per user request) */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Consultation Fee (Decided by Expert)</span>
                  </label>
                  <span className="text-[11px] text-stone-500">Per 30-min slot</span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-stone-700">$</span>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                      className="w-24 px-3 py-1.5 text-sm font-bold font-mono-num bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      required
                    />
                    <span className="text-xs text-stone-500 font-medium">USD</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-stone-900 font-mono-num">
                      ${formData.fee}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">USD</span>
                  </div>
                )}
                <p className="text-[11px] text-stone-500 mt-1.5">
                  This fee is charged to farmers when booking a diagnostic consultation session.
                </p>
              </div>

              {/* Crop Specialties */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2">
                  Crops You Consult On
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.crops.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-stone-100 text-stone-800 rounded-md border border-stone-200"
                    >
                      <span>{c}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCrop(c)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add crop (e.g. Banana, Papaya)"
                      value={newCrop}
                      onChange={(e) => setNewCrop(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs border border-stone-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleAddCrop}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-900 text-white text-xs rounded-md cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Disease & Diagnostic Specialties */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2">
                  Diagnostic Specialties & Pathogen Focus
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-50 text-emerald-900 rounded-md border border-emerald-200"
                    >
                      <span>{spec}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(spec)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add specialty (e.g. Potassium Chlorosis, Stem Weevil)"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs border border-stone-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecialty}
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs rounded-md cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Bio & Background */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1.5">
                  Professional Bio & Extension Background
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-800 leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {formData.bio}
                  </p>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile & Updated Fee</span>
                </button>
              )}

            </form>
          </div>
        </div>

        {/* Right Column: Time Schedule & Farmer Appointments */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Availability & Time Slots Manager */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-800" />
                  <span>Available Consultation Schedule</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Farmers can only book appointment times from your active slots below.
                </p>
              </div>
            </div>

            {/* Days of week selector */}
            <div>
              <span className="block text-xs font-semibold text-stone-800 mb-2">
                Available Days:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_DAYS.map((day) => {
                  const isActive = formData.availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <span className="block text-xs font-semibold text-stone-800 mb-2">
                Daily Time Slots:
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.timeSlots.map((slot) => (
                  <span
                    key={slot}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono-num text-stone-800"
                  >
                    <span>{slot}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(slot)}
                      className="text-stone-400 hover:text-red-600 ml-1 cursor-pointer"
                      title="Remove time slot"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom slot */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 03:00 PM"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-36 px-3 py-1.5 text-xs font-mono-num border border-stone-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg cursor-pointer"
                >
                  Add Slot
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateExpert(formData)}
                  className="ml-auto px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </div>

          </div>

          {/* Booked Farmer Appointments Queue */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-800" />
                  <span>Grower Appointments & Cases</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Incoming consultations booked by farmers matching your crop specialty.
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-600 font-mono-num">
                {expertAppointments.length} Total Cases
              </span>
            </div>

            {expertAppointments.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No active appointments booked yet. When a farmer submits an issue matching your crops, it will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {expertAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-stone-200 hover:border-emerald-800/40 bg-stone-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {apt.farmerName}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">·</span>
                        <span className="text-xs font-semibold text-emerald-800">
                          {apt.crop}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">·</span>
                        <span className="text-[11px] font-mono-num text-stone-500 capitalize">
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-1">
                        {apt.problemDescription}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono-num">
                        <span>Date: {apt.date} at {apt.timeSlot}</span>
                        <span aria-hidden="true">·</span>
                        <span>Fee Paid: ${apt.feePaid} USD</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenChat(apt)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Chat & Advise</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
