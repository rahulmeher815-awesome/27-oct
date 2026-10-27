import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, ShieldCheck, Clock, CheckCircle2, FileText, CornerDownLeft, Sparkles } from 'lucide-react';
import { Appointment, ChatMessage, Expert, UserRole } from '../types';
import { StorageService } from '../utils/storage';

interface ConsultationChatModalProps {
  appointment: Appointment;
  expert: Expert;
  currentRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAppointment: (updated: Appointment) => void;
}

export const ConsultationChatModal: React.FC<ConsultationChatModalProps> = ({
  appointment,
  expert,
  currentRole,
  isOpen,
  onClose,
  onUpdateAppointment,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnosis'>('chat');
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages on mount / change
  useEffect(() => {
    const loaded = StorageService.getChatMessages(appointment.id);
    setMessages(loaded);
  }, [appointment.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      appointmentId: appointment.id,
      senderId: currentRole === 'farmer' ? 'farmer-current' : expert.id,
      senderRole: currentRole,
      senderName: currentRole === 'farmer' ? appointment.farmerName : expert.name,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    StorageService.addChatMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // If farmer sends a message, simulate an intelligent expert acknowledgment after 1.5s
    // so the farmer gets realistic feedback even if not currently in expert view
    if (currentRole === 'farmer') {
      setTimeout(() => {
        const replyText = getSimulatedExpertReply(expert, appointment.crop, newMsg.text);
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          appointmentId: appointment.id,
          senderId: expert.id,
          senderRole: 'expert',
          senderName: expert.name,
          text: replyText,
          timestamp: new Date().toISOString(),
        };
        StorageService.addChatMessage(replyMsg);
        setMessages(prev => [...prev, replyMsg]);
      }, 1500);
    }
  };

  const handleAddPrescription = () => {
    if (!prescriptionInput.trim()) return;
    const currentPrescriptions = appointment.prescriptions || [];
    const updated = {
      ...appointment,
      status: 'in_progress' as const,
      prescriptions: [...currentPrescriptions, prescriptionInput.trim()],
    };
    StorageService.updateAppointment(updated);
    onUpdateAppointment(updated);
    setPrescriptionInput('');

    // Also notify in chat
    const alertMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      appointmentId: appointment.id,
      senderId: expert.id,
      senderRole: 'expert',
      senderName: expert.name,
      text: `Prescription added: "${prescriptionInput.trim()}". Check the Diagnosis & Treatment tab for step-by-step instructions.`,
      timestamp: new Date().toISOString(),
    };
    StorageService.addChatMessage(alertMsg);
    setMessages(prev => [...prev, alertMsg]);
  };

  const handleMarkCompleted = () => {
    const updated = {
      ...appointment,
      status: 'completed' as const,
    };
    StorageService.updateAppointment(updated);
    onUpdateAppointment(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xl max-w-3xl w-full h-[88vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={expert.avatarUrl}
              alt={expert.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover border border-stone-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">
                  {currentRole === 'farmer' ? expert.name : appointment.farmerName}
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {currentRole === 'farmer' ? 'Expert Advisory Room' : `Grower: ${appointment.farmerLocation}`}
                </span>
              </div>
              <p className="text-xs text-stone-300 truncate">
                {appointment.crop} Issue · Slot: {appointment.date} ({appointment.timeSlot}) · Fee: ${appointment.feePaid}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'chat' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                Chat Messages
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('diagnosis')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'diagnosis' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                Remedies & Advice ({appointment.prescriptions?.length || 0})
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-b border-stone-200 bg-stone-50 text-xs font-medium shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-center border-b-2 ${
              activeTab === 'chat' ? 'border-emerald-800 text-emerald-800 font-bold' : 'border-transparent text-stone-600'
            }`}
          >
            Chat Messages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diagnosis')}
            className={`flex-1 py-2 text-center border-b-2 ${
              activeTab === 'diagnosis' ? 'border-emerald-800 text-emerald-800 font-bold' : 'border-transparent text-stone-600'
            }`}
          >
            Remedies & Advice
          </button>
        </div>

        {/* Content View: Chat Tab */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-stone-50">
            
            {/* Context bar with problem description */}
            <div className="p-3 bg-stone-100/80 border-b border-stone-200 text-xs text-stone-700 flex items-center justify-between shrink-0">
              <div className="truncate max-w-xl">
                <span className="font-semibold text-stone-900">Reported Problem:</span> {appointment.crop} — {appointment.problemDescription}
              </div>
              <span className="text-[11px] text-stone-500 font-mono-num shrink-0">
                Status: <strong className="capitalize text-stone-800">{appointment.status.replace('_', ' ')}</strong>
              </span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {messages.map((msg) => {
                const isMe = currentRole === msg.senderRole;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1 px-1">
                      <span className="font-semibold text-stone-700">{msg.senderName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{msg.senderRole}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-md p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-emerald-800 text-white rounded-tr-xs'
                          : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions for Farmer */}
            {currentRole === 'farmer' && (
              <div className="px-4 py-2 bg-white border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
                <span className="text-[11px] text-stone-400 font-medium whitespace-nowrap">Ask specialist:</span>
                <button
                  type="button"
                  onClick={() => setInputText('What is the recommended fertilizer or fungicide ratio for this?')}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap cursor-pointer text-xs"
                >
                  Dosage ratio?
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('Should I prune off the yellowed leaves immediately to protect other plants?')}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap cursor-pointer text-xs"
                >
                  Should I prune leaves?
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('Could this be caused by recent heavy rains or poor drainage?')}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap cursor-pointer text-xs"
                >
                  Rain / Drainage factor?
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder={
                  currentRole === 'farmer'
                    ? `Message ${expert.name} about your crop symptoms...`
                    : `Reply to ${appointment.farmerName} with agricultural advice...`
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          /* Diagnosis & Treatment Tab */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-stone-50">
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
              <h4 className="text-sm font-bold text-stone-900 mb-2">
                Consultation Diagnostic Assessment
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {appointment.diagnosisSummary || 'The specialist has received the crop symptoms and is reviewing your field conditions.'}
              </p>
            </div>

            {/* Official Prescriptions / Action Steps */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900">
                  Recommended Treatment & Field Actions
                </h4>
                <span className="text-xs text-stone-500 font-mono-num">
                  {appointment.prescriptions?.length || 0} Prescribed Steps
                </span>
              </div>

              {appointment.prescriptions && appointment.prescriptions.length > 0 ? (
                <ul className="space-y-2">
                  {appointment.prescriptions.map((step, idx) => (
                    <li key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] font-mono-num">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-0.5">{step}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-500 italic">
                  No written prescriptions issued yet. Consult with the expert in the chat.
                </p>
              )}

              {/* Expert can append prescription */}
              {currentRole === 'expert' && (
                <div className="pt-3 border-t border-stone-200 space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Add Official Treatment Advice / Dosage
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Apply potassium sulfate (SOP) at 150g per stool near root zone"
                      value={prescriptionInput}
                      onChange={(e) => setPrescriptionInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddPrescription}
                      disabled={!prescriptionInput.trim()}
                      className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Issue Step
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status change action */}
            {currentRole === 'expert' && appointment.status !== 'completed' && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">Finish Consultation</h5>
                  <p className="text-[11px] text-emerald-800">Mark this farmer consultation as successfully resolved</p>
                </div>
                <button
                  type="button"
                  onClick={handleMarkCompleted}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Mark Completed
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

function getSimulatedExpertReply(expert: Expert, crop: string, farmerText: string): string {
  const lower = farmerText.toLowerCase();

  if (lower.includes('fertilizer') || lower.includes('dosage') || lower.includes('ratio')) {
    return `For ${crop} showing these foliar symptoms, avoid quick-release high-nitrogen fertilizers which can aggravate soft tissue infection. I recommend a balanced Potassium Sulfate (0-0-50) application at 120-150g per plant base, dissolved or applied around the drip line.`;
  }

  if (lower.includes('prune') || lower.includes('cut') || lower.includes('remove')) {
    return `Yes, carefully cut off leaves that are more than 50% necrotic using a sterilized machete or shears. Burn or bury them away from the field to stop fungal spores from spreading with morning wind.`;
  }

  if (lower.includes('rain') || lower.includes('water') || lower.includes('drainage')) {
    return `Waterlogged soil blocks root oxygen and prevents mobile potassium and magnesium uptake. Ensure field furrows are cleared so standing water drains within 24 hours of heavy downpours.`;
  }

  return `Thank you for the update. I have noted this symptom progression. Let's monitor the younger central shoot over the next 48 hours to confirm if new leaves emerge clean.`;
}
