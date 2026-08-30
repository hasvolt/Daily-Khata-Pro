import React from 'react';
import { Home, PlusCircle, Briefcase, Target, History, BarChart3 } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';

export type NavTab = 'home' | 'add' | 'tracker' | 'goals' | 'history' | 'report' | 'notes' | 'developer' | 'about' | 'privacy' | 'disclaimer' | 'terms';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language?: AppLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const tabs = [
    { id: 'home' as NavTab, label: t.nav.home, icon: Home },
    { id: 'add' as NavTab, label: t.nav.add, icon: PlusCircle },
    { id: 'tracker' as NavTab, label: t.nav.tracker, icon: Briefcase },
    { id: 'goals' as NavTab, label: t.nav.goals, icon: Target },
    { id: 'history' as NavTab, label: t.nav.history, icon: History },
    { id: 'report' as NavTab, label: t.nav.reports, icon: BarChart3 }
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 bg-[var(--theme-surface,#0E1A29)]/98 backdrop-blur-2xl border-t border-[var(--theme-border,#213E61)] flex justify-around items-center py-2 sm:py-2.5 px-1 sm:px-2 z-40 max-w-full md:max-w-3xl lg:max-w-4xl mx-auto md:rounded-t-2xl shadow-2xl no-print transition-colors duration-300"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-btn-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 text-[11px] sm:text-[12.5px] px-1.5 sm:px-3 py-1 font-sans font-bold tracking-tight transition-all cursor-pointer rounded-xl shrink-0 min-w-0 ${
              isActive
                ? 'scale-105'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)]/50 active:scale-95'
            }`}
            style={{
              color: isActive ? 'var(--theme-primary, #38BDF8)' : undefined
            }}
          >
            <div
              className="p-1 sm:p-1.5 rounded-xl transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--theme-primary-dim, rgba(56, 189, 248, 0.2))' : 'transparent',
                color: isActive ? 'var(--theme-primary, #38BDF8)' : undefined
              }}
            >
              <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <span className="truncate leading-none text-[10.5px] sm:text-[12px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

