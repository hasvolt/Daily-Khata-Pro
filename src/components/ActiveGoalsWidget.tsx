import React from 'react';
import { Goal, AppLanguage } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { getGoalIcon } from '../utils/iconMap';
import { FUND_LABELS } from '../data/defaults';
import {
  Target,
  Trophy,
  Plus,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

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
  onOpenDepositGoal,
  onNavigateGoals,
  language = 'en',
  privacyMask = false
}) => {
  const isHindi = language === 'hi';

  const activeGoals = goals.filter(
    (g) => !g.isCompleted && g.currentAmount < g.targetAmount
  );
  const completedGoals = goals.filter(
    (g) => g.isCompleted || g.currentAmount >= g.targetAmount
  );

  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const getDaysRemainingText = (targetDate?: string) => {
    if (!targetDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: isHindi ? `अवधि समाप्त (${Math.abs(diffDays)} दिन पूर्व)` : `Overdue (${Math.abs(diffDays)}d ago)`,
        isLate: true
      };
    } else if (diffDays === 0) {
      return { text: isHindi ? 'आज अंतिम तिथि' : 'Due Today', isLate: false };
    } else {
      return {
        text: isHindi ? `${diffDays} दिन शेष` : `${diffDays} days left`,
        isLate: false
      };
    }
  };

  // If no active goals and no goals at all
  if (activeGoals.length === 0 && goals.length === 0) {
    return (
      <div
        id="active-goals-empty-widget"
        className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 text-left transition-all hover:border-[var(--theme-primary,#38BDF8)]/40"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-display text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'सक्रिय वित्तीय लक्ष्य (Active Goals)' : 'Active Financial Goals'}
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isHindi ? 'नया' : 'Milestones'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi
                  ? 'अपने सपनों व बचत के लिए लक्ष्य निर्धारित करें और प्रगति ट्रैक करें'
                  : 'Set savings targets for gadgets, emergency, travel or investments'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOpenCreateGoal && (
              <button
                type="button"
                id="btn-home-create-goal-empty"
                onClick={() => {
                  triggerHapticSound('click');
                  onOpenCreateGoal();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isHindi ? '+ नया लक्ष्य बनाएं' : '+ Set Goal'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Motivation prompt */}
        <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)]/60 border border-[var(--theme-border,#213E61)]/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-[var(--theme-text-muted,#94A3B8)] truncate">
              {isHindi
                ? 'उदा. इमरजेंसी फंड ₹50,000, नया फोन या बाइक बचत'
                : 'e.g. Emergency Fund ₹50k, New Phone, Vacation, or Bike target'}
            </span>
          </div>
          {onNavigateGoals && (
            <button
              type="button"
              onClick={onNavigateGoals}
              className="text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
            >
              <span>{isHindi ? 'लक्ष्य पृष्ठ' : 'Open Goals'}</span>
              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // If there are goals, but all are completed
  if (activeGoals.length === 0 && completedGoals.length > 0) {
    return (
      <div
        id="active-goals-all-completed-widget"
        className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 text-left transition-all hover:border-[var(--theme-primary,#38BDF8)]/40"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-display text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'सभी लक्ष्य पूरे हो चुके हैं!' : 'All Financial Goals Completed!'}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {completedGoals.length} {isHindi ? 'पूर्ण' : 'Completed'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi
                  ? 'बधाई! आपके सभी बचत लक्ष्य हासिल हो चुके हैं। नया वित्तीय लक्ष्य जोड़ें।'
                  : 'Congratulations! All your savings milestones are achieved. Start your next goal.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOpenCreateGoal && (
              <button
                type="button"
                id="btn-home-create-goal-all-done"
                onClick={() => {
                  triggerHapticSound('click');
                  onOpenCreateGoal();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isHindi ? '+ नया लक्ष्य जोड़ें' : '+ New Goal'}</span>
              </button>
            )}
            {onNavigateGoals && (
              <button
                type="button"
                onClick={onNavigateGoals}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>{isHindi ? 'इतिहास देखें' : 'View History'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Goals present
  return (
    <div
      id="active-goals-widget"
      className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3.5 text-left transition-all hover:border-[var(--theme-primary,#38BDF8)]/40"
    >
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-serif-display text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'सक्रिय वित्तीय लक्ष्य' : 'Active Financial Goals'}
              </h4>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeGoals.length} {isHindi ? 'सक्रिय लक्ष्य' : 'Active'}
              </span>
              {completedGoals.length > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  {completedGoals.length} {isHindi ? 'पूर्ण' : 'Done'}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi
                ? 'भविष्य की बचत व सपनों की प्रगति ट्रैक करें'
                : 'Track milestone savings, target dates & deposit money directly'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
          {onOpenCreateGoal && (
            <button
              type="button"
              id="btn-home-create-goal"
              onClick={() => {
                triggerHapticSound('click');
                onOpenCreateGoal();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Create New Financial Goal"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] stroke-[2.5]" />
              <span>{isHindi ? '+ नया लक्ष्य' : '+ New Goal'}</span>
            </button>
          )}

          {onNavigateGoals && (
            <button
              type="button"
              id="btn-home-view-all-goals"
              onClick={() => {
                triggerHapticSound('click');
                onNavigateGoals();
              }}
              className="text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 font-bold text-xs transition-all cursor-pointer hover:scale-105 active:scale-95 px-1 py-1"
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Summary Bar */}
      <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-[var(--theme-text-dim,#94A3B8)] block">
              {isHindi ? 'कुल लक्ष्य बचत प्रगति:' : 'Overall Goals Progress:'}
            </span>
            <div className="font-bold text-[var(--theme-text,#F8FAFC)] font-mono text-[13px]">
              {formatCurrency(totalSaved, privacyMask)}{' '}
              <span className="text-[var(--theme-text-dim,#94A3B8)] font-normal text-xs">
                / {formatCurrency(totalTarget, privacyMask)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto self-stretch sm:self-auto">
          <div className="w-full sm:w-40 bg-[var(--theme-bg,#070E18)] h-2.5 rounded-full overflow-hidden border border-[var(--theme-border,#213E61)]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Active Goals Grid: Display top 3 active goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeGoals.slice(0, 3).map((goal) => {
          const GoalIconComp = getGoalIcon(goal.icon);
          const progressPct =
            goal.targetAmount > 0
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              : 0;
          const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
          const daysRemaining = getDaysRemainingText(goal.targetDate);
          const linkedFundLabel = goal.linkedFund ? FUND_LABELS[goal.linkedFund] : null;

          return (
            <div
              key={goal.id}
              className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-xl p-3.5 flex flex-col justify-between space-y-3 transition-all group shadow-xs relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <GoalIconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)] truncate leading-tight">
                      {goal.title}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                      {goal.category && (
                        <span className="truncate max-w-[90px]">{goal.category}</span>
                      )}
                      {goal.category && linkedFundLabel && <span>•</span>}
                      {linkedFundLabel && (
                        <span className="text-[var(--theme-primary,#38BDF8)] font-medium truncate max-w-[80px]">
                          {linkedFundLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {progressPct}%
                  </span>
                </div>
              </div>

              {/* Progress and Numbers */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-[var(--theme-text,#F8FAFC)] text-[13px]">
                    {formatCurrency(goal.currentAmount, privacyMask)}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--theme-text-dim,#94A3B8)]">
                    {formatCurrency(goal.targetAmount, privacyMask)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[var(--theme-bg,#070E18)] h-2 rounded-full overflow-hidden border border-[var(--theme-border,#213E61)]">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] pt-0.5 text-[var(--theme-text-dim,#94A3B8)]">
                  <span>
                    {isHindi
                      ? `${formatCurrency(remainingAmount, privacyMask)} शेष`
                      : `${formatCurrency(remainingAmount, privacyMask)} needed`}
                  </span>
                  {daysRemaining && (
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        daysRemaining.isLate ? 'text-rose-400 font-bold' : 'text-[var(--theme-text-dim,#94A3B8)]'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{daysRemaining.text}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Quick Action */}
              <div className="pt-1 border-t border-[var(--theme-border,#213E61)]/60 flex items-center justify-between gap-2">
                {onOpenDepositGoal && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      onOpenDepositGoal(goal);
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] hover:bg-[var(--theme-primary,#38BDF8)] hover:text-[var(--theme-btn-text,#040D17)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
                    id={`btn-deposit-goal-${goal.id}`}
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>{isHindi ? 'बचत जोड़ें (Deposit)' : 'Add Savings'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show banner if more than 3 active goals exist */}
      {activeGoals.length > 3 && onNavigateGoals && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onNavigateGoals}
            className="text-xs text-[var(--theme-primary,#38BDF8)] hover:underline font-semibold cursor-pointer"
          >
            {isHindi
              ? `+${activeGoals.length - 3} और सक्रिय लक्ष्य देखें (लक्ष्य पृष्ठ पर जाएं)`
              : `+${activeGoals.length - 3} more active goals (View all on Goals page)`}
          </button>
        </div>
      )}
    </div>
  );
};
