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
  Landmark,
  Globe,
  Palette,
  ChevronDown,
  Wrench,
  Layers,
  Cloud,
  WifiOff
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLogo } from './AppLogo';
import { MainMenuDrawer } from './MainMenuDrawer';
import { AppTheme, AppLanguage, AppViewMode, AppLayout } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getAppTranslation } from '../utils/appTranslations';
import { triggerHapticSound } from '../utils/khataCalculations';
import { APP_VERSION, APP_VERSION_TAG, APP_VERSION_FULL, APP_RELEASE_LABEL } from '../utils/version';

interface HeaderProps {
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenGoogleTranslate?: () => void;
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
  onOpenGoogleDrive?: () => void;
  isDriveConnected?: boolean;
  isAutoSyncing?: boolean;
  autoSyncEnabled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  onSelectTab,
  onOpenSettings,
  onOpenGoogleTranslate,
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
  onLanguageChange,
  privacyMask = false,
  onTogglePrivacyMask,
  onOpenPageSearch,
  onOpenAbout,
  onOpenSplitBill,
  onOpenBudgetManager,
  onOpenLoans,
  onOpenGoogleDrive,
  isDriveConnected = false,
  isAutoSyncing = false,
  autoSyncEnabled = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const tr = getAppTranslation((language as AppLanguage) || 'en');
  const isHindi = language === 'hi';
  const isLightMode = theme === 'light' || theme === 'white';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDirectUpdateApp = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      alert(
        isHindi
          ? 'आप अभी ऑफ़लाइन हैं। ऐप अपडेट व कैश रिफ्रेश करने के लिए इंटरनेट की आवश्यकता है। आपका स्थानीय डेटा सुरक्षित है।'
          : 'You are currently offline. An internet connection is required to refresh cache and check for updates. Your local data is completely safe.'
      );
      return;
    }
    triggerHapticSound('save');
    setIsUpdatingApp(true);
    setUpdateStatus(
      isHindi
        ? `v${APP_VERSION} नवीनतम वर्शन जाँचा जा रहा है...`
        : `Checking & loading latest v${APP_VERSION} build...`
    );

    try {
      // 1. Service Worker update check & activate waiting worker
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.update();
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            } else if (reg.installing) {
              reg.installing.postMessage({ type: 'SKIP_WAITING' });
            }
            if (reg.active) {
              reg.active.postMessage({ type: 'REFRESH_CACHE' });
            }
          }
        } catch (err) {
          console.warn('SW update check error:', err);
        }
      }

      // 2. Fetch fresh index.html into cache
      try {
        const freshIndex = await fetch('/index.html', { cache: 'reload' });
        if (freshIndex && freshIndex.ok && 'caches' in window) {
          const keys = await caches.keys();
          for (const k of keys) {
            const c = await caches.open(k);
            await c.put('/index.html', freshIndex.clone());
            await c.put('/', freshIndex);
          }
        }
      } catch (err) {
        console.warn('Pre-fetch error:', err);
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
      }, 600);
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

  return (
    <header className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md sticky top-0 z-40 shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-1 sm:gap-3">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-shrink">
          <div
            onClick={() => onSelectTab && onSelectTab('home')}
            className="cursor-pointer active:scale-95 transition-transform shrink-0"
            title="Daily Khata Pro"
          >
            <div className="sm:hidden">
              <AppLogo size={32} />
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
              <span className="font-bold text-[14px] xs:text-[15px] sm:text-[18px] tracking-tight text-[var(--theme-text,#F8FAFC)] group-hover:opacity-95 transition-opacity truncate">
                Daily Khata
              </span>
              <span className="font-black text-[13px] xs:text-[14px] sm:text-[17px] tracking-tight transition-colors drop-shadow-xs text-[var(--theme-primary,#38BDF8)]">
                Pro
              </span>
            </div>
            <div className="mt-0.5 min-w-0 block">
              <span className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-semibold tracking-wide truncate transition-colors text-[var(--theme-text-muted,#8BA4D0)] block leading-tight">
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
                  <TabIcon className="w-4 h-4 shrink-0" />
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
                <Search className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0 group-hover:scale-110 transition-transform" />
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-dim,#64748B)] pointer-events-none" />
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
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Subtle Non-Intrusive Offline Status Chip */}
          {!isOnline && (
            <div
              className="h-8 sm:h-9 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 select-none shadow-xs"
              title={isHindi ? '100% ऑफ़लाइन मोड सक्रिय है — डेटा डिवाइस में सुरक्षित है' : '100% Offline Mode Active — Data safely stored locally'}
            >
              <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold hidden sm:inline">
                {isHindi ? 'ऑफ़लाइन' : 'Offline'}
              </span>
            </div>
          )}

          {/* Privacy Eye Toggle */}
          {onTogglePrivacyMask && (
            <button
              type="button"
              onClick={onTogglePrivacyMask}
              className={`h-8 sm:h-9 w-8 sm:w-auto sm:min-w-[36px] px-0 sm:px-2.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center justify-center gap-1.5 shrink-0 ${
                privacyMask
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)]'
              }`}
              title={privacyMask ? 'Amounts Hidden (Click to show)' : 'Mask Rupee Amounts'}
              id="header-privacy-mask-btn"
            >
              {privacyMask ? (
                <EyeOff className="w-4 h-4 shrink-0" />
              ) : (
                <Eye className="w-4 h-4 shrink-0" />
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
              className={`h-8 sm:h-9 w-8 sm:w-auto sm:min-w-[36px] px-0 sm:px-2.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center justify-center gap-1.5 shrink-0 ${
                isLightMode
                  ? 'bg-[#0284C7]/15 border-[#0284C7]/40 text-[#0284C7] hover:bg-[#0284C7]/25'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)]'
              }`}
              title={isLightMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
              id="header-theme-toggle-btn"
            >
              {isLightMode ? (
                <Moon className="w-4 h-4 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 shrink-0" />
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
              className="relative hidden sm:flex h-9 w-9 min-w-[36px] min-h-[36px] rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] hover:border-amber-400/50 text-[var(--theme-text-muted,#94A3B8)] hover:text-amber-400 transition-all cursor-pointer shadow-xs active:scale-95 items-center justify-center shrink-0 p-0"
              title={isHindi ? 'रिमाइंडर और अलर्ट्स' : 'Reminders & Scheduled Alerts'}
              id="header-reminders-bell-btn"
              aria-label={isHindi ? 'रिमाइंडर खोलें' : 'Open Reminders'}
            >
              <Bell className="w-4 h-4 shrink-0" />
              {remindersCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-amber-500 text-slate-950 text-[9.5px] font-mono font-black flex items-center justify-center shadow-xs animate-pulse">
                  {remindersCount > 9 ? '9+' : remindersCount}
                </span>
              )}
            </button>
          )}

          {/* Google Drive 1-Click Cloud Sync Quick Button (Desktop/Tablet only; on mobile accessible via Main Menu and Settings) */}
          {onOpenGoogleDrive && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onOpenGoogleDrive();
              }}
              className={`relative hidden sm:flex h-9 min-w-[36px] px-2 sm:px-2.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold items-center justify-center gap-1.5 shrink-0 ${
                isAutoSyncing
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 animate-pulse'
                  : isDriveConnected
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 hover:bg-blue-500/25'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)]'
              }`}
              title={isHindi ? 'गूगल ड्राइव 1-क्लिक बैकअप व ऑटो अपडेट' : 'Google Drive 1-Click Backup & Auto-Sync'}
              id="header-gdrive-sync-btn"
              aria-label={isHindi ? 'गूगल ड्राइव बैकअप खोलें' : 'Open Google Drive Backup'}
            >
              <Cloud className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">Drive</span>
              {isDriveConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5"></span>
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
            className="h-8 w-8 sm:h-9 sm:w-9 min-w-[32px] sm:min-w-[36px] rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center shrink-0 p-0"
            title={isHindi ? 'मुख्य मेनू व टूल्स' : 'Main Menu & Tools'}
            id="header-main-menu-btn"
            aria-label={isHindi ? 'मुख्य मेनू खोलें' : 'Open Main Menu'}
          >
            <MoreVertical className="w-4 h-4 shrink-0 text-[var(--theme-text,#F8FAFC)]" />
          </button>
        </div>
      </div>

      {/* Main Menu Drawer */}
      <MainMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        onOpenSettings={onOpenSettings}
        onOpenMasterEdit={onOpenMasterEdit}
        onOpenManual={onOpenManual}
        onOpenSupport={onOpenSupport}
        onOpenNotes={onOpenNotes}
        onOpenTrash={onOpenTrash}
        trashCount={trashCount}
        onOpenReminders={onOpenReminders}
        remindersCount={remindersCount}
        onOpenSourceCode={onOpenSourceCode}
        onOpenInstall={onOpenInstall}
        onOpenShare={onOpenShare}
        onOpenSecurity={onOpenSecurity}
        isLockEnabled={isLockEnabled}
        onLockNow={onLockNow}
        theme={theme}
        onThemeChange={onThemeChange}
        language={language}
        onLanguageChange={onLanguageChange}
        onOpenGoogleTranslate={onOpenGoogleTranslate}
        privacyMask={privacyMask}
        onTogglePrivacyMask={onTogglePrivacyMask}
        onOpenPageSearch={onOpenPageSearch}
        onOpenAbout={onOpenAbout}
        onOpenSplitBill={onOpenSplitBill}
        onOpenBudgetManager={onOpenBudgetManager}
        onOpenLoans={onOpenLoans}
        handleDirectUpdateApp={handleDirectUpdateApp}
        isUpdatingApp={isUpdatingApp}
        onOpenGoogleDrive={onOpenGoogleDrive}
        isDriveConnected={isDriveConnected}
        autoSyncEnabled={autoSyncEnabled}
      />

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

            {/* What's New in v2.8.0 */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? `v${APP_VERSION} में नया क्या है?` : `What's New in v${APP_VERSION}`}
              </span>
              <div className="space-y-1.5 text-[12px] text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/50 p-3 rounded-xl border border-[var(--theme-border,#213E61)]/60">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? 'मज़बूत ऑफ़लाइन सपोर्ट: बिना इंटरनेट के 100% ऐप और सभी रूट्स सुचारू रूप से कार्यशील।' : 'Rock-solid offline mode: 100% functional app shell & all routes without internet.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? '1-क्लिक सीधा ऐप वर्शन अपडेट (बिना किसी एरर या स्टक स्क्रीन के)।' : '1-Click seamless app version update (no stuck screens or cache issues).'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isHindi ? 'सिस्टम व सेटिंग्स मेन्यू को सर्वोच्च प्राथमिकता पर व्यवस्थित किया गया।' : 'Main Menu organized with System & Settings at top.'}</span>
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
                {isHindi ? 'यह आपके मौजूदा खातों, रिकॉर्ड्स व सेटिंग्स को सुरक्षित रखते हुए केवल कोड अपडेट करता है।' : 'Refreshes app assets & service worker. Your local records are 100% preserved.'}
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
