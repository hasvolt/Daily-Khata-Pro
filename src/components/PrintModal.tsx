import React, { useState } from 'react';
import { Entry, FundType } from '../types';
import { FUND_ORDER, FUND_LABELS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, downloadCSVReport } from '../utils/khataCalculations';
import { X, Printer, Download, FileText, Zap, FileSpreadsheet, Eye, ListOrdered } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  targetMonth: Date;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  entries,
  targetMonth
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'itemized'>('preview');

  if (!isOpen) return null;

  const fundTotals = calculateFundTotals(entries);
  const monthKey = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = targetMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const monthEntries = entries
    .filter((e) => e.date.startsWith(monthKey))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalInc = monthEntries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExp = monthEntries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const netSaved = totalInc - totalExp;
  const grandTotal = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  // Generate the clean standalone Printable Document HTML
  const generateStatementHTML = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Khata: Pro — Financial Statement (${monthLabel})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #0f172a; max-width: 820px; margin: 0 auto; line-height: 1.45; background: #fff; }
    .brand-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #FFC700; padding-bottom: 12px; margin-bottom: 16px; }
    .brand-title { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
    .meta-box { font-size: 12px; color: #475569; display: flex; justify-content: space-between; background: #f8fafc; padding: 10px 14px; border-radius: 6px; margin-bottom: 18px; border: 1px solid #e2e8f0; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; background: #0f172a; color: #fff; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .summary-label { font-size: 10.5px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px; }
    .summary-val { font-size: 20px; font-weight: bold; margin-top: 4px; font-family: -apple-system, BlinkMacSystemFont, monospace; }
    .inc { color: #34d399; }
    .exp { color: #f87171; }
    .net { color: #fbbf24; }
    .sec-title { font-size: 12.5px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; color: #1e293b; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 5px; margin-top: 22px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 16px; }
    th { text-align: left; padding: 7px 8px; border-bottom: 2px solid #cbd5e1; color: #475569; font-weight: 700; background: #f1f5f9; }
    td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    .num { text-align: right; font-family: "Courier New", monospace; font-size: 12.5px; font-weight: 700; white-space: nowrap; }
    .badge { display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: 700; border-radius: 4px; text-transform: uppercase; }
    .badge-inc { background: #dcfce7; color: #166534; }
    .badge-exp { background: #fee2e2; color: #991b1b; }
    .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="brand-header">
    <div>
      <div class="brand-title">Daily Khata: Pro — Financial Statement</div>
      <div class="brand-sub">6-Fund Money Ledger &amp; Wealth Record</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #475569;">
      <div>Official Record</div>
      <div>Confidential &amp; Verified</div>
    </div>
  </div>

  <div class="meta-box">
    <span>Statement Period: <strong>${monthLabel}</strong></span>
    <span>Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
  </div>

  <div class="summary-grid">
    <div>
      <div class="summary-label">Total Income</div>
      <div class="summary-val inc">+${formatCurrency(totalInc)}</div>
    </div>
    <div>
      <div class="summary-label">Total Expense</div>
      <div class="summary-val exp">-${formatCurrency(totalExp)}</div>
    </div>
    <div>
      <div class="summary-label">Net Saved / Surplus</div>
      <div class="summary-val net">${formatCurrency(netSaved)}</div>
    </div>
  </div>

  <div class="sec-title">6-Fund Balances (All-Time Position)</div>
  <table>
    <thead>
      <tr>
        <th>Fund Pot</th>
        <th style="text-align: right;">Current Balance</th>
      </tr>
    </thead>
    <tbody>
      ${FUND_ORDER.map(
        (f) => `
        <tr>
          <td><strong>${FUND_LABELS[f]}</strong></td>
          <td class="num">${formatCurrency(fundTotals[f])}</td>
        </tr>
      `
      ).join('')}
      <tr style="font-weight: bold; background: #f8fafc; border-top: 2px solid #0f172a;">
        <td>Grand Total Combined</td>
        <td class="num" style="font-size: 13.5px; color: #0f172a;">${formatCurrency(grandTotal)}</td>
      </tr>
    </tbody>
  </table>

  <div class="sec-title">Monthly Transactions Log (${monthLabel} · ${monthEntries.length} Records)</div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Category / Source</th>
        <th>Fund Pot</th>
        <th>Note</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${
        monthEntries.length === 0
          ? `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 16px;">No entries logged for this month.</td></tr>`
          : monthEntries
              .map(
                (e) => `
          <tr>
            <td style="font-family: monospace;">${e.date}</td>
            <td>
              <span class="badge ${e.type === 'income' ? 'badge-inc' : 'badge-exp'}">
                ${e.type.toUpperCase()}
              </span>
            </td>
            <td><strong>${e.type === 'income' ? (e.source || 'Daily Income') : (e.category || 'Expense')}</strong></td>
            <td style="color: #475569;">${e.type === 'income' ? '6-Fund Split' : FUND_LABELS[e.fund || 'personal']}</td>
            <td style="color: #64748b; font-size: 11px;">${e.note || '-'}</td>
            <td class="num" style="color: ${e.type === 'income' ? '#166534' : '#991b1b'}">
              ${e.type === 'income' ? '+' : '-'}${formatCurrency(e.amount)}
            </td>
          </tr>
        `
              )
              .join('')
      }
    </tbody>
  </table>

  <div class="footer">
    <span>Daily Khata: Pro · Systematic Financial Record</span>
    <span>Verified Digital Stamp: ___________________</span>
  </div>
</body>
</html>`;
  };

  // High-reliability iframe printing (prints ONLY the statement without app UI)
  const handlePrint = () => {
    try {
      const htmlContent = generateStatementHTML();
      let printFrame = document.getElementById('hasvolt-print-frame') as HTMLIFrameElement | null;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'hasvolt-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
      }

      const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(htmlContent);
        frameDoc.close();

        setTimeout(() => {
          try {
            printFrame?.contentWindow?.focus();
            printFrame?.contentWindow?.print();
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

  // Download standalone printable HTML report
  const handleDownloadHTML = () => {
    const htmlContent = generateStatementHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DailyKhata-Statement-${monthLabel.replace(/\s+/g, '-')}.html`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadCSV = () => {
    downloadCSVReport(entries, targetMonth);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 no-print">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#FFC700]">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-serif-display text-[16px] font-bold text-[#F8FAFC]">
                Financial Statement Preview
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {monthLabel} · Daily Khata: Pro Official Statement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle Bar */}
        <div className="px-5 py-2.5 bg-[var(--theme-bg,#070E18)] border-b border-[var(--theme-border,#213E61)] flex items-center justify-between">
          <div className="flex gap-1.5 bg-[var(--theme-surface,#0E1A29)] p-1 rounded-xl border border-[var(--theme-border,#213E61)]">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-[#FFC700] text-[#0B1017] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Summary View</span>
            </button>
            <button
              onClick={() => setViewMode('itemized')}
              className={`px-3 py-1 rounded-lg text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'itemized'
                  ? 'bg-[#FFC700] text-[#0B1017] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>All Transactions ({monthEntries.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-[#94A3B8] hidden sm:inline">
            A4 Ready Printable Document
          </span>
        </div>

        {/* Modal Body Preview */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] text-[13px] leading-relaxed flex-1 max-h-[calc(92vh-180px)]">
          {/* Statement Banner Header */}
          <div className="border-b-2 border-[#FFC700] pb-3 flex justify-between items-start gap-4">
            <div>
              <div className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFC700]" />
                <span>Daily Khata: Pro Ledger</span>
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                6-Fund Systematic Financial Record · Verified
              </div>
            </div>
            <div className="text-right text-[11px] text-[#94A3B8]">
              <div>Period: <strong className="text-[#F8FAFC]">{monthLabel}</strong></div>
              <div>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-3 text-center">
              <div className="text-[10.5px] uppercase tracking-wider text-[#94A3B8] font-bold">Total Income</div>
              <div className="font-serif-display text-[16px] sm:text-[18px] font-bold text-[#10B981] mt-0.5">
                +{formatCurrency(totalInc)}
              </div>
            </div>
            <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-3 text-center">
              <div className="text-[10.5px] uppercase tracking-wider text-[#94A3B8] font-bold">Total Expense</div>
              <div className="font-serif-display text-[16px] sm:text-[18px] font-bold text-[#EF4444] mt-0.5">
                -{formatCurrency(totalExp)}
              </div>
            </div>
            <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-3 text-center">
              <div className="text-[10.5px] uppercase tracking-wider text-[#94A3B8] font-bold">Net Saved</div>
              <div className="font-serif-display text-[16px] sm:text-[18px] font-bold text-[#FFC700] mt-0.5">
                {formatCurrency(netSaved)}
              </div>
            </div>
          </div>

          {viewMode === 'preview' ? (
            <>
              {/* Fund Balances */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8] border-b border-[var(--theme-border,#213E61)] pb-1">
                  Active 6-Fund Balances (All-Time)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FUND_ORDER.map((f) => (
                    <div key={f} className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex justify-between items-center text-[12px]">
                      <span className="text-[#94A3B8]">{FUND_LABELS[f]}</span>
                      <span className="font-mono font-bold text-[#F8FAFC]">{formatCurrency(fundTotals[f])}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center bg-[var(--theme-surface,#0E1A29)] border border-[#FFC700]/40 rounded-xl px-3.5 py-2 text-[13px] font-bold">
                  <span>Grand Total Combined Wealth</span>
                  <span className="font-serif-display text-[16px] text-[#FFC700] font-bold">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Quick Transaction List preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-[#94A3B8] border-b border-[var(--theme-border,#213E61)] pb-1">
                  <span>Recent Monthly Entries ({monthEntries.length})</span>
                  <button
                    onClick={() => setViewMode('itemized')}
                    className="text-[#FFC700] hover:underline normal-case font-medium cursor-pointer"
                  >
                    View All {monthEntries.length} records →
                  </button>
                </div>
                {monthEntries.slice(0, 5).map((e) => (
                  <div
                    key={e.id}
                    className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-between text-[12px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          e.type === 'income' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                        }`}
                      />
                      <span className="font-mono text-[#94A3B8] text-[11px]">{e.date}</span>
                      <span className="font-semibold text-[#F8FAFC]">
                        {e.type === 'income' ? (e.source || 'Daily Income') : (e.category || 'Expense')}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        e.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      {e.type === 'income' ? '+' : '-'}{formatCurrency(e.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Itemized Full Transactions Table */
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8] border-b border-[var(--theme-border,#213E61)] pb-1">
                All Monthly Transactions Log ({monthEntries.length} Entries)
              </div>
              {monthEntries.length === 0 ? (
                <div className="text-center py-6 text-[#94A3B8] text-[12px]">
                  No entries logged for this month yet.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {monthEntries.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-between text-[12px]"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-extrabold uppercase ${
                              e.type === 'income'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : 'bg-[#EF4444]/20 text-[#EF4444]'
                            }`}
                          >
                            {e.type}
                          </span>
                          <span className="font-mono text-[#94A3B8] text-[11px]">{e.date}</span>
                          <span className="font-semibold text-[#F8FAFC]">
                            {e.type === 'income' ? (e.source || 'Income') : (e.category || 'Expense')}
                          </span>
                        </div>
                        {e.note && <p className="text-[11px] text-[#94A3B8] pl-1">{e.note}</p>}
                      </div>
                      <span
                        className={`font-mono font-bold text-[13px] ${
                          e.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {e.type === 'income' ? '+' : '-'}{formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--theme-border,#213E61)] bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] font-semibold text-[13px] cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:text-[#10B981] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
              <span className="hidden sm:inline">Export</span> CSV
            </button>

            <button
              onClick={handleDownloadHTML}
              className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:text-[#FFC700] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4.5 py-2 rounded-xl bg-[#FFC700] hover:bg-[#FFD233] text-[#0B1017] font-bold text-[13px] flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
