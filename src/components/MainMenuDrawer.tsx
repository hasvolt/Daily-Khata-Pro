import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Cloud,
  Settings,
  Trash2,
  HelpCircle,
  ExternalLink,
  Calculator,
  BookOpen,
  Layers,
  Info,
  Shield,
  FileText,
  Mail,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Search,
  Lock,
  Languages,
  Globe,
  ChevronRight,
  RefreshCw,
  ArrowUpCircle,
  X,
  Home,
  PlusCircle,
  History,
  BarChart3,
  Landmark,
  Target,
  Sliders,
  CalendarCheck,
  Briefcase,
  FileText as NotesIcon,
  Split,
  GraduationCap,
  Newspaper,
  ShieldCheck,
  AlertCircle,
  Cookie,
  Download,
  Share2,
  Bell,
  Sparkles,
  Users
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLogo } from './AppLogo';
import { AppTheme, AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';
import { APP_VERSION } from '../utils/version';
import { isGoogleTranslateActive, getActiveGoogleLanguage, ALL_GOOGLE_LANGUAGES } from '../utils/googleTranslate';

export interface MainMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSettings?: () => void;
  onOpenMasterEdit?: () => void;
  onOpenManual?: () => void;
  onOpenSupport?: (tab?: 'help' | 'bug' | 'suggestion') => void;
  onOpenNotes?: () => void;
  onOpenTrash?: () => void;
  trashCount?: number;
  onOpenReminders?: () => void;
  remindersCount?: number;
  onOpenSourceCode?: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenSecurity?: () => void;
  isLockEnabled?: boolean;
  onLockNow?: () => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  onOpenGoogleTranslate?: () => void;
  privacyMask?: boolean;
  onTogglePrivacyMask?: () => void;
  onOpenPageSearch?: () => void;
  onOpenAbout?: () => void;
  onOpenSplitBill?: () => void;
  onOpenBudgetManager?: () => void;
  onOpenLoans?: () => void;
  handleDirectUpdateApp?: (e?: React.MouseEvent) => void;
  isUpdatingApp?: boolean;
  onOpenGoogleDrive?: () => void;
  isDriveConnected?: boolean;
  autoSyncEnabled?: boolean;
  onOpenRozfiberApps?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  badge?: string;
  badgeColor?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  isExternal?: boolean;
  isActive?: boolean;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export const MainMenuDrawer: React.FC<MainMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentTab = 'home',
  onSelectTab,
  onOpenSettings,
  onOpenMasterEdit,
  onOpenManual,
  onOpenSupport,
  onOpenTrash,
  trashCount = 0,
  onOpenReminders,
  remindersCount = 0,
  onOpenSourceCode,
  onOpenInstall,
  onOpenShare,
  onOpenSecurity,
  isLockEnabled = false,
  onLockNow,
  theme = 'blue',
  onThemeChange,
  language = 'en',
  onLanguageChange,
  onOpenGoogleTranslate,
  privacyMask = false,
  onTogglePrivacyMask,
  onOpenPageSearch,
  onOpenAbout,
  onOpenSplitBill,
  onOpenBudgetManager,
  onOpenLoans,
  onOpenGoogleDrive,
  isDriveConnected = false,
  handleDirectUpdateApp,
  isUpdatingApp = false,
  onOpenRozfiberApps
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isHindi = language === 'hi';
  const isLightMode = theme === 'light' || theme === 'white';

  const isGoogleTranslated = isGoogleTranslateActive();
  const activeLangCode = getActiveGoogleLanguage();
  const activeLangObj = activeLangCode ? ALL_GOOGLE_LANGUAGES.find((l) => l.code === activeLangCode) : null;
  const activeLangLabel = activeLangObj ? activeLangObj.nativeName : (activeLangCode ? activeLangCode.toUpperCase() : null);

  // Keyboard shortcut listener (ESC to close menu)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAction = (action?: () => void) => {
    triggerHapticSound('click');
    onClose();
    if (action) {
      action();
    }
  };

  const handleNavigate = (tab: NavTab) => {
    triggerHapticSound('click');
    onClose();
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  // Master List of all original Daily Khata Pro features grouped cleanly
  const sections: MenuSection[] = useMemo(() => [
    // 1. Settings & Cloud Backup (सेटिंग्स व बैकअप)
    {
      id: 'settings-cloud',
      title: isHindi ? 'सेटिंग्स व क्लाउड बैकअप' : 'Settings & Cloud Sync',
      items: [
        {
          id: 'settings',
          label: isHindi ? 'ऐप सेटिंग्स व मुद्रा' : 'App Settings & Currency',
          icon: Settings,
          onClick: onOpenSettings ? () => handleAction(onOpenSettings) : undefined
        },
        {
          id: 'direct-update-app',
          label: isHindi
            ? `1-क्लिक ऐप अपडेट (v${APP_VERSION} New Version)`
            : `1-Click App Update (v${APP_VERSION} New Version)`,
          icon: RefreshCw,
          badge: isUpdatingApp ? (isHindi ? 'अपडेट जारी...' : 'UPDATING...') : '1-CLICK',
          badgeColor: 'emerald',
          onClick: handleDirectUpdateApp ? () => {
            onClose();
            handleDirectUpdateApp();
          } : undefined
        },
        {
          id: 'google-translate',
          label: isHindi
            ? 'गूगल ट्रांसलेटर (100+ भाषाएँ - Google Translate)'
            : 'Google Translator (100+ Languages)',
          icon: Globe,
          badge: isGoogleTranslated ? (activeLangLabel ? activeLangLabel : 'ACTIVE') : '100+ LANGS',
          badgeColor: isGoogleTranslated ? 'emerald' : 'blue',
          onClick: onOpenGoogleTranslate ? () => handleAction(onOpenGoogleTranslate) : undefined
        },
        {
          id: 'master-edit',
          label: isHindi ? 'मास्टर लेजर व श्रेणियां' : 'Master Categories & Ledger',
          icon: User,
          onClick: onOpenMasterEdit ? () => handleAction(onOpenMasterEdit) : undefined
        },
        {
          id: 'cloud-drive',
          label: isHindi ? 'गूगल ड्राइव सिंक व बैकअप' : 'Google Drive Cloud Sync',
          icon: Cloud,
          badge: isDriveConnected ? 'SYNC ON' : undefined,
          badgeColor: 'emerald',
          onClick: onOpenGoogleDrive ? () => handleAction(onOpenGoogleDrive) : undefined
        },
        {
          id: 'security',
          label: isHindi ? 'ऐप सुरक्षा व पिन लॉक' : 'App Security & PIN Lock',
          icon: Lock,
          badge: isLockEnabled ? (isHindi ? 'सक्रिय' : 'LOCKED') : undefined,
          badgeColor: isLockEnabled ? 'rose' : undefined,
          onClick: isLockEnabled && onLockNow
            ? () => handleAction(onLockNow)
            : onOpenSecurity
            ? () => handleAction(onOpenSecurity)
            : undefined
        },
        {
          id: 'reminders',
          label: isHindi ? 'बिल व भुगतान रिमाइंडर' : 'Reminders & Bill Alerts',
          icon: Bell,
          badge: remindersCount > 0 ? String(remindersCount) : undefined,
          badgeColor: 'amber',
          onClick: onOpenReminders ? () => handleAction(onOpenReminders) : undefined
        },
        {
          id: 'trash',
          label: isHindi ? 'रीसायकल बिन (ट्रैश)' : 'Trash (Recycle Bin)',
          icon: Trash2,
          badge: trashCount > 0 ? String(trashCount) : undefined,
          badgeColor: 'rose',
          onClick: onOpenTrash ? () => handleAction(onOpenTrash) : undefined
        }
      ]
    },

    // 2. Core Ledger & Records (मुख्य लेजर व रिकॉर्ड्स)
    {
      id: 'core-ledger',
      title: isHindi ? 'मुख्य लेजर व खाते' : 'Core Ledger & Accounts',
      items: [
        {
          id: 'home',
          label: isHindi ? 'होम / बहीखाता सारांश' : 'Home Ledger Dashboard',
          icon: Home,
          isActive: currentTab === 'home',
          onClick: () => handleNavigate('home')
        },
        {
          id: 'add',
          label: isHindi ? 'नया लेन-देन जोड़ें' : 'Add Transaction (Income / Expense)',
          icon: PlusCircle,
          isActive: currentTab === 'add',
          onClick: () => handleNavigate('add')
        },
        {
          id: 'history',
          label: isHindi ? 'लेन-देन इतिहास व पासबुक' : 'Passbook & Transaction History',
          icon: History,
          isActive: currentTab === 'history',
          onClick: () => handleNavigate('history')
        },
        {
          id: 'report',
          label: isHindi ? 'वित्तीय रिपोर्ट्स व चार्ट्स' : 'Financial Reports & Analytics',
          icon: BarChart3,
          isActive: currentTab === 'report',
          onClick: () => handleNavigate('report')
        }
      ]
    },

    // 3. Loans, Goals & Budgets (ऋण, लक्ष्य व बजट)
    {
      id: 'loans-goals',
      title: isHindi ? 'ऋण, लक्ष्य व बजट' : 'Loans, Goals & Budgets',
      items: [
        {
          id: 'loans',
          label: isHindi ? 'ऋण, किश्त व उधार लेजर' : 'Loans, EMIs & Udhar Ledger',
          icon: Landmark,
          badge: 'PRO',
          badgeColor: 'amber',
          isActive: currentTab === 'loans',
          onClick: onOpenLoans ? () => handleAction(onOpenLoans) : () => handleNavigate('loans')
        },
        {
          id: 'goals',
          label: isHindi ? 'वित्तीय लक्ष्य व बचत' : 'Financial Goals & Milestones',
          icon: Target,
          isActive: currentTab === 'goals',
          onClick: () => handleNavigate('goals')
        },
        {
          id: 'budgets',
          label: isHindi ? 'मासिक बजट व खर्च सीमा' : 'Category Budgets & Limits',
          icon: Sliders,
          onClick: onOpenBudgetManager ? () => handleAction(onOpenBudgetManager) : undefined
        }
      ]
    },

    // 4. Productivity & Work (कार्य व दैनिक आदतें)
    {
      id: 'productivity',
      title: isHindi ? 'कार्य व दैनिक आदतें' : 'Productivity & Habits',
      items: [
        {
          id: 'attendance',
          label: isHindi ? 'दैनिक उपस्थिति / हाजिरी' : 'Daily Attendance Tracker',
          icon: CalendarCheck,
          isActive: currentTab === 'attendance',
          onClick: () => handleNavigate('attendance')
        },
        {
          id: 'tracker',
          label: isHindi ? 'कार्य व क्लाइंट डिलीवरी' : 'Work Deliverables Tracker',
          icon: Briefcase,
          isActive: currentTab === 'tracker',
          onClick: () => handleNavigate('tracker')
        },
        {
          id: 'notes',
          label: isHindi ? 'दैनिक डायरी व नोट्स' : 'Daily Journal & Personal Notes',
          icon: NotesIcon,
          isActive: currentTab === 'notes',
          onClick: () => handleNavigate('notes')
        },
        {
          id: 'split-bill',
          label: isHindi ? 'बिल विभाजन कैलकुलेटर' : 'Bill Splitting Calculator',
          icon: Split,
          onClick: onOpenSplitBill ? () => handleAction(onOpenSplitBill) : undefined
        }
      ]
    },

    // 5. Calculators Suite (वित्तीय कैलकुलेटर व इनवॉइस)
    {
      id: 'calculators-suite',
      title: isHindi ? 'कैलकुलेटर व इनवॉइस सूट' : 'Calculators & Invoicing',
      items: [
        {
          id: 'calculator',
          label: isHindi ? 'वित्तीय कैलकुलेटर सूट' : 'Financial Calculators (SIP, CAGR, EMI, GST)',
          icon: Calculator,
          isActive: currentTab === 'calculator',
          onClick: () => handleNavigate('calculator')
        },
        {
          id: 'invoice',
          label: isHindi ? 'फ्री GST इनवॉइस जनरेटर' : 'Free Invoice & Bill Generator',
          icon: FileText,
          badge: 'FREE',
          badgeColor: 'emerald',
          isActive: currentTab === 'invoice',
          onClick: () => handleNavigate('invoice')
        }
      ]
    },

    // 6. Rozfiber Apps Ecosystem (इकोसिस्टम ऐप्स)
    {
      id: 'rozfiber-ecosystem',
      title: isHindi ? 'Rozfiber ऐप्स इकोसिस्टम' : 'Rozfiber Apps Ecosystem',
      items: [
        {
          id: 'staff-manager',
          label: 'Staff Manager',
          icon: Users,
          badge: 'Sister App',
          badgeColor: 'blue',
          isExternal: true,
          href: 'https://staff.rozfiber.com'
        },
        {
          id: 'rozfiber-docs',
          label: isHindi ? 'रोज़फाइबर डॉक्स (Docs)' : 'Rozfiber Docs',
          icon: BookOpen,
          badge: 'Docs ↗',
          badgeColor: 'slate',
          isExternal: true,
          href: 'https://docs.rozfiber.com'
        },
        {
          id: 'all-apps',
          label: isHindi ? 'सभी Rozfiber ऐप्स देखें' : 'Explore All Rozfiber Apps',
          icon: Layers,
          badge: 'HUB',
          badgeColor: 'emerald',
          onClick: onOpenRozfiberApps ? () => handleAction(onOpenRozfiberApps) : () => handleNavigate('apps')
        }
      ]
    },

    // 7. Knowledge, Help & Policies (गाइड, अकादमी व नीतियां)
    {
      id: 'knowledge-legal',
      title: isHindi ? 'गाइड, अकादमी व नीतियां' : 'Knowledge, Help & Policies',
      items: [
        {
          id: 'guide',
          label: isHindi ? 'उपयोगकर्ता गाइड व मैन्युअल' : 'User Manual & 6-Fund Guide',
          icon: BookOpen,
          isActive: currentTab === 'guide',
          onClick: onOpenManual ? () => handleAction(onOpenManual) : () => handleNavigate('guide')
        },
        {
          id: 'academy',
          label: isHindi ? 'वेल्थ अकादमी (वित्तीय ज्ञान)' : 'Wealth Academy (Financial Mastery)',
          icon: GraduationCap,
          isActive: currentTab === 'academy',
          onClick: () => handleNavigate('academy')
        },
        {
          id: 'news',
          label: isHindi ? 'समाचार व रिसर्च पोर्टल' : 'Commercial News & Research',
          icon: Newspaper,
          badge: 'PORTAL',
          badgeColor: 'blue',
          isActive: currentTab === 'news',
          onClick: () => handleNavigate('news')
        },
        {
          id: 'support',
          label: isHindi ? 'सहायता केंद्र व फीडबैक' : 'Help & Support Centre',
          icon: HelpCircle,
          isActive: currentTab === 'support',
          onClick: onOpenSupport ? () => handleAction(onOpenSupport) : () => handleNavigate('support')
        },
        {
          id: 'about',
          label: isHindi ? 'डेली खाता प्रो के बारे में' : 'About Daily Khata Pro',
          icon: Info,
          isActive: currentTab === 'about',
          onClick: onOpenAbout ? () => handleAction(onOpenAbout) : () => handleNavigate('about')
        },
        {
          id: 'developer',
          label: isHindi ? 'डेवलपर प्रोफाइल (MD Zafeer Hasan)' : 'Developer Profile (MD Zafeer Hasan)',
          icon: User,
          isActive: currentTab === 'developer',
          onClick: () => handleNavigate('developer')
        },
        {
          id: 'privacy',
          label: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy (100% Offline)',
          icon: ShieldCheck,
          isActive: currentTab === 'privacy',
          onClick: () => handleNavigate('privacy')
        },
        {
          id: 'terms',
          label: isHindi ? 'नियम व शर्तें' : 'Terms of Service',
          icon: FileText,
          isActive: currentTab === 'terms',
          onClick: () => handleNavigate('terms')
        },
        {
          id: 'disclaimer',
          label: isHindi ? 'अस्वीकरण' : 'Disclaimer',
          icon: AlertCircle,
          isActive: currentTab === 'disclaimer',
          onClick: () => handleNavigate('disclaimer')
        },
        {
          id: 'cookies',
          label: isHindi ? 'कुकीज़ नीति' : 'Cookie Policy',
          icon: Cookie,
          isActive: currentTab === 'cookies',
          onClick: () => handleNavigate('cookies')
        },
        {
          id: 'safety',
          label: isHindi ? 'सोर्स कोड एवं सुरक्षा ऑडिट' : 'Source Safety & Audit Guarantee',
          icon: Shield,
          isActive: currentTab === 'safety',
          onClick: onOpenSourceCode ? () => handleAction(onOpenSourceCode) : () => handleNavigate('safety')
        },
        {
          id: 'install',
          label: isHindi ? 'ऐप इंस्टॉल करें' : 'Install PWA App',
          icon: Download,
          onClick: onOpenInstall ? () => handleAction(onOpenInstall) : undefined
        },
        {
          id: 'share',
          label: isHindi ? 'ऐप शेयर करें' : 'Share App',
          icon: Share2,
          onClick: onOpenShare ? () => handleAction(onOpenShare) : undefined
        }
      ]
    }
  ], [
    isHindi,
    isDriveConnected,
    isLockEnabled,
    remindersCount,
    trashCount,
    currentTab,
    onOpenSettings,
    onOpenMasterEdit,
    onOpenGoogleDrive,
    onLockNow,
    onOpenSecurity,
    onOpenReminders,
    onOpenTrash,
    onOpenLoans,
    onOpenBudgetManager,
    onOpenSplitBill,
    onOpenRozfiberApps,
    onOpenManual,
    onOpenSupport,
    onOpenAbout,
    onOpenSourceCode,
    onOpenInstall,
    onOpenShare,
    onOpenGoogleTranslate,
    isGoogleTranslated,
    activeLangLabel,
    handleDirectUpdateApp,
    isUpdatingApp
  ]);

  // Filter items if user is searching
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        )
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, searchQuery]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="main-menu-drawer"
        className="w-full max-w-sm sm:max-w-md h-full bg-[#08111E] text-slate-100 border-l border-slate-800/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header (Clean, Matching Screenshot Design) */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* App Logo or Blue Badge */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shrink-0">
              <AppLogo size={26} />
            </div>

            <div className="min-w-0">
              <h2 className="text-[16px] sm:text-[17px] font-bold text-white tracking-tight truncate">
                Daily Khata Pro
              </h2>
              <p className="text-[11.5px] text-slate-400 font-medium truncate mt-0.5">
                {isDriveConnected
                  ? (isHindi ? 'Role: Owner • क्लाउड सिंक सक्रिय' : 'Role: Owner • Cloud Connected')
                  : (isHindi ? 'Role: Owner • 100% ऑफ़लाइन' : 'Role: Owner • 100% Offline')}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar (Clean and helpful to find any feature instantly) */}
        <div className="px-4 sm:px-5 pb-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'मेनू में खोजें (उदा. लोन, सेटिंग्स, अटेंडेंस)...' : 'Search menu items...'}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Banners (New Version 1-Click Update & Google Translator) */}
        <div className="px-4 sm:px-5 pb-2 shrink-0 space-y-2">
          {/* 1-Click New Version Direct Update Banner */}
          {handleDirectUpdateApp && (
            <button
              type="button"
              disabled={isUpdatingApp}
              onClick={() => {
                triggerHapticSound('save');
                onClose();
                handleDirectUpdateApp();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all hover:bg-slate-800/60 active:scale-[0.99] cursor-pointer shadow-xs group disabled:opacity-50"
              title={isHindi ? 'नया वर्शन 1-क्लिक अपडेट व कैश रिफ्रेश' : 'New Version 1-Click Direct Update'}
              id="main-menu-version-update-banner"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 shrink-0">
                  <RefreshCw className={`w-4 h-4 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-white tracking-tight truncate">
                      {isHindi ? 'नया वर्शन 1-क्लिक अपडेट' : 'New Version 1-Click Update'}
                    </span>
                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0">
                      v{APP_VERSION}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {isUpdatingApp
                      ? (isHindi ? 'कैश रीफ्रेश व अपडेट हो रहा है...' : 'Refreshing cache & updating...')
                      : (isHindi ? '1-क्लिक में तुरंत वर्शन अपडेट करें • डेटा सुरक्षित' : '1-Click instant version update • Data 100% safe')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold shrink-0">
                <span className="hidden sm:inline text-[11px]">
                  {isUpdatingApp ? (isHindi ? 'जारी...' : 'Updating') : (isHindi ? 'अपडेट' : 'Update')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          )}

          {/* Google Translator Quick Banner (Prominently visible for instant language translation) */}
          {onOpenGoogleTranslate && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onClose();
                onOpenGoogleTranslate();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-950/70 via-sky-950/40 to-slate-900 border border-sky-500/35 hover:border-sky-400 text-left transition-all hover:bg-slate-800/60 active:scale-[0.99] cursor-pointer shadow-xs group"
              title={isHindi ? 'गूगल ट्रांसलेटर (100+ भाषाएँ)' : 'Google Translator (100+ Languages)'}
              id="main-menu-google-translator-banner"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:text-sky-300 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-white tracking-tight truncate">
                      {isHindi ? 'गूगल अनुवादक (Google Translate)' : 'Google Translator'}
                    </span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-sky-500/25 text-sky-300 border border-sky-500/40 shrink-0">
                      {isGoogleTranslated && activeLangLabel ? activeLangLabel : '100+ LANGS'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {isHindi ? 'हिन्दी, বাংলা, தமிழ், اردو, मराठी व 100+ भाषाएँ' : 'Translate entire app to 100+ languages'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sky-400 text-xs font-semibold shrink-0">
                <span className="hidden sm:inline text-[11px]">{isHindi ? 'खोलें' : 'Open'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>

        {/* Subtle Divider */}
        <div className="mx-4 sm:mx-5 h-px bg-slate-800/80" />

        {/* Drawer Body - Clean, Spacious List Matching Screenshot Style */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-4">
          {filteredSections.map((section, idx) => (
            <div key={section.id} className="space-y-1">
              {/* Clean Section Header Label */}
              <div className="px-2 pt-1 pb-1">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  {section.title}
                </span>
              </div>

              {/* Section Rows */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isRowActive = item.isActive;

                  // External Link Row
                  if (item.isExternal && item.href) {
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          triggerHapticSound('click');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-left transition-colors hover:bg-slate-800/40 active:scale-[0.99] group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <ItemIcon className="w-5 h-5 text-sky-400 shrink-0 group-hover:text-sky-300 transition-colors" />
                          <span className="text-[14px] sm:text-[14.5px] font-medium text-slate-100 group-hover:text-white transition-colors truncate">
                            {item.label}
                          </span>
                        </div>

                        {item.badge && (
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                            item.badgeColor === 'blue'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : item.badgeColor === 'emerald'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </a>
                    );
                  }

                  // Standard Action Button Row
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-left transition-colors active:scale-[0.99] group cursor-pointer ${
                        isRowActive
                          ? 'bg-sky-500/15 border border-sky-500/30 text-sky-300'
                          : 'hover:bg-slate-800/40 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <ItemIcon className={`w-5 h-5 shrink-0 transition-colors ${
                          isRowActive
                            ? 'text-sky-400'
                            : 'text-sky-400 group-hover:text-sky-300'
                        }`} />
                        <span className={`text-[14px] sm:text-[14.5px] font-medium transition-colors truncate ${
                          isRowActive
                            ? 'text-sky-200 font-semibold'
                            : 'text-slate-100 group-hover:text-white'
                        }`}>
                          {item.label}
                        </span>
                      </div>

                      {item.badge && (
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.badgeColor === 'amber'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : item.badgeColor === 'rose'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.badgeColor === 'blue'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Divider between sections */}
              {idx < filteredSections.length - 1 && (
                <div className="pt-2">
                  <div className="h-px bg-slate-800/60" />
                </div>
              )}
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              {isHindi ? 'कोई परिणाम नहीं मिला' : 'No menu items match your search'}
            </div>
          )}
        </div>

        {/* Quick Utility Strip: Day/Night, Language, Privacy Mask */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-900/60 border-t border-slate-800/70 flex items-center justify-between gap-1.5 shrink-0">
          {/* Day/Night Theme Toggle */}
          {onThemeChange && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onThemeChange(isLightMode ? 'blue' : 'white');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer active:scale-95"
              title={isLightMode ? 'Night Mode' : 'Day Mode'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5 text-slate-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isLightMode ? (isHindi ? 'डार्क' : 'Dark') : (isHindi ? 'लाइट' : 'Light')}</span>
            </button>
          )}

          {/* Language Switch */}
          {onLanguageChange && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onLanguageChange(isHindi ? 'en' : 'hi');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer active:scale-95"
              title="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span>{isHindi ? 'English' : 'हिन्दी'}</span>
            </button>
          )}

          {/* Google Translate Switch */}
          {onOpenGoogleTranslate && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onClose();
                onOpenGoogleTranslate();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer active:scale-95"
              title="Google Translator (100+ Languages)"
              id="drawer-utility-google-translate-btn"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{isHindi ? 'अनुवाद' : 'Translate'}</span>
            </button>
          )}

          {/* Privacy Amount Mask */}
          {onTogglePrivacyMask && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onTogglePrivacyMask();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all cursor-pointer active:scale-95 ${
                privacyMask
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/70 hover:bg-slate-700/70 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title="Mask Amounts"
            >
              {privacyMask ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{privacyMask ? (isHindi ? 'छिपा' : 'Masked') : (isHindi ? 'प्राइवेसी' : 'Privacy')}</span>
            </button>
          )}
        </div>

        {/* Drawer Footer (Matching Screenshot Style) */}
        <div className="px-4 sm:px-5 py-3 border-t border-slate-800/80 bg-[#060D17] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-semibold text-slate-300 tracking-tight">
              Daily Khata Pro v{APP_VERSION}
            </span>
            <span className="text-[10.5px] text-slate-500 truncate">
              MD Zafeer Hasan (YAZDAAN) • Rozfiber
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {handleDirectUpdateApp && (
              <button
                type="button"
                onClick={() => {
                  triggerHapticSound('save');
                  onClose();
                  handleDirectUpdateApp();
                }}
                disabled={isUpdatingApp}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-[11px] font-bold text-emerald-400 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title={isHindi ? '1-क्लिक ऐप अपडेट' : '1-Click Direct Update'}
                id="drawer-footer-direct-update-btn"
              >
                <RefreshCw className={`w-3 h-3 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                <span>{isUpdatingApp ? (isHindi ? 'जारी...' : 'Updating') : (isHindi ? 'अपडेट' : 'Update')}</span>
              </button>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 text-[10.5px] font-mono text-slate-300 shadow-xs">
              PWA • Local-First
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
