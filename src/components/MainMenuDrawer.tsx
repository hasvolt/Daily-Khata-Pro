import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
  Users,
  Palette,
  Receipt
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLogo } from './AppLogo';
import { AppTheme, AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';
import { APP_VERSION } from '../utils/version';
import { isGoogleTranslateActive, getActiveGoogleLanguage, ALL_GOOGLE_LANGUAGES } from '../utils/googleTranslate';

const ALL_THEMES: { id: AppTheme; label: string; color: string }[] = [
  { id: 'blue', label: 'Electric Blue', color: '#3B82F6' },
  { id: 'dark', label: 'Emerald Black', color: '#10B981' },
  { id: 'black', label: 'Deep Obsidian', color: '#38BDF8' },
  { id: 'monochrome', label: 'Monochrome', color: '#F8FAFC' },
  { id: 'yellow', label: 'Premium Gold', color: '#F59E0B' },
  { id: 'orange', label: 'Sunset Orange', color: '#F97316' },
  { id: 'emerald', label: 'Emerald Green', color: '#22C55E' },
  { id: 'purple', label: 'Royal Violet', color: '#A855F7' },
  { id: 'cyan', label: 'Ocean Teal', color: '#06B6D4' },
  { id: 'pink', label: 'Crimson Pink', color: '#EC4899' },
  { id: 'white', label: 'Day / White', color: '#FFFFFF' },
  { id: 'light', label: 'Daylight Light', color: '#38BDF8' }
];

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
  onOpenMultiBackup?: () => void;
  onOneClickPdf?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'sky' | 'amber' | 'rose' | 'slate';
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
  onOpenGoogleTranslate,
  privacyMask = false,
  onTogglePrivacyMask,
  onOpenAbout,
  onOpenSplitBill,
  onOpenBudgetManager,
  onOpenLoans,
  onOpenGoogleDrive,
  isDriveConnected = false,
  handleDirectUpdateApp,
  isUpdatingApp = false,
  onOpenRozfiberApps,
  onOpenMultiBackup,
  onOneClickPdf
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isHindi = language === 'hi' || language === 'hinglish';
  const isLightMode =
    theme === 'light' ||
    theme === 'white' ||
    (typeof document !== 'undefined' &&
      (document.documentElement.getAttribute('data-theme') === 'light' ||
        document.documentElement.getAttribute('data-theme') === 'white' ||
        document.documentElement.classList.contains('light')));

  const isGoogleTranslated = isGoogleTranslateActive();
  const activeLangCode = getActiveGoogleLanguage();
  const activeLangObj = activeLangCode ? ALL_GOOGLE_LANGUAGES.find((l) => l.code === activeLangCode) : null;
  const activeLangLabel = activeLangObj ? activeLangObj.nativeName : activeLangCode ? activeLangCode.toUpperCase() : null;

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleAction = (action?: () => void) => {
    triggerHapticSound('click');
    onClose();
    if (action) action();
  };

  const handleNavigate = (tab: NavTab) => {
    triggerHapticSound('click');
    onClose();
    if (onSelectTab) onSelectTab(tab);
  };

  // 4 Executive Sections
  const sections: MenuSection[] = useMemo(() => [
    // 1. Core Accounts & Ledger
    {
      id: 'core-ledger',
      title: isHindi ? 'खाता व दैनिक रिकॉर्ड्स' : 'Ledger & Accounts',
      items: [
        {
          id: 'home',
          label: isHindi ? 'बहीखाता होम' : 'Dashboard Home',
          icon: Home,
          isActive: currentTab === 'home',
          onClick: () => handleNavigate('home')
        },
        {
          id: 'add',
          label: isHindi ? 'नया लेन-देन दर्ज करें' : 'Add Transaction',
          sublabel: isHindi ? 'आय / व्यय प्रविष्टि' : 'Income & Expense',
          icon: PlusCircle,
          isActive: currentTab === 'add',
          onClick: () => handleNavigate('add')
        },
        {
          id: 'history',
          label: isHindi ? 'लेन-देन पासबुक' : 'Passbook & History',
          sublabel: isHindi ? 'सम्पूर्ण प्रविष्टियों की सूची' : 'Complete statement',
          icon: History,
          isActive: currentTab === 'history',
          onClick: () => handleNavigate('history')
        },
        {
          id: 'report',
          label: isHindi ? 'वित्तीय रिपोर्ट्स व विश्लेषण' : 'Reports & Analytics',
          icon: BarChart3,
          isActive: currentTab === 'report',
          onClick: () => handleNavigate('report')
        },
        {
          id: 'loans',
          label: isHindi ? 'ऋण व उधार लेजर' : 'Loans & Udhar Book',
          sublabel: isHindi ? 'उधारी, किश्तें व लेनदारियां' : 'Credit & EMI tracking',
          icon: Landmark,
          isActive: currentTab === 'loans',
          onClick: onOpenLoans ? () => handleAction(onOpenLoans) : () => handleNavigate('loans')
        },
        {
          id: 'attendance',
          label: isHindi ? 'स्टाफ उपस्थिति व मजदूरी' : 'Staff Attendance',
          sublabel: isHindi ? 'दैनिक हाजिरी व अग्रिम (Advance)' : 'Daily roll call & advance',
          icon: CalendarCheck,
          isActive: currentTab === 'attendance',
          onClick: () => handleNavigate('attendance')
        },
        {
          id: 'notes',
          label: isHindi ? 'पर्सनल नोट्स व डायरी' : 'Personal Notes & Tasks',
          sublabel: isHindi ? 'तारीख, समय व चेकलिस्ट' : 'With date, time & checklist',
          icon: FileText,
          isActive: currentTab === 'notes',
          onClick: () => handleNavigate('notes')
        }
      ]
    },

    // 2. Financial Tools & Calculators
    {
      id: 'tools-calculators',
      title: isHindi ? 'वित्तीय टूल्स व कैलकुलेटर' : 'Calculators & Invoicing',
      items: [
        {
          id: 'calculator',
          label: isHindi ? 'वित्तीय कैलकुलेटर सूट' : 'Financial Calculators',
          sublabel: 'SIP, EMI, GST, CAGR, Interest',
          icon: Calculator,
          isActive: currentTab === 'calculator',
          onClick: () => handleNavigate('calculator')
        },
        {
          id: 'invoice',
          label: isHindi ? 'GST इनवॉइस व रसीद जनरेटर' : 'Invoice & Bill Generator',
          icon: Receipt,
          badge: 'FREE',
          badgeColor: 'emerald',
          isActive: currentTab === 'invoice',
          onClick: () => handleNavigate('invoice')
        },
        {
          id: 'budgets',
          label: isHindi ? 'मासिक बजट व खर्च सीमा' : 'Category Budgets',
          icon: Sliders,
          onClick: onOpenBudgetManager ? () => handleAction(onOpenBudgetManager) : undefined
        },
        {
          id: 'goals',
          label: isHindi ? 'वित्तीय लक्ष्य व बचत' : 'Financial Goals',
          icon: Target,
          isActive: currentTab === 'goals',
          onClick: () => handleNavigate('goals')
        },
        {
          id: 'split-bill',
          label: isHindi ? 'बिल विभाजन कैलकुलेटर' : 'Split Bill Tool',
          icon: Split,
          onClick: onOpenSplitBill ? () => handleAction(onOpenSplitBill) : undefined
        }
      ]
    },

    // 3. Backup, PDF & Security
    {
      id: 'backup-security',
      title: isHindi ? 'बैकअप, PDF व सुरक्षा' : 'Backup, Export & Security',
      items: [
        {
          id: 'multi-backup',
          label: isHindi ? 'डाउनलोड, PDF व बैकअप' : 'Export & Selective Backup',
          sublabel: isHindi ? 'माड्यूल व तिथि चयन के साथ' : 'With module & date picker',
          icon: Download,
          badge: 'SELECTIVE',
          badgeColor: 'emerald',
          onClick: onOpenMultiBackup ? () => handleAction(onOpenMultiBackup) : undefined
        },
        {
          id: 'one-click-pdf',
          label: isHindi ? '1-क्लिक सम्पूर्ण PDF रिपोर्ट' : '1-Click Full PDF Report',
          sublabel: isHindi ? 'प्रिंट व शेयर फ्रेंडली' : 'Direct printable statement',
          icon: FileText,
          badge: 'PDF',
          badgeColor: 'sky',
          onClick: onOneClickPdf
            ? () => handleAction(onOneClickPdf)
            : onOpenMultiBackup
            ? () => handleAction(onOpenMultiBackup)
            : undefined
        },
        {
          id: 'cloud-drive',
          label: isHindi ? 'गूगल ड्राइव क्लाउड बैकअप' : 'Google Drive Cloud Sync',
          icon: Cloud,
          badge: isDriveConnected ? 'CONNECTED' : undefined,
          badgeColor: 'emerald',
          onClick: onOpenGoogleDrive ? () => handleAction(onOpenGoogleDrive) : undefined
        },
        {
          id: 'security-lock',
          label: isHindi ? 'ऐप सुरक्षा व पिन लॉक' : 'Security & PIN Lock',
          icon: Lock,
          badge: isLockEnabled ? 'PROTECTED' : undefined,
          badgeColor: isLockEnabled ? 'rose' : undefined,
          onClick:
            isLockEnabled && onLockNow
              ? () => handleAction(onLockNow)
              : onOpenSecurity
              ? () => handleAction(onOpenSecurity)
              : undefined
        },
        {
          id: 'reminders',
          label: isHindi ? 'बिल व भुगतान अलर्ट' : 'Reminders & Alerts',
          icon: Bell,
          badge: remindersCount > 0 ? String(remindersCount) : undefined,
          badgeColor: 'amber',
          onClick: onOpenReminders ? () => handleAction(onOpenReminders) : undefined
        },
        {
          id: 'trash',
          label: isHindi ? 'रीसायकल बिन (Trash)' : 'Recycle Bin',
          icon: Trash2,
          badge: trashCount > 0 ? String(trashCount) : undefined,
          badgeColor: 'rose',
          onClick: onOpenTrash ? () => handleAction(onOpenTrash) : undefined
        }
      ]
    },

    // 4. Settings & Ecosystem
    {
      id: 'settings-eco',
      title: isHindi ? 'सेटिंग्स व सपोर्ट' : 'Settings & Support',
      items: [
        {
          id: 'settings',
          label: isHindi ? 'ऐप सेटिंग्स व फंड्स' : 'App Settings & Funds',
          icon: Settings,
          onClick: onOpenSettings ? () => handleAction(onOpenSettings) : undefined
        },
        {
          id: 'master-categories',
          label: isHindi ? 'मास्टर श्रेणियां व लेजर' : 'Master Categories',
          icon: User,
          onClick: onOpenMasterEdit ? () => handleAction(onOpenMasterEdit) : undefined
        },
        {
          id: 'staff-manager',
          label: 'Staff Manager ↗',
          sublabel: isHindi ? 'सिस्टर ऐप • पूर्ण पेरोल व स्लिप्स' : 'Sister App • Full Payroll & Slips',
          icon: Users,
          isExternal: true,
          href: 'https://staff.rozfiber.com'
        },
        {
          id: 'rozfiber-docs',
          label: isHindi ? 'रोज़फाइबर डॉक्स (Docs ↗)' : 'Rozfiber Docs ↗',
          icon: BookOpen,
          isExternal: true,
          href: 'https://docs.rozfiber.com'
        },
        {
          id: 'manual',
          label: isHindi ? 'उपयोगकर्ता मैन्युअल' : 'User Guide & Manual',
          icon: HelpCircle,
          isActive: currentTab === 'guide',
          onClick: onOpenManual ? () => handleAction(onOpenManual) : () => handleNavigate('guide')
        },
        {
          id: 'support',
          label: isHindi ? 'सहायता केंद्र व सुझाव' : 'Help & Support',
          icon: Mail,
          isActive: currentTab === 'support',
          onClick: onOpenSupport ? () => handleAction(onOpenSupport) : () => handleNavigate('support')
        },
        {
          id: 'privacy-policy',
          label: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy',
          icon: ShieldCheck,
          isActive: currentTab === 'privacy',
          onClick: () => handleNavigate('privacy')
        },
        {
          id: 'about',
          label: isHindi ? 'डेली खाता प्रो के बारे में' : 'About Daily Khata Pro',
          icon: Info,
          isActive: currentTab === 'about',
          onClick: onOpenAbout ? () => handleAction(onOpenAbout) : () => handleNavigate('about')
        }
      ]
    }
  ], [
    isHindi,
    currentTab,
    isDriveConnected,
    isLockEnabled,
    remindersCount,
    trashCount,
    onOpenLoans,
    onOpenBudgetManager,
    onOpenSplitBill,
    onOpenMultiBackup,
    onOneClickPdf,
    onOpenGoogleDrive,
    onLockNow,
    onOpenSecurity,
    onOpenReminders,
    onOpenTrash,
    onOpenSettings,
    onOpenMasterEdit,
    onOpenManual,
    onOpenSupport,
    onOpenAbout
  ]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            (item.sublabel && item.sublabel.toLowerCase().includes(q))
        )
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, searchQuery]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="main-menu-drawer"
        className={`w-[85vw] max-w-[340px] sm:max-w-sm md:max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] ${
          isLightMode
            ? 'bg-white text-slate-900 border-l border-slate-200'
            : 'bg-[var(--theme-surface,#0F172A)] text-[var(--theme-text,#F8FAFC)] border-l border-[var(--theme-border,#1E293B)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          className={`p-4 flex items-center justify-between gap-3 shrink-0 ${
            isLightMode
              ? 'border-b border-slate-200 bg-white'
              : 'border-b border-[var(--theme-border,#1E293B)] bg-[var(--theme-surface,#0F172A)]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <AppLogo size={36} className="shrink-0" />
            <div className="min-w-0 flex flex-col justify-center">
              <h2
                className={`text-[16px] font-bold tracking-tight truncate leading-tight flex items-center gap-1.5 ${
                  isLightMode ? 'text-slate-900' : 'text-white'
                }`}
              >
                <span>Daily Khata</span>
                <span className="text-[var(--theme-primary,#38BDF8)] font-black">Pro</span>
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5 min-w-0 text-[11px] font-medium text-[var(--theme-text-dim,#94A3B8)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">
                  {isHindi ? 'ऑफ़लाइन बहीखाता व वित्तीय सूट' : 'Offline Financial Suite'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 border ${
              isLightMode
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white hover:bg-[var(--theme-card,#1E293B)] border-[var(--theme-border,#334155)]'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5 shrink-0 border-b border-[var(--theme-border,#1E293B)]/40">
          <div className="relative">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isLightMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'मेनू में खोजें (लोन, अटेंडेंस, नोट्स)...' : 'Search menu...'}
              className={`w-full pl-8.5 pr-8 py-1.5 rounded-lg text-[12px] placeholder:text-slate-500 focus:outline-none transition-all ${
                isLightMode
                  ? 'bg-slate-100 border border-slate-200 text-slate-900 focus:border-sky-500'
                  : 'bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] text-white focus:border-sky-400'
              }`}
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

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          
          {/* Quick Theme Switcher Strip */}
          {onThemeChange && !searchQuery && (
            <div className="p-2.5 rounded-xl border border-[var(--theme-border,#1E293B)] bg-[var(--theme-card,#1E293B)]/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isHindi ? 'थीम चयन' : 'Themes'}</span>
                </span>
                <span className="text-[10px] font-mono text-sky-400 uppercase">{theme}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {ALL_THEMES.map((th) => {
                  const isActive = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        onThemeChange(th.id);
                      }}
                      title={th.label}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-semibold transition-all shrink-0 cursor-pointer border ${
                        isActive
                          ? 'border-sky-400 bg-sky-500/20 text-white'
                          : 'border-[var(--theme-border,#334155)] bg-[var(--theme-surface,#0F172A)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: th.color }}
                      />
                      <span>{th.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Version Update Banner if available */}
          {!searchQuery && handleDirectUpdateApp && (
            <button
              type="button"
              disabled={isUpdatingApp}
              onClick={() => {
                triggerHapticSound('save');
                onClose();
                handleDirectUpdateApp();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-white flex items-center gap-1.5">
                    <span>{isHindi ? 'वर्शन अपडेट' : 'App Update'}</span>
                    <span className="text-[9.5px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      v{APP_VERSION}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                    {isUpdatingApp
                      ? isHindi ? 'अपडेट हो रहा है...' : 'Updating...'
                      : isHindi ? 'नवीनतम संस्करण लोड करें' : 'Click to refresh cache'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
            </button>
          )}

          {/* 4 Clean Sections */}
          {filteredSections.map((section, idx) => (
            <div key={section.id} className="space-y-1">
              <div className="px-2 pt-1 pb-0.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                  {section.title}
                </span>
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isRowActive = item.isActive;

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
                        className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isLightMode
                            ? 'hover:bg-slate-100 text-slate-800'
                            : 'hover:bg-[var(--theme-card,#1E293B)] text-[var(--theme-text,#F8FAFC)]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ItemIcon className="w-4 h-4 text-sky-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium truncate">{item.label}</div>
                            {item.sublabel && (
                              <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                                {item.sublabel}
                              </div>
                            )}
                          </div>
                        </div>

                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 font-mono shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isRowActive
                          ? 'bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold'
                          : isLightMode
                          ? 'hover:bg-slate-100 text-slate-800'
                          : 'hover:bg-[var(--theme-card,#1E293B)] text-[var(--theme-text,#F8FAFC)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ItemIcon
                          className={`w-4 h-4 shrink-0 ${
                            isRowActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-white'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium truncate">{item.label}</div>
                          {item.sublabel && (
                            <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0 ${
                            item.badgeColor === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : item.badgeColor === 'sky'
                              ? 'bg-sky-500/20 text-sky-300'
                              : item.badgeColor === 'rose'
                              ? 'bg-rose-500/20 text-rose-300'
                              : item.badgeColor === 'amber'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-700/40 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {idx < filteredSections.length - 1 && (
                <div className="pt-2">
                  <div className="h-px bg-[var(--theme-border,#1E293B)]/60" />
                </div>
              )}
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="py-12 text-center text-xs text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi ? 'कोई परिणाम नहीं मिला' : 'No menu items match your search'}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div
          className={`px-4 py-3 border-t shrink-0 space-y-2.5 ${
            isLightMode
              ? 'border-slate-200 bg-white'
              : 'border-[var(--theme-border,#1E293B)] bg-[var(--theme-surface,#0F172A)]'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onClose();
                if (onOpenInstall) onOpenInstall();
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-[var(--theme-border,#334155)] bg-[var(--theme-card,#1E293B)] hover:bg-[var(--theme-card-hover,#334155)] text-[11.5px] font-semibold text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{isHindi ? 'ऐप इंस्टॉल' : 'Install PWA'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onClose();
                if (onOpenShare) onOpenShare();
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-[var(--theme-border,#334155)] bg-[var(--theme-card,#1E293B)] hover:bg-[var(--theme-card-hover,#334155)] text-[11.5px] font-semibold text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{isHindi ? 'ऐप शेयर' : 'Share App'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)] pt-1">
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>{isHindi ? '100% ऑफ़लाइन सुरक्षित' : '100% Offline Safe'}</span>
            </div>
            <div>
              <span>Daily Khata Pro </span>
              <span className="font-mono text-[10px]">v{APP_VERSION}</span>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
