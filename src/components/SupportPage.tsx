import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  Bug,
  Lightbulb,
  Mail,
  FolderGit2,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen,
  Send,
  MessageSquare,
  LifeBuoy
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { AppLanguage } from '../types';
import { APP_VERSION_TAG } from '../utils/version';

export type SupportTab = 'help' | 'bug' | 'suggestion';

interface SupportPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
  onOpenManual?: () => void;
  onOpenSourceCode?: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en',
  onOpenManual,
  onOpenSourceCode
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isHindi = language === 'hi';
  const officialEmail = 'daily-Khata-Pro@gmail.com';

  // Read tab from URL query param ?tab=bug | ?tab=suggestion | ?tab=help
  const tabParam = searchParams.get('tab');
  const initialActiveTab: SupportTab =
    tabParam === 'bug' || tabParam === 'suggestion' || tabParam === 'help'
      ? tabParam
      : 'help';

  const [activeTab, setActiveTab] = useState<SupportTab>(initialActiveTab);

  // Sync tab with URL query param
  const handleTabChange = (newTab: SupportTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  useEffect(() => {
    if (tabParam === 'bug' || tabParam === 'suggestion' || tabParam === 'help') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Bug Form State
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSeverity, setBugSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [bugSteps, setBugSteps] = useState('');

  // Suggestion Form State
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState<string>('Ledger & 6-Funds');
  const [suggestionDescription, setSuggestionDescription] = useState('');

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [faqSearch, setFaqSearch] = useState('');

  // Feedback notifications
  const [copied, setCopied] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const getSystemInfo = () => {
    if (typeof window === 'undefined') return 'Unknown';
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const screenRes = `${window.innerWidth}x${window.innerHeight}`;
    return `Daily Khata Pro ${APP_VERSION_TAG} | ${isMobile ? 'Mobile' : 'Desktop'} | Screen: ${screenRes} | UA: ${ua.substring(0, 75)}...`;
  };

  // 1. Email Handler strictly using daily-Khata-Pro@gmail.com
  const handleSendEmail = (type: 'bug' | 'suggestion') => {
    let subject = '';
    let body = '';

    if (type === 'bug') {
      if (!bugTitle.trim()) {
        showToast(isHindi ? 'कृपया बग का शीर्षक दर्ज करें!' : 'Please enter a bug title/summary!');
        return;
      }
      subject = `[Bug Report] Daily Khata Pro: ${bugTitle}`;
      body = `BUG REPORT - Daily Khata Pro\n------------------------------------\nTitle: ${bugTitle}\nSeverity: ${bugSeverity.toUpperCase()}\n\nDescription:\n${bugDescription || 'N/A'}\n\nSteps to Reproduce:\n${bugSteps || 'N/A'}\n\nSystem Info:\n${getSystemInfo()}\nTime: ${new Date().toLocaleString()}\n\nRecipient: ${officialEmail}`;
    } else {
      if (!suggestionTitle.trim()) {
        showToast(isHindi ? 'कृपया सुझाव का शीर्षक दर्ज करें!' : 'Please enter a suggestion title!');
        return;
      }
      subject = `[Suggestion] Daily Khata Pro: ${suggestionTitle}`;
      body = `FEATURE SUGGESTION - Daily Khata Pro\n------------------------------------\nTitle: ${suggestionTitle}\nCategory: ${suggestionCategory}\n\nDetails & Impact:\n${suggestionDescription || 'N/A'}\n\nSystem Info:\n${getSystemInfo()}\nTime: ${new Date().toLocaleString()}\n\nRecipient: ${officialEmail}`;
    }

    const mailtoUrl = `mailto:${officialEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    showToast(isHindi ? 'ईमेल क्लाइंट खुल रहा है...' : 'Opening email client...');
  };

  // 2. Copy Details Handler
  const handleCopyDetails = (type: 'bug' | 'suggestion') => {
    let text = '';
    if (type === 'bug') {
      text = `=== BUG REPORT: Daily Khata Pro ===\nTo: ${officialEmail}\nTitle: ${bugTitle || 'Bug Report'}\nSeverity: ${bugSeverity}\nDetails: ${bugDescription}\nSteps: ${bugSteps}\nSystem: ${getSystemInfo()}\nDate: ${new Date().toISOString()}`;
    } else {
      text = `=== SUGGESTION: Daily Khata Pro ===\nTo: ${officialEmail}\nTitle: ${suggestionTitle || 'Suggestion'}\nCategory: ${suggestionCategory}\nDetails: ${suggestionDescription}\nDate: ${new Date().toISOString()}`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast(isHindi ? 'विवरण क्लिपबोर्ड पर कॉपी हो गया!' : 'Details copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // FAQ Data
  const faqs = [
    {
      id: 'faq-1',
      qEn: 'Where is my financial data stored? Is it safe?',
      qHi: 'मेरा वित्तीय डेटा कहाँ सुरक्षित रहता है? क्या यह सुरक्षित है?',
      aEn: 'Daily Khata Pro operates on a 100% Offline-First architecture. All your ledger transactions, 6-fund balances, savings goals, and notes are encrypted and stored in your device\'s local storage (`localStorage`). No data is sent to external servers.',
      aHi: 'Daily Khata Pro शत-प्रतिशत ऑफलाइन-फर्स्ट आर्किटेक्चर पर काम करता है। आपका सारा वित्तीय रिकॉर्ड, 6-फंड हिसाब, गोल्स और नोट्स केवल आपके डिवाइस के लोकल स्टोरेज में सुरक्षित रहते हैं। कोई डेटा किसी बाहरी सर्वर पर नहीं भेजा जाता।'
    },
    {
      id: 'faq-2',
      qEn: 'How can I backup and restore my ledger data?',
      qHi: 'मैं अपने खाता डेटा का बैकअप और रिस्टोर कैसे करूँ?',
      aEn: 'Open App Settings > Data Backup & Restore. Click "Download JSON Backup" to save a secure backup file. When switching devices, simply click "Restore from Backup" and upload your JSON file.',
      aHi: 'ऐप सेटिंग्स > डेटा बैकअप एवं रिस्टोर खोलें। "JSON बैकअप डाउनलोड करें" पर क्लिक करें। नया फोन या कंप्यूटर बदलने पर "बैकअप से रिस्टोर करें" पर क्लिक करके फाइल अपलोड करें।'
    },
    {
      id: 'faq-3',
      qEn: 'How does the 6-Fund Rule work?',
      qHi: '6-फंड (6-Jar) वित्तीय नियम कैसे काम करता है?',
      aEn: 'Whenever you log income, it is automatically partitioned into 6 dedicated funds: Necessities (50%), Long-Term Savings (10%), Financial Freedom/Investments (10%), Education (10%), Play & Joy (10%), and Giving/Charity (10%). You can customize these percentages anytime in Settings.',
      aHi: 'जब भी आप कोई आय दर्ज करते हैं, वह स्वचालित रूप से 6 फंडों में बंट जाती है: आवश्यकताएं (50%), बचत (10%), वित्तीय स्वतंत्रता (10%), शिक्षा (10%), आनंद (10%), और दान (10%)। आप सेटिंग्स में जाकर इन प्रतिशत को कभी भी बदल सकते हैं।'
    },
    {
      id: 'faq-4',
      qEn: 'What if I forget my 4-digit Security PIN?',
      qHi: 'यदि मैं अपना 4-अंकीय सुरक्षा पिन भूल जाऊं तो क्या करूँ?',
      aEn: 'When setting up your PIN, a secret Master Recovery Code is provided. If you forget your PIN, click "Forgot PIN" on the lock screen and enter your Recovery Code to reset. As an offline safety measure, you can also perform a local emergency reset.',
      aHi: 'पिन सेट करते समय आपको एक मास्टर रिकवरी कोड मिलता है। पिन भूलने पर लॉक स्क्रीन पर "पिन भूल गए?" पर क्लिक करें और रिकवरी कोड दर्ज करें। इमरजेंसी में आप लोकल डेटा रीसेट भी कर सकते हैं।'
    },
    {
      id: 'faq-5',
      qEn: 'How to install this app on Android, iPhone, or PC?',
      qHi: 'इस ऐप को Android, iPhone या कंप्यूटर पर कैसे इंस्टॉल करें?',
      aEn: 'On Chrome / Edge / Android: Click the "Install App" button in the menu or browser address bar. On iPhone Safari: Tap the Share button (square with arrow up) and select "Add to Home Screen".',
      aHi: 'Chrome / Android पर: मेनू में "ऐप इंस्टॉल करें" पर क्लिक करें। iPhone (Safari) पर: शेयर आइकन पर टैप करें और "Add to Home Screen" चुनें।'
    },
    {
      id: 'faq-6',
      qEn: 'Can I print or generate monthly A4 PDF statements?',
      qHi: 'क्या मैं मासिक A4 PDF स्टेटमेंट प्रिंट या डाउनलोड कर सकता हूँ?',
      aEn: 'Yes! In the Ledger or Reports view, click the "Print / PDF Statement" button. You can customize the month, filter by category, and generate a clean, official A4 ledger report with summary totals.',
      aHi: 'हाँ! लेजर या रिपोर्ट्स पेज में "प्रिंट / PDF स्टेटमेंट" बटन पर क्लिक करें। आप माह चुनकर साफ़-सुथरी A4 स्टेटमेंट प्रिंट या PDF सेव कर सकते हैं।'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.qEn.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.qHi.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.aEn.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.aHi.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Header & Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            {isHindi ? 'सहायता एवं फीडबैक केंद्र' : 'Help & Support Centre'}
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--theme-border,#213E61)]">
          <div className="flex items-center gap-3.5">
            <HasVoltLogo size={36} />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
                {isHindi ? 'सहायता एवं फीडबैक केंद्र' : 'Help & Support Centre'}
              </h1>
              <p className="text-[12px] sm:text-[13px] text-[#94A3B8]">
                {isHindi
                  ? 'अक्सर पूछे जाने वाले प्रश्न पढ़ें, बग रिपोर्ट करें या नए विचार साझा करें'
                  : 'Browse troubleshooting FAQs, report issues, or suggest new features'}
              </p>
            </div>
          </div>

          {/* Official Email Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px]">
            <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
            <a
              href={`mailto:${officialEmail}`}
              className="font-mono text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] font-semibold transition-colors"
            >
              {officialEmail}
            </a>
          </div>
        </div>

        {/* Tab Switcher Strip */}
        <div className="flex rounded-2xl bg-[var(--theme-surface,#0E1A29)] p-1.5 border border-[var(--theme-border,#213E61)] gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => handleTabChange('help')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl font-bold text-[10.5px] sm:text-[12.5px] text-center leading-tight transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)]'
            }`}
          >
            <HelpCircle className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span>{isHindi ? 'सहायता केंद्र' : 'Help Centre & FAQ'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('bug')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl font-bold text-[10.5px] sm:text-[12.5px] text-center leading-tight transition-all cursor-pointer ${
              activeTab === 'bug'
                ? 'bg-[#EF4444] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)]'
            }`}
          >
            <Bug className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span>{isHindi ? 'बग रिपोर्ट करें' : 'Report a Bug'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('suggestion')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl font-bold text-[10.5px] sm:text-[12.5px] text-center leading-tight transition-all cursor-pointer ${
              activeTab === 'suggestion'
                ? 'bg-[#F59E0B] text-[#040D17] shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)]'
            }`}
          >
            <Lightbulb className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span>{isHindi ? 'सुझाव दें' : 'Give Suggestion'}</span>
          </button>
        </div>

        {/* Floating Toast Notice */}
        {toastNotice && (
          <div className="p-3 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/40 text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{toastNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastNotice(null)}
              className="text-[#94A3B8] hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: HELP CENTRE & FAQ */}
        {activeTab === 'help' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Action Navigation Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  if (onOpenManual) onOpenManual();
                  else if (onNavigateTab) onNavigateTab('guide');
                  else navigate('/guide');
                }}
                className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all text-left flex items-start gap-3.5 cursor-pointer group shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13.5px] font-bold text-[#F8FAFC] group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                    {isHindi ? 'विस्तृत यूजर मैनुअल गाइड' : 'Interactive User Manual'}
                  </div>
                  <div className="text-[12px] text-[#94A3B8] mt-0.5">
                    {isHindi ? '6-फंड सिस्टम, बैकअप, और सभी फीचर्स की पूरी गाइड' : 'Complete step-by-step documentation & tutorials'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenSourceCode) onOpenSourceCode();
                  else if (onNavigateTab) onNavigateTab('safety');
                  else navigate('/safety');
                }}
                className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981]/50 transition-all text-left flex items-start gap-3.5 cursor-pointer group shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13.5px] font-bold text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                    {isHindi ? 'सुरक्षा एवं प्राइवेसी ऑडिट' : 'Safety & Security Audit'}
                  </div>
                  <div className="text-[12px] text-[#94A3B8] mt-0.5">
                    {isHindi ? '100% ऑफलाइन लोकल स्टोरेज का सीधा सत्यापन' : 'Verify offline browser data encryption & local storage'}
                  </div>
                </div>
              </button>
            </div>

            {/* Official Direct Contact Strip - STRICTLY daily-Khata-Pro@gmail.com */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                  <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'आधिकारिक सहायता ईमेल' : 'Official Support Channel'}</span>
                </div>
                <span className="text-[11px] text-[#94A3B8]">Response within 24h</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href={`mailto:${officialEmail}?subject=Daily%20Khata%20Pro%20Support%20Request`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12.5px] text-[#CBD5E1] hover:text-[#F8FAFC] flex items-center justify-between transition-colors font-mono"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{officialEmail}</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-[#64748B]" />
                </a>

                <a
                  href="https://github.com/hasvolt/Daily-Khata-Pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[12.5px] text-[#CBD5E1] hover:text-[#10B981] flex items-center gap-2 transition-colors font-semibold"
                >
                  <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                  <span>GitHub Repo</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                </a>
              </div>
            </div>

            {/* FAQ Search and Accordion */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <h3 className="text-[14.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}</span>
                </h3>
                <input
                  type="text"
                  placeholder={isHindi ? 'प्रश्नों में खोजें...' : 'Search questions & solutions...'}
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] w-full sm:w-64"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer"
                      >
                        <span className="text-[13px] font-bold text-[#E2E8F0]">
                          {isHindi ? faq.qHi : faq.qEn}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-[12.5px] leading-relaxed text-[#94A3B8] border-t border-[var(--theme-border,#213E61)]/40">
                          {isHindi ? faq.aHi : faq.aEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUG REPORT */}
        {activeTab === 'bug' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[12.5px] text-[#FCA5A5] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{isHindi ? 'समस्या का निवारण:' : 'Found a bug or glitch?'}</span>{' '}
                {isHindi
                  ? 'कृपया नीचे दिए गए फॉर्म को भरें और ईमेल द्वारा डेवलपर को भेजें। सभी आवश्यक डिवाइस विवरण स्वतः संलग्न हो जाएंगे।'
                  : 'Fill out the form below to send full diagnostic details directly to the developer at daily-Khata-Pro@gmail.com.'}
              </div>
            </div>

            {/* Bug Title */}
            <div>
              <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                {isHindi ? 'समस्या का शीर्षक (Issue Summary) *' : 'Bug / Problem Summary *'}
              </label>
              <input
                type="text"
                placeholder={
                  isHindi
                    ? 'उदा. लेजर में फ़िल्टर काम नहीं कर रहा, या प्रिंट बटन रिस्पॉन्ड नहीं कर रहा'
                    : 'e.g., Filter not responding on Ledger, or Print preview blank'
                }
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EF4444]"
              />
            </div>

            {/* Severity & Environment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                  {isHindi ? 'गंभीरता (Severity)' : 'Severity Level'}
                </label>
                <select
                  value={bugSeverity}
                  onChange={(e) => setBugSeverity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[#EF4444]"
                >
                  <option value="low">Low (मामूली - Minor visual glitch)</option>
                  <option value="medium">Medium (सामान्य - Normal issue)</option>
                  <option value="high">High (गंभीर - Feature not working)</option>
                  <option value="critical">Critical (अति गंभीर - App crash / data issue)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                  {isHindi ? 'डिवाइस का वातावरण (Auto-Detected)' : 'Environment Diagnostic'}
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[11px] text-[#94A3B8] font-mono truncate">
                  {getSystemInfo()}
                </div>
              </div>
            </div>

            {/* Bug Description */}
            <div>
              <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                {isHindi ? 'समस्या का पूरा विवरण (Details)' : 'Detailed Description'}
              </label>
              <textarea
                rows={3}
                placeholder={
                  isHindi
                    ? 'समस्या कब और कैसे आई, क्या कोई त्रुटि संदेश दिखा...'
                    : 'Describe what happened, expected behavior, and error messages...'
                }
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EF4444]"
              />
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                {isHindi ? 'दोहराने के चरण (Steps to Reproduce - Optional)' : 'Steps to Reproduce (Optional)'}
              </label>
              <input
                type="text"
                placeholder={
                  isHindi
                    ? '1. ऐड टैब पर गया > 2. राशि दर्ज की > 3. सेव पर क्लिक किया'
                    : '1. Clicked on Add > 2. Entered Amount > 3. Clicked Save'
                }
                value={bugSteps}
                onChange={(e) => setBugSteps(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EF4444]"
              />
            </div>

            {/* Bug Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleSendEmail('bug')}
                className="px-4 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>{isHindi ? 'ईमेल द्वारा भेजें' : 'Send via Email'}</span>
              </button>

              <a
                href="https://github.com/hasvolt/Daily-Khata-Pro/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#F8FAFC]/40 text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                <span>GitHub Issue</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyDetails('bug')}
                className="px-4 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-[13px] flex items-center gap-2 transition-colors cursor-pointer ml-auto"
              >
                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'विवरण कॉपी करें' : 'Copy Details')}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SUGGESTION */}
        {activeTab === 'suggestion' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[12.5px] text-[#FCD34D] flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{isHindi ? 'आपका सुझाव महत्वपूर्ण है:' : 'Your Ideas Shape the App:'}</span>{' '}
                {isHindi
                  ? 'यदि आपके पास Daily Khata Pro के लिए कोई नया विचार, गणना उपकरण या सुधार का सुझाव है, तो सीधे ईमेल भेजें।'
                  : 'Have a feature request, new calculation tool, or UX improvement idea? Share directly with the developer.'}
              </div>
            </div>

            {/* Suggestion Title */}
            <div>
              <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                {isHindi ? 'सुझाव का शीर्षक (Feature Title) *' : 'Feature / Suggestion Title *'}
              </label>
              <input
                type="text"
                placeholder={
                  isHindi
                    ? 'उदा. ऑटो-बैकअप गूगल ड्राइव में, नया निवेश कैलकुलेटर, या डार्क ओलेड थीम'
                    : 'e.g., Auto-sync with Google Drive, New Tax Slab Calculator, OLED Pure Black Theme'
                }
                value={suggestionTitle}
                onChange={(e) => setSuggestionTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            {/* Suggestion Category */}
            <div>
              <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                {isHindi ? 'श्रेणी (Category)' : 'Category'}
              </label>
              <select
                value={suggestionCategory}
                onChange={(e) => setSuggestionCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="Ledger & 6-Funds">खाता एवं 6-फंड (Ledger &amp; 6-Funds)</option>
                <option value="Calculators">कैलकुलेटर एवं टूल्स (Calculators &amp; Suite)</option>
                <option value="Reports & Print">रिपोर्ट्स एवं A4 प्रिंट (Reports &amp; PDF)</option>
                <option value="Security & Backup">सुरक्षा एवं बैकअप (Security &amp; PIN)</option>
                <option value="Themes & Design">डिज़ाइन एवं थीम्स (Themes &amp; UI)</option>
                <option value="Other">अन्य (Other)</option>
              </select>
            </div>

            {/* Suggestion Details */}
            <div>
              <label className="block text-[12px] font-bold text-[#CBD5E1] mb-1.5">
                {isHindi ? 'विस्तार से बताएं (Details & Impact)' : 'Description & Benefits'}
              </label>
              <textarea
                rows={4}
                placeholder={
                  isHindi
                    ? 'यह सुविधा कैसे काम करनी चाहिए और इससे दैनिक वित्तीय प्रबंधन में क्या लाभ होगा...'
                    : 'Explain how this feature should work and how it improves financial tracking...'
                }
                value={suggestionDescription}
                onChange={(e) => setSuggestionDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleSendEmail('suggestion')}
                className="px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#040D17] font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>{isHindi ? 'ईमेल द्वारा सुझाव भेजें' : 'Send via Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyDetails('suggestion')}
                className="px-4 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-[13px] flex items-center gap-2 transition-colors cursor-pointer ml-auto"
              >
                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'विवरण कॉपी करें' : 'Copy Details')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between text-[11.5px] text-[#94A3B8] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>Daily Khata Pro • Open Source Financial System</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${officialEmail}`}
            className="hover:text-[var(--theme-primary,#38BDF8)] transition-colors font-mono"
          >
            {officialEmail}
          </a>
        </div>
      </div>
    </div>
  );
};
export default SupportPage;
