import React, { useState, useMemo } from 'react';
import { AttendanceLog, AttendanceStatus, PaymentStatusType, AppLanguage, PaymentMode, FundType } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import {
  Calendar,
  Clock,
  Briefcase,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock3,
  CalendarCheck,
  Plus,
  ArrowLeft,
  Search,
  Printer,
  Edit3,
  Trash2,
  TrendingUp,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Coins,
  Check,
  X,
  PieChart
} from 'lucide-react';
import { NativeTimePicker } from './NativeTimePicker';
import { ConfirmModal } from './ConfirmModal';
import { 
  WORK_CATEGORIES_CATALOG, 
  getWorkCategoryMeta, 
  EmployerSummary 
} from './attendance/attendanceTypes';
import { BulkPaymentSettlementModal } from './attendance/BulkPaymentSettlementModal';
import { EmployerAccountsView } from './attendance/EmployerAccountsView';

export interface AttendancePageProps {
  attendanceLogs: AttendanceLog[];
  onSaveAttendanceLog: (logData: Omit<AttendanceLog, 'id' | 'createdAt'>, editingId?: string) => void;
  onBatchUpdateAttendanceLogs?: (updatedLogs: AttendanceLog[], toastMessage?: string) => void;
  onDeleteAttendanceLog: (id: string) => void;
  onRecordAttendanceIncomeToKhata?: (log: AttendanceLog) => void;
  onRecordBulkAttendancePaymentToKhata?: (data: {
    amount: number;
    date: string;
    employerName?: string;
    workType?: string;
    note?: string;
    fund?: FundType;
    paymentMode?: PaymentMode;
  }) => void;
  onBack: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  attendanceLogs = [],
  onSaveAttendanceLog,
  onBatchUpdateAttendanceLogs,
  onDeleteAttendanceLog,
  onRecordAttendanceIncomeToKhata,
  onRecordBulkAttendancePaymentToKhata,
  onBack,
  language = 'en',
  privacyMask = false
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';

  // Active view tab: 'register' | 'employers' | 'summary'
  const [activeTab, setActiveTab] = useState<'register' | 'employers' | 'summary'>('register');

  // Month navigation: format 'YYYY-MM'
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = todayStr.slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  // Search and filters for Register tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentStatusType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [employerFilter, setEmployerFilter] = useState<string>('all');

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<AttendanceLog | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Bulk Settlement Modal
  const [isBulkPayModalOpen, setIsBulkPayModalOpen] = useState(false);
  const [bulkPayInitialEmployer, setBulkPayInitialEmployer] = useState<string>('all');

  // Form State for Add / Edit Modal
  const [formDate, setFormDate] = useState(todayStr);
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('present');
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('18:00');
  const [formOvertimeHours, setFormOvertimeHours] = useState('0');
  const [formEmployerName, setFormEmployerName] = useState('');
  const [formWorkCategory, setFormWorkCategory] = useState('office');
  const [formWorkAddress, setFormWorkAddress] = useState('');
  const [formWorkType, setFormWorkType] = useState('');
  const [formJobDescription, setFormJobDescription] = useState('');
  const [formSalaryOrRate, setFormSalaryOrRate] = useState('');
  const [formPaymentReceived, setFormPaymentReceived] = useState('');
  const [formAdvanceReceived, setFormAdvanceReceived] = useState('');
  const [formPendingPayment, setFormPendingPayment] = useState('');
  const [formPaymentStatus, setFormPaymentStatus] = useState<PaymentStatusType>('pending');
  const [formPaymentDate, setFormPaymentDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Extract all distinct employer names
  const existingEmployers = useMemo(() => {
    const set = new Set<string>();
    attendanceLogs.forEach((l) => {
      if (l.employerName && l.employerName.trim()) {
        set.add(l.employerName.trim());
      }
    });
    return Array.from(set).sort();
  }, [attendanceLogs]);

  // Employer Summaries Aggregation (for Accounts & Dues)
  const employerSummaries = useMemo<EmployerSummary[]>(() => {
    const map = new Map<string, {
      totalDays: number;
      presentDays: number;
      halfDays: number;
      overtimeHours: number;
      workingHours: number;
      totalEarned: number;
      totalReceived: number;
      totalPending: number;
      pendingLogsCount: number;
      latestDate: string;
      categoryCounts: Record<string, number>;
    }>();

    attendanceLogs.forEach((l) => {
      const empName = l.employerName?.trim() || (isHindi ? 'सामान्य / स्वतंत्र' : 'General / Freelance');
      const cat = l.workCategory || l.workType || 'custom';
      
      const current = map.get(empName) || {
        totalDays: 0,
        presentDays: 0,
        halfDays: 0,
        overtimeHours: 0,
        workingHours: 0,
        totalEarned: 0,
        totalReceived: 0,
        totalPending: 0,
        pendingLogsCount: 0,
        latestDate: l.date,
        categoryCounts: {}
      };

      current.totalDays += 1;
      if (l.status === 'present' || l.status === 'overtime') current.presentDays += 1;
      if (l.status === 'half_day') current.halfDays += 1;
      current.overtimeHours += l.overtimeHours || 0;
      current.workingHours += l.workingHours || 0;

      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);

      current.totalEarned += rate;
      current.totalReceived += rec;
      current.totalPending += pend;
      if (pend > 0 && l.paymentStatus !== 'paid') {
        current.pendingLogsCount += 1;
      }

      if (l.date > current.latestDate) {
        current.latestDate = l.date;
      }

      current.categoryCounts[cat] = (current.categoryCounts[cat] || 0) + 1;
      map.set(empName, current);
    });

    const result: EmployerSummary[] = [];
    map.forEach((data, name) => {
      // Find primary category
      let primaryCat = 'office';
      let maxCount = -1;
      Object.entries(data.categoryCounts).forEach(([c, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          primaryCat = c;
        }
      });

      result.push({
        name,
        primaryCategory: primaryCat,
        totalDays: data.totalDays,
        presentDays: data.presentDays,
        halfDays: data.halfDays,
        overtimeHours: data.overtimeHours,
        workingHours: data.workingHours,
        totalEarned: data.totalEarned,
        totalReceived: data.totalReceived,
        totalPending: data.totalPending,
        pendingLogsCount: data.pendingLogsCount,
        latestDate: data.latestDate
      });
    });

    return result.sort((a, b) => b.totalPending - a.totalPending || b.latestDate.localeCompare(a.latestDate));
  }, [attendanceLogs, isHindi]);

