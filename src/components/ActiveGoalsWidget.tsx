import React from 'react';
import { Goal, AppLanguage } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { getGoalIcon } from '../utils/iconMap';
import { FUND_LABELS } from '../data/defaults';
import { Target, Plus, ChevronRight } from 'lucide-react';

interface ActiveGoalsWidgetProps {
  goals?: Goal[];
  onOpenCreateGoal?: () => void;
  onOpenDepositGoal?: (goal: Goal) => void;
  onNavigateGoals?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const ActiveGoalsWidget: React.FC<ActiveGoalsWidgetProps> = ({
  goals = [],
  onOpenCreateGoal,
  onOpenDepositGoal: _onOpenDepositGoal,
  onNavigateGoals,
  language = 'en',
  privacyMask = false,
}) => {
  const isHindi = language === 'hi';
  const activeGoals = goals.filter((g) => !g.isCompleted && g.currentAmount < g.targetAmount);
  const completedGoals = goals.filter((g) => g.isCompleted || g.currentAmount >= g.targetAmount);

  if (activeGoals.length === 0) {
    return (
      <div className="rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[12.5px] sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)] truncate">Financial Goals</h4>
              <p className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {completedGoals.length ? (isHindi ? 'सभी लक्ष्य पूरे हो चुके हैं' : 'All goals completed') : (isHindi ? 'कोई सक्रिय लक्ष्य नहीं' : 'No active goals')}
              </p>
            </div>
          </div>
          {onOpenCreateGoal && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onOpenCreateGoal();
              }}
              className="rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 px-2 py-1 text-[8.5px] sm:text-[9.5px] font-bold text-[var(--theme-primary,#38BDF8)] cursor-pointer hover:bg-[var(--theme-primary,#38BDF8)]/25 transition-colors"
            >
              <Plus className="inline w-3 h-3 mr-0.5" />New
            </button>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--theme-border,#213E61)]/40 text-center">
          {onNavigateGoals && (
            <button
              type="button"
              onClick={onNavigateGoals}
              className="text-[9.5px] sm:text-[10.5px] font-bold text-[var(--theme-primary,#38BDF8)] cursor-pointer inline-flex items-center gap-1"
            >
              View All Goals <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const goal = activeGoals[0];
  const GoalIconComp = getGoalIcon(goal.icon);
  const progressPct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
  const linkedFundLabel = goal.linkedFund ? FUND_LABELS[goal.linkedFund] : null;

  return (
    <div className="rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[12.5px] sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)] truncate">Financial Goals</h4>
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/25 px-1.5 py-0.5 text-[7px] sm:text-[8px] font-bold text-indigo-500 dark:text-indigo-400 shrink-0">
                {activeGoals.length} Active
              </span>
            </div>
            <p className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">
              {isHindi ? 'बचत लक्ष्य और प्रगति' : 'Track savings milestones & dates'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onNavigateGoals && (
            <button
              type="button"
              onClick={onNavigateGoals}
              className="text-[8.5px] sm:text-[10px] font-bold text-[var(--theme-primary,#38BDF8)] cursor-pointer flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-2.5 sm:p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <GoalIconComp className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-[var(--theme-text,#F8FAFC)] truncate">{goal.title}</div>
              <div className="text-[7.5px] sm:text-[8.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {goal.category}
                {goal.category && linkedFundLabel ? ' • ' : ''}
                {linkedFundLabel || ''}
              </div>
            </div>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400 bg-emerald-400/15 border border-emerald-400/25 rounded-md px-1.5 py-0.5 notranslate" translate="no">
            {progressPct}%
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[9px] sm:text-[10px] gap-2">
          <span className="font-mono font-bold text-[var(--theme-text,#F8FAFC)] notranslate" translate="no">
            {formatCurrency(goal.currentAmount, privacyMask)}
          </span>
          <span className="text-[var(--theme-text-dim,#94A3B8)] font-mono notranslate" translate="no">
            {formatCurrency(goal.targetAmount, privacyMask)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-[var(--theme-bg,#070E18)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveGoalsWidget;
