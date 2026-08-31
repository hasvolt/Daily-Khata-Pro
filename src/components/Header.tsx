import React, { useState } from 'react';
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
  HelpCircle
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

  const currentThemeConfig = themeOptions.find((t) => t.id === theme) || themeOptions[0];
  const currentLangConfig = languageOptions.find((l) => l.id === language) || languageOptions[0];

  const closeAllMenus = () => {
    setIsThemeMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  return (
    <header className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md sticky top-0 z-30 shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <div
            onClick={() => onSelectTab && onSelectTab('home')}
            className="cursor-pointer active:scale-95 transition-transform shrink-0"
          >
            <HasVoltLogo size={36} />
          </div>

          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                onClick={() => onSelectTab && onSelectTab('home')}
                className="font-serif-display font-bold text-[17px] sm:text-[20px] tracking-tight cursor-pointer transition-colors truncate"
              >
                <span className="text-[#FFFFFF]">Daily</span>
                <span className="ml-1" style={{ color: 'var(--theme-primary, #38BDF8)' }}>Khata</span>
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
            <div className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] hidden xs:flex items-center gap-1 font-medium truncate">
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
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)]'
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
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
                className="w-full bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-card,#132438)] focus:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[12px] rounded-xl pl-8 pr-7 py-1.5 transition-all outline-none shadow-xs"
                style={{
                  borderColor: searchQuery ? 'var(--theme-primary, #38BDF8)' : undefined
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Privacy Eye Toggle */}
          {onTogglePrivacyMask && (
            <button
              type="button"
              onClick={onTogglePrivacyMask}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                privacyMask
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
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
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[#EF4444]/15 hover:border-[#EF4444]/50 text-[#CBD5E1] hover:text-[#EF4444] transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center gap-1 shrink-0"
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
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                isLightMode
                  ? 'bg-[#0284C7]/15 border-[#0284C7]/40 text-[#0284C7] hover:bg-[#0284C7]/25'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
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
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center gap-1.5 shrink-0"
              title={isHindi ? 'मल्टीपर्पस कैलकुलेटर' : 'Multi-Purpose Calculator'}
              id="header-calculator-btn"
            >
              <Calculator className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline font-semibold">
                {isHindi ? 'कैलकुलेटर' : 'Calculator'}
              </span>
            </button>
          )}

          {/* Main Three-Dot Menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMoreMenuOpen(!isMoreMenuOpen);
                setIsThemeMenuOpen(false);
                setIsLangMenuOpen(false);
              }}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
                isMoreMenuOpen
                  ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)]/60'
              }`}
              title={isHindi ? 'मेनू एवं सेटिंग्स' : 'Menu & Settings'}
              aria-label="Main Menu"
              id="header-main-menu-btn"
            >
              <MoreVertical className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="text-[11px] font-bold">
                {isHindi ? 'मेनू' : 'Menu'}
              </span>
            </button>

            {/* Clean, Simple Dropdown Menu */}
            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
                  
                  {/* Settings */}
                  {onOpenSettings && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSettings();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        <span>{isHindi ? 'ऐप सेटिंग्स' : 'App Settings'}</span>
                      </div>
                      <span className="text-[9.5px] text-[#94A3B8]">Rules &amp; %</span>
                    </button>
                  )}

                  {/* Calculator Suite */}
                  {onOpenSimulator && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSimulator();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#F59E0B] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calculator className="w-4 h-4 text-[#F59E0B] shrink-0" />
                        <span>{isHindi ? 'कैलकुलेटर सूट' : 'Calculator Suite'}</span>
                      </div>
                      <span className="text-[9.5px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">PRO</span>
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
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer text-left"
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
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{isHindi ? 'सुरक्षा पिन लॉक' : 'Security PIN Lock'}</span>
                      </div>
                      {isLockEnabled && (
                        <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded">
                          ON
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer text-left"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span>{t.header.manual}</span>
                  </button>

                  {/* Help Centre */}
                  {onOpenSupport && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSupport('help');
                        closeAllMenus();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <LifeBuoy className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                        <span>{isHindi ? 'सहायता केंद्र' : 'Help Centre & FAQ'}</span>
                      </div>
                      <span className="text-[9.5px] text-[#94A3B8]">Guide</span>
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
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#EF4444] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bug className="w-4 h-4 text-[#EF4444] shrink-0" />
                        <span>{isHindi ? 'बग रिपोर्ट करें' : 'Report a Bug'}</span>
                      </div>
                      <span className="text-[9.5px] font-medium text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">Fix</span>
                    </button>
                  )}

                  {/* Suggestion / Feature Request */}
                  {onOpenSupport && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSupport('suggestion');
                        closeAllMenus();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#F59E0B] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0" />
                        <span>{isHindi ? 'सुझाव दें' : 'Give Suggestion'}</span>
                      </div>
                      <span className="text-[9.5px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">Idea</span>
                    </button>
                  )}

                  {/* Simple Clean Divider */}
                  <div className="my-1.5 border-t border-[var(--theme-border,#213E61)]/70" />

                  {/* Themes Palette */}
                  {onThemeChange && (
                    <div className="px-3 py-1.5">
                      <div className="text-[10px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wider">
                        {isHindi ? 'रंग थीम' : 'Theme Color'}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {themeOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onThemeChange(opt.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                              theme === opt.id ? 'ring-2 ring-[var(--theme-primary,#38BDF8)] scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                            }`}
                            title={opt.label}
                          >
                            <span className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: opt.dotColor }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Language Selector */}
                  {onLanguageChange && (
                    <div className="px-3 py-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                        {isHindi ? 'भाषा' : 'Language'}
                      </span>
                      <div className="flex gap-1">
                        {languageOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onLanguageChange(opt.id)}
                            className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-colors cursor-pointer ${
                              language === opt.id
                                ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                                : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-[var(--theme-card,#132438)]'
                            }`}
                          >
                            {opt.short}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Simple Clean Divider */}
                  <div className="my-1.5 border-t border-[var(--theme-border,#213E61)]/70" />

                  {/* Developer Profile */}
                  {onOpenDeveloper && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenDeveloper();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#F8FAFC] transition-colors cursor-pointer text-left"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--theme-primary,#38BDF8)] shrink-0 bg-[#070E18]">
                        <img
                          src="/md-zafeer-hasan-yazdaan.jpg"
                          alt="MD Zafeer Hasan"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="truncate">MD Zafeer Hasan</span>
                    </button>
                  )}

                  {/* Source Code / Safety */}
                  {onOpenSourceCode && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSourceCode();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] transition-colors cursor-pointer text-left"
                    >
                      <Code2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{isHindi ? 'सुरक्षा एवं कोड' : 'Safety & Code'}</span>
                    </button>
                  )}

                  {/* Share Link */}
                  {onOpenShare && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenShare();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer text-left"
                    >
                      <Share2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <span>{isHindi ? 'ऐप शेयर करें' : 'Share App'}</span>
                    </button>
                  )}

                  {/* Install PWA */}
                  {onOpenInstall && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenInstall();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#10B981] hover:bg-[var(--theme-card,#132438)] hover:text-[#34D399] transition-colors cursor-pointer text-left"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
                    </button>
                  )}

                  {/* GitHub Repo Link */}
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11.5px] font-medium text-[#94A3B8] hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderGit2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>GitHub</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


