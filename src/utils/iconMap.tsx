import React from 'react';
import {
  Briefcase,
  Store,
  Laptop,
  Users,
  Home,
  TrendingUp,
  Gift,
  ShieldCheck,
  Bike,
  Smartphone,
  Plane,
  Coins,
  GraduationCap,
  Target,
  ShoppingBag,
  Utensils,
  Zap,
  Wifi,
  Fuel,
  HeartPulse,
  Film,
  Building,
  Building2,
  CreditCard,
  Layers,
  PiggyBank,
  User,
  ShieldAlert,
  HelpCircle,
  FolderGit2,
  Headphones,
  Wrench,
  LineChart,
  Code,
  FileSpreadsheet,
  Globe,
  Sparkles,
  BookOpen,
  Smile,
  Compass,
  Moon,
  Flame,
  Brain,
  LucideIcon
} from 'lucide-react';
import { MoodType } from '../types';

export const ICON_MAP: Record<string, LucideIcon> = {
  // Income sources
  salary: Briefcase,
  business: Store,
  freelance: Laptop,
  client: Users,
  rent: Home,
  investment: TrendingUp,
  other: Gift,

  // Goal presets
  shield: ShieldCheck,
  bike: Bike,
  laptop: Laptop,
  phone: Smartphone,
  home: Home,
  travel: Plane,
  gold: Coins,
  education: GraduationCap,
  target: Target,

  // Expense categories
  food: Utensils,
  bills: Zap,
  rent_exp: Building,
  mobile: Wifi,
  fuel: Fuel,
  shopping: ShoppingBag,
  health: HeartPulse,
  entertainment: Film,
  family_exp: Users,
  loan: CreditCard,
  misc: Layers,
  
  // Funds
  personal: User,
  family: Home,
  fund_business: Briefcase,
  buffer: ShieldAlert,
  emergency: HeartPulse,
  saving: PiggyBank,
  fund_investment: TrendingUp
};

export const AVAILABLE_FUND_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: 'User', label: 'Personal / Self', icon: User },
  { name: 'Home', label: 'Family & Home', icon: Home },
  { name: 'Briefcase', label: 'Business / Work', icon: Briefcase },
  { name: 'Store', label: 'Shop / Commerce', icon: Store },
  { name: 'ShieldAlert', label: 'Buffer / Security', icon: ShieldAlert },
  { name: 'HeartPulse', label: 'Emergency / Health', icon: HeartPulse },
  { name: 'PiggyBank', label: 'Savings / Pot', icon: PiggyBank },
  { name: 'TrendingUp', label: 'Investment / Growth', icon: TrendingUp },
  { name: 'Coins', label: 'Gold / Assets', icon: Coins },
  { name: 'GraduationCap', label: 'Education / Skill', icon: GraduationCap },
  { name: 'ShoppingBag', label: 'Shopping / Lifestyle', icon: ShoppingBag },
  { name: 'Bike', label: 'Vehicle / Transport', icon: Bike },
  { name: 'Plane', label: 'Travel / Trips', icon: Plane },
  { name: 'Smartphone', label: 'Tech / Gadgets', icon: Smartphone },
  { name: 'CreditCard', label: 'EMI / Loans', icon: CreditCard },
  { name: 'Building', label: 'Property / Office', icon: Building },
  { name: 'Gift', label: 'Charity / Donation', icon: Gift },
  { name: 'Sparkles', label: 'Special / Luxury', icon: Sparkles },
  { name: 'Layers', label: 'General / Reserve', icon: Layers }
];

export const getFundIcon = (fundId: string, iconName?: string): LucideIcon => {
  if (iconName) {
    const matched = AVAILABLE_FUND_ICONS.find((item) => item.name.toLowerCase() === iconName.toLowerCase());
    if (matched) return matched.icon;
  }
  const id = fundId.toLowerCase();
  if (id === 'personal') return User;
  if (id === 'family') return Home;
  if (id === 'business') return Briefcase;
  if (id === 'buffer') return ShieldAlert;
  if (id === 'emergency') return HeartPulse;
  if (id === 'saving') return PiggyBank;
  if (id === 'investment') return TrendingUp;
  if (id.includes('shop') || id.includes('retail')) return Store;
  if (id.includes('health') || id.includes('medic')) return HeartPulse;
  if (id.includes('travel') || id.includes('trip') || id.includes('tour')) return Plane;
  if (id.includes('vehic') || id.includes('car') || id.includes('bike')) return Bike;
  if (id.includes('educat') || id.includes('study') || id.includes('school')) return GraduationCap;
  if (id.includes('tech') || id.includes('gadget') || id.includes('phone')) return Smartphone;
  if (id.includes('gift') || id.includes('charity') || id.includes('zakat')) return Gift;
  if (id.includes('gold') || id.includes('asset') || id.includes('crypto')) return Coins;
  return Layers;
};

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const cat = categoryName.toLowerCase();
  if (cat.includes('food') || cat.includes('grocer') || cat.includes('dining') || cat.includes('meal')) return Utensils;
  if (cat.includes('utilit') || cat.includes('bill') || cat.includes('electric') || cat.includes('power')) return Zap;
  if (cat.includes('rent') || cat.includes('hous') || cat.includes('estate') || cat.includes('propert')) return Building;
  if (cat.includes('mobile') || cat.includes('internet') || cat.includes('wifi') || cat.includes('phone')) return Wifi;
  if (cat.includes('fuel') || cat.includes('petrol') || cat.includes('transport') || cat.includes('transit') || cat.includes('commute')) return Fuel;
  if (cat.includes('shop') || cat.includes('cloth') || cat.includes('apparel') || cat.includes('store')) return ShoppingBag;
  if (cat.includes('health') || cat.includes('medic') || cat.includes('doctor') || cat.includes('wellness') || cat.includes('pharma')) return HeartPulse;
  if (cat.includes('entertain') || cat.includes('movie') || cat.includes('leisure') || cat.includes('stream')) return Film;
  if (cat.includes('family') || cat.includes('home') || cat.includes('household') || cat.includes('child')) return Users;
  if (cat.includes('emi') || cat.includes('loan') || cat.includes('card') || cat.includes('debt')) return CreditCard;
  if (cat.includes('educat') || cat.includes('fee') || cat.includes('school') || cat.includes('course') || cat.includes('cert')) return GraduationCap;
  if (cat.includes('softwar') || cat.includes('subscript') || cat.includes('cloud') || cat.includes('saas') || cat.includes('tech')) return Code;
  if (cat.includes('offic') || cat.includes('business') || cat.includes('suppl') || cat.includes('client')) return Building2;
  if (cat.includes('person') || cat.includes('care') || cat.includes('groom') || cat.includes('self')) return User;
  return Layers;
};

