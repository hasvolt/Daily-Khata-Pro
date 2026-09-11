import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Settings,
  Search,
  X,
  Eye,
  EyeOff,
  Calculator,
  Sun,
  Moon,
  Home,
  Target,
  Briefcase,
  BarChart3,
  History,
  FileText,
  CalendarCheck,
  MoreVertical,
  Shield,
  Trash2,
  Bell,
  Share2,
  HelpCircle,
  Lock,
  Sparkles,
  ChevronRight,
  Download,
  BookOpen,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  Database,
  RefreshCw,
  Cookie,
  PlusCircle,
  Heart,
  AlertCircle,
  ArrowUpCircle,
  CheckCircle2,
  User,
  Split,
  Sliders,
  Landmark
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLogo } from './AppLogo';
import { AppTheme, AppLanguage, AppViewMode, AppLayout } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getAppTranslation } from '../utils/appTranslations';
import { triggerHapticSound } from '../utils/khataCalculations';
import { APP_VERSION, APP_VERSION_TAG, APP_VERSION_FULL, APP_RELEASE_LABEL } from '../utils/version';

interface HeaderProps {
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenManual?: () => void;
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
  onOpenAbout?: () => void;
  onOpenSplitBill?: () => void;
  onOpenBudgetManager?: () => void;
  onOpenLoans?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  onSelectTab,
  onOpenSettings,
  onOpenMasterEdit,
  onOpenManual,
  onOpenSupport,
  onOpenNotes,
  onOpenSimulator,
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
  privacyMask = false,
  onTogglePrivacyMask,
  onOpenPageSearch,
  onOpenAbout,
  onOpenSplitBill,
  onOpenBudgetManager,
  onOpenLoans
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const tr = getAppTranslation((language as AppLanguage) || 'en');
  const isHindi = language === 'hi';
  const isLightMode = theme === 'light' || theme === 'white';

  const handleDirectUpdateApp = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHapticSound('save');
    setIsUpdatingApp(true);
    setUpdateStatus(
      isHindi
        ? `कैश साफ़ कर v${APP_VERSION} नवीनतम वर्शन लोड किया जा रहा है...`
        : `Clearing cache & loading latest v${APP_VERSION} build...`
    );

