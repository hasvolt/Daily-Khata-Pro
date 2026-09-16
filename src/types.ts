export type FundType = 'personal' | 'family' | 'business' | 'buffer' | 'emergency' | 'saving' | 'investment' | (string & {});

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export type TransactionType = 'income' | 'expense';

export type PaymentMode = 'cash' | 'upi' | 'bank' | 'card' | 'cheque' | 'wallet' | 'other';

export type AppTheme = 'blue' | 'yellow' | 'orange' | 'emerald' | 'purple' | 'cyan' | 'light' | 'white' | 'pink' | 'black';

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
  hindiLabel?: string;
  defaultPct: number;
  color: string;
  description: string;
  iconName?: string;
  isCustom?: boolean;
}

export interface Entry {
  id: string;
  bookId?: string; // ID of KhataBook (e.g. 'book-default' for Personal, 'book-business' for Business)
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  source?: string; // Income source
  note?: string;
  splits?: Record<FundType, number>; // For income entries
  fund?: FundType; // For expense entries or single-fund income
  allocationMode?: 'all' | 'single'; // 'all' = split across all funds, 'single' = direct to 1 fund
  targetFund?: FundType; // specific fund when single fund was chosen
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

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'overtime';
export type PaymentStatusType = 'paid' | 'pending' | 'partial';

export interface AttendanceLog {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  status: AttendanceStatus;
  overtimeHours?: number;
  workingHours?: number;
  
  // Payment tracking
  salaryOrRate?: number;
  paymentReceived?: number;
  advanceReceived?: number;
  pendingPayment?: number;
  paymentDate?: string;
  paymentStatus: PaymentStatusType;
  paymentNotes?: string;
  
  // Work details
  employerName?: string;
  workAddress?: string;
  workType?: string; // Nature of work
  workCategory?: string; // Standardized or custom work category
  jobDescription?: string;
  workStartDate?: string;
  workEndDate?: string;
  notes?: string;
  
  createdAt: number;
  updatedAt?: number;
}

export type ReminderType = 'payment' | 'khata' | 'attendance' | 'custom' | 'activity';

export interface AppReminder {
  id: string;
  type: ReminderType;
  title: string;
  description?: string;
  amount?: number;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  isCompleted: boolean;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  notifyViaBrowser?: boolean;
  lastNotifiedAt?: number;
  createdAt: number;
}

export type TrashItemType = 'entry' | 'goal' | 'note' | 'work_log' | 'daily_log' | 'calc_history' | 'attendance_log' | 'reminder' | 'debt';

export interface TrashItem {
  id: string;
  originalId: string;
  type: TrashItemType;
  title: string;
  subtitle?: string;
  amount?: number;
  dateDeleted: string; // ISO string
  data: any; // Original payload for complete lossless restoration
}

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
  funds?: FundConfig[];
  homepageFundIds?: string[];
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
  funds?: FundConfig[];
  homepageFundIds?: string[];
  categories: string[];
  incomeSources?: string[];
  workCategories?: string[];
  lifeTags?: string[];
  goals?: Goal[];
  workLogs?: WorkLog[];
  dailyLifeLogs?: DailyLifeLog[];
  personalNotes?: PersonalNote[];
  attendanceLogs?: AttendanceLog[];
  reminders?: AppReminder[];
  settings: {
    percentages: Record<FundType, number>;
    funds?: FundConfig[];
    homepageFundIds?: string[];
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

export interface CategoryBudget {
  category: string;
  monthlyLimit: number;
}

export interface KhataBook {
  id: string;
  name: string;
  type: 'personal' | 'business' | 'family' | 'custom';
  color?: string;
  icon?: string;
  isDefault?: boolean;
}

export interface BillSplitParticipant {
  id: string;
  name: string;
  paidAmount: number;
}

export interface BillSplitExpense {
  id: string;
  title: string;
  totalAmount: number;
  date: string;
  participants: BillSplitParticipant[];
  payerId: string;
  settled: boolean;
}

export type DebtType = 'lent' | 'borrowed' | 'loan_emi';

export interface DebtPayment {
  id: string;
  debtId?: string;
  amount: number;
  date: string;
  paymentMode?: PaymentMode;
  paymentMethod?: string;
  note?: string;
  recordedInKhata?: boolean;
  khataFund?: FundType;
  createdAt: number;
}

export interface DebtItem {
  id: string;
  type: DebtType; // 'lent' = उधार दिया, 'borrowed' = उधार लिया, 'loan_emi' = बैंक/फाइनेंस लोन
  title: string; // Person Name or Bank/Institution (e.g. Ramesh Kumar, HDFC Bank, SBI Car Loan)
  personName?: string;
  personPhone?: string;
  phone?: string;
  lenderOrBorrower?: string;
  principalAmount: number; // Initial total loan / udhar amount
  initialAmount?: number; // Initial total loan / udhar amount
  remainingAmount: number; // Remaining balance
  startDate: string; // YYYY-MM-DD
  dueDate?: string; // Repayment target date or next EMI due date
  
  // Bank Loan / EMI specifics
  isEmi?: boolean;
  emiAmount?: number; // Monthly EMI
  emiDayOfMonth?: number; // e.g. 5 for 5th of each month
  emiFrequency?: string;
  totalEmis?: number;
  paidEmis?: number;
  interestRate?: number; // Annual %
  loanAccountNumber?: string;
  
  status: 'active' | 'settled' | 'overdue';
  payments: DebtPayment[];
  category?: string; // 'Personal', 'Business', 'Friends & Family', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Other'
  note?: string;
  createdAt: number;
  updatedAt: number;
}

