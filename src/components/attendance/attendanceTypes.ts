import type { LucideIcon } from 'lucide-react';
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
  Layers,
  Coffee,
  Fuel,
  ShoppingBag,
  Stethoscope,
  Smartphone,
  Home,
  Key,
  Banknote,
  Gift
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
  totalAdvance: number;
  totalPending: number;
  pendingLogsCount: number;
  latestDate: string;
}

export interface AdvanceReasonMeta {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  color?: string;
}

export const ADVANCE_REASONS_CATALOG: AdvanceReasonMeta[] = [
  { id: 'chai_nashta', labelEn: 'Tea / Snacks', labelHi: 'चाय-नाश्ता', icon: Coffee, color: 'text-amber-400' },
  { id: 'petrol_travel', labelEn: 'Petrol / Travel', labelHi: 'पेट्रोल / यात्रा किराया', icon: Fuel, color: 'text-sky-400' },
  { id: 'kirana_food', labelEn: 'Groceries / Food', labelHi: 'राशन / भोजन खर्च', icon: ShoppingBag, color: 'text-emerald-400' },
  { id: 'medical_emergency', labelEn: 'Medicine / Health', labelHi: 'दवा / इलाज खर्च', icon: Stethoscope, color: 'text-rose-400' },
  { id: 'mobile_recharge', labelEn: 'Mobile Recharge', labelHi: 'मोबाइल रिचार्ज', icon: Smartphone, color: 'text-indigo-400' },
  { id: 'urgent_personal', labelEn: 'Personal / Household', labelHi: 'घरेलू / जरूरी कार्य', icon: Home, color: 'text-purple-400' },
  { id: 'tools_material', labelEn: 'Tools / Materials', labelHi: 'सामान / औजार खरीदी', icon: Wrench, color: 'text-cyan-400' },
  { id: 'room_rent', labelEn: 'Room Rent', labelHi: 'कमरा किराया / रूम भाड़ा', icon: Key, color: 'text-yellow-400' },
  { id: 'kharcha_general', labelEn: 'Daily Expenses', labelHi: 'रोजमर्रा जेब खर्च', icon: Banknote, color: 'text-green-400' },
  { id: 'festival_gift', labelEn: 'Festival / Bonus Adv', labelHi: 'त्यौहार / पर्व खर्च', icon: Gift, color: 'text-pink-400' }
];

export const getAdvanceReasonLabel = (reason?: string, isHindi: boolean = true): string => {
  if (!reason || !reason.trim()) return isHindi ? 'सामान्य पेशगी' : 'General Advance';
  // Strip legacy emojis if present
  const cleanReason = reason.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  const found = ADVANCE_REASONS_CATALOG.find(
    (r) => r.id === cleanReason.toLowerCase() || 
           r.labelEn.toLowerCase() === cleanReason.toLowerCase() || 
           r.labelHi === cleanReason
  );
  if (found) {
    return isHindi ? found.labelHi : found.labelEn;
  }
  return cleanReason;
};

export const getAdvanceReasonMeta = (reason?: string): AdvanceReasonMeta => {
  if (!reason) return ADVANCE_REASONS_CATALOG[8];
  const cleanReason = reason.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  const found = ADVANCE_REASONS_CATALOG.find(
    (r) => r.id === cleanReason.toLowerCase() || 
           r.labelEn.toLowerCase() === cleanReason.toLowerCase() || 
           r.labelHi === cleanReason
  );
  return found || {
    id: 'custom',
    labelEn: cleanReason,
    labelHi: cleanReason,
    icon: Banknote,
    color: 'text-amber-400'
  };
};

/**
 * Standardized advance calculation helper
 */
export const calculateLogAdvanceTotal = (log: AttendanceLog): number => {
  if (log.advances && log.advances.length > 0) {
    return log.advances.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  return log.advanceReceived || 0;
};

/**
 * Standardized Net Due calculation helper
 */
export const calculateLogPendingDue = (log: AttendanceLog): number => {
  if (log.pendingPayment !== undefined && log.pendingPayment !== null) {
    return Math.max(0, log.pendingPayment);
  }
  const wage = log.salaryOrRate || 0;
  const received = log.paymentReceived || 0;
  const advance = calculateLogAdvanceTotal(log);
  return Math.max(0, wage - received - advance);
};

/**
 * Derive payment status from wage figures
 */
export const derivePaymentStatus = (salaryOrRate: number, received: number, advance: number): PaymentStatusType => {
  const netDue = Math.max(0, salaryOrRate - received - advance);
  if (salaryOrRate <= 0) return 'paid';
  if (netDue <= 0) return 'paid';
  if (received > 0 || advance > 0) return 'partial';
  return 'pending';
};

