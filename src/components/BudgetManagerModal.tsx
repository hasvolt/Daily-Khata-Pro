import React, { useState } from 'react';
import { CategoryBudget, Entry, AppLanguage } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { getCurrencyConfig } from '../utils/currencyConfig';
import { getCategoryIcon } from '../utils/iconMap';
import { X, Sliders, AlertTriangle, CheckCircle2, Plus, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { AdsterraBanner } from './AdUnits';

interface BudgetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  budgets: CategoryBudget[];
  onSaveBudgets: (newBudgets: CategoryBudget[]) => void;
  onAddCategory?: (categoryName: string) => void;
  currentMonthEntries?: Entry[];
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const BudgetManagerModal: React.FC<BudgetManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  budgets,
  onSaveBudgets,
  onAddCategory,
  currentMonthEntries = [],
  language = 'en',
  privacyMask = false
}) => {
  const [localBudgets, setLocalBudgets] = useState<CategoryBudget[]>([...budgets]);
  const [selectedCat, setSelectedCat] = useState<string>(categories[0] || '');
  const [limitInput, setLimitInput] = useState<string>('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');

  React.useEffect(() => {
    setLocalBudgets([...budgets]);
  }, [budgets]);

  React.useEffect(() => {
    if (!selectedCat || !categories.includes(selectedCat)) {
      setSelectedCat(categories[0] || '');
    }
  }, [categories, selectedCat]);

  const availableCategories = React.useMemo(() => {
    return Array.from(new Set(categories.filter(Boolean)));
  }, [categories]);

  if (!isOpen) return null;

  // Calculate actual spending for current month per category
  const categorySpendingMap: Record<string, number> = {};
  currentMonthEntries
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      const cat = e.category || 'Other';
      categorySpendingMap[cat] = (categorySpendingMap[cat] || 0) + e.amount;
    });

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(limitInput);
    if (!selectedCat || isNaN(limit) || limit <= 0) return;

    const existingIndex = localBudgets.findIndex((b) => b.category === selectedCat);
    let updated: CategoryBudget[];
    if (existingIndex >= 0) {
      updated = localBudgets.map((b, idx) => (idx === existingIndex ? { ...b, monthlyLimit: limit } : b));
    } else {
      updated = [...localBudgets, { category: selectedCat, monthlyLimit: limit }];
    }

    setLocalBudgets(updated);
    onSaveBudgets(updated);
    setLimitInput('');
    triggerHapticSound('save');
  };

  const handleRemove = (catName: string) => {
    const updated = localBudgets.filter((b) => b.category !== catName);
    setLocalBudgets(updated);
    onSaveBudgets(updated);
    triggerHapticSound('delete');
  };

  const handleCreateCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setSelectedCat(trimmed);
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
    triggerHapticSound('save');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)]">
                Category Monthly Budgets
              </h3>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)]">
                Prevent over-spending with intelligent threshold warnings
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

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Add / Edit Budget Form */}
          <form onSubmit={handleAddOrUpdate} className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-3.5 rounded-xl space-y-3">
            <span className="font-semibold text-[var(--theme-text,#F8FAFC)] block text-xs">
              Set Category Budget Target
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">Select Category</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
                    className="text-[11px] text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    {language === 'hi' ? '+ कस्टम श्रेणी' : '+ Custom Category'}
                  </button>
                </div>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-lg p-2 text-[var(--theme-text,#F8FAFC)] text-xs focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                >
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mb-1">Monthly Limit ({getCurrencyConfig(language).symbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-lg p-2 text-[var(--theme-text,#F8FAFC)] text-xs focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
              </div>
            </div>

            {/* Inline Custom Category Creator */}
            {isAddingCustomCategory && (
              <div className="p-2.5 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/50 rounded-xl flex gap-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'नई श्रेणी का नाम...' : 'New category name...'}
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCustomCategory();
                    }
                  }}
                  className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateCustomCategory}
                  className="px-3 py-1.5 bg-[var(--theme-primary,#38BDF8)] text-[#040D17] rounded-lg text-xs font-bold cursor-pointer hover:brightness-110"
                >
                  {language === 'hi' ? 'जोड़ें' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustomCategory(false);
                    setCustomCategoryInput('');
                  }}
                  className="px-2 py-1.5 text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] text-xs cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द' : 'Cancel'}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--theme-primary, #38BDF8)',
                color: 'var(--theme-btn-text, #040D17)'
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Category Limit</span>
            </button>
          </form>

          {/* Active Budgets List */}
          <div className="space-y-2.5">
            <span className="font-semibold text-[var(--theme-text,#F8FAFC)] block text-xs">
              Active Category Limits ({localBudgets.length})
            </span>

            {localBudgets.length === 0 ? (
              <div className="text-center py-6 text-[var(--theme-text-dim,#94A3B8)] border border-dashed border-[var(--theme-border,#213E61)] rounded-xl">
                No monthly limits configured yet. Set limits above to track overspending!
              </div>
            ) : (
              localBudgets.map((b) => {
                const spent = categorySpendingMap[b.category] || 0;
                const pct = Math.min(150, Math.round((spent / b.monthlyLimit) * 100));
                const isOver = spent > b.monthlyLimit;
                const isNear = !isOver && pct >= 80;

                const CategoryIcon = getCategoryIcon(b.category);
                return (
                  <div
                    key={b.category}
                    className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-[var(--theme-card,#132438)] text-[var(--theme-primary,#38BDF8)]">
                          <CategoryIcon className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="font-semibold text-[var(--theme-text,#F8FAFC)] block">
                            {b.category}
                          </span>
                          <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                            Spent: {formatCurrency(spent, privacyMask)} / Limit: {formatCurrency(b.monthlyLimit, privacyMask)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOver ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Over {pct}%
                          </span>
                        ) : isNear ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {pct}% Caution
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {pct}% Safe
                          </span>
                        )}

                        <button
                          onClick={() => handleRemove(b.category)}
                          className="p-1 hover:text-rose-400 text-[var(--theme-text-dim,#94A3B8)] transition-colors cursor-pointer"
                          title="Remove Budget"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isOver ? 'bg-rose-500' : isNear ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sponsored Partner Medium Rectangle (300x250) */}
          <AdsterraBanner size="300x250" className="my-3" />
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
