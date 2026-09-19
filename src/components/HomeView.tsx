import React, { useState, useMemo } from 'react';
import { Entry, FundType, FundConfig, AppLanguage, CategoryBudget, DebtItem, Goal } from '../types';
import { DEFAULT_FUNDS, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
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
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
  Calendar,
  CalendarDays,
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
  CreditCard,
  Calculator,
  BarChart3,
  Clock3,
  Grid2X2,
  Lightbulb
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
  language = 'en',
  privacyMask = false,
  budgets = [],
  onOpenBudgetManager,
  debtItems = [],
  onNavigateLoans,
  onOpenAddDebtModal,
  goals = [],
  onOpenCreateGoal,
  onOpenDepositGoal,
  ...rest
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

  return (
    <div className="w-full max-w-6xl mx-auto pb-8 sm:pb-12 space-y-3 sm:space-y-4 animate-in fade-in duration-200">
      {/* 1. TOTAL BALANCE — keep the existing functional card */}
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

      {/* 2. QUICK SUMMARY */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
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
          title={isHindi ? 'इस महीने का हिसाब' : "This Month"}
          subtitle={isHindi ? 'महीने की कुल कमाई, खर्च व बचत' : 'Monthly income, expense & savings'}
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
      </motion.div>

      {/* 3. QUICK ACCESS — new homepage layer */}
      <motion.section
        className="rounded-2xl border border-[var(--theme-primary-border,rgba(56,189,248,0.28))] bg-[linear-gradient(145deg,rgba(8,47,73,0.42),rgba(15,23,42,0.82))] p-3 sm:p-4 shadow-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'त्वरित एक्सेस' : 'Quick Access'}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi ? 'सबसे ज्यादा इस्तेमाल होने वाले फीचर्स' : 'Most-used features in one place'}
              </p>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-cyan-400 shrink-0">
            {isHindi ? 'मैनेज' : 'Manage'} →
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button type="button" onClick={onNavigateGoals} className="group rounded-xl border border-white/5 bg-slate-900/60 hover:bg-cyan-500/10 p-2.5 text-center transition-all active:scale-95">
            <span className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-400/15">
              <Target className="w-5 h-5" />
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-200">Goals</span>
          </button>

          <button type="button" onClick={onNavigateLoans} className="group rounded-xl border border-white/5 bg-slate-900/60 hover:bg-cyan-500/10 p-2.5 text-center transition-all active:scale-95">
            <span className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/15">
              <CreditCard className="w-5 h-5" />
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-200">Loans</span>
          </button>

          <button type="button" onClick={() => callOptionalNavigation('onNavigateCalculator')} className="group rounded-xl border border-white/5 bg-slate-900/60 hover:bg-cyan-500/10 p-2.5 text-center transition-all active:scale-95">
            <span className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/15">
              <Calculator className="w-5 h-5" />
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-200">Calculator</span>
          </button>

          <button type="button" onClick={() => callOptionalNavigation('onNavigateReports')} className="group rounded-xl border border-white/5 bg-slate-900/60 hover:bg-cyan-500/10 p-2.5 text-center transition-all active:scale-95">
            <span className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-400/15">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-200">Reports</span>
          </button>

          <button type="button" onClick={onViewHistory} className="group rounded-xl border border-white/5 bg-slate-900/60 hover:bg-cyan-500/10 p-2.5 text-center transition-all active:scale-95">
            <span className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/15">
              <Clock3 className="w-5 h-5" />
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-200">History</span>
          </button>

          <button type="button" onClick={() => setIsSelectorOpen(true)} className="group rounded-xl border border-white/5 bg-slate-900/60 hover:bg-cyan-500/10 p-2.5 text-center transition-all active:scale-95">
            <span className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-400/15">
              <Grid2X2 className="w-5 h-5" />
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-200">Categories</span>
          </button>
        </div>
      </motion.section>

      {/* 4. GOALS + LOANS PREVIEW — existing functional widgets, now grouped */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <div className="min-w-0">
          <ActiveGoalsWidget
            goals={goals}
            onOpenCreateGoal={onOpenCreateGoal}
            onOpenDepositGoal={onOpenDepositGoal}
            onNavigateGoals={onNavigateGoals}
            language={language}
            privacyMask={privacyMask}
          />
        </div>

        {onNavigateLoans && (
          <div className="min-w-0">
            <LoanUdharWidget
              debtItems={debtItems}
              onOpenLedger={onNavigateLoans}
              onOpenAddModal={onOpenAddDebtModal || onNavigateLoans}
              language={language}
              privacyMask={privacyMask}
            />
          </div>
        )}
      </motion.div>

      {/* 5. TOP CATEGORIES */}
      <motion.section
        className="space-y-3 sm:space-y-4 pt-1"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 shrink-0">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'मुख्य श्रेणियां' : 'Top Categories'}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted,#94A3B8)] truncate">
                {isHindi ? 'आपके पैसों का एक नजर में बंटवारा' : 'Your money allocation at a glance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/70 px-2.5 py-1.5 text-[10px] font-bold text-slate-200 hover:border-cyan-400/30 hover:text-cyan-300 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              Customize
            </button>
            <span className="text-[10px] sm:text-xs font-bold text-cyan-400">View All ›</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
            const subtitle =
              pageT.homeSubtitles?.[config.id] ||
              t.funds?.[config.id]?.desc ||
              config.description ||
              config.label;

            return (
              <FundCard3D
                key={config.id}
                config={config}
                val={val}
                pct={pct}
                fundTranslatedName={fundTranslatedName}
                subtitle={subtitle}
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
          <div className="flex items-center justify-between gap-3 px-1">
            <button
              type="button"
              id="btn-view-more-categories"
              onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
              className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isViewMoreExpanded
                ? (isHindi ? 'कम श्रेणियां दिखाएं' : 'Show Fewer Categories')
                : (isHindi ? `+${overflowFunds.length} और श्रेणियां देखें` : `View More Categories (+${overflowFunds.length})`)}
              {isViewMoreExpanded ? ' ↑' : ' ↓'}
            </button>
            <span className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi ? `${activeFunds.length} में से 6` : `6 of ${activeFunds.length} shown`}
            </span>
          </div>
        )}

        {isViewMoreExpanded && overflowFunds.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
              const subtitle =
                pageT.homeSubtitles?.[config.id] ||
                t.funds?.[config.id]?.desc ||
                config.description ||
                config.label;

              return (
                <FundCard3D
                  key={config.id}
                  config={config}
                  val={val}
                  pct={pct}
                  fundTranslatedName={fundTranslatedName}
                  subtitle={subtitle}
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

      {/* 6. RECENT TRANSACTIONS — compact 4-item preview */}
      <motion.section
        className="rounded-2xl border border-[var(--theme-primary-border,rgba(56,189,248,0.2))] bg-[var(--theme-card,#0B1220)] p-3 sm:p-4 shadow-lg"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400">
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'हाल के लेन-देन' : 'Recent Transactions'}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi ? 'आपकी हाल की गतिविधि' : 'Your latest activity'}
              </p>
            </div>
          </div>
          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {entries
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 4)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/45 px-2.5 py-2.5 sm:px-3 sm:py-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      entry.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {entry.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">
                      {entry.category}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 truncate">
                      {entry.date}
                    </div>
                  </div>
                </div>
                <span
                  className={`font-mono text-[11px] sm:text-xs font-bold shrink-0 ${
                    entry.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {entry.type === 'income' ? '+' : '-'}
                  {formatCurrency(entry.amount, privacyMask)}
                </span>
              </div>
            ))}

          {entries.length === 0 && (
            <div className="sm:col-span-2 text-center py-6 text-xs text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-3 mt-3 border-t border-white/5 text-[9px] sm:text-[10px] text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{isHindi ? 'लोकल स्टोरेज • शून्य टेलीमेट्री' : 'Local Storage • Zero Telemetry'}</span>
        </div>
      </motion.section>

      {/* 7. MOTIVATIONAL HINT */}
      <motion.div
        className="flex items-center gap-3 rounded-2xl border border-[var(--theme-primary-border,rgba(56,189,248,0.22))] bg-[linear-gradient(145deg,rgba(8,47,73,0.38),rgba(15,23,42,0.82))] px-3.5 py-3 sm:px-4 sm:py-3.5"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/15 shrink-0">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
            {isHindi ? 'आज का छोटा कदम' : 'Small Steps Today'}
          </span>
          <span className="mx-2 text-cyan-400">→</span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-100">
            {isHindi ? 'कल की बेहतर वित्तीय आज़ादी' : 'Bigger Financial Freedom Tomorrow'}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
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
