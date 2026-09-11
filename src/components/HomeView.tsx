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
  HardDrive
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
    <div className="w-full max-w-6xl mx-auto pb-4 space-y-3 sm:space-y-7 animate-in fade-in duration-200">
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

      {/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Today 3D Summary Card */}
        <SummaryCard3D
          type="daily"
          title={isHindi ? 'आज का सारांश' : 'Today Summary'}
          subtitle={isHindi ? 'आज की आय, खर्च व नेट कैशफ्लो का विवरण' : 'Income, expense & net cashflow for today'}
          periodBadge={pageT.common.today}
          incomeLabel={t.home.todayIncome}
          incomeValue={todayStats.income}
          expenseLabel={t.home.todayExpense}
          expenseValue={todayStats.expense}
          netLabel={isHindi ? 'आज का नेट बैलेंस:' : 'Today Net Balance:'}
          netValue={todayStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
        />

        {/* Monthly 3D Summary Card */}
        <SummaryCard3D
          type="monthly"
          title={isHindi ? 'महीने का सारांश' : 'Monthly Summary'}
          subtitle={isHindi ? 'मासिक वित्तीय प्रदर्शन व संचयी बैलेंस' : 'Monthly performance & cumulative balance'}
          periodBadge={monthFormatted}
          incomeLabel={t.home.thisMonthIncome}
          incomeValue={monthStats.income}
          expenseLabel={t.home.thisMonthExpense}
          expenseValue={monthStats.expense}
          netLabel={t.home.thisMonthNet}
          netValue={monthStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
        />
      </motion.div>

      {/* 2.6 Advance Loans, EMIs & Udhar Ledger Overview Widget */}
      {onNavigateLoans && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <LoanUdharWidget
            debtItems={debtItems}
            onOpenLedger={onNavigateLoans}
            onOpenAddModal={onOpenAddDebtModal || onNavigateLoans}
            language={language}
            privacyMask={privacyMask}
          />
        </motion.div>
      )}

      {/* 2.7 Active Financial Goals & Savings Milestones Widget */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ActiveGoalsWidget
          goals={goals}
          onOpenCreateGoal={onOpenCreateGoal}
          onOpenDepositGoal={onOpenDepositGoal}
          onNavigateGoals={onNavigateGoals}
          language={language}
          privacyMask={privacyMask}
        />
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
                {isHindi ? 'धन का बंटवारा (Categories)' : 'Money Categories'}
              </h3>
              <p className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#7E9BC9)]">
                {isHindi ? 'अपने पैसों को अलग-अलग जरूरतों के हिसाब से बांटें।' : 'Divide your money into different purpose-driven categories.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[11px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#040E24)] hover:bg-[var(--theme-surface,#07173B)] px-3 py-1.5 rounded-xl border border-[var(--theme-border,#0D2654)] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
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

        {/* Primary 6 Open Categories - 3 Columns Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
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
                <span className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-medium">
                  {isHindi
                    ? `होम पर 6 सक्रिय • कुल ${activeFunds.length} श्रेणियां`
                    : `6 open on Home • ${activeFunds.length} total categories`}
                </span>
              </div>
            </div>

            {isViewMoreExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
        <div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.4))] rounded-2xl p-3.5 sm:p-5 shadow-md flex flex-col justify-between space-y-3 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between text-[13px] sm:text-[14px] font-semibold text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,#0D2654)]/80 pb-2.5">
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
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] hover:border-[#1E4E9E] transition-colors relative overflow-hidden group/item"
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
                      <span className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted,#7E9BC9)] truncate">
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
              <div className="text-center py-6 text-[12px] text-[var(--theme-text-muted,#7E9BC9)] font-medium">
                {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-[var(--theme-border,#0D2654)]/80 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{isHindi ? 'लोकल सैंडबॉक्स स्टोरेज • शून्य टेलीमेट्री' : 'Sandboxed Local Storage • Zero Telemetry'}</span>
          </div>
        </div>

        {/* Security Assurance Card */}
        <div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[var(--theme-primary,#38BDF8)]/40 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-3.5 relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.25))] text-[var(--theme-primary,#38BDF8)] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight truncate">
                {isHindi ? 'लोकल स्टोरेज व डेटा सुरक्षा' : 'Local Storage & Data Privacy'}
              </h4>
              <p className="text-[10.5px] sm:text-[11.5px] text-[var(--theme-text-muted,#7E9BC9)] line-clamp-2 leading-relaxed mt-0.5">
                {isHindi ? 'समस्त वित्तीय प्रविष्टियां आपके डिवाइस के स्थानीय स्टोरेज में सहेजी जाती हैं। कोई बाहरी ट्रैकिंग या सर्वर सिंक नहीं।' : 'All financial logs remain sandboxed in your device storage with zero remote telemetry.'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1">
              <HardDrive className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="text-[10px] font-bold text-[var(--theme-text,#F8FAFC)] block leading-tight">
                {isHindi ? 'लोकल स्टोरेज' : 'Client Storage'}
              </span>
              <span className="text-[8.5px] text-[var(--theme-text-muted,#7E9BC9)] block uppercase tracking-wider">
                {isHindi ? 'डिवाइस सैंडबॉक्स' : 'Local Device'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1">
              <EyeOff className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-[var(--theme-text,#F8FAFC)] block leading-tight">
                {isHindi ? 'शून्य टेलीमेट्री' : 'Zero Telemetry'}
              </span>
              <span className="text-[8.5px] text-[var(--theme-text-muted,#7E9BC9)] block uppercase tracking-wider">
                {isHindi ? 'शून्य रिमोट सिंक' : 'No Remote Sync'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1">
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold text-[var(--theme-text,#F8FAFC)] block leading-tight">
                {isHindi ? 'एक्सेस कंट्रोल' : 'Access Control'}
              </span>
              <span className="text-[8.5px] text-[var(--theme-text-muted,#7E9BC9)] block uppercase tracking-wider">
                {isHindi ? 'पिन लॉक' : 'PIN & Biometric'}
              </span>
            </div>
          </div>
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
