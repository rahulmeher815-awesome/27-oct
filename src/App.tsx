/**
 * AgriConnect: Farmer-to-Expert Agricultural Consultation Platform
 */

import React, { useState, useEffect } from 'react';
import { 
  Sprout, Search, Calendar, MessageSquare, ShieldCheck, ArrowRight, 
  HelpCircle, Sparkles, Filter, Leaf, Users, CheckCircle2 
} from 'lucide-react';
import { Expert, Appointment, UserRole, FarmerProfile, AiDiagnosis } from './types';
import { StorageService } from './utils/storage';
import { matchExpertsToProblem, ExpertMatchResult } from './utils/matchingEngine';
import { Navbar } from './components/Navbar';
import { ProblemSubmissionForm } from './components/ProblemSubmissionForm';
import { MatchedExpertsSection } from './components/MatchedExpertsSection';
import { ExpertCard } from './components/ExpertCard';
import { BookingModal } from './components/BookingModal';
import { ConsultationChatModal } from './components/ConsultationChatModal';
import { ExpertDashboard } from './components/ExpertDashboard';
import { FarmerConsultationsList } from './components/FarmerConsultationsList';
import { HowItWorksModal } from './components/HowItWorksModal';

export default function App() {
  const [role, setRole] = useState<UserRole>(() => StorageService.getActiveRole());
  const [currentTab, setCurrentTab] = useState<'diagnose' | 'experts' | 'my-bookings' | 'how-it-works'>('diagnose');
  const [experts, setExperts] = useState<Expert[]>(() => StorageService.getExperts());
  const [activeExpertId, setActiveExpertId] = useState<string>(() => StorageService.getActiveExpertId());
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() => StorageService.getFarmerProfile());

  // Search & Match State
  const [selectedCrop, setSelectedCrop] = useState('Banana');
  const [selectedSymptoms, setSelectedSymptoms] = useState('Yellowing in banana leaves starting from outer edges, progressing inward with brownish streaks.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSearched, setHasSearched] = useState(true); // Default true so user immediately sees banana matches
  const [matchResults, setMatchResults] = useState<ExpertMatchResult[]>([]);
  const [diagnosis, setDiagnosis] = useState<AiDiagnosis | null>(null);

  // Modals
  const [bookingExpert, setBookingExpert] = useState<Expert | null>(null);
  const [chatAppointment, setChatAppointment] = useState<Appointment | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Sync active role with storage
  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    StorageService.setActiveRole(newRole);
    if (newRole === 'expert') {
      setCurrentTab('experts');
    } else {
      setCurrentTab('diagnose');
    }
  };

  const handleSelectExpertId = (id: string) => {
    setActiveExpertId(id);
    StorageService.setActiveExpertId(id);
  };

  const handleUpdateExpert = (updated: Expert) => {
    StorageService.updateExpert(updated);
    setExperts(StorageService.getExperts());
  };

  // Run initial match for Banana on mount
  useEffect(() => {
    const result = matchExpertsToProblem(selectedCrop, selectedSymptoms, experts);
    setMatchResults(result.matchedExperts);
    setDiagnosis(result.diagnosis);
  }, [experts]);

  // Handle problem analyze submission
  const handleAnalyzeProblem = (
    crop: string, 
    symptoms: string, 
    affectedPart: string, 
    duration: string, 
    imageUrl?: string
  ) => {
    setIsAnalyzing(true);
    setSelectedCrop(crop);
    setSelectedSymptoms(symptoms);

    setTimeout(() => {
      const result = matchExpertsToProblem(crop, symptoms, experts);
      setMatchResults(result.matchedExperts);
      setDiagnosis(result.diagnosis);
      setHasSearched(true);
      setIsAnalyzing(false);
      
      // Scroll to results
      const resultsEl = document.getElementById('match-results-anchor');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  const handleConfirmBooking = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt = StorageService.createAppointment(appointmentData);
    setAppointments(StorageService.getAppointments());
    return newApt;
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments(StorageService.getAppointments());
  };

  const handleResetData = () => {
    if (confirm('Reset AgriConnect to default initial experts, appointments, and consultations?')) {
      StorageService.resetAllData();
    }
  };

  const activeExpert = experts.find(e => e.id === activeExpertId) || experts[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900">
      
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'how-it-works') {
            setIsHowItWorksOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        role={role}
        setRole={handleSetRole}
        activeExpert={activeExpert}
        activeAppointmentsCount={appointments.filter(a => a.status !== 'completed').length}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* EXPERT VIEW */}
        {role === 'expert' ? (
          <ExpertDashboard
            experts={experts}
            activeExpert={activeExpert}
            onSelectExpert={handleSelectExpertId}
            onUpdateExpert={handleUpdateExpert}
            appointments={appointments}
            onOpenChat={(apt) => setChatAppointment(apt)}
          />
        ) : (
          /* FARMER VIEW */
          <>
            {currentTab === 'my-bookings' ? (
              <FarmerConsultationsList
                appointments={appointments}
                experts={experts}
                onOpenChat={(apt) => setChatAppointment(apt)}
                onNewConsultation={() => setCurrentTab('diagnose')}
              />
            ) : currentTab === 'experts' ? (
              /* All Experts Catalog View */
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      All Agricultural Consultants & Specialists
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Browse certified crop doctors, soil chemists, and plant pathologists available for booking.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('diagnose')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Match by Crop Problem</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experts.map((exp) => (
                    <ExpertCard
                      key={exp.id}
                      expert={exp}
                      onBook={(expert) => setBookingExpert(expert)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Problem Diagnosis & Matching View */
              <div className="space-y-10">
                
                {/* Hero Showcase Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs overflow-hidden">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                      <Sprout className="w-4 h-4" />
                      <span>Direct Farmer-to-Expert Marketplace</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
                      Got Crop Health Issues? Connect Directly With Agronomists.
                    </h1>

                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                      Report your crop problem—like yellowing banana leaves, tomato blights, or soil deficiencies. We match you with verified specialists who diagnose your crop, set their fees transparently, and consult via live chat.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Symptom-based matching</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Transparent consultation fees</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Direct chat & prescriptions</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 h-64 lg:h-72 rounded-xl overflow-hidden border border-stone-200 shadow-xs relative">
                    <img
                      src="/src/assets/images/hero_farmer_field_1793084095585.jpg"
                      alt="Lush green agriculture field and banana crops"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-4">
                      <div className="text-white text-xs">
                        <span className="font-bold block">Verified Agriculture Diagnostics</span>
                        <span className="text-stone-300">Supporting banana, grain, fruit, and vegetable growers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Submission Form */}
                <ProblemSubmissionForm
                  onAnalyze={handleAnalyzeProblem}
                  isLoading={isAnalyzing}
                />

                {/* Anchor for Smooth Scrolling */}
                <div id="match-results-anchor" />

                {/* Matched Experts & Diagnosis Section */}
                {hasSearched && diagnosis && (
                  <MatchedExpertsSection
                    crop={selectedCrop}
                    symptoms={selectedSymptoms}
                    matchResults={matchResults}
                    diagnosis={diagnosis}
                    onBookExpert={(expert) => setBookingExpert(expert)}
                    onModifyProblem={() => {
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  />
                )}

              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-stone-800">AgriConnect Platform</span>
            <span>·</span>
            <span>Farmer & Agricultural Expert Consultation Network</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              How It Works & GitHub Instructions
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleSetRole(role === 'farmer' ? 'expert' : 'farmer')}
              className="hover:text-emerald-800 transition-colors cursor-pointer font-medium"
            >
              Switch to {role === 'farmer' ? 'Expert View' : 'Farmer View'}
            </button>
          </div>
        </div>
      </footer>

      {/* Booking Appointment Modal */}
      {bookingExpert && (
        <BookingModal
          expert={bookingExpert}
          crop={selectedCrop}
          problemDescription={selectedSymptoms}
          farmerProfile={farmerProfile}
          isOpen={true}
          onClose={() => setBookingExpert(null)}
          onConfirmBooking={handleConfirmBooking}
          onOpenChat={(createdApt) => {
            setBookingExpert(null);
            setChatAppointment(createdApt);
          }}
        />
      )}

      {/* Consultation Chat Modal */}
      {chatAppointment && (
        <ConsultationChatModal
          appointment={chatAppointment}
          expert={experts.find(e => e.id === chatAppointment.expertId) || experts[0]}
          currentRole={role}
          isOpen={true}
          onClose={() => setChatAppointment(null)}
          onUpdateAppointment={handleUpdateAppointment}
        />
      )}

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartDiagnose={() => {
          setIsHowItWorksOpen(false);
          setCurrentTab('diagnose');
        }}
      />

    </div>
  );
}
