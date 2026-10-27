import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Expert, Appointment, FarmerProfile } from '../types';

interface BookingModalProps {
  expert: Expert;
  crop: string;
  problemDescription: string;
  farmerProfile: FarmerProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  onOpenChat: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  expert,
  crop,
  problemDescription,
  farmerProfile,
  isOpen,
  onClose,
  onConfirmBooking,
  onOpenChat,
}) => {
  if (!isOpen) return null;

  // Generate the next 5 dates for selection
  const upcomingDates = React.useMemo(() => {
    const list: { label: string; value: string; dayName: string }[] = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      // Only include if expert is available on this day
      if (expert.availableDays.includes(dayName)) {
        list.push({
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
          value: d.toISOString().split('T')[0],
          dayName
        });
      }
    }
    // Fallback if no matching days in immediate week
    if (list.length === 0) {
      const d = new Date();
      d.setDate(today.getDate() + 1);
      list.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
        value: d.toISOString().split('T')[0],
        dayName: 'Next Available'
      });
    }
    return list;
  }, [expert]);

  const [selectedDate, setSelectedDate] = useState(upcomingDates[0]?.value || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(expert.timeSlots[0] || '10:00 AM');
  const [farmerName, setFarmerName] = useState(farmerProfile.name || 'Kavita Patel');
  const [farmerPhone, setFarmerPhone] = useState(farmerProfile.phone || '+1 (555) 234-5678');
  const [farmerLocation, setFarmerLocation] = useState(farmerProfile.location || 'Riverside Farm');
  const [isBooked, setIsBooked] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot || !farmerName) return;

    const newApt = onConfirmBooking({
      farmerName,
      farmerPhone,
      farmerLocation,
      expertId: expert.id,
      crop,
      problemDescription,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      feePaid: expert.fee,
      currency: expert.currency || 'USD',
      status: 'confirmed',
    });

    setCreatedAppointment(newApt);
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {isBooked ? 'Appointment Confirmed!' : 'Book Agricultural Consultation'}
            </h3>
            <p className="text-xs text-stone-500">
              {isBooked ? 'Your session has been registered' : `With ${expert.name} · ${expert.title}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isBooked && createdAppointment ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-stone-900 mb-1">
                Consultation Successfully Reserved
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Your appointment with <span className="font-semibold text-stone-800">{expert.name}</span> for <span className="font-semibold text-stone-800">{crop}</span> has been confirmed for:
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Scheduled Date:</span>
                <span className="font-semibold text-stone-900">{createdAppointment.date}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Time Window:</span>
                <span className="font-semibold text-stone-900">{createdAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Problem Subject:</span>
                <span className="font-semibold text-stone-900 truncate max-w-[200px]">{createdAppointment.crop}: {createdAppointment.problemDescription}</span>
              </div>
              <div className="flex justify-between text-stone-600 pt-2 border-t border-stone-200">
                <span>Consultation Fee:</span>
                <span className="font-bold text-stone-900 font-mono-num">${createdAppointment.feePaid} USD</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChat(createdAppointment);
                }}
                className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Consultation Chat</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-5">
            
            {/* Expert Snapshot */}
            <div className="flex items-center gap-3.5 p-3.5 bg-stone-50 rounded-lg border border-stone-200">
              <img
                src={expert.avatarUrl}
                alt={expert.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-stone-900 truncate">{expert.name}</h4>
                <p className="text-xs text-stone-600 truncate">{expert.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                  <span>Fee: <strong className="text-stone-900 font-mono-num">${expert.fee} USD</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>{expert.experienceYears} Years Exp</span>
                </div>
              </div>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                1. Select Available Date
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {upcomingDates.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedDate(item.value)}
                    className={`p-2.5 text-xs rounded-lg border text-left transition-all cursor-pointer ${
                      selectedDate === item.value
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-800'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-stone-500 font-bold">{item.dayName}</div>
                    <div className="mt-0.5">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                2. Select Expert Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {expert.timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-2.5 text-xs text-center font-mono-num rounded-lg border transition-all cursor-pointer ${
                      selectedTimeSlot === slot
                        ? 'border-emerald-800 bg-emerald-800 text-white font-semibold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Farmer Contact Details */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <label className="block text-xs font-semibold text-stone-800">
                3. Your Grower Contact Information
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block text-[11px] text-stone-500 mb-1">Farmer Name</span>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
                    required
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-stone-500 mb-1">Phone / WhatsApp</span>
                  <input
                    type="text"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-stone-500 mb-1">Farm Location / Region</span>
                <input
                  type="text"
                  value={farmerLocation}
                  onChange={(e) => setFarmerLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
                  required
                />
              </div>
            </div>

            {/* Fee Confirmation & Booking submit */}
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">Consultation Total</span>
                <span className="text-base font-bold text-stone-900 font-mono-num">${expert.fee} USD</span>
              </div>
              <span className="text-[11px] text-stone-500">Includes direct chat & diagnosis</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <span>Confirm & Reserve Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
