import React, { useState, useMemo } from 'react';
import { Entry, FundType, FundConfig, AppLanguage } from '../types';
import { DEFAULT_FUNDS, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { getFundIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { getPageTranslation } from '../utils/pageTranslations';
import { HomepageFundSelectorModal } from './HomepageFundSelectorModal';
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const monthFormatted = today.toLocaleString(localeMap[language] || 'default', {
    month: 'short',
    year: 'numeric'
  });

  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  return (
    <div className="w-full max-w-6xl mx-auto pb-4 space-y-3 sm:space-y-6 animate-in fade-in duration-200">
      {/* 1. TOTAL NET BALANCE BANNER */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl sm:rounded-3xl p-3 sm:p-6 md:p-7 shadow-xl relative overflow-hidden transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6">
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[13px] font-extrabold uppercase tracking-widest text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 sm:gap-1.5">
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{t.home.netBalance}</span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-semibold text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-surface,#070E18)] px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border border-[var(--theme-border,#213E61)]">
                {dateFormatted}
              </span>
            </div>

            <div className="font-serif-display text-[18px] xs:text-[20px] sm:text-[28px] md:text-[34px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight leading-tight truncate max-w-full" title={formatCurrency(totalWealth, privacyMask)}>
              {formatCurrency(totalWealth, privacyMask)}
            </div>

            <p className="text-[10px] sm:text-[13px] text-[var(--theme-text-muted,#94A3B8)] leading-normal break-words">
              {pageT.common.netBalanceDesc}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 shrink-0">
            <button
              type="button"
              id="home-btn-add-income"
              onClick={() => onAddClick('income')}
              className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[#10B981]/15 border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#10B981] font-bold text-[11.5px] sm:text-[13px] flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
              <span>{t.home.addIncome}</span>
            </button>

            <button
              type="button"
              id="home-btn-add-expense"
              onClick={() => onAddClick('expense')}
              className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[#EF4444]/15 border border-[var(--theme-border,#213E61)] hover:border-[#EF4444] text-[#EF4444] font-bold text-[11.5px] sm:text-[13px] flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
              <span>{t.home.addExpense}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-5">
        {/* Daily Stats */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl sm:rounded-3xl p-2.5 sm:p-5 shadow-md space-y-2 sm:space-y-4">
          <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-[var(--theme-border,#213E61)]/70">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[13px] font-extrabold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)]">
              <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-[var(--theme-primary,#38BDF8)]/15">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
              </div>
              <span className="truncate">{t.home.dailySummaryHeading}</span>
            </div>
            <span className="text-[9.5px] sm:text-[12px] font-mono font-bold text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-surface,#070E18)] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-[var(--theme-border,#213E61)]">
              {pageT.common.today}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 min-w-0">
            <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[var(--theme-surface,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-0.5 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9.5px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium truncate">{t.home.todayIncome}</span>
              </div>
              <div className="font-mono font-bold text-[10px] xs:text-[12px] sm:text-[16px] text-[#10B981] tracking-tight truncate w-full block" title={formatCurrency(todayStats.income, privacyMask)}>
                +{formatCurrency(todayStats.income, privacyMask)}
              </div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[var(--theme-surface,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-0.5 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9.5px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium truncate">{t.home.todayExpense}</span>
              </div>
              <div className="font-mono font-bold text-[10px] xs:text-[12px] sm:text-[16px] text-[#EF4444] tracking-tight truncate w-full block" title={formatCurrency(todayStats.expense, privacyMask)}>
                -{formatCurrency(todayStats.expense, privacyMask)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/60 text-[10px] sm:text-[12.5px] min-w-0 overflow-hidden">
            <span className="text-[var(--theme-text-muted,#94A3B8)] font-medium truncate mr-1.5">{pageT.common.todaysNet}</span>
            <span className={`font-mono font-bold text-[11px] sm:text-[13.5px] truncate max-w-[60%] text-right ${todayStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`} title={formatCurrency(todayStats.net, privacyMask)}>
              {todayStats.net >= 0 ? '+' : ''}{formatCurrency(todayStats.net, privacyMask)}
            </span>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl sm:rounded-3xl p-2.5 sm:p-5 shadow-md space-y-2 sm:space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-[var(--theme-border,#213E61)]/70">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[13px] font-extrabold uppercase tracking-wider text-[var(--theme-text-muted,#94A3B8)] min-w-0">
              <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] shrink-0">
                <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="truncate">{t.home.monthlySummaryHeading}</span>
            </div>
            <span className="text-[9.5px] sm:text-[12px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-[#10B981]/30 shrink-0">
              {monthFormatted}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 min-w-0">
            <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[var(--theme-surface,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-0.5 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9.5px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium truncate">{t.home.thisMonthIncome}</span>
              </div>
              <div className="font-mono font-bold text-[10px] xs:text-[12px] sm:text-[16px] text-[#10B981] tracking-tight truncate w-full block" title={formatCurrency(monthStats.income, privacyMask)}>
                +{formatCurrency(monthStats.income, privacyMask)}
              </div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[var(--theme-surface,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-0.5 sm:space-y-1.5 min-w-0 overflow-hidden flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9.5px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium truncate">{t.home.thisMonthExpense}</span>
              </div>
              <div className="font-mono font-bold text-[10px] xs:text-[12px] sm:text-[16px] text-[#EF4444] tracking-tight truncate w-full block" title={formatCurrency(monthStats.expense, privacyMask)}>
                -{formatCurrency(monthStats.expense, privacyMask)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/60 text-[10px] sm:text-[12.5px] min-w-0 overflow-hidden">
            <span className="text-[var(--theme-text-muted,#94A3B8)] font-medium truncate mr-1.5">{t.home.thisMonthNet}:</span>
            <span className={`font-mono font-bold text-[11px] sm:text-[13.5px] truncate max-w-[60%] text-right ${monthStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`} title={formatCurrency(monthStats.net, privacyMask)}>
              {monthStats.net >= 0 ? '+' : ''}{formatCurrency(monthStats.net, privacyMask)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. 6-FUND ALLOCATION GRID & HOMEPAGE LIMIT */}
      <div className="space-y-2 sm:space-y-4 pt-1 sm:pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-[12px] sm:text-[17px] font-bold uppercase tracking-wider text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 sm:gap-2">
              <PieChart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{t.home.sixFundsHeading || 'Category Allocation'}</span>
            </h3>
            <p className="text-[9.5px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] break-words">
              {t.home.sixFundsSub}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[10px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] px-2.5 py-1 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Customize Homepage Fund Categories"
            >
              <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'कस्टमाइज़ (6)' : 'Customize Home (6)'}</span>
            </button>

            <span className="text-[9.5px] sm:text-[12px] font-mono font-bold text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-card,#132438)] px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-xl border border-[var(--theme-border,#213E61)]">
              {t.home.allocationRule}
            </span>
          </div>
        </div>

        {/* Primary 6 Open Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3.5">
          {primaryFunds.map((config) => {
            const FundIcon = getFundIcon(config.id, config.iconName);
            const pct = percentages[config.id] ?? config.defaultPct;
            const val = fundTotals[config.id] ?? 0;
            const isNeg = val < 0;
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
              <button
                type="button"
                key={config.id}
                onClick={() => onFilterFund(config.id)}
                className="group bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] rounded-lg sm:rounded-2xl p-2 sm:p-3.5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] text-left flex flex-col justify-between min-h-[92px] sm:min-h-[135px] min-w-0 w-full overflow-hidden"
                title={`Filter ledger by ${fundTranslatedName}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    <FundIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-[11.5px] text-[var(--theme-text,#F8FAFC)] font-mono font-bold bg-[var(--theme-surface,#070E18)] px-1.5 py-0.5 rounded border border-[var(--theme-border,#213E61)] shrink-0">
                    {pct}%
                  </span>
                </div>

                <div className="mt-1.5 min-w-0 w-full overflow-hidden">
                  <div className="text-[11px] sm:text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                    {fundTranslatedName}
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#64748B)] truncate mt-0.5 hidden xs:block">
                    {subtitle}
                  </div>
                  <div
                    className={`font-mono text-[11px] xs:text-[12px] sm:text-[14px] font-bold tracking-tight truncate max-w-full block mt-0.5 ${
                      isNeg ? 'text-[#EF4444]' : 'text-[var(--theme-text,#F8FAFC)]'
                    }`}
                    title={formatCurrency(val, privacyMask)}
                  >
                    {formatCurrency(val, privacyMask)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* View More Drawer for Categories beyond 6 */}
        {overflowFunds.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center justify-between py-1 px-1">
              <button
                type="button"
                onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
                className="text-[11.5px] sm:text-[13px] font-bold text-[var(--theme-primary,#38BDF8)] hover:text-white bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <span>
                  {isViewMoreExpanded
                    ? isHindi
                      ? 'कम श्रेणियां दिखाएं (Collapse)'
                      : 'Show Fewer Categories'
                    : isHindi
                    ? `और श्रेणियां देखें (+${overflowFunds.length} फंड्स)`
                    : `View More Categories (+${overflowFunds.length} More)`}
                </span>
                {isViewMoreExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <span className="text-[10px] sm:text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] font-medium">
                {isHindi
                  ? `होम पर 6 सक्रिय • कुल ${activeFunds.length} श्रेणियां`
                  : `6 open on Home • ${activeFunds.length} total`}
              </span>
            </div>

            {isViewMoreExpanded && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3.5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {overflowFunds.map((config) => {
                  const FundIcon = getFundIcon(config.id, config.iconName);
                  const pct = percentages[config.id] ?? config.defaultPct;
                  const val = fundTotals[config.id] ?? 0;
                  const isNeg = val < 0;
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
                    <button
                      type="button"
                      key={config.id}
                      onClick={() => onFilterFund(config.id)}
                      className="group bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] rounded-lg sm:rounded-2xl p-2 sm:p-3.5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] text-left flex flex-col justify-between min-h-[92px] sm:min-h-[135px] min-w-0 w-full overflow-hidden"
                      title={`Filter ledger by ${fundTranslatedName}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className="w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs"
                          style={{ backgroundColor: `${config.color}20`, color: config.color }}
                        >
                          <FundIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[9px] sm:text-[11.5px] text-[var(--theme-text,#F8FAFC)] font-mono font-bold bg-[var(--theme-surface,#070E18)] px-1.5 py-0.5 rounded border border-[var(--theme-border,#213E61)] shrink-0">
                          {pct}%
                        </span>
                      </div>

                      <div className="mt-1.5 min-w-0 w-full overflow-hidden">
                        <div className="text-[11px] sm:text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                          {fundTranslatedName}
                        </div>
                        <div className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#64748B)] truncate mt-0.5 hidden xs:block">
                          {subtitle}
                        </div>
                        <div
                          className={`font-mono text-[11px] xs:text-[12px] sm:text-[14px] font-bold tracking-tight truncate max-w-full block mt-0.5 ${
                            isNeg ? 'text-[#EF4444]' : 'text-[var(--theme-text,#F8FAFC)]'
                          }`}
                          title={formatCurrency(val, privacyMask)}
                        >
                          {formatCurrency(val, privacyMask)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. DYNAMIC FUND ALLOCATION BAR & SHORTCUTS */}
      <div className="bg-[var(--theme-card,#132438)]/80 border border-[var(--theme-border,#213E61)]/70 rounded-lg sm:rounded-2xl p-2 sm:p-4 space-y-2 sm:space-y-3 mt-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9.5px] sm:text-[11.5px] text-[var(--theme-text-muted,#94A3B8)]">
            <span className="flex items-center gap-1 sm:gap-1.5 font-semibold text-[var(--theme-text,#F8FAFC)]">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F59E0B]" />
              <span className="truncate">{pageT.common.disciplinedSplit}</span>
            </span>
            <span className="font-mono text-[9.5px] sm:text-[11px] text-[#10B981] font-bold shrink-0">100% Allocated</span>
          </div>
          
          <div className="w-full h-1.5 sm:h-2.5 bg-[var(--theme-surface,#070E18)] rounded-full overflow-hidden flex border border-[var(--theme-border,#213E61)]/50">
            {activeFunds.map((f) => {
              const pct = percentages[f.id] ?? f.defaultPct;
              return (
                <div
                  key={f.id}
                  style={{ width: `${pct}%`, backgroundColor: f.color }}
                  className="h-full transition-all duration-300 relative group"
                  title={`${f.label}: ${pct}%`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-[var(--theme-border,#213E61)]/40 text-[9.5px] sm:text-[11.5px]">
          <div className="flex items-center gap-1 text-[#10B981] font-medium text-[9.5px] sm:text-[11px]">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#10B981] shrink-0" />
            <span className="truncate">{pageT.common.safeOffline}</span>
          </div>

          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="inline-flex items-center gap-1 text-[var(--theme-primary,#38BDF8)] hover:underline font-semibold cursor-pointer transition-colors"
            >
              <span className="truncate">{pageT.common.viewLedger}</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
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
