import React, { useState, useEffect } from 'react';
import { Entry, FundType, PaymentMode, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_INCOME_SOURCES, DEFAULT_CATEGORIES } from '../data/defaults';
import { formatCurrency, calculateFundSplits, triggerHapticSound } from '../utils/khataCalculations';
import { getCategoryIcon, getSourceIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import {
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Wallet,
  Building2,
  CreditCard,
  FileCheck2,
  Coins,
  Check,
  Plus,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

interface AddViewProps {
  initialType?: 'income' | 'expense';
  initialAmount?: number;
  categories: string[];
  incomeSources?: string[];
  percentages: Record<FundType, number>;
  fundTotals?: Record<FundType, number>;
  editingEntry?: Entry | null;
  onSaveEntry: (entry: Omit<Entry, 'id' | 'createdAt'>, editingId?: string) => void;
  onAddCategory?: (newCategory: string) => void;
  onAddIncomeSource?: (newSource: string) => void;
  onCancelEdit?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const AddView: React.FC<AddViewProps> = ({
  initialType = 'income',
  initialAmount,
  categories = DEFAULT_CATEGORIES,
  incomeSources = DEFAULT_INCOME_SOURCES,
  percentages,
  editingEntry,
  onSaveEntry,
  onAddCategory,
  onAddIncomeSource,
  onCancelEdit,
  language = 'en',
  privacyMask = false
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi';

  const [type, setType] = useState<'income' | 'expense'>(editingEntry ? editingEntry.type : initialType);
  const [amountStr, setAmountStr] = useState<string>(
    editingEntry ? String(editingEntry.amount) : initialAmount && initialAmount > 0 ? String(initialAmount) : ''
  );
  const [source, setSource] = useState<string>(editingEntry?.source || incomeSources[0] || 'Salary & Wages');
  const [category, setCategory] = useState<string>(editingEntry?.category || categories[0] || 'Food & Groceries');
  const [selectedFund, setSelectedFund] = useState<FundType>(editingEntry?.fund || 'personal');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(editingEntry?.paymentMode || 'upi');
  const [clientName, setClientName] = useState<string>(editingEntry?.clientName || '');
  const [note, setNote] = useState<string>(editingEntry?.note || '');
  const [date, setDate] = useState<string>(editingEntry?.date || new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');

  // Inline custom category / source input state
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [isAddingCustomSource, setIsAddingCustomSource] = useState<boolean>(false);
  const [customSourceInput, setCustomSourceInput] = useState<string>('');

  useEffect(() => {
    if (initialAmount && initialAmount > 0 && !editingEntry) {
      setAmountStr(String(initialAmount));
    }
  }, [initialAmount, editingEntry]);

  const parsedAmount = parseFloat(amountStr) || 0;
  const splits = calculateFundSplits(parsedAmount, percentages);
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000, 50000];

  const handleCreateCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setCategory(trimmed);
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
    triggerHapticSound('save');
  };

  const handleCreateCustomSource = () => {
    const trimmed = customSourceInput.trim();
    if (!trimmed) return;
    if (onAddIncomeSource) {
      onAddIncomeSource(trimmed);
    }
    setSource(trimmed);
    setCustomSourceInput('');
    setIsAddingCustomSource(false);
    triggerHapticSound('save');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedAmount || parsedAmount <= 0) {
      setError(isHindi ? 'कृपया 0 से अधिक मान्य राशि दर्ज करें' : 'Please enter a valid amount greater than 0');
      triggerHapticSound('error');
      return;
    }

    setError('');
    const newEntry: Omit<Entry, 'id' | 'createdAt'> = {
      type,
      amount: parsedAmount,
      date,
      paymentMode,
      clientName: clientName.trim() || undefined,
      note: note.trim() || undefined,
      ...(type === 'income' ? { source, splits } : { category, fund: selectedFund })
    };

    triggerHapticSound('save');
    onSaveEntry(newEntry, editingEntry?.id);
  };

  const paymentModesList: { id: PaymentMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'upi', label: t.add.paymentUpi, icon: Smartphone },
    { id: 'cash', label: t.add.paymentCash, icon: Wallet },
    { id: 'bank', label: t.add.paymentBank, icon: Building2 },
    { id: 'card', label: t.add.paymentCard, icon: CreditCard },
    { id: 'cheque', label: t.add.paymentCheque, icon: FileCheck2 },
    { id: 'wallet', label: t.add.paymentWallet, icon: Coins },
    { id: 'other', label: t.add.paymentOther, icon: Layers }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200 text-left pb-12">
      {/* 1. Transaction Type Toggle */}
      <div className="flex gap-2 p-1.5 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-md transition-colors">
        <button
          type="button"
          onClick={() => {
            setType('income');
            triggerHapticSound('click');
          }}
          className={`flex-1 py-3 rounded-xl font-extrabold text-[14.5px] sm:text-[15.5px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            type === 'income'
              ? 'bg-[#10B981] text-[#04140D] shadow-md scale-[1.01]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <ArrowUpRight className="w-4.5 h-4.5 stroke-[3]" />
          <span>+ {t.add.titleIncome}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setType('expense');
            triggerHapticSound('click');
          }}
          className={`flex-1 py-3 rounded-xl font-extrabold text-[14.5px] sm:text-[15.5px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            type === 'expense'
              ? 'bg-[#EF4444] text-white shadow-md scale-[1.01]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <ArrowDownRight className="w-4.5 h-4.5 stroke-[3]" />
          <span>- {t.add.titleExpense}</span>
        </button>
      </div>

      {/* 2. Main Entry Form */}
      <form onSubmit={handleSubmit} className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 transition-colors">
        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {t.add.amountLabel} <span className="text-[#EF4444]">*</span>
            </label>
            {editingEntry && (
              <span className="text-[11.5px] font-bold px-2 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)]">
                Editing #{editingEntry.id.slice(0, 7)}
              </span>
            )}
          </div>

          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-serif-display text-[30px] font-bold"
              style={{ color: 'var(--theme-primary, #38BDF8)' }}
            >
              ₹
            </span>
            <input
              id="entry-amount-input"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-serif-display text-[30px] sm:text-[36px] font-bold rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none transition-all placeholder:text-[#64748B]"
              style={{
                borderColor: amountStr ? 'var(--theme-primary, #38BDF8)' : undefined
              }}
              autoFocus={!editingEntry}
            />
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setAmountStr(String(q));
                  triggerHapticSound('click');
                  if (error) setError('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] border border-[var(--theme-border,#213E61)] text-[12.5px] font-mono font-bold shrink-0 transition-colors cursor-pointer"
              >
                +₹{q >= 1000 ? `${q / 1000}k` : q}
              </button>
            ))}
          </div>

          {error && <p className="text-[13px] font-bold text-[#EF4444] pt-1">{error}</p>}
        </div>

        {/* Source / Category Selector with Custom Creation Option */}
        {type === 'income' ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8]">
                {t.add.sourceLabel}
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomSource(!isAddingCustomSource)}
                className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.add.addCustomSource}</span>
              </button>
            </div>

            {/* Inline Custom Source Input Box */}
            {isAddingCustomSource && (
              <div className="p-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/50 rounded-xl flex gap-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder={isHindi ? 'नया कमाई स्रोत नाम...' : 'New income source name...'}
                  value={customSourceInput}
                  onChange={(e) => setCustomSourceInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCustomSource())}
                  className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-lg px-3 py-1.5 text-[13px] text-[#F8FAFC] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateCustomSource}
                  className="px-3 py-1.5 bg-[var(--theme-primary,#38BDF8)] text-[#040D17] rounded-lg text-[12.5px] font-bold cursor-pointer hover:brightness-110"
                >
                  {isHindi ? 'जोड़ें' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomSource(false)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {incomeSources.map((src) => {
                const SrcIcon = getSourceIcon(src);
                const isSelected = source === src;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSource(src)}
                    className={`p-3 rounded-xl border text-[13px] sm:text-[13.5px] font-bold flex items-center gap-2.5 transition-all cursor-pointer text-left min-w-0 ${
                      isSelected
                        ? 'shadow-sm'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'var(--theme-btn-bg, #38BDF8)' : undefined,
                      color: isSelected ? 'var(--theme-btn-text, #040D17)' : undefined,
                      borderColor: isSelected ? 'var(--theme-primary, #38BDF8)' : undefined
                    }}
                  >
                    <SrcIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{src}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8]">
                {t.add.categoryLabel}
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
                className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.add.addCustomCategory}</span>
              </button>
            </div>

            {/* Inline Custom Category Input Box */}
            {isAddingCustomCategory && (
              <div className="p-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/50 rounded-xl flex gap-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder={isHindi ? 'नई श्रेणी का नाम...' : 'New expense category name...'}
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCustomCategory())}
                  className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-lg px-3 py-1.5 text-[13px] text-[#F8FAFC] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateCustomCategory}
                  className="px-3 py-1.5 bg-[var(--theme-primary,#38BDF8)] text-[#040D17] rounded-lg text-[12.5px] font-bold cursor-pointer hover:brightness-110"
                >
                  {isHindi ? 'जोड़ें' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCategory(false)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const CatIcon = getCategoryIcon(cat);
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl border text-[13px] sm:text-[13.5px] font-bold flex items-center gap-2.5 transition-all cursor-pointer text-left min-w-0 ${
                      isSelected
                        ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-sm'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <CatIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Deduct From Fund Pot */}
            <div className="pt-2">
              <label className="text-[12.5px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                {t.add.fundDeductLabel}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {FUND_ORDER.map((f) => {
                  const cfg = FUND_CONFIGS[f];
                  const isSelected = selectedFund === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFund(f)}
                      className={`py-2 px-2.5 rounded-xl border text-[12px] font-bold text-center transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'border-[var(--theme-primary,#38BDF8)] shadow-xs'
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${cfg.color}25` : undefined,
                        color: isSelected ? cfg.color : undefined,
                        borderColor: isSelected ? cfg.color : undefined
                      }}
                    >
                      {FUND_LABELS[f]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Automatic 6-Fund Split Live Breakdown (for Income) */}
        {type === 'income' && parsedAmount > 0 && (
          <div className="p-4 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-[12.5px] font-bold text-[#94A3B8] border-b border-[var(--theme-border,#213E61)] pb-2">
              <span>{t.add.incomeSplitsPreview}</span>
              <span className="font-mono text-[#F8FAFC]">{formatCurrency(parsedAmount, privacyMask)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FUND_ORDER.map((f) => {
                const cfg = FUND_CONFIGS[f];
                const pct = percentages[f] ?? cfg.defaultPct;
                const allocated = splits[f] || 0;
                return (
                  <div key={f} className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
                    <div className="flex justify-between items-center text-[11px] text-[#94A3B8]">
                      <span className="font-medium truncate">{FUND_LABELS[f]}</span>
                      <span className="font-mono font-bold text-[#CBD5E1]">{pct}%</span>
                    </div>
                    <div className="font-serif-display font-bold text-[15px] sm:text-[16px] text-[#F8FAFC] mt-0.5">
                      {formatCurrency(allocated, privacyMask)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Payment Mode & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Payment Mode */}
          <div className="space-y-2">
            <label className="text-[12.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {t.add.paymentModeLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {paymentModesList.slice(0, 3).map((pm) => {
                const ModeIcon = pm.icon;
                const isSelected = paymentMode === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMode(pm.id)}
                    className={`py-2 px-2 rounded-xl border text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <ModeIcon className="w-3.5 h-3.5" />
                    <span className="truncate">{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-[12.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {t.add.dateLabel}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#F8FAFC] font-mono focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>
        </div>

        {/* 5. Client Name & Notes (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {t.add.clientLabel}
            </label>
            <input
              type="text"
              placeholder={t.add.clientPlaceholder}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {t.add.notesLabel}
            </label>
            <input
              type="text"
              placeholder={t.add.notesPlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>
        </div>

        {/* 6. Form Action Buttons */}
        <div className="flex gap-3 pt-2">
          {onCancelEdit && editingEntry && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-5 py-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-border,#213E61)] text-[#94A3B8] font-bold text-[14px] transition-colors cursor-pointer border border-[var(--theme-border,#213E61)]"
            >
              {t.add.cancel}
            </button>
          )}

          <button
            type="submit"
            className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-[#10B981] hover:brightness-110 text-[#04140D]'
                : 'bg-[#EF4444] hover:brightness-110 text-white'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{editingEntry ? t.add.updateEntry : type === 'income' ? t.add.saveIncome : t.add.saveExpense}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
