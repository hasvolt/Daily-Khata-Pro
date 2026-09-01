import React, { useState } from 'react';
import {
  X,
  BookOpen,
  HelpCircle,
  Sparkles,
  Wallet,
  PieChart,
  PlusCircle,
  MinusCircle,
  Target,
  FileText,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Percent,
  Search,
  Zap,
  TrendingUp,
  Coins,
  Receipt,
  Layers,
  LucideIcon,
  Code2,
  Mail,
  Instagram,
  Twitter,
  ExternalLink,
  FolderGit2,
  Copy,
  Check,
  User,
  Lock,
  KeyRound,
  EyeOff,
  AlertTriangle,
  Briefcase,
  Calendar
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { FUND_LABELS, FUND_ORDER, DEFAULT_PERCENTAGES, FUND_CONFIGS } from '../data/defaults';
import { AppLanguage } from '../types';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSourceCode?: () => void;
  onOpenSecurityLock?: () => void;
  language?: AppLanguage;
}

interface SectionItem {
  id: string;
  title: string;
  hindiTitle?: string;
  icon: LucideIcon;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onOpenSourceCode,
  onOpenSecurityLock,
  language = 'en'
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const sections: SectionItem[] = [
    { id: 'intro', title: '1. Introduction & Overview', hindiTitle: '1. परिचय एवं अवलोकन', icon: Zap },
    { id: 'app_lock', title: '2. App Passcode Lock & Vault', hindiTitle: '2. ऐप पासकोड लॉक एवं सुरक्षा वॉल्ट', icon: Lock },
    { id: 'personal_notes', title: '3. Personal Notes & Private Vault', hindiTitle: '3. पर्सनल नोट्स एवं प्राइवेट वॉल्ट', icon: FileText },
    { id: 'six_funds', title: '4. 6-Fund Formula Allocation', hindiTitle: '4. 6-फंड फॉर्मूला एलोकेशन', icon: Layers },
    { id: 'add_income', title: '5. Recording Income', hindiTitle: '5. आमदनी (Income) जोड़ना', icon: Coins },
    { id: 'add_expense', title: '6. Logging Expenses', hindiTitle: '6. खर्च (Expense) दर्ज करना', icon: Receipt },
    { id: 'work_life', title: '7. Work Logs & Daily Timeline', hindiTitle: '7. वर्क प्रोजेक्ट्स एवं डेली लाइफ टाइमलाइन', icon: Briefcase },
    { id: 'goals', title: '8. Financial Goal Targets', hindiTitle: '8. वित्तीय लक्ष्य (Goals)', icon: Target },
    { id: 'reports', title: '9. Reports & PDF Statements', hindiTitle: '9. रिपोर्ट एवं PDF स्टेटमेंट', icon: FileText },
    { id: 'settings', title: '10. Custom Settings & Rules', hindiTitle: '10. कस्टम सेटिंग्स व रूल्स', icon: Settings },
    { id: 'backup', title: '11. Backup & Privacy Security', hindiTitle: '11. बैकअप एवं डेटा सुरक्षा', icon: ShieldCheck },
    { id: 'source_code', title: '12. Source Code & Verification', hindiTitle: '12. ओपन सोर्स व सुरक्षा सत्यापन', icon: Code2 },
    { id: 'faq', title: '13. Frequently Asked Questions', hindiTitle: '13. अक्सर पूछे जाने वाले प्रश्न (FAQ)', icon: HelpCircle },
    { id: 'developer', title: '14. Developer & Founder Info', hindiTitle: '14. डेवलपर एवं फाउंडर प्रोफाइल', icon: User }
  ];

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-3">
            <HasVoltLogo size={36} />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[18px] font-bold text-[#F8FAFC]">
                  Daily Khata: Pro — User Manual &amp; Comprehensive Guide
                </h2>
                <span className="text-[10px] font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] px-2 py-0.5 rounded-full border border-[var(--theme-primary,#38BDF8)]/30 uppercase tracking-wider">
                  Official Guide
                </span>
              </div>
              <p className="text-[12px] text-[#94A3B8]">
                Professional guidelines for systematic financial discipline &amp; wealth tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Mobile Navigation Chips */}
        <div className="px-4 py-2.5 bg-[var(--theme-bg,#070E18)] border-b border-[var(--theme-border,#213E61)] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user guide (e.g. 6 funds, backup, goals, pdf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[12.5px] rounded-lg pl-9 pr-3 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
            />
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1 shrink-0">
            <span>Powered by</span>
            <a
              href="https://www.hasvolt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--theme-primary,#38BDF8)] hover:underline font-bold"
            >
              HasVolt.com
            </a>
          </div>
        </div>

