import React, { useMemo } from 'react';
import { DebtItem, AppLanguage } from '../types';
import { formatCurrency } from '../utils/khataCalculations';
import {
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ChevronRight,
  Plus,
  AlertCircle
} from 'lucide-react';

interface LoanUdharWidgetProps {
  debtItems?: DebtItem[];
  onOpenLedger: () => void;
  onOpenAddModal: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const LoanUdharWidget: React.FC<LoanUdharWidgetProps> = ({
  debtItems = [],
  onOpenLedger,
  onOpenAddModal,
  language: _language = 'en',
  privacyMask = false
}) => {
  const summary = useMemo(() => {
    let totalLent = 0;
    let totalBorrowed = 0;
    let monthlyEmiTotal = 0;

    let nearestUpcoming: { item: DebtItem; diffDays: number } | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    debtItems.forEach((item) => {
      const isSettled = item.status === 'settled' || item.remainingAmount <= 0;
      if (!isSettled) {
        if (item.type === 'lent') {
          totalLent += item.remainingAmount;
        } else if (item.type === 'borrowed') {
          totalBorrowed += item.remainingAmount;
        } else if (item.type === 'loan_emi') {
          totalBorrowed += item.remainingAmount;
          if (item.emiAmount && item.emiAmount > 0) {
            monthlyEmiTotal += item.emiAmount;
          }
        }

        if (item.dueDate) {
          const due = new Date(item.dueDate);
          due.setHours(0, 0, 0, 0);
          const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (diff >= 0 && diff <= 7) {
            if (!nearestUpcoming || diff < nearestUpcoming.diffDays) {
              nearestUpcoming = { item, diffDays: diff };
            }
          }
        }
      }
    });

    return {
      totalLent,
      totalBorrowed,
      monthlyEmiTotal,
      nearestUpcoming,
      hasRecords: debtItems.length > 0
    };
  }, [debtItems]);

  return (
    <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 text-left transition-all hover:border-[var(--theme-primary,#38BDF8)]/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5">
              <span>Loans, EMIs & Debt Ledger</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold">
                LEDGER
              </span>
            </h3>
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
              Receivables, personal debt & bank amortization
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLedger}
          className="text-xs font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Open Ledger</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Lent / To Receive */}
        <div className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)] space-y-0.5">
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>To Receive</span>
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400 block truncate">
            {formatCurrency(summary.totalLent, privacyMask)}
          </span>
        </div>

        {/* Borrowed / To Pay */}
        <div className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)] space-y-0.5">
          <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
            <ArrowDownLeft className="w-3 h-3" />
            <span>To Pay</span>
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-rose-400 block truncate">
            {formatCurrency(summary.totalBorrowed, privacyMask)}
          </span>
        </div>

        {/* Monthly EMI */}
        <div className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)] space-y-0.5">
          <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
            <Landmark className="w-3 h-3" />
            <span>Monthly EMI</span>
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-sky-400 block truncate">
            {formatCurrency(summary.monthlyEmiTotal, privacyMask)}
          </span>
        </div>
      </div>

      {/* Upcoming due alert if any */}
      {summary.nearestUpcoming && (
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">
              {summary.nearestUpcoming.item.title}: {formatCurrency(summary.nearestUpcoming.item.isEmi && summary.nearestUpcoming.item.emiAmount ? summary.nearestUpcoming.item.emiAmount : summary.nearestUpcoming.item.remainingAmount, privacyMask)}
            </span>
          </div>
          <span className="text-[10px] font-mono shrink-0 font-bold px-1.5 py-0.5 rounded bg-amber-500/20">
            {summary.nearestUpcoming.diffDays === 0
              ? 'Due Today'
              : `Due in ${summary.nearestUpcoming.diffDays}d`}
          </span>
        </div>
      )}

      {/* Quick Add Action */}
      <div className="pt-1 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card,#132438)]/80 border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
          <span>+ Record Loan, Debt or EMI</span>
        </button>
      </div>
    </div>
  );
};
