import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus, AppLanguage } from '../../types';
import {
  Search,
  Filter,
  FileText,
  Printer,
  Copy,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Share2,
  Download
} from 'lucide-react';
import { triggerHapticSound } from '../../utils/khataCalculations';

interface InvoiceHistoryViewProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onUpdateStatus: (invoiceId: string, status: InvoiceStatus) => void;
  onRecordToKhata: (invoice: Invoice) => void;
  onCreateNew: () => void;
  language?: AppLanguage;
}

export const InvoiceHistoryView: React.FC<InvoiceHistoryViewProps> = ({
  invoices,
  onSelectInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onUpdateStatus,
  onRecordToKhata,
  onCreateNew,
  language = 'en'
}) => {
  const isHindi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
      const matchClient = inv.client.clientName.toLowerCase().includes(q) ||
        (inv.client.companyName && inv.client.companyName.toLowerCase().includes(q));
      const matchItems = inv.items.some((it) => it.description.toLowerCase().includes(q));

      return matchNum || matchClient || matchItems;
    });
  }, [invoices, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let countPaid = 0;
    let countUnpaid = 0;

    invoices.forEach((inv) => {
      if (inv.status === 'paid') {
        totalPaid += inv.grandTotal;
        countPaid += 1;
      } else {
        totalPending += inv.grandTotal;
        countUnpaid += 1;
      }
    });

    return { totalPaid, totalPending, countPaid, countUnpaid };
  }, [invoices]);

  return (
    <div className="space-y-4">
      {/* Top Action Bar & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block uppercase tracking-wider">
            {isHindi ? 'कुल इनवॉइस' : 'Total Invoices'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[var(--theme-text,#F8FAFC)] font-mono">
            {invoices.length}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs">
          <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
            {isHindi ? 'भुगतान प्राप्त' : 'Paid Amount'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            ₹{stats.totalPaid.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs">
          <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">
            {isHindi ? 'बकाया राशि' : 'Pending Amount'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            ₹{stats.totalPending.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-2 sm:p-3 rounded-2xl bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onCreateNew();
            }}
            className="w-full h-full py-2 px-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isHindi ? 'नया बिल बनाएं' : 'New Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'इनवॉइस नंबर, ग्राहक या आइटम खोजें...' : 'Search invoice no, client or items...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'paid', 'unpaid', 'overdue', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                setStatusFilter(st);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-xs'
                  : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] border border-[var(--theme-border,#213E61)] hover:text-white'
              }`}
            >
              {st === 'all' ? (isHindi ? 'सभी' : 'All') : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[var(--theme-card,#132438)]/60 border border-[var(--theme-border,#213E61)] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)]">
              {invoices.length === 0
                ? (isHindi ? 'कोई इनवॉइस मौजूद नहीं है' : 'No invoices created yet')
                : (isHindi ? 'कोई परिणाम नहीं मिला' : 'No invoices matched your filter')}
            </h4>
            <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] max-w-sm mx-auto mt-1">
              {isHindi
                ? 'दुकान, फ्रीलांसिंग या सर्विस के लिए तुरंत सुंदर बिल बनाएं।'
                : 'Create professional invoices & bills with GST, UPI QR code & automated calculations.'}
            </p>
          </div>
          {invoices.length === 0 && (
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onCreateNew();
              }}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-xs shadow-md cursor-pointer hover:brightness-110 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isHindi ? 'पहला इनवॉइस बनाएं' : 'Create First Invoice'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Column Info */}
              <div
                className="flex items-start gap-3 min-w-0 cursor-pointer"
                onClick={() => onSelectInvoice(inv)}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-[var(--theme-text,#F8FAFC)] group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inv.status === 'overdue'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                    {inv.isRecordedInKhata && (
                      <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {isHindi ? 'खाता में दर्ज' : 'Recorded in Khata'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--theme-text,#F8FAFC)] truncate mt-0.5">
                    {inv.client.clientName || 'Walk-in Client'}
                    {inv.client.companyName && ` · ${inv.client.companyName}`}
                  </h4>
                  <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                    Date: {inv.invoiceDate} · Due: {inv.dueDate || 'On Receipt'} · {inv.items.length} {inv.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {/* Right Column: Amount & Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-[var(--theme-border,#213E61)]/50 sm:border-none">
                <div className="sm:text-right">
                  <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block uppercase font-medium">
                    Total
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-[var(--theme-text,#F8FAFC)]">
                    {inv.currency} {inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Mark Paid/Unpaid quick toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      onUpdateStatus(inv.id, inv.status === 'paid' ? 'unpaid' : 'paid');
                    }}
                    title={inv.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                    className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
                      inv.status === 'paid'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-emerald-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  {/* Print / View */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      onSelectInvoice(inv);
                    }}
                    title="View & Print"
                    className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      onEditInvoice(inv);
                    }}
                    title="Edit Invoice"
                    className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      onDuplicateInvoice(inv);
                    }}
                    title="Duplicate Invoice"
                    className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Record to Khata if not recorded */}
                  {!inv.isRecordedInKhata && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        onRecordToKhata(inv);
                      }}
                      title="Record as Income in Daily Khata"
                      className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      if (window.confirm(isHindi ? 'क्या आप इस इनवॉइस को हटाना चाहते हैं?' : 'Are you sure you want to delete this invoice?')) {
                        onDeleteInvoice(inv.id);
                      }
                    }}
                    title="Delete Invoice"
                    className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
