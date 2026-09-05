import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  Settings,
  ShieldCheck,
  Search,
  X,
  Palette,
  Check,
  Languages,
  Eye,
  EyeOff,
  Calculator,
  Code2,
  Download,
  FolderGit2,
  Share2,
  User,
  MoreVertical,
  Menu,
  ExternalLink,
  ChevronDown,
  Sun,
  Moon,
  Lock,
  KeyRound,
  FileText,
  Smartphone,
  Monitor,
  LayoutGrid,
  Home,
  PlusCircle,
  Target,
  Briefcase,
  BarChart3,
  History,
  LifeBuoy,
  Bug,
  Lightbulb,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Award,
  FileCheck2,
  BadgeCheck,
  SlidersHorizontal,
  Trash2,
  CalendarCheck,
  Bell,
  BellRing
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { HasVoltLogo } from './HasVoltLogo';
import { AppTheme, AppLanguage, AppViewMode, AppLayout } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getAppTranslation } from '../utils/appTranslations';
import { APP_VERSION_TAG } from '../utils/version';

interface HeaderProps {
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenManual: () => void;
  onOpenSupport?: (tab?: 'help' | 'bug' | 'suggestion') => void;
  onOpenNotes?: () => void;
  onOpenSimulator?: () => void;
  onOpenMasterEdit?: () => void;
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
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  privacyMask?: boolean;
  onTogglePrivacyMask?: () => void;
  viewMode?: AppViewMode;
  onViewModeChange?: (mode: AppViewMode) => void;
  appLayout?: AppLayout;
  onLayoutChange?: (layout: AppLayout) => void;
  onOpenPageSearch?: () => void;
  onOpenDeveloper?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  onSelectTab,
  onOpenSettings,
  onOpenManual,
  onOpenSupport,
  onOpenNotes,
  onOpenSimulator,
  onOpenMasterEdit,
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
  searchQuery = '',
  onSearchChange,
  theme = 'blue',
  onThemeChange,
  language = 'en',
  onLanguageChange,
  privacyMask = false,
  onTogglePrivacyMask,
  viewMode = 'auto',
  onViewModeChange,
  appLayout = 'dashboard',
  onLayoutChange,
  onOpenPageSearch,
  onOpenDeveloper
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  const handleForceUpdateApp = async () => {
    setIsUpdatingApp(true);
    setTimeout(async () => {
      try {
        if (typeof (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__?: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__ === 'function') {
          await (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__();
        } else {
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }, 450);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const tr = getAppTranslation((language as AppLanguage) || 'en');
  const isHindi = language === 'hi';

  const isLightMode = theme === 'light' || theme === 'white';

  // Prevent background page scrolling when mobile menu is open
  useEffect(() => {
    if (isMoreMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.touchAction = originalTouchAction || '';
      };
    }
  }, [isMoreMenuOpen]);

  // Global event listener to trigger Main Menu from anywhere (e.g., Footer)
  useEffect(() => {
    const handleOpenMainMenu = () => {
      setIsMoreMenuOpen(true);
    };
    window.addEventListener('open-main-menu', handleOpenMainMenu);
    return () => {
      window.removeEventListener('open-main-menu', handleOpenMainMenu);
    };
  }, []);

  const themeOptions: {
    id: AppTheme;
    label: string;
    dotColor: string;
    bgClass: string;
    textClass: string;
  }[] = [
    { id: 'blue', label: 'Electric Blue (Theme)', dotColor: '#38BDF8', bgClass: 'bg-[#38BDF8]', textClass: 'text-[#38BDF8]' },
    { id: 'yellow', label: 'Volt Gold (Dark)', dotColor: '#FFC700', bgClass: 'bg-[#FFC700]', textClass: 'text-[#FFC700]' },
    { id: 'orange', label: 'Sunset Orange (Dark)', dotColor: '#F97316', bgClass: 'bg-[#F97316]', textClass: 'text-[#FB923C]' },
    { id: 'emerald', label: 'Emerald Green (Dark)', dotColor: '#10B981', bgClass: 'bg-[#10B981]', textClass: 'text-[#10B981]' },
    { id: 'purple', label: 'Royal Violet (Dark)', dotColor: '#A855F7', bgClass: 'bg-[#A855F7]', textClass: 'text-[#A855F7]' },
    { id: 'cyan', label: 'Ocean Teal (Dark)', dotColor: '#06B6D4', bgClass: 'bg-[#06B6D4]', textClass: 'text-[#06B6D4]' },
    { id: 'light', label: isHindi ? 'दिन/लाइट मोड (Daylight)' : 'Daylight White (Day Mode)', dotColor: '#0284C7', bgClass: 'bg-[#0284C7]', textClass: 'text-[#0284C7]' },
    { id: 'white', label: isHindi ? 'आउटडोर प्योर व्हाइट' : 'Outdoor Pure White', dotColor: '#2563EB', bgClass: 'bg-[#2563EB]', textClass: 'text-[#2563EB]' }
  ];

  const languageOptions: { id: AppLanguage; label: string; short: string; native: string }[] = [
    { id: 'en', label: 'English', short: 'EN', native: 'English' },
    { id: 'hi', label: 'हिन्दी', short: 'HI', native: 'हिंदी' },
    { id: 'hinglish', label: 'Hinglish', short: 'HIN', native: 'Hinglish' },
    { id: 'es', label: 'Español', short: 'ES', native: 'Español' },
    { id: 'ar', label: 'العربية', short: 'AR', native: 'العربية' },
    { id: 'fr', label: 'Français', short: 'FR', native: 'Français' },
    { id: 'de', label: 'Deutsch', short: 'DE', native: 'Deutsch' },
    { id: 'ru', label: 'Русский', short: 'RU', native: 'Русский' },
    { id: 'pt', label: 'Português', short: 'PT', native: 'Português' },
    { id: 'bn', label: 'বাংলা', short: 'BN', native: 'বাংলা' },
    { id: 'ur', label: 'اردو', short: 'UR', native: 'اردو' },
    { id: 'id', label: 'Indonesian', short: 'ID', native: 'Bahasa Indonesia' },
    { id: 'ja', label: '日本語', short: 'JA', native: '日本語' },
    { id: 'zh', label: '中文', short: 'ZH', native: '中文 (简体)' }
  ];

  const closeAllMenus = () => {
    setIsThemeMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsLayoutMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  return (
    <header className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md sticky top-0 z-30 shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Icon & Name (Slightly increased logo & theme-matched branding) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <div
            onClick={() => onSelectTab && onSelectTab('home')}
            className="cursor-pointer active:scale-95 transition-transform shrink-0"
            title="Daily Khata Pro"
          >
            <div className="sm:hidden">
              <HasVoltLogo size={34} />
            </div>
            <div className="hidden sm:block">
              <HasVoltLogo size={42} />
            </div>
          </div>

          <div className="flex flex-col text-left min-w-0 justify-center">
            <div
              onClick={() => onSelectTab && onSelectTab('home')}
              className="flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none group"
            >
              <span className="font-bold text-[16px] sm:text-[19px] tracking-tight text-[var(--theme-text,#F8FAFC)] group-hover:opacity-95 transition-opacity truncate">
                Daily Khata
              </span>
              <span
                className="font-black text-[15px] sm:text-[18px] tracking-tight transition-colors drop-shadow-xs text-[var(--theme-primary,#38BDF8)]"
              >
                Pro
              </span>
            </div>
            <div className="mt-0.5 min-w-0">
              <span
                className="text-[8.5px] sm:text-[11.5px] font-semibold tracking-wide truncate transition-colors text-[var(--theme-text-muted,#8BA4D0)] block"
              >
                {isHindi ? 'दैनिक आय-व्यय ट्रैकर' : 'Daily Income & Expense Tracker'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links for SaaS Desktop Experience */}
        {onSelectTab && (
          <nav className="hidden lg:flex items-center gap-1 mx-1.5">
            {[
              { id: 'home' as NavTab, label: tr.menu.khata, icon: Home },
              { id: 'history' as NavTab, label: tr.menu.record, icon: History },
              { id: 'attendance' as NavTab, label: isHindi ? 'उपस्थिति' : 'Attendance', icon: CalendarCheck },
              { id: 'goals' as NavTab, label: tr.menu.goals, icon: Target },
              { id: 'tracker' as NavTab, label: tr.menu.workAndLife, icon: Briefcase },
              { id: 'notes' as NavTab, label: tr.menu.notes, icon: FileText },
              { id: 'report' as NavTab, label: tr.menu.analytics, icon: BarChart3 },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] shadow-xs'
                      : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-card,#132438)]'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Desktop Mode Search Bar / Page Search Command Bar */}
        {onOpenPageSearch ? (
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-3">
            <button
              type="button"
              onClick={onOpenPageSearch}
              className="w-full flex items-center justify-between gap-2 bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-card,#132438)] focus:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-dim,#64748B)] hover:text-[var(--theme-text,#F8FAFC)] text-[12px] rounded-xl pl-3 pr-2.5 py-1.5 transition-all outline-none shadow-xs cursor-pointer group"
              title={language === 'hi' ? 'पेज व टूल खोजें (Ctrl+K)' : 'Search pages & tools (Ctrl+K)'}
              id="header-desktop-page-search"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                <span className="truncate">
                  {language === 'hi' ? 'पेज या टूल खोजें...' : 'Search pages & tools...'}
                </span>
              </div>
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] group-hover:border-[var(--theme-primary,#38BDF8)]/50">
                ⌘K
              </kbd>
            </button>
          </div>
        ) : onSearchChange ? (
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] pointer-events-none" />
              <input
                id="header-desktop-search"
                type="text"
                placeholder={tr.menu.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (onSelectTab && currentTab !== 'history' && e.target.value.trim().length > 0) {
                    onSelectTab('history');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (onSelectTab && currentTab !== 'history') {
                      onSelectTab('history');
                    }
                  }
                }}
                className="w-full bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-card,#132438)] focus:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#64748B)] text-[12px] rounded-xl pl-8 pr-7 py-1.5 transition-all outline-none shadow-xs"
                style={{
                  borderColor: searchQuery ? 'var(--theme-primary, #38BDF8)' : undefined
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* Right Action Buttons (Compact, Refined & Touch-Friendly) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Header Search Icon for Page Search (Mobile, Tablet & Desktop) */}
          {onOpenPageSearch ? (
            <button
              type="button"
              onClick={onOpenPageSearch}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] hover:text-[var(--theme-text,#F8FAFC)] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0"
              title={language === 'hi' ? 'पेज खोजें (Page Search / Ctrl+K)' : 'Page Search (Ctrl+K)'}
              id="header-page-search-btn"
              aria-label="Search pages and tools"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span className="hidden sm:inline text-[11px] font-bold">
                {language === 'hi' ? 'खोजें' : 'Search'}
              </span>
            </button>
          ) : onSelectTab ? (
            <button
              type="button"
              onClick={() => onSelectTab('history')}
              className="lg:hidden p-1.5 sm:px-2 sm:py-1.5 rounded-lg sm:rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={tr.menu.searchPlaceholder || "Search"}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : null}

          {/* Privacy Eye Toggle */}
          {onTogglePrivacyMask && (
            <button
              type="button"
              onClick={onTogglePrivacyMask}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                privacyMask
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
              title={privacyMask ? 'Amounts Hidden (Click to show)' : 'Mask Rupee Amounts'}
              id="header-privacy-mask-btn"
            >
              {privacyMask ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              <span className="hidden xl:inline">
                {privacyMask ? tr.menu.hidden : tr.menu.mask}
              </span>
            </button>
          )}

          {/* Quick Day/Night Toggle */}
          {onThemeChange && (
            <button
              type="button"
              onClick={() => {
                if (isLightMode) {
                  onThemeChange('blue');
                } else {
                  onThemeChange('light');
                }
              }}
              className={`flex p-1.5 sm:px-2 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[10px] sm:text-[11px] font-bold items-center gap-1 shrink-0 ${
                isLightMode
                  ? 'bg-[#0284C7]/15 border-[#0284C7]/40 text-[#0284C7] hover:bg-[#0284C7]/25'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
              title={isLightMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
              id="header-theme-toggle-btn"
            >
              {isLightMode ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isLightMode ? tr.menu.night : tr.menu.day}
              </span>
            </button>
          )}

          {/* Header Quick Calculator Button */}
          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 text-[10px] sm:text-[11px] font-bold items-center gap-1.5 shrink-0"
              title={tr.calc.title}
              id="header-calculator-btn"
            >
              <Calculator className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline font-semibold">
                {tr.menu.calculator}
              </span>
            </button>
          )}

          {/* Main Three-Dot / Hamburger Menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMoreMenuOpen((prev) => !prev);
                setIsThemeMenuOpen(false);
                setIsLangMenuOpen(false);
              }}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center shrink-0 ${
                isMoreMenuOpen
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] ring-2 ring-[#38BDF8]/40'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#38BDF8] hover:text-[#38BDF8] hover:border-[#38BDF8]/60'
              }`}
              title={tr.menu.menuAndTools}
              aria-label={tr.menu.mainMenu}
              id="header-main-menu-btn"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-[#38BDF8]" />
            </button>

            {/* UNIFIED MAIN MENU FOR MOBILE DRAWER & DESKTOP DROPDOWN */}
            {isMoreMenuOpen && (
              <>
                {/* --- MOBILE MODE: SLIDE-OVER DRAWER (via React Portal) --- */}
                {typeof document !== 'undefined' &&
                  createPortal(
                    <div className="sm:hidden fixed inset-0 z-[9999] isolate">
                      {/* Backdrop Blur Overlay with Click-outside & Scroll-Lock */}
                      <div
                        className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMoreMenuOpen(false);
                        }}
                        aria-hidden="true"
                      />

                      {/* Mobile Slide-Over Drawer */}
                      <div
                        className="fixed inset-y-0 right-0 w-[88vw] max-w-[340px] z-[9999] bg-[var(--theme-surface,#0E1A29)] border-l border-[var(--theme-border,#213E61)] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200 text-left"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label={isHindi ? 'मुख्य मेनू' : 'Main Menu'}
                      >
                        {/* Drawer Header */}
                        <div className="p-3.5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-2.5">
                            <HasVoltLogo size={28} />
                            <div>
                              <div className="font-bold text-[14.5px] text-[var(--theme-text,#F8FAFC)] flex items-center gap-1">
                                <span>Daily Khata</span>
                                <span className="font-black text-[#38BDF8]">Pro</span>
                              </div>
                              <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] font-medium">
                                {tr.menu.menuAndTools}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMoreMenuOpen(false);
                            }}
                            className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] border border-[var(--theme-border,#213E61)] active:scale-90 transition-transform cursor-pointer"
                            aria-label="Close Menu"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Drawer Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-left overscroll-contain">
                          {/* Category: Primary Features */}
                          <div className="space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                              {tr.menu.featuresAndTools}
                            </div>

                            {/* Page Search / Navigator */}
                            {onOpenPageSearch && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenPageSearch();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 hover:bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/30 transition-colors cursor-pointer text-left"
                                id="header-drawer-page-search-btn"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Search className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                  <span>{language === 'hi' ? 'पेज खोजें (Page Search)' : 'Page Search / Quick Navigator'}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-surface,#0E1A29)] px-1.5 py-0.5 rounded border border-[var(--theme-primary,#38BDF8)]/40">
                                  Ctrl+K
                                </span>
                              </button>
                            )}

                            {/* Settings */}
                            {onOpenSettings && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSettings();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Settings className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                  <span>{tr.menu.appSettings}</span>
                                </div>
                              </button>
                            )}

                            {/* Calculator */}
                            {onOpenSimulator && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSimulator();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#F59E0B] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Calculator className="w-4 h-4 text-[#F59E0B] shrink-0" />
                                  <span>{tr.menu.calculator}</span>
                                </div>
                              </button>
                            )}

                            {/* Master Edit Option */}
                            {onOpenMasterEdit && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenMasterEdit();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                                id="header-drawer-master-edit-btn"
                              >
                                <div className="flex items-center gap-2.5">
                                  <SlidersHorizontal className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                  <span>{isHindi ? 'मास्टर एडिट व कस्टमाइज़' : 'Master Edit Hub'}</span>
                                </div>
                                <span className="text-[9px] font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] px-1.5 py-0.5 rounded">
                                  All-in-One
                                </span>
                              </button>
                            )}

                            {/* Trash / Recycle Bin */}
                            {onOpenTrash && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenTrash();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#EF4444] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                                id="header-drawer-trash-btn"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0" />
                                  <span>{isHindi ? 'रीसायकल बिन (ट्रैश)' : 'Recycle Bin / Trash'}</span>
                                </div>
                                {trashCount > 0 && (
                                  <span className="text-[9px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {trashCount}
                                  </span>
                                )}
                              </button>
                            )}

                            {/* Attendance & Work Register */}
                            {onSelectTab && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectTab('attendance');
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                                id="header-drawer-attendance-btn"
                              >
                                <div className="flex items-center gap-2.5">
                                  <CalendarCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                                  <span>{isHindi ? 'उपस्थिति व कार्य रजिस्टर' : 'Attendance & Work'}</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-1.5 py-0.5 rounded">
                                  Duty
                                </span>
                              </button>
                            )}

                            {/* Alerts & Reminders */}
                            {onOpenReminders && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenReminders();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                                id="header-drawer-alerts-btn"
                              >
                                <div className="flex items-center gap-2.5">
                                  <BellRing className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                  <span>{isHindi ? 'चेतावनी एवं रिमाइंडर' : 'Alerts & Reminders'}</span>
                                </div>
                                {remindersCount > 0 && (
                                  <span className="text-[9px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {remindersCount}
                                  </span>
                                )}
                              </button>
                            )}

                            {/* Personal Notes */}
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenNotes) onOpenNotes();
                                else if (onSelectTab) onSelectTab('notes');
                                closeAllMenus();
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2.5">
                                <FileText className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                <span>{tr.menu.personalNotes}</span>
                              </div>
                            </button>

                            {/* Security PIN Lock */}
                            {onOpenSecurity && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSecurity();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Lock className="w-4 h-4 text-[#38BDF8] shrink-0" />
                                  <span>{tr.menu.securityPinLock}</span>
                                </div>
                                {isLockEnabled && (
                                  <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full">
                                    {tr.menu.active}
                                  </span>
                                )}
                              </button>
                            )}

                            {/* Lock App Now Button */}
                            {isLockEnabled && onLockNow && (
                              <button
                                type="button"
                                onClick={() => {
                                  onLockNow();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#EF4444] bg-[var(--theme-card,#132438)]/60 hover:bg-[#EF4444]/15 border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <Lock className="w-4 h-4 text-[#EF4444] shrink-0" />
                                <span>{tr.menu.lock || 'Lock App'}</span>
                              </button>
                            )}

                            {/* User Manual Guide */}
                            <button
                              type="button"
                              onClick={() => {
                                onOpenManual();
                                closeAllMenus();
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                            >
                              <BookOpen className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                              <span>{tr.menu.userManualGuide}</span>
                            </button>

                            {/* App Version Update */}
                            <button
                              type="button"
                              onClick={handleForceUpdateApp}
                              disabled={isUpdatingApp}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left disabled:opacity-60"
                              title={isHindi ? 'नया वर्शन चेक व रीफ्रेश करें' : 'Check for Latest App Version & Refresh Cache'}
                              id="header-app-version-update-mobile-btn"
                            >
                              <div className="flex items-center gap-2.5">
                                <RotateCcw className={`w-4 h-4 text-[#38BDF8] shrink-0 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                                <span>
                                  {isUpdatingApp
                                    ? (isHindi ? 'अपडेट हो रहा है...' : 'Updating...')
                                    : (isHindi ? 'ऐप वर्शन व अपडेट' : 'App Version & Update')}
                                </span>
                              </div>
                              <span className="text-[9.5px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">
                                {APP_VERSION_TAG}
                              </span>
                            </button>
                          </div>

                          {/* Category: Theme & Language */}
                          <div className="space-y-1 mt-2">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                              {tr.menu.themeColor} & {tr.menu.language}
                            </div>

                            {/* Theme Selection Accordion */}
                            {onThemeChange && (
                              <div className="rounded-xl border border-[var(--theme-border,#213E61)]/40 overflow-hidden bg-[var(--theme-card,#132438)]/60">
                                <button
                                  type="button"
                                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                                  className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#FFC700] transition-colors cursor-pointer text-left"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Palette className="w-4 h-4 text-[#FFC700] shrink-0" />
                                    <span>{tr.menu.themeColor}</span>
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-[var(--theme-text-muted,#94A3B8)] transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isThemeMenuOpen && (
                                  <div className="p-2.5 border-t border-[var(--theme-border,#213E61)]/40 bg-[var(--theme-surface,#0E1A29)]/50">
                                    <div className="grid grid-cols-4 gap-1.5">
                                      {themeOptions.map((opt) => (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          onClick={() => {
                                            onThemeChange(opt.id);
                                            setIsThemeMenuOpen(false);
                                          }}
                                          className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                            theme === opt.id
                                              ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text,#F8FAFC)]'
                                              : 'border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                                          }`}
                                        >
                                          <span className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0" style={{ backgroundColor: opt.dotColor }} />
                                          <span className="truncate max-w-full">{opt.id}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Language Selection Accordion */}
                            {onLanguageChange && (
                              <div className="rounded-xl border border-[var(--theme-border,#213E61)]/40 overflow-hidden bg-[var(--theme-card,#132438)]/60">
                                <button
                                  type="button"
                                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                  className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#38BDF8] transition-colors cursor-pointer text-left"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Languages className="w-4 h-4 text-[#38BDF8] shrink-0" />
                                    <span>{tr.menu.language}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] px-1.5 py-0.5 rounded-full font-bold">
                                      {languageOptions.find((l) => l.id === language)?.native || language}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[var(--theme-text-muted,#94A3B8)] transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                                  </div>
                                </button>
                                
                                {isLangMenuOpen && (
                                  <div className="p-2 border-t border-[var(--theme-border,#213E61)]/40 bg-[var(--theme-surface,#0E1A29)]/50">
                                    <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                                      {languageOptions.map((opt) => (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          onClick={() => {
                                            onLanguageChange(opt.id);
                                            setIsLangMenuOpen(false);
                                          }}
                                          title={opt.label}
                                          className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center truncate ${
                                            language === opt.id
                                              ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold shadow-xs'
                                              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/40'
                                          }`}
                                        >
                                          {opt.native}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Category: Support & Safety */}
                          <div className="space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                              {tr.menu.supportAndSafety}
                            </div>

                            {/* Help Centre */}
                            {onOpenSupport && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSupport('help');
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <LifeBuoy className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                  <span>{tr.menu.helpCenterFaq}</span>
                                </div>
                              </button>
                            )}

                            {/* Bug Report */}
                            {onOpenSupport && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSupport('bug');
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#EF4444] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Bug className="w-4 h-4 text-[#EF4444] shrink-0" />
                                  <span>{tr.menu.reportIssue}</span>
                                </div>
                              </button>
                            )}

                            {/* Suggestion / Idea */}
                            {onOpenSupport && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSupport('suggestion');
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#F59E0B] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0" />
                                  <span>{tr.menu.feedbackSuggestions}</span>
                                </div>
                              </button>
                            )}

                            {/* Safety & Source Code */}
                            {onOpenSourceCode && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSourceCode();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <Code2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                                <span>{tr.menu.safetySourceCode}</span>
                              </button>
                            )}

                            {/* Share App */}
                            {onOpenShare && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenShare();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <Share2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                                <span>{tr.menu.shareApp}</span>
                              </button>
                            )}

                            {/* Install App */}
                            {onOpenInstall && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenInstall();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#38BDF8] bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 border border-[#38BDF8]/30 transition-colors cursor-pointer text-left"
                              >
                                <Download className="w-4 h-4 shrink-0" />
                                <span>{tr.menu.installApp}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Drawer Footer with Verified Legal Credentials */}
                        <div className="p-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex flex-col gap-2 shrink-0">
                          <div className="flex items-center justify-between gap-2">
                            <a
                              href="https://github.com/hasvolt/Daily-Khata-Pro"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)] text-[10.5px] font-semibold transition-colors shrink-0"
                              title="GitHub Profile"
                            >
                              <FolderGit2 className="w-3.5 h-3.5" />
                              <span>GitHub</span>
                            </a>
                          </div>

                          {/* Legal Certificate & Registration Stamp */}
                          <div
                            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/80 flex items-center justify-between gap-1.5 transition-colors"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Award className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                              <span className="text-[10px] font-mono text-[#CBD5E1] truncate">
                                Powered by: <strong className="text-[#38BDF8]">HASVOLT</strong>
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-1.5 py-0.5 rounded border border-[#38BDF8]/25 shrink-0">
                              MIT License
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}

                {/* --- DESKTOP MODE: FLOATING BOUNDED DROPDOWN (matching mobile categories and contrast) --- */}
                <div
                  className="fixed inset-0 z-40 hidden sm:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMoreMenuOpen(false);
                  }}
                  aria-hidden="true"
                />
                <div
                  className="hidden sm:block absolute top-full right-0 mt-2 w-80 max-w-[340px] bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150 max-h-[82vh] overflow-y-auto text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Category: Primary Features */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                      {tr.menu.featuresAndTools}
                    </div>

                    {/* Page Search / Command Palette */}
                    {onOpenPageSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenPageSearch();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 hover:bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/30 transition-colors cursor-pointer text-left"
                        id="header-desktop-drawer-page-search-btn"
                      >
                        <div className="flex items-center gap-2.5">
                          <Search className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          <span>{language === 'hi' ? 'पेज खोजें (Page Search)' : 'Page Search / Quick Navigator'}</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-surface,#0E1A29)] px-1.5 py-0.5 rounded border border-[var(--theme-primary,#38BDF8)]/40">
                          Ctrl+K
                        </span>
                      </button>
                    )}

                    {/* Settings */}
                    {onOpenSettings && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSettings();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          <span>{tr.menu.appSettings}</span>
                        </div>
                      </button>
                    )}

                    {/* Calculator */}
                    {onOpenSimulator && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSimulator();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#F59E0B] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calculator className="w-4 h-4 text-[#F59E0B] shrink-0" />
                          <span>{tr.menu.calculator}</span>
                        </div>
                      </button>
                    )}

                    {/* Attendance & Work Register */}
                    {onSelectTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('attendance');
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                        id="header-desktop-attendance-btn"
                      >
                        <div className="flex items-center gap-2.5">
                          <CalendarCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                          <span>{isHindi ? 'उपस्थिति व कार्य रजिस्टर' : 'Attendance & Work'}</span>
                        </div>
                        <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-1.5 py-0.5 rounded">
                          Duty
                        </span>
                      </button>
                    )}

                    {/* Alerts & Reminders */}
                    {onOpenReminders && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenReminders();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                        id="header-desktop-alerts-btn"
                      >
                        <div className="flex items-center gap-2.5">
                          <BellRing className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          <span>{isHindi ? 'चेतावनी एवं रिमाइंडर' : 'Alerts & Reminders'}</span>
                        </div>
                        {remindersCount > 0 && (
                          <span className="text-[9px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {remindersCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Master Edit Option */}
                    {onOpenMasterEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenMasterEdit();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                        id="header-desktop-master-edit-btn"
                      >
                        <div className="flex items-center gap-2.5">
                          <SlidersHorizontal className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          <span>{isHindi ? 'मास्टर एडिट व कस्टमाइज़' : 'Master Edit Hub'}</span>
                        </div>
                        <span className="text-[9px] font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] px-1.5 py-0.5 rounded">
                          All-in-One
                        </span>
                      </button>
                    )}

                    {/* Trash / Recycle Bin */}
                    {onOpenTrash && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenTrash();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#EF4444] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                        id="header-desktop-trash-btn"
                      >
                        <div className="flex items-center gap-2.5">
                          <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0" />
                          <span>{isHindi ? 'रीसायकल बिन (ट्रैश)' : 'Recycle Bin / Trash'}</span>
                        </div>
                        {trashCount > 0 && (
                          <span className="text-[9px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {trashCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Personal Notes */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenNotes) onOpenNotes();
                        else if (onSelectTab) onSelectTab('notes');
                        closeAllMenus();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        <span>{tr.menu.personalNotes}</span>
                      </div>
                    </button>

                    {/* Security PIN Lock */}
                    {onOpenSecurity && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSecurity();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-4 h-4 text-[#38BDF8] shrink-0" />
                          <span>{tr.menu.securityPinLock}</span>
                        </div>
                        {isLockEnabled && (
                          <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full">
                            {tr.menu.active}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Lock App Now Button */}
                    {isLockEnabled && onLockNow && (
                      <button
                        type="button"
                        onClick={() => {
                          onLockNow();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#EF4444] bg-[var(--theme-card,#132438)]/60 hover:bg-[#EF4444]/15 border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <Lock className="w-4 h-4 text-[#EF4444] shrink-0" />
                        <span>{tr.menu.lock || 'Lock App'}</span>
                      </button>
                    )}

                    {/* User Manual Guide */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenManual();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                    >
                      <BookOpen className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <span>{tr.menu.userManualGuide}</span>
                    </button>

                    {/* App Version Update */}
                    <button
                      type="button"
                      onClick={handleForceUpdateApp}
                      disabled={isUpdatingApp}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left disabled:opacity-60"
                      title={isHindi ? 'नया वर्शन चेक व रीफ्रेश करें' : 'Check for Latest App Version & Refresh Cache'}
                      id="header-app-version-update-desktop-btn"
                    >
                      <div className="flex items-center gap-2.5">
                        <RotateCcw className={`w-4 h-4 text-[#38BDF8] shrink-0 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                        <span>
                          {isUpdatingApp
                            ? (isHindi ? 'अपडेट हो रहा है...' : 'Updating...')
                            : (isHindi ? 'ऐप वर्शन व अपडेट' : 'App Version & Update')}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">
                        {APP_VERSION_TAG}
                      </span>
                    </button>
                  </div>

                  {/* Category: Theme & Language */}
                  <div className="space-y-1 mt-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                      {tr.menu.themeColor} & {tr.menu.language}
                    </div>

                    {/* Theme Selection Accordion */}
                    {onThemeChange && (
                      <div className="rounded-xl border border-[var(--theme-border,#213E61)]/40 overflow-hidden bg-[var(--theme-card,#132438)]/60">
                        <button
                          type="button"
                          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#FFC700] transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <Palette className="w-4 h-4 text-[#FFC700] shrink-0" />
                            <span>{tr.menu.themeColor}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-[var(--theme-text-muted,#94A3B8)] transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isThemeMenuOpen && (
                          <div className="p-2.5 border-t border-[var(--theme-border,#213E61)]/40 bg-[var(--theme-surface,#0E1A29)]/50">
                            <div className="grid grid-cols-4 gap-1.5">
                              {themeOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    onThemeChange(opt.id);
                                    setIsThemeMenuOpen(false);
                                  }}
                                  className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                    theme === opt.id
                                      ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text,#F8FAFC)]'
                                      : 'border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                                  }`}
                                >
                                  <span className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0" style={{ backgroundColor: opt.dotColor }} />
                                  <span className="truncate max-w-full">{opt.id}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Language Selection Accordion */}
                    {onLanguageChange && (
                      <div className="rounded-xl border border-[var(--theme-border,#213E61)]/40 overflow-hidden bg-[var(--theme-card,#132438)]/60">
                        <button
                          type="button"
                          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#38BDF8] transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <Languages className="w-4 h-4 text-[#38BDF8] shrink-0" />
                            <span>{tr.menu.language}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] px-1.5 py-0.5 rounded-full font-bold">
                              {languageOptions.find((l) => l.id === language)?.native || language}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[var(--theme-text-muted,#94A3B8)] transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        
                        {isLangMenuOpen && (
                          <div className="p-2 border-t border-[var(--theme-border,#213E61)]/40 bg-[var(--theme-surface,#0E1A29)]/50">
                            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                              {languageOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    onLanguageChange(opt.id);
                                    setIsLangMenuOpen(false);
                                  }}
                                  title={opt.label}
                                  className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center truncate ${
                                    language === opt.id
                                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold shadow-xs'
                                      : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/40'
                                  }`}
                                >
                                  {opt.native}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Category: Support & Safety */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                      {tr.menu.supportAndSafety}
                    </div>

                    {/* Help Centre */}
                    {onOpenSupport && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSupport('help');
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <LifeBuoy className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          <span>{tr.menu.helpCenterFaq}</span>
                        </div>
                      </button>
                    )}

                    {/* Bug Report */}
                    {onOpenSupport && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSupport('bug');
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#EF4444] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bug className="w-4 h-4 text-[#EF4444] shrink-0" />
                          <span>{tr.menu.reportIssue}</span>
                        </div>
                      </button>
                    )}

                    {/* Suggestion / Idea */}
                    {onOpenSupport && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSupport('suggestion');
                          closeAllMenus();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#F59E0B] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0" />
                          <span>{tr.menu.feedbackSuggestions}</span>
                        </div>
                      </button>
                    )}

                    {/* Safety & Source Code */}
                    {onOpenSourceCode && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSourceCode();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <Code2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                        <span>{tr.menu.safetySourceCode}</span>
                      </button>
                    )}

                    {/* Share App */}
                    {onOpenShare && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenShare();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <Share2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        <span>{tr.menu.shareApp}</span>
                      </button>
                    )}

                    {/* Install App */}
                    {onOpenInstall && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenInstall();
                          closeAllMenus();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#38BDF8] bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 border border-[#38BDF8]/30 transition-colors cursor-pointer text-left"
                      >
                        <Download className="w-4 h-4 shrink-0" />
                        <span>{tr.menu.installApp}</span>
                      </button>
                    )}
                  </div>

                  {/* Divider & Developer Footer with Verified Legal Credentials */}
                  <div className="pt-2.5 border-t border-[var(--theme-border,#213E61)]/70 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      

                      <a
                        href="https://github.com/hasvolt/Daily-Khata-Pro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[#38BDF8] border border-[var(--theme-border,#213E61)] text-[10.5px] font-semibold transition-colors shrink-0"
                        title="GitHub Profile"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    </div>

                    {/* Legal Certificate & Registration Stamp */}
                    <div
                      className="p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/80 flex items-center justify-between gap-1.5 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Award className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span className="text-[10px] font-mono text-[#CBD5E1] truncate">
                          Powered by: <strong className="text-[#38BDF8]">HASVOLT</strong>
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-1.5 py-0.5 rounded border border-[#38BDF8]/25 shrink-0">
                        MIT License
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


