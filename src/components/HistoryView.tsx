import React, { useState } from 'react';
import { Entry, FundType, FundConfig, AppLanguage } from '../types';
import { DEFAULT_FUNDS, getFundLabel } from '../data/defaults';
import { formatCurrency, triggerHapticSound, downloadCSVReport } from '../utils/khataCalculations';
import { getCategoryIcon, getSourceIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { Search, Edit3, Trash2, Plus, Zap, Banknote, Smartphone, Building2, Calendar, Download, Printer } from 'lucide-react';
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

  // Filter options
  const filterOptions = [
    { key: 'all', label: t.history?.all || 'All' },
    { key: 'income', label: t.history?.incomeOnly || 'Incomes' },
    { key: 'expense', label: t.history?.expenseOnly || 'Expenses' },
    ...activeFunds.map((f) => ({
      key: `fund:${f.id}`,
      label: isHindi && f.hindiLabel ? f.hindiLabel.split(' (')[0] : f.label
    }))
  ];

  // Filter entries
  let filtered = entries.slice().sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return b.createdAt - a.createdAt;
  });

  if (activeFilter === 'income') {
    filtered = filtered.filter((e) => e.type === 'income');
  } else if (activeFilter === 'expense') {
    filtered = filtered.filter((e) => e.type === 'expense');
  } else if (activeFilter.startsWith('fund:')) {
    const fundKey = activeFilter.split(':')[1] as FundType;
    filtered = filtered.filter((e) => {
      if (e.type === 'expense') return e.fund === fundKey;
      if (e.targetFund) return e.targetFund === fundKey;
      if (e.fund && e.allocationMode === 'single') return e.fund === fundKey;
      return (e.splits?.[fundKey] ?? 0) > 0;
    });
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
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-[11.5px] px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] font-bold border border-[#38BDF8]/30 shrink-0">
            <Smartphone className="w-3 h-3" /> UPI
          </span>
        );
      case 'bank':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-[11.5px] px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-bold border border-[#10B981]/30 shrink-0">
            <Building2 className="w-3 h-3" /> Bank
          </span>
        );
      case 'cash':
      default:
        return (
          <span
            className="inline-flex items-center gap-1 text-[11px] sm:text-[11.5px] px-2 py-0.5 rounded font-bold border shrink-0"
            style={{
              backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.15))',
              color: 'var(--theme-primary, #38BDF8)',
              borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.3))'
            }}
          >
            <Banknote className="w-3 h-3" /> Cash
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={t.history.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[14px] sm:text-[15px] rounded-xl pl-10 pr-8 py-3 focus:outline-none shadow-xs"
            style={{
              borderColor: searchQuery ? 'var(--theme-primary, #38BDF8)' : undefined
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#F8FAFC] p-1 cursor-pointer"
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
            className="h-[44px] px-3 sm:px-3.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] hover:text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t.history?.exportCsv || 'Export CSV'}</span>
          </button>

          {onTriggerPrint && (
            <button
              onClick={() => onTriggerPrint(new Date())}
              title={t.history?.printPdf || 'Print Statement'}
              className="h-[44px] px-3 sm:px-3.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] hover:text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{t.history?.printPdf || 'Print / PDF'}</span>
            </button>
          )}

          {/* Quick Add Button */}
          <button
            onClick={onNavigateAdd}
            className="h-[44px] px-4 sm:px-5 rounded-xl font-extrabold text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
              color: 'var(--theme-btn-text, #040D17)'
            }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.home?.newTransaction || 'Add +'}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar no-print w-full">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => {
                onFilterChange(opt.key);
                triggerHapticSound('click');
              }}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-[13px] sm:text-[13.5px] font-bold transition-all cursor-pointer border shrink-0 ${
                isActive
                  ? 'shadow-sm'
                  : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--theme-btn-bg, #38BDF8)' : undefined,
                color: isActive ? 'var(--theme-btn-text, #040D17)' : undefined,
                borderColor: isActive ? 'var(--theme-primary, #38BDF8)' : undefined
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Filter Stats Bar */}
      {entries.length > 0 && (
        <div className="flex justify-between items-center bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl px-4 py-2.5 text-[13px] sm:text-[14px]">
          <span className="text-[#94A3B8] truncate mr-2">
            Showing <strong className="text-[#F8FAFC] font-bold">{filtered.length}</strong> records
          </span>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="text-[#10B981] font-bold font-mono">+{formatCurrency(totalFilteredIn, privacyMask)}</span>
            <span className="text-[#EF4444] font-bold font-mono">-{formatCurrency(totalFilteredOut, privacyMask)}</span>
          </div>
        </div>
      )}

      {/* List of Entries Grouped by Day */}
      {sortedDates.length === 0 ? (
        <div className="text-center text-[#94A3B8] py-14 px-5 text-[14.5px] border border-dashed border-[var(--theme-border,#213E61)] rounded-2xl bg-[var(--theme-card,#132438)]/40 space-y-4 shadow-md">
          <div
            className="w-14 h-14 mx-auto rounded-full flex items-center justify-center border"
            style={{
              backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.1))',
              borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.3))'
            }}
          >
            <Zap className="w-7 h-7" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
          </div>
          <p className="leading-relaxed text-[#F8FAFC] font-bold text-[16px]">
            {t.history.noTransactions}
          </p>
          <p className="text-[13.5px] text-[#94A3B8] max-w-sm mx-auto">
            {t.history.noTransactionsSub}
          </p>
          <button
            onClick={onNavigateAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-[14px] transition-colors cursor-pointer shadow-md"
            style={{
              backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
              color: 'var(--theme-btn-text, #040D17)'
            }}
          >
            <Plus className="w-4.5 h-4.5" />
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
              <div key={dateStr} className="space-y-2.5 w-full">
                {/* Day Header */}
                <div className="flex justify-between items-center px-1 text-[13px] sm:text-[14px] text-[#94A3B8]">
                  <span className="font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                    <span>{dayLabel}</span>
                  </span>
                  <span className="font-mono text-[#94A3B8]">
                    Net: <span className={dayNet < 0 ? 'text-[#EF4444] font-bold' : 'text-[#10B981] font-bold'}>{formatCurrency(dayNet, privacyMask)}</span>
                  </span>
                </div>

                {/* Day Items List */}
                <div className="space-y-2.5 w-full">
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
                        className="w-full flex items-center justify-between bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-2xl p-3.5 sm:p-4 shadow-sm transition-all group overflow-hidden"
                      >
                        {/* Left Icon & Text Info */}
                        <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0 pr-2">
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                            }`}
                          >
                            <ItemIcon className="w-5 h-5" />
                          </div>

                          <div className="flex flex-col gap-1 min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[14.5px] sm:text-[15.5px] font-bold text-[#F8FAFC] truncate">
                                {isIncome ? (entry.source || entry.note || 'Income') : (entry.category || 'Expense')}
                              </span>
                              {renderPaymentIcon(entry.paymentMode)}
                            </div>

                            <div className="text-[12px] sm:text-[12.5px] text-[#94A3B8] truncate">
                              {isIncome ? (
                                <span>
                                  {entry.note ? `${entry.note} · ` : ''}
                                  {entry.allocationMode === 'single' || entry.targetFund || (entry.fund && (!entry.splits || entry.splits[entry.fund] === entry.amount)) ? (
                                    <span className="text-[#A855F7] font-semibold">
                                      Direct · {entry.targetFund ? getFundLabel(entry.targetFund, activeFunds) : (entry.fund ? getFundLabel(entry.fund, activeFunds) : 'Single Fund')}
                                    </span>
                                  ) : (
                                    'All-Fund Split Rule'
                                  )}
                                </span>
                              ) : (
                                <span>
                                  {fundLabel} Fund
                                  {entry.note ? ` · ${entry.note}` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Amount and Controls */}
                        <div className="shrink-0 flex items-center gap-2 sm:gap-3 text-right">
                          <div
                            className={`font-mono text-[15.5px] sm:text-[17.5px] font-bold tracking-tight whitespace-nowrap ${
                              isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                            }`}
                          >
                            {isIncome ? `+${formatCurrency(entry.amount, privacyMask)}` : `-${formatCurrency(entry.amount, privacyMask)}`}
                          </div>

                          {/* Action Buttons with 40px touch targets */}
                          <div className="flex items-center gap-1 pl-1.5 border-l border-[var(--theme-border,#213E61)]">
                            <button
                              onClick={() => onEditEntry(entry)}
                              className="text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] p-2 rounded-xl hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                              title="Edit transaction"
                              aria-label="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={(e) => handleDeletePrompt(entry.id, e)}
                              className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-xl hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                              title="Delete transaction"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
