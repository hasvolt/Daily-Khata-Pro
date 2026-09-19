import React from 'react';
import { Goal, AppLanguage } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { getGoalIcon } from '../utils/iconMap';
import { FUND_LABELS } from '../data/defaults';
import { Target, Trophy, Plus, ChevronRight, Clock } from 'lucide-react';

interface ActiveGoalsWidgetProps {
  goals?: Goal[];
  onOpenCreateGoal?: () => void;
  onOpenDepositGoal?: (goal: Goal) => void;
  onNavigateGoals?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const ActiveGoalsWidget: React.FC<ActiveGoalsWidgetProps> = ({
  goals = [], onOpenCreateGoal, onOpenDepositGoal, onNavigateGoals, language = 'en', privacyMask = false
}) => {
  const isHindi = language === 'hi';
  const activeGoals = goals.filter(g => !g.isCompleted && g.currentAmount < g.targetAmount);
  const completedGoals = goals.filter(g => g.isCompleted || g.currentAmount >= g.targetAmount);

  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const getDaysRemainingText = (targetDate?: string) => {
    if (!targetDate) return null;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / 86400000);
    if (diffDays < 0) return { text: isHindi ? `समय समाप्त` : `Overdue`, isLate: true };
    if (diffDays === 0) return { text: isHindi ? 'आज अंतिम तिथि' : 'Due Today', isLate: false };
    return { text: isHindi ? `${diffDays} दिन शेष` : `${diffDays}d left`, isLate: false };
  };

  if (activeGoals.length === 0) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-[var(--theme-border,#213E61)] bg-[linear-gradient(145deg,#0e1c2d,#0b1422)] p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center shrink-0"><Target className="w-4 h-4" /></div>
            <div className="min-w-0">
              <h4 className="text-[12px] sm:text-sm font-bold text-white truncate">{completedGoals.length ? 'Financial Goals' : 'Financial Goals'}</h4>
              <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">{completedGoals.length ? 'All current goals completed' : 'Set a target and track your progress'}</p>
            </div>
          </div>
          {onOpenCreateGoal && <button type="button" onClick={() => { triggerHapticSound('click'); onOpenCreateGoal(); }} className="rounded-lg bg-sky-400/10 border border-sky-400/20 px-2 py-1 text-[9px] font-bold text-sky-300 cursor-pointer"><Plus className="inline w-3 h-3 mr-1" />New Goal</button>}
        </div>
        {onNavigateGoals && <button type="button" onClick={onNavigateGoals} className="mt-3 w-full text-[9px] font-bold text-sky-300 cursor-pointer">View All Goals <ChevronRight className="inline w-3 h-3" /></button>}
      </div>
    );
  }

  const goal = activeGoals[0];
  const GoalIconComp = getGoalIcon(goal.icon);
  const progressPct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const daysRemaining = getDaysRemainingText(goal.targetDate);
  const linkedFundLabel = goal.linkedFund ? FUND_LABELS[goal.linkedFund] : null;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[var(--theme-border,#213E61)] bg-[linear-gradient(145deg,#0e1c2d,#0b1422)] p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center shrink-0"><Target className="w-4 h-4" /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[12px] sm:text-sm font-bold text-white truncate">Financial Goals</h4>
              <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 text-[7px] sm:text-[8px] font-bold text-amber-300 shrink-0">{activeGoals.length} Active</span>
            </div>
            <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">Track savings milestones and target dates</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenCreateGoal && <button type="button" onClick={() => { triggerHapticSound('click'); onOpenCreateGoal(); }} className="rounded-lg bg-sky-400/10 border border-sky-400/20 px-2 py-1 text-[8px] sm:text-[9px] font-bold text-sky-300 cursor-pointer"><Plus className="inline w-3 h-3" /> New</button>}
          {onNavigateGoals && <button type="button" onClick={onNavigateGoals} className="text-[8px] sm:text-[9px] font-bold text-sky-300 cursor-pointer">View All <ChevronRight className="inline w-3 h-3" /></button>}
        </div>
      </div>

      <div className="mt-2.5 rounded-xl bg-[#0b1220] border border-white/[.06] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center shrink-0"><GoalIconComp className="w-4 h-4" /></div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-white truncate">{goal.title}</div>
              <div className="text-[7px] sm:text-[8px] text-slate-500 truncate">{goal.category}{goal.category && linkedFundLabel ? ' • ' : ''}{linkedFundLabel || ''}</div>
            </div>
          </div>
          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 rounded-md px-1.5 py-0.5">{progressPct}%</span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[9px] gap-2">
          <span className="font-mono font-bold text-white">{formatCurrency(goal.currentAmount, privacyMask)}</span>
          <span className="text-slate-500">{formatCurrency(goal.targetAmount, privacyMask)}</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-slate-900 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-400" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[7px] sm:text-[8px] text-slate-500">
          <span>{formatCurrency(remainingAmount, privacyMask)} needed</span>
          {daysRemaining && <span className={daysRemaining.isLate ? 'text-rose-400 font-bold' : ''}><Clock className="inline w-2.5 h-2.5 mr-0.5" />{daysRemaining.text}</span>}
        </div>

        {onOpenDepositGoal && (
          <button type="button" onClick={() => { triggerHapticSound('click'); onOpenDepositGoal(goal); }} className="mt-2 w-full rounded-lg bg-sky-400/10 border border-sky-400/20 py-1.5 text-[8px] sm:text-[9px] font-bold text-sky-300 cursor-pointer">
            + Add Savings
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-slate-400">
          <Trophy className="w-3 h-3 text-emerald-400" />
          <span>Overall: {formatCurrency(totalSaved, privacyMask)} / {formatCurrency(totalTarget, privacyMask)}</span>
        </div>
        <span className="text-[8px] font-bold text-emerald-400">{overallProgress}%</span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-slate-900 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${overallProgress}%` }} />
      </div>

      {activeGoals.length > 1 && onNavigateGoals && (
        <button type="button" onClick={onNavigateGoals} className="mt-2 w-full text-center text-[8px] sm:text-[9px] font-semibold text-sky-300 cursor-pointer">
          +{activeGoals.length - 1} more active goals · View all <ChevronRight className="inline w-3 h-3" />
        </button>
      )}
    </div>
  );
};
