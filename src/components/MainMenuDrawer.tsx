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
  Shield,
  Trash2,
  Bell,
  Share2,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Download,
  BookOpen,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  Database,
  RefreshCw,
  Cookie,
  PlusCircle,
  AlertCircle,
  User,
  Split,
  Sliders,
  Landmark,
  Wrench,
  Sparkles,
  Heart,
  Cloud,
  Newspaper,
  Globe,
  Palette,
  Check
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLogo } from './AppLogo';
import { AppTheme, AppLanguage } from '../types';
import { getAppTranslation } from '../utils/appTranslations';
import { triggerHapticSound } from '../utils/khataCalculations';
import { APP_VERSION, APP_VERSION_TAG } from '../utils/version';

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
  handleDirectUpdateApp: (e?: React.MouseEvent) => void;
  isUpdatingApp: boolean;
  onOpenGoogleDrive?: () => void;
  isDriveConnected?: boolean;
  autoSyncEnabled?: boolean;
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
  handleDirectUpdateApp,
  isUpdatingApp,
  onOpenGoogleDrive,
  isDriveConnected = false,
  autoSyncEnabled = false
}) => {
  const [menuFilter, setMenuFilter] = useState<'all' | 'ledger' | 'finance' | 'work' | 'tools' | 'settings' | 'info'>('all');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const tr = getAppTranslation((language as AppLanguage) || 'en');
  const isHindi = language === 'hi';
  const isLightMode = theme === 'light' || theme === 'white';

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

  if (!isOpen) return null;

  const handleMenuAction = (action?: () => void) => {
    if (!action) return;
    triggerHapticSound('click');
    onClose();
    action();
  };

  const toggleSection = (sec: string) => {
    triggerHapticSound('click');
    setCollapsedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isHindi ? 'मुख्य मेनू' : 'Main Navigation Menu'}
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 text-left"
      onClick={onClose}
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
                {isHindi ? 'व्यवस्थित श्रेणियां व त्वरित टूल्स' : 'Organized Categories & Tools'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
              title="Close Menu"
              id="menu-close-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Reorganized & Filterable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* Quick Utility Strip */}
          <div className="p-2 rounded-xl bg-[var(--theme-card,#132438)]/60 border border-[var(--theme-border,#213E61)]/70 flex items-center justify-between gap-1.5 shadow-xs">
            {/* Day/Night Theme */}
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
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                title={isLightMode ? 'डार्क मोड' : 'लाइट मोड'}
                id="menu-quick-theme-btn"
              >
                {isLightMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden xs:inline">{isLightMode ? (isHindi ? 'डार्क' : 'Dark') : (isHindi ? 'लाइट' : 'Light')}</span>
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
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                  privacyMask
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
                title={privacyMask ? 'Amounts Hidden' : 'Mask ₹ Amounts'}
                id="menu-quick-privacy-btn"
              >
                {privacyMask ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="hidden xs:inline">{privacyMask ? (isHindi ? 'छिपा ₹' : 'Masked') : (isHindi ? 'प्राइवेसी' : 'Privacy')}</span>
              </button>
            )}

            {/* Command Search */}
            {onOpenPageSearch && (
              <button
                type="button"
                onClick={() => handleMenuAction(onOpenPageSearch)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                title="Search pages (Ctrl+K)"
                id="menu-quick-search-btn"
              >
                <Search className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span className="hidden xs:inline">{isHindi ? 'सर्च' : 'Search'}</span>
              </button>
            )}

            {/* Instant Lock */}
            {isLockEnabled && onLockNow && (
              <button
                type="button"
                onClick={() => handleMenuAction(onLockNow)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                title={tr.menu.lock}
                id="menu-quick-lock-btn"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{tr.menu.lock}</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills (Instant categorization to prevent confusion) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] px-1">
              <span>{isHindi ? 'श्रेणी चुनें (Filter):' : 'Filter by Category:'}</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: isHindi ? 'सभी' : 'All', count: null },
                { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', count: 6 },
                { id: 'ledger', label: isHindi ? 'लेजर' : 'Ledger', count: 4 },
                { id: 'finance', label: isHindi ? 'ऋण व लक्ष्य' : 'Debts & Goals', count: 3 },
                { id: 'work', label: isHindi ? 'कार्य व रूटीन' : 'Work & Habits', count: 4 },
                { id: 'tools', label: isHindi ? 'कैलकुलेटर' : 'Calculators', count: 2 },
                { id: 'info', label: isHindi ? 'गाइड व सहायता' : 'Guides & Help', count: 5 }
              ].map((cat) => {
                const isSelected = menuFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      setMenuFilter(cat.id as typeof menuFilter);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-card,#132438)]/60 text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)] hover:text-white hover:border-[var(--theme-primary,#38BDF8)]/40'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {cat.count !== null && (
                      <span className={`text-[9px] font-mono px-1 rounded-full ${
                        isSelected ? 'bg-slate-950/25 text-slate-950' : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)]'
                      }`}>
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Category 1: सेटिंग्स व क्लाउड बैकअप (Settings & Cloud - 6 items) */}
          {(menuFilter === 'all' || menuFilter === 'settings') && (
            <div className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 p-2.5 sm:p-3 space-y-2">
              <div
                onClick={() => menuFilter === 'all' && toggleSection('settings')}
                className={`flex items-center justify-between gap-2 px-1 ${menuFilter === 'all' ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {isHindi ? '1. सेटिंग्स व क्लाउड बैकअप' : '1. Settings & Cloud Backup'}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    6 ITEMS
                  </span>
                </div>
                {menuFilter === 'all' && (
                  <button type="button" className="text-[var(--theme-text-dim,#94A3B8)] hover:text-white">
                    {collapsedSections['settings'] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!collapsedSections['settings'] && (
                <div className="space-y-1 pt-0.5">
                  {/* Google Drive 1-Click Backup & Auto-Sync */}
                  {onOpenGoogleDrive && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenGoogleDrive)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-blue-500/30 hover:border-blue-400/60 transition-all cursor-pointer text-left group"
                      id="menu-google-drive-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Cloud className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'गूगल ड्राइव बैकअप व ऑटो सिंक' : 'Google Drive Backup & Auto-Sync'}
                            </span>
                            {autoSyncEnabled ? (
                              <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {isHindi ? 'ऑटो ON' : 'AUTO ON'}
                              </span>
                            ) : isDriveConnected ? (
                              <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {isHindi ? 'कनेक्टेड' : 'LINKED'}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? '1-क्लिक बैकअप व ऑटोमैटिक क्लाउड अपडेट' : '1-click backup & automatic cloud updates'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-blue-400 transition-colors" />
                    </button>
                  )}

                  {/* Language & Translation */}
                  {onLanguageChange && (
                    <div className="w-full flex flex-col p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 border border-[var(--theme-border,#213E61)] gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'भाषा और अनुवाद' : 'Language & Translation'}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block leading-snug truncate">
                            {isHindi ? 'पसंदीदा भाषा चुनें या अंग्रेजी पर रीसेट करें' : 'Change app language or reset to English'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {onOpenGoogleTranslate && (
                          <button
                            type="button"
                            onClick={() => handleMenuAction(onOpenGoogleTranslate)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[11px] font-semibold hover:border-orange-500/50 hover:bg-orange-500/10 transition-all cursor-pointer text-center"
                          >
                            {isHindi ? 'भाषा चुनें' : 'Choose Language'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            triggerHapticSound('click');
                            onLanguageChange('en');
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-semibold hover:bg-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                        >
                          Reset to English
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Theme & Appearance (Professional Redesign) */}
                  {onThemeChange && (() => {
                    const THEME_OPTIONS: {
                      id: AppTheme;
                      name: string;
                      hindiName: string;
                      mode: 'Dark' | 'Light' | 'OLED';
                      primaryHex: string;
                      bgHex: string;
                    }[] = [
                      { id: 'blue', name: 'Sapphire Navy', hindiName: 'नीला नेवी', mode: 'Dark', primaryHex: '#38BDF8', bgHex: '#0F172A' },
                      { id: 'emerald', name: 'Emerald Forest', hindiName: 'पन्ना हरा', mode: 'Dark', primaryHex: '#34D399', bgHex: '#022C22' },
                      { id: 'cyan', name: 'Cyber Ocean', hindiName: 'साइबर स्यान', mode: 'Dark', primaryHex: '#22D3EE', bgHex: '#083344' },
                      { id: 'purple', name: 'Royal Violet', hindiName: 'शाही बैंगनी', mode: 'Dark', primaryHex: '#C084FC', bgHex: '#3B0764' },
                      { id: 'yellow', name: 'Amber Gold', hindiName: 'अंबर स्वर्ण', mode: 'Dark', primaryHex: '#FACC15', bgHex: '#422006' },
                      { id: 'orange', name: 'Sunset Copper', hindiName: 'सनसेट संतरी', mode: 'Dark', primaryHex: '#FB923C', bgHex: '#431407' },
                      { id: 'pink', name: 'Ruby Pink', hindiName: 'रूबी गुलाबी', mode: 'Dark', primaryHex: '#F472B6', bgHex: '#500724' },
                      { id: 'black', name: 'Pitch OLED', hindiName: 'ओलेड ब्लैक', mode: 'OLED', primaryHex: '#38BDF8', bgHex: '#000000' },
                      { id: 'light', name: 'Modern Studio', hindiName: 'मॉडर्न लाइट', mode: 'Light', primaryHex: '#0284C7', bgHex: '#F1F5F9' },
                      { id: 'white', name: 'Clean Paper', hindiName: 'सफेद मिनिमल', mode: 'Light', primaryHex: '#2563EB', bgHex: '#FFFFFF' }
                    ];

                    const activeThemeObj = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

                    return (
                      <div className="w-full flex flex-col p-3 rounded-2xl bg-[var(--theme-surface,#0E1A29)]/90 border border-[var(--theme-border,#213E61)] gap-2.5 shadow-sm">
                        <div className="flex items-center justify-between min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                              <Palette className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                                {isHindi ? 'ऐप थीम व स्टाइल' : 'Color Theme & Style'}
                              </span>
                              <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block leading-tight truncate">
                                {isHindi ? '10 प्रीमियम रंग संयोजन' : '10 institutional workspace palettes'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] text-[var(--theme-primary,#38BDF8)] shrink-0 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary,#38BDF8)]"></span>
                            {isHindi ? activeThemeObj.hindiName : activeThemeObj.name}
                          </span>
                        </div>

                        {/* Elegant 2-column list of theme choices */}
                        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
                          {THEME_OPTIONS.map((t) => {
                            const isSelected = theme === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  triggerHapticSound('click');
                                  onThemeChange(t.id);
                                }}
                                className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[var(--theme-card,#132438)] border-[var(--theme-primary,#38BDF8)] shadow-xs ring-1 ring-[var(--theme-primary,#38BDF8)]/40'
                                    : 'bg-[var(--theme-bg,#070E18)]/70 border-[var(--theme-border,#213E61)]/70 hover:border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)]/50'
                                }`}
                              >
                                {/* Dual-tone swatch dot */}
                                <div
                                  className="w-5 h-5 rounded-lg shrink-0 flex items-center justify-center border shadow-xs"
                                  style={{ backgroundColor: t.bgHex, borderColor: t.primaryHex }}
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: t.primaryHex }}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="text-[11px] font-bold text-[var(--theme-text,#F8FAFC)] truncate leading-tight">
                                    {isHindi ? t.hindiName : t.name}
                                  </div>
                                  <div className="text-[9px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-mono">
                                    {t.mode}
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="w-4 h-4 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* App Settings */}
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onOpenSettings)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer text-left group"
                    id="menu-settings-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 group-hover:scale-105 transition-transform">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.appSettings || (isHindi ? 'ऐप सेटिंग्स' : 'App Settings')}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? '6-फंड %, मुद्रा, भाषा, बैकअप व ऑडियो साउंड' : 'Fund %, currency, sound, backup & export'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors" />
                  </button>

                  {/* Security PIN Lock */}
                  {onOpenSecurity && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenSecurity)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/50 transition-all cursor-pointer text-left group"
                      id="menu-security-pin-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {tr.menu.securityPinLock || (isHindi ? 'सुरक्षा पिन लॉक' : 'Security PIN & Lock')}
                            </span>
                            {isLockEnabled ? (
                              <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {isHindi ? 'सक्रिय' : 'ACTIVE'}
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-400 border border-slate-500/30">
                                {isHindi ? 'बंद' : 'OFF'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? '4-अंकों के गुप्त पिन कोड से डेटा सुरक्षित करें' : '4-digit offline PIN code security'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  )}

                  {/* Master Edit Hub */}
                  {onOpenMasterEdit && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenMasterEdit)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-indigo-500/50 transition-all cursor-pointer text-left group"
                      id="menu-master-edit-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Database className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'मास्टर डेटा व श्रेणियां' : 'Master Data & Categories'}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'श्रेणियां, आय स्रोत और कस्टम टैग बदलें' : 'Manage categories, income sources & tags'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  )}

                  {/* Help & Support Centre */}
                  {(onOpenSupport || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenSupport) handleMenuAction(() => onOpenSupport('help'));
                        else if (onSelectTab) handleMenuAction(() => onSelectTab('support'));
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-teal-500/30 hover:border-teal-400/60 transition-all cursor-pointer text-left group"
                      id="menu-settings-support-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'सहायता केंद्र व फीडबैक' : 'Help & Support Centre'}
                            </span>
                            <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                              HELP
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'समस्या रिपोर्ट, फीचर सुझाव व 24x7 सहायता' : 'Report bugs, feature ideas & instant assistance'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-teal-400 transition-colors" />
                    </button>
                  )}

                  {/* Recycle Bin / Trash */}
                  {onOpenTrash && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenTrash)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-rose-500/50 transition-all cursor-pointer text-left group"
                      id="menu-trash-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Trash2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'रीसायकल बिन / ट्रैश' : 'Recycle Bin & Recovery'}
                            </span>
                            {trashCount > 0 && (
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                                {trashCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'हटाए गए लेन-देन देखें व रीस्टोर करें' : 'View, restore or empty deleted records'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-rose-400 transition-colors" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. Category 2: मुख्य लेजर व खाते (Core Ledger & Passbook - 4 items) */}
          {(menuFilter === 'all' || menuFilter === 'ledger') && (
            <div className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 p-2.5 sm:p-3 space-y-2">
              <div
                onClick={() => menuFilter === 'all' && toggleSection('ledger')}
                className={`flex items-center justify-between gap-2 px-1 ${menuFilter === 'all' ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)]">
                    {isHindi ? '2. मुख्य लेजर व खाते' : '2. Core Ledger & Passbook'}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/25">
                    4 ITEMS
                  </span>
                </div>
                {menuFilter === 'all' && (
                  <button type="button" className="text-[var(--theme-text-dim,#94A3B8)] hover:text-white">
                    {collapsedSections['ledger'] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!collapsedSections['ledger'] && (
                <div className="space-y-1 pt-0.5">
                  {[
                    { id: 'home', label: tr.menu.khata || (isHindi ? 'दैनिक खाता (Dashboard)' : 'Daily Khata Dashboard'), desc: isHindi ? 'डैशबोर्ड, 6-फंड सारांश व बैलेंस' : 'Dashboard & 6-Fund Rule Split', icon: Home, color: 'text-[var(--theme-primary,#38BDF8)]' },
                    { id: 'history', label: tr.menu.record || (isHindi ? 'लेन-देन पासबुक' : 'Passbook & Records'), desc: isHindi ? 'सभी प्रविष्टियां, फ़िल्टर व खोज' : 'All transaction records, search & print', icon: History, color: 'text-indigo-400' },
                    { id: 'add', label: isHindi ? 'नया लेन-देन जोड़ें' : 'Add New Transaction', desc: isHindi ? 'आय या खर्च की नई प्रविष्टि दर्ज करें' : 'Record new income or expense entry', icon: PlusCircle, color: 'text-emerald-400' },
                    { id: 'report', label: tr.menu.analytics || (isHindi ? 'मासिक रिपोर्ट व विश्लेषण' : 'Monthly Analytics'), desc: isHindi ? 'खर्च पाई-चार्ट, रुझान व पीडीएफ रिपोर्ट' : 'Expense charts, fund analytics & PDF', icon: BarChart3, color: 'text-sky-400' }
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
                        className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                          isActive
                            ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                            : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[12.5px] font-bold block truncate ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text,#F8FAFC)]'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">{item.desc}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[var(--theme-text-dim,#64748B)] group-hover:text-white'}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. Category 3: ऋण, लक्ष्य व बजट (Loans, Goals & Budgets - 3 items) */}
          {(menuFilter === 'all' || menuFilter === 'finance') && (
            <div className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 p-2.5 sm:p-3 space-y-2">
              <div
                onClick={() => menuFilter === 'all' && toggleSection('finance')}
                className={`flex items-center justify-between gap-2 px-1 ${menuFilter === 'all' ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    {isHindi ? '3. ऋण, लक्ष्य व बजट' : '3. Loans, Goals & Budgets'}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    3 ITEMS
                  </span>
                </div>
                {menuFilter === 'all' && (
                  <button type="button" className="text-[var(--theme-text-dim,#94A3B8)] hover:text-white">
                    {collapsedSections['finance'] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!collapsedSections['finance'] && (
                <div className="space-y-1 pt-0.5">
                  {/* Loans, EMIs & Udhar */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenLoans) {
                        handleMenuAction(onOpenLoans);
                      } else if (onSelectTab) {
                        handleMenuAction(() => onSelectTab('loans'));
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'loans'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Landmark className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {isHindi ? 'ऋण, किश्त व उधार खाता' : 'Loans, EMIs & Udhar'}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'उधार लेना/देना व बैंक किश्त' : 'Track money lent, borrowed & monthly EMIs'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-amber-400 transition-colors" />
                  </button>

                  {/* Savings Goals */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('goals'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'goals'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.goals || (isHindi ? 'बचत लक्ष्य व टारगेट्स' : 'Savings Goals')}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'आपातकालीन फंड व जमा प्रगति' : 'Savings targets, progress & deposits'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-emerald-400 transition-colors" />
                  </button>

                  {/* Category Budgets & Limits */}
                  {onOpenBudgetManager && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenBudgetManager)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-sky-500/40 transition-all cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Sliders className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'मासिक बजट व खर्च सीमा' : 'Category Budgets & Limits'}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'खर्च सीमा तय करें और ओवर-स्पेंडिंग रोकें' : 'Set category limits & prevent over-spending'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-sky-400 transition-colors" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. Category 4: कार्य व दैनिक आदतें (Productivity & Work - 4 items) */}
          {(menuFilter === 'all' || menuFilter === 'work') && (
            <div className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 p-2.5 sm:p-3 space-y-2">
              <div
                onClick={() => menuFilter === 'all' && toggleSection('work')}
                className={`flex items-center justify-between gap-2 px-1 ${menuFilter === 'all' ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400">
                    {isHindi ? '4. कार्य व दैनिक आदतें' : '4. Work & Daily Habits'}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-500/15 text-teal-400 border border-teal-500/25">
                    4 ITEMS
                  </span>
                </div>
                {menuFilter === 'all' && (
                  <button type="button" className="text-[var(--theme-text-dim,#94A3B8)] hover:text-white">
                    {collapsedSections['work'] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!collapsedSections['work'] && (
                <div className="space-y-1 pt-0.5">
                  {/* Attendance Register */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('attendance'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'attendance'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-teal-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
                        <CalendarCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {isHindi ? 'उपस्थिति रजिस्टर' : 'Attendance Register'}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'ड्यूटी घंटे, क्लॉक इन/आउट व वेतन गणना' : 'Duty hours, clock-in & salary calculation'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-teal-400 transition-colors" />
                  </button>

                  {/* Work & Projects */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('tracker'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'tracker'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.workAndLife || (isHindi ? 'कार्य व प्रोजेक्ट ट्रैकर' : 'Work & Projects')}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'क्लाइंट प्रोजेक्ट्स, डिलीवरेबल्स व आय' : 'Client deliverables & revenue'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-rose-400 transition-colors" />
                  </button>

                  {/* Notes & Habits */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('notes'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'notes'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-violet-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.personalNotes || (isHindi ? 'निजी नोट्स व आदतें' : 'Personal Notes & Routine')}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'दैनिक रूटीन, आदतें व सुरक्षित नोट्स' : 'Daily routines, habits & secure thoughts'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-violet-400 transition-colors" />
                  </button>

                  {/* Scheduled Reminders */}
                  {onOpenReminders && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenReminders)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-yellow-500/40 transition-all cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'बिल व भुगतान रिमाइंडर' : 'Scheduled Reminders'}
                            </span>
                            {remindersCount > 0 && (
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-yellow-400 text-slate-900 animate-pulse">
                                {remindersCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'आवर्ती बिल, SIP व देय तारीख अलर्ट्स' : 'Recurring bills, loan & SIP due alerts'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-yellow-400 transition-colors" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. Category 5: वित्तीय कैलकुलेटर सूट (Financial Calculators - 2 items) */}
          {(menuFilter === 'all' || menuFilter === 'tools') && (
            <div className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 p-2.5 sm:p-3 space-y-2">
              <div
                onClick={() => menuFilter === 'all' && toggleSection('tools')}
                className={`flex items-center justify-between gap-2 px-1 ${menuFilter === 'all' ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                    {isHindi ? '5. वित्तीय कैलकुलेटर' : '5. Financial Calculators'}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 border border-purple-500/25">
                    2 TOOLS
                  </span>
                </div>
                {menuFilter === 'all' && (
                  <button type="button" className="text-[var(--theme-text-dim,#94A3B8)] hover:text-white">
                    {collapsedSections['tools'] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!collapsedSections['tools'] && (
                <div className="space-y-1 pt-0.5">
                  {/* Financial Calculators */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('calculator'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'calculator'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Calculator className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tr.menu.calculator || (isHindi ? 'वित्तीय कैलकुलेटर सूट' : 'Financial Calculators Suite')}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'SIP, EMI, GST, FD, RD व मुद्रास्फीति' : 'SIP, EMI, GST, FD, RD & inflation calculators'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-purple-400 transition-colors" />
                  </button>

                  {/* Split Bill */}
                  {onOpenSplitBill && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenSplitBill)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-purple-500/40 transition-all cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Split className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'बिल विभाजन / स्प्लिट' : 'Split Bill & Group Share'}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'दोस्तों व परिवार के साथ बराबर खर्च बांटें' : 'Divide dinners, room & trip expenses'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-purple-400 transition-colors" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 6. Category 6: गाइड, अकादमी व सहायता केंद्र (Wealth Academy & Help Centre - 5 items) */}
          {(menuFilter === 'all' || menuFilter === 'info') && (
            <div className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 p-2.5 sm:p-3 space-y-2">
              <div
                onClick={() => menuFilter === 'all' && toggleSection('info')}
                className={`flex items-center justify-between gap-2 px-1 ${menuFilter === 'all' ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pink-400">
                    {isHindi ? '6. गाइड, अकादमी व सहायता केंद्र' : '6. Wealth Academy & Help Centre'}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-pink-500/15 text-pink-400 border border-pink-500/25">
                    5 ITEMS
                  </span>
                </div>
                {menuFilter === 'all' && (
                  <button type="button" className="text-[var(--theme-text-dim,#94A3B8)] hover:text-white">
                    {collapsedSections['info'] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!collapsedSections['info'] && (
                <div className="space-y-1 pt-0.5">
                  {/* Commercial News & Research Portal */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('news'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'news'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-sky-500/40'
                    }`}
                    id="menu-news-portal-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Newspaper className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'वाणिज्यिक समाचार व रिसर्च' : 'News & Research Portal'}
                          </span>
                          <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-400/20 text-sky-400 border border-sky-400/30">
                            LIVE
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? 'मार्केट, अर्थशास्त्र, फिनटेक, टैक्स व उद्योग रिपोर्ट' : 'Global markets, macro, fintech, policy & industry reports'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-sky-400 transition-colors" />
                  </button>

                  {/* Wealth Academy */}
                  <button
                    type="button"
                    onClick={() => onSelectTab && handleMenuAction(() => onSelectTab('academy'))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                      currentTab === 'academy' || currentTab === 'article'
                        ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-amber-500/40'
                    }`}
                    id="menu-academy-btn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'वेल्थ अकादमी' : 'Wealth Academy'}
                          </span>
                          <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                            40+ GUIDES
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                          {isHindi ? '40+ वित्तीय लेख, 6-फंड नियम व धन प्रबंधन' : '40+ money management principles & wealth guides'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-amber-400 transition-colors" />
                  </button>

                  {/* Help & Support Centre */}
                  {(onOpenSupport || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenSupport) handleMenuAction(() => onOpenSupport('help'));
                        else if (onSelectTab) handleMenuAction(() => onSelectTab('support'));
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'support'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-teal-500/30 hover:border-teal-400/60'
                      }`}
                      id="menu-support-centre-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                              {isHindi ? 'सहायता केंद्र व फीडबैक' : 'Help & Support Centre'}
                            </span>
                            <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                              HELP DESK
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'समस्या रिपोर्ट, फीचर सुझाव, टिकट व 24x7 सहायता' : 'Report bugs, feature requests & contact support'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-teal-400 transition-colors" />
                    </button>
                  )}

                  {/* User Guide & Manual */}
                  {(onOpenManual || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenManual) handleMenuAction(onOpenManual);
                        else if (onSelectTab) handleMenuAction(() => onSelectTab('guide'));
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/40 transition-all cursor-pointer text-left group"
                      id="menu-guide-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {tr.menu.userManualGuide || (isHindi ? 'यूजर मैनुअल व मार्गदर्शिका' : 'User Manual & Guides')}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? 'सभी फीचर्स की गाइड, शॉर्टकट व निर्देश' : 'Step-by-step feature walkthroughs & shortcuts'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  )}

                  {/* About Daily Khata Pro */}
                  {(onOpenAbout || onSelectTab) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAbout) handleMenuAction(onOpenAbout);
                        else if (onSelectTab) handleMenuAction(() => onSelectTab('about'));
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'about'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-pink-500/40'
                      }`}
                      id="menu-about-page-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'ऐप के बारे में (About App)' : 'About Daily Khata Pro'}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            {isHindi ? `मिशन, 6-फंड फॉर्मूला व v${APP_VERSION}` : `Mission, architecture & v${APP_VERSION}`}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-pink-400 transition-colors" />
                    </button>
                  )}

                  {/* Developer Profile */}
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => handleMenuAction(() => onSelectTab('developer'))}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left group ${
                        currentTab === 'developer'
                          ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-cyan-500/40'
                      }`}
                      id="menu-developer-page-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                            {isHindi ? 'डेवलपर प्रोफाइल' : 'Developer Profile'}
                          </span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate block">
                            MD Zafeer Hasan (YAZDAAN)
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] shrink-0 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  )}

                  {/* Compact 4 Legal Policies */}
                  <div className="pt-1 grid grid-cols-2 gap-1.5">
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
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer truncate ${
                            isActive
                              ? 'bg-[var(--theme-primary,#38BDF8)]/15 border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                              : 'bg-[var(--theme-surface,#0E1A29)]/60 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]/50 text-[var(--theme-text-muted,#94A3B8)] hover:text-white'
                          }`}
                        >
                          <PolicyIcon className={`w-3 h-3 shrink-0 ${policy.color}`} />
                          <span className="truncate">{policy.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* App Distribution & Share Utilities */}
          {(onOpenInstall || onOpenShare) && (
            <div className="pt-1 flex items-center gap-2">
              {onOpenInstall && (
                <button
                  type="button"
                  onClick={() => handleMenuAction(onOpenInstall)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] text-[11.5px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[11.5px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
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
  );
};
