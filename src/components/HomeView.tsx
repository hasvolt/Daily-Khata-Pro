import React, { useState, useMemo } from 'react';
import { Entry, FundType, FundConfig, AppLanguage } from '../types';
import { DEFAULT_FUNDS, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { getFundIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { getPageTranslation } from '../utils/pageTranslations';
import { HomepageFundSelectorModal } from './HomepageFundSelectorModal';
import { BankingCard3D } from './BankingCard3D';
import { FundCard3D } from './FundCard3D';
import { HasVoltPromoBanner } from './HasVoltPromoBanner';
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
  Layers
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
  language = 'en',
  privacyMask = false
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
    <div className="w-full max-w-6xl mx-auto pb-4 space-y-4 sm:space-y-7 animate-in fade-in duration-200">
      {/* 1. TOTAL NET BALANCE BANNER (3D Animated) */}
      <BankingCard3D 
        totalWealth={totalWealth}
        formatCurrency={formatCurrency}
        privacyMask={privacyMask}
        dateFormatted={dateFormatted}
        t={t}
        pageT={pageT}
        onAddClick={onAddClick}
      />

      {/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Stats */}
        <div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border,#0D2654)]/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] shadow-xs shrink-0 transition-colors">
                <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                  {t.home.dailySummaryHeading}
                </span>
                <span className="text-[10px] sm:text-[11.5px] text-[var(--theme-text-muted,#7E9BC9)] block truncate">
                  Track your daily income, expense and see your net result.
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11.5px] font-semibold text-[var(--theme-text-muted,#8BA4D0)] bg-[var(--theme-surface,#020A1A)] px-2.5 py-1 rounded-lg border border-[var(--theme-border,#0A2249)] shrink-0">
              {pageT.common.today}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 min-w-0">
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center select-none secure-sensitive" data-sensitive="true">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate">{t.home.todayIncome}</span>
              </div>
              <div className="font-mono font-bold text-[12px] xs:text-[14px] sm:text-[18px] text-emerald-600 dark:text-emerald-400 tracking-tight truncate w-full block sensitive-amount" title={formatCurrency(todayStats.income, privacyMask)}>
                +{formatCurrency(todayStats.income, privacyMask)}
              </div>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center select-none secure-sensitive" data-sensitive="true">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-600/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate">{t.home.todayExpense}</span>
              </div>
              <div className="font-mono font-bold text-[12px] xs:text-[14px] sm:text-[18px] text-rose-600 dark:text-rose-400 tracking-tight truncate w-full block sensitive-amount" title={formatCurrency(todayStats.expense, privacyMask)}>
                -{formatCurrency(todayStats.expense, privacyMask)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] text-[11px] sm:text-[13px] min-w-0 overflow-hidden relative select-none secure-sensitive" data-sensitive="true">
            <span className="text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate mr-1.5 z-10">{pageT.common.todaysNet}</span>
            <span className={`font-mono font-bold text-[12px] sm:text-[15px] truncate max-w-[60%] text-right z-10 sensitive-amount ${todayStats.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} title={formatCurrency(todayStats.net, privacyMask)}>
              {todayStats.net >= 0 ? '+' : ''}{formatCurrency(todayStats.net, privacyMask)}
            </span>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 sm:space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border,#0D2654)]/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] shadow-xs shrink-0 transition-colors">
                <CalendarDays className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                  {t.home.monthlySummaryHeading}
                </span>
                <span className="text-[10px] sm:text-[11.5px] text-[var(--theme-text-muted,#7E9BC9)] block truncate">
                  Track your monthly income, expense and see your net result.
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11.5px] font-semibold text-[#38BDF8] bg-[#38BDF8]/15 px-2.5 py-1 rounded-lg border border-[#38BDF8]/30 shrink-0 select-none secure-sensitive">
              {monthFormatted}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 min-w-0">
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center select-none secure-sensitive" data-sensitive="true">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate">{t.home.thisMonthIncome}</span>
              </div>
              <div className="font-mono font-bold text-[12px] xs:text-[14px] sm:text-[18px] text-emerald-600 dark:text-emerald-400 tracking-tight truncate w-full block sensitive-amount" title={formatCurrency(monthStats.income, privacyMask)}>
                +{formatCurrency(monthStats.income, privacyMask)}
              </div>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-1 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center select-none secure-sensitive" data-sensitive="true">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-600/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate">{t.home.thisMonthExpense}</span>
              </div>
              <div className="font-mono font-bold text-[12px] xs:text-[14px] sm:text-[18px] text-rose-600 dark:text-rose-400 tracking-tight truncate w-full block sensitive-amount" title={formatCurrency(monthStats.expense, privacyMask)}>
                -{formatCurrency(monthStats.expense, privacyMask)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] text-[11px] sm:text-[13px] min-w-0 overflow-hidden select-none secure-sensitive" data-sensitive="true">
            <span className="text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate mr-1.5">{t.home.thisMonthNet}:</span>
            <span className={`font-mono font-bold text-[12px] sm:text-[15px] truncate max-w-[60%] text-right sensitive-amount ${monthStats.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} title={formatCurrency(monthStats.net, privacyMask)}>
              {monthStats.net >= 0 ? '+' : ''}{formatCurrency(monthStats.net, privacyMask)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. 6-FUND ALLOCATION GRID & HOMEPAGE LIMIT */}
      <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] shadow-xs shrink-0 transition-colors">
              <PieChart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <h3 className="text-[15px] sm:text-[18px] font-bold tracking-tight text-[var(--theme-text,#F8FAFC)]">
                {t.home.sixFundsHeading || '6-Fund Money Pots'}
              </h3>
              <p className="text-[10.5px] sm:text-[12px] text-[var(--theme-text-muted,#7E9BC9)]">
                {t.home.sixFundsSub || 'Distribute your money into smart pots and stay financially balanced.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[11px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#040E24)] hover:bg-[#07173B] px-3 py-1.5 rounded-xl border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Customize Homepage Fund Categories"
            >
              <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{isHindi ? 'कस्टमाइज़ (6)' : 'Customize Home (6)'}</span>
            </button>

            <span className="text-[10px] sm:text-[11.5px] font-mono font-bold text-[var(--theme-text-muted,#8BA4D0)] bg-[var(--theme-card,#040E24)] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#0D2654)]">
              {t.home.allocationRule}
            </span>
          </div>
        </div>

        {/* Primary 6 Open Categories - 3 Columns Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 py-1.5 px-0.5">
              <button
                type="button"
                onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
                className="text-[12px] sm:text-[13px] font-extrabold text-[#0284C7] dark:text-[#38BDF8] hover:text-white bg-[var(--theme-card,#040E24)] border-2 border-[#0284C7]/40 hover:border-[#0284C7] px-3.5 py-1.5 rounded-xl flex items-center justify-between sm:justify-start gap-2 transition-all shadow-xs cursor-pointer active:scale-98 shrink-0"
              >
                <span>
                  {isViewMoreExpanded
                    ? isHindi
                      ? 'कम श्रेणियां दिखाएं (Collapse)'
                      : 'Show Fewer Categories'
                    : isHindi
                    ? `+${overflowFunds.length} और श्रेणियां देखें`
                    : `View More Categories (+${overflowFunds.length} More)`}
                </span>
                {isViewMoreExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] stroke-[2.5] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] stroke-[2.5] shrink-0" />
                )}
              </button>

              <span className="text-[10px] sm:text-[11.5px] text-[var(--theme-text-muted,#8BA4D0)] font-medium self-end sm:self-center px-1">
                {isHindi
                  ? `होम पर 6 सक्रिय • कुल ${activeFunds.length} श्रेणियां`
                  : `6 open on Home • ${activeFunds.length} total`}
              </span>
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
      </div>

      {/* 5. BOTTOM 2-COLUMN SECTION: RECENT TRANSACTIONS + HASVOLT SPONSORED PROMO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch pt-2">
        {/* Recent Transactions Card */}
        <div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-2xl p-3.5 sm:p-5 shadow-md flex flex-col justify-between space-y-3 transition-all duration-300">
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
                className="text-[#0284C7] dark:text-[#38BDF8] hover:underline flex items-center gap-1 font-extrabold text-[12px] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1">
            {entries.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map(entry => (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] hover:border-[#1E4E9E] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${entry.type === 'income' ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-600/20 text-rose-600 dark:text-rose-400'}`}>
                    {entry.type === 'income' ? <ArrowUpRight className="w-4 h-4 stroke-[2.5]" /> : <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12.5px] sm:text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate max-w-[140px] sm:max-w-[180px]">
                      {entry.category}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted,#7E9BC9)] truncate">
                      {entry.date}
                    </span>
                  </div>
                </div>
                <div className={`font-mono font-bold text-[12.5px] sm:text-[14px] shrink-0 ${entry.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount, privacyMask)}
                </div>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="text-center py-6 text-[12px] text-[var(--theme-text-muted,#7E9BC9)] font-medium">
                {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-[var(--theme-border,#0D2654)]/80 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{pageT.common.safeOffline}</span>
          </div>
        </div>

        {/* HasVolt Sponsored Ad Card */}
        <div className="h-full">
          <HasVoltPromoBanner variant="card" language={language} />
        </div>
      </div>

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
