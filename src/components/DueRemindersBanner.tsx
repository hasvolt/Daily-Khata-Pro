import React from 'react';
import { AppReminder, AppLanguage } from '../types';
import { BellRing, Check, Clock, ChevronRight, X, Sparkles } from 'lucide-react';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';

interface DueRemindersBannerProps {
  reminders: AppReminder[];
  onOpenReminders: () => void;
  onToggleComplete: (id: string) => void;
  onSnooze: (reminder: AppReminder, type: '1hour' | '1day') => void;
  onDismiss: () => void;
  language?: AppLanguage;
}

export const DueRemindersBanner: React.FC<DueRemindersBannerProps> = ({
  reminders,
  onOpenReminders,
  onToggleComplete,
  onSnooze,
  onDismiss,
  language = 'en'
}) => {
  if (!reminders || reminders.length === 0) return null;

  const isHindi = language === 'hi' || language === 'hinglish';
  const primaryReminder = reminders[0];
  const additionalCount = reminders.length - 1;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 pt-2 pb-1 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/40 p-3 sm:p-4 shadow-lg text-left backdrop-blur-xs">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          {/* Left info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 animate-pulse">
              <BellRing className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/30">
                  {isHindi ? '⏰ देय रिमाइंडर (DUE NOW)' : '⏰ REMINDER DUE'}
                </span>
                {additionalCount > 0 && (
                  <span className="text-[11px] font-mono font-bold text-amber-200/90">
                    +{additionalCount} {isHindi ? 'अन्य' : 'more'}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                  {primaryReminder.title}
                </h3>
                {primaryReminder.amount && (
                  <span className="text-[13px] sm:text-[14px] font-mono font-black text-amber-400">
                    {formatCurrency(primaryReminder.amount)}
                  </span>
                )}
              </div>

              {primaryReminder.description && (
                <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)] line-clamp-1 mt-0.5">
                  {primaryReminder.description}
                </p>
              )}
            </div>
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
            {/* Mark Done */}
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('save');
                onToggleComplete(primaryReminder.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-[12px] flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              title={isHindi ? 'पूर्ण मार्क करें' : 'Mark Completed'}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isHindi ? 'पूर्ण हुआ' : 'Done'}</span>
            </button>

            {/* Snooze 1 Hr */}
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onSnooze(primaryReminder, '1hour');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] border border-amber-500/30 text-amber-300 font-bold text-[11.5px] flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
              title={isHindi ? '1 घंटे बाद याद दिलाएं' : 'Remind after 1 hour'}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isHindi ? '+1 घंटा' : '+1 Hr'}</span>
            </button>

            {/* Snooze 1 Day */}
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onSnooze(primaryReminder, '1day');
              }}
              className="hidden md:flex px-2.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] border border-amber-500/30 text-amber-300 font-bold text-[11.5px] items-center gap-1 cursor-pointer active:scale-95 transition-all"
              title={isHindi ? 'कल याद दिलाएं' : 'Remind tomorrow'}
            >
              <span>{isHindi ? 'कल' : 'Tomorrow'}</span>
            </button>

            {/* View Details / All */}
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onOpenReminders();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[11.5px] flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              <span>{isHindi ? 'सूची' : 'View'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss X */}
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-xl text-[var(--theme-text-dim,#94A3B8)] hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
              title={isHindi ? 'बंद करें' : 'Dismiss Banner'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
