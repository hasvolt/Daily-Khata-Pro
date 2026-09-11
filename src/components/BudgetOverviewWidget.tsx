import React from 'react';
import { CategoryBudget, Entry } from '../types';
import { formatCurrency } from '../utils/khataCalculations';
import { getCategoryIcon } from '../utils/iconMap';
import { Sliders, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface BudgetOverviewWidgetProps {
  budgets: CategoryBudget[];
  entries: Entry[];
  onOpenBudgetManager: () => void;
  privacyMask?: boolean;
}

export const BudgetOverviewWidget: React.FC<BudgetOverviewWidgetProps> = ({
  budgets,
  entries,
  onOpenBudgetManager,
  privacyMask = false
}) => {
  if (budgets.length === 0) {
    return (
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--theme-primary,#38BDF8)]/10 text-[var(--theme-primary,#38BDF8)]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-[var(--theme-text,#F8FAFC)]">
              Category Monthly Budgets
            </h4>
            <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
              Set spending limits for Food, Fuel, Shopping &amp; more
            </p>
          </div>
        </div>
        <button
          onClick={onOpenBudgetManager}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer shrink-0"
        >
          Set Limits
        </button>
      </div>
    );
  }

  // Calculate current month spending
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const categorySpentMap: Record<string, number> = {};
  entries
    .filter((e) => e.type === 'expense' && e.date.startsWith(currentMonthKey))
    .forEach((e) => {
      const cat = e.category || 'Other';
      categorySpentMap[cat] = (categorySpentMap[cat] || 0) + e.amount;
    });

  const overBudgetCategories = budgets.filter((b) => (categorySpentMap[b.category] || 0) > b.monthlyLimit);
  const nearBudgetCategories = budgets.filter((b) => {
    const spent = categorySpentMap[b.category] || 0;
    return spent <= b.monthlyLimit && (spent / b.monthlyLimit) >= 0.8;
  });

  return (
    <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
          <h4 className="font-semibold text-xs sm:text-sm text-[var(--theme-text,#F8FAFC)]">
            Category Budget Trackers
          </h4>
        </div>
        <button
          onClick={onOpenBudgetManager}
          className="text-xs text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
        >
          <span>Manage</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Warning banner if over budget */}
      {overBudgetCategories.length > 0 && (
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            <strong>Attention:</strong> {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category has' : 'categories have'} crossed monthly limit!
          </span>
        </div>
      )}

      {/* Progress Items (top 3) */}
      <div className="space-y-2">
        {budgets.slice(0, 3).map((b) => {
          const spent = categorySpentMap[b.category] || 0;
          const pct = Math.min(100, Math.round((spent / b.monthlyLimit) * 100));
          const isOver = spent > b.monthlyLimit;
          const CategoryIcon = getCategoryIcon(b.category);

          return (
            <div key={b.category} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[var(--theme-text,#F8FAFC)] font-medium flex items-center gap-1.5 truncate">
                  <CategoryIcon className="w-3.5 h-3.5 shrink-0 text-[var(--theme-primary,#38BDF8)]" />
                  <span className="truncate">{b.category}</span>
                </span>
                <span className="font-mono text-[var(--theme-text-dim,#94A3B8)] shrink-0">
                  {formatCurrency(spent, privacyMask)} / {formatCurrency(b.monthlyLimit, privacyMask)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOver ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
