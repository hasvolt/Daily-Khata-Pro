import { FundConfig, FundType, Entry, SecurityLockConfig } from '../types';

export const FUND_ORDER: FundType[] = [
  'personal',
  'family',
  'buffer',
  'emergency',
  'saving',
  'investment'
];

export const FUND_CONFIGS: Record<FundType, FundConfig> = {
  personal: {
    id: 'personal',
    label: 'Personal',
    hindiLabel: 'खुद का खर्च (Personal)',
    defaultPct: 30,
    color: '#38BDF8', // Sky / Cyan
    description: 'Personal daily expenses, dining, grooming & lifestyle',
    iconName: 'User'
  },
  family: {
    id: 'family',
    label: 'Family & Home',
    hindiLabel: 'परिवार व घर (Family & Home)',
    defaultPct: 35,
    color: '#FFC700', // Volt Yellow
    description: 'House rent, groceries, family support & home utilities',
    iconName: 'Home'
  },
  buffer: {
    id: 'buffer',
    label: 'Buffer Reserve',
    hindiLabel: 'बफ़र / आकस्मिक (Buffer)',
    defaultPct: 5,
    color: '#818CF8', // Indigo / Slate
    description: 'Quick temporary cushion for unexpected fluctuations',
    iconName: 'ShieldAlert'
  },
  emergency: {
    id: 'emergency',
    label: 'Emergency Fund',
    hindiLabel: 'इमरजेंसी फंड (Emergency)',
    defaultPct: 11.25,
    color: '#F87171', // Red / Rose
    description: 'Medical, urgent repairs & sudden emergency reserve',
    iconName: 'HeartPulse'
  },
  saving: {
    id: 'saving',
    label: 'Liquid Savings',
    hindiLabel: 'सुरक्षित बचत (Saving)',
    defaultPct: 7.5,
    color: '#10B981', // Emerald Green
    description: 'Liquid cash savings & short-term target milestones',
    iconName: 'PiggyBank'
  },
  investment: {
    id: 'investment',
    label: 'Growth & Investment',
    hindiLabel: 'निवेश / भविष्य (Investment)',
    defaultPct: 11.25,
    color: '#F59E0B', // Amber Gold
    description: 'Long-term wealth, SIP, assets & future financial growth',
    iconName: 'TrendingUp'
  }
};

export const FUND_LABELS: Record<FundType, string> = {
  personal: 'Personal',
  family: 'Family & Home',
  buffer: 'Buffer Reserve',
  emergency: 'Emergency Fund',
  saving: 'Liquid Savings',
  investment: 'Growth & Investment'
};

export const DEFAULT_PERCENTAGES: Record<FundType, number> = {
  personal: 30,
  family: 35,
  buffer: 5,
  emergency: 11.25,
  saving: 7.5,
  investment: 11.25
};

export const DEFAULT_CATEGORIES: string[] = [
  'Food & Groceries',
  'Housing & Rent',
  'Utilities & Electricity',
  'Mobile & Internet',
  'Transport & Fuel',
  'Shopping & Apparel',
  'Personal Care & Wellness',
  'Family & Household',
  'Health & Medical',
  'Dining & Entertainment',
  'Education & Upskilling',
  'EMI, Loans & Debt',
  'Software & Subscriptions',
  'Business & Office Expenses',
  'General & Miscellaneous'
];

export const DEFAULT_INCOME_SOURCES: string[] = [
  'Salary & Wages',
  'Business & Sales',
  'Client Invoices',
  'Freelance & Consulting',
  'Rental Income',
  'Investments & Dividends',
  'Bonus & Commissions',
  'Royalties & Digital Products',
  'Services & Contracts',
  'General Income'
];

export const DEFAULT_WORK_CATEGORIES: string[] = [
  'Client Project',
  'Consulting & Advisory',
  'Software & Technology',
  'Design & Creative',
  'Sales & Business Dev',
  'Operations & Management',
  'Service & Maintenance',
  'Research & Analysis',
  'Field Work & Site Tasks',
  'Marketing & Campaigns',
  'Education & Training',
  'General Professional Task'
];

export const DEFAULT_LIFE_TAGS: string[] = [
  'Work',
  'Family',
  'Health',
  'Fitness',
  'Learning',
  'Finance',
  'Travel',
  'Creative',
  'Productivity',
  'Relaxation'
];

export const COMMON_INCOME_SOURCES: { id: string; label: string; iconKey: string }[] = [
  { id: 'salary', label: 'Salary / Wages', iconKey: 'salary' },
  { id: 'business', label: 'Business / Commerce', iconKey: 'business' },
  { id: 'freelance', label: 'Freelance / Consulting', iconKey: 'freelance' },
  { id: 'client', label: 'Client Payments', iconKey: 'client' },
  { id: 'rent', label: 'Rental Income', iconKey: 'rent' },
  { id: 'investment', label: 'Investments / Returns', iconKey: 'investment' },
  { id: 'other', label: 'General / Other', iconKey: 'other' }
];

