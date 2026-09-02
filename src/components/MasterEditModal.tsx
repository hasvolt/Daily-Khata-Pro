import React, { useState } from 'react';
import {
  Entry,
  FundType,
  Goal,
  PersonalNote,
  FundConfig,
  AppLanguage,
  KhataSettings
} from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import {
  X,
  SlidersHorizontal,
  Layers,
  Percent,
  Tags,
  Target,
  FileText,
  Search,
  Edit3,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Sliders,
  Wallet
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface MasterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  percentages: Record<FundType, number>;
  onSavePercentages: (newPct: Record<FundType, number>) => void;
  categories: string[];
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
  incomeSources: string[];
  onAddSource: (src: string) => void;
  onDeleteSource: (src: string) => void;
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  notes: PersonalNote[];
  onEditNote: (note: PersonalNote) => void;
  onDeleteNote: (noteId: string) => void;
  onEditEntry: (entry: Entry) => void;
  onDeleteEntry: (entryId: string) => void;
  onOpenTrash?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

type MasterTab = 'entries' | 'percentages' | 'categories' | 'goals' | 'notes';

export const MasterEditModal: React.FC<MasterEditModalProps> = ({
  isOpen,
  onClose,
  entries,
  percentages,
  onSavePercentages,
  categories,
  onAddCategory,
  onDeleteCategory,
  incomeSources,
  onAddSource,
  onDeleteSource,
  goals,
  onEditGoal,
  onDeleteGoal,
  notes,
  onEditNote,
  onDeleteNote,
  onEditEntry,
  onDeleteEntry,
  onOpenTrash,
  language = 'en',
  privacyMask = false
}) => {
  const [activeTab, setActiveTab] = useState<MasterTab>('entries');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Percentages state for local adjustment
  const [localPercentages, setLocalPercentages] = useState<Record<FundType, number>>(percentages);
  const [pctSavedToast, setPctSavedToast] = useState(false);

  // New category / source input
  const [newCatInput, setNewCatInput] = useState('');
  const [newSourceInput, setNewSourceInput] = useState('');

  // Delete confirmations
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'entry' | 'category' | 'source' | 'goal' | 'note';
    title: string;
  } | null>(null);

  if (!isOpen) return null;

  const isHindi = language === 'hi' || language === 'hinglish';

  // Total Percentage
  const currentTotalPct = (Object.values(localPercentages) as (number | undefined)[]).reduce((s: number, v) => s + (v || 0), 0);
  const isPctValid = Math.round(currentTotalPct) === 100;

  const handlePctChange = (fund: FundType, val: number) => {
    const clean = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setLocalPercentages((prev) => ({
      ...prev,
      [fund]: clean
    }));
  };

  const handleSavePct = () => {
    if (!isPctValid) {
      alert(
        isHindi
          ? `कुल प्रतिशत 100% होना आवश्यक है। अभी यह ${currentTotalPct}% है।`
          : `Total percentage must equal 100%. Currently it is ${currentTotalPct}%.`
      );
      return;
    }
    onSavePercentages(localPercentages);
    triggerHapticSound('save');
    setPctSavedToast(true);
    setTimeout(() => setPctSavedToast(false), 2500);
  };

  const handleResetPctDefault = () => {
    const def = {
      personal: 55,
      saving: 10,
      investment: 10,
      buffer: 10,
      emergency: 10,
      family: 5
    };
    setLocalPercentages(def);
    onSavePercentages(def);
    triggerHapticSound('click');
  };

  // Filtered Entries
  const filteredEntries = entries.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (e.source && e.source.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.note && e.note.toLowerCase().includes(q)) ||
      e.date.includes(q) ||
      String(e.amount).includes(q)
    );
  });

  // Filtered Goals
  const filteredGoals = goals.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return g.title.toLowerCase().includes(q) || (g.category && g.category.toLowerCase().includes(q));
  });

  // Filtered Notes
  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const confirmDeleteAction = () => {
    if (!itemToDelete) return;
    triggerHapticSound('delete');
    switch (itemToDelete.type) {
      case 'entry':
        onDeleteEntry(itemToDelete.id);
        break;
      case 'category':
        onDeleteCategory(itemToDelete.id);
        break;
      case 'source':
        onDeleteSource(itemToDelete.id);
        break;
      case 'goal':
        onDeleteGoal(itemToDelete.id);
        break;
      case 'note':
        onDeleteNote(itemToDelete.id);
        break;
    }
    setItemToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] sm:text-[20px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'मास्टर एडिट व कस्टमाइज़ हब' : 'Master Edit & Customization Hub'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 px-2 py-0.5 rounded-full border border-[var(--theme-primary,#38BDF8)]/25">
                  All-in-One
                </span>
              </div>
              <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi
                  ? 'सभी फीचर्स, लेन-देन, फंड प्रतिशत, श्रेणियां व नोट्स एक ही जगह से एडिट करें।'
                  : 'Manage, edit, update, or customize transactions, funds, categories, goals, and notes in one unified hub.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTrash && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTrash();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/35 text-[12px] font-bold transition-all cursor-pointer"
                title="Open Recycle Bin"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'रीसायकल बिन' : 'Recycle Bin'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-card,#132438)] border border-transparent hover:border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Navigation Bar */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/60 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'entries', label: isHindi ? 'लेन-देन (Entries)' : 'Transactions', icon: Layers, count: entries.length },
            { id: 'percentages', label: isHindi ? '6-फंड प्रतिशत' : 'Fund Percentages', icon: Percent },
            { id: 'categories', label: isHindi ? 'श्रेणियां (Categories)' : 'Categories & Sources', icon: Tags, count: categories.length + incomeSources.length },
            { id: 'goals', label: isHindi ? 'बचत लक्ष्य' : 'Savings Goals', icon: Target, count: goals.length },
            { id: 'notes', label: isHindi ? 'नोट्स' : 'Personal Notes', icon: FileText, count: notes.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as MasterTab);
                  triggerHapticSound('click');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[#041424] border-[var(--theme-primary,#38BDF8)] shadow-sm'
                    : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border-[var(--theme-border,#213E61)] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      active ? 'bg-black/20 text-[#041424]' : 'bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
          {/* TAB 1: TRANSACTIONS MASTER */}
          {activeTab === 'entries' && (
            <div className="space-y-3.5">
              {/* Search & Stats */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isHindi ? 'लेन-देन में खोजें (विवरण, स्रोत, राशि)...' : 'Search transactions by note, category, amount...'}
                    className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] pl-10 pr-4 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                  />
                </div>
                <div className="text-xs text-[#94A3B8] flex items-center justify-between sm:justify-end gap-3 px-1">
                  <span>
                    Total: <strong className="text-white">{filteredEntries.length}</strong> records
                  </span>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12 text-[#94A3B8]">
                    No transactions found matching your search.
                  </div>
                ) : (
                  filteredEntries.map((entry) => {
                    const isIncome = entry.type === 'income';
                    return (
                      <div
                        key={entry.id}
                        className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-xl p-3 flex items-center justify-between gap-2.5 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                            }`}
                          >
                            {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[13.5px] font-bold text-white truncate">
                                {isIncome ? (entry.source || 'Income') : (entry.category || 'Expense')}
                              </span>
                              <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">
                                {entry.date}
                              </span>
                            </div>
                            <div className="text-[11.5px] text-[#94A3B8] truncate">
                              {entry.note || (isIncome ? 'All-Fund Split Rule' : `${FUND_LABELS[entry.fund || 'personal']} Fund`)}
                            </div>
                          </div>
                        </div>

                        {/* Amount & Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className={`font-mono font-bold text-[13.5px] sm:text-[15px] ${
                              isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                            }`}
                          >
                            {isIncome ? '+' : '-'}{formatCurrency(entry.amount, privacyMask)}
                          </div>

                          <div className="flex items-center gap-1 pl-1.5 border-l border-[var(--theme-border,#213E61)]">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onEditEntry(entry);
                              }}
                              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer"
                              title="Edit Entry"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete({
                                  id: entry.id,
                                  type: 'entry',
                                  title: `${isIncome ? 'Income' : 'Expense'}: ${formatCurrency(entry.amount)} (${entry.date})`
                                });
                              }}
                              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors cursor-pointer"
                              title="Delete to Trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FUND PERCENTAGES */}
          {activeTab === 'percentages' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                    {isHindi ? 'कुल प्रतिशत योग (Total)' : 'Combined Total'}
                  </div>
                  <div className={`font-mono text-2xl font-black ${isPctValid ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {currentTotalPct}% {isPctValid ? '✓' : `(Must equal 100%)`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetPctDefault}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-xs text-[#94A3B8] hover:text-white border border-[var(--theme-border,#213E61)] font-bold transition-all cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePct}
                    className="px-4 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#041424] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    {isHindi ? 'प्रतिशत सेव करें' : 'Save Percentages'}
                  </button>
                </div>
              </div>

              {pctSavedToast && (
                <div className="p-2.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Percentages updated and applied to income splits successfully!</span>
                </div>
              )}

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FUND_ORDER.map((fund) => {
                  const cfg = FUND_CONFIGS[fund];
                  const currentVal = localPercentages[fund] ?? 0;
                  return (
                    <div
                      key={fund}
                      className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                          <span className="text-[13.5px] font-bold text-white">{FUND_LABELS[fund]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentVal}
                            onChange={(e) => handlePctChange(fund, parseInt(e.target.value, 10))}
                            className="w-14 text-center bg-[var(--theme-card,#132438)] text-white font-mono font-bold text-xs py-1 rounded-lg border border-[var(--theme-border,#213E61)]"
                          />
                          <span className="text-xs text-[#94A3B8] font-bold">%</span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentVal}
                        onChange={(e) => handlePctChange(fund, parseInt(e.target.value, 10))}
                        className="w-full accent-[var(--theme-primary,#38BDF8)] h-1.5 rounded-lg cursor-pointer bg-[var(--theme-card,#132438)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES & SOURCES */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Expense Categories */}
              <div className="space-y-3 bg-[var(--theme-surface,#0E1A29)] p-4 rounded-2xl border border-[var(--theme-border,#213E61)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-white flex items-center gap-1.5">
                    <Tags className="w-4 h-4 text-[#EF4444]" />
                    <span>Expense Categories ({categories.length})</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 bg-[var(--theme-card,#132438)] text-white text-xs px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCatInput.trim()) {
                        onAddCategory(newCatInput.trim());
                        setNewCatInput('');
                        triggerHapticSound('save');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[44vh] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/70 text-xs"
                    >
                      <span className="text-[#F8FAFC] font-medium">{cat}</span>
                      <button
                        type="button"
                        onClick={() => setItemToDelete({ id: cat, type: 'category', title: `Category: ${cat}` })}
                        className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Income Sources */}
              <div className="space-y-3 bg-[var(--theme-surface,#0E1A29)] p-4 rounded-2xl border border-[var(--theme-border,#213E61)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-white flex items-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                    <span>Income Sources ({incomeSources.length})</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSourceInput}
                    onChange={(e) => setNewSourceInput(e.target.value)}
                    placeholder="New income source name..."
                    className="flex-1 bg-[var(--theme-card,#132438)] text-white text-xs px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSourceInput.trim()) {
                        onAddSource(newSourceInput.trim());
                        setNewSourceInput('');
                        triggerHapticSound('save');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[44vh] overflow-y-auto pr-1">
                  {incomeSources.map((src) => (
                    <div
                      key={src}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]/70 text-xs"
                    >
                      <span className="text-[#F8FAFC] font-medium">{src}</span>
                      <button
                        type="button"
                        onClick={() => setItemToDelete({ id: src, type: 'source', title: `Income Source: ${src}` })}
                        className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                        title="Delete Source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAVINGS GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>{goals.length} Active Goals</span>
              </div>

              <div className="space-y-2">
                {filteredGoals.length === 0 ? (
                  <div className="text-center py-12 text-[#94A3B8]">No savings goals found.</div>
                ) : (
                  filteredGoals.map((goal) => {
                    const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
                    return (
                      <div
                        key={goal.id}
                        className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">{goal.title}</span>
                            <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.2 rounded">
                              {pct}%
                            </span>
                          </div>
                          <div className="text-xs text-[#94A3B8] mt-0.5">
                            Target: {formatCurrency(goal.targetAmount, privacyMask)} · Saved: {formatCurrency(goal.currentAmount, privacyMask)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onEditGoal(goal);
                            }}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-card,#132438)]"
                            title="Edit Goal"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete({ id: goal.id, type: 'goal', title: `Goal: ${goal.title}` })}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15"
                            title="Delete Goal to Trash"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PERSONAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>{notes.length} Stored Notes</span>
              </div>

              <div className="space-y-2">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-12 text-[#94A3B8]">No notes found.</div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">{note.title || 'Untitled Note'}</span>
                          {note.isPinned && (
                            <span className="text-[9.5px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-1.5 py-0.2 rounded">
                              Pinned
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#94A3B8] truncate mt-0.5">{note.content}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEditNote(note);
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-card,#132438)]"
                          title="Edit Note"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete({ id: note.id, type: 'note', title: `Note: ${note.title || 'Untitled'}` })}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15"
                          title="Delete Note to Trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between text-xs text-[#94A3B8] shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>
              {isHindi
                ? 'मास्टर हब से हटाया गया कोई भी आइटम ट्रैश में सुरक्षित जाता है।'
                : 'All deletions from Master Edit Hub are safely redirected to the Recycle Bin.'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-white border border-[var(--theme-border,#213E61)] font-bold text-xs cursor-pointer hover:border-[var(--theme-primary,#38BDF8)] transition-all"
          >
            {isHindi ? 'बंद करें' : 'Close Hub'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDeleteAction}
        title={isHindi ? 'क्या आप इसे हटाकर रीसायकल बिन में भेजना चाहते हैं?' : 'Move item to Recycle Bin?'}
        message={
          isHindi
            ? `"${itemToDelete?.title}" को रीसायकल बिन (Trash) में भेज दिया जाएगा। आप इसे कभी भी रीस्टोर कर सकते हैं।`
            : `"${itemToDelete?.title}" will be moved to your Recycle Bin. You can restore it anytime from the Trash.`
        }
        confirmText={isHindi ? 'हटाएं (Move to Trash)' : 'Move to Trash'}
        type="danger"
      />
    </div>
  );
};
