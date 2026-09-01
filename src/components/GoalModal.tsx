import { getCurrencyConfig, getCurrentLanguage } from '../utils/currencyConfig';
import React, { useState, useEffect } from 'react';
import { Goal, FundType } from '../types';
import { FUND_ORDER, FUND_LABELS, GOAL_PRESETS } from '../data/defaults';
import {
  X,
  Target,
  ShieldCheck,
  Bike,
  Laptop,
  Smartphone,
  Home,
  Plane,
  Coins,
  GraduationCap,
  Trophy,
  HeartPulse,
  Zap,
  LucideIcon,
  Sparkles
} from 'lucide-react';
import { getGoalIcon } from '../utils/iconMap';
import { triggerHapticSound } from '../utils/khataCalculations';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goalData: Omit<Goal, 'id' | 'createdAt'>, editingId?: string) => void;
  editingGoal?: Goal | null;
}

const AVAILABLE_GOAL_ICONS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: 'target', label: 'Target', icon: Target },
  { key: 'shield', label: 'Emergency', icon: ShieldCheck },
  { key: 'bike', label: 'Vehicle', icon: Bike },
  { key: 'laptop', label: 'Tech', icon: Laptop },
  { key: 'phone', label: 'Mobile', icon: Smartphone },
  { key: 'home', label: 'Home', icon: Home },
  { key: 'travel', label: 'Travel', icon: Plane },
  { key: 'gold', label: 'Gold/Asset', icon: Coins },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'trophy', label: 'Milestone', icon: Trophy },
  { key: 'health', label: 'Health', icon: HeartPulse },
  { key: 'volt', label: 'Energy/Tools', icon: Zap }
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  editingGoal
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Savings');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [linkedFund, setLinkedFund] = useState<FundType | ''>('saving');
  const [icon, setIcon] = useState('target');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setCategory(editingGoal.category || 'Savings');
      setTargetAmount(editingGoal.targetAmount ? String(editingGoal.targetAmount) : '');
      setCurrentAmount(editingGoal.currentAmount !== undefined ? String(editingGoal.currentAmount) : '0');
      setTargetDate(editingGoal.targetDate || '');
      setLinkedFund(editingGoal.linkedFund || '');
      setIcon(editingGoal.icon || 'target');
      setNote(editingGoal.note || '');
    } else {
      setTitle('');
      setCategory('Savings');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate('');
      setLinkedFund('saving');
      setIcon('target');
      setNote('');
    }
    setError('');
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof GOAL_PRESETS[0]) => {
    setTitle(preset.title);
    setIcon(preset.iconKey);
    setCategory(preset.category);
    setTargetAmount(String(preset.defaultTarget));
    setLinkedFund(preset.defaultFund);
    triggerHapticSound('click');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount);
    const numCurrent = parseFloat(currentAmount) || 0;

    if (!title.trim()) {
      setError('Please enter a goal title.');
      return;
    }

    if (isNaN(numTarget) || numTarget <= 0) {
      setError('Please enter a valid target amount.');
      return;
    }

    if (numCurrent < 0) {
      setError('Current amount cannot be negative.');
      return;
    }

    triggerHapticSound('save');

    onSaveGoal(
      {
        title: title.trim(),
        category,
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate: targetDate || undefined,
        linkedFund: linkedFund ? (linkedFund as FundType) : undefined,
        icon,
        note: note.trim() || undefined,
        isCompleted: editingGoal?.isCompleted || numCurrent >= numTarget,
        completedAt: editingGoal?.completedAt || (numCurrent >= numTarget ? Date.now() : undefined)
      },
      editingGoal?.id
    );
    onClose();
  };

  const SelectedIconComp = getGoalIcon(icon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center"
              style={{ color: 'var(--theme-primary, #38BDF8)' }}
            >
              <SelectedIconComp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-serif-display text-[16px] font-bold text-[#F8FAFC]">
                {editingGoal ? 'Edit Financial Goal' : 'Create New Financial Goal'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {editingGoal ? 'Update your target details' : 'Set a target and save systematically'}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-left">
          {error && (
            <div className="p-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/60 text-[#FCA5A5] text-[12px] font-semibold">
              {error}
            </div>
          )}

          {/* Quick Presets (Only on create) */}
          {!editingGoal && (
            <div className="space-y-1.5 bg-[var(--theme-bg,#070E18)] p-3 rounded-xl border border-[var(--theme-border,#213E61)]">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                  <span>Quick Presets</span>
                </span>
                <span className="text-[10px]" style={{ color: 'var(--theme-primary, #38BDF8)' }}>1-Click Auto Fill</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {GOAL_PRESETS.map((p) => {
                  const IconC = getGoalIcon(p.iconKey);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 text-[11.5px] font-medium text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer"
                    >
                      <IconC className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                      <span>{p.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Goal Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Goal Title <span style={{ color: 'var(--theme-primary, #38BDF8)' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 6-Month Emergency Reserve, New Bike, Laptop..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none"
            />
          </div>

          {/* Target and Initial Amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Target Amount ({getCurrencyConfig(getCurrentLanguage()).symbol}) <span style={{ color: 'var(--theme-primary, #38BDF8)' }}>*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#94A3B8]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
                <input
                  type="number"
                  required
                  step="any"
                  min="1"
                  placeholder="50,000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl pl-8 pr-3.5 py-2.5 text-[14px] font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Current Saved Amount ({getCurrencyConfig(getCurrentLanguage()).symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#94A3B8]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl pl-8 pr-3.5 py-2.5 text-[14px] font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Target Date & Linked Fund */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Target Completion Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Linked Fund Pot
              </label>
              <select
                value={linkedFund}
                onChange={(e) => setLinkedFund(e.target.value as FundType | '')}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl px-3.5 py-2.5 text-[13.5px] cursor-pointer focus:outline-none"
              >
                <option value="">None (Independent Goal)</option>
                {FUND_ORDER.map((f) => (
                  <option key={f} value={f}>
                    {FUND_LABELS[f]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vector Icon Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Icon Representation
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_GOAL_ICONS.map((item) => {
                const ItemIcon = item.icon;
                const isSel = icon === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setIcon(item.key);
                      triggerHapticSound('click');
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSel
                        ? 'shadow-xs'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                    style={{
                      backgroundColor: isSel ? 'var(--theme-primary-dim, rgba(56,189,248,0.15))' : undefined,
                      borderColor: isSel ? 'var(--theme-primary, #38BDF8)' : undefined,
                      color: isSel ? 'var(--theme-primary, #38BDF8)' : undefined
                    }}
                    title={item.label}
                  >
                    <ItemIcon className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Note / Why this goal matters (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Save ₹2,500 monthly from saving pot"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none"
            />
          </div>

          {/* Modal Footer */}
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
              className="px-5 py-2.5 rounded-xl font-bold text-[13.5px] cursor-pointer transition-all shadow-md active:scale-95"
              style={{
                backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
                color: 'var(--theme-btn-text, #040D17)'
              }}
            >
              {editingGoal ? 'Update Goal' : 'Save Goal Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