export const getSourceIcon = (sourceIdOrName: string): LucideIcon => {
  const src = sourceIdOrName.toLowerCase();
  if (src.includes('salary') || src.includes('wage') || src.includes('job') || src.includes('employ')) return Briefcase;
  if (src.includes('business') || src.includes('store') || src.includes('shop') || src.includes('retail') || src.includes('sales')) return Store;
  if (src.includes('freelance') || src.includes('tech') || src.includes('dev') || src.includes('contract')) return Laptop;
  if (src.includes('client') || src.includes('invoice') || src.includes('consult')) return Users;
  if (src.includes('rent') || src.includes('tenant') || src.includes('estate')) return Home;
  if (src.includes('invest') || src.includes('dividend') || src.includes('stock') || src.includes('sip') || src.includes('interest')) return TrendingUp;
  if (src.includes('bonus') || src.includes('incentive') || src.includes('commiss')) return Sparkles;
  if (src.includes('royalt') || src.includes('digital') || src.includes('course')) return Globe;
  return Gift;
};

export const getWorkCategoryIcon = (catName: string): LucideIcon => {
  const c = catName.toLowerCase();
  if (c.includes('consult') || c.includes('advisor')) return Users;
  if (c.includes('tech') || c.includes('software') || c.includes('code') || c.includes('dev')) return Code;
  if (c.includes('design') || c.includes('creative') || c.includes('art')) return Sparkles;
  if (c.includes('sales') || c.includes('marketing') || c.includes('deal')) return LineChart;
  if (c.includes('service') || c.includes('repair') || c.includes('maint')) return Wrench;
  if (c.includes('operat') || c.includes('manage') || c.includes('admin')) return Building2;
  if (c.includes('research') || c.includes('analys')) return FileSpreadsheet;
  if (c.includes('field') || c.includes('site') || c.includes('locat')) return Compass;
  if (c.includes('educat') || c.includes('teach') || c.includes('train')) return BookOpen;
  return Briefcase;
};

export const getGoalIcon = (iconKey?: string): LucideIcon => {
  if (!iconKey) return Target;
  const k = iconKey.toLowerCase();
  if (k.includes('emergency') || k.includes('shield')) return ShieldCheck;
  if (k.includes('bike') || k.includes('vehicle') || k.includes('car') || k.includes('auto')) return Bike;
  if (k.includes('laptop') || k.includes('computer') || k.includes('workstation')) return Laptop;
  if (k.includes('phone') || k.includes('mobile')) return Smartphone;
  if (k.includes('house') || k.includes('home') || k.includes('property') || k.includes('real')) return Home;
  if (k.includes('travel') || k.includes('trip') || k.includes('vacation') || k.includes('flight')) return Plane;
  if (k.includes('gold') || k.includes('asset') || k.includes('coin') || k.includes('bullion')) return Coins;
  if (k.includes('education') || k.includes('study') || k.includes('degree') || k.includes('course')) return GraduationCap;
  return Target;
};

export const getMoodVisual = (mood?: MoodType): { icon: LucideIcon; labelEn: string; labelHi: string; color: string; bg: string } => {
  switch (mood) {
    case 'productive':
      return { icon: Zap, labelEn: 'Productive & Focused', labelHi: 'ऊर्जावान व केंद्रित', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' };
    case 'happy':
      return { icon: Smile, labelEn: 'Positive & Joyful', labelHi: 'प्रसन्न व सकारात्मक', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
    case 'blessed':
      return { icon: Sparkles, labelEn: 'Grateful & Fulfilled', labelHi: 'शुक्रगुजार व संतुष्ट', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' };
    case 'normal':
      return { icon: Compass, labelEn: 'Calm & Balanced', labelHi: 'शांत व संतुलित', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' };
    case 'tired':
      return { icon: Moon, labelEn: 'Fatigued / Rest Needed', labelHi: 'थकावट / आराम जरूरी', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
    case 'stressed':
      return { icon: Flame, labelEn: 'High Pressure / Busy', labelHi: 'अत्यधिक व्यस्त / तनाव', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' };
    default:
      return { icon: Brain, labelEn: 'Mindful & Steady', labelHi: 'स्थिर व केंद्रित', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' };
  }
};
