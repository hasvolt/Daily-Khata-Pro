import React, { useState, useMemo } from 'react';
import { AttendanceLog, AttendanceStatus, AppLanguage } from '../../types';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock3, 
  Sparkles, 
  Plus, 
  MapPin, 
  Printer, 
  Coins, 
  Edit3, 
  Trash2, 
  User, 
  Search,
  Check,
  Building,
  DollarSign,
  CalendarCheck
} from 'lucide-react';
import { 
  getWorkCategoryMeta, 
  getAdvanceReasonLabel,
  getAdvanceReasonMeta,
  calculateLogAdvanceTotal,
  calculateLogPendingDue
} from './attendanceTypes';
import { formatTime12h, getLocalDateString } from '../../utils/dateUtils';
import { printHTMLContent } from '../../utils/printHelpers';
import { triggerHaptic } from '../../utils/haptics';

interface DailyAttendanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  attendanceLogs: AttendanceLog[];
  onOpenEditModal: (log: AttendanceLog) => void;
  onOpenQuickAdvance: (log: AttendanceLog) => void;
  onOpenNewModalForDate: (date: string) => void;
  onDeleteAttendanceLog: (id: string) => void;
  formatCurrency: (val: number, mask?: boolean) => string;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const DailyAttendanceDetailsModal: React.FC<DailyAttendanceDetailsModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  attendanceLogs,
  onOpenEditModal,
  onOpenQuickAdvance,
  onOpenNewModalForDate,
  onDeleteAttendanceLog,
  formatCurrency,
  language = 'en',
  privacyMask = false
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';
  const todayStr = useMemo(() => getLocalDateString(), []);

  // Normalize date string (strip timestamp or whitespace)
  const normalizeDate = (d?: string) => {
    if (!d) return '';
    return d.trim().split('T')[0].split(' ')[0];
  };

  // Available unique dates with recorded attendance
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(attendanceLogs.map((l) => normalizeDate(l.date)).filter(Boolean)));
    return dates.sort().reverse();
  }, [attendanceLogs]);

  // Determine initial selected date: prefer initialDate, then latest available date, or today
  const initialResolvedDate = useMemo(() => {
    const normInit = normalizeDate(initialDate);
    if (normInit && attendanceLogs.some(l => normalizeDate(l.date) === normInit)) {
      return normInit;
    }
    if (attendanceLogs.some(l => normalizeDate(l.date) === todayStr)) {
      return todayStr;
    }
    if (availableDates.length > 0) {
      return availableDates[0];
    }
    return normInit || todayStr;
  }, [initialDate, todayStr, attendanceLogs, availableDates]);

  const [selectedDate, setSelectedDate] = useState<string>(initialResolvedDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus | 'has_advance' | 'has_pending'>('all');

  // Keep date synced whenever modal opens or initialDate changes
  React.useEffect(() => {
    if (isOpen) {
      const normInit = normalizeDate(initialDate);
      if (normInit && attendanceLogs.some(l => normalizeDate(l.date) === normInit)) {
        setSelectedDate(normInit);
      } else if (normInit) {
        setSelectedDate(normInit);
      } else if (attendanceLogs.some(l => normalizeDate(l.date) === todayStr)) {
        setSelectedDate(todayStr);
      } else if (availableDates.length > 0) {
        setSelectedDate(availableDates[0]);
      } else {
        setSelectedDate(todayStr);
      }
    }
  }, [isOpen, initialDate, attendanceLogs, availableDates, todayStr]);

  // Date Navigation handlers
  const handlePrevDay = () => {
    triggerHaptic('light');
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    const prevStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    setSelectedDate(prevStr);
  };

  const handleNextDay = () => {
    triggerHaptic('light');
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    const nextStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    setSelectedDate(nextStr);
  };

  const handleJumpToday = () => {
    triggerHaptic('light');
    setSelectedDate(todayStr);
  };

  // Formatted date string
  const formattedDateTitle = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate, isHindi]);

  // Logs for this specific day with normalized date match
  const dayLogs = useMemo(() => {
    const normTarget = normalizeDate(selectedDate);
    return attendanceLogs
      .filter((l) => normalizeDate(l.date) === normTarget)
      .sort((a, b) => (a.employerName || '').localeCompare(b.employerName || ''));
  }, [attendanceLogs, selectedDate]);

  // Day Statistics
  const dayStats = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let overtimeCount = 0;
    let leaveCount = 0;
    let totalDutyHours = 0;
    let totalOvertimeHours = 0;
    let totalWagesEarned = 0;
    let totalAdvanceGiven = 0;
    let advanceTransactionsCount = 0;
    let totalPaymentReceived = 0;
    let totalPendingDues = 0;

    dayLogs.forEach((l) => {
      if (l.status === 'present') presentCount++;
      else if (l.status === 'absent') absentCount++;
      else if (l.status === 'half_day') halfDayCount++;
      else if (l.status === 'overtime') {
        presentCount++;
        overtimeCount++;
      } else if (l.status === 'leave') leaveCount++;

      totalDutyHours += l.workingHours || 0;
      totalOvertimeHours += l.overtimeHours || 0;

      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      
      // Calculate advance total from advances array or advanceReceived
      let adv = l.advanceReceived || 0;
      if (l.advances && l.advances.length > 0) {
        adv = l.advances.reduce((sum, item) => sum + (item.amount || 0), 0);
        advanceTransactionsCount += l.advances.length;
      } else if (adv > 0) {
        advanceTransactionsCount += 1;
      }

      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec - adv);

      totalWagesEarned += rate;
      totalAdvanceGiven += adv;
      totalPaymentReceived += rec;
      totalPendingDues += pend;
    });

    return {
      totalEntries: dayLogs.length,
      presentCount,
      absentCount,
      halfDayCount,
      overtimeCount,
      leaveCount,
      totalDutyHours,
      totalOvertimeHours,
      totalWagesEarned,
      totalAdvanceGiven,
      advanceTransactionsCount,
      totalPaymentReceived,
      totalPendingDues
    };
  }, [dayLogs]);

  // Filtered day logs
  const filteredDayLogs = useMemo(() => {
    return dayLogs.filter((l) => {
      if (statusFilter === 'has_advance') {
        const hasAdv = (l.advanceReceived || 0) > 0 || (l.advances && l.advances.length > 0);
        if (!hasAdv) return false;
      } else if (statusFilter === 'has_pending') {
        const pend = l.pendingPayment !== undefined 
          ? l.pendingPayment 
          : Math.max(0, (l.salaryOrRate || 0) - (l.paymentReceived || 0) - (l.advanceReceived || 0));
        if (pend <= 0) return false;
      } else if (statusFilter !== 'all' && l.status !== statusFilter) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.employerName?.toLowerCase().includes(q) ||
        l.workAddress?.toLowerCase().includes(q) ||
        l.workType?.toLowerCase().includes(q) ||
        l.workCategory?.toLowerCase().includes(q) ||
        l.jobDescription?.toLowerCase().includes(q) ||
        l.notes?.toLowerCase().includes(q) ||
        l.advanceReason?.toLowerCase().includes(q)
      );
    });
  }, [dayLogs, statusFilter, searchQuery]);

  // Print Daily Attendance Report
  const handlePrintDayReport = () => {
    triggerHaptic('light');
    const printableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Daily Attendance & Work Statement - ${selectedDate}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 10px; color: #0F172A; background: #fff; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #0284C7; padding-bottom: 12px; margin-bottom: 14px; }
          .brand { font-size: 22px; font-weight: 800; color: #0284C7; letter-spacing: 0.5px; }
          .subbrand { font-size: 11px; color: #64748B; font-weight: 600; margin-top: 2px; }
          .date-box { text-align: right; }
          .date-title { font-size: 16px; font-weight: 800; color: #0F172A; }
          .date-sub { font-size: 12px; color: #64748B; font-weight: 600; }
          .kpi-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px; margin-bottom: 14px; }
          .kpi-item { text-align: center; }
          .kpi-lbl { font-size: 10px; color: #64748B; font-weight: bold; text-transform: uppercase; }
          .kpi-val { font-size: 15px; font-weight: 800; color: #0F172A; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
          th { background: #0284C7; color: white; padding: 8px 6px; text-align: left; font-weight: 700; font-size: 10.5px; border: 1px solid #0284C7; }
          td { padding: 7px 6px; border: 1px solid #CBD5E1; vertical-align: top; }
          tr:nth-child(even) { background: #F8FAFC; }
          .chip { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 9.5px; font-weight: bold; }
          .chip-adv { background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; margin-top: 2px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 45px; padding-top: 10px; }
          .sig-box { width: 220px; border-top: 1.5px solid #64748B; text-align: center; font-size: 11px; font-weight: bold; color: #334155; padding-top: 6px; }
          .footer { text-align: center; margin-top: 25px; font-size: 10px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">DAILY KHATA PRO</div>
            <div class="subbrand">Daily Attendance & Work Inspector • www.rozfiber.com</div>
          </div>
          <div class="date-box">
            <div class="date-title">${formattedDateTitle}</div>
            <div class="date-sub">Daily Shift Register (तारीख: ${selectedDate})</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item"><div class="kpi-lbl">Total Logged</div><div class="kpi-val">${dayStats.totalEntries}</div></div>
          <div class="kpi-item"><div class="kpi-lbl">Present</div><div class="kpi-val" style="color:#16A34A;">${dayStats.presentCount}</div></div>
          <div class="kpi-item"><div class="kpi-lbl">Half Day / OT</div><div class="kpi-val" style="color:#D97706;">${dayStats.halfDayCount} / ${dayStats.overtimeCount}</div></div>
          <div class="kpi-item"><div class="kpi-lbl">Duty Hours</div><div class="kpi-val">${dayStats.totalDutyHours}h</div></div>
          <div class="kpi-item"><div class="kpi-lbl">Total Wages</div><div class="kpi-val">${formatCurrency(dayStats.totalWagesEarned)}</div></div>
          <div class="kpi-item"><div class="kpi-lbl">Total Advance</div><div class="kpi-val" style="color:#D97706;">${formatCurrency(dayStats.totalAdvanceGiven)}</div></div>
          <div class="kpi-item"><div class="kpi-lbl">Pending Dues</div><div class="kpi-val" style="color:#0284C7;">${formatCurrency(dayStats.totalPendingDues)}</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px;">#</th>
              <th>Name / Person</th>
              <th>Status</th>
              <th>Duty Hours (12H)</th>
              <th>Location / Area</th>
              <th>Category / Work</th>
              <th>Wage / Rate</th>
              <th>Advance Breakdown & Reason</th>
              <th>Received</th>
              <th>Net Due</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${dayLogs.map((l, idx) => {
              const advList = l.advances && l.advances.length > 0 
                ? l.advances 
                : ((l.advanceReceived || 0) > 0 ? [{ id: '1', amount: l.advanceReceived || 0, reason: l.advanceReason }] : []);
              
              const advHtml = advList.length > 0
                ? advList.map(a => `<div class="chip chip-adv">₹${a.amount} - ${a.reason || 'Advance'} ${a.time ? `(${a.time})` : ''}</div>`).join('')
                : '-';

              return `
                <tr>
                  <td style="text-align: center;">${idx + 1}</td>
                  <td><strong>${l.employerName || 'General / Unnamed'}</strong></td>
                  <td><strong>${l.status.toUpperCase()}</strong></td>
                  <td>${l.startTime && l.endTime ? `${formatTime12h(l.startTime)} - ${formatTime12h(l.endTime)} (${l.workingHours || 0}h)` : '-'}</td>
                  <td>${l.workAddress || '-'}</td>
                  <td>${l.workCategory || l.workType || '-'}</td>
                  <td>${l.salaryOrRate ? formatCurrency(l.salaryOrRate) : '-'}</td>
                  <td>${advHtml}</td>
                  <td>${l.paymentReceived ? formatCurrency(l.paymentReceived) : '-'}</td>
                  <td style="font-weight: bold; color: ${(l.pendingPayment || 0) > 0 ? '#0284C7' : '#16A34A'};">${l.pendingPayment ? formatCurrency(l.pendingPayment) : 'PAID'}</td>
                  <td>${l.notes || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-box">Supervisor / Verifier Signature</div>
          <div class="sig-box">Authorized Signatory / Stamp</div>
        </div>

        <div class="footer">
          Printed on ${new Date().toLocaleString()} • Daily Khata Pro Professional Attendance Suite
        </div>
      </body>
      </html>
    `;

    printHTMLContent(printableHtml);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-primary,#38BDF8)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[18px] font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{isHindi ? 'दैनिक उपस्थिति व एडवांस विवरण' : 'Daily Attendance & Advance Inspector'}</span>
              </h2>
              <p className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi ? 'चुने गए दिन का पूरा हिसाब, हाजिरी, घंटे, मल्टीपल एडवांस व बकाया' : 'Full inspection of attendance, shift hours, multiple advances & pending balances.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrintDayReport}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30 text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Print Today's Attendance Slip"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHindi ? 'प्रिंट रिपोर्ट' : 'Print Day'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date Navigator Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[var(--theme-surface,#0E1A29)] border-b border-[var(--theme-border,#213E61)]/70 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    triggerHaptic('light');
                  }
                }}
                className="bg-transparent text-[var(--theme-text,#F8FAFC)] text-[13px] font-bold outline-hidden cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {availableDates.length > 0 && (
              <select
                value={availableDates.includes(selectedDate) ? selectedDate : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    triggerHaptic('light');
                  }
                }}
                className="bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[11.5px] font-semibold px-2 py-1 rounded-lg border border-[var(--theme-border,#213E61)] cursor-pointer max-w-[140px] xs:max-w-[180px] truncate"
                title={isHindi ? 'उपलब्ध तारीखें' : 'Select recorded date'}
              >
                <option value="" disabled>{isHindi ? 'दर्ज तारीखें...' : 'Jump to Date...'}</option>
                {availableDates.map((dStr) => {
                  const count = attendanceLogs.filter(l => normalizeDate(l.date) === dStr).length;
                  return (
                    <option key={dStr} value={dStr}>
                      {dStr} ({count} {isHindi ? 'रिकॉर्ड' : 'entries'})
                    </option>
                  );
                })}
              </select>
            )}

            {selectedDate !== todayStr && (
              <button
                type="button"
                onClick={handleJumpToday}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/40 font-bold hover:bg-[var(--theme-primary,#38BDF8)]/30 cursor-pointer"
              >
                {isHindi ? 'आज पर जाएं' : 'Jump Today'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] sm:text-[14px] font-extrabold text-[var(--theme-text,#F8FAFC)]">
              {formattedDateTitle}
            </span>
            {selectedDate === todayStr && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {isHindi ? 'आज (Today)' : 'Today'}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Day Statistics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-center">
              <span className="text-[10px] font-bold text-[var(--theme-text-muted,#94A3B8)] uppercase block">{isHindi ? 'कुल रिकॉर्ड' : 'Total'}</span>
              <span className="text-[16px] font-extrabold text-[var(--theme-text,#F8FAFC)] font-mono">{dayStats.totalEntries}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block">{isHindi ? 'उपस्थित' : 'Present'}</span>
              <span className="text-[16px] font-extrabold text-emerald-300 font-mono">{dayStats.presentCount}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-[10px] font-bold text-amber-400 uppercase block">{isHindi ? 'हाफ डे' : 'Half Day'}</span>
              <span className="text-[16px] font-extrabold text-amber-300 font-mono">{dayStats.halfDayCount}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase block">{isHindi ? 'अनुपस्थित' : 'Absent'}</span>
              <span className="text-[16px] font-extrabold text-rose-300 font-mono">{dayStats.absentCount}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
              <span className="text-[10px] font-bold text-purple-400 uppercase block">{isHindi ? 'ड्यूटी घंटे' : 'Duty Hours'}</span>
              <span className="text-[16px] font-extrabold text-purple-300 font-mono">{dayStats.totalDutyHours}h</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-center">
              <span className="text-[10px] font-bold text-amber-400 uppercase block flex items-center justify-center gap-1">
                <Coins className="w-3 h-3" />
                <span>{isHindi ? 'कुल एडवांस' : 'Advance'}</span>
              </span>
              <span className="text-[16px] font-extrabold text-amber-300 font-mono">
                {formatCurrency(dayStats.totalAdvanceGiven, privacyMask)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase block">{isHindi ? 'आज का बाकी' : 'Net Due'}</span>
              <span className="text-[16px] font-extrabold text-sky-300 font-mono">
                {formatCurrency(dayStats.totalPendingDues, privacyMask)}
              </span>
            </div>
          </div>

          {/* Search, Filter & Quick Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-[var(--theme-surface,#0E1A29)] p-2.5 rounded-xl border border-[var(--theme-border,#213E61)]">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted,#94A3B8)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'नाम, साइट, काम या एडवांस कारण खोजें...' : 'Search staff, site, task, or advance reason...'}
                className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] pl-9 pr-3 py-1.5 rounded-lg border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: isHindi ? 'सभी' : 'All' },
                { id: 'present', label: isHindi ? 'उपस्थित' : 'Present' },
                { id: 'has_advance', label: isHindi ? 'एडवांस वाले' : 'With Adv' },
                { id: 'has_pending', label: isHindi ? 'बकाया वाले' : 'With Dues' },
                { id: 'half_day', label: isHindi ? 'हाफ डे' : 'Half Day' },
                { id: 'absent', label: isHindi ? 'अनुपस्थित' : 'Absent' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(chip.id as any);
                    triggerHaptic('light');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                    statusFilter === chip.id
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-sm'
                      : 'bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#94A3B8)] hover:text-white border border-[var(--theme-border,#213E61)]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onOpenNewModalForDate(selectedDate)}
              className="px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-slate-950 text-[12px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:opacity-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'एंट्री जोड़ें' : 'Add Entry'}</span>
            </button>
          </div>

          {/* List of Entries for the day */}
          {filteredDayLogs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--theme-surface,#0E1A29)]/60 border border-[var(--theme-border,#213E61)]/70 text-center space-y-3">
              <Calendar className="w-10 h-10 mx-auto text-[var(--theme-text-muted,#94A3B8)] opacity-50" />
              <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'इस तारीख के लिए कोई हाजिरी रिकॉर्ड नहीं मिला' : 'No attendance entries logged for this date'}
              </h3>
              <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)] max-w-sm mx-auto">
                {isHindi 
                  ? 'आप इस दिन के लिए नया अटेंडेंस रिकॉर्ड बना सकते हैं या तारीख बदल सकते हैं।'
                  : 'You can log attendance for this day or navigate to another date using the date switcher.'}
              </p>
              <button
                type="button"
                onClick={() => onOpenNewModalForDate(selectedDate)}
                className="px-4 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-slate-950 font-extrabold text-[12.5px] inline-flex items-center gap-1.5 cursor-pointer shadow-md hover:opacity-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? 'इस दिन की हाजिरी दर्ज करें' : 'Log Attendance for this day'}</span>
              </button>

              {availableDates.length > 0 && (
                <div className="pt-4 border-t border-[var(--theme-border,#213E61)]/50 mt-4 text-left">
                  <div className="text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] mb-2 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{isHindi ? 'पहले से उपलब्ध अटेंडेंस तारीखें (क्लिक करें):' : 'Previously Recorded Dates (Click to view):'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.slice(0, 10).map((dStr) => {
                      const count = attendanceLogs.filter(l => normalizeDate(l.date) === dStr).length;
                      return (
                        <button
                          key={dStr}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dStr);
                            triggerHaptic('light');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <span className="font-mono">{dStr}</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] font-bold">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDayLogs.map((log) => {
                const catMeta = getWorkCategoryMeta(log.workCategory || log.workType);
                const CatIcon = catMeta.icon;

                // Normalize advances
                const advancesList = log.advances && log.advances.length > 0
                  ? log.advances
                  : ((log.advanceReceived || 0) > 0 
                      ? [{ id: 'adv-single', amount: log.advanceReceived || 0, reason: log.advanceReason, paymentMode: 'cash' }] 
                      : []);
                
                const totalAdv = advancesList.reduce((s, a) => s + (a.amount || 0), 0);

                return (
                  <div 
                    key={log.id}
                    className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all space-y-2.5 shadow-sm"
                  >
                    {/* Top Row: Name, Category, Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                          <h4 className="text-[14px] font-extrabold text-[var(--theme-text,#F8FAFC)] truncate">
                            {log.employerName || (isHindi ? 'सामान्य / स्वतंत्र' : 'General / Freelance')}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${catMeta.badgeBg} ${catMeta.color} ${catMeta.borderColor}`}>
                            <CatIcon className="w-3 h-3" />
                            <span>{isHindi ? catMeta.nameHi : catMeta.nameEn}</span>
                          </span>
                          {log.workAddress && (
                            <span className="text-[11px] text-rose-300 flex items-center gap-1 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{log.workAddress}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Attendance Status Badge */}
                      <span className={`px-2 py-1 rounded-lg text-[10.5px] font-extrabold border shrink-0 ${
                        log.status === 'present' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        log.status === 'half_day' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                        log.status === 'overtime' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                        log.status === 'leave' ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
                        'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        {log.status === 'present' ? (isHindi ? 'उपस्थित (Full Day)' : 'Present') :
                         log.status === 'half_day' ? (isHindi ? 'हाफ डे (Half Day)' : 'Half Day') :
                         log.status === 'overtime' ? (isHindi ? 'ओवरटाइम' : 'Overtime') :
                         log.status === 'leave' ? (isHindi ? 'अवकाश' : 'Leave') :
                         (isHindi ? 'अनुपस्थित' : 'Absent')}
                      </span>
                    </div>

                    {/* Duty Timings */}
                    {log.status !== 'absent' && log.status !== 'leave' && (
                      <div className="flex items-center gap-3 text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-card,#132438)] px-2.5 py-1.5 rounded-lg border border-[var(--theme-border,#213E61)]/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                          <span>{log.startTime && log.endTime ? `${formatTime12h(log.startTime)} - ${formatTime12h(log.endTime)}` : '09:00 AM - 06:00 PM'}</span>
                        </span>
                        <span className="font-bold text-[var(--theme-text,#F8FAFC)]">
                          {log.workingHours || 8} hrs
                        </span>
                        {Boolean(log.overtimeHours) && (
                          <span className="text-purple-400 font-bold">
                            +{log.overtimeHours}h OT
                          </span>
                        )}
                      </div>
                    )}

                    {/* Multiple Advances Breakdown Section */}
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-amber-400 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'एडवांस / पेशगी विवरण:' : 'Advance Breakdown:'}</span>
                        </span>
                        <span className="text-[12px] font-extrabold text-amber-300 font-mono">
                          {formatCurrency(totalAdv, privacyMask)}
                        </span>
                      </div>

                      {advancesList.length > 0 ? (
                        <div className="space-y-1 pt-1">
                          {advancesList.map((adv, aIdx) => {
                            const reasonMeta = getAdvanceReasonMeta(adv.reason);
                            const AdvIcon = reasonMeta.icon;
                            return (
                              <div 
                                key={adv.id || aIdx}
                                className="flex items-center justify-between text-[11px] bg-[var(--theme-card,#132438)]/90 px-2 py-1 rounded border border-amber-500/20"
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <AdvIcon className={`w-3 h-3 shrink-0 ${reasonMeta.color || 'text-amber-400'}`} />
                                  <span className="font-bold text-amber-300 font-mono">₹{adv.amount}</span>
                                  <span className="text-[var(--theme-text-muted,#CBD5E1)] truncate">
                                    {getAdvanceReasonLabel(adv.reason, isHindi)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-[var(--theme-text-dim,#94A3B8)] shrink-0">
                                  {adv.paymentMode && (
                                    <span className="uppercase px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                      {adv.paymentMode}
                                    </span>
                                  )}
                                  {adv.time && <span>{adv.time}</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] italic">
                          {isHindi ? 'कोई एडवांस नहीं लिया गया' : 'No advance taken for this shift'}
                        </p>
                      )}

                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onOpenQuickAdvance(log)}
                          className="text-[10.5px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isHindi ? '+ नया एडवांस जोड़ें' : '+ Add Advance'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Wage, Received & Net Dues calculation */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] p-2 rounded-lg bg-[var(--theme-card,#132438)]/70 border border-[var(--theme-border,#213E61)]/50">
                      <div>
                        <span className="text-[10px] text-[var(--theme-text-muted,#94A3B8)] block">{isHindi ? 'दर / वेतन' : 'Rate'}</span>
                        <span className="font-bold font-mono text-[var(--theme-text,#F8FAFC)]">
                          {log.salaryOrRate ? formatCurrency(log.salaryOrRate, privacyMask) : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--theme-text-muted,#94A3B8)] block">{isHindi ? 'प्राप्त' : 'Received'}</span>
                        <span className="font-bold font-mono text-emerald-400">
                          {log.paymentReceived ? formatCurrency(log.paymentReceived, privacyMask) : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--theme-text-muted,#94A3B8)] block">{isHindi ? 'शेष बाकी' : 'Net Due'}</span>
                        <span className={`font-bold font-mono ${(log.pendingPayment || 0) > 0 ? 'text-sky-400' : 'text-emerald-400'}`}>
                          {log.pendingPayment ? formatCurrency(log.pendingPayment, privacyMask) : '0'}
                        </span>
                      </div>
                    </div>

                    {/* Notes if any */}
                    {log.notes && (
                      <p className="text-[11px] text-[var(--theme-text-muted,#94A3B8)] italic bg-[var(--theme-card,#132438)]/40 px-2 py-1 rounded border border-[var(--theme-border,#213E61)]/30">
                        {log.notes}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-[var(--theme-border,#213E61)]/50">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(log)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isHindi ? 'संपादित करें' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteAttendanceLog(log.id)}
                        className="p-1 rounded-lg bg-[var(--theme-card,#132438)] text-rose-400 hover:text-rose-300 border border-rose-500/20 cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between shrink-0">
          <div className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] font-medium">
            {isHindi ? 'दैनिक सारांश:' : 'Day Summary:'} <strong className="text-[var(--theme-text,#F8FAFC)]">{dayLogs.length} {isHindi ? 'प्रविष्टियां' : 'records'}</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] font-bold cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
