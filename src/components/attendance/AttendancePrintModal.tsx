import React, { useState, useMemo } from 'react';
import { AttendanceLog, AppLanguage } from '../../types';
import { printHTMLContent } from '../../utils/printHelpers';
import { WORK_CATEGORIES_CATALOG } from './attendanceTypes';
import { Printer, Calendar, User, Briefcase, X, FileText, CheckCircle2, Download, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatTime12h } from '../../utils/dateUtils';
import { triggerHaptic } from '../../utils/haptics';

interface AttendancePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AttendanceLog[];
  existingEmployers: string[];
  language?: AppLanguage;
  privacyMask?: boolean;
  formatCurrency: (val: number, mask?: boolean) => string;
}

export type PrintPeriodPreset = 'this_month' | 'last_3_months' | 'this_year' | 'custom';

export const AttendancePrintModal: React.FC<AttendancePrintModalProps> = ({
  isOpen,
  onClose,
  logs,
  existingEmployers,
  language = 'en',
  privacyMask = false,
  formatCurrency
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const firstDayOfMonthStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }, []);

  const [period, setPeriod] = useState<PrintPeriodPreset>('this_month');
  const [fromDate, setFromDate] = useState<string>(firstDayOfMonthStr);
  const [toDate, setToDate] = useState<string>(todayStr);
  const [selectedEmployer, setSelectedEmployer] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handlePeriodChange = (newPeriod: PrintPeriodPreset) => {
    setPeriod(newPeriod);
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();

    if (newPeriod === 'this_month') {
      setFromDate(`${curYear}-${String(curMonth + 1).padStart(2, '0')}-01`);
      setToDate(todayStr);
    } else if (newPeriod === 'last_3_months') {
      const threeMonthsAgo = new Date(curYear, curMonth - 2, 1);
      setFromDate(`${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`);
      setToDate(todayStr);
    } else if (newPeriod === 'this_year') {
      setFromDate(`${curYear}-01-01`);
      setToDate(`${curYear}-12-31`);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (log.date < fromDate || log.date > toDate) return false;
    if (selectedEmployer !== 'all' && (log.employerName || '') !== selectedEmployer) return false;
    if (selectedCategory !== 'all') {
      const cat = log.workCategory || log.workType || '';
      if (cat !== selectedCategory) return false;
    }
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));

  // Compute stats for filtered report
  const stats = {
    totalRecords: filteredLogs.length,
    presentDays: filteredLogs.filter((l) => l.status === 'present').length,
    halfDays: filteredLogs.filter((l) => l.status === 'half_day').length,
    overtimeHours: filteredLogs.reduce((sum, l) => sum + (l.overtimeHours || 0), 0),
    totalEarnings: filteredLogs.reduce((sum, l) => sum + (l.salaryOrRate || 0), 0),
    totalReceived: filteredLogs.reduce((sum, l) => sum + (l.paymentReceived || 0), 0),
    totalAdvance: filteredLogs.reduce((sum, l) => sum + (l.advanceReceived || 0), 0),
    totalPending: filteredLogs.reduce((sum, l) => {
      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      const adv = l.advanceReceived || 0;
      return sum + (l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec - adv));
    }, 0)
  };

  const handlePrint = () => {
    const employerLabel = selectedEmployer === 'all' 
      ? (isHindi ? 'सभी नियोक्ता / व्यक्ति' : 'All Persons / Employers') 
      : selectedEmployer;
    const categoryLabel = selectedCategory === 'all' 
      ? (isHindi ? 'सभी कार्य श्रेणियां' : 'All Work Categories') 
      : selectedCategory;

    const printableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Attendance Register Report - ${fromDate} to ${toDate}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 10px;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            font-size: 10pt;
            line-height: 1.35;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .brand {
            font-size: 20px;
            font-weight: 900;
            color: #0284c7;
            letter-spacing: -0.5px;
          }
          .subbrand {
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
            margin-top: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .title {
            font-size: 14px;
            font-weight: 700;
            margin-top: 6px;
            color: #1e293b;
          }
          .filter-chips {
            display: flex;
            justify-content: center;
            gap: 12px;
            font-size: 10px;
            color: #475569;
            margin-top: 5px;
            flex-wrap: wrap;
          }
          .chip {
            background: #f1f5f9;
            padding: 2px 7px;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
            font-weight: 600;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 6px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
          .stat-box {
            text-align: center;
          }
          .stat-label {
            font-size: 9px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
          }
          .stat-val {
            font-size: 12.5px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 2px;
            font-family: monospace;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 6px;
          }
          thead {
            display: table-header-group;
          }
          tr {
            page-break-inside: avoid;
          }
          th {
            background: #0284c7;
            color: #ffffff;
            padding: 6px 5px;
            text-align: left;
            font-size: 8.5pt;
            font-weight: 700;
            border: 1px solid #0284c7;
          }
          td {
            padding: 5px 5px;
            border-bottom: 1px solid #e2e8f0;
            border-left: 1px solid #f1f5f9;
            border-right: 1px solid #f1f5f9;
            font-size: 8.5pt;
          }
          tr:nth-child(even) {
            background: #f8fafc;
          }
          .font-mono {
            font-family: monospace;
          }
          .badge {
            font-weight: 700;
            font-size: 7.5pt;
            padding: 2px 4px;
            border-radius: 3px;
            display: inline-block;
          }
          .badge-present { background: #dcfce7; color: #15803d; }
          .badge-half { background: #fef3c7; color: #b45309; }
          .badge-ot { background: #f3e8ff; color: #7e22ce; }
          .badge-absent { background: #fee2e2; color: #b91c1c; }
          .badge-leave { background: #e0f2fe; color: #0369a1; }
          .signature-box {
            margin-top: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 30px;
            page-break-inside: avoid;
          }
          .sig-line {
            width: 220px;
            border-top: 1.5px dashed #64748b;
            text-align: center;
            padding-top: 6px;
            font-size: 10px;
            font-weight: bold;
            color: #334155;
          }
          .multi-page-footer {
            margin-top: 20px;
            padding-top: 8px;
            border-top: 1.5px solid #cbd5e1;
            font-size: 8.5pt;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">DAILY KHATA PRO</div>
          <div class="subbrand">Official Work, Duty, Location &amp; Attendance Statement</div>
          <div class="title">Period: ${fromDate} to ${toDate}</div>
          <div class="filter-chips">
            <span class="chip"><strong>Person/Employer:</strong> ${employerLabel}</span>
            <span class="chip"><strong>Work Type:</strong> ${categoryLabel}</span>
            <span class="chip"><strong>Total Records:</strong> ${stats.totalRecords}</span>
            <span class="chip"><strong>Time Format:</strong> 12-Hour (AM/PM)</span>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Full Days</div>
            <div class="stat-val" style="color: #16a34a;">${stats.presentDays}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Half Days</div>
            <div class="stat-val" style="color: #d97706;">${stats.halfDays}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">OT Hours</div>
            <div class="stat-val" style="color: #9333ea;">${stats.overtimeHours}h</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Total Earned</div>
            <div class="stat-val">${formatCurrency(stats.totalEarnings, privacyMask)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Advance (पेशगी)</div>
            <div class="stat-val" style="color: #d97706;">${formatCurrency(stats.totalAdvance, privacyMask)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Received</div>
            <div class="stat-val" style="color: #16a34a;">${formatCurrency(stats.totalReceived, privacyMask)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Pending Dues</div>
            <div class="stat-val" style="color: #ea580c;">${formatCurrency(stats.totalPending, privacyMask)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 10%;">Date</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 14%;">Duty Hours (12H)</th>
              <th style="width: 12%;">Location / Site</th>
              <th style="width: 14%;">Employer / Client</th>
              <th style="width: 12%;">Work / Notes</th>
              <th style="width: 9%; text-align: right;">Rate</th>
              <th style="width: 9%; text-align: right;">Advance</th>
              <th style="width: 10%; text-align: right;">Net Due</th>
            </tr>
          </thead>
          <tbody>
            ${filteredLogs.map((l) => {
              const statusClass = l.status === 'present' ? 'badge-present' : l.status === 'half_day' ? 'badge-half' : l.status === 'overtime' ? 'badge-ot' : l.status === 'leave' ? 'badge-leave' : 'badge-absent';
              const rate = l.salaryOrRate || 0;
              const rec = l.paymentReceived || 0;
              const adv = l.advanceReceived || 0;
              const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec - adv);
              const timingsStr = l.startTime && l.endTime ? `${formatTime12h(l.startTime)} - ${formatTime12h(l.endTime)}` : '-';
              return `
                <tr>
                  <td><strong>${l.date}</strong></td>
                  <td><span class="badge ${statusClass}">${l.status.toUpperCase()}</span></td>
                  <td>${timingsStr}${l.overtimeHours ? ` (+${l.overtimeHours}h OT)` : ''}</td>
                  <td>${l.workAddress ? `📍 ${l.workAddress}` : '-'}</td>
                  <td><strong>${l.employerName || '-'}</strong></td>
                  <td>
                    ${l.workCategory || l.workType || '-'}
                    ${l.jobDescription || l.notes ? `<br><small style="color:#64748b;">${l.jobDescription || l.notes}</small>` : ''}
                  </td>
                  <td style="text-align: right;" class="font-mono">${rate > 0 ? formatCurrency(rate, privacyMask) : '-'}</td>
                  <td style="text-align: right; color: ${adv > 0 ? '#d97706' : '#64748b'};" class="font-mono font-bold">${adv > 0 ? formatCurrency(adv, privacyMask) : '-'}</td>
                  <td style="text-align: right; color: ${pend > 0 ? '#ea580c' : '#16a34a'};" class="font-mono font-bold">${pend > 0 ? formatCurrency(pend, privacyMask) : 'PAID'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="signature-box">
          <div class="sig-line">
            कर्मचारी / वर्कर हस्ताक्षर<br>
            <span style="font-size: 8.5px; color: #64748b; font-weight: normal;">(Employee / Worker Signature)</span>
          </div>
          <div class="sig-line">
            नियोक्ता / अधिकृत मुहर व हस्ताक्षर<br>
            <span style="font-size: 8.5px; color: #64748b; font-weight: normal;">(Authorized Signatory &amp; Stamp)</span>
          </div>
        </div>

        <div class="multi-page-footer">
          <span>Generated by <strong>Daily Khata Pro</strong> • www.rozfiber.com</span>
          <span>Printed on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </body>
      </html>
    `;

    printHTMLContent(printableHtml);
    onClose();
  };

  const handleDownloadPdf = () => {
    triggerHaptic('light');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    const employerLabel = selectedEmployer === 'all' 
      ? (isHindi ? 'All Persons / Employers' : 'All Persons / Employers') 
      : selectedEmployer;
    const categoryLabel = selectedCategory === 'all' 
      ? (isHindi ? 'All Categories' : 'All Categories') 
      : selectedCategory;

    // Header
    doc.setFontSize(16);
    doc.setTextColor(2, 132, 199);
    doc.text('DAILY KHATA PRO - STAFF ATTENDANCE & WORK REGISTER', 40, 38);

    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Official Duty, Location, Advance & Wage Statement | Generated: ${new Date().toLocaleDateString('en-IN')}`, 40, 52);

    // Meta row
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Period: ${fromDate} to ${toDate}  |  Employer: ${employerLabel}  |  Category: ${categoryLabel}  |  Records: ${stats.totalRecords}`, 40, 68);

    // Summary Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(40, 76, 762, 30, 4, 4, 'FD');

    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(
      `Full Days: ${stats.presentDays}  |  Half Days: ${stats.halfDays}  |  OT Hours: ${stats.overtimeHours}h  |  Total Earned: Rs. ${stats.totalEarnings}  |  Advance (Peshi): Rs. ${stats.totalAdvance}  |  Received: Rs. ${stats.totalReceived}  |  Pending Dues: Rs. ${stats.totalPending}`,
      50,
      95
    );

    // Table Data
    const tableData = filteredLogs.map((l) => {
      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      const adv = l.advanceReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec - adv);
      const timingsStr = l.startTime && l.endTime ? `${formatTime12h(l.startTime)} - ${formatTime12h(l.endTime)}` : '-';
      const otStr = l.overtimeHours ? ` (+${l.overtimeHours}h OT)` : '';

      return [
        l.date,
        l.status.toUpperCase(),
        timingsStr + otStr,
        l.workAddress || '-',
        l.employerName || '-',
        l.workCategory || l.workType || '-',
        rate > 0 ? `Rs. ${rate}` : '-',
        adv > 0 ? `Rs. ${adv}` : '-',
        rec > 0 ? `Rs. ${rec}` : '-',
        pend > 0 ? `Rs. ${pend}` : 'PAID'
      ];
    });

    autoTable(doc, {
      startY: 114,
      head: [[
        'Date',
        'Status',
        'Duty Time (12H)',
        'Location / Area',
        'Employer / Client',
        'Work / Category',
        'Rate',
        'Advance',
        'Received',
        'Net Due'
      ]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [2, 132, 199],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [15, 23, 42]
      },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 55 },
        2: { cellWidth: 100 },
        3: { cellWidth: 90 },
        4: { cellWidth: 95 },
        5: { cellWidth: 85 },
        6: { cellWidth: 60, halign: 'right' },
        7: { cellWidth: 60, halign: 'right' },
        8: { cellWidth: 60, halign: 'right' },
        9: { cellWidth: 70, halign: 'right', fontStyle: 'bold' }
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount} | Daily Khata Pro - Staff Manager | www.rozfiber.com`,
          40,
          doc.internal.pageSize.height - 18
        );
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 400;
    if (finalY < doc.internal.pageSize.height - 65) {
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('-------------------------------------------', 60, finalY + 38);
      doc.text('Employee / Worker Signature', 60, finalY + 50);

      doc.text('-------------------------------------------', 560, finalY + 38);
      doc.text('Authorized Signatory & Stamp', 560, finalY + 50);
    }

    doc.save(`Attendance_Statement_${fromDate}_to_${toDate}.pdf`);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-primary,#38BDF8)]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'उपस्थिति रिपोर्ट प्रिंट / एक्सपोर्ट' : 'Print / Export Attendance Report'}
              </h3>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'फ़िल्टर व कस्टम दिनांक अनुसार रिपोर्ट' : 'Filter by period, employer & work category'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Period selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] block uppercase tracking-wider">
              {isHindi ? 'अवधि चुनें (Period)' : 'Select Period'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePeriodChange('this_month')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  period === 'this_month'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]'
                }`}
              >
                {isHindi ? 'इस माह' : 'This Month'}
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange('last_3_months')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  period === 'last_3_months'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]'
                }`}
              >
                {isHindi ? 'पिछले 3 माह' : 'Last 3 Months'}
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange('this_year')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  period === 'this_year'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]'
                }`}
              >
                {isHindi ? 'यह वर्ष' : 'This Year'}
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange('custom')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  period === 'custom'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]'
                }`}
              >
                {isHindi ? 'कस्टम' : 'Custom'}
              </button>
            </div>
          </div>

          {/* Date range pickers */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
                {isHindi ? 'प्रारंभ दिनांक (From)' : 'From Date'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPeriod('custom');
                }}
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl p-2 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
                {isHindi ? 'अंतिम दिनांक (To)' : 'To Date'}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPeriod('custom');
                }}
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl p-2 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] font-mono"
              />
            </div>
          </div>

          {/* Person / Employer Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'व्यक्ति या कंपनी चुनें' : 'Filter by Person / Employer'}</span>
            </label>
            <select
              value={selectedEmployer}
              onChange={(e) => setSelectedEmployer(e.target.value)}
              className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl p-2 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] font-semibold"
            >
              <option value="all">{isHindi ? 'सभी व्यक्ति व कंपनियां (All Persons / Employers)' : 'All Persons & Employers'}</option>
              {existingEmployers.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          {/* Work / Job Type Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindi ? 'कार्य / जॉब श्रेणी चुनें' : 'Filter by Work / Job Type'}</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl p-2 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] font-semibold"
            >
              <option value="all">{isHindi ? 'सभी कार्य श्रेणियां (All Work Categories)' : 'All Work Categories'}</option>
              {WORK_CATEGORIES_CATALOG.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isHindi ? cat.nameHi : cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Preview Box */}
          <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'शामिल कुल रिकॉर्ड्स' : 'Matching Attendance Records'}:
              </span>
              <span className="font-mono font-bold text-[var(--theme-text,#F8FAFC)]">
                {stats.totalRecords}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'कुल उपस्थिति' : 'Present / Half Days'}:
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {stats.presentDays} Full, {stats.halfDays} Half
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'कुल कमाई / बकाया' : 'Total Earnings / Due'}:
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {formatCurrency(stats.totalEarnings, privacyMask)} ({isHindi ? 'बकाया' : 'Due'}: {formatCurrency(stats.totalPending, privacyMask)})
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#CBD5E1)] text-xs font-semibold cursor-pointer transition-colors"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
          
          {/* Direct PDF Download */}
          <button
            type="button"
            disabled={filteredLogs.length === 0}
            onClick={handleDownloadPdf}
            className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Download PDF directly to device"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">{isHindi ? 'PDF डाउनलोड करें' : 'Download PDF'}</span>
          </button>

          {/* Browser Print Report */}
          <button
            type="button"
            disabled={filteredLogs.length === 0}
            onClick={handlePrint}
            className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Open system print preview dialog"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span className="truncate">{isHindi ? 'रिपोर्ट प्रिंट करें' : 'Print Slip'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
