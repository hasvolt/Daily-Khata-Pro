import React from 'react';
import { Entry, FundConfig } from '../types';
import { calculateFundTotals, formatCurrency } from '../utils/khataCalculations';
import { Flame, ShieldCheck, AlertTriangle, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface CashRunwayWidgetProps {
  entries: Entry[];
  funds?: FundConfig[];
  privacyMask?: boolean;
}

export const CashRunwayWidget: React.FC<CashRunwayWidgetProps> = ({
  entries,
  funds,
  privacyMask = false
}) => {
  const fundTotals = calculateFundTotals(entries);
  // Liquid funds: Emergency + Saving + Buffer + Personal
  const liquidFunds = Math.max(
    0,
    (fundTotals['emergency'] || 0) +
      (fundTotals['saving'] || 0) +
      (fundTotals['buffer'] || 0) +
      (fundTotals['personal'] || 0)
  );

  // Compute 30-day expense average
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const thirtyDaysStr = thirtyDaysAgo.toISOString().split('T')[0];

  const recentExpenses = entries
    .filter((e) => e.type === 'expense' && e.date >= thirtyDaysStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const dailyBurnRate = Math.round((recentExpenses / 30) * 10) / 10;
  const runwayDays = dailyBurnRate > 0 ? Math.round(liquidFunds / dailyBurnRate) : 999;
  const runwayMonths = Math.round((runwayDays / 30) * 10) / 10;

  // Grade & Color
  let grade = 'A+';
  let statusLabel = 'Fortress Level';
  let badgeColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
  let advice = 'You have over 6 months of financial survival cushion. Perfect peace of mind!';

  if (runwayMonths < 1) {
    grade = 'D';
    statusLabel = 'Critical Runway';
    badgeColor = 'text-rose-400 bg-rose-500/15 border-rose-500/30';
    advice = 'Under 30 days of reserves. Pause non-essential spends and build Emergency Fund.';
  } else if (runwayMonths < 3) {
    grade = 'C';
    statusLabel = 'Tight Runway';
    badgeColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    advice = 'Aim to increase monthly savings until you reach at least 3-6 months buffer.';
  } else if (runwayMonths < 6) {
    grade = 'B+';
    statusLabel = 'Solid Buffer';
    badgeColor = 'text-sky-400 bg-sky-500/15 border-sky-500/30';
    advice = 'Healthy 3-6 month reserve. Continue maintaining your emergency allocation!';
  }

  return (
    <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs sm:text-sm text-[var(--theme-text,#F8FAFC)]">
              Cash Runway &amp; Financial Security
            </h4>
            <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
              Based on your actual 30-day daily burn rate
            </span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${badgeColor}`}>
          <span>Grade {grade}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block truncate">
            Runway
          </span>
          <span className="text-base sm:text-lg font-bold text-sky-400 font-mono">
            {runwayDays >= 999 ? '∞' : `${runwayMonths} Mo`}
          </span>
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
            {runwayDays >= 999 ? 'No expenses' : `~${runwayDays} Days`}
          </span>
        </div>

        <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block truncate">
            Daily Burn Rate
          </span>
          <span className="text-base sm:text-lg font-bold text-rose-400 font-mono">
            {formatCurrency(dailyBurnRate, privacyMask)}
          </span>
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
            per day
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block truncate">
            Liquid Cushion
          </span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            {formatCurrency(liquidFunds, privacyMask)}
          </span>
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
            Emergency + Reserve
          </span>
        </div>
      </div>

      {/* Intelligence Tip */}
      <div className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{advice}</span>
      </div>
    </div>
  );
};
