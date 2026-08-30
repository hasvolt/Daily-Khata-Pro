import React from 'react';
import { Entry, FundType, Goal, WorkLog, DailyLifeLog, PersonalNote, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { getCategoryIcon, getSourceIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import {
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Home,
  ShieldAlert,
  HeartPulse,
  PiggyBank,
  TrendingUp,
  Receipt,
  LucideIcon,
  Calendar,
  CalendarDays,
  FileText,
  Pin,
  Lock
} from 'lucide-react';

const FUND_ICONS: Record<FundType, LucideIcon> = {
  personal: User,
  family: Home,
  buffer: ShieldAlert,
  emergency: HeartPulse,
  saving: PiggyBank,
  investment: TrendingUp
};

interface HomeViewProps {
  entries: Entry[];
  goals?: Goal[];
  workLogs?: WorkLog[];
  dailyLifeLogs?: DailyLifeLog[];
  personalNotes?: PersonalNote[];
  percentages: Record<FundType, number>;
  onAddClick: (type: 'income' | 'expense') => void;
  onFilterFund: (fund: FundType) => void;
  onViewHistory: () => void;
  onNavigateGoals?: () => void;
  onNavigateTracker?: () => void;
  onNavigateNotes?: () => void;
  onOpenNoteModal?: () => void;
  onOpenWorkModal?: () => void;
  onOpenDailyLifeModal?: () => void;
  onOpenManual?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  entries,
  goals,
  workLogs,
  dailyLifeLogs,
  personalNotes = [],
  percentages,
  onAddClick,
  onFilterFund,
  onViewHistory,
  onNavigateGoals,
  onNavigateTracker,
  onNavigateNotes,
  onOpenNoteModal,
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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);
  const isZeroState = entries.length === 0;

  // Recent 4 entries
  const recentEntries = entries
    .slice()
    .sort((a, b) => {
      const d = b.date.localeCompare(a.date);
      if (d !== 0) return d;
      return b.createdAt - a.createdAt;
    })
    .slice(0, 4);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 text-left max-w-5xl mx-auto">
      {/* 1. Main Balance Hero Card (Simple, Clean, Spacious) */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Left: Total Balance & Date */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                {t.home.netBalance}
              </span>
              <span className="text-[11px] text-[#64748B] font-medium">• {dateFormatted}</span>
            </div>
            <div className="font-serif-display text-[36px] sm:text-[44px] font-bold text-[#F8FAFC] tracking-tight leading-none pt-1">
              {formatCurrency(totalWealth, privacyMask)}
            </div>
          </div>

          {/* Right: Primary Income & Expense Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onAddClick('income')}
              className="flex-1 sm:flex-initial min-h-[44px] py-2.5 px-5 sm:px-6 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#04140D] font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.home.addIncome}</span>
            </button>

            <button
              onClick={() => onAddClick('expense')}
              className="flex-1 sm:flex-initial min-h-[44px] py-2.5 px-5 sm:px-6 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[#EF4444]/15 border border-[#EF4444]/60 text-[#EF4444] font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.home.addExpense}</span>
            </button>
          </div>
        </div>

        {/* Daily & Monthly Income & Expense Dual Breakdown */}
        <div className="pt-5 mt-5 border-t border-[var(--theme-border,#213E61)] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. Daily (Today's) Income & Expense */}
            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.home.dailySummaryHeading}</span>
                </div>
                <div className="text-[11px] font-mono font-bold flex items-center gap-1">
                  <span className="text-[#94A3B8]">{t.home.todayNet}:</span>
                  <span className={todayStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                    {todayStats.net >= 0 ? '+' : ''}{formatCurrency(todayStats.net, privacyMask)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Today Income */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-[#94A3B8] font-medium truncate">{t.home.todayIncome}</div>
                    <div className="text-[14px] sm:text-[15px] font-bold text-[#10B981] font-mono truncate">
                      +{formatCurrency(todayStats.income, privacyMask)}
                    </div>
                  </div>
                </div>

                {/* Today Expense */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70">
                  <div className="w-8 h-8 rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-[#94A3B8] font-medium truncate">{t.home.todayExpense}</div>
                    <div className="text-[14px] sm:text-[15px] font-bold text-[#EF4444] font-mono truncate">
                      -{formatCurrency(todayStats.expense, privacyMask)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Monthly (This Month's) Income & Expense */}
            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  <CalendarDays className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{t.home.monthlySummaryHeading}</span>
                </div>
                <div className="text-[11px] font-mono font-bold flex items-center gap-1">
                  <span className="text-[#94A3B8]">{t.home.thisMonthNet}:</span>
                  <span className={monthStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                    {monthStats.net >= 0 ? '+' : ''}{formatCurrency(monthStats.net, privacyMask)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Month Income */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-[#94A3B8] font-medium truncate">{t.home.thisMonthIncome}</div>
                    <div className="text-[14px] sm:text-[15px] font-bold text-[#10B981] font-mono truncate">
                      +{formatCurrency(monthStats.income, privacyMask)}
                    </div>
                  </div>
                </div>

                {/* Month Expense */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70">
                  <div className="w-8 h-8 rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-[#94A3B8] font-medium truncate">{t.home.thisMonthExpense}</div>
                    <div className="text-[14px] sm:text-[15px] font-bold text-[#EF4444] font-mono truncate">
                      -{formatCurrency(monthStats.expense, privacyMask)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6-Fund Rule Overview (Clean, Clear Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13.5px] sm:text-[14.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
            {t.home.sixFundsHeading}
          </h3>
          <span className="text-[12px] text-[#64748B]">
            {t.home.allocationRule}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FUND_ORDER.map((f) => {
            const config = FUND_CONFIGS[f];
            const FundIcon = FUND_ICONS[f];
            const pct = percentages[f] ?? config.defaultPct;
            const val = fundTotals[f] ?? 0;
            const isNeg = val < 0;
            const fundTranslatedName = t.funds?.[f]?.name ? t.funds[f].name.split(' (')[0] : FUND_LABELS[f];

            return (
              <button
                type="button"
                key={f}
                onClick={() => onFilterFund(f)}
                className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/60 rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-md active:scale-[0.98] text-left flex flex-col justify-between min-h-[96px]"
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    <FundIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10.5px] text-[#94A3B8] font-mono font-bold bg-[var(--theme-bg,#070E18)] px-1.5 py-0.5 rounded border border-[var(--theme-border,#213E61)]">
                    {pct}%
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-[12px] font-semibold text-[#94A3B8] truncate">
                    {fundTranslatedName}
                  </div>
                  <div
                    className={`font-serif-display text-[16px] sm:text-[17px] font-bold num tracking-tight truncate ${
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
      </div>

      {/* Quick Personal Notes & Vault Card */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-[14.5px] font-bold text-[#F8FAFC] truncate">
                {isHindi ? 'पर्सनल नोट्स एवं सीक्रेट डायरी' : 'Personal Notes & Private Vault'}
              </h4>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                100% PRIVATE
              </span>
            </div>
            <p className="text-[12px] text-[#94A3B8] truncate mt-0.5">
              {personalNotes.length > 0
                ? isHindi
                  ? `${personalNotes.length} पर्सनल नोट सुरक्षित हैं • गुप्त पासवर्ड्स व विचार`
                  : `${personalNotes.length} notes saved securely • Ideas, passwords & reminders`
                : isHindi
                ? 'खाते से अलग अपने विचार, गुप्त क्रेडेंशियल्स व टू-डू लिस्ट रखें'
                : 'Write thoughts, credentials, checklists completely separate from ledgers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenNoteModal && (
            <button
              type="button"
              onClick={onOpenNoteModal}
              className="py-1.5 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] hover:text-[#F8FAFC] font-bold text-[12px] flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'नया नोट' : 'New Note'}</span>
            </button>
          )}
          {onNavigateNotes && (
            <button
              type="button"
              onClick={onNavigateNotes}
              className="py-1.5 px-3.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[12.5px] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <span>{isHindi ? 'वॉल्ट खोलें' : 'Open Vault'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Recent Transactions (Simple, Uncluttered List) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13.5px] sm:text-[14.5px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <span>{t.home.recentTransactions}</span>
          </h3>
          <button
            onClick={onViewHistory}
            className="text-[var(--theme-primary,#38BDF8)] hover:underline text-[12.5px] sm:text-[13px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{t.home.viewAllLedger}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isZeroState ? (
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 text-center space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center mx-auto">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-[#F8FAFC]">{t.home.noEntriesYet}</h4>
              <p className="text-[12.5px] text-[#94A3B8] max-w-xs mx-auto mt-0.5">
                {t.home.noEntriesSub}
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={() => onAddClick('income')}
                className="px-4 py-2 rounded-xl font-bold text-[13px] bg-[var(--theme-btn-bg,#38BDF8)] text-[var(--theme-btn-text,#040D17)] cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                {t.home.startByAdding}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl divide-y divide-[var(--theme-border,#213E61)] overflow-hidden shadow-sm">
            {recentEntries.map((entry) => {
              const isIncome = entry.type === 'income';
              const Icon = isIncome ? getSourceIcon(entry.source) : getCategoryIcon(entry.category);

              return (
                <div
                  key={entry.id}
                  className="p-3.5 sm:p-4 hover:bg-[var(--theme-card-hover,#19304A)] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-[#10B981]/15 text-[#10B981]'
                          : 'bg-[#EF4444]/15 text-[#EF4444]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-[#F8FAFC] truncate">
                        {isIncome ? entry.source || 'Income' : entry.category || 'Expense'}
                      </div>
                      <div className="text-[11.5px] text-[#94A3B8] flex items-center gap-2 truncate mt-0.5">
                        <span>{entry.date}</span>
                        <span>•</span>
                        <span className="uppercase text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] font-bold text-[#CBD5E1]">
                          {entry.paymentMode || 'UPI'}
                        </span>
                        {entry.note && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[140px] text-[#94A3B8]">{entry.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-[15px] sm:text-[16px] font-mono font-bold shrink-0 ${
                      isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(entry.amount, privacyMask)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
