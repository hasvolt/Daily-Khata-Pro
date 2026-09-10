import React, { useState, useMemo } from 'react';
import { AttendanceLog, AppLanguage } from '../../types';
import { formatCurrency, triggerHapticSound } from '../../utils/khataCalculations';
import { 
  Building, 
  Coins, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Printer, 
  ExternalLink,
  Plus,
  Briefcase,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { EmployerSummary, getWorkCategoryMeta, WORK_CATEGORIES_CATALOG } from './attendanceTypes';

interface EmployerAccountsViewProps {
  employerSummaries: EmployerSummary[];
  attendanceLogs: AttendanceLog[];
  onOpenSettleModal: (employerName?: string) => void;
  onFilterByEmployer: (employerName: string) => void;
  onOpenNewLogForEmployer: (employerName: string) => void;
  isHindi?: boolean;
  privacyMask?: boolean;
}

export const EmployerAccountsView: React.FC<EmployerAccountsViewProps> = ({
  employerSummaries,
  attendanceLogs,
  onOpenSettleModal,
  onFilterByEmployer,
  onOpenNewLogForEmployer,
  isHindi = false,
  privacyMask = false
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEmployers = useMemo(() => {
    return employerSummaries.filter((e) => {
      if (selectedCategory !== 'all' && e.primaryCategory !== selectedCategory) return false;
      if (!search.trim()) return true;
      return e.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [employerSummaries, search, selectedCategory]);

  const totalOutstanding = useMemo(() => {
    return employerSummaries.reduce((sum, e) => sum + e.totalPending, 0);
  }, [employerSummaries]);

  const totalEarnedAll = useMemo(() => {
    return employerSummaries.reduce((sum, e) => sum + e.totalEarned, 0);
  }, [employerSummaries]);

  // Employer Printable Invoice / Statement Slip
  const handlePrintEmployerSlip = (employerName: string) => {
    triggerHapticSound('click');
    const logs = attendanceLogs
      .filter((l) => l.employerName === employerName)
      .sort((a, b) => a.date.localeCompare(b.date));

    const emp = employerSummaries.find((e) => e.name === employerName);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Work & Payment Statement - ${employerName}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #1E293B; }
          .header { text-align: center; border-bottom: 2px solid #0284C7; padding-bottom: 12px; margin-bottom: 15px; }
          .brand { font-size: 20px; font-weight: 800; color: #0284C7; }
          .subbrand { font-size: 11px; color: #64748B; margin-top: 2px; }
          .title { font-size: 16px; font-weight: 700; margin-top: 8px; }
          .summary { display: flex; justify-content: space-around; background: #F1F5F9; border-radius: 8px; padding: 12px; margin: 15px 0; }
          .summary-item { text-align: center; }
          .summary-label { font-size: 11px; color: #64748B; font-weight: bold; }
          .summary-val { font-size: 16px; font-weight: 800; margin-top: 2px; }
          .pending { color: #D97706; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
          th { background: #0284C7; color: white; padding: 7px 6px; text-align: left; }
          td { padding: 7px 6px; border-bottom: 1px solid #E2E8F0; }
          tr:nth-child(even) { background: #F8FAFC; }
          .status { font-weight: bold; padding: 2px 5px; border-radius: 4px; font-size: 10px; display: inline-block; }
          .footer { text-align: center; margin-top: 25px; font-size: 10.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">DAILY KHATA PRO</div>
          <div class="subbrand">Attendance, Duty & Wage Tracking System</div>
          <div class="title">Work Statement / कार्य विवरण: ${employerName}</div>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="summary-label">Total Days Worked</div>
            <div class="summary-val">${emp?.totalDays || logs.length} Days</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Earned</div>
            <div class="summary-val">${formatCurrency(emp?.totalEarned || 0)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Payment Received</div>
            <div class="summary-val">${formatCurrency(emp?.totalReceived || 0)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Pending Dues</div>
            <div class="summary-val pending">${formatCurrency(emp?.totalPending || 0)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Timings</th>
              <th>Work Detail</th>
              <th>Rate/Wage</th>
              <th>Received</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map((l) => {
              const rate = l.salaryOrRate || 0;
              const rec = l.paymentReceived || 0;
              const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);
              return `
                <tr>
                  <td><strong>${l.date}</strong></td>
                  <td>${l.status.toUpperCase()}</td>
                  <td>${l.startTime && l.endTime ? `${l.startTime}-${l.endTime}` : '-'}</td>
                  <td>${l.jobDescription || l.workType || '-'}</td>
                  <td>${rate ? formatCurrency(rate) : '-'}</td>
                  <td>${rec ? formatCurrency(rec) : '-'}</td>
                  <td><strong style="color: ${pend > 0 ? '#D97706' : '#15803D'}">${pend ? formatCurrency(pend) : 'PAID'}</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          Generated via Daily Khata Pro · Verified Statement
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => printWin.print(), 300);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Total Multi-Employer Dues Overview */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <h2 className="text-[16px] sm:text-[18px] font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? 'कंपनी, नियोक्ता व काम खाते' : 'Employer & Client Accounts'}
            </h2>
          </div>
          <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)]">
            {isHindi 
              ? 'अलग-अलग कंपनियों, ठेकेदारों, फ्रीलांस क्लाइंट्स या दुकानों के बकाया भुगतान और हिसाब'
              : 'Track separate employers, freelance clients, or job sites with one-click bulk settlements.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <div className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider">
              {isHindi ? 'सभी कंपनियों से कुल बकाया' : 'Total Outstanding Dues'}
            </div>
            <div className="text-[18px] sm:text-[20px] font-mono font-extrabold text-amber-400">
              {formatCurrency(totalOutstanding, privacyMask)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenSettleModal('all')}
            disabled={totalOutstanding <= 0}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[12.5px] sm:text-[13px] flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
          >
            <Coins className="w-4 h-4" />
            <span>{isHindi ? 'बल्क भुगतान दर्ज करें' : 'Settle Payment'}</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3 sm:p-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isHindi ? 'कंपनी या नियोक्ता खोजें...' : 'Search company or client...'}
            className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] pl-9 pr-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border-[var(--theme-border,#213E61)]'
            }`}
          >
            {isHindi ? 'सभी' : 'All'}
          </button>
          {WORK_CATEGORIES_CATALOG.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)]'
                  : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border-[var(--theme-border,#213E61)]'
              }`}
            >
              {isHindi ? cat.nameHi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Employers List */}
      {filteredEmployers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[var(--theme-card,#132438)]/40 border border-dashed border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <Building className="w-10 h-10 mx-auto text-[var(--theme-text-dim,#94A3B8)]" />
          <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
            {isHindi ? 'कोई नियोक्ता / कंपनी रिकॉर्ड नहीं मिला' : 'No employers or clients recorded yet'}
          </h3>
          <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)] max-w-md mx-auto">
            {isHindi
              ? 'दैनिक उपस्थिति दर्ज करते समय "नियोक्ता / कंपनी का नाम" भरें, ताकि उनका अलग खाता और हिसाब यहां दिख सके।'
              : 'Add an employer or client name when logging attendance to track separate accounts and dues.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEmployers.map((emp) => {
            const catMeta = getWorkCategoryMeta(emp.primaryCategory);
            const CatIcon = catMeta.icon;

            return (
              <div
                key={emp.name}
                className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all flex flex-col justify-between gap-4"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-extrabold text-[var(--theme-text,#F8FAFC)] truncate">
                          {emp.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${catMeta.badgeBg} ${catMeta.color} ${catMeta.borderColor}`}>
                            <CatIcon className="w-3 h-3" />
                            <span>{isHindi ? catMeta.nameHi : catMeta.nameEn}</span>
                          </span>
                          <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                            · {emp.totalDays} {isHindi ? 'दिन कार्य' : 'days'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pending badge */}
                    {emp.totalPending > 0 ? (
                      <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 animate-pulse">
                        {formatCurrency(emp.totalPending, privacyMask)} {isHindi ? 'बाकी' : 'Due'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {isHindi ? '✓ पूर्ण चुकता' : '✓ Cleared'}
                      </span>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)]/60 border border-[var(--theme-border,#213E61)]/50 text-center">
                    <div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-bold">
                        {isHindi ? 'कुल कमाई' : 'Total Earned'}
                      </div>
                      <div className="text-[13.5px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-0.5">
                        {formatCurrency(emp.totalEarned, privacyMask)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-bold">
                        {isHindi ? 'प्राप्त' : 'Received'}
                      </div>
                      <div className="text-[13.5px] font-mono font-extrabold text-[#10B981] mt-0.5">
                        {formatCurrency(emp.totalReceived, privacyMask)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-bold">
                        {isHindi ? 'बाकी राशि' : 'Pending'}
                      </div>
                      <div className="text-[13.5px] font-mono font-extrabold text-amber-400 mt-0.5">
                        {formatCurrency(emp.totalPending, privacyMask)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--theme-border,#213E61)] flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onFilterByEmployer(emp.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="View all logs for this employer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'हाजिरी देखें' : 'View Logs'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePrintEmployerSlip(emp.name)}
                      className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                      title="Print Employer Statement"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {emp.totalPending > 0 ? (
                    <button
                      type="button"
                      onClick={() => onOpenSettleModal(emp.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[12px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'बल्क भुगतान लें' : 'Receive Bulk Pay'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenNewLogForEmployer(emp.name)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/40 text-[11.5px] font-bold flex items-center gap-1 cursor-pointer hover:bg-[var(--theme-primary,#38BDF8)]/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'नया कार्य जोड़ें' : 'Log New Day'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
