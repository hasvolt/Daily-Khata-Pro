import React, { useState, useMemo } from 'react';
import { Entry, FundType, FundConfig, AppLanguage, CategoryBudget, DebtItem, Goal } from '../types';
import { DEFAULT_FUNDS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { getFundIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { getPageTranslation } from '../utils/pageTranslations';
import { HomepageFundSelectorModal } from './HomepageFundSelectorModal';
import { BankingCard3D } from './BankingCard3D';
import { FundCard3D } from './FundCard3D';
import { SummaryCard3D } from './SummaryCard3D';
import { LoanUdharWidget } from './LoanUdharWidget';
import { ActiveGoalsWidget } from './ActiveGoalsWidget';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  History,
  Sliders,
  Target,
  Landmark,
  Calculator,
  BarChart3,
  Grid2X2,
  Plus
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
  onOpenFundSettings,
  onAddClick,
  onFilterFund,
  onViewHistory,
  onNavigateGoals,
  onNavigateCalculator,
  onNavigateReports,
  language = 'en',
  privacyMask = false,
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

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isViewMoreExpanded, setIsViewMoreExpanded] = useState(false);

  const primaryFunds: FundConfig[] = useMemo(() => {
    if (homepageFundIds && homepageFundIds.length > 0) {
      const selected: FundConfig[] = [];
      homepageFundIds.forEach((id) => {
        const match = activeFunds.find((f) => f.id === id);
        if (match) selected.push(match);
      });
      if (selected.length < 6) {
        const remaining = activeFunds.filter((f) => !selected.some((s) => s.id === f.id));
        selected.push(...remaining.slice(0, 6 - selected.length));
      }
      return selected.slice(0, 6);
    }
    return activeFunds.slice(0, 6);
  }, [activeFunds, homepageFundIds]);

  const overflowFunds = useMemo(() => {
    const primaryIds = new Set(primaryFunds.map((f) => f.id));
    return activeFunds.filter((f) => !primaryIds.has(f.id));
  }, [activeFunds, primaryFunds]);

  const localeMap: Record<string, string> = {
    hi: 'hi-IN', hinglish: 'en-IN', es: 'es-ES', ar: 'ar-SA', fr: 'fr-FR',
    de: 'de-DE', ru: 'ru-RU', pt: 'pt-BR', bn: 'bn-BD', ur: 'ur-PK',
    id: 'id-ID', ja: 'ja-JP', zh: 'zh-CN', en: 'en-IN'
  };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(localeMap[language] || 'en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
  const monthFormatted = today.toLocaleString(localeMap[language] || 'default', {
    month: 'short', year: 'numeric'
  });
  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  const quickAccess = [
    {
      label: isHindi ? 'लक्ष्य' : 'Goals',
      icon: Target,
      tone: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      action: onNavigateGoals
    },
    {
      label: isHindi ? 'लोन' : 'Loans',
      icon: Landmark,
      tone: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      action: onNavigateLoans
    },
    {
      label: isHindi ? 'कैलकुलेटर' : 'Calculator',
      icon: Calculator,
      tone: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      action: onNavigateCalculator
    },
    {
      label: isHindi ? 'रिपोर्ट्स' : 'Reports',
      icon: BarChart3,
      tone: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      action: onNavigateReports
    },
    {
      label: isHindi ? 'इतिहास' : 'History',
      icon: History,
      tone: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      action: onViewHistory
    },
    {
      label: isHindi ? 'कैटेगरी' : 'Categories',
      icon: Grid2X2,
      tone: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      action: () => setIsSelectorOpen(true)
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto pb-8 sm:pb-12 space-y-3 sm:space-y-4 animate-in fade-in duration-200">
      {/* 1. HERO BALANCE */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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

      {/* 2. COMPACT TODAY + MONTH — two columns even on mobile */}
      <motion.section
        className="grid grid-cols-2 gap-2.5 sm:gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.04 }}
      >
        <SummaryCard3D
          type="daily"
          title={isHindi ? 'आज का हिसाब' : "Today's Summary"}
          subtitle={isHindi ? 'आज की कमाई, खर्च व बचत' : 'Income, expense & savings for today'}
          periodBadge={pageT.common.today}
          incomeLabel={t.home.todayIncome}
          incomeValue={todayStats.income}
          expenseLabel={t.home.todayExpense}
          expenseValue={todayStats.expense}
          netLabel={isHindi ? 'आज की बचत:' : "Today's Savings:"}
          netValue={todayStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
        />
        <SummaryCard3D
          type="monthly"
          title={isHindi ? 'इस महीने का हिसाब' : 'This Month'}
          subtitle={isHindi ? 'महीने की कमाई, खर्च व बचत' : 'Monthly income, expense & savings'}
          periodBadge={monthFormatted}
          incomeLabel={t.home.thisMonthIncome}
          incomeValue={monthStats.income}
          expenseLabel={t.home.thisMonthExpense}
          expenseValue={monthStats.expense}
          netLabel={isHindi ? 'महीने की बचत:' : 'Monthly Savings:'}
          netValue={monthStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
        />
      </motion.section>

      {/* 3. QUICK ACCESS */}
      <motion.section
        className="rounded-2xl sm:rounded-3xl border border-[var(--theme-primary-border,rgba(56,189,248,.22))] bg-[linear-gradient(145deg,#0d1d30,#0b1625)] p-3 sm:p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06 }}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 rotate-45" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-white truncate">
                {isHindi ? 'त्वरित पहुंच' : 'Quick Access'}
              </h3>
              <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">
                {isHindi ? 'सबसे ज्यादा इस्तेमाल होने वाले फीचर्स' : 'Most-used features in one place'}
              </p>
            </div>
          </div>
          {onOpenFundSettings && (
            <button
              type="button"
              onClick={onOpenFundSettings}
              className="text-[9px] sm:text-[10px] font-bold text-cyan-300 shrink-0 cursor-pointer"
            >
              Manage →
            </button>
          )}
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="min-w-0 rounded-xl sm:rounded-2xl border border-white/[.05] bg-[#0b1524] px-1 py-2 sm:py-2.5 flex flex-col items-center justify-center gap-1.5 hover:border-cyan-400/20 transition-all active:scale-[.97] cursor-pointer"
              >
                <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl border flex items-center justify-center ${item.tone}`}>
                  <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[7px] sm:text-[9px] font-bold text-slate-200 truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* 4. GOALS + LOANS — compact side-by-side */}
      <motion.section
        className="grid grid-cols-2 gap-2.5 sm:gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
        <ActiveGoalsWidget
          goals={goals}
          onOpenCreateGoal={onOpenCreateGoal}
          onOpenDepositGoal={onOpenDepositGoal}
          onNavigateGoals={onNavigateGoals}
          language={language}
          privacyMask={privacyMask}
        />
        {onNavigateLoans && (
          <LoanUdharWidget
            debtItems={debtItems}
            onOpenLedger={onNavigateLoans}
            onOpenAddModal={onOpenAddDebtModal || onNavigateLoans}
            language={language}
            privacyMask={privacyMask}
          />
        )}
      </motion.section>

      {/* 5. TOP CATEGORIES — three columns on mobile */}
      <motion.section
        className="space-y-2.5 sm:space-y-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[17px] font-bold text-white truncate">
                {isHindi ? 'धन का बंटवारा' : 'Top Categories'}
              </h3>
              <p className="hidden sm:block text-[10px] text-slate-400 truncate">Your money allocation at a glance</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenFundSettings && (
              <button
                type="button"
                onClick={onOpenFundSettings}
                className="hidden sm:flex items-center gap-1 text-[9px] font-bold text-slate-200 bg-[#111d2e] border border-white/[.07] rounded-lg px-2 py-1.5 cursor-pointer"
              >
                <Sliders className="w-3 h-3" /> Customize
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[10px] sm:text-[11px] font-bold text-cyan-300 cursor-pointer"
            >
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
          {primaryFunds.map((config) => {
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
              <FundCard3D
                key={config.id}
                config={config}
                val={val}
                pct={pct}
                fundTranslatedName={fundTranslatedName}
                subtitle={undefined}
                FundIcon={FundIcon}
                formatCurrency={formatCurrency}
                privacyMask={privacyMask}
                onClick={() => onFilterFund(config.id)}
                isPrimary={true}
              />
            );
          })}
        </div>

        {overflowFunds.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-1">
            <button
              type="button"
              id="btn-view-more-categories"
              onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
              className="text-[10px] sm:text-[11px] font-bold text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {isViewMoreExpanded
                ? (isHindi ? 'कम श्रेणियां दिखाएं' : 'Show Fewer Categories')
                : (isHindi ? `+${overflowFunds.length} और देखें` : `View More Categories (+${overflowFunds.length})`)}
              {isViewMoreExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span className="text-[9px] text-slate-500">{`6 of ${activeFunds.length} shown`}</span>
          </div>
        )}

        {isViewMoreExpanded && overflowFunds.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {overflowFunds.map((config) => {
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
                <FundCard3D
                  key={config.id}
                  config={config}
                  val={val}
                  pct={pct}
                  fundTranslatedName={fundTranslatedName}
                  subtitle={undefined}
                  FundIcon={FundIcon}
                  formatCurrency={formatCurrency}
                  privacyMask={privacyMask}
                  onClick={() => onFilterFund(config.id)}
                  isPrimary={false}
                />
              );
            })}
          </div>
        )}
      </motion.section>

      {/* 6. RECENT TRANSACTIONS */}
      <motion.section
        className="rounded-2xl sm:rounded-3xl border border-[var(--theme-primary-border,rgba(56,189,248,.22))] bg-[linear-gradient(145deg,#101c2d,#0b1524)] p-3 sm:p-4"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[.06]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-white truncate">
                {isHindi ? 'हाल ही के लेन-देन' : 'Recent Transactions'}
              </h3>
              <p className="hidden sm:block text-[10px] text-slate-400">Your latest activity</p>
            </div>
          </div>

          {onViewHistory && (
            <button type="button" onClick={onViewHistory} className="text-[10px] sm:text-[11px] font-bold text-cyan-300 flex items-center gap-1 cursor-pointer shrink-0">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2.5">
          {entries
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 4)
            .map((entry) => (
              <div
                key={entry.id}
                className="min-w-0 rounded-xl bg-[#0a1220] border border-white/[.05] p-2 sm:p-2.5 flex items-center justify-between gap-1.5"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center ${entry.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {entry.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[11px] font-bold text-slate-200 truncate">{entry.category}</span>
                    <span className="block text-[7px] sm:text-[9px] text-slate-500 truncate">{entry.date}</span>
                  </div>
                </div>
                <span className={`font-mono font-bold text-[9px] sm:text-[11px] shrink-0 ${entry.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount, privacyMask)}
                </span>
              </div>
            ))}

          {entries.length === 0 && (
            <div className="col-span-2 text-center py-6 text-[11px] text-slate-500">
              {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-2.5 border-t border-white/[.06] text-emerald-400 font-semibold text-[9px] sm:text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Local Storage • Zero Telemetry</span>
        </div>
      </motion.section>

      <HomepageFundSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        funds={activeFunds}
        selectedFundIds={primaryFunds.map((f) => f.id)}
        onSave={(ids: string[]) => {
          if (onUpdateHomepageFundIds) onUpdateHomepageFundIds(ids);
          setIsSelectorOpen(false);
        }}
      />
    </div>
  );
};

export default HomeView;