        {/* Modal Main Content (Sidebar + Reader) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 bg-[var(--theme-bg,#070E18)] border-r border-[var(--theme-border,#213E61)] p-3 overflow-y-auto shrink-0 flex md:flex-col gap-1.5 no-scrollbar max-md:flex-row max-md:overflow-x-auto max-md:py-2">
            {filteredSections.map((sec) => {
              const SecIcon = sec.icon;
              const isSelected = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-semibold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)]'
                  }`}
                >
                  <SecIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isHindi && sec.hindiTitle ? sec.hindiTitle : sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Reader Area */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6 text-[#94A3B8] text-[13.5px] leading-relaxed bg-[var(--theme-surface,#0E1A29)]">
            {activeSection === 'intro' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{isHindi ? 'Daily Khata: Pro में आपका स्वागत है' : 'Welcome to Daily Khata: Pro'}</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    {isHindi ? 'आपका व्यक्तिगत एवं व्यावसायिक वित्तीय अनुशासन साथी।' : 'Your personal and enterprise financial discipline companion.'}
                  </p>
                </div>

                <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-2.5">
                  <h4 className="text-[14px] font-bold text-[var(--theme-primary,#38BDF8)]">
                    {isHindi ? 'मुख्य डिज़ाइन दर्शन (Core Philosophy)' : 'Core Design Philosophy'}
                  </h4>
                  <p className="text-[#CBD5E1]">
                    {isHindi
                      ? 'Daily Khata: Pro फ्रीलांसर्स, बिजनेस ओनर्स एवं परिवारों को 6-फंड फॉर्मूला के साथ अनुशासित बजटिंग प्रदान करता है। साथ ही ऐप पासकोड वॉल्ट आपकी फाइनेंशियल प्राइवेसी को 100% ऑफलाइन व सुरक्षित रखता है।'
                      : 'Daily Khata: Pro helps freelancers, business professionals, and households implement mathematical budgeting. Every earned rupee is immediately partitioned across 6 distinct purpose-driven pots before discretionary spending occurs.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="text-[12px] font-bold text-[#10B981] flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> {isHindi ? '100% प्राइवेट वॉल्ट' : 'PIN Vault Lock'}
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      {isHindi ? 'पासकोड सुरक्षा और ऑटो-लॉक के साथ पूर्ण प्राइवेसी।' : 'Custom 4–6 digit PIN lock with auto-lock protection.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> {isHindi ? 'ऑटो 6-फंड विभाजन' : 'Auto 6-Fund Split'}
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      {isHindi ? 'नई कमाई जोड़ते ही सभी फंड्स में तुरंत विभाजन।' : 'Zero manual calculations needed when entering new earnings.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="text-[12px] font-bold text-[#38BDF8] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> {isHindi ? 'ऑडिट रिपोर्ट्स व PDF' : 'Clean Audit Reports'}
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      {isHindi ? 'प्रिंट-रेडी PDF व CSV फॉर्मेट में कभी भी डाउनलोड करें।' : 'Download statements in print-ready PDF or raw CSV formats anytime.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dedicated App Passcode Lock Section */}
            {activeSection === 'app_lock' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#10B981]" />
                    <span>{isHindi ? 'ऐप पासकोड लॉक एवं सुरक्षा वॉल्ट गाइड' : 'App Passcode Lock & Security Vault Guide'}</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    {isHindi
                      ? 'अपनी वित्तीय जानकारी, इनकम, खर्च और वर्क लॉग्स को अनधिकृत पहुंच से सुरक्षित रखें।'
                      : 'Protect your financial records, income stats, and personal diary from unauthorized access.'}
                  </p>
                </div>

                <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981]">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <h4 className="text-[14px] font-bold text-[#F8FAFC]">
                      {isHindi ? 'ऐप लॉक कैसे काम करता है? (How It Works)' : 'How App Passcode Vault Works'}
                    </h4>
                  </div>
                  <p className="text-[#CBD5E1] text-[12.5px] leading-relaxed">
                    {isHindi
                      ? 'Daily Khata: Pro में 4 से 6 अंकों का कस्टमाइज़ेबल पिन सेट किया जा सकता है। यह लॉक पूरी तरह से आपके डिवाइस के लोकल स्टोरेज में काम करता है और किसी भी सर्वर पर कोई डेटा नहीं भेजता।'
                      : 'Daily Khata: Pro includes a built-in 4-to-6 digit numeric passcode vault that runs 100% locally in your browser. When active, no one can view balances, transactions, or client work logs without entering the PIN.'}
                  </p>
                </div>

                {/* Step-by-Step Setup Guide */}
                <div className="space-y-2.5">
                  <div className="font-bold text-[13.5px] text-[#F8FAFC] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{isHindi ? '1. पासकोड लॉक कैसे चालू करें (Setup Steps):' : '1. How to Enable Passcode Lock:'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                      <div className="text-[11.5px] font-bold text-[var(--theme-primary,#38BDF8)]">चरण 1 / Step 1</div>
                      <p className="text-[11.5px] text-[#CBD5E1]">
                        {isHindi ? 'ऊपरी मेनू में "More" (अतिरिक्त) → "सुरक्षा पिन एवं ऐप लॉक" या Settings में जाएं।' : 'Click "More" in Header → Select "App Passcode Lock" or open Settings.'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                      <div className="text-[11.5px] font-bold text-[#10B981]">चरण 2 / Step 2</div>
                      <p className="text-[11.5px] text-[#CBD5E1]">
                        {isHindi ? 'स्विच को ON करें और अपना 4 से 6 अंकों का गुप्त पिन व सुरक्षा प्रश्न दर्ज करें।' : 'Toggle ON, choose a 4–6 digit PIN, select a security recovery question.'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                      <div className="text-[11.5px] font-bold text-[#F59E0B]">चरण 3 / Step 3</div>
                      <p className="text-[11.5px] text-[#CBD5E1]">
                        {isHindi ? '"सुरक्षा पिन सहेजें" पर क्लिक करें। आपका वॉल्ट तुरंत सक्रिय हो जाएगा।' : 'Click "Save & Enable Passcode". Vault activates immediately.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Features of Lock */}
                <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                  <div className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>{isHindi ? 'प्रमुख सुरक्षा सुविधाएं (Key Features)' : 'Key Security Features'}</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-[#CBD5E1]">
                    <li>
                      <strong className="text-[#F8FAFC]">{isHindi ? 'ऑटो-लॉक (Auto-Lock on Leave):' : 'Auto-Lock on Tab Switch:'}</strong>{' '}
                      {isHindi
                        ? 'जैसे ही आप दूसरा ब्राउज़र टैब खोलते हैं या ऐप बैकग्राउंड में जाता है, वॉल्ट अपने आप लॉक हो जाता है।'
                        : 'Automatically re-engages the lock screen whenever you switch tabs or minimize the window.'}
                    </li>
                    <li>
                      <strong className="text-[#F8FAFC]">{isHindi ? 'त्वरित लॉक बटन (Instant Lock):' : 'Instant 1-Tap Lock:'}</strong>{' '}
                      {isHindi
                        ? 'हेडर में "लॉक" बटन पर क्लिक करके किसी भी समय तुरंत ऐप को सुरक्षित लॉक कर सकते हैं।'
                        : 'Click the "Lock" button in the top navigation bar anytime to immediately secure your screen.'}
                    </li>
                    <li>
                      <strong className="text-[#F8FAFC]">{isHindi ? 'पिन भूलने पर रिकवरी (Forgot PIN Recovery):' : 'Security Question Reset:'}</strong>{' '}
                      {isHindi
                        ? 'यदि आप पिन भूल जाते हैं, तो "पिन भूल गए?" पर क्लिक करके अपने सुरक्षा प्रश्न का सही उत्तर देकर नया पिन बना सकते हैं (बिना डेटा खोए)।'
                        : 'Forgot your passcode? Answer your configured security question to safely reset your PIN without data loss.'}
                    </li>
                    <li>
                      <strong className="text-[#F8FAFC]">{isHindi ? 'प्राइवेसी आई मास्क (Amount Masking):' : 'Amount Privacy Masking:'}</strong>{' '}
                      {isHindi
                        ? 'पब्लिक में इस्तेमाल करते समय हेडर के Eye बटन (आंख आइकन) से रुपए की रकम को छिपा सकते हैं।'
                        : 'Quickly hide sensitive financial figures in public spaces using the eye toggle in the header.'}
                    </li>
                  </ul>
                </div>

                {onOpenSecurityLock && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSecurityLock();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#F8FAFC] hover:border-[#10B981] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Lock className="w-4 h-4 text-[#10B981]" />
                    <span>{isHindi ? 'सुरक्षा पिन सेटिंग्स अभी खोलें' : 'Open Security Lock Settings Now'}</span>
                  </button>
                )}
              </div>
            )}

            {activeSection === 'personal_notes' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#10B981]" />
                    <span>{isHindi ? 'पर्सनल नोट्स एवं प्राइवेट वॉल्ट' : 'Personal Notes & Private Vault'}</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    {isHindi
                      ? 'वित्तीय लेजर से पूरी तरह अलग एक स्वतंत्र, गोपनीय स्पेस जहाँ आप अपने निजी विचार व संवेदनशील जानकारी सुरक्षित रख सकते हैं।'
                      : 'An isolated, confidential workspace separate from the financial ledger for your private thoughts, credentials, and ideas.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[13px] text-[#F8FAFC] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      <span>{isHindi ? '100% अलग व निजी' : 'Completely Separate'}</span>
                    </div>
                    <p className="text-[12px] text-[#CBD5E1]">
                      {isHindi
                        ? 'यह सेक्शन आपके वित्तीय खातों से पूरी तरह अलग है और सिर्फ आपके डिवाइस में सुरक्षित रहता है।'
                        : 'Completely isolated from your financial balances and entries, stored securely on your device.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[13px] text-[#F8FAFC] flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#F59E0B]" />
                      <span>{isHindi ? 'नोट लॉक सुरक्षा' : 'Note Lock Shield'}</span>
                    </div>
                    <p className="text-[12px] text-[#CBD5E1]">
                      {isHindi
                        ? 'किसी भी नोट को अलग से लॉक करें ताकि कोई अन्य व्यक्ति स्क्रीन पर उसका विवरण न पढ़ सके।'
                        : 'Protect individual notes with an extra privacy lock to hide text previews until revealed.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'six_funds' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>The 6-Fund Allocation Rule</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Systematic money division strategy designed for sustained financial resilience.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUND_ORDER.map((f) => {
                    const cfg = FUND_CONFIGS[f];
                    return (
                      <div key={f} className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                            <span className="font-bold text-[#F8FAFC] text-[13.5px]">{FUND_LABELS[f]}</span>
                          </div>
                          <span className="text-[12px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{DEFAULT_PERCENTAGES[f]}%</span>
                        </div>
                        <p className="text-[11.5px] text-[#94A3B8]">{cfg.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'add_income' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#10B981]" />
                    <span>Recording Income &amp; Earnings</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    How earnings are split across your portfolio automatically.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">1. Enter Total Received Amount</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Input your salary, freelance payment, client advance, or profit.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">2. Select Income Category &amp; Payment Mode</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Choose Cash, UPI, or Bank Transfer to keep accurate liquidity logs.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">3. Save and Review Splits</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      The system calculates the exact share for each fund pot instantly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'add_expense' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#EF4444]" />
                    <span>Logging Expenses</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Deduct outlays directly from their respective pots to maintain balance.
                  </p>
                </div>

                <p className="text-[#CBD5E1]">
                  When making purchases or paying utility bills, always select the designated fund pot:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[12.5px] text-[#CBD5E1]">
                  <li><strong className="text-[#F8FAFC]">Family Fund:</strong> Groceries, school fees, electricity &amp; house rent.</li>
                  <li><strong className="text-[#F8FAFC]">Personal Fund:</strong> Mobile recharges, dining out, personal fuel, grooming.</li>
                  <li><strong className="text-[#F8FAFC]">Emergency Fund:</strong> Urgent medical fees, unexpected hardware/vehicle repairs.</li>
                  <li><strong className="text-[#F8FAFC]">Buffer Fund:</strong> Shortfalls or petty business expenses.</li>
                </ul>
              </div>
            )}

            {activeSection === 'work_life' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{isHindi ? 'वर्क प्रोजेक्ट्स एवं डेली लाइफ टाइमलाइन' : 'Work Deliverables & Daily Life Timeline'}</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    {isHindi
                      ? 'अपने प्रोजेक्ट्स, क्लाइंट डिलीवरेबल्स और रोज़ाना की गतिविधियों को ट्रैक करें।'
                      : 'Manage client deliverables, milestone earnings, and your daily life reflection logs.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-[13px]">
                      <Briefcase className="w-4 h-4 text-[#10B981]" />
                      <span>{isHindi ? 'वर्क एवं प्रोजेक्ट ट्रैकर' : 'Work & Project Deliverables'}</span>
                    </div>
                    <p className="text-[12px] text-[#CBD5E1] leading-relaxed">
                      {isHindi
                        ? 'क्लाइंट का नाम, प्रोजेक्ट शीर्षक, पेमेंट स्थिति (Paid, Pending, Partial), देय राशि, और डेडलाइन एक जगह दर्ज करें।'
                        : 'Track client names, project scope, payment status (Paid, Pending, Partial), deadlines, and deliverables.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-[13px]">
                      <Calendar className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{isHindi ? 'डेली लाइफ टाइमलाइन व डायरी' : 'Daily Life Diary & Habit Logs'}</span>
                    </div>
                    <p className="text-[12px] text-[#CBD5E1] leading-relaxed">
                      {isHindi
                        ? 'दिनचर्या के महत्वपूर्ण पल, मूड रेटिंग, स्वास्थ्य चेकपॉइंट्स, और व्यक्तिगत नोट्स को समयबद्ध टाइमलाइन में सहेजें।'
                        : 'Record mood ratings, daily routines, wellness notes, and personal reflections in a chronological timeline.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'goals' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Target className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Financial Goal Targets</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Establish long-term targets and track systematic deposits.
                  </p>
                </div>

                <p className="text-[#CBD5E1]">
                  Use the <strong>Goals</strong> tab to track targets such as Emergency Reserves, Vehicle Purchases, New Hardware, Gold, or Education funds. You can link any goal to a specific pot (e.g. Saving or Investment) and deposit funds incrementally.
                </p>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Reports &amp; PDF Export</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Generate professional financial statements and ledger downloads.
                  </p>
                </div>

                <p className="text-[#CBD5E1]">
                  Navigate through past months to view net savings, category breakdown charts, and download verified statements in PDF format or CSV spreadsheets.
                </p>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Custom Settings &amp; Allocation Percentages</span>
                  </h3>
                </div>

                <p className="text-[#CBD5E1]">
                  You can adjust the fund percentages in the Reports settings panel to suit your specific lifestyle (e.g. higher investment percentage or lower personal allowance). Ensure the sum always equals 100%.
                </p>
              </div>
            )}

            {activeSection === 'backup' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <span>Backup &amp; Privacy Security</span>
                  </h3>
                </div>

                <p className="text-[#CBD5E1]">
                  Daily Khata: Pro works entirely offline without server dependencies. To safeguard your records across devices or browser clears, click <strong>Export JSON</strong> in Settings regularly and save the file in your secure drive.
                </p>
              </div>
            )}

            {activeSection === 'source_code' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#10B981]" />
                    <span>Source Code &amp; Trust Verification</span>
                  </h3>
                  <p className="text-[12px] text-[#94A3B8] mt-1">
                    Complete transparency — Verify mathematical safety &amp; offline privacy architecture
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[#CBD5E1]">
                    Unlike traditional cloud accounting and bookkeeping apps that store your finances on remote databases, <strong>Daily Khata: Pro</strong> is engineered as a 100% client-side application.
                  </p>

                  <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <div className="font-bold text-[#10B981] text-[13px]">How To Verify Security:</div>
                    <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-[#CBD5E1]">
                      <li><strong>Zero Network Calls</strong>: Open Browser DevTools (F12) → Network Tab → Add an entry. Observe 0 outbound requests.</li>
                      <li><strong>Local Storage Only</strong>: Open Application Tab → LocalStorage → Verify key <code className="text-[var(--theme-primary,#38BDF8)]">hasvolt_khata_v1</code>.</li>
                      <li><strong>Pure Math Calculations</strong>: All 6-Fund allocations and goal trackers execute purely on your local device CPU.</li>
                    </ul>
                  </div>

                  {onOpenSourceCode && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSourceCode();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Code2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>Open Interactive Source Code &amp; Security Inspector</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="font-bold text-[#F8FAFC] text-[13px]">Does Daily Khata: Pro require internet?</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      No, Daily Khata: Pro works completely offline as an autonomous local client application.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="font-bold text-[#F8FAFC] text-[13px]">Can I edit or delete old transactions?</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Yes, every transaction in the History view can be modified or deleted at any time with recalculations occurring instantly.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                    <div className="font-bold text-[#F8FAFC] text-[13px] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>Official Contact &amp; Support Channels</span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Have feedback, questions, or need assistance? Reach out directly to our official handles:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href="https://github.com/hasvolt/Daily-Khata-Pro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[11.5px] text-[#CBD5E1] hover:text-[#10B981] flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate font-bold">
                          <FolderGit2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>GitHub: hasvolt/Daily-Khata-Pro</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </a>
                      <a
                        href="mailto:daily-Khata-Pro@gmail.com"
                        className="p-2.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[11.5px] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-2 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        <span className="truncate">daily-Khata-Pro@gmail.com</span>
                      </a>
                      <a
                        href="https://www.instagram.com/dailykhatapro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] text-[11.5px] text-[#CBD5E1] hover:text-[#E1306C] flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Instagram className="w-3.5 h-3.5 text-[#E1306C] shrink-0" />
                          <span>@dailykhatapro</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </a>
                      <a
                        href="https://x.com/Dailykhatapro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#1DA1F2] text-[11.5px] text-[#CBD5E1] hover:text-[#1DA1F2] flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Twitter className="w-3.5 h-3.5 text-[#1DA1F2] shrink-0" />
                          <span>@Dailykhatapro</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'developer' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Developer &amp; Creator Information</span>
                  </h3>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-28 h-auto max-h-36 sm:w-32 sm:max-h-40 rounded-2xl overflow-hidden border-2 border-[var(--theme-primary,#38BDF8)] shadow-lg bg-[var(--theme-surface,#0E1A29)] p-1">
                        <img
                          src="/md-zafeer-hasan-yazdaan.jpg"
                          alt="MD Zafeer Hasan (YAZDAAN)"
                          className="w-full h-auto object-contain rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-1.5 px-2 py-0.5 rounded bg-[#10B981] text-[#04140D] text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Creator &amp; Founder</span>
                      </div>
                    </div>

                    <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h4 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                          MD Zafeer Hasan
                        </h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))]">
                          (YAZDAAN)
                        </span>
                      </div>

                      <div className="text-[12.5px] font-medium text-[var(--theme-primary,#38BDF8)]">
                        Independent Developer, Creator &amp; Founder
                      </div>

                      <div className="text-[11.5px] text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                        <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        <a href="mailto:daily-Khata-Pro@gmail.com" className="hover:underline text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] font-mono">
                          daily-Khata-Pro@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mr-1">Focus:</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      Open Source
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                      Productivity
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                      Personal Finance
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                      Digital Tools
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2 text-[12.5px] text-[#CBD5E1] leading-relaxed">
                    <p>
                      I&apos;m an independent developer focused on creating simple, practical, and privacy-conscious digital tools that are useful in everyday life.
                    </p>
                    <p>
                      This project is developed with the goal of providing a simple and accessible way for users to manage their daily income, expenses, and financial records.
                    </p>
                    <p className="text-[#F8FAFC] font-medium italic border-l-2 border-[var(--theme-primary,#38BDF8)] pl-2.5 text-[12px]">
                      &ldquo;I believe in building useful software that is transparent, easy to use, and accessible to everyone.&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1.5 text-[11.5px]">
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="font-semibold text-[#CBD5E1]">Project:</span>
                      <span className="text-[#F8FAFC] font-bold">Daily Income &amp; Expense Tracker (Daily Khata Pro)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="font-semibold text-[#CBD5E1]">License:</span>
                      <span className="text-[#10B981] font-mono font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                        Open Source (MIT)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="font-semibold text-[#CBD5E1]">Support &amp; Feedback:</span>
                      <a href="mailto:daily-Khata-Pro@gmail.com" className="text-[var(--theme-primary,#38BDF8)] hover:underline font-mono">
                        daily-Khata-Pro@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href="mailto:daily-Khata-Pro@gmail.com"
                      className="p-2.5 rounded-lg bg-[var(--theme-btn-bg,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-bold text-[12px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email: daily-Khata-Pro@gmail.com</span>
                    </a>
                    <a
                      href="https://github.com/hasvolt/Daily-Khata-Pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#CBD5E1] hover:text-[#10B981] font-bold text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                      <span>GitHub: hasvolt/Daily-Khata-Pro</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between">
          <div className="text-[11.5px] text-[#94A3B8]">
            Official HasVolt Digital Companion
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:bg-[var(--theme-btn-hover,#0EA5E9)] text-[var(--theme-btn-text,#040D17)] font-bold text-[13px] cursor-pointer transition-colors shadow-xs"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
