import React, { useState, useMemo } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Twitter,
  Mail,
  QrCode,
  Globe,
  Home,
  Receipt,
  PlusCircle,
  Target,
  Briefcase,
  BarChart3,
  Calculator,
  CalendarCheck,
  CreditCard,
  FileText,
  Newspaper,
  GraduationCap,
  BookOpen,
  Info,
  Code2,
  LifeBuoy,
  Heart,
  ShieldCheck,
  Lock,
  FileCheck,
  AlertTriangle,
  Cookie,
  Search,
  Send,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  language?: AppLanguage;
  onSelectTab?: (tab: NavTab) => void;
}

interface PageShareItem {
  id: NavTab;
  labelEn: string;
  labelHi: string;
  descEn: string;
  descHi: string;
  category: 'core' | 'tools' | 'knowledge' | 'about' | 'legal';
  icon: React.ElementType;
  badge?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  language = 'en',
  onSelectTab
}) => {
  const [selectedShareTab, setSelectedShareTab] = useState<NavTab>(currentTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'tools' | 'knowledge' | 'about' | 'legal'>('all');
  const [copied, setCopied] = useState(false);
  const [copiedSpecific, setCopiedSpecific] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  const isHindi = language === 'hi' || language === 'hinglish';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dailykhatapro.com';

  const getPageUrl = (tab: NavTab) => {
    if (tab === 'home') return `${baseUrl}/`;
    return `${baseUrl}/${tab}`;
  };

  const ALL_PAGES: PageShareItem[] = [
    // 1. Core Financial Records
    {
      id: 'home',
      labelEn: 'Home Dashboard',
      labelHi: 'होम डैशबोर्ड',
      descEn: 'Net balance, 6-Fund allocation & daily summary',
      descHi: 'नेट बैलेंस, 6-फंड वितरण व दैनिक सारांश',
      category: 'core',
      icon: Home,
      badge: 'Main'
    },
    {
      id: 'history',
      labelEn: 'Khata Records & History',
      labelHi: 'खाता रिकॉर्ड व इतिहास',
      descEn: 'Complete transaction ledger, search & filters',
      descHi: 'पूर्ण लेन-देन बहीखाता, खोज व फिल्टर',
      category: 'core',
      icon: Receipt,
      badge: 'Ledger'
    },
    {
      id: 'add',
      labelEn: 'Add Transaction',
      labelHi: 'नया लेन-देन जोड़ें',
      descEn: 'Quick income, expense & 6-fund split entry',
      descHi: 'त्वरित आय, व्यय व 6-फंड विभाजन एंट्री',
      category: 'core',
      icon: PlusCircle,
      badge: 'Entry'
    },
    {
      id: 'goals',
      labelEn: 'Financial Goals & Milestones',
      labelHi: 'वित्तीय लक्ष्य व सेविंग्स',
      descEn: 'Target deadlines, deposit tracking & milestones',
      descHi: 'लक्ष्य समय-सीमा, जमा राशि व प्रगति ट्रैकिंग',
      category: 'core',
      icon: Target,
      badge: 'Goals'
    },
    {
      id: 'report',
      labelEn: 'Analytics & Reports',
      labelHi: 'रिपोर्ट व वित्तीय विश्लेषण',
      descEn: 'Interactive charts, monthly breakdown & PDF reports',
      descHi: 'मासिक चार्ट्स, फंड ब्रेकडाउन व रिपोर्ट एक्सपोर्ट',
      category: 'core',
      icon: BarChart3,
      badge: 'Analytics'
    },
    {
      id: 'attendance',
      labelEn: 'Attendance & Duty Register',
      labelHi: 'हाजिरी व शिफ्ट रजिस्टर',
      descEn: 'Staff/self duty punch, overtime & salary calc',
      descHi: 'दैनिक उपस्थिति, ओवरटाइम व वेतन गणना',
      category: 'core',
      icon: CalendarCheck,
      badge: 'Shift'
    },
    {
      id: 'tracker',
      labelEn: 'Work & Life Balance Tracker',
      labelHi: 'कार्य व जीवन संतुलन ट्रैकर',
      descEn: 'Daily tasks, productive hours & well-being',
      descHi: 'दैनिक कार्य, उत्पादक घंटे व दिनचर्या',
      category: 'core',
      icon: Briefcase,
      badge: 'Routine'
    },
    {
      id: 'loans',
      labelEn: 'Udhar & Debt Manager',
      labelHi: 'उधार / कर्ज खाता प्रबंधक',
      descEn: 'Track money given & taken, reminders & dues',
      descHi: 'दिया व लिया उधार, बकाया राशि व रिमाइंडर',
      category: 'core',
      icon: CreditCard,
      badge: 'Udhar'
    },
    {
      id: 'notes',
      labelEn: 'Secure Personal Vault & Notes',
      labelHi: 'सुरक्षित निजी तिजोरी व नोट्स',
      descEn: 'Encrypted offline notes, tags & quick thoughts',
      descHi: 'सुरक्षित ऑफ़लाइन नोट्स, टैग्स व विचार',
      category: 'core',
      icon: FileText,
      badge: 'Vault'
    },

    // 2. Calculators & Financial Tools
    {
      id: 'calculator',
      labelEn: 'Currency, Gold & Loan Calc',
      labelHi: 'करेंसी, गोल्ड व ईएमआई कैलकुलेटर',
      descEn: '38+ world currencies, live gold/silver & loans',
      descHi: '38+ वैश्विक मुद्राएं (ईरान, खाड़ी देश), सोना व ईएमआई',
      category: 'tools',
      icon: Calculator,
      badge: '38+ Rates'
    },

    // 3. Knowledge & Information
    {
      id: 'news',
      labelEn: 'Commercial & Market News',
      labelHi: 'वाणिज्यिक व बाज़ार समाचार',
      descEn: 'Live commodity, business & financial updates',
      descHi: 'कमोडिटी, व्यापार व वित्तीय ताज़ा समाचार',
      category: 'knowledge',
      icon: Newspaper,
      badge: 'Live News'
    },
    {
      id: 'academy',
      labelEn: 'Financial Education & Academy',
      labelHi: 'वित्तीय शिक्षा व 6-फंड ज्ञान केंद्र',
      descEn: '6-Fund budgeting mastery, guides & tips',
      descHi: '6-फंड बजटिंग पद्धति, वित्तीय सबक व टिप्स',
      category: 'knowledge',
      icon: GraduationCap,
      badge: 'Mastery'
    },
    {
      id: 'guide',
      labelEn: 'User Manual & Step-by-Step Guide',
      labelHi: 'उपयोग मार्गदर्शिका व मैन्युअल',
      descEn: 'Detailed instructions on using all app features',
      descHi: 'ऐप के सभी फीचर्स का उपयोग करने की पूरी विधि',
      category: 'knowledge',
      icon: BookOpen,
      badge: 'Manual'
    },

    // 4. About, Developer & Support
    {
      id: 'about',
      labelEn: 'About Daily Khata Pro',
      labelHi: 'डेली खाता प्रो के बारे में',
      descEn: 'Mission, offline-first philosophy & version specs',
      descHi: 'उद्देश्य, 100% ऑफ़लाइन विज़न व वर्शन जानकारी',
      category: 'about',
      icon: Info,
      badge: 'Overview'
    },
    {
      id: 'developer',
      labelEn: 'Developer & Team Profile',
      labelHi: 'डेवलपर प्रोफाइल व टीम',
      descEn: 'Engineered by Md Zafeer Hasan (Yazdaan)',
      descHi: 'इंजीनियरिंग: मो. ज़फ़ीर हसन (यज़दान)',
      category: 'about',
      icon: Code2,
      badge: 'Creator'
    },
    {
      id: 'support',
      labelEn: 'Help & Support Center',
      labelHi: 'सहायता व संपर्क केंद्र',
      descEn: 'FAQs, contact channels & direct feedback',
      descHi: 'अक्सर पूछे जाने वाले प्रश्न व सीधी सहायता',
      category: 'about',
      icon: LifeBuoy,
      badge: 'Help'
    },
    {
      id: 'support-project',
      labelEn: 'Support & Sponsor Project',
      labelHi: 'प्रोजेक्ट सहयोग व डोनेशन',
      descEn: 'Contribute to open financial independence',
      descHi: 'ओपन-सोर्स वित्तीय मिशन का समर्थन करें',
      category: 'about',
      icon: Heart,
      badge: 'Sponsor'
    },

    // 5. Privacy, Security & Legal
    {
      id: 'safety',
      labelEn: 'Data Security & Offline Safety',
      labelHi: 'डेटा सुरक्षा व ऑफ़लाइन गारंटी',
      descEn: 'Zero-cloud storage, cryptographic privacy & sandbox',
      descHi: 'ज़ीरो-क्लाउड स्टोरेज, 100% स्थानीय डेटा सुरक्षा',
      category: 'legal',
      icon: ShieldCheck,
      badge: '100% Offline'
    },
    {
      id: 'privacy',
      labelEn: 'Privacy Policy',
      labelHi: 'गोपनीयता नीति (Privacy Policy)',
      descEn: 'Transparent privacy standards & data handling',
      descHi: 'पारदर्शी गोपनीयता मानक व डेटा सुरक्षा शर्तें',
      category: 'legal',
      icon: Lock,
      badge: 'Legal'
    },
    {
      id: 'terms',
      labelEn: 'Terms of Service',
      labelHi: 'उपयोग के नियम व शर्तें (Terms)',
      descEn: 'Fair use rules, license & user agreement',
      descHi: 'उचित उपयोग नियम, लाइसेंस व उपभोक्ता अनुबंध',
      category: 'legal',
      icon: FileCheck,
      badge: 'Legal'
    },
    {
      id: 'disclaimer',
      labelEn: 'Financial Disclaimer',
      labelHi: 'वित्तीय अस्वीकरण (Disclaimer)',
      descEn: 'Independent accounting tool disclaimer notice',
      descHi: 'स्वतंत्र लेखांकन सॉफ्टवेयर सूचना व अस्वीकरण',
      category: 'legal',
      icon: AlertTriangle,
      badge: 'Notice'
    },
    {
      id: 'cookies',
      labelEn: 'Cookie & Storage Policy',
      labelHi: 'कुकी व लोकल स्टोरेज नीति',
      descEn: 'Browser IndexedDB & storage audit explanation',
      descHi: 'ब्राउज़र स्टोरेज व इंडेक्सडीडीबी विवरण',
      category: 'legal',
      icon: Cookie,
      badge: 'Storage'
    }
  ];

  // Filtered pages based on search and category
  const filteredPages = useMemo(() => {
    return ALL_PAGES.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.labelEn.toLowerCase().includes(q) ||
        item.labelHi.toLowerCase().includes(q) ||
        item.descEn.toLowerCase().includes(q) ||
        item.descHi.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory, ALL_PAGES]);

  const currentShareUrl = getPageUrl(selectedShareTab);
  const activePageItem = ALL_PAGES.find((p) => p.id === selectedShareTab) || ALL_PAGES[0];
  const activePageTitle = isHindi ? activePageItem.labelHi : activePageItem.labelEn;

  const shareTitle = `Daily Khata Pro — ${activePageTitle}`;
  const shareText = isHindi
    ? `Daily Khata Pro पर "${activePageTitle}" देखें:\n${currentShareUrl}\n\n100% ऑफ़लाइन, सुरक्षित व निजी 6-फंड अकाउंटिंग ऐप!`
    : `Explore "${activePageTitle}" on Daily Khata Pro:\n${currentShareUrl}\n\n100% Offline, Private & Secure 6-Fund Accounting!`;

  const handleNativeShare = async () => {
    triggerHapticSound('click');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentShareUrl
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopy(currentShareUrl);
    }
  };

  const handleCopy = (url: string, id: string = 'main') => {
    triggerHapticSound('click');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      if (id === 'main') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } else {
        setCopiedSpecific(id);
        setTimeout(() => setCopiedSpecific(null), 2200);
      }
    }
  };

  const handleNavigateToPage = (tab: NavTab) => {
    triggerHapticSound('click');
    if (onSelectTab) {
      onSelectTab(tab);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 no-print">
      <div className="bg-[#0B1017] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[15px] sm:text-[17px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                  {isHindi ? 'वेबसाइट के सभी पेज लिंक शेयर करें' : 'Share Direct Page Links'}
                </h2>
                <span className="hidden xs:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                  {ALL_PAGES.length} Pages
                </span>
              </div>
              <p className="text-[11px] sm:text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi ? 'किसी भी पेज का डायरेक्ट लिंक कॉपी करें या सीधे उस पेज पर जाएं' : 'Copy direct link to any section or navigate directly'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-5 space-y-4 overflow-y-auto bg-[#070E18] custom-scrollbar">
          {/* Active Shareable Link Card */}
          <div className="p-3.5 rounded-xl bg-[#0E1A29] border border-[var(--theme-primary,#38BDF8)]/40 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
              <span className="font-bold text-[var(--theme-text-muted,#CBD5E1)] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>{isHindi ? 'वर्तमान में चयनित लिंक:' : 'Selected Page Link:'}</span>
                <span className="text-[var(--theme-primary,#38BDF8)] font-semibold">
                  {activePageTitle}
                </span>
              </span>
              <span className="text-[10px] text-[var(--theme-primary,#38BDF8)] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/30">
                /{selectedShareTab === 'home' ? '' : selectedShareTab}
              </span>
            </div>

            {/* URL Input Box + Copy + Open Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 sm:p-2 rounded-lg bg-[#060B11] border border-[#213E61] font-mono text-[12px]">
              <span className="text-[#38BDF8] truncate select-all flex-1 min-w-0 px-1">
                {currentShareUrl}
              </span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={() => handleCopy(currentShareUrl, 'main')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] text-[11.5px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isHindi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'कॉपी लिंक' : 'Copy'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateToPage(selectedShareTab)}
                  className="px-3 py-1.5 rounded-lg bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  title={isHindi ? 'सीधे इस पेज पर जाएं' : 'Open this page now'}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHindi ? 'पेज खोलें' : 'Open'}</span>
                </button>
              </div>
            </div>

            {/* Quick Multi-Platform Share Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHapticSound('click')}
                className="px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHapticSound('click')}
                className="px-3 py-1.5 rounded-lg bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/40 text-[#229ED9] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentShareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHapticSound('click')}
                className="px-3 py-1.5 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/40 text-[#1DA1F2] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X (Twitter)</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`}
                onClick={() => triggerHapticSound('click')}
                className="px-3 py-1.5 rounded-lg bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>Email</span>
              </a>

              {/* Native System Share */}
              {typeof navigator !== 'undefined' && (
                <button
                  onClick={handleNativeShare}
                  className="px-3 py-1.5 rounded-lg bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'शेयर मेन्यू' : 'System Share'}</span>
                </button>
              )}

              {/* QR Code Toggle */}
              <button
                type="button"
                onClick={() => {
                  triggerHapticSound('click');
                  setShowQrCode(!showQrCode);
                }}
                className={`px-3 py-1.5 rounded-lg border text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  showQrCode
                    ? 'bg-purple-500/25 border-purple-500/50 text-purple-300'
                    : 'bg-[#132438] hover:bg-[#1E3A5F] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-purple-400" />
                <span>QR Code</span>
              </button>
            </div>

            {/* QR Code Section */}
            {showQrCode && (
              <div className="p-3 bg-[#060B11] rounded-xl border border-purple-500/30 flex flex-col items-center justify-center gap-2 text-center animate-in fade-in">
                <div className="bg-white p-2.5 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentShareUrl)}`}
                    alt={`QR code for ${activePageTitle}`}
                    className="w-32 h-32"
                    loading="lazy"
                  />
                </div>
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'कैमरे से स्कैन करके सीधे यह पेज खोलें' : 'Scan with phone camera to open this section'}
                </div>
              </div>
            )}
          </div>

          {/* Search & Category Filter Section */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'वेबसाइट के सभी पेज डायरेक्ट लिंक्स' : 'All Available Website Pages & Links'}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  ({filteredPages.length})
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-[var(--theme-text-dim,#94A3B8)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'पेज खोजें (उदा: लोन, कैलकुलेटर, प्राइवेसी)...' : 'Filter pages (calc, loans, notes, terms)...'}
                  className="w-full pl-8 pr-7 py-1.5 bg-[#060B11] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] rounded-lg text-[11.5px] text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: isHindi ? 'सभी (All 22)' : 'All Pages (22)' },
                { id: 'core', label: isHindi ? 'वित्तीय खाते व बही (9)' : 'Financial Records (9)' },
                { id: 'tools', label: isHindi ? 'कैलकुलेटर व टूल्स' : 'Calculators & Tools' },
                { id: 'knowledge', label: isHindi ? 'ज्ञान व समाचार (3)' : 'News & Guides (3)' },
                { id: 'about', label: isHindi ? 'परिचय व सहायता (4)' : 'About & Support (4)' },
                { id: 'legal', label: isHindi ? 'सुरक्षा व नीतियां (5)' : 'Legal & Policies (5)' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    triggerHapticSound('click');
                    setActiveCategory(chip.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer shrink-0 ${
                    activeCategory === chip.id
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)] shadow-xs'
                      : 'bg-[#0E1A29] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:border-[#38BDF8]/40 hover:text-[var(--theme-text,#F8FAFC)]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredPages.map((item) => {
              const Icon = item.icon;
              const url = getPageUrl(item.id);
              const isSelected = selectedShareTab === item.id;
              const isItemCopied = copiedSpecific === item.id;
              const label = isHindi ? item.labelHi : item.labelEn;
              const desc = isHindi ? item.descHi : item.descEn;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    triggerHapticSound('click');
                    setSelectedShareTab(item.id);
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none group ${
                    isSelected
                      ? 'bg-[#132438] border-[var(--theme-primary,#38BDF8)] shadow-md ring-1 ring-[var(--theme-primary,#38BDF8)]/30'
                      : 'bg-[#0E1A29] border-[var(--theme-border,#213E61)] hover:border-[#38BDF8]/50 hover:bg-[#112033]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17]'
                          : 'bg-[#070E18] text-[var(--theme-text-muted,#CBD5E1)] group-hover:text-[var(--theme-primary,#38BDF8)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] sm:text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                          {label}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[var(--theme-text-dim,#94A3B8)] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] sm:text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                        {desc}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Open Page + Copy Link */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToPage(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-[#070E18] hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                      title={isHindi ? `${label} पेज खोलें` : `Open ${label}`}
                      aria-label={`Open ${label}`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(url, item.id);
                      }}
                      className="p-1.5 rounded-lg bg-[#070E18] hover:bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-all cursor-pointer"
                      title={isHindi ? `${label} लिंक कॉपी करें` : `Copy ${label} Link`}
                      aria-label={`Copy link for ${label}`}
                    >
                      {isItemCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPages.length === 0 && (
            <div className="py-8 text-center text-[var(--theme-text-dim,#94A3B8)] space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-[12px]">
                {isHindi ? 'कोई पेज नहीं मिला। कृपया दूसरा शब्द खोजें।' : 'No pages match your search.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {isHindi ? 'सभी लिंक्स 100% ऑफ़लाइन व सुरक्षित हैं' : 'All links 100% offline & safe'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12px] font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
