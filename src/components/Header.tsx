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
  FileText
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { HasVoltLogo } from './HasVoltLogo';
import { AppTheme, AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenManual: () => void;
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
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  onSelectTab,
  onOpenSettings,
  onOpenManual,
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
  onTogglePrivacyMask
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
              title={isHindi ? 'मल्टीपर्पस कैलकुलेटर (Standard, 6-Fund, SIP, EMI, GST)' : 'Multi-Purpose Calculator (Standard, 6-Fund, SIP, EMI, GST)'}
              id="header-calculator-btn"
            >
              <Calculator className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline font-semibold">
                {isHindi ? 'कैलकुलेटर' : 'Calculator'}
              </span>
            </button>
          )}

          {/* More Actions & Links Menu (Consolidates Calculator, Manual, Developer, Source Code, Share, GitHub) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMoreMenuOpen(!isMoreMenuOpen);
                setIsThemeMenuOpen(false);
                setIsLangMenuOpen(false);
              }}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                isMoreMenuOpen
                  ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)]/50'
              }`}
              title="More Features, Manual & Links"
              aria-label="More Features"
              id="header-more-menu-btn"
            >
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="hidden md:inline font-medium">{isHindi ? 'अतिरिक्त' : 'More'}</span>
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] border-b border-[var(--theme-border,#213E61)]/60 pb-1.5 mb-1">
                    {isHindi ? 'रंग एवं भाषा' : 'Appearance & Language'}
                  </div>

                  {/* Themes Grid */}
                  {onThemeChange && (
                    <div className="px-2.5 py-2 border-b border-[var(--theme-border,#213E61)]/60 mb-1">
                      <div className="text-[10px] font-bold text-[#64748B] mb-2">{isHindi ? 'रंग थीम चुनें:' : 'Color Theme:'}</div>
                      <div className="grid grid-cols-4 gap-2">
                        {themeOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onThemeChange(opt.id)}
                            className={`flex justify-center items-center py-1.5 rounded-lg transition-all cursor-pointer border ${
                              theme === opt.id ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))]' : 'border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)]'
                            }`}
                            title={opt.label}
                          >
                            <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: opt.dotColor }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Language Selector */}
                  {onLanguageChange && (
                    <div className="px-2.5 py-2 border-b border-[var(--theme-border,#213E61)]/60 mb-1 flex gap-2">
                      {languageOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onLanguageChange(opt.id)}
                          className={`flex-1 text-center py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                            language === opt.id ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))]' : 'border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)]'
                          }`}
                        >
                          {opt.short}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] border-b border-[var(--theme-border,#213E61)]/60 pb-1.5 mb-1 mt-2">
                    {isHindi ? 'त्वरित लिंक एवं टूल्स' : 'Quick Links & Tools'}
                  </div>

                  {/* Developer Profile Option */}
                  {onOpenDeveloper && (
                    <button
                      onClick={() => {
                        onOpenDeveloper();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer text-left"
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
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">MD Zafeer Hasan</span>
                        <span className="text-[10px] text-[var(--theme-primary,#38BDF8)] font-mono font-medium">Developer &amp; Creator</span>
                      </div>
                    </button>
                  )}

                  {/* Personal Notes Vault Option */}
                  <button
                    onClick={() => {
                      if (onOpenNotes) onOpenNotes();
                      else if (onSelectTab) onSelectTab('notes');
                      closeAllMenus();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer text-left"
                  >
                    <FileText className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <div className="flex items-center justify-between flex-1">
                      <span>{isHindi ? 'पर्सनल नोट्स एवं डायरी' : 'Personal Notes & Vault'}</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]">
                        VAULT
                      </span>
                    </div>
                  </button>

                  {/* User Manual Guide Option */}
                  <button
                    onClick={() => {
                      onOpenManual();
                      closeAllMenus();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer text-left"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span>{t.header.manual} (Guide)</span>
                  </button>

                  {/* Security & App Passcode Lock */}
                  {onOpenSecurity && (
                    <button
                      onClick={() => {
                        onOpenSecurity();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] transition-all cursor-pointer text-left"
                    >
                      <Lock className="w-4 h-4 text-[#10B981] shrink-0" />
                      <div className="flex items-center justify-between flex-1">
                        <span>{isHindi ? 'सुरक्षा पिन एवं ऐप लॉक' : 'App Passcode Lock'}</span>
                        {isLockEnabled && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                            ON
                          </span>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Simulator / Calculator Option */}
                  {onOpenSimulator && (
                    <button
                      onClick={() => {
                        onOpenSimulator();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer text-left"
                    >
                      <Calculator className="w-4 h-4 text-[#F59E0B] shrink-0" />
                      <span>{isHindi ? 'वित्तीय कैलकुलेटर सूट' : 'Financial Calculators (Pro)'}</span>
                    </button>
                  )}

                  {/* Source Code & Trust Verification */}
                  {onOpenSourceCode && (
                    <button
                      onClick={() => {
                        onOpenSourceCode();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] transition-all cursor-pointer text-left"
                    >
                      <Code2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{isHindi ? 'ओपन सोर्स एवं सुरक्षा' : 'Source Code & Safety'}</span>
                    </button>
                  )}

                  {/* Share Page Link */}
                  {onOpenShare && (
                    <button
                      onClick={() => {
                        onOpenShare();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer text-left"
                    >
                      <Share2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <span>{isHindi ? 'ऐप शेयर करें' : 'Share App Link'}</span>
                    </button>
                  )}

                  {/* Install Option */}
                  {onOpenInstall && (
                    <button
                      onClick={() => {
                        onOpenInstall();
                        closeAllMenus();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#10B981] hover:bg-[var(--theme-card,#132438)] hover:text-[#34D399] transition-all cursor-pointer text-left"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>{isHindi ? 'ऐप इंस्टॉल करें (PWA)' : 'Install App (PWA)'}</span>
                    </button>
                  )}

                  {/* GitHub Repo Link */}
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[12px] font-bold text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] hover:text-[#10B981] transition-all cursor-pointer text-left border-t border-[var(--theme-border,#213E61)]/50 mt-1 pt-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderGit2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>GitHub Repo</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                  </a>
                </div>
              </>
            )}
          </div>

          {/* PRIMARY SETTINGS BUTTON (Always visible, prominent & distinct) */}
          <button
            onClick={() => {
              closeAllMenus();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.4))] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
            title="Settings & Data Management (Click to Open)"
            aria-label="Settings"
            id="header-settings-btn"
          >
            <Settings className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <span className="hidden sm:inline font-bold text-[11.5px] text-[#F8FAFC]">
              {isHindi ? 'सेटिंग्स' : 'Settings'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};


