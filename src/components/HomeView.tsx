import React, { useState, useMemo } from 'react';
import { Entry, FundType, FundConfig, AppLanguage, CategoryBudget, DebtItem, Goal } from '../types';
import { DEFAULT_FUNDS, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { getFundIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { getPageTranslation } from '../utils/pageTranslations';
import { HomepageFundSelectorModal } from './HomepageFundSelectorModal';
import { BankingCard3D } from './BankingCard3D';
import { LoanUdharWidget } from './LoanUdharWidget';
import { ActiveGoalsWidget } from './ActiveGoalsWidget';
import { motion } from 'motion/react';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
  Calendar,
  CalendarDays,
  Sun,
  Wallet,
  PieChart,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  History,
  Download,
  Sliders,
  Layers,
  X,
  Lock,
  EyeOff,
  Cpu,
  HardDrive,
  Target,
  Landmark,
  Calculator,
  BarChart3,
  LayoutGrid
} from 'lucide-react';

interface HomeViewProps {
  entries: Entry[];
  percentages: Record<FundType, number>;
  funds?: FundConfig[];
  homepageFundIds?: string[];
  onUpdateHomepageFundIds?: (ids: string[]) => void;
  onOpenFundSettings?: () => void;
  onAddClick: (type: 'income' | 'expense') => void;
  onFilterFund: (fund: FundType) => void;
  onViewHistory?: () => void;
  onNavigateGoals?: () => void;
  onNavigateCalculator?: () => void;
  onNavigateReports?: () => void;
  onNavigateCategories?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
  budgets?: CategoryBudget[];
  onOpenBudgetManager?: () => void;
  debtItems?: DebtItem[];
  onNavigateLoans?: () => void;
  onOpenAddDebtModal?: () => void;
  goals?: Goal[];
  onOpenCreateGoal?: () => void;
  onOpenDepositGoal?: (goal: Goal) => void;
  [key: string]: any;
}

export const HomeView: React.FC<HomeViewProps> = ({
  entries,
  percentages,
  funds,
  homepageFundIds,
  onUpdateHomepageFundIds,
  onOpenFundSettings,
  onAddClick,
  onFilterFund,
  onViewHistory,
  onNavigateGoals,
  onNavigateCalculator,
  onNavigateReports,
  onNavigateCategories,
  language = 'en',
  privacyMask = false,
  budgets = [],
  onOpenBudgetManager,
  debtItems = [],
  onNavigateLoans,
  onOpenAddDebtModal,
  goals = [],
  onOpenCreateGoal,
  onOpenDepositGoal
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const pageT = getPageTranslation(language);

  const activeFunds: FundConfig[] = funds && funds.length > 0 ? funds : DEFAULT_FUNDS;
  const fundKeys = activeFunds.map((f) => f.id);

  const todayStats = calculatePeriodStats(entries, { type: 'today' });
  const monthStats = calculatePeriodStats(entries, { type: 'month' });
  const fundTotals = calculateFundTotals(entries, fundKeys);

  // Homepage 6-category limit and customization state
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isViewMoreExpanded, setIsViewMoreExpanded] = useState(false);

  // Exactly 6 primary funds displayed open on the homepage
  const primaryFunds: FundConfig[] = useMemo(() => {
    if (homepageFundIds && homepageFundIds.length > 0) {
      const selected: FundConfig[] = [];
      homepageFundIds.forEach((id) => {
        const match = activeFunds.find((f) => f.id === id);
        if (match) selected.push(match);
      });
      // If fewer than 6, fill from remaining activeFunds
      if (selected.length < 6) {
        const remaining = activeFunds.filter((f) => !selected.some((s) => s.id === f.id));
        selected.push(...remaining.slice(0, 6 - selected.length));
      }
      return selected.slice(0, 6);
    }
    return activeFunds.slice(0, 6);
  }, [activeFunds, homepageFundIds]);

  // Additional funds hidden under "View More"
  const overflowFunds: FundConfig[] = useMemo(() => {
    const primaryIds = new Set(primaryFunds.map((f) => f.id));
    return activeFunds.filter((f) => !primaryIds.has(f.id));
  }, [activeFunds, primaryFunds]);

  const localeMap: Record<string, string> = {
    hi: 'hi-IN',
    hinglish: 'en-IN',
    es: 'es-ES',
    ar: 'ar-SA',
    fr: 'fr-FR',
    de: 'de-DE',
    ru: 'ru-RU',
    pt: 'pt-BR',
    bn: 'bn-BD',
    ur: 'ur-PK',
    id: 'id-ID',
    ja: 'ja-JP',
    zh: 'zh-CN',
    en: 'en-IN'
  };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(localeMap[language] || 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const monthFormatted = today.toLocaleString(localeMap[language] || 'default', {
    month: 'short',
    year: 'numeric'
  });

  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  // Quick Access shortcuts row (only shows entries whose handler is wired up)
  const quickAccessItems: { key: string; label: string; icon: LucideIcon; onClick?: () => void; tint: string }[] = [
    { key: 'goals', label: isHindi ? 'लक्ष्य' : 'Goals', icon: Target, onClick: onNavigateGoals, tint: 'rose' },
    { key: 'loans', label: isHindi ? 'ऋण' : 'Loans', icon: Landmark, onClick: onNavigateLoans, tint: 'emerald' },
    { key: 'calculator', label: isHindi ? 'कैलकुलेटर' : 'Calculator', icon: Calculator, onClick: onNavigateCalculator, tint: 'violet' },
    { key: 'reports', label: isHindi ? 'रिपोर्ट' : 'Reports', icon: BarChart3, onClick: onNavigateReports, tint: 'amber' },
    { key: 'history', label: isHindi ? 'इतिहास' : 'History', icon: History, onClick: onViewHistory, tint: 'sky' },
    { key: 'categories', label: isHindi ? 'श्रेणियां' : 'Categories', icon: LayoutGrid, onClick: onNavigateCategories || (() => setIsSelectorOpen(true)), tint: 'indigo' }
  ].filter((item) => !!item.onClick);

  const tintClasses: Record<string, { bg: string; text: string }> = {
    rose: { bg: 'bg-rose-500/15', text: 'text-rose-400' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
    violet: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
    sky: { bg: 'bg-sky-500/15', text: 'text-sky-400' },
    indigo: { bg: 'bg-indigo-500/15', text: 'text-indigo-400' }
  };

  // Compact category card shared by the primary grid and the "View More" drawer
  const renderCompactCategoryCard = (config: FundConfig) => {
    const FundIcon = getFundIcon(config.id, config.iconName);
    const pct = percentages[config.id] ?? config.defaultPct;
    const val = fundTotals[config.id] ?? 0;
    const fundTranslatedName =
      t.funds?.[config.id]?.name
        ? t.funds[config.id].name.split(' (')[0]
        : config.hindiLabel && isHindi
        ? config.hindiLabel
        : config.label;

    return (
      <button
        type="button"
        key={config.id}
        onClick={() => onFilterFund(config.id)}
        className="text-left bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] rounded-xl p-2.5 sm:p-3 transition-all cursor-pointer active:scale-[0.97] shadow-xs"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-1.5 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] shrink-0">
            <FundIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-[var(--theme-text-muted,#94A3B8)]">{pct}%</span>
        </div>
        <div className="text-[11px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
          {fundTranslatedName}
        </div>
        <div className="text-[12.5px] sm:text-[14px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] truncate">
          {formatCurrency(val, privacyMask)}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-8 sm:pb-12 space-y-3 sm:space-y-7 animate-in fade-in duration-200">
      {/* 1. TOTAL NET BALANCE BANNER (3D Animated) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BankingCard3D 
          totalWealth={totalWealth}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          dateFormatted={dateFormatted}
          t={t}
          pageT={pageT}
          onAddClick={onAddClick}
        />
      </motion.div>

      {/* 2 & 3. TODAY & THIS MONTH — compact single-line summary cards */}
      <motion.div 
        className="grid grid-cols-2 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {[
          {
            key: 'today',
            icon: Sun,
            title: isHindi ? 'आज' : 'Today',
            net: todayStats.net,
            onClick: onViewHistory
          },
          {
            key: 'month',
            icon: CalendarDays,
            title: isHindi ? 'इस महीने' : 'This Month',
            net: monthStats.net,
            onClick: onViewHistory
          }
        ].map((card) => {
          const Icon = card.icon;
          const isPositive = card.net >= 0;
          return (
            <button
              key={card.key}
              type="button"
              disabled={!card.onClick}
              onClick={card.onClick}
              className={`text-left bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] rounded-2xl p-3.5 sm:p-4 shadow-md transition-all flex items-center justify-between gap-2 ${card.onClick ? 'hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] sm:text-[14px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                    {card.title}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted,#94A3B8)] truncate">
                    {isHindi ? 'कमाई − खर्च' : 'Income − Expense'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`font-mono font-extrabold text-[13px] sm:text-[15px] ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+' : '-'}{formatCurrency(Math.abs(card.net), privacyMask)}
                </span>
                {card.onClick && <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-muted,#94A3B8)]" />}
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* 2.5 QUICK ACCESS SHORTCUTS */}
      {quickAccessItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] rounded-2xl p-3.5 sm:p-4 shadow-md"
        >
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-[13px] sm:text-[14px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              {isHindi ? 'शॉर्टकट' : 'Quick Access'}
            </span>
            {onOpenFundSettings && (
              <button
                type="button"
                onClick={onOpenFundSettings}
                className="text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline"
              >
                {isHindi ? 'प्रबंधित करें' : 'Manage'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              const tint = tintClasses[item.tint];
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--theme-surface,#0F1420)] transition-all cursor-pointer active:scale-95"
                >
                  <div className={`p-2.5 rounded-xl ${tint.bg} ${tint.text}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--theme-text,#F8FAFC)] truncate max-w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 2.6 & 2.7 FINANCIAL GOALS + LOANS/EMIs — side by side */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
      >
        {/* Active Financial Goals & Savings Milestones Widget */}
        <ActiveGoalsWidget
          goals={goals}
          onOpenCreateGoal={onOpenCreateGoal}
          onOpenDepositGoal={onOpenDepositGoal}
          onNavigateGoals={onNavigateGoals}
          language={language}
          privacyMask={privacyMask}
        />

        {/* Advance Loans, EMIs & Udhar Ledger Overview Widget */}
        {onNavigateLoans && (
          <LoanUdharWidget
            debtItems={debtItems}
            onOpenLedger={onNavigateLoans}
            onOpenAddModal={onOpenAddDebtModal || onNavigateLoans}
            language={language}
            privacyMask={privacyMask}
          />
        )}
      </motion.div>

      {/* 4. 6-FUND ALLOCATION GRID & HOMEPAGE LIMIT */}
      <motion.div 
        className="space-y-3 sm:space-y-4 pt-1 sm:pt-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] shadow-xs shrink-0 transition-colors">
              <PieChart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <h3 className="text-[15px] sm:text-[18px] font-bold tracking-tight text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'टॉप श्रेणियां' : 'Top Categories'}
              </h3>
              <p className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi ? 'अपने पैसों को अलग-अलग जरूरतों के हिसाब से बांटें।' : 'Divide your money into different purpose-driven categories.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[11px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#141B28)] hover:bg-[var(--theme-surface,#0F1420)] px-3 py-1.5 rounded-xl border border-[var(--theme-border,rgba(255,255,255,0.08))] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Customize Homepage Fund Categories"
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'कस्टमाइज़ (6)' : 'Customize Home (6)'}</span>
            </button>

            {onOpenFundSettings ? (
              <button
                type="button"
                onClick={onOpenFundSettings}
                className="text-[10px] sm:text-[11.5px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.22))] px-2.5 py-1.5 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] transition-all cursor-pointer active:scale-95"
                title="Open Split Rule Settings"
              >
                {t.home.allocationRule}
              </button>
            ) : (
              <span className="text-[10px] sm:text-[11.5px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] px-2.5 py-1.5 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]">
                {t.home.allocationRule}
              </span>
            )}
          </div>
        </div>

        {/* Primary 6 Categories - compact 3-column grid, even on mobile */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-2">
          {primaryFunds.map((config) => renderCompactCategoryCard(config))}
        </div>

        {/* View More Drawer for Categories beyond 6 */}
        {overflowFunds.length > 0 && (
          <div className="pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-0.5">
              <button
                type="button"
                id="btn-view-more-categories"
                onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
                className="text-[12px] sm:text-[13px] font-extrabold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] border-2 border-[var(--theme-primary-border,rgba(56,189,248,0.4))] hover:bg-[var(--theme-primary,#38BDF8)] hover:text-[var(--theme-btn-text,#040D17)] px-4 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-2.5 transition-all shadow-xs cursor-pointer active:scale-98 shrink-0 group"
              >
                <span className="transition-colors">
                  {isViewMoreExpanded
                    ? isHindi
                      ? 'कम श्रेणियां दिखाएं (Collapse)'
                      : 'Show Fewer Categories'
                    : isHindi
                    ? `+${overflowFunds.length} और श्रेणियां देखें (View More)`
                    : `View More Categories (+${overflowFunds.length} More)`}
                </span>
                {isViewMoreExpanded ? (
                  <ChevronUp className="w-4 h-4 text-current stroke-[3] shrink-0 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-current stroke-[3] shrink-0 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>

              <div className="flex items-center gap-2 self-end sm:self-center px-1">
                <span className="text-[11px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium">
                  {isHindi
                    ? `${activeFunds.length} में से 6 श्रेणियां प्रदर्शित`
                    : `6 of ${activeFunds.length} categories shown`}
                </span>
              </div>
            </div>

            {isViewMoreExpanded && (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {overflowFunds.map((config) => renderCompactCategoryCard(config))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 5. BOTTOM 2-COLUMN SECTION: RECENT TRANSACTIONS + SECURITY ASSURANCE */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch pt-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Recent Transactions Card */}
        <div className="bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] rounded-2xl p-3.5 sm:p-5 shadow-md flex flex-col justify-between space-y-3 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between text-[13px] sm:text-[14px] font-semibold text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,rgba(255,255,255,0.08))] pb-2.5">
            <span className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] transition-colors">
                <History className="w-4 h-4" />
              </div>
              <span className="font-bold">{isHindi ? 'हाल ही के लेन-देन' : 'Recent Transactions'}</span>
            </span>
            {onViewHistory && (
              <button 
                type="button" 
                onClick={onViewHistory} 
                className="text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 font-black text-[12px] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1">
            {entries.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map(entry => {
              return (
                <div 
                  key={entry.id} 
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[var(--theme-surface,#0F1420)] border border-[var(--theme-border,rgba(255,255,255,0.08))] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.3))] transition-colors relative overflow-hidden group/item"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 relative ${entry.type === 'income' ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-600/20 text-rose-600 dark:text-rose-400'}`}>
                      {entry.type === 'income' ? <ArrowUpRight className="w-4 h-4 stroke-[2.5]" /> : <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] sm:text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate max-w-[140px] sm:max-w-[180px]">
                          {entry.category}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted,#94A3B8)] truncate">
                        {entry.date}
                      </span>
                    </div>
                  </div>
                  <div className={`font-mono font-bold text-[12.5px] sm:text-[14px] shrink-0 ${entry.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount, privacyMask)}
                  </div>
                </div>
              );
            })}
            {entries.length === 0 && (
              <div className="text-center py-6 text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium">
                {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-[var(--theme-border,rgba(255,255,255,0.08))] text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{isHindi ? 'लोकल सैंडबॉक्स स्टोरेज • शून्य टेलीमेट्री' : 'Sandboxed Local Storage • Zero Telemetry'}</span>
          </div>
        </div>

        {/* Security Assurance Card */}
        <div className="bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] hover:border-[var(--theme-primary,#38BDF8)]/40 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-3.5 relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.25))] text-[var(--theme-primary,#38BDF8)] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight truncate">
                {isHindi ? 'लोकल स्टोरेज व डेटा सुरक्षा' : 'Local Storage & Data Privacy'}
              </h4>
              <p className="text-[10.5px] sm:text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] line-clamp-2 leading-relaxed mt-0.5">
                {isHindi ? 'समस्त वित्तीय प्रविष्टियां आपके डिवाइस के स्थानीय स्टोरेज में सहेजी जाती हैं। कोई बाहरी ट्रैकिंग या सर्वर सिंक नहीं।' : 'All financial logs remain sandboxed in your device storage with zero remote telemetry.'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[var(--theme-surface,#0F1420)] border border-[var(--theme-border,rgba(255,255,255,0.08))] space-y-1">
              <HardDrive className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="text-[10px] font-bold text-[var(--theme-text,#F8FAFC)] block leading-tight">
                {isHindi ? 'लोकल स्टोरेज' : 'Client Storage'}
              </span>
              <span className="text-[8.5px] text-[var(--theme-text-muted,#94A3B8)] block uppercase tracking-wider">
                {isHindi ? 'डिवाइस सैंडबॉक्स' : 'Local Device'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[var(--theme-surface,#0F1420)] border border-[var(--theme-border,rgba(255,255,255,0.08))] space-y-1">
              <EyeOff className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-[var(--theme-text,#F8FAFC)] block leading-tight">
                {isHindi ? 'शून्य टेलीमेट्री' : 'Zero Telemetry'}
              </span>
              <span className="text-[8.5px] text-[var(--theme-text-muted,#94A3B8)] block uppercase tracking-wider">
                {isHindi ? 'शून्य रिमोट सिंक' : 'No Remote Sync'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[var(--theme-surface,#0F1420)] border border-[var(--theme-border,rgba(255,255,255,0.08))] space-y-1">
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold text-[var(--theme-text,#F8FAFC)] block leading-tight">
                {isHindi ? 'एक्सेस कंट्रोल' : 'Access Control'}
              </span>
              <span className="text-[8.5px] text-[var(--theme-text-muted,#94A3B8)] block uppercase tracking-wider">
                {isHindi ? 'पिन लॉक' : 'PIN & Biometric'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. MOTIVATIONAL BANNER STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <div className="w-full flex items-center justify-between gap-3 bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[12px] sm:text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
              {isHindi
                ? 'आज के छोटे कदम → कल की बड़ी वित्तीय आज़ादी'
                : 'Small Steps Today → Bigger Financial Freedom Tomorrow'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--theme-text-muted,#94A3B8)] shrink-0" />
        </div>
      </motion.div>

      {/* Homepage Fund Selector Modal */}
      <HomepageFundSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        funds={activeFunds}
        homepageFundIds={homepageFundIds || primaryFunds.map((f) => f.id)}
        onSaveHomepageFundIds={(ids) => {
          if (onUpdateHomepageFundIds) {
            onUpdateHomepageFundIds(ids);
          }
        }}
        onOpenFundSettings={onOpenFundSettings}
        language={language}
      />
    </div>
  );
};

export default HomeView;