    try {
      // 1. Service Worker update check & cache purge
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.update();
            if (reg.active) {
              reg.active.postMessage({ type: 'PURGE_CACHE' });
            }
          }
        } catch (err) {
          console.warn('SW update check error:', err);
        }
      }

      // 2. Cache storage cleanup
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        } catch (err) {
          console.warn('Cache keys delete error:', err);
        }
      }

      // 3. Set update metadata
      localStorage.setItem('daily_khata_last_updated_at', new Date().toISOString());
      localStorage.setItem('daily_khata_app_version', APP_VERSION);

      setUpdateStatus(
        isHindi
          ? `✓ वर्शन v${APP_VERSION} तैयार है! रीलोड हो रहा है...`
          : `✓ v${APP_VERSION} ready! Reloading fresh build...`
      );

      setTimeout(async () => {
        if (typeof (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__?: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__ === 'function') {
          await (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__();
        } else {
          window.location.reload();
        }
      }, 700);
    } catch {
      window.location.reload();
    }
  };

  // Global event listener for opening the main menu
  useEffect(() => {
    const handleOpenMenu = () => {
      setIsMenuOpen(true);
    };
    window.addEventListener('open-main-menu', handleOpenMenu);
    return () => {
      window.removeEventListener('open-main-menu', handleOpenMenu);
    };
  }, []);

  // Keyboard shortcut listener (ESC to close menu)
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleMenuAction = (action: () => void) => {
    triggerHapticSound('click');
    setIsMenuOpen(false);
    action();
  };

  return (
    <header className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md sticky top-0 z-30 shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0">
          <div
            onClick={() => onSelectTab && onSelectTab('home')}
            className="cursor-pointer active:scale-95 transition-transform shrink-0"
            title="Daily Khata Pro"
          >
            <div className="sm:hidden">
              <AppLogo size={34} />
            </div>
            <div className="hidden sm:block">
              <AppLogo size={38} />
            </div>
          </div>

          <div className="flex flex-col text-left min-w-0 justify-center">
            <div
              onClick={() => onSelectTab && onSelectTab('home')}
              className="flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none group"
            >
              <span className="font-bold text-[15px] sm:text-[18px] tracking-tight text-[var(--theme-text,#F8FAFC)] group-hover:opacity-95 transition-opacity truncate">
                Daily Khata
              </span>
              <span className="font-black text-[14px] sm:text-[17px] tracking-tight transition-colors drop-shadow-xs text-[var(--theme-primary,#38BDF8)]">
                Pro
              </span>
            </div>
            <div className="mt-0.5 min-w-0">
              <span className="text-[8.5px] sm:text-[11px] font-semibold tracking-wide truncate transition-colors text-[var(--theme-text-muted,#8BA4D0)] block">
                {isHindi ? 'दैनिक आय-व्यय ट्रैकर' : 'Daily Income & Expense Tracker'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links for SaaS Desktop Experience */}
        {onSelectTab && (
          <nav className="hidden xl:flex items-center gap-1 mx-1">
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

        {/* Advance Search Command Bar (Desktop / Tablets) */}
        {onOpenPageSearch ? (
          <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2">
            <button
              type="button"
              onClick={onOpenPageSearch}
              className="w-full flex items-center justify-between gap-2.5 bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-card,#132438)] focus:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-dim,#64748B)] hover:text-[var(--theme-text,#F8FAFC)] text-[12px] rounded-xl pl-3 pr-2.5 py-1.5 transition-all outline-none shadow-xs cursor-pointer group"
              title={isHindi ? 'एडवांस सर्च व नेविगेटर (Ctrl+K)' : 'Advanced Search & Navigator (Ctrl+K)'}
              id="header-desktop-page-search"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate text-[12px] font-medium text-[var(--theme-text-muted,#94A3B8)] group-hover:text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'पेज, टूल्स, कैलकुलेटर खोजें...' : 'Search pages, tools, calculators...'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] group-hover:border-[var(--theme-primary,#38BDF8)]/50 group-hover:text-[var(--theme-primary,#38BDF8)]">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>
        ) : onSearchChange ? (
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-2">
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
                className="w-full bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-card,#132438)] focus:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#64748B)] text-[12px] rounded-xl pl-8 pr-7 py-1.5 transition-all outline-none shadow-xs"
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

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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

          {/* Quick Reminders Bell Button (Desktop/Tablet only to avoid mobile header overload) */}
          {onOpenReminders && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onOpenReminders();
              }}
              className="relative hidden sm:flex p-1.5 sm:px-2 sm:py-1.5 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] hover:border-amber-400/50 text-[var(--theme-text-muted,#94A3B8)] hover:text-amber-400 transition-all cursor-pointer shadow-xs active:scale-95 items-center justify-center shrink-0 min-w-[34px] min-h-[34px]"
              title={isHindi ? 'रिमाइंडर और अलर्ट्स' : 'Reminders & Scheduled Alerts'}
              id="header-reminders-bell-btn"
              aria-label={isHindi ? 'रिमाइंडर खोलें' : 'Open Reminders'}
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {remindersCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-amber-500 text-slate-950 text-[9.5px] font-mono font-black flex items-center justify-center shadow-xs animate-pulse">
                  {remindersCount > 9 ? '9+' : remindersCount}
                </span>
              )}
            </button>
          )}

          {/* Main Menu 3-Dot Button */}
          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              setIsMenuOpen(true);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center shrink-0 min-w-[34px] min-h-[34px]"
            title={isHindi ? 'मुख्य मेनू व टूल्स' : 'Main Menu & Tools'}
            id="header-main-menu-btn"
            aria-label={isHindi ? 'मुख्य मेनू खोलें' : 'Open Main Menu'}
          >
            <MoreVertical className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--theme-text,#F8FAFC)]" />
          </button>
        </div>
      </div>

      {/* Main Menu Drawer / Modal */}
      {isMenuOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isHindi ? 'मुख्य मेनू' : 'Main Navigation Menu'}
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 text-left"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md h-full bg-[var(--theme-surface,#0E1A29)] border-l border-[var(--theme-border,#213E61)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-3.5 sm:p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <AppLogo size={32} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                      Daily Khata
                    </span>
                    <span className="text-[14px] font-black text-[var(--theme-primary,#38BDF8)]">
                      Pro
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                      MENU
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                    {isHindi ? 'मुख्य मेनू और उपयोगी टूल्स' : 'Main Navigation & Power Tools'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]">
                  ESC
                </kbd>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Menu List Sections - System & Settings is placed at the very top as requested */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-5">
              
              {/* Category 1: System & Settings (SABSE UPAR - AT THE VERY TOP) */}
              <div className="rounded-2xl border border-[var(--theme-primary,#38BDF8)]/30 bg-[var(--theme-card,#132438)]/60 p-2.5 sm:p-3 shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)]">
                      {isHindi ? 'सिस्टम व सेटिंग्स' : 'System & Settings'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/25">
                    CONFIG
                  </span>
                </div>
                <p className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] px-1 leading-tight">
                  {isHindi ? 'कन्फ़िगरेशन, सुरक्षा लॉक, श्रेणियां व डेटा बैकअप' : 'Configuration, PIN security, categories & backup'}
                </p>

                <div className="space-y-1 pt-1">
                  {/* Category Budgets */}
                  {onOpenBudgetManager && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenBudgetManager)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                      id="menu-budgets-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'मासिक बजट व अलर्ट' : 'Monthly Category Budgets'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'खर्च सीमा तय करें और ओवर-स्पेंडिंग रोकें' : 'Set category limits & prevent over-spending'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-amber-400 transition-colors" />
                    </button>
                  )}

                  {/* Split Bill Calculator */}
                  {onOpenSplitBill && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenSplitBill)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                      id="menu-split-bill-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Split className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'बिल विभाजन / स्प्लिट' : 'Split Bill & Group Share'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'दोस्तों व परिवार के साथ बराबर खर्च बांटें' : 'Divide group dinners & trip expenses'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-purple-400 transition-colors" />
                    </button>
                  )}

                  {/* Loan, EMI & Udhar Ledger */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenLoans) handleMenuAction(onOpenLoans);
                      else if (onSelectTab) handleMenuAction(() => onSelectTab('loans'));
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-sky-500/50 transition-all cursor-pointer text-left group"
                    id="menu-loans-udhar-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'ऋण, किश्त व उधार खाता' : 'Loans, EMIs & Udhar'}
                          </span>
                          <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            PRO
                          </span>
                        </div>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'उधार लेना/देना व बैंक लोन EMI का एडवांस हिसाब' : 'Track money lent, borrowed & monthly EMIs'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-sky-400 transition-colors" />
                  </button>

                  {/* App Settings */}
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenSettings)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                    id="menu-settings-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 group-hover:scale-105 transition-transform">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.appSettings || (isHindi ? 'ऐप सेटिंग्स' : 'App Settings')}
                        </span>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? '6-फंड अनुपात, मुद्रा, भाषा, बैकअप व रीस्टोर' : '6-fund split %, currency, backup & cloud-free storage'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors" />
                  </button>

                  {/* Security PIN Lock */}
                  {onOpenSecurity && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenSecurity)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                      id="menu-security-pin-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {tr.menu.securityPinLock || (isHindi ? 'सुरक्षा पिन लॉक' : 'Security PIN & App Lock')}
                            </span>
                            {isLockEnabled ? (
                              <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {tr.menu.active || 'ACTIVE'}
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-400 border border-slate-500/30">
                                {isHindi ? 'बंद' : 'OFF'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? '4-अंकों के गुप्त पिन कोड से डेटा सुरक्षित करें' : '4-digit offline PIN passcode protection'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  )}

                  {/* Master Edit Hub */}
                  {onOpenMasterEdit && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenMasterEdit)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                      id="menu-master-edit-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Database className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'मास्टर डेटा व श्रेणियां' : 'Master Data & Categories'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'श्रेणियां, आय स्रोत और टैग बदलें' : 'Edit categories, income sources & tags'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  )}

                  {/* Recycle Bin / Trash */}
                  {onOpenTrash && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenTrash)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                      id="menu-trash-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'रीसायकल बिन / ट्रैश' : 'Recycle Bin & Recovery'}
                            </span>
                            {trashCount > 0 && (
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                                {trashCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'हटाए गए लेन-देन देखें व रीस्टोर करें' : 'View, restore or permanently purge records'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-rose-400 transition-colors" />
                    </button>
                  )}

                  {/* App Version & 1-Click Direct Update Hub */}
                  <div
                    className="w-full p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/90 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/40 hover:border-[var(--theme-primary,#38BDF8)] transition-all text-left shadow-xs"
                    id="menu-app-version-update-card"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 group-hover:scale-105 transition-transform">
                          <RefreshCw className={`w-4 h-4 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                              {isHindi ? 'ऐप वर्शन व 1-क्लिक अपडेट' : 'App Version & 1-Click Update'}
                            </span>
                            <span className="text-[8.5px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/40">
                              {APP_VERSION_TAG}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? `एक क्लिक में वर्शन ${APP_VERSION_TAG} लागू करें व कैश साफ़ करें` : `1-click direct update to ${APP_VERSION_TAG} & purge cache`}
                          </span>
                        </div>
                      </div>

                      {/* Direct 1-Click Action Button */}
                      <button
                        type="button"
                        onClick={handleDirectUpdateApp}
                        disabled={isUpdatingApp}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary,#38BDF8)]/90 active:scale-95 text-[var(--theme-surface,#0E1A29)] text-[11px] font-black tracking-wide transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        id="menu-one-click-update-btn"
                        title={isHindi ? 'तुरंत एक क्लिक में ऐप अपडेट करें' : '1-Click Update App Now'}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                        <span>{isUpdatingApp ? (isHindi ? 'अपडेटिंग...' : 'Updating...') : (isHindi ? 'अपडेट करें' : 'Update Now')}</span>
                      </button>
                    </div>

                    {/* Quick Changelog link */}
                    <div className="flex items-center justify-between text-[10px] text-[var(--theme-text-dim,#94A3B8)] mt-2 pt-1.5 border-t border-[var(--theme-border,#213E61)]/50">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        {isHindi ? 'ऑफ़लाइन रेडी • सुरक्षित डेटा' : 'Offline Ready • 100% Safe'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowUpdateModal(true)}
                        className="text-[var(--theme-primary,#38BDF8)] hover:underline font-semibold cursor-pointer"
                        id="menu-version-notes-btn"
                      >
                        {isHindi ? `वर्शन विवरण (${APP_VERSION_TAG})` : `What's New in ${APP_VERSION_TAG}`}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Controls Bar (Inside System Section) */}
                <div className="pt-1.5 border-t border-[var(--theme-border,#213E61)]/60 flex flex-wrap items-center gap-1.5">
                  {/* Instant Lock if enabled */}
                  {isLockEnabled && onLockNow && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onLockNow)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      title={tr.menu.lock}
                      id="menu-quick-lock-btn"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{tr.menu.lock}</span>
                    </button>
                  )}

                  {/* Day/Night Theme Toggle */}
                  {onThemeChange && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        if (isLightMode) {
                          onThemeChange('blue');
                        } else {
                          onThemeChange('light');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      title={isLightMode ? 'Switch to Night Dark Mode' : 'Switch to Day Light Mode'}
                      id="menu-quick-theme-btn"
                    >
                      {isLightMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isLightMode ? (isHindi ? 'डार्क मोड' : 'Dark Mode') : (isHindi ? 'लाइट मोड' : 'Light Mode')}</span>
                    </button>
                  )}

                  {/* Privacy Eye Toggle */}
                  {onTogglePrivacyMask && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        onTogglePrivacyMask();
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                        privacyMask
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                      }`}
                      title={privacyMask ? 'Amounts Hidden' : 'Mask Rupee Amounts'}
                      id="menu-quick-privacy-btn"
                    >
                      {privacyMask ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{privacyMask ? (isHindi ? 'छिपा हुआ' : 'Masked') : (isHindi ? 'प्राइवेसी मास्क' : 'Mask ₹')}</span>
                    </button>
                  )}

                  {/* Command Search Shortcut */}
                  {onOpenPageSearch && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenPageSearch)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Search pages & calculators (Ctrl+K)"
                      id="menu-quick-search-btn"
                    >
                      <Search className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{isHindi ? 'सर्च (⌘K)' : 'Search'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Category 2: Core Financial Ledger (मुख्य खाता व वित्तीय रिकॉर्ड्स) */}
              <div>
                <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)]">
                    {isHindi ? 'मुख्य खाता व वित्तीय रिकॉर्ड्स' : 'Core Financial Khata'}
                  </p>
                  <span className="text-[9px] font-mono font-semibold text-[var(--theme-text-dim,#64748B)]">
                    LEDGER
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'home', label: tr.menu.khata || (isHindi ? 'दैनिक खाता' : 'Daily Khata'), desc: isHindi ? 'डैशबोर्ड, 6-फंड सारांश व बैलेंस' : 'Dashboard & 6-Fund Rule Split', icon: Home, color: 'text-[var(--theme-primary,#38BDF8)]' },
                    { id: 'history', label: tr.menu.record || (isHindi ? 'लेन-देन पासबुक' : 'Passbook & Records'), desc: isHindi ? 'सभी आय-व्यय प्रविष्टियां, फ़िल्टर व खोज' : 'All transaction records, search & print', icon: History, color: 'text-indigo-400' },
                    { id: 'add', label: isHindi ? 'नया लेन-देन जोड़ें' : 'Add New Transaction', desc: isHindi ? 'आय या खर्च की नई प्रविष्टि दर्ज करें' : 'Record new income or expense entry', icon: PlusCircle, color: 'text-emerald-400' },
                    { id: 'report', label: tr.menu.analytics || (isHindi ? 'मासिक वित्तीय रिपोर्ट' : 'Monthly Analytics'), desc: isHindi ? 'खर्च पाई-चार्ट, फंड रुझान व पीडीएफ रिपोर्ट' : 'Expense charts, fund analytics & PDF', icon: BarChart3, color: 'text-sky-400' },
                    { id: 'goals', label: tr.menu.goals || (isHindi ? 'बचत लक्ष्य व टारगेट्स' : 'Savings Goals'), desc: isHindi ? 'आपातकालीन फंड, जमा प्रगति व स्टेटस' : 'Savings targets, progress & deposits', icon: Target, color: 'text-emerald-400' },
                    { id: 'loans', label: 'Loans, EMIs & Debt Ledger', desc: 'Money lent, personal borrowings & bank EMIs', icon: Landmark, color: 'text-amber-400' }
                  ].map((item) => {
                    const isActive = currentTab === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (onSelectTab) {
                            handleMenuAction(() => onSelectTab(item.id as NavTab));
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                          isActive
                            ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                            : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[13px] font-bold block truncate ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text,#F8FAFC)]'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">{item.desc}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text-dim,#64748B)] group-hover:text-[var(--theme-text,#F8FAFC)]'}`} />
                      </button>
                    );
                  })}

                  {/* Scheduled Reminders */}
                  {onOpenReminders && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenReminders)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left group"
                      id="menu-reminders-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-yellow-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'बिल व भुगतान रिमाइंडर' : 'Scheduled Reminders'}
                            </span>
                            {remindersCount > 0 && (
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-yellow-400 text-slate-900 animate-pulse">
                                {remindersCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'आवर्ती बिल, SIP व देय तारीख अलर्ट्स' : 'Recurring bills, loan & SIP due alerts'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-yellow-400 transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category 3: Productivity & Utilities (दैनिक उत्पादकता व टूल्स) */}
              <div>
                <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)]">
                    {isHindi ? 'उत्पादकता व दैनिक टूल्स' : 'Productivity & Utility Tools'}
                  </p>
                  <span className="text-[9px] font-mono font-semibold text-[var(--theme-text-dim,#64748B)]">
                    TOOLS
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'attendance', label: isHindi ? 'उपस्थिति रजिस्टर' : 'Attendance Register', desc: isHindi ? 'ड्यूटी घंटे, क्लॉक इन/आउट व वेतन गणना' : 'Duty Hours & Clock In/Out Register', icon: CalendarCheck, color: 'text-teal-400' },
                    { id: 'tracker', label: tr.menu.workAndLife || (isHindi ? 'कार्य व प्रोजेक्ट ट्रैकर' : 'Work & Projects'), desc: isHindi ? 'क्लाइंट प्रोजेक्ट्स, डिलीवरेबल्स व आय' : 'Client deliverables & project revenue', icon: Briefcase, color: 'text-rose-400' },
                    { id: 'notes', label: tr.menu.personalNotes || (isHindi ? 'निजी नोट्स व आदतें' : 'Personal Notes & Routine'), desc: isHindi ? 'दैनिक रूटीन, आदतें व सुरक्षित नोट्स' : 'Routines, habits & encrypted thoughts', icon: BookOpen, color: 'text-[#8B5CF6]' },
                    { id: 'calculator', label: tr.menu.calculator || (isHindi ? 'वित्तीय कैलकुलेटर सूट' : 'Financial Calculators'), desc: isHindi ? 'SIP, EMI, GST, FD, RD व मुद्रास्फीति' : 'SIP, EMI, GST, FD & inflation tools', icon: Calculator, color: 'text-[#F59E0B]' }
                  ].map((item) => {
                    const isActive = currentTab === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (onSelectTab) {
                            handleMenuAction(() => onSelectTab(item.id as NavTab));
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                          isActive
                            ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                            : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[13px] font-bold block truncate ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text,#F8FAFC)]'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">{item.desc}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text-dim,#64748B)] group-hover:text-[var(--theme-text,#F8FAFC)]'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 4: Knowledge & Wealth Academy (ज्ञान व वित्तीय शिक्षा) */}
              <div>
                <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)]">
                    {isHindi ? 'ज्ञान व वित्तीय शिक्षा' : 'Wealth Academy & Knowledge'}
                  </p>
                  <span className="text-[9px] font-mono font-semibold text-[var(--theme-text-dim,#64748B)]">
                    LEARN
                  </span>
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTab) {
                        handleMenuAction(() => onSelectTab('academy'));
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'academy' || currentTab === 'article'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                    }`}
                    id="menu-academy-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[13px] font-bold block truncate ${currentTab === 'academy' || currentTab === 'article' ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text,#F8FAFC)]'}`}>
                            {isHindi ? 'वेल्थ अकादमी (Wealth Academy)' : 'Wealth Academy'}
                          </span>
                          <span className="text-[8.5px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                            40+ GUIDES
                          </span>
                        </div>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? '40+ व्यावहारिक वित्तीय लेख, बजट नियम व संपत्ति निर्माण' : '40+ money management principles & wealth guides'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-amber-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Category 5: Help, Security & Legal Information (सहायता, सुरक्षा व नीतियां) */}
              <div>
                <div className="flex items-center justify-between gap-2 px-1 mb-1.5">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)]">
                    {isHindi ? 'सहायता, सुरक्षा व कानूनी पृष्ठ' : 'Help, Security & Policies'}
                  </p>
                  <span className="text-[9px] font-mono font-semibold text-[var(--theme-text-dim,#64748B)]">
                    LEGAL
                  </span>
                </div>
                <div className="space-y-1">
                  {/* User Manual & Guide */}
                  {(onOpenManual || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenManual) {
                          handleMenuAction(onOpenManual);
                        } else if (onSelectTab) {
                          handleMenuAction(() => onSelectTab('guide'));
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'guide'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                      }`}
                      id="menu-guide-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.userManualGuide || (isHindi ? 'यूजर मैनुअल व गाइड' : 'User Manual & Step-by-Step Guide')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'हर फीचर व 6-फंड सिद्धांत की सम्पूर्ण जानकारी' : 'Feature walkthrough, shortcuts & documentation'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-sky-400 transition-colors" />
                    </button>
                  )}

                  {/* Help Center & Support */}
                  {(onOpenSupport || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenSupport) {
                          handleMenuAction(() => onOpenSupport('help'));
                        } else if (onSelectTab) {
                          handleMenuAction(() => onSelectTab('support'));
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'support'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                      }`}
                      id="menu-support-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.helpCenterFaq || (isHindi ? 'सहायता केंद्र व फीडबैक' : 'Help & Support Centre')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'एफएक्यू, समस्या रिपोर्ट करें और सुझाव दें' : 'FAQ, report a bug or submit feedback'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  )}

                  {/* Source Safety & Security Audit */}
                  {(onOpenSourceCode || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenSourceCode) {
                          handleMenuAction(onOpenSourceCode);
                        } else if (onSelectTab) {
                          handleMenuAction(() => onSelectTab('safety'));
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'safety'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                      }`}
                      id="menu-safety-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.safetySourceCode || (isHindi ? 'सुरक्षा व सोर्स ऑडिट' : 'Source Safety & Zero Telemetry')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? '100% ऑफ़लाइन डेटा, शून्य क्लाउड ट्रैकिंग गारंटी' : 'Client-side verification & security guarantees'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  )}

                  {/* Support Project */}
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(() => onSelectTab('support-project'))}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'support-project'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                      }`}
                      id="menu-support-project-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'प्रोजेक्ट को सपोर्ट करें' : 'Support Open Source Project'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'ओपन-सोर्स विकास, स्टार दें व शेयर करें' : 'Open-source development & community backing'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-rose-400 transition-colors" />
                    </button>
                  )}

                  {/* About Page */}
                  {(onOpenAbout || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAbout) {
                          handleMenuAction(onOpenAbout);
                        } else if (onSelectTab) {
                          handleMenuAction(() => onSelectTab('about'));
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'about'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                      }`}
                      id="menu-about-page-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'ऐप के बारे में (About App)' : 'About Daily Khata Pro'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? `मिशन, 6-फंड फॉर्मूला व संस्करण ${APP_VERSION}` : `Mission, features & version ${APP_VERSION}`}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-pink-400 transition-colors" />
                    </button>
                  )}

                  {/* Developer Profile Page */}
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => {
                        handleMenuAction(() => onSelectTab('developer'));
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'developer'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/10 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40'
                      }`}
                      id="menu-developer-page-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'डेवलपर प्रोफाइल (Developer)' : 'Developer Profile'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            MD Zafeer Hasan (YAZDAAN)
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  )}

                  {/* Legal Policies 2x2 Grid */}
                  <div className="pt-2 grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'privacy', label: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy', icon: ShieldCheck, color: 'text-teal-400' },
                      { id: 'terms', label: isHindi ? 'नियम व शर्तें' : 'Terms of Service', icon: FileText, color: 'text-blue-400' },
                      { id: 'disclaimer', label: isHindi ? 'अस्वीकरण' : 'Disclaimer', icon: AlertCircle, color: 'text-amber-400' },
                      { id: 'cookies', label: isHindi ? 'कुकीज़ नीति' : 'Cookie Policy', icon: Cookie, color: 'text-orange-400' }
                    ].map((policy) => {
                      const PolicyIcon = policy.icon;
                      const isActive = currentTab === policy.id;
                      return (
                        <button
                          key={policy.id}
                          type="button"
                          onClick={() => {
                            if (onSelectTab) {
                              handleMenuAction(() => onSelectTab(policy.id as NavTab));
                            }
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer truncate ${
                            isActive
                              ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                              : 'bg-[var(--theme-surface,#0E1A29)]/70 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                          }`}
                        >
                          <PolicyIcon className={`w-3.5 h-3.5 shrink-0 ${policy.color}`} />
                          <span className="truncate">{policy.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Category 6: App Distribution & Share Utilities */}
              {(onOpenInstall || onOpenShare) && (
                <div className="pt-1 flex items-center gap-2">
                  {onOpenInstall && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenInstall)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      id="menu-install-pwa-btn"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
                    </button>
                  )}
                  {onOpenShare && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenShare)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      id="menu-share-app-btn"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isHindi ? 'शेयर करें' : 'Share App'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-4 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex flex-col gap-2 text-[11px] text-[var(--theme-text-dim,#94A3B8)] shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-[12px] text-[var(--theme-text,#F8FAFC)] tracking-tight">
                    Daily Khata <span className="text-[var(--theme-primary,#38BDF8)]">Pro</span>
                  </span>
                  <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] font-semibold shrink-0">
                    {APP_VERSION_TAG}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDirectUpdateApp}
                  disabled={isUpdatingApp}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.25))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
                  id="drawer-footer-update-btn"
                  title={isHindi ? 'एक क्लिक में अपडेट करें' : '1-Click Direct Update'}
                >
                  <RefreshCw className={`w-3 h-3 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                  <span>{isUpdatingApp ? '...' : (isHindi ? 'अपडेट' : 'Update')}</span>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--theme-border,#213E61)]/40 text-[10.5px]">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                  <span>100% Offline • Zero Telemetry</span>
                </div>
                <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-mono">100% Private</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 1-Click Update Loading Overlay */}
      {isUpdatingApp && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shadow-inner">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'Daily Khata Pro अपडेट हो रहा है' : 'Updating Daily Khata Pro'}
              </h3>
              <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] mt-1">
                {updateStatus || (isHindi ? `कैश रीफ्रेश व v${APP_VERSION} लागू किया जा रहा है...` : `Refreshing cache & applying v${APP_VERSION} build...`)}
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-2.5 rounded-lg">
              ✓ {isHindi ? 'आपका सारा वित्तीय डेटा 100% सुरक्षित है' : 'All user records & financial data 100% safe'}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Version Update & Changelog Modal */}
      {showUpdateModal && createPortal(
        <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border,#213E61)]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
                  <ArrowUpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                    {isHindi ? 'ऐप वर्शन व अपडेट हब' : 'App Version & Release Hub'}
                  </h3>
                  <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                    {APP_RELEASE_LABEL}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="w-8 h-8 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Status Box */}
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-mono uppercase text-[var(--theme-text-dim,#94A3B8)] block">
                  {isHindi ? 'वर्तमान संस्करण' : 'Installed Version'}
                </span>
                <span className="text-[15px] font-mono font-black text-[var(--theme-primary,#38BDF8)]">
                  {APP_VERSION_FULL}
                </span>
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ● {isHindi ? 'नवीनतम बिल्ड' : 'Latest Build'}
              </span>
            </div>

            {/* What's New in v2.7.0 */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? `v${APP_VERSION} में नया क्या है?` : `What's New in v${APP_VERSION}`}
              </span>
              <div className="space-y-1.5 text-[12px] text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/50 p-3 rounded-xl border border-[var(--theme-border,#213E61)]/60">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? 'सिस्टम व सेटिंग्स मेन्यू को सर्वोच्च प्राथमिकता पर व्यवस्थित किया गया।' : 'Main Menu organized with System & Settings at top.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? '1-क्लिक डायरेक्ट ऐप वर्शन अपडेट व ऑटोमैटिक कैश पर्ज इंजन।' : '1-Click direct app version update & automatic cache purge.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? 'त्वरित स्क्रीन लॉक, प्राइवेसी आई टॉगल और 6-फंड एक्यूरेसी।' : 'Instant screen lock, privacy eye toggle & 6-Fund split accuracy.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? '100% क्लाइंट-साइड ऑफ़लाइन प्राइवेसी (शून्य डेटा ट्रांसमिशन)।' : '100% offline local privacy with zero telemetry transmission.'}</span>
                </div>
              </div>
            </div>

            {/* Direct 1-Click Update Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUpdateModal(false);
                  handleDirectUpdateApp();
                }}
                disabled={isUpdatingApp}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary,#38BDF8)]/90 active:scale-95 text-[var(--theme-surface,#0E1A29)] font-extrabold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                id="modal-direct-update-btn"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                <span>{isHindi ? '1-क्लिक में तुरंत वर्शन अपडेट करें' : 'One-Click Direct Update & Refresh'}</span>
              </button>
              <p className="text-center text-[10px] text-[var(--theme-text-dim,#94A3B8)] mt-1.5">
                {isHindi ? 'यह आपके मौजूदा खातों, लेजर व सेटिंग्स को बिना छुए केवल कोड और कैश अपडेट करता है।' : 'Refreshes app assets & service worker. Your local ledger data is 100% preserved.'}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
export default Header;
