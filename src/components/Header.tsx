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
  Sparkles
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { HasVoltLogo } from './HasVoltLogo';
import { AppTheme, AppLanguage, AppViewMode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenManual: () => void;
  onOpenSupport?: (tab?: 'help' | 'bug' | 'suggestion') => void;
  onOpenNotes?: () => void;
  onOpenSimulator?: () => void;
  onOpenSourceCode?: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenDeveloper?: () => void;
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
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  onSelectTab,
  onOpenSettings,
  onOpenManual,
  onOpenSupport,
  onOpenNotes,
  onOpenSimulator,
  onOpenSourceCode,
  onOpenInstall,
  onOpenShare,
  onOpenDeveloper,
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
  onViewModeChange
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
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
    { id: 'blue', label: 'Electric Blue (Dark)', dotColor: '#38BDF8', bgClass: 'bg-[#38BDF8]', textClass: 'text-[#38BDF8]' },
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
    { id: 'hinglish', label: 'Hinglish', short: 'HIN', native: 'Hinglish' }
  ];

  const closeAllMenus = () => {
    setIsThemeMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  return (
    <header className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md sticky top-0 z-30 shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Icon & Name (Refined, 20% compact on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
          <div
            onClick={() => onSelectTab && onSelectTab('home')}
            className="cursor-pointer active:scale-95 transition-transform shrink-0"
          >
            <div className="sm:hidden">
              <HasVoltLogo size={28} />
            </div>
            <div className="hidden sm:block">
              <HasVoltLogo size={36} />
            </div>
          </div>

          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span
                onClick={() => onSelectTab && onSelectTab('home')}
                className="font-serif-display font-bold text-[15px] sm:text-[20px] tracking-tight cursor-pointer transition-colors truncate"
              >
                <span className="text-[#FFFFFF]">Daily</span>
                <span className="ml-0.5 sm:ml-1" style={{ color: 'var(--theme-primary, #38BDF8)' }}>Khata</span>
                <span className="text-[#F8FAFC]">: Pro</span>
              </span>
              <span
                className="hidden md:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border transition-colors"
                style={{
                  backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.15))',
                  color: 'var(--theme-primary, #38BDF8)',
                  borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.35))'
                }}
              >
                OFFICIAL
              </span>
            </div>
            <div className="text-[9px] sm:text-[11.5px] text-[#94A3B8] hidden xs:flex items-center gap-1 font-medium truncate">
              <span
                className="font-bold truncate transition-colors"
                style={{ color: 'var(--theme-primary, #38BDF8)' }}
              >
                {isHindi ? 'दैनिक आय-व्यय ट्रैकर' : 'Daily Income & Expense'}
              </span>
              <span className="text-[#475569] mx-0.5 hidden sm:inline">•</span>
              <span className="text-[#94A3B8] hidden sm:inline truncate">6-Fund Ledger</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links for SaaS Desktop Experience */}
        {onSelectTab && (
          <nav className="hidden lg:flex items-center gap-1 mx-1.5">
            {[
              { id: 'home' as NavTab, label: isHindi ? 'खाता' : 'Khata', icon: Home },
              { id: 'history' as NavTab, label: isHindi ? 'लेज़र' : 'Ledger', icon: History },
              { id: 'goals' as NavTab, label: isHindi ? 'लक्ष्य' : 'Goals', icon: Target },
              { id: 'tracker' as NavTab, label: isHindi ? 'ड्यूटी/लाइफ' : 'Work & Life', icon: Briefcase },
              { id: 'notes' as NavTab, label: isHindi ? 'वॉल्ट' : 'Notes', icon: FileText },
              { id: 'report' as NavTab, label: isHindi ? 'रिपोर्ट्स' : 'Analytics', icon: BarChart3 },
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

        {/* Desktop Mode Search Bar */}
        {onSearchChange && (
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)] pointer-events-none" />
              <input
                id="header-desktop-search"
                type="text"
                placeholder={t.header.searchPlaceholder}
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
        )}

        {/* Right Action Buttons (Compact, Refined & Touch-Friendly) */}
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
                {privacyMask ? (isHindi ? 'छिपा हुआ' : 'Hidden') : (isHindi ? 'छुपाएं' : 'Mask')}
              </span>
            </button>
          )}

          {/* Quick Lock Button (Visible when PIN protection is active) */}
          {isLockEnabled && onLockNow && (
            <button
              type="button"
              onClick={onLockNow}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[#EF4444]/15 hover:border-[#EF4444]/50 text-[var(--theme-text-muted,#94A3B8)] hover:text-[#EF4444] transition-all cursor-pointer shadow-xs active:scale-95 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shrink-0"
              title={isHindi ? 'अभी ऐप लॉक करें' : 'Lock App Vault Now'}
              id="header-lock-now-btn"
            >
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden xl:inline">
                {isHindi ? 'लॉक' : 'Lock'}
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
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                isLightMode
                  ? 'bg-[#0284C7]/15 border-[#0284C7]/40 text-[#0284C7] hover:bg-[#0284C7]/25'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
              title={isLightMode ? (isHindi ? 'नाइट मोड' : 'Switch to Night Mode') : (isHindi ? 'डे मोड' : 'Switch to Day Mode')}
              id="header-theme-toggle-btn"
            >
              {isLightMode ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isLightMode ? (isHindi ? 'नाइट' : 'Night') : (isHindi ? 'डे' : 'Day')}
              </span>
            </button>
          )}

          {/* Header Quick Calculator Button */}
          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 shrink-0"
              title={isHindi ? 'मल्टीपर्पस कैलकुलेटर' : 'Multi-Purpose Calculator'}
              id="header-calculator-btn"
            >
              <Calculator className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline font-semibold">
                {isHindi ? 'कैलकुलेटर' : 'Calculator'}
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
              className={`min-h-[32px] sm:min-h-[36px] p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[10.5px] sm:text-[11px] font-bold flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                isMoreMenuOpen
                  ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] ring-2 ring-[var(--theme-primary,#38BDF8)]/40'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)]/60'
              }`}
              title={isHindi ? 'मेनू एवं सेटिंग्स' : 'Menu & Settings'}
              aria-label="Main Menu"
              id="header-main-menu-btn"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="font-bold">
                {isHindi ? 'मेनू' : 'Menu'}
              </span>
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
                          <div className="flex items-center gap-2">
                            <HasVoltLogo size={24} />
                            <div>
                              <div className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)]">
                                Daily <span style={{ color: 'var(--theme-primary, #38BDF8)' }}>Khata</span> Pro
                              </div>
                              <div className="text-[9.5px] text-[var(--theme-text-muted,#94A3B8)] font-medium">
                                {isHindi ? 'मुख्य मेनू व सेटिंग्स' : 'Main Menu & Tools'}
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
                              {isHindi ? 'सुविधाएं व उपकरण' : 'Features & Tools'}
                            </div>

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
                                  <span>{isHindi ? 'ऐप सेटिंग्स' : 'App Settings'}</span>
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
                                  <span>{isHindi ? 'कैलकुलेटर' : 'Calculator'}</span>
                                </div>
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
                                <span>{isHindi ? 'पर्सनल नोट्स' : 'Personal Notes'}</span>
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
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Lock className="w-4 h-4 text-[#10B981] shrink-0" />
                                  <span>{isHindi ? 'सुरक्षा पिन लॉक' : 'Security PIN Lock'}</span>
                                </div>
                                {isLockEnabled && (
                                  <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                                    Active
                                  </span>
                                )}
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
                              <span>{isHindi ? 'उपयोग निर्देशिका' : 'User Manual Guide'}</span>
                            </button>
                          </div>

                          {/* Category: Theme & Language */}
                          <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                            {/* Theme Colors */}
                            {onThemeChange && (
                              <div>
                                <div className="text-[9.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1.5 uppercase tracking-wider">
                                  {isHindi ? 'रंग थीम (Theme)' : 'Theme Color'}
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {themeOptions.map((opt) => (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => onThemeChange(opt.id)}
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

                            {/* Language Switcher */}
                            {onLanguageChange && (
                              <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[var(--theme-text-muted,#94A3B8)] uppercase tracking-wider">
                                  {isHindi ? 'भाषा' : 'Language'}
                                </span>
                                <div className="flex gap-1">
                                  {languageOptions.map((opt) => (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => onLanguageChange(opt.id)}
                                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                        language === opt.id
                                          ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold'
                                          : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-surface,#0E1A29)]'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Category: Support & Safety */}
                          <div className="space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                              {isHindi ? 'सहायता व सुरक्षा' : 'Support & Safety'}
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
                                  <span>{isHindi ? 'सहायता केंद्र एवं FAQ' : 'Help Centre & FAQ'}</span>
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
                                  <span>{isHindi ? 'समस्या रिपोर्ट करें' : 'Report an Issue'}</span>
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
                                  <span>{isHindi ? 'सुझाव एवं फीडबैक' : 'Feedback & Suggestions'}</span>
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
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                              >
                                <Code2 className="w-4 h-4 text-[#10B981] shrink-0" />
                                <span>{isHindi ? 'सुरक्षा एवं सोर्स कोड' : 'Safety & Source Code'}</span>
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
                                <span>{isHindi ? 'ऐप शेयर करें' : 'Share App'}</span>
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
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#10B981] bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 transition-colors cursor-pointer text-left"
                              >
                                <Download className="w-4 h-4 shrink-0" />
                                <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex items-center justify-between gap-2 shrink-0">
                          {onOpenDeveloper && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenDeveloper();
                                closeAllMenus();
                              }}
                              className="flex items-center gap-2 text-[11.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] cursor-pointer"
                            >
                              <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--theme-primary,#38BDF8)] shrink-0 bg-[#070E18]">
                                <img
                                  src="/md-zafeer-hasan-yazdaan.jpg"
                                  alt="Developer Profile"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <span>{isHindi ? 'डेवलपर प्रोफाइल' : 'Developer Profile'}</span>
                            </button>
                          )}

                          <a
                            href="https://github.com/hasvolt/Daily-Khata-Pro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[#10B981] border border-[var(--theme-border,#213E61)] text-[11px] font-semibold transition-colors"
                            title="GitHub Profile"
                          >
                            <FolderGit2 className="w-3.5 h-3.5" />
                            <span>{isHindi ? 'गिटहब प्रोफाइल' : 'GitHub Profile'}</span>
                          </a>
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
                      {isHindi ? 'सुविधाएं व उपकरण' : 'Features & Tools'}
                    </div>

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
                          <span>{isHindi ? 'ऐप सेटिंग्स' : 'App Settings'}</span>
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
                          <span>{isHindi ? 'कैलकुलेटर' : 'Calculator'}</span>
                        </div>
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
                        <span>{isHindi ? 'पर्सनल नोट्स' : 'Personal Notes'}</span>
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
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-4 h-4 text-[#10B981] shrink-0" />
                          <span>{isHindi ? 'सुरक्षा पिन लॉक' : 'Security PIN Lock'}</span>
                        </div>
                        {isLockEnabled && (
                          <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
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
                      <span>{isHindi ? 'उपयोग निर्देशिका' : 'User Manual Guide'}</span>
                    </button>
                  </div>

                  {/* Category: Theme & Language */}
                  <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                    {/* Theme Colors */}
                    {onThemeChange && (
                      <div>
                        <div className="text-[9.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1.5 uppercase tracking-wider">
                          {isHindi ? 'रंग थीम (Theme)' : 'Theme Color'}
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {themeOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onThemeChange(opt.id)}
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

                    {/* Language Switcher */}
                    {onLanguageChange && (
                      <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[var(--theme-text-muted,#94A3B8)] uppercase tracking-wider">
                          {isHindi ? 'भाषा' : 'Language'}
                        </span>
                        <div className="flex gap-1">
                          {languageOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onLanguageChange(opt.id)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                language === opt.id
                                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold'
                                  : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-surface,#0E1A29)]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category: Support & Safety */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#64748B)] px-2 mb-1">
                      {isHindi ? 'सहायता व सुरक्षा' : 'Support & Safety'}
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
                          <span>{isHindi ? 'सहायता केंद्र एवं FAQ' : 'Help Centre & FAQ'}</span>
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
                          <span>{isHindi ? 'समस्या रिपोर्ट करें' : 'Report an Issue'}</span>
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
                          <span>{isHindi ? 'सुझाव एवं फीडबैक' : 'Feedback & Suggestions'}</span>
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
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)]/60 hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] border border-[var(--theme-border,#213E61)]/40 transition-colors cursor-pointer text-left"
                      >
                        <Code2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{isHindi ? 'सुरक्षा एवं सोर्स कोड' : 'Safety & Source Code'}</span>
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
                        <span>{isHindi ? 'ऐप शेयर करें' : 'Share App'}</span>
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
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#10B981] bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 transition-colors cursor-pointer text-left"
                      >
                        <Download className="w-4 h-4 shrink-0" />
                        <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
                      </button>
                    )}
                  </div>

                  {/* Divider & Developer Footer */}
                  <div className="pt-2.5 border-t border-[var(--theme-border,#213E61)]/70 flex items-center justify-between gap-2">
                    {onOpenDeveloper && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenDeveloper();
                          closeAllMenus();
                        }}
                        className="flex items-center gap-2 text-[11.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--theme-primary,#38BDF8)] shrink-0 bg-[#070E18]">
                          <img
                            src="/md-zafeer-hasan-yazdaan.jpg"
                            alt="Developer Profile"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="truncate">{isHindi ? 'डेवलपर प्रोफाइल' : 'Developer Profile'}</span>
                      </button>
                    )}

                    <a
                      href="https://github.com/hasvolt/Daily-Khata-Pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[#10B981] border border-[var(--theme-border,#213E61)] text-[11px] font-semibold transition-colors"
                      title="GitHub Profile"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'गिटहब प्रोफाइल' : 'GitHub Profile'}</span>
                    </a>
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


