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
  debtItems = [], onOpenLedger, onOpenAddModal, language: _language = 'en', privacyMask = false
}) => {
  const summary = useMemo(() => {
    let totalLent = 0, totalBorrowed = 0, monthlyEmiTotal = 0;
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
    <div className="rounded-2xl sm:rounded-3xl border border-[var(--theme-border,#213E61)] bg-[linear-gradient(145deg,#0e1c2d,#0b1422)] p-3 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[12px] sm:text-sm font-bold text-white truncate">Loans & EMIs</h3>
            <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">Personal debt, money to receive & bank EMIs</p>
          </div>
        </div>
        <button type="button" onClick={onOpenLedger} className="shrink-0 text-[9px] sm:text-[10px] font-bold text-sky-300 flex items-center gap-0.5 cursor-pointer">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2.5">
        <div className="rounded-xl bg-[#09111e] border border-white/[.06] p-2.5">
          <span className="text-[8px] sm:text-[9px] text-rose-400 font-semibold flex items-center gap-1"><ArrowDownLeft className="w-3 h-3" />To Pay</span>
          <div className="mt-1 font-mono text-[12px] sm:text-sm font-extrabold text-rose-400 truncate">{formatCurrency(summary.totalBorrowed, privacyMask)}</div>
        </div>
        <div className="rounded-xl bg-[#09111e] border border-white/[.06] p-2.5">
          <span className="text-[8px] sm:text-[9px] text-sky-400 font-semibold flex items-center gap-1"><Landmark className="w-3 h-3" />Monthly EMI</span>
          <div className="mt-1 font-mono text-[12px] sm:text-sm font-extrabold text-sky-400 truncate">{formatCurrency(summary.monthlyEmiTotal, privacyMask)}</div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-500/[.05] border border-emerald-500/10 px-2.5 py-2">
          <span className="text-[8px] sm:text-[9px] text-emerald-400 font-semibold flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />To Receive</span>
          <div className="font-mono text-[11px] sm:text-xs font-bold text-emerald-400 truncate">{formatCurrency(summary.totalLent, privacyMask)}</div>
        </div>
        {summary.nearestUpcoming ? (
          <div className="rounded-xl bg-amber-500/[.06] border border-amber-500/15 px-2.5 py-2 flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[8px] sm:text-[9px] text-amber-300 truncate">
              {summary.nearestUpcoming.diffDays === 0 ? 'Due today' : `Due in ${summary.nearestUpcoming.diffDays}d`}
            </span>
          </div>
        ) : (
          <button type="button" onClick={onOpenAddModal} className="rounded-xl bg-sky-400/[.06] border border-sky-400/15 px-2.5 py-2 text-[8px] sm:text-[9px] font-bold text-sky-300 flex items-center justify-center gap-1 cursor-pointer">
            <Plus className="w-3 h-3" /> Record Loan / EMI
          </button>
        )}
      </div>
    </div>
  );
};
