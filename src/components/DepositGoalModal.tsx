import { getCurrencyConfig, getCurrentLanguage } from '../utils/currencyConfig';
import React, { useState } from 'react';
import { Goal, FundType } from '../types';
import { FUND_LABELS, FUND_ORDER } from '../data/defaults';
import { X, Plus, Sparkles, Check, ArrowRight } from 'lucide-react';
import { getGoalIcon } from '../utils/iconMap';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';

interface DepositGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onDeposit: (goalId: string, amount: number, deductFromFund?: FundType, note?: string) => void;
}

export const DepositGoalModal: React.FC<DepositGoalModalProps> = ({
  isOpen,
  onClose,
  goal,
  onDeposit
}) => {
  const [amount, setAmount] = useState('');
  const [shouldDeduct, setShouldDeduct] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundType>(goal?.linkedFund || 'saving');
  const [depositNote, setDepositNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const quickAmounts = [500, 1000, 2000, 5000, 10000, remaining].filter(
    (v, idx, arr) => v > 0 && arr.indexOf(v) === idx
  );

  const GoalIconComp = getGoalIcon(goal.icon);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    triggerHapticSound('save');
    onDeposit(
      goal.id,
      num,
      shouldDeduct ? selectedFund : undefined,
      depositNote.trim() || `Goal Deposit: ${goal.title}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center"
              style={{ color: 'var(--theme-primary, #38BDF8)' }}
            >
              <GoalIconComp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h2 className="font-serif-display text-[16px] font-bold text-[#F8FAFC]">
                Add Deposit to {goal.title}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Remaining: <strong className="font-mono" style={{ color: 'var(--theme-primary, #38BDF8)' }}>{formatCurrency(remaining)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-left">
          {error && (
            <div className="p-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/60 text-[#FCA5A5] text-[12px] font-semibold">
              {error}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Deposit Amount ({getCurrencyConfig(getCurrentLanguage()).symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] font-bold text-[#94A3B8]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="2,000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                autoFocus
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl pl-9 pr-4 py-3 text-[18px] font-mono font-bold focus:outline-none"
              />
            </div>

            {/* Quick Pills */}
            <div className="flex gap-1.5 flex-wrap pt-1">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setAmount(String(q));
                    triggerHapticSound('click');
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-colors cursor-pointer"
                >
                  +{formatCurrency(q)}
                </button>
              ))}
            </div>
          </div>

          {/* Deduct from Khata Pot toggle */}
          <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-3 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shouldDeduct}
                onChange={(e) => setShouldDeduct(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--theme-border,#213E61)] focus:ring-[var(--theme-primary,#38BDF8)] bg-[var(--theme-surface,#0E1A29)]"
              />
              <span className="text-[12.5px] font-bold text-[#F8FAFC]">
                Also deduct this amount as Khata expense
              </span>
            </label>

            {shouldDeduct && (
              <div className="pt-1.5 space-y-1.5 border-t border-[var(--theme-border,#213E61)]">
                <label className="text-[10.5px] font-bold text-[#94A3B8] uppercase">
                  Deduct from Fund:
                </label>
                <select
                  value={selectedFund}
                  onChange={(e) => setSelectedFund(e.target.value as FundType)}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-lg px-3 py-2 text-[12.5px] cursor-pointer focus:outline-none"
                >
                  {FUND_ORDER.map((f) => (
                    <option key={f} value={f}>
                      {FUND_LABELS[f]} Fund
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Deposit Note / Reference (Optional)
            </label>
            <input
              type="text"
              placeholder={`Deposit to ${goal.title}`}
              value={depositNote}
              onChange={(e) => setDepositNote(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl px-3.5 py-2 text-[13px] focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-[var(--theme-border,#213E61)] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] font-semibold text-[13px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-[13.5px] cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              style={{
                backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
                color: 'var(--theme-btn-text, #040D17)'
              }}
            >
              <Check className="w-4 h-4" />
              <span>Confirm Deposit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
