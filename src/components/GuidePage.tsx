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
  ArrowLeft,
  Calendar,
  DollarSign,
  Lock,
  EyeOff,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Sliders,
  UploadCloud,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { FUND_LABELS, FUND_ORDER, DEFAULT_PERCENTAGES, FUND_CONFIGS } from '../data/defaults';
import { AppLanguage } from '../types';

interface GuidePageProps {
  onBack: () => void;
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

export const GuidePage: React.FC<GuidePageProps> = ({
  onBack,
  onOpenSourceCode,
  onOpenSecurityLock,
  language = 'en'
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isHindi = language === 'hi';

  const sections: SectionItem[] = [
    { id: 'intro', title: '1. Introduction & Overview', hindiTitle: '1. परिचय एवं अवलोकन', icon: Zap },
    { id: 'app_lock', title: '2. App Passcode Lock & Vault', hindiTitle: '2. ऐप पासकोड लॉक एवं सुरक्षा वॉल्ट', icon: Lock },
    { id: 'six_funds', title: '3. 6-Fund Formula Allocation', hindiTitle: '3. 6-फंड फॉर्मूला एलोकेशन', icon: Layers },
    { id: 'add_income', title: '4. Recording Income', hindiTitle: '4. आमदनी (Income) जोड़ना', icon: Coins },
    { id: 'add_expense', title: '5. Logging Expenses', hindiTitle: '5. खर्च (Expense) दर्ज करना', icon: Receipt },
    { id: 'work_life', title: '6. Work Deliverables & Timeline', hindiTitle: '6. वर्क प्रोजेक्ट्स एवं डेली लाइफ टाइमलाइन', icon: Calendar },
    { id: 'goals', title: '7. Financial Goal Targets', hindiTitle: '7. वित्तीय लक्ष्य (Goals)', icon: Target },
    { id: 'reports', title: '8. Reports & PDF Statements', hindiTitle: '8. रिपोर्ट एवं PDF स्टेटमेंट', icon: FileText },
    { id: 'settings', title: '9. Custom Settings & Rules', hindiTitle: '9. कस्टम सेटिंग्स व रूल्स', icon: Settings },
    { id: 'backup', title: '10. Backup & Privacy Security', hindiTitle: '10. बैकअप एवं डेटा सुरक्षा', icon: ShieldCheck },
    { id: 'source_code', title: '11. Source Code & Verification', hindiTitle: '11. ओपन सोर्स व सुरक्षा सत्यापन', icon: Code2 },
    { id: 'faq', title: '12. Frequently Asked Questions', hindiTitle: '12. अक्सर पूछे जाने वाले प्रश्न (FAQ)', icon: HelpCircle },
    { id: 'developer', title: '13. Developer & Creator Info', hindiTitle: '13. डेवलपर एवं क्रिएटर प्रोफाइल', icon: User }
  ];

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 text-left pb-12">
      {/* Top Header Bar */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer shrink-0 shadow-sm active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <HasVoltLogo size={42} />
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-display text-[22px] sm:text-[26px] font-bold text-[#F8FAFC]">
                  Official User Manual
                </h1>
                <span className="text-[10px] font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] px-2.5 py-0.5 rounded-full border border-[var(--theme-primary,#38BDF8)]/30 uppercase tracking-wider">
                  Documentation &amp; Help
                </span>
              </div>
              <p className="text-[13px] text-[#94A3B8] mt-0.5">
                Comprehensive step-by-step guide for financial discipline &amp; wealth tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 bg-[var(--theme-bg,#070E18)] border-r border-[var(--theme-border,#213E61)] flex flex-col shrink-0">
          <div className="p-4 border-b border-[var(--theme-border,#213E61)]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guide sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[13px] rounded-xl pl-9 pr-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar max-md:flex max-md:overflow-x-auto max-md:space-y-0 max-md:gap-2">
            {filteredSections.map((sec) => {
              const SecIcon = sec.icon;
              const isSelected = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-3 transition-all cursor-pointer max-md:whitespace-nowrap ${
                    isSelected
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-lg font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)]'
                  }`}
                >
                  <SecIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-inherit' : 'text-[#64748B]'}`} />
                  <span className="truncate">{isHindi && sec.hindiTitle ? sec.hindiTitle : sec.title}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-[var(--theme-border,#213E61)] text-[11px] text-[#94A3B8] hidden md:block">
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <a href="https://www.hasvolt.com" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary,#38BDF8)] hover:underline font-bold">HasVolt.com</a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto bg-[var(--theme-surface,#0E1A29)] custom-scrollbar">
          
          {/* SECTION 1: Introduction */}
          {activeSection === 'intro' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Zap className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'Daily Khata: Pro में आपका स्वागत है' : 'Welcome to Daily Khata: Pro'}</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
                  {isHindi
                    ? 'Daily Khata: Pro एक आधुनिक, अनुशासित वित्तीय बहीखाता (Ledger) सिस्टम है जो 6-फंड फॉर्मूला पर आधारित है।'
                    : 'Daily Khata: Pro is an autonomous, high-discipline financial ledger system engineered around the mathematical 6-Fund distribution formula.'}
                </p>
              </div>

              <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 space-y-3.5 shadow-sm">
                <h4 className="text-[16px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {isHindi ? 'मुख्य डिज़ाइन दर्शन (Core Philosophy)' : 'Core Philosophy'}
                </h4>
                <p className="text-[#CBD5E1] text-[14px] leading-relaxed">
                  {isHindi
                    ? 'दौलत और वित्तीय स्वतंत्रता केवल इस बात पर निर्भर नहीं करती कि आप कितना कमाते हैं, बल्कि इस बात पर निर्भर करती है कि आप उस कमाई को कितनी कड़ाई से अलग-अलग बकेट्स में विभाजित करते हैं। Daily Khata: Pro हर एक रुपए को 6 समर्पित फंड्स में बांटता है और साथ ही पासकोड लॉक से आपकी प्राइवेसी को सुरक्षित रखता है।'
                    : 'Wealth creation is not determined merely by how much income you generate, but by how rigorously you partition that income. Every rupee received is partitioned into 6 dedicated "purpose funds" before discretionary expenditure occurs. This automates savings and prevents impulsive lifestyle creep.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 group hover:border-[#10B981]/50 transition-all">
                  <Lock className="w-6 h-6 text-[#10B981]" />
                  <h5 className="font-bold text-[#F8FAFC]">{isHindi ? '100% प्राइवेट वॉल्ट' : '100% Privacy Vault'}</h5>
                  <p className="text-[12.5px] text-[#94A3B8]">
                    {isHindi ? 'कस्टम 4–6 डिजिट पिन लॉक और लोकल डिवाइस स्टोरेज।' : 'Zero remote server telemetry. All data is saved inside your local browser.'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 group hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all">
                  <Zap className="w-6 h-6 text-[var(--theme-primary,#38BDF8)]" />
                  <h5 className="font-bold text-[#F8FAFC]">{isHindi ? 'ऑटो 6-फंड विभाजन' : 'Auto 6-Fund Split'}</h5>
                  <p className="text-[12.5px] text-[#94A3B8]">
                    {isHindi ? 'आमदनी दर्ज होते ही गणितीय आधार पर तुरंत फंड एलोकेशन।' : 'Instant mathematical allocation whenever you enter any income.'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 group hover:border-[#F59E0B]/50 transition-all">
                  <FileText className="w-6 h-6 text-[#F59E0B]" />
                  <h5 className="font-bold text-[#F8FAFC]">{isHindi ? 'ऑडिट रिपोर्ट्स व PDF' : 'Pro Audit Exports'}</h5>
                  <p className="text-[12.5px] text-[#94A3B8]">
                    {isHindi ? 'प्रिंट-रेडी PDF स्टेटमेंट्स व CSV स्प्रेडशीट डाउनलोड करें।' : 'Download PDF monthly statements & CSV spreadsheets with one click.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: App Passcode Lock & Security Vault */}
          {activeSection === 'app_lock' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Lock className="w-7 h-7 text-[#10B981]" />
                  <span>{isHindi ? 'ऐप पासकोड लॉक एवं सुरक्षा वॉल्ट गाइड' : 'App Passcode Lock & Security Vault Guide'}</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  {isHindi
                    ? 'अपनी वित्तीय जानकारी, इनकम, खर्च, पर्सनल डायरी और क्लाइंट वर्क लॉग्स को अनधिकृत पहुंच से 100% सुरक्षित रखें।'
                    : 'Protect your financial records, income stats, personal daily journal, and client deliverables from unauthorized eyes.'}
                </p>
              </div>

              <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-[16px] font-bold text-[#F8FAFC]">
                    {isHindi ? 'ऐप लॉक कैसे काम करता है? (How It Works)' : 'How the Security Vault Works'}
                  </h4>
                </div>
                <p className="text-[#CBD5E1] text-[13.5px] leading-relaxed">
                  {isHindi
                    ? 'Daily Khata: Pro में एक सुरक्षित क्लाइंट-साइड 4 से 6 अंकों का संख्यात्मक पासकोड (Numeric PIN) वॉल्ट शामिल है। जब यह सक्रिय होता है, तो कोई भी व्यक्ति सही पिन दर्ज किए बिना आपका खाता, बैलेंस या डायरी नहीं देख सकता। यह 100% आपके डिवाइस में ही काम करता है।'
                    : 'Daily Khata: Pro includes a secure client-side 4-to-6 digit numeric passcode vault. When enabled, all financial balances, ledger transactions, goals, and daily journal entries are shielded behind an interactive touch-screen lock keypad.'}
                </p>
              </div>

              {/* Step by step setup */}
              <div className="space-y-3">
                <h4 className="font-bold text-[15px] text-[#F8FAFC] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'पासकोड लॉक कैसे सेटअप करें (Setup Steps):' : 'How to Enable Passcode Lock:'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider">
                      {isHindi ? 'चरण 1' : 'Step 1'}
                    </div>
                    <div className="font-bold text-[#F8FAFC] text-[13.5px]">
                      {isHindi ? 'सुरक्षा मेनू खोलें' : 'Open Security Menu'}
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      {isHindi ? 'ऊपरी नेविगेशन बार में "More" (अतिरिक्त) → "सुरक्षा पिन एवं ऐप लॉक" या Settings में जाएं।' : 'Click "More" in the header navigation and select "App Passcode Lock" or open Settings.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="text-[12px] font-bold text-[#10B981] uppercase tracking-wider">
                      {isHindi ? 'चरण 2' : 'Step 2'}
                    </div>
                    <div className="font-bold text-[#F8FAFC] text-[13.5px]">
                      {isHindi ? 'पिन व सुरक्षा प्रश्न चुनें' : 'Choose PIN & Recovery'}
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      {isHindi ? 'स्विच चालू करें, 4–6 अंकों का पिन दर्ज करें और रिकवरी के लिए एक सुरक्षा प्रश्न और उत्तर भरें।' : 'Toggle switch ON, enter a 4–6 digit PIN, and choose a security question for emergency recovery.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="text-[12px] font-bold text-[#F59E0B] uppercase tracking-wider">
                      {isHindi ? 'चरण 3' : 'Step 3'}
                    </div>
                    <div className="font-bold text-[#F8FAFC] text-[13.5px]">
                      {isHindi ? 'सेव करें व सुरक्षित रहें' : 'Save & Lock Protected'}
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      {isHindi ? '"सुरक्षा पिन सहेजें" पर क्लिक करें। आपका ऐप तुरंत पासकोड से सुरक्षित हो जाएगा।' : 'Click "Save & Enable Passcode". Your ledger is now immediately protected.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="text-[14.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  <span>{isHindi ? 'सुरक्षा फीचर्स एवं विशेषताएं' : 'Core Security Features'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-[#CBD5E1]">
                  <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{isHindi ? 'ऑटो-लॉक ऑन लीव (Auto-Lock)' : 'Auto-Lock on Tab Switch'}</span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">
                      {isHindi ? 'टैब बदलने, ऐप मिनिमाइज़ करने या फ़ोन स्क्रीन लॉक होने पर ऐप खुद-ब-खुद लॉक हो जाता है।' : 'Automatically re-engages lock screen whenever you switch browser tabs or minimize the window.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{isHindi ? '1-क्लिक इंस्टेंट लॉक (Instant Lock)' : 'Instant 1-Click Lock'}</span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">
                      {isHindi ? 'हेडर बार में बने "लॉक" बटन पर क्लिक करके किसी भी पल तुरंत स्क्रीन को लॉक करें।' : 'Click the "Lock" button in the top navigation bar anytime to immediately lock the display.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{isHindi ? 'सुरक्षा प्रश्न रिकवरी (PIN Recovery)' : 'Security Question Reset'}</span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">
                      {isHindi ? 'यदि आप पिन भूल जाएं, तो "पिन भूल गए?" पर क्लिक करके सुरक्षा प्रश्न का सही उत्तर देकर नया पिन बना सकते हैं।' : 'If you forget your passcode, answer your recovery question to reset your PIN without data loss.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-[#EC4899]" />
                      <span>{isHindi ? 'अमाउंट मास्किंग (Privacy Mask)' : 'Amount Privacy Masking'}</span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">
                      {isHindi ? 'पब्लिक में लोगों के सामने रुपए की रकम को छिपाने के लिए हेडर के Eye बटन (आंख आइकन) का उपयोग करें।' : 'Quickly mask financial figures in public spaces using the eye toggle in the header.'}
                    </p>
                  </div>
                </div>
              </div>

              {onOpenSecurityLock && (
                <button
                  onClick={onOpenSecurityLock}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 hover:border-[#10B981] text-[#F8FAFC] font-bold text-[13.5px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4 text-[#10B981]" />
                  <span>{isHindi ? 'सुरक्षा पिन सेटिंग्स अभी खोलें' : 'Open Security Lock Settings Now'}</span>
                  <ArrowRight className="w-4 h-4 text-[#10B981]" />
                </button>
              )}
            </div>
          )}

          {/* SECTION 2: 6-Fund Formula Allocation */}
          {activeSection === 'six_funds' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Layers className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>The 6-Fund Allocation Formula</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Whenever an income is logged, the system splits 100% of that inflow into 6 distinct purpose-driven buckets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FUND_ORDER.map((f) => {
                  const cfg = FUND_CONFIGS[f];
                  return (
                    <div key={f} className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5 hover:translate-y-[-2px] transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                          <span className="font-bold text-[#F8FAFC] text-[15px]">{FUND_LABELS[f]}</span>
                        </div>
                        <span className="text-[13px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 px-2.5 py-0.5 rounded-lg border border-[var(--theme-primary,#38BDF8)]/20">
                          {DEFAULT_PERCENTAGES[f]}%
                        </span>
                      </div>
                      <p className="text-[13px] text-[#94A3B8] leading-relaxed">{cfg.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 space-y-2">
                <h4 className="text-[14.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  Custom Percentages
                </h4>
                <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
                  These percentages can be customized in <strong>Reports &gt; Settings</strong> to match your personal situation (e.g. increasing Investment to 25% or decreasing Personal to 10%). The only rule is that the total sum must always equal <strong>100%</strong>.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: Recording Income */}
          {activeSection === 'add_income' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Coins className="w-7 h-7 text-[#10B981]" />
                  <span>Recording Income &amp; Earnings</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  How income flows into your Daily Khata and divides automatically across all 6 funds.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                  <div className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] text-[12px] font-bold flex items-center justify-center">1</span>
                    Enter Total Received Inflow
                  </div>
                  <p className="text-[13.5px] text-[#94A3B8] pl-8">
                    Input the exact amount earned — whether from a monthly salary, freelance project milestone, business daily profit, rental yield, or dividend payment.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                  <div className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] text-[12px] font-bold flex items-center justify-center">2</span>
                    Tag Category &amp; Payment Mode
                  </div>
                  <p className="text-[13.5px] text-[#94A3B8] pl-8">
                    Specify the source (e.g. Salary, Client Advance, Investment Profit) and Payment Mode (Cash, UPI, Bank Transfer, Card) for audit accuracy.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                  <div className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] text-[12px] font-bold flex items-center justify-center">3</span>
                    Automatic 6-Fund Calculation
                  </div>
                  <p className="text-[13.5px] text-[#94A3B8] pl-8">
                    As soon as you click &quot;Save Income&quot;, the system executes the mathematical breakdown. For example, ₹50,000 received will instantly allocate ₹25,000 (50%) to Needs, ₹5,000 (10%) to Emergency, ₹5,000 (10%) to Investments, etc.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[#10B981]/30 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#10B981] shrink-0 mt-0.5" />
                <div className="text-[13.5px] text-[#CBD5E1]">
                  <strong>Pro Tip:</strong> You can also perform a quick &quot;What-If&quot; calculation without saving using the <strong>Simulator</strong> option in the top header menu.
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Logging Expenses */}
          {activeSection === 'add_expense' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Receipt className="w-7 h-7 text-[#EF4444]" />
                  <span>Logging Expenses &amp; Fund Pot Deductions</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Every expenditure is deducted from its designated fund pot, keeping each bucket balanced.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[#CBD5E1] text-[14px] leading-relaxed">
                  When making purchases or paying bills, always select the designated fund pot:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[#F8FAFC] text-[14px] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#38BDF8]" />
                      Needs Fund (50%)
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      House rent, groceries, electricity, internet, school fees, and essential medicine.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[#F8FAFC] text-[14px] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#EC4899]" />
                      Personal Fund (10%)
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Dining out, movies, clothing, gaming, hobbies, personal gadgets, and recreational outings.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[#F8FAFC] text-[14px] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      Emergency Fund (10%)
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Strictly for unexpected hospital emergencies, critical vehicle breakdown, or urgent repairs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[#F8FAFC] text-[14px] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                      Investments (10%)
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Mutual funds SIPs, stocks, sovereign gold bonds, index funds, or business capital reserves.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[#F8FAFC] text-[14px] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                      Learning Fund (10%)
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Books, technical courses, certifications, workshops, seminars, and coaching.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="font-bold text-[#F8FAFC] text-[14px] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      Giving / Charity (10%)
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Donations, helping family members in need, zakat, gifts, and community welfare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Work & Life Tracker */}
          {activeSection === 'work_life' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'वर्क प्रोजेक्ट्स एवं डेली लाइफ टाइमलाइन' : 'Work Deliverables & Daily Life Timeline'}</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  {isHindi
                    ? 'क्लाइंट माइलस्टोन्स, प्रोजेक्ट डिलीवरेबल्स और रोज़ाना की गतिविधियों व आदतों को एक ही जगह प्रबंधित करें।'
                    : 'Manage client deliverables, milestone earnings, tasks, and daily reflection journals in one structured place.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3">
                  <div className="flex items-center gap-2.5 text-[#F8FAFC] font-bold text-[15px]">
                    <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <span>{isHindi ? 'वर्क एवं प्रोजेक्ट्स ट्रैकर' : 'Work Deliverables Tracker'}</span>
                  </div>
                  <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
                    {isHindi
                      ? 'क्लाइंट का नाम, प्रोजेक्ट शीर्षक, पेमेंट स्थिति (Paid, Pending, Partial), देय राशि, और डेडलाइन एक जगह दर्ज करें।'
                      : 'Track client names, project scope, payment status (Paid, Pending, Partial), deadlines, and deliverable links.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3">
                  <div className="flex items-center gap-2.5 text-[#F8FAFC] font-bold text-[15px]">
                    <div className="p-2 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>{isHindi ? 'डेली लाइफ टाइमलाइन व डायरी' : 'Daily Life Diary & Habit Logs'}</span>
                  </div>
                  <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
                    {isHindi
                      ? 'दिनचर्या के महत्वपूर्ण पल, मूड रेटिंग, स्वास्थ्य चेकपॉइंट्स, और व्यक्तिगत नोट्स को समयबद्ध टाइमलाइन में सहेजें।'
                      : 'Record mood ratings, daily routines, wellness notes, and personal reflections in a chronological timeline.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: Goals */}
          {activeSection === 'goals' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Target className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>Financial Goal Targets</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Establish milestone targets and deposit funds systematically until completion.
                </p>
              </div>

              <div className="space-y-4 text-[14px] text-[#CBD5E1] leading-relaxed">
                <p>
                  The <strong>Goals</strong> view allows you to set specific savings milestones — such as creating a 6-month Emergency Cushion, purchasing a Laptop, buying Gold, or saving for Higher Education.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <div className="font-bold text-[#F8FAFC] flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      Creating a Goal
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Click &quot;+ New Goal&quot;, specify the target amount, deadline date, and link it to one of your 6 pots (e.g. Emergency or Investments).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <div className="font-bold text-[#F8FAFC] flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#10B981]" />
                      Incremental Deposits
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Click &quot;Deposit&quot; on any active goal to transfer money into it. The progress bar and remaining days update in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Reports & PDF Export */}
          {activeSection === 'reports' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <FileText className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>Reports, Analytics &amp; Statements</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Generate professional monthly ledgers, visual breakdowns, and audit files.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <Printer className="w-6 h-6 text-[var(--theme-primary,#38BDF8)]" />
                    <h5 className="font-bold text-[#F8FAFC]">Print / Save PDF</h5>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Generate a formatted monthly statement complete with fund balances and itemized tables.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <FileSpreadsheet className="w-6 h-6 text-[#10B981]" />
                    <h5 className="font-bold text-[#F8FAFC]">Excel / CSV Export</h5>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Download transaction logs as standard CSV files compatible with Microsoft Excel &amp; Google Sheets.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <PieChart className="w-6 h-6 text-[#F59E0B]" />
                    <h5 className="font-bold text-[#F8FAFC]">Visual Breakdown</h5>
                    <p className="text-[12.5px] text-[#94A3B8]">
                      Interactive charts highlighting top spending categories and month-over-month net savings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: Custom Settings & Rules */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Settings className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>Custom Settings &amp; Allocation Percentages</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Personalize the interface, currency formatting, and fund distribution formulas.
                </p>
              </div>

              <div className="space-y-4 text-[14px] text-[#CBD5E1]">
                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3">
                  <h4 className="font-bold text-[#F8FAFC] text-[15px] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    How to Change 6-Fund Percentages:
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2 text-[13px] text-[#CBD5E1]">
                    <li>Open the <strong>Reports</strong> tab from the bottom navigation.</li>
                    <li>Click on the <strong>Settings (Gear)</strong> icon in the top right.</li>
                    <li>Adjust the sliders or numeric inputs for each of the 6 funds.</li>
                    <li>Ensure the total sum matches <strong>100%</strong> and click <strong>Save Settings</strong>.</li>
                  </ol>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
                  <h4 className="font-bold text-[#F8FAFC] text-[15px]">Privacy Masking:</h4>
                  <p className="text-[13px] text-[#94A3B8]">
                    Click the <strong>Eye (Privacy)</strong> button in the top header to mask all monetary values with asterisks (****) when opening the app in public environments.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: Backup & Privacy Security */}
          {activeSection === 'backup' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-[#10B981]" />
                  <span>Backup, Restore &amp; Privacy Security</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Safeguard your financial records across browser updates and device migrations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3">
                  <h4 className="font-bold text-[#10B981] text-[15px] flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    How to Backup Your Entire Database:
                  </h4>
                  <p className="text-[13.5px] text-[#CBD5E1]">
                    Because Daily Khata: Pro stores records locally in your browser storage, we strongly recommend performing regular JSON backups:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-[#CBD5E1]">
                    <li>Open <strong>Settings</strong> from the top header menu.</li>
                    <li>Click <strong>&quot;Export JSON Backup&quot;</strong> to download your encrypted database file.</li>
                    <li>Save this file to your Google Drive, iCloud, or external USB drive.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3">
                  <h4 className="font-bold text-[var(--theme-primary,#38BDF8)] text-[15px] flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    Restoring Data on a New Device:
                  </h4>
                  <p className="text-[13.5px] text-[#CBD5E1]">
                    Open Daily Khata on your new laptop or phone &gt; Go to Settings &gt; Click <strong>&quot;Import JSON Backup&quot;</strong> and select your saved JSON file. All records will be restored instantly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: Source Code & Trust Verification */}
          {activeSection === 'source_code' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <Code2 className="w-7 h-7 text-[#10B981]" />
                  <span>Source Code &amp; Trust Verification</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Complete public verifiability — Inspect source code and verify zero telemetry.
                </p>
              </div>

              <div className="space-y-5">
                <p className="text-[#CBD5E1] text-[14px] leading-relaxed">
                  Financial software requires absolute trust. Daily Khata: Pro is open-source under the MIT License and architected so that any user or software engineer can verify data privacy claims independently.
                </p>

                <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3.5">
                  <h4 className="font-bold text-[#10B981] text-[15px]">Security Checklist &amp; Guarantees:</h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-3 text-[13px] text-[#CBD5E1]">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span><strong>Zero Remote Database:</strong> No external database servers are ever contacted.</span>
                    </li>
                    <li className="flex items-start gap-3 text-[13px] text-[#CBD5E1]">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span><strong>100% Client-Side Engine:</strong> All financial math executes on your device processor.</span>
                    </li>
                    <li className="flex items-start gap-3 text-[13px] text-[#CBD5E1]">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span><strong>Isolated Sandbox:</strong> Transactions are saved in your private browser sandbox (key: <code className="text-[var(--theme-primary,#38BDF8)]">hasvolt_khata_v1</code>).</span>
                    </li>
                  </ul>
                </div>

                {onOpenSourceCode && (
                  <button
                    onClick={onOpenSourceCode}
                    className="w-full py-4 px-6 rounded-2xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)] font-bold text-[14px] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-98"
                  >
                    <Code2 className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Open Interactive Source Code &amp; Safety Center</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SECTION 10: FAQ */}
          {activeSection === 'faq' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <HelpCircle className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Answers to the most common questions regarding security, usage, and backups.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    q: 'Is my personal and financial data safe?',
                    a: 'Yes, 100%. Daily Khata: Pro operates without a remote backend. Everything you log is stored securely inside your browser local storage on your device. Nobody else can view or access it.'
                  },
                  {
                    q: 'Can I use Daily Khata: Pro offline without internet?',
                    a: 'Yes! The application is an installable PWA (Progressive Web App) that works fully offline. You can log income, expenses, and view statements without any active network connection.'
                  },
                  {
                    q: 'Can I edit or delete old transactions?',
                    a: 'Yes, simply go to the History tab. Click the edit or delete icon next to any entry. All 6-fund totals and account balances will recalculate instantly.'
                  },
                  {
                    q: 'How can I transfer data to another mobile phone or laptop?',
                    a: 'Go to Settings > click "Export JSON Backup" to download your data file. Send that file to your new device, open Daily Khata there, go to Settings > "Import JSON Backup", and select the file.'
                  },
                  {
                    q: 'Is Daily Khata: Pro free to use?',
                    a: 'Yes, Daily Khata: Pro is 100% free and open-source software built for the community under the MIT License.'
                  }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <h5 className="font-bold text-[#F8FAFC] text-[15px]">{item.q}</h5>
                    <p className="text-[13px] text-[#94A3B8] leading-relaxed">{item.a}</p>
                  </div>
                ))}

                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3 mt-4">
                  <h4 className="font-bold text-[#F8FAFC] text-[15px] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    Official Support &amp; Social Handles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <a
                      href="https://github.com/hasvolt/Daily-Khata-Pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[12.5px] text-[#CBD5E1] hover:text-[#10B981] flex items-center justify-between gap-1 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-bold truncate">
                        <FolderGit2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>GitHub: hasvolt/Daily-Khata-Pro</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                    </a>
                    <a
                      href="mailto:daily-Khata-Pro@gmail.com"
                      className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12.5px] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-2 transition-colors font-mono"
                    >
                      <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <span className="truncate">daily-Khata-Pro@gmail.com</span>
                    </a>
                    <a
                      href="https://www.instagram.com/dailykhatapro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] text-[12.5px] text-[#CBD5E1] hover:text-[#E1306C] flex items-center justify-between gap-1 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-bold truncate">
                        <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                        <span>@dailykhatapro</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                    </a>
                    <a
                      href="https://x.com/Dailykhatapro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#1DA1F2] text-[12.5px] text-[#CBD5E1] hover:text-[#1DA1F2] flex items-center justify-between gap-1 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-bold truncate">
                        <Twitter className="w-4 h-4 text-[#1DA1F2] shrink-0" />
                        <span>@Dailykhatapro</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 11: Developer & Creator Info */}
          {activeSection === 'developer' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-[var(--theme-border,#213E61)] pb-5">
                <h3 className="font-serif-display text-[24px] sm:text-[26px] font-bold text-[#F8FAFC] flex items-center gap-3">
                  <User className="w-7 h-7 text-[var(--theme-primary,#38BDF8)]" />
                  <span>Developer &amp; Creator Information</span>
                </h3>
                <p className="text-[14.5px] text-[#94A3B8] mt-2 leading-relaxed">
                  Meet the creator behind Daily Khata: Pro and HasVolt digital products.
                </p>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="w-28 h-auto max-h-36 sm:w-32 sm:max-h-40 rounded-2xl overflow-hidden border-2 border-[var(--theme-primary,#38BDF8)] shadow-lg bg-[var(--theme-surface,#0E1A29)] p-1">
                      <img
                        src="/md-zafeer-hasan-yazdaan.jpg"
                        alt="MD Zafeer Hasan (YAZDAAN)"
                        className="w-full h-auto object-contain rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-2 px-2.5 py-0.5 rounded bg-[#10B981] text-[#04140D] text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Creator &amp; Founder</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-serif-display text-[20px] sm:text-[22px] font-bold text-[#F8FAFC]">
                        MD Zafeer Hasan
                      </h4>
                      <span className="text-[11.5px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))]">
                        (YAZDAAN)
                      </span>
                    </div>

                    <div className="text-[13px] font-medium text-[var(--theme-primary,#38BDF8)]">
                      Independent Software Developer &amp; Creator
                    </div>

                    <div className="text-[12px] text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                      <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <a href="mailto:daily-Khata-Pro@gmail.com" className="hover:underline text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] font-mono">
                        daily-Khata-Pro@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mr-1">Specialties:</span>
                  <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    Open Source
                  </span>
                  <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                    Financial Systems
                  </span>
                  <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    Offline First
                  </span>
                  <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                    TypeScript &amp; React
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2 text-[13px] text-[#CBD5E1] leading-relaxed">
                  <p>
                    I&apos;m an independent software developer committed to crafting accessible, privacy-respecting tools that simplify daily life and bring structured discipline into personal finances.
                  </p>
                  <p className="text-[#F8FAFC] font-medium italic border-l-2 border-[var(--theme-primary,#38BDF8)] pl-3 text-[12.5px] mt-2">
                    &ldquo;My mission is to build digital tools that empower individuals to take control of their lives through technology, privacy, and systematic discipline.&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href="mailto:daily-Khata-Pro@gmail.com"
                    className="p-3 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Developer</span>
                  </a>
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#CBD5E1] hover:text-[#10B981] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                    <span>GitHub Repository</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
