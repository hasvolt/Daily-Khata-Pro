import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Code2,
  Home,
  PlusCircle,
  History,
  BarChart3,
  Target,
  Briefcase,
  BookOpen,
  Calendar,
  Calculator,
  Settings,
  Shield,
  Trash2,
  Bell,
  Share2,
  HelpCircle,
  FileText,
  ShieldCheck,
  Award,
  Lock,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'developer' | 'pages' | 'finance' | 'tools' | 'settings';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab?: string;
  routePath?: string;
  keywords: string[];
  badge?: string;
}

interface PageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (targetTab: string, routePath?: string) => void;
  language?: AppLanguage;
}

export const PageSearchModal: React.FC<PageSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  language = 'en'
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isHindi = language === 'hi';

  // Master index of searchable pages, features, and tools
  const searchItems: SearchItem[] = useMemo(() => [
    // 1. Developer Profile (Priority Item)
    {
      id: 'developer-profile',
      title: isHindi ? 'डेवलपर प्रोफाइल (एमडी ज़फीर हसन - YAZDAAN)' : 'Developer Profile & Creator (MD Zafeer Hasan - YAZDAAN)',
      subtitle: isHindi
        ? 'HASVOLT, ओपन-सोर्स MIT लाइसेंस, आधिकारिक प्रमाण पत्र, संपर्क विवरण'
        : 'HASVOLT Founder, MIT Open Source, Verified Credentials, Projects & Contacts',
      category: 'developer',
      categoryLabel: isHindi ? 'डेवलपर एवं क्रिएटर' : 'Developer & Creator',
      icon: Code2,
      targetTab: 'developer',
      routePath: '/developer',
      keywords: [
        'developer', 'dev', 'devloper', 'profile', 'creator', 'founder', 'md zafeer hasan',
        'zafeer', 'yazdaan', 'hasvolt', 'owner', 'contact', 'email', 'photo', 'info',
        'डेवलपर', 'निर्माता', 'ज़फीर', 'हसन', 'प्रोफाइल'
      ],
      badge: 'Creator'
    },
    // 2. Core Navigation Pages
    {
      id: 'home',
      title: isHindi ? 'होम / मुख्य डैशबोर्ड' : 'Home Dashboard & 6-Fund Overview',
      subtitle: isHindi ? 'सभी 6 फंड्स के बैलेंस, आज का शुद्ध संचय और त्वरित आंकड़े' : 'Consolidated net balance, 6 financial pots, daily net summary',
      category: 'finance',
      categoryLabel: isHindi ? 'वित्तीय लेजर' : 'Financial Ledger',
      icon: Home,
      targetTab: 'home',
      routePath: '/',
      keywords: ['home', 'dashboard', 'funds', 'balance', 'khata', 'overview', 'होम', 'डैशबोर्ड', 'खाता']
    },
    {
      id: 'add-transaction',
      title: isHindi ? 'नया लेन-देन जोड़ें (आय / व्यय)' : 'Add Transaction (Income / Expense)',
      subtitle: isHindi ? 'आय का स्वतः 6-फंड विभाजन और व्यय की त्वरित प्रविष्टि' : 'Auto 6-fund disciplined allocation rule or specific expense deduction',
      category: 'finance',
      categoryLabel: isHindi ? 'वित्तीय लेजर' : 'Financial Ledger',
      icon: PlusCircle,
      targetTab: 'add',
      routePath: '/add',
      keywords: ['add', 'income', 'expense', 'deposit', 'spend', 'transaction', 'आय', 'खर्च', 'जमा', 'लेनदेन']
    },
    {
      id: 'history',
      title: isHindi ? 'लेन-देन इतिहास और बहीखाता' : 'Ledger History & Search Records',
      subtitle: isHindi ? 'तारीख, फंड और कैटेगरी अनुसार फ़िल्टर करें और एडिट करें' : 'Filter, search, edit, and inspect complete transaction history',
      category: 'finance',
      categoryLabel: isHindi ? 'वित्तीय लेजर' : 'Financial Ledger',
      icon: History,
      targetTab: 'history',
      routePath: '/history',
      keywords: ['history', 'ledger', 'records', 'entries', 'search', 'filter', 'इतिहास', 'लेजर', 'खोज', 'प्रविष्टियां']
    },
    {
      id: 'reports',
      title: isHindi ? 'वित्तीय रिपोर्ट्स और विश्लेषण' : 'Financial Reports & Monthly Analytics',
      subtitle: isHindi ? 'मासिक चार्ट, फंड प्रवाह, प्रतिशत उपयोग और PDF डाउनलोड' : 'Visual analytics, fund breakdown, monthly charts & export',
      category: 'finance',
      categoryLabel: isHindi ? 'वित्तीय लेजर' : 'Financial Ledger',
      icon: BarChart3,
      targetTab: 'report',
      routePath: '/report',
      keywords: ['report', 'analytics', 'charts', 'monthly', 'pdf', 'summary', 'रिपोर्ट', 'विश्लेषण', 'चार्ट']
    },
    {
      id: 'goals',
      title: isHindi ? 'वित्तीय लक्ष्य और बचत' : 'Financial Goals & Milestones',
      subtitle: isHindi ? 'लक्ष्य राशि तय करें और बचत प्रगति को ट्रैक करें' : 'Set savings milestones, track deadlines and progress visually',
      category: 'finance',
      categoryLabel: isHindi ? 'वित्तीय लेजर' : 'Financial Ledger',
      icon: Target,
      targetTab: 'goals',
      routePath: '/goals',
      keywords: ['goals', 'targets', 'milestones', 'savings', 'future', 'लक्ष्य', 'बचत', 'टारगेट']
    },
    {
      id: 'tracker',
      title: isHindi ? 'कार्य और क्लाइंट डिलीवरी ट्रैकर' : 'Work Deliverables & Client Tracker',
      subtitle: isHindi ? 'क्लाइंट्स, प्रोजेक्ट्स, बिलिंग घंटे और स्टेटस ट्रैक करें' : 'Track client billing, project deliverables, and billable hours',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Briefcase,
      targetTab: 'tracker',
      routePath: '/tracker',
      keywords: ['work', 'tracker', 'freelancer', 'client', 'deliverables', 'hours', 'काम', 'क्लाइंट', 'घंटे']
    },
    {
      id: 'notes',
      title: isHindi ? 'दैनिक जीवन डायरी और नोट्स' : 'Daily Life Journal & Personal Notes',
      subtitle: isHindi ? 'दैनिक आदतें, मूड ट्रैकर, मॉर्निंग/नाइट रूटीन और विचार' : 'Log morning/evening routines, moods, key learnings & private notes',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: BookOpen,
      targetTab: 'notes',
      routePath: '/notes',
      keywords: ['notes', 'journal', 'routine', 'diary', 'mood', 'thoughts', 'डायरी', 'नोट्स', 'रूटीन', 'विचार']
    },
    {
      id: 'attendance',
      title: isHindi ? 'उपस्थिति और शिफ्ट लॉग' : 'Attendance & Shift Log',
      subtitle: isHindi ? 'क्लॉक-इन, क्लॉक-आउट, कुल कार्य दिवस और छुट्टियां' : 'Track clock in/out, working days, overtime hours & leaves',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Calendar,
      targetTab: 'attendance',
      routePath: '/attendance',
      keywords: ['attendance', 'shift', 'work hours', 'leaves', 'clock in', 'उपस्थिति', 'हाजिरी', 'शिफ्ट']
    },
    {
      id: 'calculator',
      title: isHindi ? 'वित्तीय कैलकुलेटर सूट' : 'Financial Calculators Suite',
      subtitle: isHindi ? 'SIP, रूल 72, CAGR, EMI, GST और चक्रवृद्धि ब्याज कैलकुलेटर' : 'Rule of 72, SIP Wealth, CAGR, EMI, GST & Compound Interest tools',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Calculator,
      targetTab: 'calculator',
      routePath: '/calculator',
      keywords: ['calculator', 'sip', 'cagr', 'emi', 'gst', 'rule 72', 'interest', 'कैलकुलेटर', 'ब्याज', 'सिप']
    },

    // 3. Information & Legal Pages
    {
      id: 'about',
      title: isHindi ? 'Daily Khata Pro के बारे में' : 'About Daily Khata Pro',
      subtitle: isHindi ? 'मिशन, 6-फंड सिद्धांत, ऑफ़लाइन आर्किटेक्चर और विशेषताएं' : 'Universal ledger mission, 6-fund system, zero-knowledge architecture',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: Sparkles,
      targetTab: 'about',
      routePath: '/about',
      keywords: ['about', 'mission', 'purpose', 'creator', 'architecture', 'के बारे में', 'मिशन', 'जानकारी']
    },
    {
      id: 'guide',
      title: isHindi ? 'उपयोगकर्ता गाइड और मैनुअल' : 'User Manual & Step-by-Step Guide',
      subtitle: isHindi ? 'ऐप की हर सुविधा और फंड नियम का सम्पूर्ण मार्गदर्शन' : 'Comprehensive feature walkthrough, tips, shortcuts and documentation',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: FileText,
      targetTab: 'guide',
      routePath: '/guide',
      keywords: ['guide', 'manual', 'help', 'tutorial', 'documentation', 'गाइड', 'मैनुअल', 'सहायता']
    },
    {
      id: 'privacy',
      title: isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy & Zero Data Collection',
      subtitle: isHindi ? '100% ऑफ़लाइन डेटा, कोई बाहरी ट्रैकर नहीं, पूर्ण निजता' : '100% local storage, zero telemetry, no cloud transmission guarantee',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: ShieldCheck,
      targetTab: 'privacy',
      routePath: '/privacy',
      keywords: ['privacy', 'security', 'data', 'offline', 'policy', 'गोपनीयता', 'प्राइवेसी', 'डेटा']
    },
    {
      id: 'terms',
      title: isHindi ? 'नियम व शर्तें (Terms of Service)' : 'Terms of Service (MIT Open Source)',
      subtitle: isHindi ? 'ओपन सोर्स उपयोग, लाइसेंस की शर्तें और डेटा ज़िम्मेदारी' : 'MIT License terms, self-custody rights, and open software rules',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: FileText,
      targetTab: 'terms',
      routePath: '/terms',
      keywords: ['terms', 'license', 'mit', 'open source', 'conditions', 'नियम', 'शर्तें', 'लाइसेंस']
    },
    {
      id: 'disclaimer',
      title: isHindi ? 'कानूनी डिस्क्लेमर (Legal Disclaimer)' : 'Legal & Financial Disclaimer',
      subtitle: isHindi ? 'गैर-सलाहकारी वित्तीय और शैक्षिक गणना अस्वीकरण' : 'Non-advisory educational tool and user responsibility disclosure',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: Award,
      targetTab: 'disclaimer',
      routePath: '/disclaimer',
      keywords: ['disclaimer', 'legal', 'advisory', 'disclosure', 'डिस्क्लेमर', 'अस्वीकरण', 'कानूनी']
    },
    {
      id: 'safety',
      title: isHindi ? 'सोर्स कोड एवं सुरक्षा गारंटी' : 'Source Safety & Zero Telemetry Guarantee',
      subtitle: isHindi ? 'सॉफ़्टवेयर सुरक्षा, वेब क्रिप्टो पिन एन्क्रिप्शन और ऑडिट' : 'Zero analytics cookies, client-side encryption, and audit report',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: Lock,
      targetTab: 'safety',
      routePath: '/safety',
      keywords: ['safety', 'security', 'source code', 'audit', 'crypto', 'सुरक्षा', 'कोड', 'सेफ्टी']
    },
    {
      id: 'support',
      title: isHindi ? 'सहायता केंद्र और फीडबैक' : 'Help & Support Centre (FAQ / Bug Report)',
      subtitle: isHindi ? 'सवाल-जवाब, समस्या की रिपोर्ट और नए सुझाव भेजें' : 'Frequently asked questions, report an issue, or send feedback',
      category: 'pages',
      categoryLabel: isHindi ? 'जानकारी व नीतियां' : 'Information & Legal',
      icon: HelpCircle,
      targetTab: 'support',
      routePath: '/support',
      keywords: ['support', 'help', 'faq', 'bug', 'feedback', 'contact', 'सहायता', 'सपोर्ट', 'बग', 'फीडबैक']
    },

    // 4. Quick Settings & Utilities
    {
      id: 'settings',
      title: isHindi ? 'सेटिंग्स और फंड प्रतिशत' : 'Settings & 6-Fund Percentages',
      subtitle: isHindi ? 'फंड आवंटन प्रतिशत, थीम, मुद्रा और भाषा बदलें' : 'Customize fund split percentages, currency symbol, theme & language',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं यूटिलिटीज' : 'Settings & Utilities',
      icon: Settings,
      targetTab: 'settings',
      keywords: ['settings', 'preferences', 'percentages', 'theme', 'currency', 'language', 'सेटिंग्स', 'थीम', 'भाषा']
    },
    {
      id: 'security-pin',
      title: isHindi ? 'सुरक्षा पिन और ऐप लॉक' : 'Security PIN & App Lock Screen',
      subtitle: isHindi ? '4-अंकों के गुप्त पिन कोड से लेजर को लॉक करें' : 'Protect your ledger with an offline cryptographic 4-digit PIN',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं यूटिलिटीज' : 'Settings & Utilities',
      icon: Shield,
      targetTab: 'security',
      keywords: ['pin', 'lock', 'security', 'password', 'protect', 'पिन', 'लॉक', 'पासवर्ड']
    },
    {
      id: 'trash',
      title: isHindi ? 'रीसायकल बिन / ट्रैश' : 'Recycle Bin / Trash Recovery',
      subtitle: isHindi ? 'हटाए गए लेन-देन देखें और आवश्यकतानुसार रीस्टोर करें' : 'View, restore or permanently purge soft-deleted transactions',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं यूटिलिटीज' : 'Settings & Utilities',
      icon: Trash2,
      targetTab: 'trash',
      keywords: ['trash', 'recycle bin', 'delete', 'restore', 'recover', 'ट्रैश', 'कचरा', 'रीस्टोर']
    },
    {
      id: 'reminders',
      title: isHindi ? 'बिल और भुगतान रिमाइंडर' : 'Scheduled Reminders & Alerts',
      subtitle: isHindi ? 'आवर्ती बिल, SIP किश्त और देय तिथियों के लिए अलर्ट्स' : 'Setup scheduled reminders for recurring bills, loans and SIP dates',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं यूटिलिटीज' : 'Settings & Utilities',
      icon: Bell,
      targetTab: 'reminders',
      keywords: ['reminders', 'alerts', 'bills', 'schedule', 'notification', 'रिमाइंडर', 'अलर्ट', 'बिल']
    },
    {
      id: 'share',
      title: isHindi ? 'Daily Khata Pro साझा करें' : 'Share Daily Khata Pro',
      subtitle: isHindi ? 'दोस्तों, परिवार व व्यापारियों के साथ ऐप का लिंक साझा करें' : 'Share the offline financial ledger app via WhatsApp, Telegram, etc.',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं यूटिलिटीज' : 'Settings & Utilities',
      icon: Share2,
      targetTab: 'share',
      keywords: ['share', 'invite', 'link', 'whatsapp', 'social', 'साझा', 'शेयर']
    }
  ], [isHindi]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return searchItems;

    return searchItems.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      const matchCategory = item.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchKeywords || matchCategory;
    });
  }, [searchItems, query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    triggerHapticSound('click');
    onClose();
    if (item.targetTab) {
      onNavigate(item.targetTab, item.routePath);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search pages and tools"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
            <Search className="w-4 h-4" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHindi ? 'पेज, टूल, फीचर या डेवलपर खोजें... (उदा: developer, khata, goal)' : 'Search any page, tool, feature or developer... (e.g. developer, report, sip)'}
              className="w-full bg-transparent text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#64748B)] text-[14px] sm:text-[15px] font-medium outline-none pr-8"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] rounded-lg"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]">
              ESC to close
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
              title="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="px-3.5 sm:px-4 py-2 border-b border-[var(--theme-border,#213E61)]/60 bg-[var(--theme-surface,#0E1A29)]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] shrink-0 mr-1">
            {isHindi ? 'त्वरित:' : 'Quick:'}
          </span>
          <button
            type="button"
            onClick={() => setQuery('developer')}
            className="px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 hover:bg-[var(--theme-primary,#38BDF8)]/25 text-[var(--theme-primary,#38BDF8)] font-semibold border border-[var(--theme-primary,#38BDF8)]/30 shrink-0 cursor-pointer transition-colors"
          >
            👨‍💻 Developer Profile
          </button>
          <button
            type="button"
            onClick={() => setQuery('calculator')}
            className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] font-semibold border border-[var(--theme-border,#213E61)] shrink-0 cursor-pointer transition-colors"
          >
            🧮 Calculators
          </button>
          <button
            type="button"
            onClick={() => setQuery('reports')}
            className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] font-semibold border border-[var(--theme-border,#213E61)] shrink-0 cursor-pointer transition-colors"
          >
            📊 Reports
          </button>
          <button
            type="button"
            onClick={() => setQuery('guide')}
            className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] font-semibold border border-[var(--theme-border,#213E61)] shrink-0 cursor-pointer transition-colors"
          >
            📖 Manual Guide
          </button>
          <button
            type="button"
            onClick={() => setQuery('privacy')}
            className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] font-semibold border border-[var(--theme-border,#213E61)] shrink-0 cursor-pointer transition-colors"
          >
            🛡️ Privacy
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center mx-auto text-[var(--theme-text-dim,#64748B)]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'कोई पेज या टूल नहीं मिला' : 'No matching page or tool found'}
                </p>
                <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] mt-1">
                  {isHindi ? 'कृपया "developer", "khata", "goals" या "reports" लिखकर देखें।' : 'Try searching for "developer", "calculator", "reports" or "privacy".'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold border border-[var(--theme-border,#213E61)] cursor-pointer"
              >
                {isHindi ? 'सभी पेज दिखाएं' : 'View All Pages'}
              </button>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const IconComp = item.icon;
              const isDeveloperItem = item.category === 'developer';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left ${
                    isSelected
                      ? isDeveloperItem
                        ? 'bg-[var(--theme-primary,#38BDF8)]/20 border-2 border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] shadow-sm'
                        : 'bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/60 text-[var(--theme-text,#F8FAFC)]'
                      : isDeveloperItem
                      ? 'bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-text,#F8FAFC)]'
                      : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/60 text-[var(--theme-text-muted,#CBD5E1)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isDeveloperItem
                          ? 'bg-[var(--theme-primary,#38BDF8)]/25 border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                          : isSelected
                          ? 'bg-[var(--theme-primary,#38BDF8)]/20 border-[var(--theme-primary,#38BDF8)]/40 text-[var(--theme-primary,#38BDF8)]'
                          : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]'
                      }`}
                    >
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] sm:text-[14px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-[12px] text-[var(--theme-text-dim,#94A3B8)] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 text-[var(--theme-text-dim,#64748B)]">
                      {item.categoryLabel}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text-dim,#64748B)] opacity-60'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/60 flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
          <div className="flex items-center gap-2">
            <span>{filteredItems.length} {isHindi ? 'परिणाम' : 'results'}</span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline">Daily Khata Pro Quick Navigator</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-[9px]">↑↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-[9px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSearchModal;
