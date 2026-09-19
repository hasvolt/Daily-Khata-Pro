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
  Sliders
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

  return (
    <div className="w-full max-w-6xl mx-auto pb-8 sm:pb-12 space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* 1. PRIMARY BALANCE */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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

      {/* 2. QUICK SUMMARY — compact, equal visual weight */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
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
          title={isHindi ? 'इस महीने का हिसाब' : "Monthly Summary"}
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
      </motion.section>

      {/* 3. QUICK OVERVIEW — important secondary information without large standalone sections */}
      <motion.section
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        {onNavigateLoans && (
          <LoanUdharWidget
            debtItems={debtItems}
            onOpenLedger={onNavigateLoans}
            onOpenAddModal={onOpenAddDebtModal || onNavigateLoans}
            language={language}
            privacyMask={privacyMask}
          />
        )}

        <ActiveGoalsWidget
          goals={goals}
          onOpenCreateGoal={onOpenCreateGoal}
          onOpenDepositGoal={onOpenDepositGoal}
          onNavigateGoals={onNavigateGoals}
          language={language}
          privacyMask={privacyMask}
        />
      </motion.section>

      {/* 4. MONEY CATEGORIES — kept as the main allocation overview */}
      <motion.section
        className="space-y-3 sm:space-y-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] shrink-0">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-[18px] font-bold tracking-tight text-[var(--theme-text,#F8FAFC)] truncate">
                {isHindi ? 'धन का बंटवारा (Categories)' : 'Money Categories'}
              </h3>
              <p className="hidden sm:block text-[11px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] truncate">
                {isHindi ? 'अपने पैसों को अलग-अलग जरूरतों के हिसाब से बांटें।' : 'Your money allocation at a glance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenFundSettings && (
              <button
                type="button"
                onClick={onOpenFundSettings}
                className="hidden sm:flex text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] px-2.5 py-1.5 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] transition-all cursor-pointer active:scale-95"
                title="Open Split Rule Settings"
              >
                {t.home.allocationRule}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[11px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#141B28)] px-3 py-1.5 rounded-xl border border-[var(--theme-border,rgba(255,255,255,0.08))] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Customize Homepage Fund Categories"
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span className="hidden sm:inline">{isHindi ? 'कस्टमाइज़' : 'Customize'}</span>
              <span className="sm:hidden">{isHindi ? '6' : '6'}</span>
            </button>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <button
              type="button"
              id="btn-view-more-categories"
              onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
              className="self-start text-[11px] sm:text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <span>
                {isViewMoreExpanded
                  ? (isHindi ? 'कम श्रेणियां दिखाएं' : 'Show Fewer Categories')
                  : (isHindi ? `+${overflowFunds.length} और देखें` : `View More Categories (+${overflowFunds.length})`)}
              </span>
              {isViewMoreExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <span className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi ? `${activeFunds.length} में से 6 दिखाए गए` : `6 of ${activeFunds.length} categories shown`}
            </span>
          </div>
        )}

        {isViewMoreExpanded && overflowFunds.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* 5. RECENT TRANSACTIONS — compact preview */}
      <motion.section
        className="bg-[var(--theme-card,#141B28)] border border-[var(--theme-border,rgba(255,255,255,0.08))] rounded-2xl p-3.5 sm:p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--theme-border,rgba(255,255,255,0.08))]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'हाल ही के लेन-देन' : 'Recent Transactions'}
              </h3>
              <p className="hidden sm:block text-[10px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi ? 'आपकी हाल की गतिविधि' : 'Your latest activity'}
              </p>
            </div>
          </div>

          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 font-bold text-[11px] sm:text-[12px] cursor-pointer hover:underline"
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="divide-y divide-[var(--theme-border,rgba(255,255,255,0.08))]">
          {entries
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 4)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 py-2.5 sm:py-3 min-w-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      entry.type === 'income'
                        ? 'bg-emerald-600/15 text-emerald-400'
                        : 'bg-rose-600/15 text-rose-400'
                    }`}
                  >
                    {entry.type === 'income' ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[12px] sm:text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                      {entry.category}
                    </span>
                    <span className="block text-[9.5px] sm:text-[10.5px] text-[var(--theme-text-muted,#94A3B8)] truncate">
                      {entry.date}
                    </span>
                  </div>
                </div>
                <span
                  className={`font-mono font-bold text-[12px] sm:text-[13px] shrink-0 ${
                    entry.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {entry.type === 'income' ? '+' : '-'}
                  {formatCurrency(entry.amount, privacyMask)}
                </span>
              </div>
            ))}

          {entries.length === 0 && (
            <div className="text-center py-6 text-[12px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-1 border-t border-[var(--theme-border,rgba(255,255,255,0.08))] text-emerald-400 font-semibold text-[10px] sm:text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {isHindi ? 'लोकल सैंडबॉक्स स्टोरेज • शून्य टेलीमेट्री' : 'Sandboxed Local Storage • Zero Telemetry'}
          </span>
        </div>
      </motion.section>
    </div>
  );
};

export default HomeView;
