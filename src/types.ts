export type FundType = 'personal' | 'family' | 'buffer' | 'emergency' | 'saving' | 'investment';

export type TransactionType = 'income' | 'expense';

export type PaymentMode = 'cash' | 'upi' | 'bank' | 'card' | 'cheque' | 'wallet' | 'other';

export type AppTheme = 'blue' | 'yellow' | 'orange' | 'emerald' | 'purple' | 'cyan' | 'light' | 'white';

export type AppLanguage = 
  | 'en' // English (Global)
  | 'hi' // हिन्दी (Hindi)
  | 'hinglish' // Hinglish (India)
  | 'es' // Español (Spanish)
  | 'ar' // العربية (Arabic)
  | 'fr' // Français (French)
  | 'de' // Deutsch (German)
  | 'ru' // Русский (Russian)
  | 'pt' // Português (Portuguese)
  | 'bn' // বাংলা (Bengali)
  | 'ur' // اردو (Urdu)
  | 'id' // Bahasa Indonesia
  | 'ja' // 日本語 (Japanese)
  | 'zh'; // 中文 (Simplified Chinese)

export type AppViewMode = 'auto' | 'mobile' | 'desktop';
export type AppLayout = 'dashboard' | 'bento' | 'passbook' | 'cardstack' | 'compact' | 'minimal';

export type WorkStatus = 'completed' | 'in_progress' | 'pending' | 'on_hold';

export interface WorkLog {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  clientOrCompany?: string;
  category: string;
  status: WorkStatus;
  hoursSpent?: number;
  earningsOrCost?: number;
  notes?: string;
  deliverables?: string[];
  location?: string;
  createdAt: number;
}

export type MoodType = 'happy' | 'productive' | 'normal' | 'tired' | 'stressed' | 'blessed';

export interface DailyLifeLog {
  id: string;
  date: string; // YYYY-MM-DD
  title?: string;
  highlights: string;
  morningRoutine?: string;
  afternoonRoutine?: string;
  eveningRoutine?: string;
  mood?: MoodType;
  wakeTime?: string;
  sleepTime?: string;
  keyLearnings?: string;
  gratitude?: string;
  tags?: string[];
  createdAt: number;
}

export interface FundConfig {
  id: FundType;
  label: string;
  hindiLabel: string;
  defaultPct: number;
  color: string;
  description: string;
  iconName: string;
}

export interface Entry {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  source?: string; // Income source
  note?: string;
  splits?: Record<FundType, number>; // For income entries
  fund?: FundType; // For expense entries
  category?: string; // For expense entries
  paymentMode?: PaymentMode; // Cash, UPI, Bank, Card, Cheque, Wallet, Other
  clientName?: string; // Optional client or reference
  createdAt: number;
  receiptImage?: string;
}

export interface Goal {
  id: string;
  title: string;
  category?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string; // YYYY-MM-DD
  linkedFund?: FundType;
  note?: string;
  icon?: string;
  isCompleted?: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface SecurityLockConfig {
  isEnabled: boolean;
  pin: string; // 4 to 6 digit PIN or password string
  securityQuestion?: string;
  securityQuestionId?: string;
  securityAnswer: string; // Lowercase normalized for recovery
  recoveryHint?: string;
  autoLockOnLeave?: boolean; // Auto-lock when user switches tabs or window loses focus
  autoLockTimeoutMinutes?: number; // 0 = immediate, or 1, 5, 15 min
  createdAt?: number;
  lastUnlockedAt?: number;
}

export type PersonalNoteCategory = 'personal' | 'secret' | 'ideas' | 'todo' | 'important' | 'finance' | 'work' | 'general';

export type PersonalNoteColor = 'default' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  category: PersonalNoteCategory | string;
  color?: PersonalNoteColor;
  isPinned?: boolean;
  isLocked?: boolean; // Can be masked with private lock view
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface KhataSettings {
  percentages: Record<FundType, number>;
  categories: string[];
  incomeSources?: string[];
  workCategories?: string[];
  lifeTags?: string[];
  language: AppLanguage;
  currency?: string;
  currencySymbol?: string;
  theme?: AppTheme;
  userName?: string;
  userRole?: string;
  privacyMask?: boolean;
  viewMode?: AppViewMode;
  appLayout?: AppLayout;
  securityLock?: SecurityLockConfig;
}

export interface KhataData {
  entries: Entry[];
  categories: string[];
  incomeSources?: string[];
  workCategories?: string[];
  lifeTags?: string[];
  goals?: Goal[];
  workLogs?: WorkLog[];
  dailyLifeLogs?: DailyLifeLog[];
  personalNotes?: PersonalNote[];
  settings: {
    percentages: Record<FundType, number>;
    theme?: AppTheme;
    language?: AppLanguage;
    privacyMask?: boolean;
    viewMode?: AppViewMode;
    appLayout?: AppLayout;
    currency?: string;
    currencySymbol?: string;
    securityLock?: SecurityLockConfig;
  };
}

