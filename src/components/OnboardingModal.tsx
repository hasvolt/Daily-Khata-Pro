import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Globe,
  Coins,
  Briefcase,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Store,
  HardHat,
  Factory,
  Tractor,
  Home as HomeIcon,
  UserCheck,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { AppLanguage, UserPurpose } from '../types';
import { triggerCelebration, triggerHapticSound } from '../utils/khataCalculations';

export interface OnboardingData {
  language: AppLanguage;
  currency: string;
  purpose: UserPurpose;
}

interface OnboardingModalProps {
  isOpen: boolean;
  currentLanguage: AppLanguage;
  currentCurrency?: string;
  currentPurpose?: UserPurpose;
  onComplete: (data: OnboardingData) => void;
  onLanguageChange?: (lang: AppLanguage) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
}

interface LanguageOption {
  id: AppLanguage;
  label: string;
  sub: string;
  native: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'hi', label: 'हिन्दी', sub: 'Hindi', native: 'नमस्ते' },
  { id: 'en', label: 'English', sub: 'Global', native: 'Welcome' },
  { id: 'hinglish', label: 'Hinglish', sub: 'India', native: 'Namaste' },
  { id: 'mr', label: 'मराठी', sub: 'Marathi', native: 'नमस्कार' },
  { id: 'gu', label: 'ગુજરાતી', sub: 'Gujarati', native: 'નમસ્તે' },
  { id: 'pa', label: 'ਪੰਜਾਬੀ', sub: 'Punjabi', native: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' },
  { id: 'ta', label: 'தமிழ்', sub: 'Tamil', native: 'வணக்கம்' },
  { id: 'te', label: 'తెలుగు', sub: 'Telugu', native: 'నమస్కారం' },
  { id: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada', native: 'ನಮಸ್ಕಾರ' },
  { id: 'ml', label: 'മലയാളം', sub: 'Malayalam', native: 'നമസ്കാരം' },
  { id: 'or', label: 'ଓଡ଼ିଆ', sub: 'Odia', native: 'ନମସ୍କାର' },
  { id: 'as', label: 'অসমীয়া', sub: 'Assamese', native: 'নমস্কাৰ' },
  { id: 'ne', label: 'नेपाली', sub: 'Nepali', native: 'नमस्ते' },
  { id: 'ur', label: 'اردو', sub: 'Urdu', native: 'خوش آمدید' },
  { id: 'bn', label: 'বাংলা', sub: 'Bengali', native: 'নমস্কার' },
  { id: 'ar', label: 'العربية', sub: 'Arabic', native: 'مرحباً' },
  { id: 'es', label: 'Español', sub: 'Spanish', native: 'Bienvenido' },
  { id: 'fr', label: 'Français', sub: 'French', native: 'Bienvenue' },
  { id: 'de', label: 'Deutsch', sub: 'German', native: 'Willkommen' },
  { id: 'ru', label: 'Русский', sub: 'Russian', native: 'Добро пожаловать' },
  { id: 'pt', label: 'Português', sub: 'Portuguese', native: 'Bem-vindo' },
  { id: 'id', label: 'Bahasa Indonesia', sub: 'Indonesian', native: 'Selamat Datang' },
  { id: 'ja', label: '日本語', sub: 'Japanese', native: 'ようこそ' },
  { id: 'zh', label: '中文 (简体)', sub: 'Chinese', native: '欢迎' }
];

interface CountryOption {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'IN', name: 'India (भारत)', currency: 'INR', symbol: '₹', flag: '🇮🇳' },
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€', flag: '🇪🇺' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', symbol: '৳', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', symbol: '₨', flag: '🇵🇰' },
  { code: 'NP', name: 'Nepal', currency: 'NPR', symbol: 'रू', flag: '🇳🇵' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: '$', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: '$', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: '$', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', symbol: 'RM', flag: '🇲🇾' },
  { code: 'QA', name: 'Qatar', currency: 'QAR', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'OM', name: 'Oman', currency: 'OMR', symbol: 'ر.ع', flag: '🇴🇲' }
];

interface PurposeOption {
  id: UserPurpose;
  icon: React.ComponentType<{ className?: string }>;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  badge: string;
  color: string;
}

const PURPOSES: PurposeOption[] = [
  {
    id: 'shop',
    icon: Store,
    titleHi: 'दुकान व रिटेल (Shop & Retail)',
    titleEn: 'Shop & Retail Store',
    descHi: 'किराना, कपड़ा, जनरल स्टोर, शोरूम, मेडिकल व ग्राहक उधारी खाता',
    descEn: 'Grocery, retail, counter cash, customer ledger, supplier payments',
    badge: 'लोकप्रिय / Popular',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400'
  },
  {
    id: 'construction',
    icon: HardHat,
    titleHi: 'ठेकेदारी व निर्माण (Contractor & Sites)',
    titleEn: 'Contractor & Construction',
    descHi: 'सिविल, इलेक्ट्रीशियन, प्लंबर, पेंटर, साइट व मजदूर हाजिरी-मजदूरी',
    descEn: 'Civil, electrical, site expenses, labour wages, client billing',
    badge: 'ठेकेदार / Contractor',
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/40 text-sky-400'
  },
  {
    id: 'factory',
    icon: Factory,
    titleHi: 'कारखाना व वर्कशॉप (Factory & Workshop)',
    titleEn: 'Factory & Small Manufacturing',
    descHi: 'लघु उद्योग, वर्कशॉप, कारीगर वेतन, कच्चा माल व मशीनरी खर्च',
    descEn: 'Small factory, workshop, raw materials, worker wages, machinery',
    badge: 'उद्योग / Industry',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400'
  },
  {
    id: 'farm',
    icon: Tractor,
    titleHi: 'खेत व किसानी (Farm & Krishi)',
    titleEn: 'Farm & Agriculture',
    descHi: 'फसल मंडी बिक्री, खाद-बीज खर्च, खेत मजदूर व ट्रैक्टर डीजल हिसाब',
    descEn: 'Crop harvest, seeds & fertilizer, farm labour, mandi sales, tractor',
    badge: 'किसान / Farmer',
    color: 'from-lime-500/20 to-emerald-500/10 border-lime-500/40 text-lime-400'
  },
  {
    id: 'household',
    icon: HomeIcon,
    titleHi: 'घर व परिवार (Household & Family)',
    titleEn: 'Household & Family Budget',
    descHi: 'मासिक राशन, बाई/ड्राइवर/कुक वेतन, बिजली बिल व पारिवारिक बचत',
    descEn: 'Monthly groceries, maid/cook wages, utility bills, family savings',
    badge: 'परिवार / Family',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400'
  },
  {
    id: 'personal',
    icon: UserCheck,
    titleHi: 'पर्सनल व फ्रीलांसर (Personal Finance)',
    titleEn: 'Personal Finance & Freelance',
    descHi: 'सैलरी, साइड इनकम, लोन ईएमआई, व्यक्तिगत खर्च व बचत लक्ष्य',
    descEn: 'Salary income, side earnings, loan EMI, daily spends, wealth goals',
    badge: 'पर्सनल / Personal',
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-400'
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentLanguage,
  currentCurrency = 'INR',
  currentPurpose = 'shop',
  onComplete,
  onLanguageChange,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(currentLanguage);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currentCurrency);
  const [selectedPurpose, setSelectedPurpose] = useState<UserPurpose>(currentPurpose);
  const [policyAgreed, setPolicyAgreed] = useState<boolean>(false);

  if (!isOpen) return null;

  const isHindi = selectedLang === 'hi' || selectedLang === 'hinglish';

  const handleLangSelect = (lang: AppLanguage) => {
    setSelectedLang(lang);
    triggerHapticSound('click');
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const handleCountrySelect = (c: CountryOption) => {
    setSelectedCurrency(c.currency);
    triggerHapticSound('click');
  };

  const handlePurposeSelect = (p: UserPurpose) => {
    setSelectedPurpose(p);
    triggerHapticSound('click');
  };

  const handleNext = () => {
    triggerHapticSound('click');
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    triggerHapticSound('click');
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleFinish = () => {
    if (!policyAgreed) return;
    triggerCelebration();
    localStorage.setItem('daily-khata-onboarded-v1', 'true');
    localStorage.setItem('daily-khata-user-purpose', selectedPurpose);
    onComplete({
      language: selectedLang,
      currency: selectedCurrency,
      purpose: selectedPurpose
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--theme-card,#0D1B2A)] border border-[var(--theme-border,#1E3A5F)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Progress & Header */}
        <div className="px-5 sm:px-8 pt-6 pb-4 border-b border-[var(--theme-border,#1E3A5F)]/60 bg-gradient-to-r from-sky-500/10 via-transparent to-emerald-500/10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                DK
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                  Daily Khata Pro
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Rozfiber
                  </span>
                </h2>
                <p className="text-xs text-[var(--theme-text-muted,#8BA4D0)]">
                  {isHindi ? 'त्वरित सेटअप विजार्ड (Quick Setup)' : 'Universal Setup Wizard'}
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-700/50">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    step === s
                      ? 'w-6 bg-sky-400'
                      : step > s
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
              <span className="text-[11px] font-mono font-bold text-slate-300 ml-1">
                {step}/4
              </span>
            </div>
          </div>

          {/* Step Title & Subtitle */}
          <div>
            {step === 1 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  अपनी पसंदीदा भाषा चुनें (Select Language)
                </h3>
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted,#8BA4D0)] mt-0.5">
                  16+ भारतीय व वैश्विक भाषाएँ उपलब्ध हैं। भाषा चुनते ही ऐप तुरंत उस भाषा में हो जाएगा।
                </p>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  {isHindi ? 'देश व मुद्रा चुनें (Country & Currency)' : 'Select Country & Currency'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted,#8BA4D0)] mt-0.5">
                  {isHindi
                    ? 'अपने व्यापार या देश के अनुसार सही करेंसी चुनें (बाद में कभी भी बदल सकते हैं)'
                    : 'Choose your preferred currency format. You can change this anytime.'}
                </p>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  {isHindi ? 'आप ऐप किस चीज़ के लिए उपयोग करेंगे?' : 'What will you use the app for?'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted,#8BA4D0)] mt-0.5">
                  {isHindi
                    ? 'आपके चुनाव के अनुसार होमपेज पर कस्टमाइज़्ड शॉर्टकट्स व लेजर टूल्स दिखेंगे।'
                    : 'Your homepage will be tailored with customized shortcuts for your workflow.'}
                </p>
              </div>
            )}
            {step === 4 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  {isHindi ? 'गोपनीयता नीति व अंतिम सहमति' : 'Privacy & Security Guarantee'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted,#8BA4D0)] mt-0.5">
                  {isHindi
                    ? '100% ऑफ़लाइन, बिना सर्वर ट्रैकिंग, सारा डेटा केवल आपके अपने डिवाइस में सुरक्षित।'
                    : '100% Offline, Zero Server Tracking. Your private financial data stays entirely on your device.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          
          {/* STEP 1: LANGUAGES */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {LANGUAGES.map((l) => {
                const isSelected = selectedLang === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleLangSelect(l.id)}
                    className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-[var(--theme-text,#F8FAFC)] shadow-md shadow-sky-500/10 ring-2 ring-sky-400/40'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[15px]">{l.label}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-muted,#8BA4D0)]">
                      <span>{l.sub}</span>
                      <span className="font-medium opacity-75">{l.native}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2: COUNTRIES & CURRENCY */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COUNTRIES.map((c) => {
                const isSelected = selectedCurrency === c.currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-[var(--theme-text,#F8FAFC)] shadow-md ring-2 ring-amber-400/40'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="font-bold text-sm text-[var(--theme-text,#F8FAFC)]">{c.name}</div>
                        <div className="text-xs text-[var(--theme-text-muted,#8BA4D0)] font-mono">
                          {c.currency} ({c.symbol})
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 3: PURPOSE / KIS CHIZ KE LIYE */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PURPOSES.map((p) => {
                const isSelected = selectedPurpose === p.id;
                const IconComp = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePurposeSelect(p.id)}
                    className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-br ${p.color} ring-2 ring-emerald-400/50 shadow-lg`
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl bg-slate-950/60 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-black text-sm text-[var(--theme-text,#F8FAFC)]">
                              {isHindi ? p.titleHi : p.titleEn}
                            </span>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--theme-text-muted,#8BA4D0)] leading-relaxed">
                        {isHindi ? p.descHi : p.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 4: POLICY & CONFIRMATION */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              {/* Trust highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    100% Offline First
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {isHindi ? 'इंटरनेट के बिना भी पूरा काम करेगा।' : 'Works completely without internet.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    Zero Data Tracking
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {isHindi ? 'कोई बैंक खाता या गुप्त डेटा नहीं मांगते।' : 'No full account or card details saved.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    Personalized For You
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {isHindi ? 'आपकी जरूरत के हिसाब से होमपेज तैयार।' : 'Customized homepage for your trade.'}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/70 flex flex-col gap-2.5">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                  {isHindi ? 'चुनी गई सेटिंग्स (Selected Settings)' : 'Your Selected Settings'}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/80">
                    <div className="text-[10px] text-slate-400">{isHindi ? 'भाषा' : 'Language'}</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {LANGUAGES.find((l) => l.id === selectedLang)?.label || selectedLang}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80">
                    <div className="text-[10px] text-slate-400">{isHindi ? 'मुद्रा' : 'Currency'}</div>
                    <div className="font-bold text-amber-300 mt-0.5">{selectedCurrency}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80">
                    <div className="text-[10px] text-slate-400">{isHindi ? 'उपयोग' : 'Usage'}</div>
                    <div className="font-bold text-emerald-300 mt-0.5 capitalize">{selectedPurpose}</div>
                  </div>
                </div>
              </div>

              {/* Policy Checkbox / Consent Box */}
              <div className="p-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="onboarding-policy-check"
                  checked={policyAgreed}
                  onChange={(e) => setPolicyAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-sky-500 focus:ring-sky-400 border-slate-600 bg-slate-900 cursor-pointer"
                />
                <label htmlFor="onboarding-policy-check" className="text-xs text-slate-200 leading-relaxed cursor-pointer select-none">
                  {isHindi ? (
                    <>
                      मैं डेली खाता प्रो की{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenPrivacy) onOpenPrivacy();
                        }}
                        className="text-sky-400 underline font-bold hover:text-sky-300"
                      >
                        गोपनीयता नीति (Privacy Policy)
                      </button>
                      ,{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenTerms) onOpenTerms();
                        }}
                        className="text-sky-400 underline font-bold hover:text-sky-300"
                      >
                        उपयोग की शर्तों (Terms of Service)
                      </button>{' '}
                      और{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenCookies) onOpenCookies();
                        }}
                        className="text-sky-400 underline font-bold hover:text-sky-300"
                      >
                        कुकी नीति (Cookie Policy)
                      </button>{' '}
                      से सहमत हूँ। यह ऐप 100% ऑफलाइन रिकॉर्ड-कीपिंग टूल है और सारा डेटा मेरे डिवाइस में सुरक्षित रहता है।
                    </>
                  ) : (
                    <>
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenPrivacy) onOpenPrivacy();
                        }}
                        className="text-sky-400 underline font-bold hover:text-sky-300"
                      >
                        Privacy Policy
                      </button>
                      ,{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenTerms) onOpenTerms();
                        }}
                        className="text-sky-400 underline font-bold hover:text-sky-300"
                      >
                        Terms of Service
                      </button>
                      , and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenCookies) onOpenCookies();
                        }}
                        className="text-sky-400 underline font-bold hover:text-sky-300"
                      >
                        Cookie Policy
                      </button>
                      . I understand this app keeps records 100% locally and securely on my device.
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-8 py-4 border-t border-[var(--theme-border,#1E3A5F)]/60 bg-slate-900/60 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              {isHindi ? 'पीछे' : 'Back'}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer active:scale-95"
              >
                <span>{isHindi ? 'आगे बढ़ें' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!policyAgreed}
                onClick={handleFinish}
                className={`px-7 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                  policyAgreed
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-slate-950 shadow-emerald-500/30 hover:brightness-110'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHindi ? 'शुरू करें (Get Started)' : 'Get Started Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
