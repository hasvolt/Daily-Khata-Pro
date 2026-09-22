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
  Target,
  Landmark,
  Calculator,
  BarChart3,
  Grid2X2,
  Zap,
  Lightbulb,
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
  onTogglePrivacyMask?: () => void;
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

const FINANCIAL_TIPS = [
  'Small Steps Today → Bigger Financial Freedom Tomorrow',
  'Track every rupee: What gets measured, gets managed.',
  'Pay yourself first by putting 20% into savings and emergency fund.',
  'Avoid high-interest debt and keep EMI below 30% of income.',
  'Review monthly subscriptions regularly to plug financial leaks.',
];

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
  onTogglePrivacyMask,
  language = 'en',
  privacyMask = false,
  debtItems = [],
  onNavigateLoans,
  onOpenAddDebtModal,
  goals = [],
  onOpenCreateGoal,
  onOpenDepositGoal,
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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % FINANCIAL_TIPS.length);
  };

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
    en: 'en-IN',
  };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(localeMap[language] || 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const monthFormatted = today.toLocaleString(localeMap[language] || 'default', {
    month: 'short',
    year: 'numeric',
  });
  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  const quickAccess = [
    {
      label: isHindi ? 'लक्ष्य' : 'Goals',
      icon: Target,
      action: onNavigateGoals,
    },
    {
      label: isHindi ? 'लोन' : 'Loans',
      icon: Landmark,
      action: onNavigateLoans,
    },
    {
      label: isHindi ? 'कैलकुलेटर' : 'Calculator',
      icon: Calculator,
      action: onNavigateCalculator,
    },
    {
      label: isHindi ? 'रिपोर्ट्स' : 'Reports',
      icon: BarChart3,
      action: onNavigateReports,
    },
    {
      label: isHindi ? 'इतिहास' : 'History',
      icon: History,
      action: onViewHistory,
    },
    {
      label: isHindi ? 'कैटेगरी' : 'Categories',
      icon: Grid2X2,
      action: () => setIsSelectorOpen(true),
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto pb-10 sm:pb-14 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
      {/* Premium Frosted Glass Luminous Backdrops */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[96vw] max-w-5xl h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,rgba(14,165,233,0.05)_45%,transparent_72%)] blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl h-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,rgba(56,189,248,0.04)_40%,transparent_70%)] blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 w-[88vw] max-w-3xl h-[360px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_65%)] blur-3xl -z-10"
      />

      {/* 1. HERO BALANCE CARD */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <BankingCard3D
          totalWealth={totalWealth}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          dateFormatted={dateFormatted}
          t={t}
          pageT={pageT}
          onAddClick={onAddClick}
          onTogglePrivacyMask={onTogglePrivacyMask}
        />
      </motion.div>

      {/* 2. TODAY + THIS MONTH SUMMARY CARDS (Side by Side) */}
      <motion.section
        className="grid grid-cols-2 gap-2.5 sm:gap-3.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.04 }}
      >
        <SummaryCard3D
          type="daily"
          title={isHindi ? 'आज का हिसाब' : 'Today'}
          subtitle={isHindi ? 'कमाई – खर्च' : 'Income – Expense'}
          periodBadge={pageT.common.today}
          incomeValue={todayStats.income}
          expenseValue={todayStats.expense}
          netValue={todayStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
          onClick={onViewHistory}
        />
        <SummaryCard3D
          type="monthly"
          title={isHindi ? 'इस महीने' : 'This Month'}
          subtitle={isHindi ? 'कमाई – खर्च' : 'Income – Expense'}
          periodBadge={monthFormatted}
          incomeValue={monthStats.income}
          expenseValue={monthStats.expense}
          netValue={monthStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
          onClick={onViewHistory}
        />
      </motion.section>

      {/* 3. QUICK ACCESS */}
      <motion.section
        className="rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06 }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.30))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {isHindi ? 'त्वरित पहुंच' : 'Quick Access'}
              </h3>
              <p className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi ? 'सबसे ज्यादा इस्तेमाल होने वाले टूल्स' : 'Most-used features in one place'}
              </p>
            </div>
          </div>
          {onOpenFundSettings && (
            <button
              type="button"
              onClick={onOpenFundSettings}
              className="text-[9.5px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
            >
              Manage →
            </button>
          )}
        </div>

        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                type="button"
                onClick={item.action}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ y: 1, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                className="quick-access-btn group relative min-w-0 rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] px-1 py-2 sm:py-2.5 flex flex-col items-center justify-center gap-1.5 hover:border-[var(--theme-primary,#38BDF8)]/50 hover:bg-[var(--theme-card-hover,#19304A)] transition-colors shadow-xs cursor-pointer select-none"
              >
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.25))] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.3]" />
                </div>
                <span className="text-[10px] xs:text-[10.5px] sm:text-[11px] font-bold text-[var(--theme-text,#F8FAFC)] truncate max-w-full text-center px-0.5 group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* 4. FINANCIAL GOALS + LOANS & EMIs (Responsive 2-column bento) */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5"
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

      {/* 5. TOP CATEGORIES */}
      <motion.section
        className="space-y-2.5 sm:space-y-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.14))] border border-[var(--theme-primary-border,rgba(56,189,248,0.28))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-xs">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[16px] font-bold text-[var(--theme-text,#0F172A)] truncate">
                {isHindi ? 'कैटेगरी के अनुसार खर्च' : 'Top Categories'}
              </h3>
              <p className="hidden sm:block text-[9.5px] text-[var(--theme-text-dim,#64748B)] truncate">Your fund allocation at a glance</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#0284C7)] hover:opacity-80 cursor-pointer transition-opacity"
            >
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
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
              className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#0284C7)] hover:opacity-80 flex items-center gap-1 cursor-pointer transition-opacity"
            >
              {isViewMoreExpanded
                ? isHindi
                  ? 'कम श्रेणियां दिखाएं'
                  : 'Show Fewer Categories'
                : isHindi
                ? `+${overflowFunds.length} और देखें`
                : `View More Categories (+${overflowFunds.length})`}
              {isViewMoreExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span className="text-[9.5px] font-medium text-[var(--theme-text-dim,#64748B)]">{`6 of ${activeFunds.length} shown`}</span>
          </div>
        )}

        {isViewMoreExpanded && overflowFunds.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
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
        className="rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--theme-border,#213E61)]/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
              <History className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {isHindi ? 'हाल ही के लेन-देन' : 'Recent Transactions'}
              </h3>
              <p className="hidden sm:block text-[9.5px] text-[var(--theme-text-dim,#94A3B8)]">Your latest transactions</p>
            </div>
          </div>

          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 cursor-pointer shrink-0 hover:opacity-80 transition-opacity"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {entries
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 4)
            .map((entry) => (
              <div
                key={entry.id}
                className="min-w-0 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-2.5 sm:p-3 flex items-center justify-between gap-2 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${
                      entry.type === 'income'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    }`}
                  >
                    {entry.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] sm:text-xs font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                      {entry.category}
                    </span>
                    <span className="block text-[8px] sm:text-[9.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">{entry.date}</span>
                  </div>
                </div>
                <span
                  className={`font-mono font-extrabold text-[11px] sm:text-xs shrink-0 notranslate ${
                    entry.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                  translate="no"
                >
                  {entry.type === 'income' ? '+' : '-'}
                  {formatCurrency(entry.amount, privacyMask)}
                </span>
              </div>
            ))}

          {entries.length === 0 && (
            <div className="col-span-full text-center py-6 text-[11px] text-slate-500">
              {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
            </div>
          )}
        </div>
      </motion.section>

      {/* 7. MOTIVATIONAL / FINANCIAL HINT (Theme-aware frosted glass card) */}
      <motion.div
        onClick={handleNextTip}
        className="rounded-[20px] sm:rounded-2xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs cursor-pointer hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all select-none"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.14 }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-[var(--theme-text,#F8FAFC)] truncate">
            {FINANCIAL_TIPS[currentTipIndex]}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] shrink-0" />
      </motion.div>

      {/* 8. SECURITY & PRIVACY TRUST BADGE */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-emerald-400 font-semibold text-[9.5px] sm:text-[10.5px]">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Local Storage • Zero Telemetry</span>
      </div>

      <HomepageFundSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        funds={activeFunds}
        homepageFundIds={primaryFunds.map((f) => f.id)}
        onSaveHomepageFundIds={(ids: string[]) => {
          if (onUpdateHomepageFundIds) onUpdateHomepageFundIds(ids);
          setIsSelectorOpen(false);
        }}
        onOpenFundSettings={onOpenFundSettings}
        language={language}
      />
    </div>
  );
};

export default HomeView;