export const GOAL_PRESETS = [
  { id: 'gp_emergency', title: '6-Month Emergency Runway', iconKey: 'shield', defaultTarget: 100000, category: 'Emergency', defaultFund: 'emergency' as FundType },
  { id: 'gp_bike', title: 'Vehicle & Transportation', iconKey: 'bike', defaultTarget: 85000, category: 'Mobility', defaultFund: 'saving' as FundType },
  { id: 'gp_laptop', title: 'Workstation & Professional Tech', iconKey: 'laptop', defaultTarget: 75000, category: 'Equipment', defaultFund: 'saving' as FundType },
  { id: 'gp_phone', title: 'Mobile Device Upgrade', iconKey: 'phone', defaultTarget: 35000, category: 'Electronics', defaultFund: 'personal' as FundType },
  { id: 'gp_house', title: 'Property & Home Improvement', iconKey: 'home', defaultTarget: 200000, category: 'Real Estate', defaultFund: 'family' as FundType },
  { id: 'gp_travel', title: 'Travel & Vacation Fund', iconKey: 'travel', defaultTarget: 50000, category: 'Leisure', defaultFund: 'personal' as FundType },
  { id: 'gp_gold', title: 'Asset & Gold Reserve', iconKey: 'gold', defaultTarget: 100000, category: 'Wealth Asset', defaultFund: 'investment' as FundType },
  { id: 'gp_education', title: 'Executive Certifications & Degrees', iconKey: 'education', defaultTarget: 40000, category: 'Professional Growth', defaultFund: 'saving' as FundType }
];

export const SECURITY_QUESTIONS = [
  { id: 'pet', label: "What was the name of your first pet?", hindiLabel: "आपके पहले पालतू जानवर (Pet) का क्या नाम था?" },
  { id: 'city', label: "What is your birthplace / hometown?", hindiLabel: "आपका जन्म स्थान या गृहनगर (City) कौन सा है?" },
  { id: 'school', label: "What was the name of your first school?", hindiLabel: "आपके पहले स्कूल का क्या नाम था?" },
  { id: 'food', label: "What is your favorite comfort food?", hindiLabel: "आपका पसंदीदा भोजन या मिठाई क्या है?" },
  { id: 'hero', label: "Who was your childhood favorite hero/mentor?", hindiLabel: "आपके बचपन का पसंदीदा हीरो या मेंटर कौन था?" },
  { id: 'custom', label: "Custom Secret Phrase / Pin Reminder", hindiLabel: "कस्टम गुप्त शब्द या पिन याद दिलाने वाला संकेत" }
];

export const DEFAULT_SECURITY_LOCK: SecurityLockConfig = {
  isEnabled: false,
  pin: '',
  securityQuestion: "What was the name of your first pet?",
  securityAnswer: '',
  recoveryHint: '',
  autoLockOnLeave: true,
  autoLockTimeoutMinutes: 0
};

export const DEFAULT_NOTE_CATEGORIES = [
  { id: 'personal', label: 'Personal & Thoughts', hindiLabel: 'व्यक्तिगत विचार' },
  { id: 'secret', label: 'Secret & Private', hindiLabel: 'गोपनीय व गुप्त' },
  { id: 'ideas', label: 'Ideas & Innovation', hindiLabel: 'आइडियाज व योजना' },
  { id: 'todo', label: 'Checklist / Tasks', hindiLabel: 'टू-डू लिस्ट व कार्य' },
  { id: 'important', label: 'Important & Keys', hindiLabel: 'महत्वपूर्ण जानकारी' },
  { id: 'finance', label: 'Finance Reminders', hindiLabel: 'वित्तीय रिमाइंडर्स' },
  { id: 'work', label: 'Work & Business', hindiLabel: 'कार्य व व्यापार' },
  { id: 'general', label: 'General Memo', hindiLabel: 'सामान्य मेमो' }
];

export const INITIAL_SAMPLE_PERSONAL_NOTES = [
  {
    id: 'note_welcome',
    title: '✨ Welcome to Your Private Vault (पर्सनल नोट्स)',
    content: 'This is your completely separate personal scratchpad & private vault!\n\n• 100% Offline & Stored only in your local browser storage.\n• Keep ideas, secret credentials, personal reminders, daily checklists, and reflections.\n• Pin important notes to the top or toggle secret mask to hide sensitive text in public.',
    category: 'personal',
    color: 'emerald' as const,
    isPinned: true,
    isLocked: false,
    tags: ['Welcome', 'Private', 'Guide'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000
  }
];

export const INITIAL_SAMPLE_ENTRIES: Entry[] = [
  {
    id: 'demo_1',
    type: 'income',
    amount: 25000,
    date: new Date().toISOString().slice(0, 10),
    source: 'Salary & Wages',
    note: 'Professional monthly revenue credit',
    paymentMode: 'bank',
    splits: {
      personal: 7500,
      family: 8750,
      buffer: 1250,
      emergency: 2812.5,
      saving: 1875,
      investment: 2812.5
    },
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'demo_2',
    type: 'expense',
    amount: 1450,
    date: new Date().toISOString().slice(0, 10),
    category: 'Food & Groceries',
    fund: 'family',
    paymentMode: 'upi',
    note: 'Weekly essentials and household groceries',
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'demo_3',
    type: 'expense',
    amount: 600,
    date: new Date().toISOString().slice(0, 10),
    category: 'Transport & Fuel',
    fund: 'personal',
    paymentMode: 'upi',
    note: 'Vehicle fuel and commute recharge',
    createdAt: Date.now() - 3600000 * 1
  }
];
