import React from 'react';
import { Home, Plus, Calculator, Target, History, BarChart3, LucideIcon } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { triggerHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/audioService';

export type NavTab = 'home' | 'add' | 'tracker' | 'goals' | 'history' | 'report' | 'notes' | 'about' | 'developer' | 'privacy' | 'disclaimer' | 'terms' | 'support' | 'safety' | 'guide' | 'calculator' | 'attendance' | 'loans' | 'invoice' | 'cookies' | 'academy' | 'article' | 'news' | 'blog' | 'support-project' | 'ads-policy';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: NavTab) => void;
  language?: AppLanguage;
}

interface TabItem {
  id: NavTab;
  label: string;
  icon: LucideIcon;
  isAction?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi';

  const tabs: TabItem[] = [
    { id: 'home', label: t.nav.home || (isHindi ? 'होम' : 'Home'), icon: Home },
    { id: 'history', label: isHindi ? 'इतिहास' : 'History', icon: History },
    { id: 'add', label: t.nav.add || (isHindi ? '+ जोड़ें' : '+ Add'), icon: Plus, isAction: true },
    { id: 'goals', label: t.nav.goals || (isHindi ? 'लक्ष्य' : 'Goals'), icon: Target },
    { id: 'calculator', label: t.nav.calculator || t.home.calculator || (isHindi ? 'कैलकुलेटर' : 'Calculator'), icon: Calculator },
    { id: 'report', label: t.nav.reports || (isHindi ? 'रिपोर्ट्स' : 'Reports'), icon: BarChart3 }
  ];

  const handleTabClick = (tab: TabItem) => {
    triggerHaptic(tab.isAction ? 'medium' : 'light');
    playClickSound();
    onSelectTab(tab.id);
  };

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 w-full bg-[var(--theme-surface,#0E1A29)]/75 backdrop-blur-xl border-t border-[var(--theme-primary-border,rgba(56,189,248,0.20))] shadow-[0_-4px_20px_rgba(0,0,0,0.35)] z-50 px-1 sm:px-6 lg:px-10 pt-1.5 sm:pt-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] transition-colors duration-200"
    >
      {/* 3D Animated Top Rim Horizon Accent */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] overflow-hidden pointer-events-none">
        <div className="bottomnav-3d-sheen w-full h-full bg-gradient-to-r from-transparent via-[var(--theme-primary,#2EECA3)] to-transparent opacity-70" />
      </div>

      <div className="grid grid-cols-6 items-center w-full max-w-6xl mx-auto gap-0.5 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          // Special Center Action Button (+ Add)
          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                id="nav-btn-add"
                type="button"
                onClick={() => handleTabClick(tab)}
                className="group relative flex flex-col items-center justify-center -mt-3.5 sm:-mt-5 cursor-pointer focus:outline-none transition-transform hover:-translate-y-1 active:translate-y-0.5 active:scale-95 w-full"
                title={tab.label}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-tr from-[var(--theme-primary,#38BDF8)] to-[var(--theme-primary-hover,#0284C7)] text-white ring-2 ring-[var(--theme-primary-border,rgba(56,189,248,0.5))] shadow-[0_2px_10px_var(--theme-glow,rgba(56,189,248,0.25)),inset_0_1px_0_rgba(255,255,255,0.4)] scale-105'
                      : 'bg-gradient-to-tr from-[var(--theme-primary,#38BDF8)] to-[var(--theme-primary-hover,#0284C7)] text-white hover:scale-105 shadow-[0_2px_10px_var(--theme-glow,rgba(56,189,248,0.20)),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-[var(--theme-primary-border,rgba(255,255,255,0.25))]'
                  }`}
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] text-white transition-transform group-hover:rotate-90 duration-200 drop-shadow-sm" />
                </div>
                <span className="text-[10px] sm:text-[12px] font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5 sm:mt-1 tracking-tight truncate max-w-full">
                  {tab.label}
                </span>
              </button>
            );
          }

          // Standard Nav Tab
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`relative flex flex-col items-center justify-center py-0.5 sm:py-2 px-0.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer select-none w-full hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 ${
                isActive
                  ? 'text-[var(--theme-primary,#38BDF8)] font-extrabold bg-[var(--theme-card,#132438)]/80 shadow-[0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]'
                  : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-card,#132438)]/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--theme-primary,#38BDF8)] rounded-b-full shadow-[0_2px_8px_var(--theme-glow,rgba(56,189,248,0.5))] animate-in fade-in zoom-in duration-300"></div>
              )}
              <div
                className={`relative p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] scale-105 sm:scale-110 shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'text-[var(--theme-text-dim,#94A3B8)] group-hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <span className="text-[9.5px] sm:text-[13px] font-bold leading-tight truncate mt-0.5 max-w-full text-center whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
