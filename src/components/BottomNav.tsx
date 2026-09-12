import React from 'react';
import { Home, Plus, Calculator, Target, History, BarChart3, LucideIcon } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { triggerHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/audioService';

export type NavTab = 'home' | 'add' | 'tracker' | 'goals' | 'history' | 'report' | 'notes' | 'about' | 'developer' | 'privacy' | 'disclaimer' | 'terms' | 'support' | 'safety' | 'guide' | 'calculator' | 'attendance' | 'loans' | 'cookies' | 'academy' | 'article' | 'news' | 'support-project';

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
    { id: 'home', label: isHindi ? 'होम' : 'Home', icon: Home },
    { id: 'history', label: isHindi ? 'रिकॉर्ड्स' : 'Records', icon: History },
    { id: 'add', label: isHindi ? '+ जोड़ें' : '+ Add', icon: Plus, isAction: true },
    { id: 'goals', label: isHindi ? 'लक्ष्य' : 'Goals', icon: Target },
    { id: 'calculator', label: isHindi ? 'कैलकुलेटर' : 'Calculator', icon: Calculator },
    { id: 'report', label: isHindi ? 'रिपोर्ट्स' : 'Reports', icon: BarChart3 }
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
      className="fixed bottom-0 left-0 right-0 w-full bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-2xl border-t border-[var(--theme-border,#213E61)] shadow-[0_-8px_30px_rgba(0,0,0,0.35)] z-50 px-1 sm:px-6 lg:px-10 pt-1.5 sm:pt-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] transition-colors duration-200"
    >
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
                className="group relative flex flex-col items-center justify-center -mt-3.5 sm:-mt-5 cursor-pointer focus:outline-none transition-transform active:scale-90 w-full"
                title={tab.label}
              >
                <div
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--theme-btn-bg,#0284C7)] text-[var(--theme-btn-text,#FFFFFF)] ring-3 sm:ring-4 ring-[var(--theme-primary-border,rgba(56,189,248,0.5))] shadow-lg scale-105'
                      : 'bg-gradient-to-tr from-[var(--theme-btn-bg,#0284C7)] via-[var(--theme-btn-bg,#0284C7)] to-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#FFFFFF)] hover:scale-105 shadow-md ring-2 sm:ring-3 ring-[var(--theme-surface,#0E1A29)]'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? '0 4px 16px var(--theme-glow, rgba(56,189,248,0.45))'
                      : '0 4px 14px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Plus className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3] text-[var(--theme-btn-text,#FFFFFF)] transition-transform group-hover:rotate-90 duration-200" />
                </div>
                <span className="text-[10px] sm:text-[13px] font-black text-[var(--theme-primary,#0284C7)] mt-0.5 sm:mt-1 tracking-tight truncate max-w-full">
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
              className={`relative flex flex-col items-center justify-center py-0.5 sm:py-2 px-0.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer select-none w-full ${
                isActive
                  ? 'text-[var(--theme-primary,#38BDF8)] font-extrabold bg-[var(--theme-card,#132438)]/60'
                  : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-card,#132438)]/40 active:scale-95'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--theme-primary,#38BDF8)] rounded-b-full shadow-[0_2px_8px_rgba(56,189,248,0.5)] animate-in fade-in zoom-in duration-300"></div>
              )}
              <div
                className={`relative p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] scale-105 sm:scale-110'
                    : 'text-[var(--theme-text-dim,#94A3B8)]'
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