  // Total pending dues across all employers
  const globalTotalPending = useMemo(() => {
    return employerSummaries.reduce((sum, e) => sum + e.totalPending, 0);
  }, [employerSummaries]);

  // Check today log
  const todayLog = useMemo(() => {
    return attendanceLogs.find((l) => l.date === todayStr);
  }, [attendanceLogs, todayStr]);

  // Logs for current selected month
  const monthLogs = useMemo(() => {
    return attendanceLogs
      .filter((l) => l.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [attendanceLogs, selectedMonth]);

  // Filtered logs based on filters
  const filteredLogs = useMemo(() => {
    return monthLogs.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && l.paymentStatus !== paymentFilter) return false;
      if (categoryFilter !== 'all') {
        const cat = l.workCategory || l.workType;
        if (cat !== categoryFilter) return false;
      }
      if (employerFilter !== 'all' && l.employerName !== employerFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.date.includes(q) ||
        l.employerName?.toLowerCase().includes(q) ||
        l.workType?.toLowerCase().includes(q) ||
        l.workCategory?.toLowerCase().includes(q) ||
        l.jobDescription?.toLowerCase().includes(q) ||
        l.notes?.toLowerCase().includes(q) ||
        l.workAddress?.toLowerCase().includes(q)
      );
    });
  }, [monthLogs, statusFilter, paymentFilter, categoryFilter, employerFilter, searchQuery]);

  // Monthly stats
  const stats = useMemo(() => {
    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let leaveDays = 0;
    let overtimeDays = 0;
    let totalOvertimeHours = 0;
    let totalWorkingHours = 0;
    let totalEarnings = 0;
    let totalReceived = 0;
    let totalAdvance = 0;
    let totalPending = 0;

    monthLogs.forEach((l) => {
      if (l.status === 'present') presentDays++;
      else if (l.status === 'absent') absentDays++;
      else if (l.status === 'half_day') halfDays++;
      else if (l.status === 'leave') leaveDays++;
      else if (l.status === 'overtime') {
        presentDays++;
        overtimeDays++;
      }

      totalOvertimeHours += l.overtimeHours || 0;
      totalWorkingHours += l.workingHours || 0;
      totalEarnings += l.salaryOrRate || 0;
      totalReceived += l.paymentReceived || 0;
      totalAdvance += l.advanceReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, (l.salaryOrRate || 0) - (l.paymentReceived || 0));
      totalPending += pend;
    });

    return {
      totalLogged: monthLogs.length,
      presentDays,
      absentDays,
      halfDays,
      leaveDays,
      overtimeDays,
      totalOvertimeHours,
      totalWorkingHours,
      totalEarnings,
      totalReceived,
      totalAdvance,
      totalPending
    };
  }, [monthLogs]);

  // Navigation helpers
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    setSelectedMonth(`${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`);
    triggerHapticSound('click');
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const nextDate = new Date(y, m, 1);
    setSelectedMonth(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`);
    triggerHapticSound('click');
  };

  const formatMonthTitle = (monthStr: string) => {
    const [y, m] = monthStr.split('-').map(Number);
    const date = new Date(y, m - 1, 1);
    return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Quick mark today
  const handleQuickMarkToday = (status: AttendanceStatus) => {
    triggerHapticSound('click');
    const existing = attendanceLogs.find((l) => l.date === todayStr);
    onSaveAttendanceLog(
      {
        date: todayStr,
        status: status,
        startTime: status === 'absent' || status === 'leave' ? undefined : '09:00',
        endTime: status === 'absent' || status === 'leave' ? undefined : (status === 'half_day' ? '13:30' : '18:00'),
        workingHours: status === 'present' ? 8 : (status === 'half_day' ? 4 : 0),
        overtimeHours: status === 'overtime' ? 2 : 0,
        workCategory: formWorkCategory || 'office',
        employerName: existing?.employerName || formEmployerName || undefined,
        paymentStatus: 'pending'
      },
      existing?.id
    );
  };

  // Open modal for new log
  const handleOpenNewModal = (defaultEmployer?: string) => {
    setEditingLog(null);
    setFormDate(todayStr);
    setFormStatus('present');
    setFormStartTime('09:00');
    setFormEndTime('18:00');
    setFormOvertimeHours('0');
    setFormEmployerName(defaultEmployer || '');
    setFormWorkCategory('office');
    setFormWorkAddress('');
    setFormWorkType('');
    setFormJobDescription('');
    setFormSalaryOrRate('');
    setFormPaymentReceived('');
    setFormAdvanceReceived('');
    setFormPendingPayment('');
    setFormPaymentStatus('pending');
    setFormPaymentDate('');
    setFormNotes('');
    setIsLogModalOpen(true);
    triggerHapticSound('click');
  };

  // Open modal for editing log
  const handleOpenEditModal = (log: AttendanceLog) => {
    setEditingLog(log);
    setFormDate(log.date);
    setFormStatus(log.status);
    setFormStartTime(log.startTime || '09:00');
    setFormEndTime(log.endTime || '18:00');
    setFormOvertimeHours(String(log.overtimeHours || 0));
    setFormEmployerName(log.employerName || '');
    setFormWorkCategory(log.workCategory || log.workType || 'office');
    setFormWorkAddress(log.workAddress || '');
    setFormWorkType(log.workType || '');
    setFormJobDescription(log.jobDescription || '');
    setFormSalaryOrRate(log.salaryOrRate ? String(log.salaryOrRate) : '');
    setFormPaymentReceived(log.paymentReceived ? String(log.paymentReceived) : '');
    setFormAdvanceReceived(log.advanceReceived ? String(log.advanceReceived) : '');
    setFormPendingPayment(log.pendingPayment !== undefined ? String(log.pendingPayment) : '');
    setFormPaymentStatus(log.paymentStatus || 'pending');
    setFormPaymentDate(log.paymentDate || '');
    setFormNotes(log.notes || '');
    setIsLogModalOpen(true);
    triggerHapticSound('click');
  };

  // Calculate working hours
  const calculateWorkingHours = (start?: string, end?: string): number => {
    if (!start || !end) return 0;
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      if (endMin > startMin) {
        return parseFloat(((endMin - startMin) / 60).toFixed(1));
      }
      return 0;
    } catch {
      return 0;
    }
  };

  // Submit Modal Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticSound('save');

    const calculatedHours = calculateWorkingHours(formStartTime, formEndTime);
    const rate = parseFloat(formSalaryOrRate) || 0;
    const received = parseFloat(formPaymentReceived) || 0;
    const advance = parseFloat(formAdvanceReceived) || 0;
    const customPending = parseFloat(formPendingPayment);
    const calculatedPending = !isNaN(customPending) ? customPending : Math.max(0, rate - received - advance);

    onSaveAttendanceLog(
      {
        date: formDate,
        status: formStatus,
        startTime: formStatus === 'absent' || formStatus === 'leave' ? undefined : formStartTime,
        endTime: formStatus === 'absent' || formStatus === 'leave' ? undefined : formEndTime,
        workingHours: calculatedHours,
        overtimeHours: parseFloat(formOvertimeHours) || 0,
        employerName: formEmployerName.trim() || undefined,
        workCategory: formWorkCategory,
        workAddress: formWorkAddress.trim() || undefined,
        workType: formWorkType.trim() || formWorkCategory,
        jobDescription: formJobDescription.trim() || undefined,
        salaryOrRate: rate > 0 ? rate : undefined,
        paymentReceived: received > 0 ? received : undefined,
        advanceReceived: advance > 0 ? advance : undefined,
        pendingPayment: calculatedPending > 0 ? calculatedPending : undefined,
        paymentStatus: formPaymentStatus,
        paymentDate: formPaymentDate || undefined,
        notes: formNotes.trim() || undefined
      },
      editingLog?.id
    );

    setIsLogModalOpen(false);
  };

  // Print Monthly Register Slip
  const handlePrintAttendanceSlip = () => {
    triggerHapticSound('click');
    const printableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Attendance Register - ${formatMonthTitle(selectedMonth)}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #1E293B; }
          .header { text-align: center; border-bottom: 2px solid #0284C7; padding-bottom: 12px; margin-bottom: 15px; }
          .brand { font-size: 22px; font-weight: 800; color: #0284C7; }
          .subbrand { font-size: 11px; color: #64748B; margin-top: 3px; }
          .title { font-size: 16px; font-weight: 700; margin-top: 10px; }
          .stats-box { display: flex; justify-content: space-around; background: #F1F5F9; border-radius: 8px; padding: 12px; margin-bottom: 15px; }
          .stat-item { text-align: center; }
          .stat-label { font-size: 11px; color: #64748B; font-weight: bold; }
          .stat-val { font-size: 16px; font-weight: 800; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
          th { background: #0284C7; color: white; padding: 8px 6px; text-align: left; }
          td { padding: 8px 6px; border-bottom: 1px solid #E2E8F0; }
          tr:nth-child(even) { background: #F8FAFC; }
          .badge { font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px; display: inline-block; }
          .footer { text-align: center; margin-top: 25px; font-size: 10.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">DAILY KHATA PRO</div>
          <div class="subbrand">Official Work & Attendance Register</div>
          <div class="title">${formatMonthTitle(selectedMonth)}</div>
        </div>

        <div class="stats-box">
          <div class="stat-item"><div class="stat-label">Full Days</div><div class="stat-val">${stats.presentDays}</div></div>
          <div class="stat-item"><div class="stat-label">Half Days</div><div class="stat-val">${stats.halfDays}</div></div>
          <div class="stat-item"><div class="stat-label">Total Hours</div><div class="stat-val">${stats.totalWorkingHours}h</div></div>
          <div class="stat-item"><div class="stat-label">Total Earned</div><div class="stat-val">${formatCurrency(stats.totalEarnings)}</div></div>
          <div class="stat-item"><div class="stat-label">Pending Dues</div><div class="stat-val" style="color: #D97706;">${formatCurrency(stats.totalPending)}</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Timings</th>
              <th>OT</th>
              <th>Employer / Client</th>
              <th>Category</th>
              <th>Rate</th>
              <th>Received</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            ${monthLogs.map((l) => `
              <tr>
                <td><strong>${l.date}</strong></td>
                <td>${l.status.toUpperCase()}</td>
                <td>${l.startTime && l.endTime ? `${l.startTime}-${l.endTime}` : '-'}</td>
                <td>${l.overtimeHours ? `${l.overtimeHours}h` : '-'}</td>
                <td>${l.employerName || '-'}</td>
                <td>${l.workCategory || l.workType || '-'}</td>
                <td>${l.salaryOrRate ? formatCurrency(l.salaryOrRate) : '-'}</td>
                <td>${l.paymentReceived ? formatCurrency(l.paymentReceived) : '-'}</td>
                <td>${l.pendingPayment ? formatCurrency(l.pendingPayment) : 'PAID'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">Generated By Daily Khata Pro</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printableHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 350);
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return { label: isHindi ? 'उपस्थित (Full Day)' : 'Present', color: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30', icon: CheckCircle2 };
      case 'absent':
        return { label: isHindi ? 'अनुपस्थित (Absent)' : 'Absent', color: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30', icon: XCircle };
      case 'half_day':
        return { label: isHindi ? 'आधा दिन (Half Day)' : 'Half Day', color: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30', icon: Clock3 };
      case 'leave':
        return { label: isHindi ? 'अवकाश (Leave)' : 'On Leave', color: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30', icon: Calendar };
      case 'overtime':
        return { label: isHindi ? 'ओवरटाइम (Overtime)' : 'Overtime', color: 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30', icon: Sparkles };
    }
  };

  const getPaymentBadge = (status: PaymentStatusType) => {
    switch (status) {
      case 'paid':
        return { label: isHindi ? 'पूर्ण प्राप्त' : 'Paid in Full', color: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' };
      case 'pending':
        return { label: isHindi ? 'भुगतान बाकी' : 'Payment Pending', color: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30' };
      case 'partial':
        return { label: isHindi ? 'आंशिक प्राप्त' : 'Partially Paid', color: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
    }
  };

  // Trigger bulk settle modal from anywhere
  const handleOpenBulkSettlement = (employerName?: string) => {
    setBulkPayInitialEmployer(employerName || 'all');
    setIsBulkPayModalOpen(true);
    triggerHapticSound('click');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-7 space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[18px] sm:text-[22px] font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'दैनिक उपस्थिति एवं कार्य रजिस्टर' : 'Attendance & Work Tracker'}</span>
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi
                ? 'मल्टीपल काम, अलग-अलग कंपनी व ठेकेदारों का हिसाब और 1-क्लिक बल्क पेमेंट निपटान'
                : 'Multi-category attendance, multiple employer dues, and 1-click bulk wage settlements.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Bulk Settlement Button */}
          <button
            type="button"
            onClick={() => handleOpenBulkSettlement('all')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[12px] sm:text-[12.5px] flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
            title="Settle Lump-sum / Pending Dues in One Click"
          >
            <Coins className="w-4 h-4" />
            <span>{isHindi ? '💰 बल्क भुगतान निपटान' : '💰 Settle Dues'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintAttendanceSlip}
            className="px-3 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Print Monthly Attendance Slip"
          >
            <Printer className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <span className="hidden sm:inline">{isHindi ? 'प्रिंट स्लिप' : 'Print Slip'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenNewModal()}
            className="px-3.5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] sm:text-[13px] flex items-center gap-1.5 cursor-pointer hover:opacity-95 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'नया रिकॉर्ड' : 'Log Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs: Register | Employer Accounts | Analytics */}
      <div className="flex items-center gap-2 p-1.5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            triggerHapticSound('click');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[12.5px] sm:text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'register'
              ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-md font-extrabold'
              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{isHindi ? 'दैनिक उपस्थिति (Register)' : 'Daily Register'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('employers');
            triggerHapticSound('click');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[12.5px] sm:text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'employers'
              ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-md font-extrabold'
              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{isHindi ? 'कंपनी व काम खाते' : 'Employer Accounts'}</span>
          {globalTotalPending > 0 && (
            <span className="ml-1 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950">
              {formatCurrency(globalTotalPending, privacyMask)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('summary');
            triggerHapticSound('click');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[12.5px] sm:text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'summary'
              ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-md font-extrabold'
              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)]'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>{isHindi ? 'विश्लेषण व रिपोर्ट' : 'Analytics'}</span>
        </button>
      </div>

      {/* TAB 1: DAILY REGISTER VIEW */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          
          {/* Quick Mark Today Banner */}
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'आज की उपस्थिति दर्ज करें (Today):' : "Today's Attendance Status:"}
                </span>
                <span className="text-[12px] font-mono text-[var(--theme-primary,#38BDF8)] font-bold">
                  {todayStr}
                </span>
              </div>

              {todayLog ? (
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-lg border border-[#10B981]/30">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'आज दर्ज है:' : 'Logged Today:'} {todayLog.status.toUpperCase()}</span>
                  {todayLog.employerName && (
                    <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">({todayLog.employerName})</span>
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                  {isHindi ? 'आज अभी तक मार्क नहीं किया गया' : 'Not marked yet for today'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickMarkToday('present')}
                className={`py-2.5 px-3 rounded-xl border text-[12.5px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'present'
                    ? 'bg-[#10B981] text-[#04140D] border-[#10B981] shadow-md'
                    : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'उपस्थित (Full Day)' : 'Present (Full Day)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickMarkToday('half_day')}
                className={`py-2.5 px-3 rounded-xl border text-[12.5px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'half_day'
                    ? 'bg-[#F59E0B] text-[#070E18] border-[#F59E0B] shadow-md'
                    : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/20'
                }`}
              >
                <Clock3 className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'हाफ डे (Half Day)' : 'Half Day'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickMarkToday('overtime')}
                className={`py-2.5 px-3 rounded-xl border text-[12.5px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'overtime'
                    ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-md'
                    : 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/30 hover:bg-[#A855F7]/20'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'ओवरटाइम (OT)' : 'Overtime'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickMarkToday('absent')}
                className={`py-2.5 px-3 rounded-xl border text-[12.5px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'absent'
                    ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-md'
                    : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/20'
                }`}
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'अनुपस्थित (Absent)' : 'Absent / Off'}</span>
              </button>
            </div>
          </div>

          {/* Month Navigator & KPI Cards */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-[15px] sm:text-[17px] font-bold text-[var(--theme-text,#F8FAFC)] px-2">
                  {formatMonthTitle(selectedMonth)}
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMonth(currentMonthStr)}
                  className="text-[11.5px] font-bold px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] cursor-pointer"
                >
                  {isHindi ? 'चालू माह (Current)' : 'Current Month'}
                </button>
              </div>
            </div>

            {/* 6 KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[11px] font-bold text-[#10B981] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'पूर्ण दिन' : 'Full Days'}</span>
                </div>
                <div className="text-[18px] sm:text-[20px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-1">
                  {stats.presentDays}
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[11px] font-bold text-[#F59E0B] flex items-center justify-center gap-1">
                  <Clock3 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'हाफ डे' : 'Half Days'}</span>
                </div>
                <div className="text-[18px] sm:text-[20px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-1">
                  {stats.halfDays}
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[11px] font-bold text-[#A855F7] flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'ओवरटाइम' : 'OT Hours'}</span>
                </div>
                <div className="text-[18px] sm:text-[20px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-1">
                  {stats.totalOvertimeHours}h
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कुल कमाई' : 'Total Earnings'}</span>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] mt-1 truncate">
                  {formatCurrency(stats.totalEarnings, privacyMask)}
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[11px] font-bold text-[#10B981] flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्राप्त भुगतान' : 'Payment Received'}</span>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono font-extrabold text-[#10B981] mt-1 truncate">
                  {formatCurrency(stats.totalReceived, privacyMask)}
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[11px] font-bold text-[#F59E0B] flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'बाकी राशि' : 'Pending Balance'}</span>
                </div>
                <div className="text-[16px] sm:text-[18px] font-mono font-extrabold text-amber-400 mt-1 truncate">
                  {formatCurrency(stats.totalPending, privacyMask)}
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter Toolbar with Work Category & Employer filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3 sm:p-4">
            
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'खोजें (नियोक्ता, काम, विवरण)...' : 'Search employer, work, notes...'}
                className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] pl-9 pr-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
              >
                <option value="all">{isHindi ? 'सभी कार्य श्रेणियां' : 'All Work Categories'}</option>
                {WORK_CATEGORIES_CATALOG.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isHindi ? c.nameHi : c.nameEn}
                  </option>
                ))}
              </select>

              {/* Employer Filter */}
              {existingEmployers.length > 0 && (
                <select
                  value={employerFilter}
                  onChange={(e) => setEmployerFilter(e.target.value)}
                  className="bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
                >
                  <option value="all">{isHindi ? 'सभी नियोक्ता/कंपनी' : 'All Employers'}</option>
                  {existingEmployers.map((emp) => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              )}

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
              >
                <option value="all">{isHindi ? 'सभी स्थितियां' : 'All Status'}</option>
                <option value="present">{isHindi ? 'उपस्थित' : 'Present'}</option>
                <option value="half_day">{isHindi ? 'हाफ डे' : 'Half Day'}</option>
                <option value="overtime">{isHindi ? 'ओवरटाइम' : 'Overtime'}</option>
                <option value="absent">{isHindi ? 'अनुपस्थित' : 'Absent'}</option>
                <option value="leave">{isHindi ? 'छुट्टी' : 'Leave'}</option>
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
              >
                <option value="all">{isHindi ? 'सभी भुगतान' : 'All Payments'}</option>
                <option value="pending">{isHindi ? 'बाकी भुगतान' : 'Pending'}</option>
                <option value="paid">{isHindi ? 'पूर्ण प्राप्त' : 'Paid'}</option>
                <option value="partial">{isHindi ? 'आंशिक' : 'Partial'}</option>
              </select>
            </div>
          </div>

          {/* Attendance Log Items */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[var(--theme-card,#132438)]/40 border border-dashed border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
              <CalendarCheck className="w-10 h-10 mx-auto text-[var(--theme-text-dim,#94A3B8)]" />
              <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'इस माह के लिए कोई उपस्थिति रिकॉर्ड नहीं मिला' : 'No attendance records found for this period'}
              </h3>
              <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)] max-w-md mx-auto">
                {isHindi
                  ? 'ऊपर "नया रिकॉर्ड" बटन दबाकर उपस्थिति, शिफ्ट का समय या कंपनी का काम दर्ज करें।'
                  : 'Click "Log Attendance" above to record daily attendance, shifts, or freelance work.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const badge = getStatusBadge(log.status);
                const payBadge = getPaymentBadge(log.paymentStatus);
                const BadgeIcon = badge.icon;
                const catMeta = getWorkCategoryMeta(log.workCategory || log.workType);
                const CatIcon = catMeta.icon;

                const logDate = new Date(`${log.date}T00:00:00`);
                const dayLabel = logDate.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                });

                const rate = log.salaryOrRate || 0;
                const rec = log.paymentReceived || 0;
                const pend = log.pendingPayment !== undefined ? log.pendingPayment : Math.max(0, rate - rec);

                return (
                  <div
                    key={log.id}
                    className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Left: Date, Status, Employer & Category */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-[14.5px] text-[var(--theme-text,#F8FAFC)]">
                          {dayLabel}
                        </span>

                        <span className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.color}`}>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>

                        {/* Work Category Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${catMeta.badgeBg} ${catMeta.color} ${catMeta.borderColor}`}>
                          <CatIcon className="w-3 h-3" />
                          <span>{isHindi ? catMeta.nameHi : catMeta.nameEn}</span>
                        </span>

                        {log.overtimeHours && log.overtimeHours > 0 ? (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                            +{log.overtimeHours}h OT
                          </span>
                        ) : null}

                        {rate > 0 ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${payBadge.color}`}>
                            {payBadge.label}
                          </span>
                        ) : null}
                      </div>

                      {/* Timings and Employer Details */}
                      <div className="flex items-center gap-3 text-[12px] text-[var(--theme-text-muted,#94A3B8)] flex-wrap">
                        {log.startTime && log.endTime ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                            <span>{log.startTime} - {log.endTime} ({log.workingHours || 0}h)</span>
                          </div>
                        ) : null}

                        {log.employerName ? (
                          <div className="flex items-center gap-1 text-[var(--theme-text,#F8FAFC)] font-semibold">
                            <Building className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>{log.employerName}</span>
                          </div>
                        ) : null}
                      </div>

                      {log.jobDescription || log.notes ? (
                        <div className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-surface,#0E1A29)]/60 px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)]/40 max-w-xl">
                          {log.jobDescription || log.notes}
                        </div>
                      ) : null}
                    </div>

                    {/* Right: Payment details & Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--theme-border,#213E61)]">
                      {rate > 0 ? (
                        <div className="text-right">
                          <div className="text-[10.5px] text-[var(--theme-text-muted,#94A3B8)] font-bold">
                            {isHindi ? 'दर / मजदूरी' : 'Daily Wage'}
                          </div>
                          <div className="text-[15px] sm:text-[16px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)]">
                            {formatCurrency(rate, privacyMask)}
                          </div>
                          {pend > 0 ? (
                            <div className="text-[10.5px] font-mono text-amber-400 font-bold">
                              {isHindi ? 'बाकी:' : 'Due:'} {formatCurrency(pend, privacyMask)}
                            </div>
                          ) : (
                            <div className="text-[10.5px] font-mono text-[#10B981]">
                              ✓ {isHindi ? 'प्राप्त' : 'Received'}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <div className="flex items-center gap-1">
                        {/* Quick Settle for this single log if pending */}
                        {pend > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenBulkSettlement(log.employerName || 'all')}
                            className="p-2 rounded-xl bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-colors cursor-pointer"
                            title={isHindi ? 'बल्क भुगतान में शामिल करें' : 'Settle in Bulk Payment'}
                          >
                            <Coins className="w-4 h-4" />
                          </button>
                        )}

                        {/* Record single to Khata if received */}
                        {rec > 0 && onRecordAttendanceIncomeToKhata && (
                          <button
                            type="button"
                            onClick={() => onRecordAttendanceIncomeToKhata(log)}
                            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[#10B981] hover:bg-[#10B981]/15 border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                            title={isHindi ? 'खाता में आय दर्ज करें' : 'Record Received to Khata'}
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(log)}
                          className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(log.id)}
                          className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMPLOYER & WORK ACCOUNTS (MULTI-EMPLOYER DUES) */}
      {activeTab === 'employers' && (
        <EmployerAccountsView
          employerSummaries={employerSummaries}
          attendanceLogs={attendanceLogs}
          onOpenSettleModal={handleOpenBulkSettlement}
          onFilterByEmployer={(emp) => {
            setEmployerFilter(emp);
            setActiveTab('register');
            triggerHapticSound('click');
          }}
          onOpenNewLogForEmployer={(emp) => handleOpenNewModal(emp)}
          isHindi={isHindi}
          privacyMask={privacyMask}
        />
      )}

      {/* TAB 3: ANALYTICS & SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
            <h3 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'कार्य श्रेणी व कमाई का विश्लेषण' : 'Category & Employer Analysis'}</span>
            </h3>

            {/* Category breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WORK_CATEGORIES_CATALOG.map((cat) => {
                const logsForCat = attendanceLogs.filter((l) => (l.workCategory || l.workType) === cat.id);
                if (logsForCat.length === 0) return null;
                const earned = logsForCat.reduce((sum, l) => sum + (l.salaryOrRate || 0), 0);
                const rec = logsForCat.reduce((sum, l) => sum + (l.paymentReceived || 0), 0);
                const pend = logsForCat.reduce((sum, l) => sum + (l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, (l.salaryOrRate || 0) - (l.paymentReceived || 0))), 0);
                const CatIcon = cat.icon;

                return (
                  <div key={cat.id} className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/70 border border-[var(--theme-border,#213E61)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${cat.badgeBg} ${cat.color}`}>
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)]">
                          {isHindi ? cat.nameHi : cat.nameEn}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-mono">
                        {logsForCat.length} {isHindi ? 'दिन' : 'days'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[12px] pt-1 border-t border-[var(--theme-border,#213E61)]/50">
                      <span className="text-[var(--theme-text-muted,#94A3B8)]">{isHindi ? 'कुल कमाई:' : 'Earned:'}</span>
                      <span className="font-mono font-bold text-[var(--theme-text,#F8FAFC)]">{formatCurrency(earned, privacyMask)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-amber-400">{isHindi ? 'बाकी भुगतान:' : 'Pending:'}</span>
                      <span className="font-mono font-bold text-amber-400">{formatCurrency(pend, privacyMask)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Attendance Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] shrink-0">
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                <h3 className="text-[16px] sm:text-[17px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {editingLog
                    ? (isHindi ? 'उपस्थिति रिकॉर्ड संपादित करें' : 'Edit Attendance Record')
                    : (isHindi ? 'नया उपस्थिति एवं कार्य रिकॉर्ड' : 'Log Daily Attendance & Work')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 rounded-xl text-[var(--theme-text-dim,#94A3B8)] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 overflow-y-auto">
              
              {/* Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                    {isHindi ? 'दिनांक (Date)' : 'Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                    {isHindi ? 'उपस्थिति स्थिति (Status)' : 'Attendance Status'} *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as AttendanceStatus)}
                    className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] font-semibold"
                  >
                    <option value="present">{isHindi ? 'उपस्थित (Full Day)' : 'Present (Full Day)'}</option>
                    <option value="half_day">{isHindi ? 'हाफ डे (Half Day)' : 'Half Day'}</option>
                    <option value="overtime">{isHindi ? 'ओवरटाइम (Overtime)' : 'Overtime'}</option>
                    <option value="leave">{isHindi ? 'अवकाश (On Leave)' : 'On Leave'}</option>
                    <option value="absent">{isHindi ? 'अनुपस्थित (Absent)' : 'Absent'}</option>
                  </select>
                </div>
              </div>

              {/* Work Category Selector (Multi-Category requirement) */}
              <div>
                <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'कार्य श्रेणी चुनें (Work Category)' : 'Select Work Category'} *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {WORK_CATEGORIES_CATALOG.map((cat) => {
                    const isSelected = formWorkCategory === cat.id;
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormWorkCategory(cat.id);
                          triggerHapticSound('click');
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? `${cat.badgeBg} ${cat.color} ${cat.borderColor} shadow-xs scale-98`
                            : 'bg-[var(--theme-surface,#0E1A29)]/60 text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)]/50 hover:bg-[var(--theme-surface,#0E1A29)]'
                        }`}
                      >
                        <CatIcon className="w-4 h-4" />
                        <span className="truncate w-full text-center">{isHindi ? cat.nameHi : cat.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Employer / Client Name with Quick Chips */}
              <div>
                <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'नियोक्ता / कंपनी / क्लाइंट का नाम' : 'Employer / Company / Client Name'}
                </label>
                <input
                  type="text"
                  value={formEmployerName}
                  onChange={(e) => setFormEmployerName(e.target.value)}
                  placeholder={isHindi ? 'उदा. रमेश ठेकेदार, एपेक्स टेक, शर्मा जी दुकान...' : 'e.g. ABC Construction, Apex Tech, Shop...'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                />
                {/* Suggestions */}
                {existingEmployers.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">{isHindi ? 'हाल ही के:' : 'Recent:'}</span>
                    {existingEmployers.slice(0, 5).map((emp) => (
                      <button
                        key={emp}
                        type="button"
                        onClick={() => {
                          setFormEmployerName(emp);
                          triggerHapticSound('click');
                        }}
                        className="text-[10.5px] px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)] cursor-pointer"
                      >
                        {emp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Duty Timings & Overtime */}
              {formStatus !== 'absent' && formStatus !== 'leave' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)]/60 border border-[var(--theme-border,#213E61)]/50">
                  <div>
                    <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'शुरू समय (In Time)' : 'Check-In Time'}
                    </label>
                    <NativeTimePicker
                      value={formStartTime}
                      onChange={setFormStartTime}
                      className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-2 py-2 rounded-lg border border-[var(--theme-border,#213E61)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'समाप्ति समय (Out Time)' : 'Check-Out Time'}
                    </label>
                    <NativeTimePicker
                      value={formEndTime}
                      onChange={setFormEndTime}
                      className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-2 py-2 rounded-lg border border-[var(--theme-border,#213E61)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'ओवरटाइम घंटे (OT Hours)' : 'Overtime Hours'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={formOvertimeHours}
                      onChange={(e) => setFormOvertimeHours(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2 rounded-lg border border-[var(--theme-border,#213E61)]"
                    />
                  </div>
                </div>
              )}

              {/* Wage & Payment Tracking */}
              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/60 border border-[var(--theme-border,#213E61)]/50 space-y-3">
                <div className="text-[12px] font-extrabold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider">
                  {isHindi ? 'वेतन व भुगतान हिसाब (Wage & Payment)' : 'Wage & Payment Details'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'दैनिक दर / वेतन' : 'Daily Wage / Salary Rate'}
                    </label>
                    <input
                      type="number"
                      value={formSalaryOrRate}
                      onChange={(e) => setFormSalaryOrRate(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] font-mono text-[13px] px-3 py-2 rounded-lg border border-[var(--theme-border,#213E61)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'आज प्राप्त भुगतान' : 'Payment Received Today'}
                    </label>
                    <input
                      type="number"
                      value={formPaymentReceived}
                      onChange={(e) => setFormPaymentReceived(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] font-mono text-[13px] px-3 py-2 rounded-lg border border-[var(--theme-border,#213E61)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'भुगतान स्थिति' : 'Payment Status'}
                    </label>
                    <select
                      value={formPaymentStatus}
                      onChange={(e) => setFormPaymentStatus(e.target.value as PaymentStatusType)}
                      className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-lg border border-[var(--theme-border,#213E61)] font-semibold"
                    >
                      <option value="pending">{isHindi ? 'बाकी (Pending)' : 'Pending'}</option>
                      <option value="paid">{isHindi ? 'पूर्ण प्राप्त (Paid)' : 'Paid'}</option>
                      <option value="partial">{isHindi ? 'आंशिक (Partial)' : 'Partial'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'कार्य का विवरण या नोट' : 'Work Description or Notes'}
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={isHindi ? 'आज के कार्य, प्रोजेक्ट या भुगतान से संबंधित कोई टिप्पणी...' : 'Any details about the shift, work done, or remarks...'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--theme-border,#213E61)]">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] text-[12.5px] font-bold cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[13px] flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLog ? (isHindi ? 'अपडेट करें' : 'Save Changes') : (isHindi ? 'रिकॉर्ड सहेजें' : 'Save Record')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Payment Settlement Modal */}
      <BulkPaymentSettlementModal
        isOpen={isBulkPayModalOpen}
        onClose={() => setIsBulkPayModalOpen(false)}
        attendanceLogs={attendanceLogs}
        initialEmployer={bulkPayInitialEmployer}
        employerSummaries={employerSummaries}
        onBatchUpdateAttendanceLogs={onBatchUpdateAttendanceLogs}
        onRecordBulkAttendancePaymentToKhata={onRecordBulkAttendancePaymentToKhata}
        isHindi={isHindi}
        privacyMask={privacyMask}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title={isHindi ? 'रिकॉर्ड हटाएं?' : 'Delete Record?'}
          message={isHindi ? 'क्या आप इस उपस्थिति रिकॉर्ड को हटाकर रीसायकल बिन में भेजना चाहते हैं?' : 'Are you sure you want to move this attendance record to the Recycle Bin?'}
          confirmText={isHindi ? 'हटाएं' : 'Delete'}
          cancelText={isHindi ? 'रद्द करें' : 'Cancel'}
          onConfirm={() => {
            onDeleteAttendanceLog(deleteConfirmId);
            setDeleteConfirmId(null);
          }}
          onCancel={() => setDeleteConfirmId(null)}
          isDanger={true}
        />
      )}
    </div>
  );
};
