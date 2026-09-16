import { 
  Building, 
  Laptop, 
  Hammer, 
  Truck, 
  Store, 
  Wrench, 
  GraduationCap, 
  Sprout, 
  Briefcase, 
  Layers 
} from 'lucide-react';
import { AttendanceLog, AttendanceStatus, PaymentStatusType, PaymentMode, FundType } from '../../types';

export interface WorkCategoryMeta {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: any;
  color: string;
  badgeBg: string;
  borderColor: string;
}

export const WORK_CATEGORIES_CATALOG: WorkCategoryMeta[] = [
  { id: 'office', nameEn: 'Office / Job', nameHi: 'प्राइवेट जॉब / ऑफिस', icon: Building, color: 'text-sky-400', badgeBg: 'bg-sky-500/15', borderColor: 'border-sky-500/30' },
  { id: 'freelance', nameEn: 'Freelancing & Remote', nameHi: 'फ्रीलांसिंग / प्रोजेक्ट', icon: Laptop, color: 'text-purple-400', badgeBg: 'bg-purple-500/15', borderColor: 'border-purple-500/30' },
  { id: 'construction', nameEn: 'Construction & Labour', nameHi: 'मजदूरी / कंस्ट्रक्शन', icon: Hammer, color: 'text-amber-400', badgeBg: 'bg-amber-500/15', borderColor: 'border-amber-500/30' },
  { id: 'driver', nameEn: 'Driver & Delivery', nameHi: 'ड्राइवर / डिलीवरी', icon: Truck, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/15', borderColor: 'border-emerald-500/30' },
  { id: 'shop', nameEn: 'Shop & Retail', nameHi: 'दुकान / शोरूम', icon: Store, color: 'text-rose-400', badgeBg: 'bg-rose-500/15', borderColor: 'border-rose-500/30' },
  { id: 'technical', nameEn: 'Technical & Repair', nameHi: 'टेक्निकल / मैकेनिक', icon: Wrench, color: 'text-indigo-400', badgeBg: 'bg-indigo-500/15', borderColor: 'border-indigo-500/30' },
  { id: 'tuition', nameEn: 'Tuition & Teaching', nameHi: 'ट्यूशन / कोचिंग', icon: GraduationCap, color: 'text-teal-400', badgeBg: 'bg-teal-500/15', borderColor: 'border-teal-500/30' },
  { id: 'agriculture', nameEn: 'Farming & Farm', nameHi: 'खेती / किसानी', icon: Sprout, color: 'text-lime-400', badgeBg: 'bg-lime-500/15', borderColor: 'border-lime-500/30' },
  { id: 'services', nameEn: 'Consulting & Services', nameHi: 'कंसल्टिंग / सेवाएं', icon: Briefcase, color: 'text-cyan-400', badgeBg: 'bg-cyan-500/15', borderColor: 'border-cyan-500/30' },
  { id: 'custom', nameEn: 'Other / Custom Work', nameHi: 'अन्य काम', icon: Layers, color: 'text-slate-400', badgeBg: 'bg-slate-500/15', borderColor: 'border-slate-500/30' }
];

export const getWorkCategoryMeta = (catIdOrName?: string): WorkCategoryMeta => {
  if (!catIdOrName) {
    return WORK_CATEGORIES_CATALOG[WORK_CATEGORIES_CATALOG.length - 1];
  }
  const found = WORK_CATEGORIES_CATALOG.find(
    (c) => c.id === catIdOrName.toLowerCase() || 
           c.nameEn.toLowerCase() === catIdOrName.toLowerCase() || 
           c.nameHi === catIdOrName
  );
  if (found) return found;

  return {
    id: 'custom',
    nameEn: catIdOrName,
    nameHi: catIdOrName,
    icon: Briefcase,
    color: 'text-[var(--theme-primary,#38BDF8)]',
    badgeBg: 'bg-[var(--theme-primary,#38BDF8)]/15',
    borderColor: 'border-[var(--theme-primary,#38BDF8)]/30'
  };
};

export interface EmployerSummary {
  name: string;
  primaryCategory: string;
  totalDays: number;
  presentDays: number;
  halfDays: number;
  overtimeHours: number;
  workingHours: number;
  totalEarned: number;
  totalReceived: number;
  totalPending: number;
  pendingLogsCount: number;
  latestDate: string;
}
