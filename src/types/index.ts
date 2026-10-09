export type AppTab = 'home' | 'records' | 'copilot' | 'timeline' | 'care';

export type LanguageCode = 'en' | 'te' | 'hi';

export type MaterialStyle = 'material-crystal' | 'material-glass' | 'material-neumorphic' | 'material-flat';

export type CornerRadius = 'sharp' | 'rounded' | 'pill';

export type ThemePreset =
  | 'bright-white'
  | 'midnight-dark'
  | 'oled-black'
  | 'ocean-teal'
  | 'soft-lavender'
  | 'fresh-mint'
  | 'warm-sunset'
  | 'hc-light'
  | 'hc-dark';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  relationTag: string;
  conditions: string[];
  allergies: string[];
  bloodGroup: string;
  abhaId: string;
  primaryCaregiver: string;
  treatingPhysician: string;
  avatarUrl: string;
  lastSyncTime: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  timing: 'morning' | 'lunch' | 'night' | 'as_needed';
  timeLabel: string;
  instructions: string;
  purpose: string;
  status: 'taken' | 'due' | 'scheduled';
  takenAt?: string;
  dueInText?: string;
}

export interface VitalMetric {
  id: string;
  type: 'bp' | 'glucose' | 'spo2' | 'weight' | 'hb';
  name: string;
  value: string;
  subValue?: string;
  unit: string;
  status: 'optimal' | 'attention' | 'critical';
  statusText: string;
  lastChecked: string;
  trend: 'stable' | 'up' | 'down';
  sparklineData?: number[];
  targetRange?: string;
  min?: number;
  max?: number;
  currentPercent?: number;
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: 'lab_report' | 'prescription' | 'consultation' | 'discharge';
  provider: string;
  doctorName?: string;
  date: string;
  status: 'review_needed' | 'verified' | 'action_required';
  statusLabel: string;
  telemetryVerified: boolean;
  highlightMetric?: {
    name: string;
    value: string;
    reference: string;
    clinicalNote: string;
    isAbnormal: boolean;
  };
  summary: string;
  aiQuestionsForDoctor: string[];
  fileSize?: string;
  pages?: number;
}

export interface CaregiverContact {
  id: string;
  name: string;
  relation: string;
  role: 'Primary Caregiver' | 'Family Observer' | 'Home Nurse' | 'Consulting Physician';
  phone: string;
  activeStatus: 'Active Now' | '10 mins ago' | 'On Call';
  avatar: string;
  isDoctor?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: LanguageCode;
  source?: 'gemini' | 'clinical_engine';
  suggestedFollowUps?: string[];
  audioText?: string;
}
