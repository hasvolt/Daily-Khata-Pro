import React, { useMemo } from 'react';
import { DebtItem, AppLanguage } from '../types';
import { formatCurrency } from '../utils/khataCalculations';
import { Landmark, ArrowUpRight, ArrowDownLeft, ChevronRight, Plus, AlertCircle } from 'lucide-react';

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
  privacyMask = false,
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
        if (item.type === 'lent') totalLent += item.remainingAmount;
        else if (item.type === 'borrowed') totalBorrowed += item.remainingAmount;
        else if (item.type === 'loan_emi') {
          totalBorrowed += item.remainingAmount;
          if (item.emiAmount && item.emiAmount > 0) monthlyEmiTotal += item.emiAmount;
        }

        if (item.dueDate) {
          const due = new Date(item.dueDate);
          due.setHours(0, 0, 0, 0);
          const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
          if (diff >= 0 && diff <= 7 && (!nearestUpcoming || diff < nearestUpcoming.diffDays)) {
            nearestUpcoming = { item, diffDays: diff };
          }
        }
      }
    });

    return { totalLent, totalBorrowed, monthlyEmiTotal, nearestUpcoming };
  }, [debtItems]);

  return (
    <div className="rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[12.5px] sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)] truncate">Loans & EMIs</h3>
            <p className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">Personal debt, receivables & EMIs</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenLedger}
          className="shrink-0 text-[8.5px] sm:text-[10px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-0.5 cursor-pointer"
        >
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-2.5">
          <span className="text-[8px] sm:text-[9px] text-rose-400 font-semibold flex items-center gap-1">
            <ArrowDownLeft className="w-3 h-3" />To Pay
          </span>
          <div className="mt-1 font-mono text-[12px] sm:text-[13px] font-extrabold text-rose-400 truncate notranslate" translate="no">
            {formatCurrency(summary.totalBorrowed, privacyMask)}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-2.5">
          <span className="text-[8px] sm:text-[9px] text-cyan-400 font-semibold flex items-center gap-1">
            <Landmark className="w-3 h-3" />Monthly EMI
          </span>
          <div className="mt-1 font-mono text-[12px] sm:text-[13px] font-extrabold text-cyan-400 truncate notranslate" translate="no">
            {formatCurrency(summary.monthlyEmiTotal, privacyMask)}
          </div>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-500/[.06] border border-emerald-500/15 px-2.5 py-1.5">
          <span className="text-[8px] sm:text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />To Receive
          </span>
          <div className="font-mono text-[11px] sm:text-xs font-bold text-emerald-400 truncate notranslate" translate="no">
            {formatCurrency(summary.totalLent, privacyMask)}
          </div>
        </div>
        {summary.nearestUpcoming ? (
          <div className="rounded-xl bg-sky-500/[.08] border border-sky-500/20 px-2.5 py-1.5 flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[8px] sm:text-[9px] text-sky-400 truncate">
              {summary.nearestUpcoming.diffDays === 0 ? 'Due today' : `Due in ${summary.nearestUpcoming.diffDays}d`}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="rounded-xl bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/30 px-2.5 py-1.5 text-[8px] sm:text-[9px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center justify-center gap-1 cursor-pointer hover:bg-[var(--theme-primary,#38BDF8)]/20 transition-colors"
          >
            <Plus className="w-3 h-3" /> Record Loan
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanUdharWidget;
