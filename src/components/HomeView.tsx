import React from 'react';
import { Entry, FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { TRANSLATIONS } from '../utils/translations';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Home as HomeIcon,
  ShieldAlert,
  HeartPulse,
  PiggyBank,
  TrendingUp,
  LucideIcon,
  Calendar,
  CalendarDays,
  Wallet,
  PieChart,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const FUND_ICONS: Record<FundType, LucideIcon> = {
  personal: User,
  family: HomeIcon,
  buffer: ShieldAlert,
  emergency: HeartPulse,
  saving: PiggyBank,
  investment: TrendingUp
};

const FUND_SUBTITLES: Record<FundType, { en: string; hi: string }> = {
  personal: { en: 'Personal needs & lifestyle', hi: 'व्यक्तिगत जरूरतें व खर्च' },
  family: { en: 'Household, rent & grocery', hi: 'घर, किराया, राशन व परिवार' },
  buffer: { en: 'Daily unexpected expenses', hi: 'दैनिक अप्रत्याशित खर्चे' },
  emergency: { en: 'Crisis & medical safety', hi: 'आपातकालीन व चिकित्सा फंड' },
  saving: { en: 'Short-term savings & gadgets', hi: 'बचत, गैजेट्स व खरीदारी' },
  investment: { en: 'Long-term compounding & wealth', hi: 'दीर्घकालिक निवेश व समृद्धि' }
};

interface HomeViewProps {
  entries: Entry[];
  percentages: Record<FundType, number>;
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
  onAddClick,
  onFilterFund,
  onViewHistory,
  onNavigateGoals,
  language = 'en',
  privacyMask = false
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi';

  const todayStats = calculatePeriodStats(entries, { type: 'today' });
  const monthStats = calculatePeriodStats(entries, { type: 'month' });
  const fundTotals = calculateFundTotals(entries);

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  return (
    <div className="w-full space-y-6 sm:space-y-7 animate-in fade-in duration-200 text-left max-w-6xl mx-auto pb-4">
      {/* 1. TOTAL NET BALANCE (Clean, High-Contrast Executive Banner) */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Total Net Balance & Date */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-widest text-[#94A3B8] flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{t.home.netBalance}</span>
              </span>
              <span className="text-[11px] font-semibold text-[#64748B] bg-[var(--theme-bg,#070E18)] px-2.5 py-0.5 rounded-full border border-[var(--theme-border,#213E61)]">
                {dateFormatted}
              </span>
            </div>

            <div className="font-serif-display text-[38px] sm:text-[50px] font-bold text-[#F8FAFC] tracking-tight leading-none pt-1">
              {formatCurrency(totalWealth, privacyMask)}
            </div>

            <p className="text-[12.5px] sm:text-[13.5px] text-[#94A3B8] pt-1">
              {isHindi 
                ? '6-फंड ऑटो-स्प्लिट नियम के अनुसार आपका कुल सुरक्षित संचित बैलेंस'
                : 'Consolidated real-time net balance managed across all 6 financial pots'}
            </p>
          </div>

          {/* Right: Direct Primary Actions (+ Add Income / + Add Expense) */}
          <div className="grid grid-cols-2 gap-3.5 sm:flex sm:items-center sm:gap-4 shrink-0">
            <button
              type="button"
              id="home-btn-add-income"
              onClick={() => onAddClick('income')}
              className="min-h-[48px] py-2.5 px-6 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-[#04140D] font-extrabold text-[14.5px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap hover:shadow-[#10B981]/25"
            >
              <Plus className="w-5 h-5 stroke-[3] shrink-0" />
              <span>{t.home.addIncome}</span>
            </button>

            <button
              type="button"
              id="home-btn-add-expense"
              onClick={() => onAddClick('expense')}
              className="min-h-[48px] py-2.5 px-6 rounded-2xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[#EF4444]/15 border-2 border-[#EF4444]/60 text-[#EF4444] font-extrabold text-[14.5px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap hover:border-[#EF4444]"
            >
              <Plus className="w-5 h-5 stroke-[3] shrink-0" />
              <span>{t.home.addExpense}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE (Clean 2-Card Desktop Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 2. DAILY (TODAY'S) INCOME & EXPENSE */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border,#213E61)]/70">
            <div className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)]">
              <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15">
                <Calendar className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              </div>
              <span>{t.home.dailySummaryHeading}</span>
            </div>
            <span className="text-[12px] font-mono font-bold text-[#94A3B8] bg-[var(--theme-bg,#070E18)] px-2.5 py-1 rounded-lg border border-[var(--theme-border,#213E61)]">
              {isHindi ? 'आज' : 'Today'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Today Income */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[12px] text-[#94A3B8] font-medium">{t.home.todayIncome}</span>
              </div>
              <div className="font-mono font-bold text-[18px] sm:text-[22px] text-[#10B981] tracking-tight">
                +{formatCurrency(todayStats.income, privacyMask)}
              </div>
            </div>

            {/* Today Expense */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[12px] text-[#94A3B8] font-medium">{t.home.todayExpense}</span>
              </div>
              <div className="font-mono font-bold text-[18px] sm:text-[22px] text-[#EF4444] tracking-tight">
                -{formatCurrency(todayStats.expense, privacyMask)}
              </div>
            </div>
          </div>

          {/* Today Net Diff */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/60 text-[12.5px]">
            <span className="text-[#94A3B8] font-medium">{isHindi ? 'आज का नेट बैलेंस:' : "Today's Net Cashflow:"}</span>
            <span className={`font-mono font-bold text-[14px] ${todayStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {todayStats.net >= 0 ? '+' : ''}{formatCurrency(todayStats.net, privacyMask)}
            </span>
          </div>
        </div>

        {/* 3. MONTHLY (THIS MONTH'S) INCOME & EXPENSE */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border,#213E61)]/70">
            <div className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
              <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)]">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span>{t.home.monthlySummaryHeading}</span>
            </div>
            <span className="text-[12px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-lg border border-[#10B981]/30">
              {today.toLocaleString(isHindi ? 'hi-IN' : 'default', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Month Income */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[12px] text-[#94A3B8] font-medium">{t.home.thisMonthIncome}</span>
              </div>
              <div className="font-mono font-bold text-[18px] sm:text-[22px] text-[#10B981] tracking-tight">
                +{formatCurrency(monthStats.income, privacyMask)}
              </div>
            </div>

            {/* Month Expense */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[12px] text-[#94A3B8] font-medium">{t.home.thisMonthExpense}</span>
              </div>
              <div className="font-mono font-bold text-[18px] sm:text-[22px] text-[#EF4444] tracking-tight">
                -{formatCurrency(monthStats.expense, privacyMask)}
              </div>
            </div>
          </div>

          {/* Month Net Diff */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/60 text-[12.5px]">
            <span className="text-[#94A3B8] font-medium">{t.home.thisMonthNet}:</span>
            <span className={`font-mono font-bold text-[14px] ${monthStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {monthStats.net >= 0 ? '+' : ''}{formatCurrency(monthStats.net, privacyMask)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. 6-FUND MONEY ALLOCATION POTS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
          <div>
            <h3 className="text-[15px] sm:text-[17px] font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{t.home.sixFundsHeading}</span>
            </h3>
            <p className="text-[12px] text-[#94A3B8]">
              {isHindi
                ? 'हर आय का 6 महत्वपूर्ण श्रेणियों में अनुशासित ऑटो-विभाजन (क्लिक करके लेज़र फ़िल्टर करें)'
                : 'Disciplined wealth allocation across 6 pots (Click any fund pot to inspect ledger)'}
            </p>
          </div>
          <span className="text-[12px] font-mono font-bold text-[#94A3B8] bg-[var(--theme-card,#132438)] px-3 py-1 rounded-xl border border-[var(--theme-border,#213E61)] shrink-0 self-start sm:self-auto">
            {t.home.allocationRule}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {FUND_ORDER.map((f) => {
            const config = FUND_CONFIGS[f];
            const FundIcon = FUND_ICONS[f];
            const pct = percentages[f] ?? config.defaultPct;
            const val = fundTotals[f] ?? 0;
            const isNeg = val < 0;
            const fundTranslatedName = t.funds?.[f]?.name ? t.funds[f].name.split(' (')[0] : FUND_LABELS[f];
            const subtitle = isHindi ? FUND_SUBTITLES[f].hi : FUND_SUBTITLES[f].en;

            return (
              <button
                type="button"
                key={f}
                onClick={() => onFilterFund(f)}
                className="group bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] text-left flex flex-col justify-between min-h-[145px]"
                title={`Filter ledger by ${fundTranslatedName}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    <FundIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[11.5px] text-[#F8FAFC] font-mono font-bold bg-[var(--theme-bg,#070E18)] px-2.5 py-0.5 rounded-lg border border-[var(--theme-border,#213E61)]">
                    {pct}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[13.5px] sm:text-[14.5px] font-bold text-[#F8FAFC] truncate group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                    {fundTranslatedName}
                  </div>
                  <div className="text-[10.5px] text-[#64748B] truncate mt-0.5">
                    {subtitle}
                  </div>
                  <div
                    className={`font-serif-display text-[17px] sm:text-[19px] font-bold tracking-tight truncate mt-1.5 ${
                      isNeg ? 'text-[#EF4444]' : 'text-[#F8FAFC]'
                    }`}
                  >
                    {formatCurrency(val, privacyMask)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 5. 6-FUND ALLOCATION BAR & INSTANT SHORTCUTS STRIP */}
        <div className="bg-[var(--theme-card,#132438)]/70 border border-[var(--theme-border,#213E61)]/70 rounded-2xl p-3 sm:p-4 space-y-3 mt-1">
          {/* Multi-color Segments Allocation Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11.5px] text-[#94A3B8]">
              <span className="flex items-center gap-1.5 font-semibold text-[#F8FAFC]">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{isHindi ? '100% अनुशासित विभाजन नियम' : '100% Disciplined Split Ratio'}</span>
              </span>
              <span className="font-mono text-[11px] text-[#10B981] font-bold">100% Allocated</span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-[#070E18] rounded-full overflow-hidden flex border border-[var(--theme-border,#213E61)]/50">
              {FUND_ORDER.map((f) => {
                const config = FUND_CONFIGS[f];
                const pct = percentages[f] ?? config.defaultPct;
                return (
                  <div
                    key={f}
                    style={{ width: `${pct}%`, backgroundColor: config.color }}
                    className="h-full transition-all duration-300 relative group"
                    title={`${FUND_LABELS[f]}: ${pct}%`}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Action Navigation & Privacy Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--theme-border,#213E61)]/40 text-[11.5px]">
            <div className="flex items-center gap-1.5 text-[#10B981] font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{isHindi ? '100% सुरक्षित और ऑफ़लाइन' : '100% Safe, Private & Offline'}</span>
            </div>

            {onViewHistory && (
              <button
                type="button"
                onClick={onViewHistory}
                className="inline-flex items-center gap-1 text-[var(--theme-primary,#38BDF8)] hover:text-white font-semibold cursor-pointer transition-colors"
              >
                <span>{isHindi ? 'पूरा लेज़र और विवरण देखें' : 'View Full Ledger & Activity'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
