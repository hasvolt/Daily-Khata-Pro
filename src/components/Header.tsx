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
  User
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
  onOpenSimulator?: () => void;
  onOpenSourceCode?: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenDeveloper?: () => void;
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
  onOpenSimulator,
  onOpenSourceCode,
  onOpenInstall,
  onOpenShare,
  onOpenDeveloper,
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

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const themeOptions: {
    id: AppTheme;
    label: string;
    dotColor: string;
    bgClass: string;
    textClass: string;
  }[] = [
    { id: 'blue', label: 'Electric Blue', dotColor: '#38BDF8', bgClass: 'bg-[#38BDF8]', textClass: 'text-[#38BDF8]' },
    { id: 'yellow', label: 'Volt Gold', dotColor: '#FFC700', bgClass: 'bg-[#FFC700]', textClass: 'text-[#FFC700]' },
    { id: 'orange', label: 'Sunset Orange', dotColor: '#F97316', bgClass: 'bg-[#F97316]', textClass: 'text-[#FB923C]' },
    { id: 'emerald', label: 'Emerald Green', dotColor: '#10B981', bgClass: 'bg-[#10B981]', textClass: 'text-[#10B981]' },
    { id: 'purple', label: 'Royal Violet', dotColor: '#A855F7', bgClass: 'bg-[#A855F7]', textClass: 'text-[#A855F7]' },
    { id: 'cyan', label: 'Ocean Teal', dotColor: '#06B6D4', bgClass: 'bg-[#06B6D4]', textClass: 'text-[#06B6D4]' }
  ];

  const languageOptions: { id: AppLanguage; label: string; short: string; native: string }[] = [
    { id: 'en', label: 'English', short: 'EN', native: 'English' },
    { id: 'hi', label: 'हिन्दी', short: 'HI', native: 'हिंदी' },
    { id: 'hinglish', label: 'Hinglish', short: 'HIN', native: 'Hinglish' }
  ];

  const currentThemeConfig = themeOptions.find((t) => t.id === theme) || themeOptions[0];
  const currentLangConfig = languageOptions.find((l) => l.id === language) || languageOptions[0];

  return (
    <header className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md sticky top-0 z-30 shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <div
            onClick={() => onSelectTab && onSelectTab('home')}
            className="cursor-pointer active:scale-95 transition-transform"
          >
            <HasVoltLogo size={38} />
          </div>

          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                onClick={() => onSelectTab && onSelectTab('home')}
                className="font-serif-display font-bold text-[18px] sm:text-[21px] tracking-tight cursor-pointer transition-colors truncate"
              >
                <span className="text-[#FFFFFF]">Daily</span>
                <span className="ml-1.5" style={{ color: 'var(--theme-primary, #38BDF8)' }}>Khata</span>
                <span className="text-[#F8FAFC]">: Pro</span>
              </span>
              <span
                className="hidden sm:inline-block text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border transition-colors"
                style={{
                  backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.15))',
                  color: 'var(--theme-primary, #38BDF8)',
                  borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.35))'
                }}
              >
                OFFICIAL
              </span>
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#94A3B8] flex items-center gap-1 font-medium truncate">
              <span
                className="font-bold truncate transition-colors"
                style={{ color: 'var(--theme-primary, #38BDF8)' }}
              >
                {language === 'hi' ? 'दैनिक आय-व्यय ट्रैकर' : 'Daily Income & Expense Tracker'}
              </span>
              <span className="text-[#475569] mx-0.5 hidden xs:inline">•</span>
              <span className="text-[#94A3B8] hidden xs:inline truncate">6-Fund Ledger</span>
            </div>
          </div>
        </div>

        {/* Desktop Mode Search Bar */}
        {onSearchChange && (
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2">
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
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11.5px] font-bold flex items-center gap-1.5 ${
                privacyMask
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title={privacyMask ? 'Amounts Hidden (Click to show)' : 'Mask Rupee Amounts'}
              id="header-privacy-mask-btn"
            >
              {privacyMask ? (
                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
              <span className="hidden lg:inline text-[11px]">
                {privacyMask ? (language === 'hi' ? 'छिपा हुआ' : 'Hidden') : (language === 'hi' ? 'छुपाएं' : 'Mask')}
              </span>
            </button>
          )}

          {/* Quick Simulator / Calculator Button */}
          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 text-[11.5px] sm:text-[12px] font-bold flex items-center gap-1.5"
              title="6-Fund Split Simulator & Calculator"
              id="header-simulator-btn"
            >
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="hidden sm:inline">{language === 'hi' ? 'कैलकुलेटर' : 'Calc'}</span>
            </button>
          )}

          {/* Language Switcher Dropdown */}
          {onLanguageChange && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen);
                  setIsThemeMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold"
                title="Change Language (English / हिन्दी / Hinglish)"
                id="header-language-btn"
              >
                <Languages className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>{currentLangConfig.short}</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      {language === 'hi' ? 'भाषा चुनें' : 'Select Language'}
                    </div>
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onLanguageChange(opt.id);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer text-left ${
                          language === opt.id
                            ? 'bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)]'
                            : 'hover:bg-white/5 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{opt.native}</span>
                          <span className="text-[10px] text-[#64748B]">{opt.label}</span>
                        </div>
                        {language === opt.id && (
                          <Check className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick Theme Switcher Pill */}
          {onThemeChange && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsThemeMenuOpen(!isThemeMenuOpen);
                  setIsLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold"
                title="Toggle Theme"
                id="header-theme-switcher-btn"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: currentThemeConfig.dotColor }}
                />
                <span className="hidden sm:inline font-medium text-[11px] text-[#CBD5E1]">
                  {currentThemeConfig.label.split(' ')[0]}
                </span>
                <Palette className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              {/* Theme Dropdown Popover */}
              {isThemeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      {language === 'hi' ? 'रंग थीम चुनें' : 'Choose Color Theme'}
                    </div>
                    {themeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onThemeChange(opt.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer text-left ${
                          theme === opt.id
                            ? 'bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]'
                            : 'hover:bg-white/5 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-xs"
                            style={{ backgroundColor: opt.dotColor }}
                          />
                          <span className={theme === opt.id ? opt.textClass : ''}>
                            {opt.label}
                          </span>
                        </div>
                        {theme === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* GitHub Source Code Repo Link */}
          <a
            href="https://github.com/hasvolt/Daily-Khata-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#CBD5E1] hover:text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold"
            title="GitHub Source Code Repository (hasvolt/Daily-Khata-Pro)"
            aria-label="GitHub Repository"
            id="header-github-btn"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="hidden lg:inline">GitHub</span>
          </a>

          {/* Source Code & Trust Verification Button */}
          {onOpenSourceCode && (
            <button
              onClick={onOpenSourceCode}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold"
              title="Open Source & Security Verification"
              aria-label="Source Code & Security"
              id="header-sourcecode-btn"
            >
              <Code2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              <span className="hidden md:inline">Code &amp; Safe</span>
            </button>
          )}

          {/* User Manual Guide Button */}
          <button
            onClick={onOpenManual}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold"
            style={{
              backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.15))',
              color: 'var(--theme-primary, #38BDF8)',
              borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.35))'
            }}
            title="User Manual & Complete Guide"
            aria-label="User Manual"
            id="header-manual-btn"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">{t.header.manual}</span>
          </button>

          {/* Install / Download App Button */}
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#10B981]/50 bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981] hover:text-[#04140D] transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-extrabold"
              title="Install App (100% Offline PWA for Mobile & PC)"
              aria-label="Install App"
              id="header-install-btn"
            >
              <Download className="w-3.5 h-3.5 shrink-0 animate-bounce" />
              <span className="hidden xs:inline">{language === 'hi' ? 'ऐप इंस्टॉल' : 'Install App'}</span>
              <span className="xs:hidden">App</span>
            </button>
          )}

          {/* Developer Profile Button */}
          {onOpenDeveloper && (
            <button
              onClick={onOpenDeveloper}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold shrink-0"
              title="Developer Information (MD Zafeer Hasan - YAZDAAN)"
              aria-label="Developer Info"
              id="header-dev-btn"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden border border-[var(--theme-primary,#38BDF8)]/60 shrink-0 bg-[#0B1017]">
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
              <span className="hidden md:inline font-mono text-[11px]">Developer</span>
            </button>
          )}

          {/* Share Page Link Button */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-[11.5px] font-bold"
              title="Share Page Link (WhatsApp, X, Copy Link)"
              aria-label="Share Link"
              id="header-share-btn"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <span className="hidden sm:inline">{language === 'hi' ? 'शेयर' : 'Share'}</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] flex items-center justify-center text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="Settings & Data Management"
            aria-label="Settings"
            id="header-settings-btn"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

