import React, { useState, useMemo } from 'react';
import {
  DebtItem,
  DebtType,
  DebtPayment,
  PaymentMode,
  AppLanguage,
  FundType,
  FundConfig
} from '../types';
import { formatCurrency, triggerHapticSound, triggerCelebration } from '../utils/khataCalculations';
import {
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Search,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  History,
  Printer,
  X,
  Building2,
  Wallet,
  Zap,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  FileSpreadsheet,
  Check,
  Copy
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoanUdharLedgerViewProps {
  debtItems: DebtItem[];
  onSaveDebtItem: (item: Omit<DebtItem, 'id' | 'createdAt' | 'updatedAt'>, editingId?: string) => void;
  onDeleteDebtItem: (id: string) => void;
  onRecordPayment: (
    debtId: string,
    payment: Omit<DebtPayment, 'id' | 'createdAt'>,
    recordInKhata?: boolean,
    khataFund?: FundType
  ) => void;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  onToggleSettle: (debtId: string) => void;
  onNavigateAdd?: () => void;
  onBack?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
  funds?: FundConfig[];
}

export const LoanUdharLedgerView: React.FC<LoanUdharLedgerViewProps> = ({
  debtItems = [],
  onSaveDebtItem,
  onDeleteDebtItem,
  onRecordPayment,
  onDeletePayment,
  onToggleSettle,
  onBack,
  language: _language = 'en',
  privacyMask = false,
  funds = []
}) => {
  // Filters & Search
  const [selectedType, setSelectedType] = useState<'all' | DebtType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'recent'>('dueDate');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DebtItem | null>(null);

  // Payment Recording Modal
  const [activePayingItem, setActivePayingItem] = useState<DebtItem | null>(null);

  // History Modal
  const [activeHistoryItem, setActiveHistoryItem] = useState<DebtItem | null>(null);

  // WhatsApp Reminder Modal
  const [activeReminderItem, setActiveReminderItem] = useState<DebtItem | null>(null);
  const [copiedReminder, setCopiedReminder] = useState(false);

  // 1. Calculate Aggregate Financial KPIs
  const stats = useMemo(() => {
    let totalLent = 0; // Receivable
    let totalBorrowed = 0; // Payable to people
    let totalLoanPrincipal = 0; // Bank Loan Principal remaining
    let monthlyEmiTotal = 0; // Total monthly EMI obligations

    let activeLentCount = 0;
    let activeBorrowedCount = 0;
    let activeLoanCount = 0;

    debtItems.forEach((item) => {
      const isSettled = item.status === 'settled' || item.remainingAmount <= 0;
      if (item.type === 'lent') {
        if (!isSettled) {
          totalLent += item.remainingAmount;
          activeLentCount++;
        }
      } else if (item.type === 'borrowed') {
        if (!isSettled) {
          totalBorrowed += item.remainingAmount;
          activeBorrowedCount++;
        }
      } else if (item.type === 'loan_emi') {
        if (!isSettled) {
          totalLoanPrincipal += item.remainingAmount;
          activeLoanCount++;
          if (item.emiAmount && item.emiAmount > 0) {
            monthlyEmiTotal += item.emiAmount;
          }
        }
      }
    });

    const totalPayable = totalBorrowed + totalLoanPrincipal;
    const netPosition = totalLent - totalPayable; // positive = net creditor, negative = net debtor

    return {
      totalLent,
      totalBorrowed,
      totalLoanPrincipal,
      totalPayable,
      monthlyEmiTotal,
      netPosition,
      activeLentCount,
      activeBorrowedCount,
      activeLoanCount
    };
  }, [debtItems]);

  // 2. Upcoming Dues & Overdue Detection (Alerts)
  const urgentAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return debtItems.filter((item) => {
      if (item.status === 'settled' || item.remainingAmount <= 0) return false;
      if (!item.dueDate) return false;

      const due = new Date(item.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Show if overdue or due in next 7 days
      return diffDays <= 7;
    });
  }, [debtItems]);

  // 3. Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return debtItems
      .filter((item) => {
        if (selectedType !== 'all' && item.type !== selectedType) return false;
        if (selectedStatus === 'active') {
          if (item.status === 'settled' || item.remainingAmount <= 0) return false;
        } else if (selectedStatus === 'settled') {
          if (item.status !== 'settled' && item.remainingAmount > 0) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchNote = item.note?.toLowerCase().includes(q) || false;
          const matchPhone = item.phone?.includes(q) || false;
          const matchCategory = item.category?.toLowerCase().includes(q) || false;
          return matchTitle || matchNote || matchPhone || matchCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return b.remainingAmount - a.remainingAmount;
        }
        if (sortBy === 'recent') {
          return b.createdAt - a.createdAt;
        }
        // default: dueDate
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [debtItems, selectedType, selectedStatus, searchQuery, sortBy]);

  // WhatsApp Reminder message helper
  const getWhatsAppReminderText = (item: DebtItem) => {
    const name = item.title || 'Friend';
    const amtStr = formatCurrency(item.remainingAmount, false);
    const dateStr = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '';

    return `Hello ${name},\nThis is a polite reminder regarding the outstanding balance of ${amtStr} recorded in our records.${item.note ? `\nReference: ${item.note}` : ''}${dateStr ? `\nTarget Due Date: ${dateStr}` : ''}\n\nKindly arrange for the settlement at your earliest convenience. Thank you!`;
  };

  const handleOpenWhatsApp = (item: DebtItem) => {
    const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, '') : '';
    const text = getWhatsAppReminderText(item);
    const encodedText = encodeURIComponent(text);
    const url = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(url, '_blank');
  };

  const handleCopyReminder = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReminder(true);
    triggerHapticSound('click');
    setTimeout(() => setCopiedReminder(false), 2000);
  };

  const handlePrintStatement = () => {
    triggerHapticSound('click');
    
    // Generate an optimized A4 HTML view for printing
    const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    
    const activeDebtCount = debtItems.filter(d => d.status === 'active').length;
    
    let tableRows = filteredItems.map(item => {
      const isLent = item.type === 'lent';
      const isBank = item.type === 'loan';
      const badgeClass = isLent ? 'badge-inc' : isBank ? 'badge-net' : 'badge-exp';
      const badgeText = isLent ? 'Receivable' : isBank ? 'Bank Loan' : 'Payable';
      const amountColor = isLent ? 'color: #16a34a;' : 'color: #dc2626;';
      
      const progressPercent = item.amount > 0 ? ((item.amount - item.remainingAmount) / item.amount) * 100 : 0;
      
      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: #0f172a;">${escapeHtml(item.title)}</div>
            ${item.phone ? `<div style="font-size: 10px; color: #64748b;">${escapeHtml(item.phone)}</div>` : ''}
          </td>
          <td>
            <span class="badge ${badgeClass}">${badgeText}</span>
            <div style="margin-top: 4px; font-size: 10px; color: #64748b;">
              Start: ${new Date(item.createdAt).toLocaleDateString()}
              ${item.dueDate ? `<br/>Due: ${new Date(item.dueDate).toLocaleDateString()}` : ''}
            </div>
          </td>
          <td>
            <div style="font-weight: bold; ${amountColor}">Principal: ${formatCurrency(item.amount, privacyMask)}</div>
            <div style="font-size: 10px; color: #475569;">
              Remaining: ${formatCurrency(item.remainingAmount, privacyMask)}
            </div>
          </td>
          <td>
            <div style="font-size: 11px; font-weight: 600; color: ${item.status === 'settled' ? '#16a34a' : '#ea580c'};">
              ${item.status === 'settled' ? 'SETTLED' : 'ACTIVE'}
            </div>
            ${item.status === 'active' ? `
              <div style="width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; margin-top: 4px;">
                <div style="height: 4px; border-radius: 2px; background: ${isLent ? '#22c55e' : '#f97316'}; width: ${Math.min(100, Math.max(0, progressPercent))}%;"></div>
              </div>
              <div style="font-size: 9px; margin-top: 2px; color: #64748b;">${progressPercent.toFixed(0)}% Repaid</div>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Khata Pro — Debt & Loan Statement</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #0f172a; max-width: 820px; margin: 0 auto; line-height: 1.45; background: #fff; }
    .brand-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; }
    .brand-title { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #0f172a; color: #fff; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .summary-label { font-size: 10.5px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
    .summary-val { font-size: 16px; font-weight: bold; margin-top: 4px; font-family: -apple-system, monospace; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 16px; }
    th { text-align: left; padding: 7px 8px; border-bottom: 2px solid #cbd5e1; color: #475569; font-weight: 700; background: #f1f5f9; }
    td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .badge { display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 700; border-radius: 4px; text-transform: uppercase; }
    .badge-inc { background: #dcfce7; color: #166534; }
    .badge-exp { background: #fee2e2; color: #991b1b; }
    .badge-net { background: #e0f2fe; color: #075985; }
    .doc-end-divider { margin-top: 28px; padding-top: 10px; border-top: 1.5px solid #e2e8f0; font-size: 10.5px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="brand-header">
    <div>
      <div class="brand-title">Daily Khata Pro — Debt &amp; Loan Ledger</div>
      <div class="brand-sub">Active Obligations &amp; Outstanding Receivables</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #475569;">
      <div style="font-weight: 700; color: #0f172a;">Generated: ${new Date().toLocaleDateString('en-IN')}</div>
      <div>Total Records: ${debtItems.length} (${activeDebtCount} Active)</div>
    </div>
  </div>

  <div class="summary-grid">
    <div>
      <div class="summary-label">Receivables</div>
      <div class="summary-val" style="color: #34d399;">${formatCurrency(stats.totalLent, privacyMask)}</div>
    </div>
    <div>
      <div class="summary-label">Payables</div>
      <div class="summary-val" style="color: #f87171;">${formatCurrency(stats.totalBorrowed, privacyMask)}</div>
    </div>
    <div>
      <div class="summary-label">Bank Loans</div>
      <div class="summary-val" style="color: #7dd3fc;">${formatCurrency(stats.totalLoanPrincipal, privacyMask)}</div>
    </div>
    <div>
      <div class="summary-label">Net Standing</div>
      <div class="summary-val" style="color: ${stats.netPosition >= 0 ? '#34d399' : '#fbbf24'};">${stats.netPosition >= 0 ? '+' : ''}${formatCurrency(stats.netPosition, privacyMask)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30%">Entity Name</th>
        <th style="width: 25%">Type &amp; Dates</th>
        <th style="width: 25%">Amount</th>
        <th style="width: 20%">Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows.length > 0 ? tableRows : '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #64748b;">No debt records found matching criteria.</td></tr>'}
    </tbody>
  </table>

  <div class="doc-end-divider">
    System Generated Report by Daily Khata Pro
  </div>
</body>
</html>`;

    try {
      const existingFrame = document.getElementById('khata-print-frame');
      if (existingFrame) existingFrame.remove();

      const printFrame = document.createElement('iframe');
      printFrame.id = 'khata-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(htmlContent);
        frameDoc.close();

        setTimeout(() => {
          try {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
          } catch {
            window.print();
          }
        }, 400);
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 text-left animate-in fade-in duration-200">
      {/* 1. Header with Back Navigation & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-4 sm:p-5 rounded-2xl shadow-sm">
        <div className="space-y-1.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{_language === 'hi' ? 'उधार एवं लोन रजिस्टर (Udhar & Loans)' : 'Loans & Udhar Records'}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  ADVANCED
                </span>
              </h1>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)]">
                {_language === 'hi' ? 'अपना दिया हुआ उधार, लिया हुआ उधार और बैंक EMI ट्रैक करें' : 'Track money you lent (Udhar), money you borrowed, and bank EMIs'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrintStatement}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-xs font-semibold hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer no-print"
            title="Print statement"
            id="print-loan-ledger-btn"
          >
            <Printer className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)]" />
            <span className="hidden sm:inline">{_language === 'hi' ? 'प्रिंट स्टेटमेंट' : 'Print Statement'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all hover:opacity-90 active:scale-95 bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]"
            id="add-new-debt-btn"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{_language === 'hi' ? '+ नया उधार / लोन लिखें' : '+ Record Udhar / Loan'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: To Receive (Money Lent) */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-[var(--theme-surface,#0E1A29)] to-[var(--theme-surface,#0E1A29)] border border-emerald-500/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4" />
              <span>{_language === 'hi' ? 'उधार दिया (Lent)' : 'Lent (Udhar Diya)'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              {stats.activeLentCount} active
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-[var(--theme-text,#F8FAFC)] block tracking-tight">
              {formatCurrency(stats.totalLent, privacyMask)}
            </span>
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mt-0.5">
              {_language === 'hi' ? 'कुल पैसा जो आपको वापस लेना है' : 'Total money to collect back'}
            </span>
          </div>
        </div>

        {/* Card 2: To Pay (Money Borrowed) */}
        <div className="bg-gradient-to-br from-rose-500/10 via-[var(--theme-surface,#0E1A29)] to-[var(--theme-surface,#0E1A29)] border border-rose-500/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowDownLeft className="w-4 h-4" />
              <span>Payables</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              {stats.activeBorrowedCount} active
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-[var(--theme-text,#F8FAFC)] block tracking-tight">
              {formatCurrency(stats.totalBorrowed, privacyMask)}
            </span>
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mt-0.5">
              Personal borrowings to return
            </span>
          </div>
        </div>

        {/* Card 3: Bank Loan & Monthly EMI */}
        <div className="bg-gradient-to-br from-sky-500/10 via-[var(--theme-surface,#0E1A29)] to-[var(--theme-surface,#0E1A29)] border border-sky-500/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4" />
              <span>Bank Loans & EMIs</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
              {stats.activeLoanCount} active
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-black font-mono text-[var(--theme-text,#F8FAFC)] block tracking-tight">
              {formatCurrency(stats.totalLoanPrincipal, privacyMask)}
            </span>
            <div className="flex items-center justify-between text-[11px] text-sky-300/90 font-medium mt-0.5">
              <span>Commitment:</span>
              <span className="font-mono font-bold">{formatCurrency(stats.monthlyEmiTotal, privacyMask)}/mo</span>
            </div>
          </div>
        </div>

        {/* Card 4: Net Position */}
        <div className={`bg-gradient-to-br ${stats.netPosition >= 0 ? 'from-emerald-500/10' : 'from-amber-500/10'} via-[var(--theme-surface,#0E1A29)] to-[var(--theme-surface,#0E1A29)] border ${stats.netPosition >= 0 ? 'border-emerald-500/30' : 'border-amber-500/30'} rounded-2xl p-4 shadow-sm relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${stats.netPosition >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              <Wallet className="w-4 h-4" />
              <span>Net Debt Standing</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${stats.netPosition >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
              {stats.netPosition >= 0 ? 'Net Creditor' : 'Net Debtor'}
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-lg sm:text-2xl font-black font-mono block tracking-tight ${stats.netPosition >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {stats.netPosition >= 0 ? '+' : ''}{formatCurrency(stats.netPosition, privacyMask)}
            </span>
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mt-0.5">
              {stats.netPosition >= 0
                ? 'Receivables exceed total debt obligations'
                : 'Outstanding liabilities exceed receivables'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Urgent Dues Alert Banner (If any within 7 days or overdue) */}
      {urgentAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-500/40 rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
              <span>Upcoming & Overdue Repayments ({urgentAlerts.length} pending)</span>
            </div>
            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
              Timely clearance maintains high financial standing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {urgentAlerts.map((item) => {
              const due = new Date(item.dueDate || '');
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = diffDays < 0;

              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                        {item.title}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${isOverdue ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'}`}>
                        {isOverdue ? `${Math.abs(diffDays)}d overdue` : (diffDays === 0 ? 'Due Today' : `In ${diffDays}d`)}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-mono block">
                      {formatCurrency(item.isEmi && item.emiAmount ? item.emiAmount : item.remainingAmount, privacyMask)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticSound('click');
                      setActivePayingItem(item);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] hover:opacity-90 transition-all cursor-pointer"
                  >
                    Pay
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Controls: Type Tabs, Status Filter, Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3 rounded-2xl">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Records', icon: Landmark },
            { id: 'lent', label: 'Receivables (Lent)', icon: ArrowUpRight, color: 'text-emerald-400' },
            { id: 'borrowed', label: 'Payables (Borrowed)', icon: ArrowDownLeft, color: 'text-rose-400' },
            { id: 'loan_emi', label: 'Bank Loans & EMIs', icon: Building2, color: 'text-sky-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  triggerHapticSound('click');
                  setSelectedType(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm'
                    : 'bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] border border-[var(--theme-border,#213E61)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? '' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim,#94A3B8)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search person, bank, phone..."
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)]/60 focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)]'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('active')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                selectedStatus === 'active'
                  ? 'bg-[var(--theme-card,#132438)] text-emerald-400'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('settled')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                selectedStatus === 'settled'
                  ? 'bg-[var(--theme-card,#132438)] text-sky-400'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              Settled
            </button>
          </div>
        </div>
      </div>

      {/* 5. Loans / Udhar Items List or Clean Empty State */}
      {debtItems.length === 0 ? (
        /* Pristine Empty State - User will add data from scratch */
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Landmark className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)]">
              No Loans or Debt Records Yet
            </h3>
            <p className="text-xs sm:text-sm text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
              Your debt records are clean and ready. Add money lent to others, personal debts you owe, or active bank loans and EMIs to track repayments and schedules.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all hover:opacity-90 active:scale-95 bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Record Your First Loan or Debt</span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--theme-border,#213E61)] text-left">
            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
                <span>Receivables Tracking</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                Keep an accurate log of money lent to friends, relatives, or business contacts with target settlement dates.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <Building2 className="w-4 h-4" />
                <span>Bank EMI Amortization</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                Track vehicle, personal, or home loan EMIs, interest rates, tenure counts, and monthly due dates.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Passbook Integration</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                Optionally sync received repayments into your Daily Khata fund balances as income or expense entries.
              </p>
            </div>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        /* Filter Empty State (records exist, but filter/search matched zero) */
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--theme-text,#F8FAFC)]">
            No Matching Records Found
          </h3>
          <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] max-w-sm mx-auto">
            Try adjusting your search query or filter pills to view your records.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-semibold text-[var(--theme-text,#F8FAFC)] hover:border-sky-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isSettled = item.status === 'settled' || item.remainingAmount <= 0;
            const repaidAmount = Math.max(0, item.principalAmount - item.remainingAmount);
            const progressPercent = item.principalAmount > 0
              ? Math.min(100, Math.round((repaidAmount / item.principalAmount) * 100))
              : 0;

            const due = item.dueDate ? new Date(item.dueDate) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let diffDays: number | null = null;
            let isOverdue = false;
            if (due) {
              due.setHours(0, 0, 0, 0);
              diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              isOverdue = diffDays < 0;
            }

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-[var(--theme-surface,#0E1A29)] border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-all relative ${
                  isSettled
                    ? 'border-emerald-500/30 opacity-85'
                    : isOverdue
                    ? 'border-rose-500/40 shadow-rose-950/20'
                    : 'border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50'
                }`}
              >
                {/* Header of the Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        item.type === 'lent'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : item.type === 'borrowed'
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                      }`}
                    >
                      {item.type === 'lent' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : item.type === 'borrowed' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <Landmark className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                            item.type === 'lent'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : item.type === 'borrowed'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          }`}
                        >
                          {item.type === 'lent'
                            ? 'Lent (Receivable)'
                            : item.type === 'borrowed'
                            ? 'Borrowed (Payable)'
                            : 'Bank Loan / EMI'}
                        </span>
                      </div>

                      {item.phone && (
                        <div className="flex items-center gap-2 text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                          <a
                            href={`tel:${item.phone}`}
                            className="hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{item.phone}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isSettled ? (
                      <span className="text-[10px] font-bold px-2 py-0.8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Settled</span>
                      </span>
                    ) : isOverdue ? (
                      <span className="text-[10px] font-bold px-2 py-0.8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Overdue</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.8 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount & Progress Section */}
                <div className="bg-[var(--theme-bg,#070E18)]/70 border border-[var(--theme-border,#213E61)] rounded-xl p-3 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block uppercase tracking-wider font-semibold">
                        {isSettled ? 'Settled Amount' : 'Remaining Balance'}
                      </span>
                      <span
                        className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                          isSettled
                            ? 'text-emerald-400'
                            : item.type === 'lent'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {formatCurrency(item.remainingAmount, privacyMask)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
                        Principal
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-[var(--theme-text-dim,#94A3B8)]">
                        {formatCurrency(item.principalAmount, privacyMask)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[var(--theme-card,#132438)] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSettled
                            ? 'bg-emerald-500'
                            : item.type === 'lent'
                            ? 'bg-emerald-400'
                            : 'bg-sky-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-mono">
                      <span>Repaid: {formatCurrency(repaidAmount, privacyMask)}</span>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>

                  {/* EMI Specific Metrics */}
                  {item.isEmi && (
                    <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {item.emiAmount && (
                        <div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
                            Monthly EMI
                          </span>
                          <span className="font-mono font-bold text-sky-400">
                            {formatCurrency(item.emiAmount, privacyMask)}
                          </span>
                        </div>
                      )}
                      {item.totalEmis && (
                        <div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
                            Tenure Progress
                          </span>
                          <span className="font-mono font-semibold text-[var(--theme-text,#F8FAFC)]">
                            {item.paidEmis || item.payments?.length || 0} / {item.totalEmis}
                          </span>
                        </div>
                      )}
                      {item.emiDayOfMonth && (
                        <div>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block">
                            Due Day
                          </span>
                          <span className="font-mono font-semibold text-[var(--theme-text,#F8FAFC)]">
                            {item.emiDayOfMonth}th monthly
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dates & Notes */}
                <div className="flex items-center justify-between text-xs text-[var(--theme-text-dim,#94A3B8)] flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)]" />
                    <span>
                      Started: {new Date(item.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  {item.dueDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--theme-text-dim,#64748B)]" />
                      <span className={isOverdue && !isSettled ? 'text-rose-400 font-bold' : ''}>
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                        {diffDays !== null && !isSettled && (
                          <span className="ml-1 text-[10px] font-mono">
                            ({isOverdue ? `${Math.abs(diffDays)}d overdue` : `${diffDays}d left`})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {item.note && (
                  <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] bg-[var(--theme-card,#132438)]/50 p-2 rounded-lg italic">
                    "{item.note}"
                  </p>
                )}

                {/* Action Buttons Toolbar */}
                <div className="pt-2 border-t border-[var(--theme-border,#213E61)] flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Record Payment Button */}
                    {!isSettled && (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHapticSound('click');
                          setActivePayingItem(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold text-xs flex items-center gap-1 shadow-sm hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{item.isEmi ? 'Pay EMI' : 'Record Payment'}</span>
                      </button>
                    )}

                    {/* WhatsApp Reminder (especially for Lent) */}
                    {item.type === 'lent' && !isSettled && (
                      <button
                        type="button"
                        onClick={() => setActiveReminderItem(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    )}

                    {/* Payment History Button */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        setActiveHistoryItem(item);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card,#132438)]/80 border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-[var(--theme-text-dim,#94A3B8)]" />
                      <span>History</span>
                      {item.payments && item.payments.length > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.2 rounded bg-[var(--theme-border,#213E61)] text-[10px] font-mono">
                          {item.payments.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Toggle Settle */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('save');
                        if (!isSettled) triggerCelebration();
                        onToggleSettle(item.id);
                      }}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSettled
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-emerald-400'
                      }`}
                      title={isSettled ? 'Mark as Active' : 'Mark as Settled'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        setEditingItem(item);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-all cursor-pointer"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the debt record for "${item.title}"?`)) {
                          triggerHapticSound('delete');
                          onDeleteDebtItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-rose-400 transition-all cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 6. WhatsApp Reminder Modal */}
      {activeReminderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border,#213E61)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                    WhatsApp Payment Reminder
                  </h3>
                  <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                    Polite, professional reminder message
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReminderItem(null)}
                className="p-1 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Preview Message
              </label>
              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] whitespace-pre-line leading-relaxed font-sans">
                {getWhatsAppReminderText(activeReminderItem)}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleCopyReminder(getWhatsAppReminderText(activeReminderItem))}
                className="px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-semibold text-[var(--theme-text,#F8FAFC)] hover:border-sky-400 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReminder ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReminder ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenWhatsApp(activeReminderItem);
                  setActiveReminderItem(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add / Edit Loan & Udhar Modal */}
      {isAddModalOpen && (
        <AddEditLoanModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          editingItem={editingItem}
          onSave={onSaveDebtItem}
        />
      )}

      {/* 8. Record Payment Modal */}
      {activePayingItem && (
        <RecordPaymentModal
          isOpen={Boolean(activePayingItem)}
          onClose={() => setActivePayingItem(null)}
          debtItem={activePayingItem}
          onRecordPayment={onRecordPayment}
          funds={funds}
        />
      )}

      {/* 9. Payment History Modal */}
      {activeHistoryItem && (
        <PaymentHistoryModal
          isOpen={Boolean(activeHistoryItem)}
          onClose={() => setActiveHistoryItem(null)}
          debtItem={activeHistoryItem}
          onDeletePayment={onDeletePayment}
          privacyMask={privacyMask}
        />
      )}
    </div>
  );
};

/* =========================================================================
   SUB-COMPONENT: Add / Edit Loan & Udhar Modal (Professional English)
   ========================================================================= */
interface AddEditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: DebtItem | null;
  onSave: (item: Omit<DebtItem, 'id' | 'createdAt' | 'updatedAt'>, editingId?: string) => void;
}

const AddEditLoanModal: React.FC<AddEditLoanModalProps> = ({
  isOpen: _isOpen,
  onClose,
  editingItem,
  onSave
}) => {
  const [type, setType] = useState<DebtType>(editingItem?.type || 'lent');
  const [title, setTitle] = useState(editingItem?.title || '');
  const [phone, setPhone] = useState(editingItem?.phone || '');
  const [principalAmountStr, setPrincipalAmountStr] = useState(
    editingItem ? String(editingItem.principalAmount) : ''
  );
  const [startDate, setStartDate] = useState(
    editingItem?.startDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(editingItem?.dueDate || '');
  const [category, setCategory] = useState(editingItem?.category || 'Personal');
  const [note, setNote] = useState(editingItem?.note || '');

  // EMI specifics
  const [isEmi, setIsEmi] = useState(editingItem?.isEmi || type === 'loan_emi');
  const [emiAmountStr, setEmiAmountStr] = useState(
    editingItem?.emiAmount ? String(editingItem.emiAmount) : ''
  );
  const [emiDayOfMonth, setEmiDayOfMonth] = useState<number>(editingItem?.emiDayOfMonth || 5);
  const [totalEmis, setTotalEmis] = useState<number>(editingItem?.totalEmis || 12);
  const [paidEmis, setPaidEmis] = useState<number>(editingItem?.paidEmis || 0);
  const [interestRateStr, setInterestRateStr] = useState(
    editingItem?.interestRate ? String(editingItem.interestRate) : ''
  );
  const [loanAccountNumber, setLoanAccountNumber] = useState(editingItem?.loanAccountNumber || '');

  // Automatically adjust isEmi when type changes
  const handleTypeChange = (newType: DebtType) => {
    setType(newType);
    if (newType === 'loan_emi') {
      setIsEmi(true);
      if (!category || category === 'Personal') setCategory('Bank Loan');
    } else {
      setIsEmi(false);
    }
  };

  // Auto calculate monthly EMI using standard formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const handleAutoCalculateEmi = () => {
    const P = parseFloat(principalAmountStr);
    const rate = parseFloat(interestRateStr);
    const n = totalEmis;
    if (isNaN(P) || P <= 0 || !n || n <= 0) return;

    if (isNaN(rate) || rate <= 0) {
      // 0% interest: simple division
      setEmiAmountStr(String(Math.round(P / n)));
      return;
    }

    const r = rate / 12 / 100;
    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    setEmiAmountStr(String(emi));
    triggerHapticSound('click');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(principalAmountStr);
    if (isNaN(principal) || principal <= 0) {
      alert('Please enter a valid principal amount.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter person or bank name.');
      return;
    }

    const emiAmount = isEmi && emiAmountStr ? parseFloat(emiAmountStr) : undefined;
    const interestRate = interestRateStr ? parseFloat(interestRateStr) : undefined;

    // Remaining amount calculation
    let remaining = editingItem ? editingItem.remainingAmount : principal;
    if (!editingItem && isEmi && paidEmis > 0 && emiAmount) {
      remaining = Math.max(0, principal - (paidEmis * emiAmount));
    }

    onSave(
      {
        type,
        title: title.trim(),
        phone: phone.trim() || undefined,
        principalAmount: principal,
        remainingAmount: remaining,
        startDate,
        dueDate: dueDate || undefined,
        isEmi,
        emiAmount,
        emiDayOfMonth: isEmi ? emiDayOfMonth : undefined,
        totalEmis: isEmi ? totalEmis : undefined,
        paidEmis: isEmi ? paidEmis : undefined,
        interestRate,
        loanAccountNumber: loanAccountNumber.trim() || undefined,
        status: remaining <= 0 ? 'settled' : 'active',
        payments: editingItem?.payments || [],
        category,
        note: note.trim() || undefined
      },
      editingItem?.id
    );

    triggerHapticSound('save');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Landmark className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[var(--theme-text,#F8FAFC)]">
              {editingItem ? 'Edit Debt / Loan Record' : 'Add New Debt or Loan'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Type Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('lent')}
              className={`py-2 px-1 rounded-lg text-xs font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                type === 'lent'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Money Lent</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('borrowed')}
              className={`py-2 px-1 rounded-lg text-xs font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                type === 'borrowed'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Money Borrowed</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('loan_emi')}
              className={`py-2 px-1 rounded-lg text-xs font-bold text-center flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                type === 'loan_emi'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Loan / EMI</span>
            </button>
          </div>

          {/* 2. Person / Bank Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                {type === 'loan_emi' ? 'Bank or Institution Name *' : 'Person or Entity Name *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'loan_emi' ? 'e.g. HDFC Bank, SBI Auto Loan' : 'e.g. John Doe, Sarah Jenkins'}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs sm:text-sm text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                {type === 'loan_emi' ? 'Loan Account / Ref No.' : 'Contact Phone (for WhatsApp)'}
              </label>
              <input
                type="text"
                value={type === 'loan_emi' ? loanAccountNumber : phone}
                onChange={(e) => type === 'loan_emi' ? setLoanAccountNumber(e.target.value) : setPhone(e.target.value)}
                placeholder={type === 'loan_emi' ? 'e.g. LN-984321' : 'e.g. +91 9876543210'}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs sm:text-sm text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* 3. Principal Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Principal Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-sky-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  min="1"
                  value={principalAmountStr}
                  onChange={(e) => setPrincipalAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 pl-7 pr-3 text-xs sm:text-sm font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* 4. Repayment Due Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                {type === 'loan_emi' ? 'Next Due / Maturity Date' : 'Target Settlement Date'}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
              >
                <option value="Personal">Personal</option>
                <option value="Friends & Family">Friends & Family</option>
                <option value="Business">Business</option>
                <option value="Vehicle Loan">Vehicle Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Education">Education Loan</option>
                <option value="Credit Card">Credit Card EMI</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* 5. EMI Details */}
          <div className="pt-2 border-t border-[var(--theme-border,#213E61)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmi}
                  onChange={(e) => setIsEmi(e.target.checked)}
                  className="rounded text-sky-400 focus:ring-0"
                />
                <span>Enable Monthly EMI Amortization</span>
              </label>

              {isEmi && principalAmountStr && (
                <button
                  type="button"
                  onClick={handleAutoCalculateEmi}
                  className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Auto Calculate EMI</span>
                </button>
              )}
            </div>

            {isEmi && (
              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
                      Monthly EMI (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={emiAmountStr}
                        onChange={(e) => setEmiAmountStr(e.target.value)}
                        placeholder="e.g. 4500"
                        className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg py-1.5 pl-6 pr-2 text-xs font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
                      Tenure (Months)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={totalEmis}
                      onChange={(e) => setTotalEmis(parseInt(e.target.value) || 12)}
                      className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg py-1.5 px-2 text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
                      Monthly Due Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={emiDayOfMonth}
                      onChange={(e) => setEmiDayOfMonth(parseInt(e.target.value) || 5)}
                      className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg py-1.5 px-2 text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
                      Interest Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRateStr}
                      onChange={(e) => setInterestRateStr(e.target.value)}
                      placeholder="e.g. 10.5"
                      className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg py-1.5 px-2 text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                    />
                  </div>

                  {!editingItem && (
                    <div className="space-y-1">
                      <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block">
                        Already Paid EMIs
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={paidEmis}
                        onChange={(e) => setPaidEmis(parseInt(e.target.value) || 0)}
                        className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg py-1.5 px-2 text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 6. Remarks / Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
              Notes & Remarks
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Personal emergency assistance, agreed repayment schedule"
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:opacity-90 bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]"
            >
              {editingItem ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   SUB-COMPONENT: Record Repayment / Installment Modal
   ========================================================================= */
interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtItem: DebtItem;
  onRecordPayment: (
    debtId: string,
    payment: Omit<DebtPayment, 'id' | 'createdAt'>,
    recordInKhata?: boolean,
    khataFund?: FundType
  ) => void;
  funds?: FundConfig[];
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen: _isOpen,
  onClose,
  debtItem,
  onRecordPayment,
  funds = []
}) => {
  const defaultAmt = debtItem.isEmi && debtItem.emiAmount
    ? Math.min(debtItem.emiAmount, debtItem.remainingAmount)
    : debtItem.remainingAmount;

  const [amountStr, setAmountStr] = useState<string>(String(defaultAmt > 0 ? defaultAmt : ''));
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<PaymentMode>('upi');
  const [note, setNote] = useState<string>(
    debtItem.isEmi ? `EMI payment for ${debtItem.title}` : `Repayment from ${debtItem.title}`
  );
  const [recordInKhata, setRecordInKhata] = useState<boolean>(true);
  const [selectedFund, setSelectedFund] = useState<FundType>(funds[0]?.id || 'personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountStr);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    onRecordPayment(
      debtItem.id,
      {
        amount: amt,
        date,
        paymentMode: mode,
        note: note.trim() || undefined,
        recordedInKhata: recordInKhata
      },
      recordInKhata,
      selectedFund
    );

    triggerHapticSound('save');
    triggerCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border,#213E61)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                Record Payment / EMI
              </h3>
              <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] truncate block max-w-[220px]">
                {debtItem.title} • Balance: {formatCurrency(debtItem.remainingAmount)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Amount */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Payment Amount (₹) *
              </label>
              <button
                type="button"
                onClick={() => setAmountStr(String(debtItem.remainingAmount))}
                className="text-[10px] text-sky-400 hover:underline font-bold cursor-pointer"
              >
                Pay Full Balance
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                min="1"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 pl-7 pr-3 text-sm font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Date & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Payment Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                Payment Method
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as PaymentMode)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer / NEFT / IMPS</option>
                <option value="card">Debit / Credit Card</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)]">
              Reference / Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Month 4 installment received via UPI"
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 px-3 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            />
          </div>

          {/* Integration with Daily Khata Ledger */}
          <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[var(--theme-text,#F8FAFC)] cursor-pointer">
              <input
                type="checkbox"
                checked={recordInKhata}
                onChange={(e) => setRecordInKhata(e.target.checked)}
                className="rounded text-sky-400 focus:ring-0"
              />
              <span>
                {debtItem.type === 'lent'
                  ? 'Record as Income in Daily Khata passbook'
                  : 'Record as Expense in Daily Khata passbook'}
              </span>
            </label>
            <p className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] pl-5">
              {debtItem.type === 'lent'
                ? 'Will credit into your fund balances as recovered debt.'
                : 'Will debit from your funds as loan repayment.'}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   SUB-COMPONENT: Payment History Modal (Professional English)
   ========================================================================= */
interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtItem: DebtItem;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  privacyMask?: boolean;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen: _isOpen,
  onClose,
  debtItem,
  onDeletePayment,
  privacyMask = false
}) => {
  const payments = debtItem.payments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-left">
        <div className="p-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                Repayment History
              </h3>
              <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] truncate block max-w-[220px]">
                {debtItem.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-[var(--theme-text-dim,#94A3B8)] text-xs space-y-1">
              <Clock className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p>No installments or repayments recorded yet.</p>
            </div>
          ) : (
            payments.map((p, idx) => (
              <div
                key={p.id || idx}
                className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {formatCurrency(p.amount, privacyMask)}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] uppercase font-mono">
                      {p.paymentMode || 'UPI'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                    <span>{new Date(p.date).toLocaleDateString()}</span>
                    {p.note && <span className="ml-1 text-[var(--theme-text,#F8FAFC)]/80">• "{p.note}"</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this payment record? The remaining balance will be adjusted.')) {
                      triggerHapticSound('delete');
                      onDeletePayment(debtItem.id, p.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Payment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex justify-between items-center text-xs">
          <span className="text-[var(--theme-text-dim,#94A3B8)]">
            Total Repaid:
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {formatCurrency(
              payments.reduce((sum, p) => sum + p.amount, 0),
              privacyMask
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
