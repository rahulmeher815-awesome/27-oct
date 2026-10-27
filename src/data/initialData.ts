import { Expert, Appointment, ChatMessage, FarmerProfile } from '../types';

export const INITIAL_EXPERTS: Expert[] = [
  {
    id: 'exp-1',
    name: 'Dr. Mei Lin Chen',
    title: 'Senior Plant Pathologist',
    degree: 'Ph.D. Plant Virology & Pathology',
    institution: 'Tropical Crop Health Institute',
    location: 'Horticultural Research Center',
    specialties: [
      'Plant Pathology',
      'Sigatoka Leaf Spot',
      'Banana Fusarium Wilt (TR4)',
      'Viral Chlorosis & Yellowing',
      'Tropical Fruit Diseases'
    ],
    crops: ['Banana', 'Plantain', 'Papaya', 'Mango', 'Citrus'],
    fee: 25,
    currency: 'USD',
    experienceYears: 14,
    rating: 4.95,
    reviewsCount: 128,
    bio: 'Specialist in tropical musa (banana/plantain) foliar diseases, leaf spot epidemics, and soilborne fungal pathogens. Over a decade of field research advising smallholder and commercial growers across Asia and Latin America.',
    avatarUrl: '/src/assets/images/expert_portrait_agronomist_1793084096093.jpg',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
    languages: ['English', 'Mandarin'],
    isVerified: true,
  },
  {
    id: 'exp-2',
    name: 'Dr. Rajesh Kumar',
    title: 'Lead Crop Protection Doctor & Agronomist',
    degree: 'Ph.D. Agricultural Entomology & IPM',
    institution: 'National Agri Extension Services',
    location: 'Regional Agricultural University',
    specialties: [
      'Crop Protection & IPM',
      'Foliar Pests & Aphids',
      'Banana Stem Weevil',
      'Nutrient Chlorosis Diagnosis',
      'Bacterial Leaf Blight'
    ],
    crops: ['Banana', 'Rice', 'Wheat', 'Sugarcane', 'Cotton'],
    fee: 18,
    currency: 'USD',
    experienceYears: 16,
    rating: 4.88,
    reviewsCount: 194,
    bio: 'Dedicated agricultural consultant focused on rapid symptom diagnosis, leaf discoloration remedies, and eco-friendly integrated pest management for cash crops and fruit plantations.',
    avatarUrl: '/src/assets/images/expert_portrait_pathologist_1793084097009.jpg',
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '01:30 PM', '03:30 PM', '05:00 PM'],
    languages: ['English', 'Hindi'],
    isVerified: true,
  },
  {
    id: 'exp-3',
    name: 'Dr. Marcus Adebayo',
    title: 'Soil Nutritionist & Agronomy Specialist',
    degree: 'Ph.D. Soil Chemistry & Plant Nutrition',
    institution: 'Sustainable Farming Alliance',
    location: 'Agro-Ecological Research Lab',
    specialties: [
      'Soil Chemistry & Fertility',
      'Potassium Deficiency Chlorosis',
      'Micro-nutrient Imbalance',
      'Fertilizer Optimization',
      'Root System Health'
    ],
    crops: ['Banana', 'Maize', 'Cassava', 'Tomato', 'Legumes'],
    fee: 30,
    currency: 'USD',
    experienceYears: 12,
    rating: 4.92,
    reviewsCount: 97,
    bio: 'Specialized in soil mineral analysis, foliar symptoms related to potassium/magnesium deficiencies, and tailored nutrient programs to restore vigor in yellowing crop stands.',
    avatarUrl: '/src/assets/images/expert_portrait_soil_1793084096953.jpg',
    availableDays: ['Tue', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['08:30 AM', '11:30 AM', '02:30 PM', '04:00 PM'],
    languages: ['English', 'French'],
    isVerified: true,
  },
  {
    id: 'exp-4',
    name: 'Dr. Sarah Jenkins',
    title: 'Horticultural Pest & Disease Advisor',
    degree: 'M.Sc. Horticultural Sciences & Organic IPM',
    institution: 'Valley Agro-Bio Consultants',
    location: 'Cooperative Extension Office',
    specialties: [
      'Organic Crop Defense',
      'Bacterial Wilt & Canker',
      'Early & Late Blight',
      'Drip Fertigation Diagnosis',
      'Biological Control Agents'
    ],
    crops: ['Tomato', 'Pepper', 'Banana', 'Cucumber', 'Eggplant'],
    fee: 22,
    currency: 'USD',
    experienceYears: 9,
    rating: 4.85,
    reviewsCount: 84,
    bio: 'Hands-on farm consultant assisting open-field and greenhouse growers in diagnosing foliar curling, discoloration, and fungal blights with organic-certified remedies.',
    avatarUrl: '/src/assets/images/expert_portrait_agronomist_1793084096093.jpg',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['09:30 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
    languages: ['English', 'Spanish'],
    isVerified: true,
  }
];

export const INITIAL_FARMER_PROFILE: FarmerProfile = {
  name: 'Kavita Patel',
  phone: '+1 (555) 234-5678',
  location: 'Riverside Organic Farm, Sector 4',
  primaryCrops: ['Banana', 'Tomato', 'Papaya']
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    farmerName: 'Kavita Patel',
    farmerPhone: '+1 (555) 234-5678',
    farmerLocation: 'Riverside Organic Farm, Sector 4',
    expertId: 'exp-1',
    crop: 'Banana',
    problemDescription: 'Yellowing in banana leaves starting from outer edges, progressing inward with brownish streaks.',
    date: '2026-10-28',
    timeSlot: '09:00 AM',
    feePaid: 25,
    currency: 'USD',
    status: 'in_progress',
    createdAt: '2026-10-26T14:30:00Z',
    diagnosisSummary: 'Preliminary signs indicate Potassium (K) deficiency combined with mild Yellow Sigatoka foliar stress.',
    prescriptions: [
      'Apply potassium sulfate (SOP) at 150g per stool near root zone',
      'Prune and safely compost heavily necrosed outer leaves to prevent fungal sporulation',
      'Ensure proper furrow drainage during heavy morning dew'
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    appointmentId: 'apt-101',
    senderId: 'farmer-current',
    senderRole: 'farmer',
    senderName: 'Kavita Patel',
    text: 'Hello Dr. Chen, thank you for accepting my consultation. As you can see, the lower banana leaves have turned distinctly yellow along the margins over the past 5 days.',
    timestamp: '2026-10-26T14:35:00Z'
  },
  {
    id: 'msg-2',
    appointmentId: 'apt-101',
    senderId: 'exp-1',
    senderRole: 'expert',
    senderName: 'Dr. Mei Lin Chen',
    text: 'Hello Kavita! I reviewed your notes and photos. This characteristic marginal yellowing turning into chlorosis is very typical of Potassium deficiency, but we must also verify if you see any small cigar-leaf brown spots.',
    timestamp: '2026-10-26T14:38:00Z'
  },
  {
    id: 'msg-3',
    appointmentId: 'apt-101',
    senderId: 'farmer-current',
    senderRole: 'farmer',
    senderName: 'Kavita Patel',
    text: 'Yes! The younger leaves in the center look normal, but the oldest 3 whorls are pale yellow with dried tips. We had heavy rains 2 weeks ago.',
    timestamp: '2026-10-26T14:41:00Z'
  },
  {
    id: 'msg-4',
    appointmentId: 'apt-101',
    senderId: 'exp-1',
    senderRole: 'expert',
    senderName: 'Dr. Mei Lin Chen',
    text: 'Heavy rainfall often leaches mobile potassium from porous topsoil. I have updated the consultation diagnosis panel with recommended potassium sulfate dosages and pruning instructions. You should see recovery in new flushes within 10-14 days.',
    timestamp: '2026-10-26T14:44:00Z'
  }
];
