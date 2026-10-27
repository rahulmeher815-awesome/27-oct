import { Expert, Appointment, ChatMessage, FarmerProfile, CropProblem, UserRole } from '../types';
import { INITIAL_EXPERTS, INITIAL_APPOINTMENTS, INITIAL_CHAT_MESSAGES, INITIAL_FARMER_PROFILE } from '../data/initialData';

const STORAGE_KEYS = {
  EXPERTS: 'agriconnect_experts_v1',
  APPOINTMENTS: 'agriconnect_appointments_v1',
  CHATS: 'agriconnect_chats_v1',
  FARMER_PROFILE: 'agriconnect_farmer_profile_v1',
  PROBLEMS: 'agriconnect_problems_v1',
  ACTIVE_ROLE: 'agriconnect_active_role_v1',
  ACTIVE_EXPERT_ID: 'agriconnect_active_expert_id_v1',
};

// Safe localStorage helper
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read ${key} from storage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write ${key} to storage:`, e);
  }
}

export const StorageService = {
  getExperts(): Expert[] {
    const stored = safeGet<Expert[]>(STORAGE_KEYS.EXPERTS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.EXPERTS, INITIAL_EXPERTS);
      return INITIAL_EXPERTS;
    }
    return stored;
  },

  saveExperts(experts: Expert[]): void {
    safeSet(STORAGE_KEYS.EXPERTS, experts);
  },

  getExpertById(id: string): Expert | undefined {
    return this.getExperts().find(e => e.id === id);
  },

  updateExpert(updated: Expert): void {
    const experts = this.getExperts();
    const index = experts.findIndex(e => e.id === updated.id);
    if (index !== -1) {
      experts[index] = updated;
    } else {
      experts.push(updated);
    }
    this.saveExperts(experts);
  },

  getAppointments(): Appointment[] {
    const stored = safeGet<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
      return INITIAL_APPOINTMENTS;
    }
    return stored;
  },

  saveAppointments(appointments: Appointment[]): void {
    safeSet(STORAGE_KEYS.APPOINTMENTS, appointments);
  },

  createAppointment(aptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const appointments = this.getAppointments();
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    appointments.unshift(newApt);
    this.saveAppointments(appointments);

    // Seed initial greeting message in the chat
    const expert = this.getExpertById(aptData.expertId);
    const greetingMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      appointmentId: newApt.id,
      senderId: 'system',
      senderRole: 'expert',
      senderName: expert ? expert.name : 'Crop Specialist',
      text: `Appointment booked for ${aptData.crop} consultation on ${aptData.date} at ${aptData.timeSlot}. You can now discuss symptoms directly with the specialist.`,
      timestamp: new Date().toISOString(),
    };
    this.addChatMessage(greetingMsg);

    return newApt;
  },

  updateAppointment(appointment: Appointment): void {
    const appointments = this.getAppointments();
    const idx = appointments.findIndex(a => a.id === appointment.id);
    if (idx !== -1) {
      appointments[idx] = appointment;
      this.saveAppointments(appointments);
    }
  },

  getChatMessages(appointmentId: string): ChatMessage[] {
    const all = safeGet<ChatMessage[]>(STORAGE_KEYS.CHATS, []);
    if (!all || all.length === 0) {
      safeSet(STORAGE_KEYS.CHATS, INITIAL_CHAT_MESSAGES);
      return INITIAL_CHAT_MESSAGES.filter(m => m.appointmentId === appointmentId);
    }
    return all.filter(m => m.appointmentId === appointmentId);
  },

  addChatMessage(msg: ChatMessage): void {
    const all = safeGet<ChatMessage[]>(STORAGE_KEYS.CHATS, []);
    all.push(msg);
    safeSet(STORAGE_KEYS.CHATS, all);
  },

  getFarmerProfile(): FarmerProfile {
    return safeGet<FarmerProfile>(STORAGE_KEYS.FARMER_PROFILE, INITIAL_FARMER_PROFILE);
  },

  saveFarmerProfile(profile: FarmerProfile): void {
    safeSet(STORAGE_KEYS.FARMER_PROFILE, profile);
  },

  getActiveRole(): UserRole {
    return safeGet<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'farmer');
  },

  setActiveRole(role: UserRole): void {
    safeSet(STORAGE_KEYS.ACTIVE_ROLE, role);
  },

  getActiveExpertId(): string {
    return safeGet<string>(STORAGE_KEYS.ACTIVE_EXPERT_ID, 'exp-1');
  },

  setActiveExpertId(id: string): void {
    safeSet(STORAGE_KEYS.ACTIVE_EXPERT_ID, id);
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.EXPERTS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.FARMER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROBLEMS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXPERT_ID);
    window.location.reload();
  }
};
