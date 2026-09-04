import React, { useState } from 'react';
import { Entry, FundType, FundConfig, AppLanguage } from '../types';
import { DEFAULT_FUNDS, getFundLabel } from '../data/defaults';
import { formatCurrency, triggerHapticSound, downloadCSVReport } from '../utils/khataCalculations';
import { getCategoryIcon, getSourceIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { ChevronLeft, ChevronRight, Search, Edit3, Trash2, Plus, Zap, Banknote, Smartphone, Building2, CreditCard, Calendar, Download, Printer } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface HistoryViewProps {
  entries: Entry[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onEditEntry: (entry: Entry) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateAdd: () => void;
  onTriggerPrint?: (targetMonth?: Date) => void;
  funds?: FundConfig[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  entries,
  activeFilter,
  onFilterChange,
  onEditEntry,
  onDeleteEntry,
  onNavigateAdd,
  onTriggerPrint,
  funds,
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  language = 'en',
  privacyMask = false
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi' || language === 'hinglish';
  const activeFunds: FundConfig[] = funds && funds.length > 0 ? funds : DEFAULT_FUNDS;

  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery;
  const setSearchQuery = propOnSearchChange || setInternalSearchQuery;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>('all');

  // Filter options
  const filterOptions: {
    key: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: 'all', label: t.history?.all || 'All' },
    { key: 'income', label: t.history?.incomeOnly || 'Incomes' },
    { key: 'expense', label: t.history?.expenseOnly || 'Expenses' },
    { key: 'pay:upi', label: 'UPI', icon: Smartphone },
    { key: 'pay:cash', label: 'Cash', icon: Banknote },
    { key: 'pay:bank', label: 'Bank', icon: Building2 },
    { key: 'pay:card', label: 'Card', icon: CreditCard },
    ...activeFunds.map((f) => ({
      key: `fund:${f.id}`,
      label: isHindi && f.hindiLabel ? f.hindiLabel.split(' (')[0] : f.label
    }))
  ];

  // Filter entries
  // Unique months extraction
  const uniqueMonths = Array.from(new Set(entries.map(e => e.date.substring(0, 7)))).sort((a: string, b: string) => b.localeCompare(a));
  
  let filtered = entries.slice().sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return b.createdAt - a.createdAt;
  });

  if (activeFilter === 'income') {
    filtered = filtered.filter((e) => e.type === 'income');
  } else if (activeFilter === 'expense') {
    filtered = filtered.filter((e) => e.type === 'expense');
  } else if (activeFilter.startsWith('pay:')) {
    const payMode = activeFilter.split(':')[1];
    filtered = filtered.filter((e) => (e.paymentMode || 'cash') === payMode);
  } else if (activeFilter.startsWith('fund:')) {
    const fundKey = activeFilter.split(':')[1] as FundType;
    filtered = filtered.filter((e) => {
      if (e.type === 'expense') return e.fund === fundKey;
      if (e.targetFund) return e.targetFund === fundKey;
      if (e.fund && e.allocationMode === 'single') return e.fund === fundKey;
      return (e.splits?.[fundKey] ?? 0) > 0;
    });
  }

  // Month filter
  if (activeMonth !== 'all') {
    filtered = filtered.filter(e => e.date.startsWith(activeMonth));
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        (e.source && e.source.toLowerCase().includes(q)) ||
        (e.note && e.note.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.clientName && e.clientName.toLowerCase().includes(q)) ||
        (e.paymentMode && e.paymentMode.toLowerCase().includes(q)) ||
        e.date.includes(q) ||
        String(e.amount).includes(q)
    );
  }

  // Group by date
  const groups: Record<string, Entry[]> = {};
  filtered.forEach((e) => {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  });

  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const totalFilteredIn = filtered.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalFilteredOut = filtered.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      triggerHapticSound('delete');
      onDeleteEntry(deletingId);
      setDeletingId(null);
    }
  };

  const renderPaymentIcon = (mode?: string) => {
    switch (mode) {
      case 'upi':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-500 dark:text-sky-400 border border-sky-500/30 shrink-0 leading-none">
            <Smartphone className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            <span>UPI</span>
          </span>
        );
      case 'bank':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 leading-none">
            <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            <span>Bank</span>
          </span>
        );
      case 'card':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shrink-0 leading-none">
            <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            <span>Card</span>
          </span>
        );
      case 'cash':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 leading-none">
            <Banknote className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            <span>Cash</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200 text-left">
      {/* Header Bar with Search & Quick Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={t.history.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[13.5px] sm:text-[14.5px] rounded-xl pl-10 pr-8 py-2.5 focus:outline-none shadow-sm transition-colors focus:border-[var(--theme-primary,#38BDF8)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)] p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCSVReport(entries, new Date())}
            title={t.history?.exportCsv || 'Export CSV'}
            className="h-[40px] sm:h-[44px] px-3 sm:px-3.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{t.history?.exportCsv || 'Export CSV'}</span>
          </button>

          {onTriggerPrint && (
            <button
              onClick={() => onTriggerPrint(new Date())}
              title={t.history?.printPdf || 'Print Statement'}
              className="h-[40px] sm:h-[44px] px-3 sm:px-3.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t.history?.printPdf || 'Print / PDF'}</span>
            </button>
          )}

          {/* Quick Add Button */}
          <button
            onClick={onNavigateAdd}
            className="h-[40px] sm:h-[44px] px-3.5 sm:px-5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold text-[12px] sm:text-[13.5px] flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-sm hover:brightness-110 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span>{t.home?.newTransaction || 'New Entry'}</span>
          </button>
        </div>
      </div>

      
      {/* Filter Chips Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar no-print w-full">
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.key}
              onClick={() => onFilterChange(opt.key)}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all shrink-0 whitespace-nowrap shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeFilter === opt.key
                  ? 'bg-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                  : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      
      {/* Month Filter Navigator */}
      {uniqueMonths.length > 0 && (
        <div className="flex items-center justify-between mt-2 mb-1 p-1.5 sm:p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-sm w-full no-print">
          <button
            onClick={() => {
              if (activeMonth === 'all') {
                setActiveMonth(uniqueMonths[0]);
              } else {
                const idx = uniqueMonths.indexOf(activeMonth);
                if (idx < uniqueMonths.length - 1) setActiveMonth(uniqueMonths[idx + 1]);
              }
            }}
            disabled={activeMonth !== 'all' && uniqueMonths.indexOf(activeMonth) === uniqueMonths.length - 1}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          
          <div className="flex-1 flex justify-center text-center truncate px-2">
            <button 
              onClick={() => setActiveMonth('all')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12.5px] sm:text-[14px] font-bold transition-all truncate ${
                activeMonth === 'all' 
                  ? 'text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/20'
                  : 'text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)]'
              }`}
            >
              {activeMonth === 'all' ? (isHindi ? 'सभी महीने' : 'All Months') : (
                new Date(`${activeMonth}-01T00:00:00`).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long', year: 'numeric' })
              )}
            </button>
          </div>
          
          <button
            onClick={() => {
              if (activeMonth !== 'all') {
                const idx = uniqueMonths.indexOf(activeMonth);
                if (idx > 0) setActiveMonth(uniqueMonths[idx - 1]);
                else if (idx === 0) setActiveMonth('all');
              }
            }}
            disabled={activeMonth === 'all'}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      )}

      {/* Filter Stats Bar */}
      {entries.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-[14px] text-[#94A3B8] truncate">
            Showing <strong className="text-[var(--theme-text,#F8FAFC)] font-bold">{filtered.length}</strong> records
          </span>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            <span className="text-[#10B981] font-bold font-mono text-[11px] sm:text-[14px] truncate" title={formatCurrency(totalFilteredIn, privacyMask)}>+{formatCurrency(totalFilteredIn, privacyMask)}</span>
            <span className="text-[#EF4444] font-bold font-mono text-[11px] sm:text-[14px] truncate" title={formatCurrency(totalFilteredOut, privacyMask)}>-{formatCurrency(totalFilteredOut, privacyMask)}</span>
          </div>
        </div>
      )}

      {/* List of Entries Grouped by Day */}
      {sortedDates.length === 0 ? (
        <div className="text-center text-[#94A3B8] py-14 px-5 text-[14.5px] border border-dashed border-[var(--theme-border,#213E61)] rounded-2xl bg-[var(--theme-card,#132438)]/40 space-y-4 shadow-sm">
          <div
            className="w-14 h-14 mx-auto rounded-full flex items-center justify-center border"
            style={{
              backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.1))',
              borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.3))'
            }}
          >
            <Zap className="w-7 h-7" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
          </div>
          <p className="leading-relaxed text-[var(--theme-text,#F8FAFC)] font-bold text-[16px]">
            {t.history.noTransactions}
          </p>
          <p className="text-[13.5px] text-[#94A3B8] max-w-sm mx-auto">
            {t.history.noTransactionsSub}
          </p>
          <button
            onClick={onNavigateAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13.5px] transition-colors cursor-pointer shadow-sm bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] hover:brightness-110 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.home.newTransaction}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5 w-full">
          {sortedDates.map((dateStr) => {
            const dayEntries = groups[dateStr];
            const dateObj = new Date(`${dateStr}T00:00:00`);
            const dayLabel = dateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const dayInc = dayEntries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
            const dayExp = dayEntries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
            const dayNet = dayInc - dayExp;

            return (
              <div key={dateStr} className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                {/* Day Header */}
                <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 bg-[var(--theme-surface,#0E1A29)]/50 border-b border-[var(--theme-border,#213E61)]/50 backdrop-blur-sm">
                  <span className="font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2 text-[13px] sm:text-[14px]">
                    <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/20 shadow-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
                    </div>
                    <span>{dayLabel}</span>
                  </span>
                  <span className="font-mono text-[11px] sm:text-[12.5px] font-semibold text-[#94A3B8] bg-[var(--theme-card,#132438)] px-2 py-1 rounded-lg border border-[var(--theme-border,#213E61)]/50">
                    Net: <span className={dayNet < 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}>{formatCurrency(dayNet, privacyMask)}</span>
                  </span>
                </div>

                {/* Day Items List */}
                <div className="flex flex-col w-full">
                  {dayEntries.map((entry) => {
                    const isIncome = entry.type === 'income';
                    const ItemIcon = isIncome
                      ? getSourceIcon(entry.source || 'other')
                      : getCategoryIcon(entry.category || 'misc');
                    const fundLabel = entry.fund ? getFundLabel(entry.fund, activeFunds) : 'Fund';

                    return (
                      <div
                        key={entry.id}
                        id={`entry-row-${entry.id}`}
                        className="w-full flex items-center justify-between p-3.5 sm:p-5 border-b border-[var(--theme-border,#213E61)]/30 hover:bg-[var(--theme-surface,#0E1A29)]/50 transition-colors group overflow-hidden min-w-0 last:border-b-0"
                      >
                        {/* Left Icon & Text Info */}
                        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0 pr-1.5 sm:pr-2">
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                            }`}
                          >
                            <ItemIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                          </div>
                          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[13.5px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                                {isIncome ? (entry.source || entry.note || 'Income') : (entry.category || 'Expense')}
                              </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 text-[11px] sm:text-[12px] text-[#94A3B8] min-w-0">
                              {renderPaymentIcon(entry.paymentMode)}
                              <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[125px] sm:max-w-[180px]">
                                {isIncome ? (
                                  entry.allocationMode === 'single' || entry.targetFund || (entry.fund && (!entry.splits || entry.splits[entry.fund] === entry.amount)) ? (
                                    <span className="text-[#A855F7] font-semibold">
                                      Direct · {entry.targetFund ? getFundLabel(entry.targetFund, activeFunds) : (entry.fund ? getFundLabel(entry.fund, activeFunds) : 'Single Fund')}
                                    </span>
                                  ) : (
                                    'All-Fund Split Rule'
                                  )
                                ) : (
                                  `${fundLabel} Fund`
                                )}
                              </span>
                              {entry.note && (
                                <>
                                  <span className="text-slate-600 font-bold">&bull;</span>
                                  <span className="truncate max-w-[100px] sm:max-w-[160px] text-slate-400">{entry.note}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Right Amount and Controls */}
                        <div className="shrink-0 flex items-center gap-1.5 sm:gap-3 text-right max-w-[55%] sm:max-w-none">
                          <div
                            className={`font-mono text-[12px] xs:text-[13.5px] sm:text-[15.5px] font-bold tracking-tight truncate max-w-[105px] xs:max-w-[135px] sm:max-w-none ${
                              isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                            }`}
                            title={formatCurrency(entry.amount, privacyMask)}
                          >
                            {isIncome ? `+${formatCurrency(entry.amount, privacyMask)}` : `-${formatCurrency(entry.amount, privacyMask)}`}
                          </div>

                          {/* Action Buttons with 40px touch targets */}
                          <div className="flex items-center gap-0.5 sm:gap-1 pl-1 sm:pl-1.5 border-l border-[var(--theme-border,#213E61)] shrink-0">
                            <button
                              onClick={() => onEditEntry(entry)}
                              className="text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] p-1.5 sm:p-2 rounded-xl hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                              title="Edit transaction"
                              aria-label="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            <button
                              onClick={(e) => handleDeletePrompt(entry.id, e)}
                              className="text-[#94A3B8] hover:text-[#EF4444] p-1.5 sm:p-2 rounded-xl hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                              title="Delete transaction (Move to Trash)"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title={t.history.deleteTitle}
        message={t.history.deleteConfirm}
        confirmLabel={t.history.deleteBtn}
        cancelLabel={t.add.cancel}
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
