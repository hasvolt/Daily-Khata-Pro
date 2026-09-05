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
  KeyRound,
  ShieldCheck,
  Database,
  RefreshCw
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { HasVoltLogo } from './HasVoltLogo';
import { AppTheme, AppLanguage, AppViewMode, AppLayout } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getAppTranslation } from '../utils/appTranslations';
import { triggerHapticSound } from '../utils/khataCalculations';

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
  onOpenDeveloper?: () => void;
  onOpenAbout?: () => void;
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
  onOpenDeveloper,
  onOpenAbout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tr = getAppTranslation((language as AppLanguage) || 'en');
  const isHindi = language === 'hi';
  const isLightMode = theme === 'light' || theme === 'white';

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
              <HasVoltLogo size={34} />
            </div>
            <div className="hidden sm:block">
              <HasVoltLogo size={38} />
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
          {/* Advance Search Button (Mobile & Small Screens) */}
          {onOpenPageSearch ? (
            <button
              type="button"
              onClick={onOpenPageSearch}
              className="md:hidden p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] hover:text-[var(--theme-text,#F8FAFC)] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0"
              title={isHindi ? 'एडवांस सर्च व नेविगेटर (Ctrl+K)' : 'Advanced Search & Navigator (Ctrl+K)'}
              id="header-page-search-btn"
              aria-label="Search pages and tools"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span className="text-[11px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'खोजें' : 'Search'}
              </span>
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
                <HasVoltLogo size={32} />
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

            {/* Quick Status / Quick Actions Ribbon */}
            {isLockEnabled && onLockNow && (
              <div className="px-3.5 py-2.5 bg-[var(--theme-card,#132438)]/50 border-b border-[var(--theme-border,#213E61)]/70 flex items-center justify-start gap-2 shrink-0 text-[11px]">
                {/* Instant Lock Chip */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLockNow();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-semibold transition-all cursor-pointer shrink-0 w-full justify-center sm:justify-start sm:w-auto"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{tr.menu.lock}</span>
                </button>
              </div>
            )}

            {/* Menu List Sections */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
              {/* Group 1: App Settings & Preferences */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] mb-1.5 px-1">
                  {isHindi ? 'ऐप सेटिंग्स एवं प्राथमिकताएं' : 'App Settings & Preferences'}
                </p>
                <div className="space-y-1">
                  {/* App Settings */}
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenSettings)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                    id="menu-settings-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.appSettings || (isHindi ? 'ऐप सेटिंग्स' : 'App Settings')}
                        </span>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? '6-फंड अनुपात, मुद्रा, भाषा, बैकअप' : 'Fund split %, currency, backup & data'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                  </button>

                  {/* Master Edit Hub */}
                  {onOpenMasterEdit && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenMasterEdit)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-master-edit-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-indigo-400 shrink-0">
                          <Database className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'मास्टर डेटा व श्रेणियां' : 'Master Edit Hub & Data'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'श्रेणियां, आय स्रोत और टैग बदलें' : 'Edit categories, income sources & tags'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* Security PIN Lock */}
                  {onOpenSecurity && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenSecurity)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-security-pin-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#38BDF8] shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {tr.menu.securityPinLock || (isHindi ? 'सुरक्षा पिन लॉक' : 'Security PIN & App Lock')}
                            </span>
                            {isLockEnabled && (
                              <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {tr.menu.active}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? '4-अंकों के गुप्त पिन कोड से डेटा सुरक्षित करें' : '4-digit offline PIN passcode protection'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}
                </div>
              </div>

              {/* Group 2: Tools & Calculators */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] mb-1.5 px-1">
                  {isHindi ? 'वित्तीय टूल्स व कैलकुलेटर' : 'Tools & Calculators'}
                </p>
                <div className="space-y-1">
                  {/* Financial Calculators Suite */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSimulator) {
                        handleMenuAction(onOpenSimulator);
                      } else if (onSelectTab) {
                        handleMenuAction(() => onSelectTab('calculator'));
                      }
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                    id="menu-calculator-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#F59E0B] shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.calculator || (isHindi ? 'वित्तीय कैलकुलेटर' : 'Financial Calculators')}
                          </span>
                          <span className="text-[8.5px] font-mono font-extrabold px-1 py-0.2 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                            PRO
                          </span>
                        </div>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'SIP, रूल 72, CAGR, EMI, GST टूल्स' : 'SIP, Rule 72, CAGR, EMI & GST tools'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                  </button>

                  {/* Attendance & Shift Register */}
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(() => onSelectTab('attendance'))}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-attendance-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#10B981] shrink-0">
                          <CalendarCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'उपस्थिति व शिफ्ट रजिस्टर' : 'Attendance & Shift Register'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'कार्य घंटे, क्लॉक इन/आउट और हाजिरी' : 'Track daily shift, overtime & duty hours'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}
                </div>
              </div>

              {/* Group 3: Personal Logs & Alerts */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] mb-1.5 px-1">
                  {isHindi ? 'डायरी, अलर्ट व ट्रैश' : 'Personal Logs & Alerts'}
                </p>
                <div className="space-y-1">
                  {/* Personal Notes & Journal */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenNotes) {
                        handleMenuAction(onOpenNotes);
                      } else if (onSelectTab) {
                        handleMenuAction(() => onSelectTab('notes'));
                      }
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                    id="menu-notes-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#8B5CF6] shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.personalNotes || (isHindi ? 'दैनिक डायरी व नोट्स' : 'Daily Life Journal & Notes')}
                        </span>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'मूड, आदतें, दिनचर्या व निजी विचार' : 'Routines, mood, daily habits & notes'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                  </button>

                  {/* Scheduled Reminders */}
                  {onOpenReminders && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenReminders)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-reminders-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#38BDF8] shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'बिल व भुगतान रिमाइंडर' : 'Scheduled Reminders'}
                            </span>
                            {remindersCount > 0 && (
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-[#38BDF8] text-[#040D17]">
                                {remindersCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'आवर्ती बिल, SIP व देय तारीख अलर्ट्स' : 'Recurring bills, loan & SIP alerts'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* Recycle Bin / Trash */}
                  {onOpenTrash && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenTrash)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-trash-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-rose-400 shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'रीसायकल बिन / ट्रैश' : 'Recycle Bin & Recovery'}
                            </span>
                            {trashCount > 0 && (
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                                {trashCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'हटाए गए लेन-देन देखें व रीस्टोर करें' : 'View, restore or permanently purge records'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}
                </div>
              </div>

              {/* Group 4: App System & Updates */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] mb-1.5 px-1">
                  {isHindi ? 'ऐप सिस्टम एवं अपडेट्स' : 'App System & Updates'}
                </p>
                <div className="space-y-1">
                  {/* App Version & Clear Cache Update */}
                  <button
                    type="button"
                    onClick={() => {
                      handleMenuAction(async () => {
                        try {
                          if ('caches' in window) {
                            const keys = await caches.keys();
                            await Promise.all(keys.map(key => caches.delete(key)));
                          }
                          if ('serviceWorker' in navigator) {
                            const registrations = await navigator.serviceWorker.getRegistrations();
                            for (const registration of registrations) {
                              await registration.unregister();
                            }
                          }
                          window.location.reload();
                        } catch (e) {
                          window.location.reload();
                        }
                      });
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-emerald-500/10 border border-[var(--theme-border,#213E61)]/50 hover:border-emerald-500/40 transition-all cursor-pointer text-left"
                    id="menu-update-cache-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-emerald-400 shrink-0">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'नया वर्शन प्राप्त करें (Update)' : 'Force Update Version'}
                          </span>
                          <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            v2.6.0
                          </span>
                        </div>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'कैशे साफ़ करें और लेटेस्ट वर्शन रीलोड करें' : 'Clear cache & reload latest application build'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                  </button>

                  {/* Install App / PWA */}
                  {onOpenInstall && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenInstall)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-install-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-sky-400 shrink-0">
                          <Download className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.installApp || (isHindi ? 'ऐप इंस्टॉल करें (Home Screen)' : 'Install as Application')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'मोबाइल या कंप्यूटर होम स्क्रीन पर जोड़ें' : 'Add to home screen for instant offline access'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* Share App */}
                  {onOpenShare && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenShare)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-share-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-indigo-400 shrink-0">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.shareApp || (isHindi ? 'Daily Khata Pro साझा करें' : 'Share Daily Khata Pro')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'दोस्तों व व्यापारियों को व्हाट्सएप/सोशल पर भेजें' : 'Share offline financial app via WhatsApp / social links'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}
                </div>
              </div>

              {/* Group 5: Help & Legal Info */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] mb-1.5 px-1">
                  {isHindi ? 'कानूनी व सहायता जानकारी' : 'Help & Legal Info'}
                </p>
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
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-guide-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-sky-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.userManualGuide || (isHindi ? 'यूजर मैनुअल व गाइड' : 'User Manual & Step-by-Step Guide')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'हर फीचर व 6-फंड सिद्धांत की सम्पूर्ण जानकारी' : 'Feature walkthrough, shortcuts & official documentation'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* Privacy Policy */}
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(() => onSelectTab('privacy'))}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-privacy-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-teal-400 shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy & Data Security'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? '100% ऑफ़लाइन डेटा, शून्य बाहरी ट्रैकिंग' : '100% local device storage, zero cloud tracking'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
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
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-safety-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-amber-400 shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.safetySourceCode || (isHindi ? 'सुरक्षा व सोर्स ऑडिट' : 'Source Safety & Zero Telemetry')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'सॉफ़्टवेयर सुरक्षा प्रमाण पत्र और गारंटी' : 'Client-side verification & security guarantees'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* Help Center & Bug Report */}
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
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-support-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-cyan-400 shrink-0">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.helpCenterFaq || (isHindi ? 'सहायता केंद्र व फीडबैक' : 'Help & Support Centre')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'एफएक्यू, समस्या रिपोर्ट करें और सुझाव दें' : 'FAQ, report a bug or submit feature suggestions'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* About Page */}
                  {onOpenAbout && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenAbout)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-about-page-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-pink-400 shrink-0">
                          <HasVoltLogo size={16} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'ऐप के बारे में (About)' : 'About Daily Khata Pro'}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'रिलीज़ नोट्स व संस्करण विवरण' : 'Release notes & version details'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}

                  {/* Developer Profile */}
                  {(onOpenDeveloper || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenDeveloper) {
                          handleMenuAction(onOpenDeveloper);
                        } else if (onSelectTab) {
                          handleMenuAction(() => onSelectTab('developer'));
                        }
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/50 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all cursor-pointer text-left"
                      id="menu-developer-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.developerProfile || (isHindi ? 'डेवलपर प्रोफाइल व जानकारी' : 'Developer Information')}
                          </span>
                          <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'HasVolt Technologies & Daily Khata Pro' : 'Engineering architecture & project creator'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/70 flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)] shrink-0">
              <span className="font-mono font-semibold">Daily Khata Pro v2.5.0</span>
              <span className="font-medium text-emerald-400">100% Offline • Zero Telemetry</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
export default Header;
