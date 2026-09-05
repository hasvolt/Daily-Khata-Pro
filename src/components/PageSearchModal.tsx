import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
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
  Zap,
  TrendingUp,
  Percent,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ChevronRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

export type SearchCategory = 'all' | 'finance' | 'calculators' | 'tools' | 'actions' | 'settings' | 'docs';

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
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
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isHindi = language === 'hi';

  // Comprehensive master index of searchable pages, features, calculators, and actions
  const searchItems: SearchItem[] = useMemo(() => [
    // --- 1. Financial Ledger & Funds ---
    {
      id: 'home',
      title: isHindi ? 'होम / मुख्य डैशबोर्ड' : 'Home Dashboard & 6-Fund Overview',
      subtitle: isHindi ? 'सभी 6 फंड्स के बैलेंस, आज का शुद्ध संचय और त्वरित आंकड़े' : 'Consolidated net balance, 6 financial pots, daily net summary',
      category: 'finance',
      categoryLabel: isHindi ? 'वित्तीय लेजर' : 'Financial Ledger',
      icon: Home,
      targetTab: 'home',
      routePath: '/',
      keywords: ['home', 'dashboard', 'funds', 'balance', 'khata', 'overview', 'net worth', 'होम', 'डैशबोर्ड', 'खाता', 'कुल बैलेंस', 'बहीखाता']
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
      keywords: ['add', 'income', 'expense', 'deposit', 'spend', 'transaction', 'entry', 'salary', 'profit', 'आय', 'खर्च', 'जमा', 'लेनदेन', 'प्रविष्टि']
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
      keywords: ['history', 'ledger', 'records', 'entries', 'search', 'filter', 'csv', 'excel', 'इतिहास', 'लेजर', 'खोज', 'प्रविष्टियां', 'रिकॉर्ड']
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
      keywords: ['report', 'analytics', 'charts', 'monthly', 'pdf', 'summary', 'spending', 'रिपोर्ट', 'विश्लेषण', 'चार्ट', 'मासिक खर्च']
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
      keywords: ['goals', 'targets', 'milestones', 'savings', 'future', 'dream', 'लक्ष्य', 'बचत', 'टारगेट', 'सपना']
    },

    // --- 2. Financial Calculators Suite ---
    {
      id: 'calculator-main',
      title: isHindi ? 'वित्तीय कैलकुलेटर सूट (मुख्य)' : 'Financial Calculators Suite (All Tools)',
      subtitle: isHindi ? 'SIP, रूल 72, CAGR, EMI, GST और चक्रवृद्धि ब्याज' : 'SIP Wealth, Rule of 72, CAGR Growth, EMI Loan, GST Tax calculators',
      category: 'calculators',
      categoryLabel: isHindi ? 'कैलकुलेटर' : 'Calculators',
      icon: Calculator,
      targetTab: 'calculator',
      routePath: '/calculator',
      badge: 'PRO',
      keywords: ['calculator', 'calculators', 'sip', 'cagr', 'emi', 'gst', 'rule 72', 'interest', 'कैलकुलेटर', 'ब्याज', 'सिप', 'लोन']
    },
    {
      id: 'calc-sip',
      title: isHindi ? 'SIP कैलकुलेटर (मंथली निवेश संचय)' : 'SIP Wealth Builder Calculator',
      subtitle: isHindi ? 'मासिक निवेश, अपेक्षित रिटर्न और चक्रवृद्धि संपत्ति की गणना' : 'Calculate mutual fund SIP growth, total invested & wealth created',
      category: 'calculators',
      categoryLabel: isHindi ? 'कैलकुलेटर' : 'Calculators',
      icon: TrendingUp,
      targetTab: 'calculator',
      routePath: '/calculator',
      keywords: ['sip', 'mutual fund', 'investment', 'wealth', 'compound interest', 'सिप', 'मंथली निवेश', 'म्यूचुअल फंड']
    },
    {
      id: 'calc-rule72',
      title: isHindi ? 'रूल ऑफ 72 कैलकुलेटर (दोगुना पैसा)' : 'Rule of 72 (Money Doubling Period)',
      subtitle: isHindi ? 'ब्याज दर के आधार पर निवेश कितने समय में दोगुना होगा' : 'Estimate how many years it takes for your investment to double',
      category: 'calculators',
      categoryLabel: isHindi ? 'कैलकुलेटर' : 'Calculators',
      icon: Percent,
      targetTab: 'calculator',
      routePath: '/calculator',
      keywords: ['rule 72', 'double money', 'interest rate', 'years', 'दोगुना', 'रूल 72', 'ब्याज दर']
    },
    {
      id: 'calc-cagr',
      title: isHindi ? 'CAGR कैलकुलेटर (वार्षिक विकास दर)' : 'CAGR Calculator (Compound Annual Growth)',
      subtitle: isHindi ? 'प्रारंभिक और अंतिम मूल्य के आधार पर वार्षिक चक्रवृद्धि दर' : 'Measure annual investment return rate over multiple years accurately',
      category: 'calculators',
      categoryLabel: isHindi ? 'कैलकुलेटर' : 'Calculators',
      icon: TrendingUp,
      targetTab: 'calculator',
      routePath: '/calculator',
      keywords: ['cagr', 'growth rate', 'returns', 'annual return', 'वार्षिक विकास', 'रिटर्न']
    },
    {
      id: 'calc-emi',
      title: isHindi ? 'EMI व लोन कैलकुलेटर' : 'Loan & Monthly EMI Calculator',
      subtitle: isHindi ? 'मासिक किस्त, कुल ब्याज और मूलधन भुगतान का स्पष्ट विवरण' : 'Calculate home/car loan monthly installment, total interest payable',
      category: 'calculators',
      categoryLabel: isHindi ? 'कैलकुलेटर' : 'Calculators',
      icon: DollarSign,
      targetTab: 'calculator',
      routePath: '/calculator',
      keywords: ['emi', 'loan', 'mortgage', 'interest', 'installment', 'लोन', 'किस्त', 'ईएमआई', 'कर्ज']
    },
    {
      id: 'calc-gst',
      title: isHindi ? 'GST कर कैलकुलेटर' : 'GST & Tax Calculator (Inclusive / Exclusive)',
      subtitle: isHindi ? '5%, 12%, 18%, 28% स्लैब पर त्वरित कर व कुल बिल राशि' : 'Calculate GST amount, net price, and gross price across Indian tax slabs',
      category: 'calculators',
      categoryLabel: isHindi ? 'कैलकुलेटर' : 'Calculators',
      icon: Percent,
      targetTab: 'calculator',
      routePath: '/calculator',
      keywords: ['gst', 'tax', 'bill', 'cgst', 'sgst', 'vat', 'कर', 'जीएसटी', 'टैक्स']
    },

    // --- 3. Productive Trackers & Tools ---
    {
      id: 'attendance',
      title: isHindi ? 'उपस्थिति और शिफ्ट लॉग रजिस्टर' : 'Attendance & Shift Log Register',
      subtitle: isHindi ? 'क्लॉक-इन, क्लॉक-आउट, कुल कार्य दिवस, ओवरटाइम और छुट्टियां' : 'Track clock in/out, working days, overtime hours & leave tracking',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Calendar,
      targetTab: 'attendance',
      routePath: '/attendance',
      keywords: ['attendance', 'shift', 'work hours', 'leaves', 'clock in', 'punch', 'उपस्थिति', 'हाजिरी', 'शिफ्ट', 'ड्यूटी']
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
      keywords: ['notes', 'journal', 'routine', 'diary', 'mood', 'thoughts', 'habits', 'डायरी', 'नोट्स', 'रूटीन', 'विचार', 'आदतें']
    },
    {
      id: 'tracker',
      title: isHindi ? 'कार्य और क्लाइंट डिलीवरी ट्रैकर' : 'Work Deliverables & Client Tracker',
      subtitle: isHindi ? 'क्लाइंट्स, प्रोजेक्ट्स, बिलिंग घंटे और भुगतान स्थिति' : 'Track client billing, project deliverables, and billable hours',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Briefcase,
      targetTab: 'tracker',
      routePath: '/tracker',
      keywords: ['work', 'tracker', 'freelancer', 'client', 'deliverables', 'hours', 'billing', 'काम', 'क्लाइंट', 'घंटे', 'बिलिंग']
    },
    {
      id: 'reminders',
      title: isHindi ? 'बिल और भुगतान रिमाइंडर' : 'Scheduled Reminders & Bill Alerts',
      subtitle: isHindi ? 'आवर्ती बिल, SIP किश्त और देय तिथियों के लिए अलर्ट्स' : 'Setup scheduled reminders for recurring bills, loans and SIP dates',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Bell,
      targetTab: 'reminders',
      keywords: ['reminders', 'alerts', 'bills', 'schedule', 'notification', 'due date', 'रिमाइंडर', 'अलर्ट', 'बिल', 'तारीख']
    },
    {
      id: 'trash',
      title: isHindi ? 'रीसायकल बिन / ट्रैश' : 'Recycle Bin & Data Recovery',
      subtitle: isHindi ? 'हटाए गए लेन-देन देखें और आवश्यकतानुसार रीस्टोर करें' : 'View, restore or permanently purge soft-deleted transactions',
      category: 'tools',
      categoryLabel: isHindi ? 'टूल्स एवं लॉग्स' : 'Tools & Trackers',
      icon: Trash2,
      targetTab: 'trash',
      keywords: ['trash', 'recycle bin', 'delete', 'restore', 'recover', 'purge', 'ट्रैश', 'कचरा', 'रीस्टोर', 'रिकवर']
    },

    // --- 4. Direct Quick Actions ---
    {
      id: 'act-toggle-theme',
      title: isHindi ? 'दिन / रात मोड बदलें (Day/Night Theme)' : 'Toggle Day / Night Mode',
      subtitle: isHindi ? 'लाइट (Daylight White) और डार्क (Electric Blue) मोड में स्विच करें' : 'Instantly switch between Day Mode and Night Mode',
      category: 'actions',
      categoryLabel: isHindi ? 'त्वरित कार्य' : 'Quick Actions',
      icon: Sun,
      targetTab: 'toggle-theme',
      badge: 'ACTION',
      keywords: ['theme', 'dark mode', 'light mode', 'day', 'night', 'color', 'थीम', 'दिन मोड', 'रात मोड', 'लाइट']
    },
    {
      id: 'act-toggle-privacy',
      title: isHindi ? 'गोपनीयता मास्क (रुपये राशि छुपाएं/दिखाएं)' : 'Toggle Privacy Mask (Hide/Show Balances)',
      subtitle: isHindi ? 'सार्वजनिक स्थानों पर रुपये की राशि को गुप्त या दृश्यमान बनाएं' : 'Mask or reveal financial figures across the dashboard for public privacy',
      category: 'actions',
      categoryLabel: isHindi ? 'त्वरित कार्य' : 'Quick Actions',
      icon: EyeOff,
      targetTab: 'toggle-privacy',
      badge: 'ACTION',
      keywords: ['privacy', 'mask', 'hide', 'show', 'amounts', 'balance', 'eye', 'मास्क', 'छुपाएं', 'प्राइवेसी', 'राशि']
    },
    {
      id: 'act-instant-lock',
      title: isHindi ? 'ऐप तुरंत लॉक करें (Lock Screen)' : 'Lock App Immediately',
      subtitle: isHindi ? 'सुरक्षा पिन सक्रिय होने पर ऐप को तुरंत लॉक स्क्रीन पर भेजें' : 'Trigger immediate lock screen if security PIN is enabled',
      category: 'actions',
      categoryLabel: isHindi ? 'त्वरित कार्य' : 'Quick Actions',
      icon: KeyRound,
      targetTab: 'instant-lock',
      badge: 'ACTION',
      keywords: ['lock', 'screen', 'instant lock', 'pin', 'secure', 'तुरंत लॉक', 'स्क्रीन लॉक']
    },

    // --- 5. Settings & Security ---
    {
      id: 'settings',
      title: isHindi ? 'ऐप सेटिंग्स और 6-फंड अनुपात' : 'Settings & 6-Fund Percentages',
      subtitle: isHindi ? 'फंड आवंटन प्रतिशत, थीम, मुद्रा, भाषा और डेटा बैकअप' : 'Customize fund split percentages, currency symbol, theme & JSON backup',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं सुरक्षा' : 'Settings & Security',
      icon: Settings,
      targetTab: 'settings',
      keywords: ['settings', 'preferences', 'percentages', 'theme', 'currency', 'language', 'backup', 'restore', 'export', 'json', 'सेटिंग्स', 'थीम', 'भाषा', 'बैकअप']
    },
    {
      id: 'security-pin',
      title: isHindi ? 'सुरक्षा पिन और ऐप लॉक सेटिंग्स' : 'Security PIN & App Passcode Settings',
      subtitle: isHindi ? '4-अंकों के गुप्त पिन कोड से लेजर को सुरक्षित रखें' : 'Configure 4-digit offline cryptographic PIN security for data protection',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं सुरक्षा' : 'Settings & Security',
      icon: Shield,
      targetTab: 'security',
      keywords: ['pin', 'lock', 'security', 'password', 'passcode', 'protect', 'पिन', 'लॉक', 'पासवर्ड', 'सुरक्षा']
    },
    {
      id: 'share',
      title: isHindi ? 'Daily Khata Pro साझा करें' : 'Share Daily Khata Pro',
      subtitle: isHindi ? 'दोस्तों, परिवार व व्यापारियों के साथ ऐप का लिंक साझा करें' : 'Share the offline financial ledger app via WhatsApp, Telegram, etc.',
      category: 'settings',
      categoryLabel: isHindi ? 'सेटिंग्स एवं सुरक्षा' : 'Settings & Security',
      icon: Share2,
      targetTab: 'share',
      keywords: ['share', 'invite', 'link', 'whatsapp', 'social', 'साझा', 'शेयर']
    },

    // --- 6. Documentation, Safety & Support ---
    {
      id: 'about',
      title: isHindi ? 'Daily Khata Pro के बारे में' : 'About Daily Khata Pro',
      subtitle: isHindi ? 'मिशन, 6-फंड सिद्धांत, ऑफ़लाइन आर्किटेक्चर और विशेषताएं' : 'Universal ledger mission, 6-fund system, zero-knowledge architecture',
      category: 'docs',
      categoryLabel: isHindi ? 'नीतियां व सहायता' : 'Documentation & Help',
      icon: Sparkles,
      targetTab: 'about',
      routePath: '/about',
      keywords: ['about', 'mission', 'purpose', 'creator', 'architecture', 'के बारे में', 'मिशन', 'जानकारी']
    },
    {
      id: 'guide',
      title: isHindi ? 'उपयोगकर्ता गाइड और मैनुअल' : 'User Manual & Step-by-Step Guide',
      subtitle: isHindi ? 'ऐप की हर सुविधा और फंड नियम का सम्पूर्ण मार्गदर्शन' : 'Comprehensive feature walkthrough, tips, shortcuts and documentation',
      category: 'docs',
      categoryLabel: isHindi ? 'नीतियां व सहायता' : 'Documentation & Help',
      icon: FileText,
      targetTab: 'guide',
      routePath: '/guide',
      keywords: ['guide', 'manual', 'help', 'tutorial', 'documentation', 'गाइड', 'मैनुअल', 'सहायता']
    },
    {
      id: 'privacy',
      title: isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy & Zero Data Collection',
      subtitle: isHindi ? '100% ऑफ़लाइन डेटा, कोई बाहरी ट्रैकर नहीं, पूर्ण निजता' : '100% local storage, zero telemetry, no cloud transmission guarantee',
      category: 'docs',
      categoryLabel: isHindi ? 'नीतियां व सहायता' : 'Documentation & Help',
      icon: ShieldCheck,
      targetTab: 'privacy',
      routePath: '/privacy',
      keywords: ['privacy', 'security', 'data', 'offline', 'policy', 'गोपनीयता', 'प्राइवेसी', 'डेटा']
    },
    {
      id: 'safety',
      title: isHindi ? 'सोर्स कोड एवं सुरक्षा गारंटी' : 'Source Safety & Zero Telemetry Guarantee',
      subtitle: isHindi ? 'सॉफ़्टवेयर सुरक्षा, वेब क्रिप्टो पिन एन्क्रिप्शन और ऑडिट' : 'Zero analytics cookies, client-side encryption, and audit report',
      category: 'docs',
      categoryLabel: isHindi ? 'नीतियां व सहायता' : 'Documentation & Help',
      icon: Lock,
      targetTab: 'safety',
      routePath: '/safety',
      keywords: ['safety', 'security', 'source code', 'audit', 'crypto', 'सुरक्षा', 'कोड', 'सेफ्टी']
    },
    {
      id: 'support',
      title: isHindi ? 'सहायता केंद्र और फीडबैक' : 'Help & Support Centre (FAQ / Bug Report)',
      subtitle: isHindi ? 'सवाल-जवाब, समस्या की रिपोर्ट और नए सुझाव भेजें' : 'Frequently asked questions, report an issue, or send feedback',
      category: 'docs',
      categoryLabel: isHindi ? 'नीतियां व सहायता' : 'Documentation & Help',
      icon: HelpCircle,
      targetTab: 'support',
      routePath: '/support',
      keywords: ['support', 'help', 'faq', 'bug', 'feedback', 'contact', 'सहायता', 'सपोर्ट', 'बग', 'फीडबैक']
    }
  ], [isHindi]);

  // Filter items based on active category and query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = searchItems;

    if (activeCategory !== 'all') {
      list = list.filter(item => item.category === activeCategory);
    }

    if (!q) return list;

    return list.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      const matchCategory = item.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchKeywords || matchCategory;
    });
  }, [searchItems, query, activeCategory]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

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

  const categoriesList: { id: SearchCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: isHindi ? 'सभी' : 'All', icon: Layers },
    { id: 'finance', label: isHindi ? 'लेजर व फंड्स' : 'Ledger', icon: Home },
    { id: 'calculators', label: isHindi ? 'कैलकुलेटर' : 'Calculators', icon: Calculator },
    { id: 'tools', label: isHindi ? 'टूल्स व लॉग' : 'Tools', icon: Briefcase },
    { id: 'actions', label: isHindi ? 'त्वरित कार्य' : 'Actions', icon: Zap },
    { id: 'settings', label: isHindi ? 'सेटिंग्स व सुरक्षा' : 'Settings', icon: Settings },
    { id: 'docs', label: isHindi ? 'नीतियां व गाइड' : 'Docs', icon: BookOpen },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Advance Page and Tool Search"
      className="fixed inset-0 z-50 flex items-start justify-center p-2.5 sm:p-6 sm:pt-16 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150 text-left"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHindi ? 'पेज, टूल, कैलकुलेटर, सेटिंग्स खोजें... (उदा: sip, goal, report, emi)' : 'Search pages, tools, calculators, settings... (e.g. sip, goal, emi)'}
              className="w-full bg-transparent text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#64748B)] text-[14px] sm:text-[15px] font-medium outline-none pr-8"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] rounded-lg cursor-pointer"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
              title="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs Bar */}
        <div className="px-3 sm:px-4 py-2 border-b border-[var(--theme-border,#213E61)]/70 bg-[var(--theme-surface,#0E1A29)]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          {categoriesList.map(cat => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold shadow-xs'
                    : 'bg-[var(--theme-card,#132438)]/70 text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center mx-auto text-[var(--theme-text-dim,#64748B)]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'कोई पेज, टूल या फीचर नहीं मिला' : 'No matching page or tool found'}
                </p>
                <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] mt-1">
                  {isHindi ? 'कृपया "sip", "khata", "goals", "attendance" या "reports" लिखकर देखें।' : 'Try searching for "sip", "khata", "goals", "attendance" or "reports".'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('all');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold border border-[var(--theme-border,#213E61)] cursor-pointer hover:bg-[var(--theme-card-hover,#19304A)]"
              >
                {isHindi ? 'सभी देखें' : 'View All Items'}
              </button>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/70 text-[var(--theme-text,#F8FAFC)] shadow-sm'
                      : 'bg-[var(--theme-card,#132438)]/45 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 text-[var(--theme-text-muted,#CBD5E1)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[var(--theme-primary,#38BDF8)]/20 border-[var(--theme-primary,#38BDF8)]/40 text-[var(--theme-primary,#38BDF8)]'
                          : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]'
                      }`}
                    >
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[13px] sm:text-[14px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shrink-0">
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
                    <span className="hidden sm:inline-block text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 text-[var(--theme-text-dim,#64748B)]">
                      {item.categoryLabel}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text-dim,#64748B)] opacity-50'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Navigation & Direct Shortcut Hints */}
        <div className="p-2.5 sm:p-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/60 flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{filteredItems.length} {isHindi ? 'परिणाम' : 'results'}</span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline">Daily Khata Pro Command Navigator</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-[9px]">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-[9px]">↵</kbd>
              <span>open</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSearchModal;
