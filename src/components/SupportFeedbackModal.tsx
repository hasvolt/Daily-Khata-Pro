import React, { useState, useEffect } from 'react';
import {
  X,
  Bug,
  Lightbulb,
  HelpCircle,
  Mail,
  FolderGit2,
  Copy,
  Check,
  Send,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { AppLanguage } from '../types';
import { APP_VERSION_TAG } from '../utils/version';

export type SupportTab = 'help' | 'bug' | 'suggestion';

interface SupportFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SupportTab;
  language?: AppLanguage;
  onOpenManual?: () => void;
  onOpenSourceCode?: () => void;
  onOpenFullPage?: (tab?: SupportTab) => void;
}

export const SupportFeedbackModal: React.FC<SupportFeedbackModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'help',
  language = 'en',
  onOpenManual,
  onOpenSourceCode,
  onOpenFullPage
}) => {
  const [activeTab, setActiveTab] = useState<SupportTab>(initialTab);
  const isHindi = language === 'hi';
  const officialEmail = 'daily-Khata-Pro@gmail.com';

  // Bug Report Form State
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSeverity, setBugSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [bugSteps, setBugSteps] = useState('');

  // Suggestion Form State
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState<string>('Ledger & 6-Funds');
  const [suggestionDescription, setSuggestionDescription] = useState('');

  // Help FAQ Accordion
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [faqSearch, setFaqSearch] = useState('');

  // UI state
  const [copied, setCopied] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setFeedbackNotice(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4000);
  };

  const getSystemInfo = () => {
    if (typeof window === 'undefined') return 'Unknown';
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const screenRes = `${window.innerWidth}x${window.innerHeight}`;
    return `Daily Khata Pro ${APP_VERSION_TAG} | ${isMobile ? 'Mobile' : 'Desktop'} | Screen: ${screenRes} | UserAgent: ${ua.substring(0, 80)}...`;
  };

  // 1. Email Handler strictly sending to daily-Khata-Pro@gmail.com
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
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // FAQ List
  const faqs = [
    {
      id: 'faq-1',
      qEn: 'Where is my financial data stored? Is it safe?',
      qHi: 'मेरा वित्तीय डेटा कहाँ सुरक्षित रहता है? क्या यह सुरक्षित है?',
      aEn: 'Daily Khata: Pro operates on a 100% Offline-First architecture. All your ledger transactions, 6-fund balances, savings goals, and notes are encrypted and stored in your device\'s local storage (`localStorage`). No data is sent to external servers.',
      aHi: 'Daily Khata: Pro शत-प्रतिशत ऑफलाइन-फर्स्ट आर्किटेक्चर पर काम करता है। आपका सारा वित्तीय रिकॉर्ड, 6-फंड हिसाब, गोल्स और नोट्स केवल आपके डिवाइस के लोकल स्टोरेज में सुरक्षित रहते हैं। कोई डेटा किसी बाहरी सर्वर पर नहीं भेजा जाता।'
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F8FAFC]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-[var(--theme-card,#132438)] border-b border-[var(--theme-border,#213E61)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <HasVoltLogo size={32} />
            <div>
              <h2 id="support-modal-title" className="text-base sm:text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                <span>{isHindi ? 'सहायता एवं सुझाव केंद्र' : 'Help & Support Centre'}</span>
              </h2>
              <p className="text-[11px] sm:text-[11.5px] text-[#94A3B8]">
                {isHindi
                  ? 'बग रिपोर्ट करें, सुझाव भेजें या अक्सर पूछे जाने वाले प्रश्न पढ़ें'
                  : 'Report bugs, submit ideas & browse troubleshooting guides'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenFullPage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullPage(activeTab);
                }}
                className="p-2 rounded-xl text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer text-[12px] flex items-center gap-1 font-semibold"
                title={isHindi ? 'पूरा पेज खोलें' : 'Open Full Page'}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">{isHindi ? 'पूरा पेज' : 'Full Page'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
              title={isHindi ? 'बंद करें' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] px-2 sm:px-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 font-bold text-[12px] sm:text-[12.5px] border-b-2 transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.1))]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>{isHindi ? 'सहायता केंद्र' : 'Help Centre & FAQ'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bug')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 font-bold text-[12px] sm:text-[12.5px] border-b-2 transition-all cursor-pointer ${
              activeTab === 'bug'
                ? 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Bug className="w-4 h-4 shrink-0" />
            <span>{isHindi ? 'बग रिपोर्ट करें' : 'Report a Bug'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestion')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 font-bold text-[12px] sm:text-[12.5px] border-b-2 transition-all cursor-pointer ${
              activeTab === 'suggestion'
                ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>{isHindi ? 'सुझाव दें' : 'Suggestion'}</span>
          </button>
        </div>

        {/* Floating Feedback Notice */}
        {feedbackNotice && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/40 text-[var(--theme-primary,#38BDF8)] text-[12px] font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{feedbackNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackNotice(null)}
              className="text-[#94A3B8] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: HELP CENTRE & FAQ */}
          {activeTab === 'help' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {onOpenManual && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenManual();
                    }}
                    className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-colors text-left flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold text-[#F8FAFC] group-hover:text-[var(--theme-primary,#38BDF8)]">
                        {isHindi ? 'विस्तृत यूजर मैनुअल' : 'Interactive User Manual'}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {isHindi ? 'सभी सुविधाओं और 6-फंड नियमों की पूरी गाइड' : 'Step-by-step documentation & rules'}
                      </div>
                    </div>
                  </button>
                )}

                {onOpenSourceCode && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSourceCode();
                    }}
                    className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981]/50 transition-colors text-left flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-[#10B981]/15 text-[#10B981] shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold text-[#F8FAFC] group-hover:text-[#10B981]">
                        {isHindi ? 'सुरक्षा एवं प्राइवेसी ऑडिट' : 'Safety & Security Audit'}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {isHindi ? '100% ऑफलाइन लोकल स्टोरेज सत्यापन' : 'Verify local browser storage safety'}
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Direct Support Channels Strip - STRICTLY daily-Khata-Pro@gmail.com */}
              <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)]/60 border border-[var(--theme-border,#213E61)] space-y-2">
                <div className="text-[11.5px] font-bold text-[#CBD5E1] flex items-center justify-between">
                  <span>{isHindi ? 'आधिकारिक सपोर्ट चैनल' : 'Official Support Channel'}</span>
                  <span className="text-[10px] text-[#94A3B8]">Response within 24h</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${officialEmail}?subject=Daily%20Khata%20Pro%20Support%20Request`}
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] text-[#CBD5E1] hover:text-[#F8FAFC] flex items-center justify-between transition-colors font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <span className="truncate">{officialEmail}</span>
                    </div>
                    <Send className="w-3 h-3 text-[#64748B] shrink-0" />
                  </a>
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[12px] text-[#CBD5E1] hover:text-[#10B981] flex items-center gap-1.5 transition-colors font-semibold"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-[#64748B]" />
                  </a>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-bold text-[#F8FAFC]">
                    {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}
                  </span>
                  <input
                    type="text"
                    placeholder={isHindi ? 'खोजें...' : 'Search questions...'}
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[11px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] w-36 sm:w-48"
                  />
                </div>

                <div className="space-y-1.5">
                  {filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-[var(--theme-card-hover,#19304A)] transition-colors cursor-pointer"
                        >
                          <span className="text-[12px] font-bold text-[#CBD5E1]">
                            {isHindi ? faq.qHi : faq.qEn}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 pt-1 text-[11.5px] leading-relaxed text-[#94A3B8] border-t border-[var(--theme-border,#213E61)]/50">
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
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11.5px] text-[#FCA5A5] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{isHindi ? 'समस्या का निवारण:' : 'Found an issue?'}</span>{' '}
                  {isHindi
                    ? 'कृपया नीचे दिए गए फॉर्म को भरें और ईमेल द्वारा डेवलपर को भेजें। सभी आवश्यक डिवाइस विवरण स्वतः संलग्न हो जाएंगे।'
                    : 'Fill out this quick form to send diagnostic details directly to the developer via email at daily-Khata-Pro@gmail.com.'}
                </div>
              </div>

              {/* Bug Title */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
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
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              {/* Severity & Component */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
                    {isHindi ? 'गंभीरता (Severity)' : 'Severity'}
                  </label>
                  <select
                    value={bugSeverity}
                    onChange={(e) => setBugSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] focus:outline-none focus:border-[#EF4444]"
                  >
                    <option value="low">Low (मामूली - Minor visual glitch)</option>
                    <option value="medium">Medium (सामान्य - Normal issue)</option>
                    <option value="high">High (गंभीर - Feature not working)</option>
                    <option value="critical">Critical (अति गंभीर - App crash / data issue)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
                    {isHindi ? 'डिवाइस का वातावरण (Auto-Detected)' : 'Environment'}
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)]/50 border border-[var(--theme-border,#213E61)] text-[11px] text-[#94A3B8] font-mono truncate">
                    {getSystemInfo()}
                  </div>
                </div>
              </div>

              {/* Bug Description */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
                  {isHindi ? 'समस्या का पूरा विवरण (Details)' : 'Detailed Description'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    isHindi
                      ? 'समस्या कब और कैसे आई, क्या कोई एरर मैसेज दिखा...'
                      : 'Describe what happened, expected behavior, and error messages...'
                  }
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              {/* Steps to Reproduce */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
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
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendEmail('bug')}
                  className="px-3.5 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isHindi ? 'ईमेल द्वारा भेजें' : 'Send via Email'}</span>
                </button>

                <a
                  href="https://github.com/hasvolt/Daily-Khata-Pro/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#F8FAFC]/40 text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                  <span>GitHub Issue</span>
                  <ExternalLink className="w-3 h-3 text-[#64748B]" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyDetails('bug')}
                  className="px-3 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                  title="Copy details to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'कॉपी करें' : 'Copy')}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SUGGESTION & FEATURE REQUEST */}
          {activeTab === 'suggestion' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[11.5px] text-[#FCD34D] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{isHindi ? 'आपका सुझाव हमारे लिए महत्वपूर्ण है:' : 'Your Ideas Shape the App:'}</span>{' '}
                  {isHindi
                    ? 'यदि आपके पास Daily Khata Pro के लिए कोई नया विचार, नई सुविधा या सुधार का सुझाव है, तो सीधे साझा करें।'
                    : 'Have a feature request, calculation tool, or UX improvement idea? Share directly with the creator.'}
                </div>
              </div>

              {/* Suggestion Title */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
                  {isHindi ? 'सुझाव का शीर्षक (Suggestion Title) *' : 'Feature / Suggestion Title *'}
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
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
                  {isHindi ? 'श्रेणी (Category)' : 'Category'}
                </label>
                <select
                  value={suggestionCategory}
                  onChange={(e) => setSuggestionCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="Ledger & 6-Funds">खाता एवं 6-फंड (Ledger &amp; 6-Funds)</option>
                  <option value="Calculators">कैलकुलेटर एवं टूल्स (Calculators &amp; Suite)</option>
                  <option value="Reports & Print">रिपोर्ट्स एवं A4 प्रिंट (Reports &amp; PDF)</option>
                  <option value="Security & Backup">सुरक्षा एवं बैकअप (Security &amp; PIN)</option>
                  <option value="Themes & Design">डिज़ाइन एवं थीम्स (Themes &amp; UI)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>

              {/* Suggestion Description */}
              <div>
                <label className="block text-[11.5px] font-bold text-[#CBD5E1] mb-1">
                  {isHindi ? 'विस्तार से बताएं (Details & Benefit)' : 'Description & Impact'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    isHindi
                      ? 'यह सुविधा कैसे काम करनी चाहिए और इससे दैनिक वित्तीय प्रबंधन में क्या लाभ होगा...'
                      : 'Explain how this feature should work and how it improves financial tracking...'
                  }
                  value={suggestionDescription}
                  onChange={(e) => setSuggestionDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendEmail('suggestion')}
                  className="px-3.5 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#040D17] font-bold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isHindi ? 'ईमेल द्वारा सुझाव भेजें' : 'Send via Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyDetails('suggestion')}
                  className="px-3 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                  title="Copy details to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'कॉपी करें' : 'Copy')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[var(--theme-card,#132438)] border-t border-[var(--theme-border,#213E61)] flex items-center justify-between text-[11px] text-[#94A3B8] shrink-0">
          <div className="flex items-center gap-2">
            <span>Daily Khata: Pro • Open Source</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SupportFeedbackModal;
