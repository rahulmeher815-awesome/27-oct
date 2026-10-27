/**
 * AgriConnect Data Types & Interfaces
 */

export type UserRole = 'farmer' | 'expert';

export interface Expert {
  id: string;
  name: string;
  title: string;
  degree: string;
  institution: string;
  location: string;
  specialties: string[];
  crops: string[];
  fee: number; // Consultation fee decided by the expert
  currency: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  avatarUrl: string;
  availableDays: string[];
  timeSlots: string[];
  languages: string[];
  isVerified: boolean;
}

export interface AiDiagnosis {
  likelyCauses: {
    name: string;
    probability: string;
    description: string;
  }[];
  urgency: 'Low' | 'Medium' | 'High';
  recommendedSpecialistField: string;
  immediateFieldAction: string;
}

export interface CropProblem {
  id: string;
  crop: string;
  symptoms: string;
  affectedPart: string;
  duration: string;
  farmSize?: string;
  location?: string;
  createdAt: string;
  aiDiagnosis?: AiDiagnosis;
}

export interface Appointment {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  expertId: string;
  crop: string;
  problemDescription: string;
  date: string;
  timeSlot: string;
  feePaid: number;
  currency: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  diagnosisSummary?: string;
  prescriptions?: string[];
}

export interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'prescription' | 'note';
}

export interface FarmerProfile {
  name: string;
  phone: string;
  location: string;
  primaryCrops: string[];
}
