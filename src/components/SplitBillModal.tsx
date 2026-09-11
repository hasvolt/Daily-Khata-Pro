import React, { useState } from 'react';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { X, Users, Split, Plus, Trash2, Copy, Check, ArrowRight, Share2, Sparkles } from 'lucide-react';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLedgerExpense?: (amount: number, note: string, category: string) => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  isOpen,
  onClose,
  onAddLedgerExpense
}) => {
  const [billTitle, setBillTitle] = useState<string>('Dinner / Outing');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>(['You', 'Friend 1', 'Friend 2']);
  const [newPersonName, setNewPersonName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [addedToLedger, setAddedToLedger] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalNum = parseFloat(totalAmount) || 0;
  const count = participants.length;
  const perPersonShare = count > 0 && totalNum > 0 ? Math.round((totalNum / count) * 100) / 100 : 0;

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPersonName.trim();
    if (!trimmed) return;
    setParticipants([...participants, trimmed]);
    setNewPersonName('');
    triggerHapticSound('click');
  };

  const handleRemovePerson = (index: number) => {
    if (participants.length <= 1) return;
    setParticipants(participants.filter((_, i) => i !== index));
    triggerHapticSound('delete');
  };

  // Generate WhatsApp ready text
  const shareText = `🧾 *Bill Split: ${billTitle}*\n` +
    `💰 Total Amount: ₹${totalNum.toLocaleString('en-IN')}\n` +
    `👥 People (${count}): ${participants.join(', ')}\n` +
    `👉 *Share per person: ₹${perPersonShare.toLocaleString('en-IN')}*\n\n` +
    `Calculated via Daily Khata Pro ⚡`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      triggerHapticSound('save');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddToLedger = () => {
    if (perPersonShare > 0 && onAddLedgerExpense) {
      onAddLedgerExpense(perPersonShare, `${billTitle} (My Share of ₹${totalNum})`, 'Food & Groceries');
      setAddedToLedger(true);
      triggerHapticSound('save');
      setTimeout(() => {
        setAddedToLedger(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                Split Bill / Group Share
              </h3>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)]">
                Divide dining, travel &amp; shared expenses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Bill Title & Total Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mb-1">Purpose / Occasion</label>
              <input
                type="text"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
                placeholder="e.g. Dinner, Trip"
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mb-1">Total Bill Amount (₹)</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="e.g. 2400"
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 text-[var(--theme-text,#F8FAFC)] font-mono font-bold focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>
          </div>

          {/* Share Result Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--theme-surface,#0E1A29)] to-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center space-y-1">
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block">
              Each Person Pays
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 block">
              ₹{perPersonShare.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
              Equally divided among {count} members
            </span>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--theme-text,#F8FAFC)] block">
              Group Members ({count})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {participants.map((person, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)]"
                >
                  <span>{person}</span>
                  {participants.length > 1 && (
                    <button
                      onClick={() => handleRemovePerson(idx)}
                      className="hover:text-rose-400 text-[var(--theme-text-dim,#94A3B8)] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add member form */}
            <form onSubmit={handleAddPerson} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add friend's name..."
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] text-xs font-bold cursor-pointer shrink-0"
              >
                + Add
              </button>
            </form>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={totalNum <= 0}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[var(--theme-text,#F8FAFC)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied for WhatsApp!' : 'Copy Summary'}</span>
          </button>

          {onAddLedgerExpense && (
            <button
              onClick={handleAddToLedger}
              disabled={perPersonShare <= 0 || addedToLedger}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
            >
              {addedToLedger ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{addedToLedger ? 'Added to Ledger!' : 'Add My Share (₹' + perPersonShare + ')'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
