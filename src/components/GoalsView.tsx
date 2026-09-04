import React, { useState } from 'react';
import { Goal, AppLanguage } from '../types';
import { FUND_LABELS, GOAL_PRESETS } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { getGoalIcon } from '../utils/iconMap';
import {
  Target,
  Plus,
  Trophy,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Check
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { TRANSLATIONS } from '../utils/translations';

interface GoalsViewProps {
  goals: Goal[];
  onOpenCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenDeposit: (goal: Goal) => void;
  onToggleComplete: (goalId: string) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onOpenCreateGoal,
  onEditGoal,
  onDeleteGoal,
  onOpenDeposit,
  onToggleComplete,
  language = 'en',
  privacyMask = false
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter((g) => g.isCompleted || g.currentAmount >= g.targetAmount);
  const activeGoals = goals.filter((g) => !g.isCompleted && g.currentAmount < g.targetAmount);

  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const filteredGoals = goals.filter((g) => {
    const isDone = g.isCompleted || g.currentAmount >= g.targetAmount;
    if (filter === 'active') return !isDone;
    if (filter === 'completed') return isDone;
    return true;
  });

  const getDaysRemainingText = (targetDate?: string) => {
    if (!targetDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue (${Math.abs(diffDays)}d ago)`, isLate: true };
    } else if (diffDays === 0) {
      return { text: 'Due Today', isLate: false };
    } else {
      return { text: `${diffDays} days left`, isLate: false };
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200 text-left">
      {/* Top Banner Overview */}
      <div
        id="goals-overview-banner"
        className="bg-gradient-to-br from-[var(--theme-card,#132438)] via-[var(--theme-surface,#0E1A29)] to-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-left transition-all"
      >
        <div className="absolute inset-0 record-texture pointer-events-none opacity-30" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-[12px] sm:text-[13px] uppercase tracking-wider text-[#94A3B8] font-bold">
              <Trophy className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <span>Financial Milestones</span>
            </div>
            <div className="font-serif-display text-[26px] sm:text-[30px] font-bold text-[#F8FAFC] num leading-tight truncate">
              {formatCurrency(totalSaved, privacyMask)}
              <span className="text-[15px] sm:text-[16px] font-sans font-normal text-[#94A3B8] ml-2">
                / {formatCurrency(totalTarget, privacyMask)} Target
              </span>
            </div>
            <p className="text-[13px] sm:text-[13.5px] text-[#94A3B8] truncate">
              {goals.length > 0
                ? `${goals.length} Goals · ${completedGoals.length} Achieved · ${overallProgress}% Completed`
                : 'Set your financial milestones and track systematic savings.'}
            </p>
          </div>

          <button
            onClick={onOpenCreateGoal}
            className="min-h-[44px] py-3 px-5 rounded-xl font-extrabold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto"
            style={{
              backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
              color: 'var(--theme-btn-text, #040D17)'
            }}
          >
            <Plus className="w-4.5 h-4.5 stroke-[3]" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {goals.length > 0 && (
        <div className="flex bg-[var(--theme-card,#132438)] p-1.5 rounded-2xl border border-[var(--theme-border,#213E61)] text-[13px] sm:text-[13.5px] font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer truncate ${
              filter === 'all'
                ? 'bg-[var(--theme-surface,#0E1A29)] font-extrabold shadow-xs border border-[var(--theme-border,#213E61)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            style={{
              color: filter === 'all' ? 'var(--theme-primary,#38BDF8)' : undefined
            }}
          >
            All Goals ({goals.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer truncate ${
              filter === 'active'
                ? 'bg-[var(--theme-surface,#0E1A29)] font-extrabold shadow-xs border border-[var(--theme-border,#213E61)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            style={{
              color: filter === 'active' ? 'var(--theme-primary,#38BDF8)' : undefined
            }}
          >
            Active ({activeGoals.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer truncate ${
              filter === 'completed'
                ? 'bg-[var(--theme-surface,#0E1A29)] font-extrabold shadow-xs border border-[var(--theme-border,#213E61)]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            style={{
              color: filter === 'completed' ? 'var(--theme-primary,#38BDF8)' : undefined
            }}
          >
            Achieved ({completedGoals.length})
          </button>
        </div>
      )}

      {/* Zero State / Empty State */}
      {goals.length === 0 ? (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg text-center">
          <div
            className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto"
            style={{
              backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.15))',
              borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.4))',
              color: 'var(--theme-primary, #38BDF8)'
            }}
          >
            <Target className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-display text-[20px] sm:text-[22px] font-bold text-[#F8FAFC]">
              No Active Goals Yet
            </h3>
            <p className="text-[13.5px] sm:text-[14px] text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              Create specific targets for emergency funds, vehicles, gadgets, home investments, or travel, and monitor progress automatically.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="border-t border-[var(--theme-border,#213E61)] pt-5 text-left space-y-3">
            <div className="text-[12px] sm:text-[12.5px] uppercase tracking-wider text-[#94A3B8] font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
              <span>Recommended Milestone Presets:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOAL_PRESETS.slice(0, 4).map((preset) => {
                const PresetIcon = getGoalIcon(preset.iconKey);
                return (
                  <button
                    key={preset.id}
                    onClick={onOpenCreateGoal}
                    className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/60 text-left flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center shrink-0"
                        style={{ color: 'var(--theme-primary, #38BDF8)' }}
                      >
                        <PresetIcon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] sm:text-[14.5px] font-bold text-[#F8FAFC] group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors truncate">
                          {preset.title}
                        </div>
                        <div className="text-[12px] sm:text-[12.5px] text-[#94A3B8]">
                          Target: {formatCurrency(preset.defaultTarget, privacyMask)}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[13px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                      style={{ color: 'var(--theme-primary, #38BDF8)' }}
                    >
                      Select →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenCreateGoal}
              className="py-3 px-7 rounded-xl font-extrabold text-[15px] active:scale-95 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
                color: 'var(--theme-btn-text, #040D17)'
              }}
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Create First Goal</span>
            </button>
          </div>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center text-[#94A3B8] py-12 px-4 border border-dashed border-[var(--theme-border,#213E61)] rounded-2xl bg-[var(--theme-card,#132438)]/30">
          <p className="text-[14px]">No goals found in this view.</p>
        </div>
      ) : (
        /* Goals Responsive Grid: 1 Col on Mobile, 2 Cols on md/lg */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {filteredGoals.map((goal) => {
            const isDone = goal.isCompleted || goal.currentAmount >= goal.targetAmount;
            const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const daysInfo = getDaysRemainingText(goal.targetDate);
            const GoalVectorIcon = getGoalIcon(goal.icon);

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className={`bg-[var(--theme-card,#132438)] border rounded-2xl p-4.5 sm:p-5 space-y-3.5 shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                  isDone
                    ? 'border-[#10B981]/50 bg-[var(--theme-card,#132438)]'
                    : 'border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50'
                }`}
              >
                {/* Card Top Row */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center shrink-0 shadow-inner"
                      style={{ color: 'var(--theme-primary, #38BDF8)' }}
                    >
                      <GoalVectorIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 text-left min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif-display text-[16px] sm:text-[17px] font-bold text-[#F8FAFC] leading-snug truncate">
                          {goal.title}
                        </h4>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/40 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            Achieved
                          </span>
                        ) : (
                          <span
                            className="text-[11px] font-extrabold px-2 py-0.5 rounded shrink-0 border"
                            style={{
                              backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.1))',
                              color: 'var(--theme-primary, #38BDF8)',
                              borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.3))'
                            }}
                          >
                            {progress}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[12px] text-[#94A3B8] flex-wrap">
                        {goal.linkedFund && (
                          <span className="truncate">
                            Pot: <strong className="text-[#F8FAFC]">{FUND_LABELS[goal.linkedFund]}</strong>
                          </span>
                        )}
                        {daysInfo && (
                          <span className={`flex items-center gap-1 ${daysInfo.isLate ? 'text-[#FCA5A5]' : 'text-[#94A3B8]'} shrink-0`}>
                            • <Clock className="w-3.5 h-3.5" />
                            {daysInfo.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0 pl-1">
                    <button
                      onClick={() => onEditGoal(goal)}
                      title="Edit Goal"
                      className="p-2 rounded-xl text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(goal.id)}
                      title="Delete Goal"
                      className="p-2 rounded-xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Numbers Row */}
                <div className="bg-[var(--theme-bg,#070E18)] p-3 sm:p-3.5 rounded-xl border border-[var(--theme-border,#213E61)] flex justify-between items-center text-[13px]">
                  <div>
                    <span className="text-[11px] text-[#94A3B8] uppercase block font-bold">Saved</span>
                    <span className="font-serif-display text-[17px] sm:text-[19px] font-bold text-[#10B981] num">
                      {formatCurrency(goal.currentAmount, privacyMask)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#94A3B8] uppercase block font-bold">Target</span>
                    <span className="font-serif-display text-[17px] sm:text-[19px] font-bold text-[#F8FAFC] num">
                      {formatCurrency(goal.targetAmount, privacyMask)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-2.5 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden border border-[var(--theme-border,#213E61)]">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isDone ? 'bg-[#10B981]' : 'bg-gradient-to-r from-[#10B981] to-[var(--theme-primary,#38BDF8)]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11.5px] text-[#94A3B8] font-medium">
                    <span>{progress}% Achieved</span>
                    <span>{remaining > 0 ? `Remaining: ${formatCurrency(remaining, privacyMask)}` : 'Goal Fulfilled'}</span>
                  </div>
                </div>

                {/* Bottom Deposit / Status Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    onClick={() => onOpenDeposit(goal)}
                    className="flex-1 min-h-[40px] py-2.5 px-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-[#10B981]" />
                    <span>Deposit Money</span>
                  </button>

                  <button
                    onClick={() => onToggleComplete(goal.id)}
                    className={`min-h-[40px] py-2.5 px-3.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isDone ? 'Achieved' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Milestone Goal"
        message="Are you sure you want to remove this financial target goal? Your recorded fund transactions will remain safely saved in the record."
        confirmLabel="Delete Goal"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          if (deletingId) {
            triggerHapticSound('delete');
            onDeleteGoal(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
