import React, { useState, useMemo } from 'react';
import { AttendanceLog, AttendanceStatus, PaymentStatusType, AppLanguage, PaymentMode, FundType, AdvanceItem } from '../types';
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
  PieChart,
  MapPin,
  ListPlus
} from 'lucide-react';
import { NativeTimePicker } from './NativeTimePicker';
import { ConfirmModal } from './ConfirmModal';
import { 
  WORK_CATEGORIES_CATALOG, 
  getWorkCategoryMeta, 
  EmployerSummary,
  ADVANCE_REASONS_CATALOG,
  getAdvanceReasonLabel
} from './attendance/attendanceTypes';
import { BulkPaymentSettlementModal } from './attendance/BulkPaymentSettlementModal';
import { EmployerAccountsView } from './attendance/EmployerAccountsView';
import { AttendancePrintModal } from './attendance/AttendancePrintModal';
import { DailyAttendanceDetailsModal } from './attendance/DailyAttendanceDetailsModal';
import { AdsterraResponsiveLeaderboard } from './AdUnits';
import { escapeHtml } from '../utils/security';
import { getLocalDateString, formatTime12h } from '../utils/dateUtils';

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
  const todayStr = getLocalDateString();
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
  const [isPrintFilterModalOpen, setIsPrintFilterModalOpen] = useState(false);

  // Daily Detailed Inspector Modal
  const [isDailyDetailsModalOpen, setIsDailyDetailsModalOpen] = useState(false);
  const [dailyDetailsDate, setDailyDetailsDate] = useState<string>(todayStr);

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

  // Multiple Advances in Add / Edit Modal
  const [formAdvances, setFormAdvances] = useState<AdvanceItem[]>([]);
  const [inlineAdvAmount, setInlineAdvAmount] = useState<string>('');
  const [inlineAdvReason, setInlineAdvReason] = useState<string>('chai_nashta');
  const [inlineAdvCustomReason, setInlineAdvCustomReason] = useState<string>('');
  const [inlineAdvMode, setInlineAdvMode] = useState<PaymentMode>('cash');
  const [isAddingAdvanceInline, setIsAddingAdvanceInline] = useState<boolean>(false);

  // Quick Advance Modal State with reason
  const [quickAdvanceLog, setQuickAdvanceLog] = useState<AttendanceLog | null>(null);
  const [quickAdvanceAmount, setQuickAdvanceAmount] = useState<string>('');
  const [quickAdvanceReason, setQuickAdvanceReason] = useState<string>('chai_nashta');
  const [quickAdvanceCustomReason, setQuickAdvanceCustomReason] = useState<string>('');
  const [quickAdvanceNote, setQuickAdvanceNote] = useState<string>('');
  const [quickAdvanceMode, setQuickAdvanceMode] = useState<PaymentMode>('cash');
  const [quickAdvanceActionType, setQuickAdvanceActionType] = useState<'add' | 'replace'>('add');

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

  // Extract all distinct location/area names
  const existingLocations = useMemo(() => {
    const set = new Set<string>();
    attendanceLogs.forEach((l) => {
      if (l.workAddress && l.workAddress.trim()) {
        set.add(l.workAddress.trim());
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
      totalAdvance: number;
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
        totalAdvance: 0,
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
      const adv = l.advanceReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec - adv);

      current.totalEarned += rate;
      current.totalReceived += rec;
      current.totalAdvance += adv;
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
        totalAdvance: data.totalAdvance,
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
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, (l.salaryOrRate || 0) - (l.paymentReceived || 0) - (l.advanceReceived || 0));
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

  // Add inline advance to formAdvances list
  const handleAddAdvanceInline = () => {
    const amt = parseFloat(inlineAdvAmount) || 0;
    if (amt <= 0) return;
    triggerHapticSound('click');

    const chosenReason = inlineAdvCustomReason.trim() || inlineAdvReason;
    const finalReason = getAdvanceReasonLabel(chosenReason, isHindi);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newItem: AdvanceItem = {
      id: `adv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount: amt,
      reason: finalReason,
      paymentMode: inlineAdvMode,
      time: nowTime,
      date: formDate
    };

    const nextAdvances = [...formAdvances, newItem];
    setFormAdvances(nextAdvances);

    // Sync total advance and recompute pending
    const totalAdv = nextAdvances.reduce((sum, a) => sum + a.amount, 0);
    setFormAdvanceReceived(String(totalAdv));
    const r = parseFloat(formSalaryOrRate) || 0;
    const rec = parseFloat(formPaymentReceived) || 0;
    setFormPendingPayment(String(Math.max(0, r - rec - totalAdv)));

    // Reset inline input fields
    setInlineAdvAmount('');
    setInlineAdvCustomReason('');
    setIsAddingAdvanceInline(false);
  };

  // Remove advance item from formAdvances list
  const handleRemoveAdvanceInline = (id: string) => {
    triggerHapticSound('click');
    const nextAdvances = formAdvances.filter((a) => a.id !== id);
    setFormAdvances(nextAdvances);

    const totalAdv = nextAdvances.reduce((sum, a) => sum + a.amount, 0);
    setFormAdvanceReceived(totalAdv > 0 ? String(totalAdv) : '');
    const r = parseFloat(formSalaryOrRate) || 0;
    const rec = parseFloat(formPaymentReceived) || 0;
    setFormPendingPayment(String(Math.max(0, r - rec - totalAdv)));
  };

  // Open modal for new log
  const handleOpenNewModal = (defaultEmployer?: string, defaultDate?: string) => {
    setEditingLog(null);
    setFormDate(defaultDate || todayStr);
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
    setFormAdvances([]);
    setInlineAdvAmount('');
    setInlineAdvReason('chai_nashta');
    setInlineAdvCustomReason('');
    setIsAddingAdvanceInline(false);
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
    
    // Normalize existing advances
    let advs: AdvanceItem[] = [];
    if (log.advances && log.advances.length > 0) {
      advs = [...log.advances];
    } else if (log.advanceReceived && log.advanceReceived > 0) {
      advs = [{
        id: 'adv-legacy-1',
        amount: log.advanceReceived,
        reason: log.advanceReason || (isHindi ? 'सामान्य पेशगी' : 'General Advance'),
        paymentMode: 'cash',
        date: log.date
      }];
    }
    setFormAdvances(advs);
    const sumAdv = advs.reduce((s, a) => s + (a.amount || 0), 0);
    setFormAdvanceReceived(sumAdv > 0 ? String(sumAdv) : (log.advanceReceived ? String(log.advanceReceived) : ''));
    
    setInlineAdvAmount('');
    setInlineAdvCustomReason('');
    setIsAddingAdvanceInline(false);

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
    
    // Calculate total advance from advances list or direct input
    const advancesSum = formAdvances.reduce((sum, a) => sum + (a.amount || 0), 0);
    const directAdv = parseFloat(formAdvanceReceived) || 0;
    const finalAdvance = advancesSum > 0 ? advancesSum : directAdv;

    // Advance reasons summary
    const advanceReasonSummary = formAdvances.length > 0
      ? formAdvances.map(a => `${a.amount ? `₹${a.amount} ` : ''}${a.reason || 'Adv'}`).join(', ')
      : (finalAdvance > 0 ? (isHindi ? 'सामान्य पेशगी' : 'General Advance') : undefined);

    // Auto calculate pending based on rate, received and advance
    const autoPending = Math.max(0, rate - received - finalAdvance);
    const customPending = parseFloat(formPendingPayment);
    const calculatedPending = !isNaN(customPending) && formPendingPayment.trim() !== '' 
      ? customPending 
      : autoPending;

    // Auto determine paymentStatus if rate is set
    let determinedStatus: PaymentStatusType = formPaymentStatus;
    if (rate > 0) {
      if (calculatedPending <= 0 && (received > 0 || finalAdvance > 0)) {
        determinedStatus = 'paid';
      } else if (received > 0 || finalAdvance > 0) {
        determinedStatus = 'partial';
      } else {
        determinedStatus = 'pending';
      }
    }

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
        advanceReceived: finalAdvance > 0 ? finalAdvance : 0,
        advanceReason: advanceReasonSummary,
        advances: formAdvances.length > 0 ? formAdvances : (finalAdvance > 0 ? [{
          id: 'adv-single-1',
          amount: finalAdvance,
          reason: isHindi ? 'सामान्य पेशगी' : 'General Advance',
          paymentMode: 'cash',
          date: formDate
        }] : undefined),
        pendingPayment: calculatedPending > 0 ? calculatedPending : 0,
        paymentStatus: determinedStatus,
        paymentDate: formPaymentDate || undefined,
        notes: formNotes.trim() || undefined
      },
      editingLog?.id
    );

    setIsLogModalOpen(false);
  };

  // Quick Advance handlers
  const handleOpenQuickAdvance = (log: AttendanceLog) => {
    setQuickAdvanceLog(log);
    setQuickAdvanceAmount('');
    setQuickAdvanceReason('chai_nashta');
    setQuickAdvanceCustomReason('');
    setQuickAdvanceNote('');
    setQuickAdvanceMode('cash');
    setQuickAdvanceActionType('add');
    triggerHapticSound('click');
  };

  const handleSaveQuickAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAdvanceLog) return;
    triggerHapticSound('save');

    const enteredAmount = Math.max(0, parseFloat(quickAdvanceAmount) || 0);
    if (enteredAmount <= 0) {
      setQuickAdvanceLog(null);
      return;
    }

    const chosenReason = quickAdvanceCustomReason.trim() || quickAdvanceReason;
    const finalReasonLabel = getAdvanceReasonLabel(chosenReason, isHindi);
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Existing advances list
    const existingAdvances: AdvanceItem[] = quickAdvanceLog.advances && quickAdvanceLog.advances.length > 0
      ? [...quickAdvanceLog.advances]
      : (quickAdvanceLog.advanceReceived && quickAdvanceLog.advanceReceived > 0
          ? [{
              id: 'adv-exist-1',
              amount: quickAdvanceLog.advanceReceived,
              reason: quickAdvanceLog.advanceReason || (isHindi ? 'पिछला एडवांस' : 'Previous Advance'),
              paymentMode: 'cash',
              date: quickAdvanceLog.date
            }]
          : []);

    // Create new advance record
    const newAdvItem: AdvanceItem = {
      id: `adv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount: enteredAmount,
      reason: finalReasonLabel,
      paymentMode: quickAdvanceMode,
      time: nowTimeStr,
      date: quickAdvanceLog.date,
      notes: quickAdvanceNote.trim() || undefined
    };

    let updatedAdvances: AdvanceItem[];
    if (quickAdvanceActionType === 'replace') {
      updatedAdvances = [newAdvItem];
    } else {
      updatedAdvances = [...existingAdvances, newAdvItem];
    }

    const newTotalAdvance = updatedAdvances.reduce((sum, a) => sum + (a.amount || 0), 0);
    const rate = quickAdvanceLog.salaryOrRate || 0;
    const received = quickAdvanceLog.paymentReceived || 0;
    const newPending = Math.max(0, rate - received - newTotalAdvance);

    let newStatus: PaymentStatusType = quickAdvanceLog.paymentStatus;
    if (rate > 0) {
      if (newPending <= 0 && (received > 0 || newTotalAdvance > 0)) {
        newStatus = 'paid';
      } else if (received > 0 || newTotalAdvance > 0) {
        newStatus = 'partial';
      } else {
        newStatus = 'pending';
      }
    }

    const modeLabel = quickAdvanceMode === 'upi' ? 'UPI' : quickAdvanceMode === 'bank' ? (isHindi ? 'बैंक' : 'Bank') : (isHindi ? 'नकद' : 'Cash');
    const noteLine = `${isHindi ? 'एडवांस' : 'Adv'}: ₹${enteredAmount} [${finalReasonLabel}] (${modeLabel})${quickAdvanceNote.trim() ? ` - ${quickAdvanceNote.trim()}` : ''}`;
    const updatedNotes = quickAdvanceLog.notes
      ? `${quickAdvanceLog.notes} • ${noteLine}`
      : noteLine;

    const allReasonsSummary = updatedAdvances.map(a => a.reason || 'Adv').join(', ');

    onSaveAttendanceLog(
      {
        ...quickAdvanceLog,
        advanceReceived: newTotalAdvance,
        advanceReason: allReasonsSummary,
        advances: updatedAdvances,
        pendingPayment: newPending,
        paymentStatus: newStatus,
        notes: updatedNotes
      },
      quickAdvanceLog.id
    );

    setQuickAdvanceLog(null);
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
          <div class="title">${escapeHtml(formatMonthTitle(selectedMonth))}</div>
        </div>

        <div class="stats-box">
          <div class="stat-item"><div class="stat-label">Full Days</div><div class="stat-val">${stats.presentDays}</div></div>
          <div class="stat-item"><div class="stat-label">Half Days</div><div class="stat-val">${stats.halfDays}</div></div>
          <div class="stat-item"><div class="stat-label">Total Hours</div><div class="stat-val">${stats.totalWorkingHours}h</div></div>
          <div class="stat-item"><div class="stat-label">Advance (पेशगी)</div><div class="stat-val" style="color: #D97706;">${formatCurrency(stats.totalAdvance)}</div></div>
          <div class="stat-item"><div class="stat-label">Total Earned</div><div class="stat-val">${formatCurrency(stats.totalEarnings)}</div></div>
          <div class="stat-item"><div class="stat-label">Pending Dues</div><div class="stat-val" style="color: #0284C7;">${formatCurrency(stats.totalPending)}</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Duty Hours (12H)</th>
              <th>Location / Area</th>
              <th>OT</th>
              <th>Employer / Client</th>
              <th>Category</th>
              <th>Rate</th>
              <th>Advance</th>
              <th>Received</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            ${monthLogs.map((l) => `
              <tr>
                <td><strong>${escapeHtml(l.date)}</strong></td>
                <td>${escapeHtml(l.status.toUpperCase())}</td>
                <td>${l.startTime && l.endTime ? `${escapeHtml(formatTime12h(l.startTime))} - ${escapeHtml(formatTime12h(l.endTime))}` : '-'}</td>
                <td>${escapeHtml(l.workAddress || '-')}</td>
                <td>${l.overtimeHours ? `${l.overtimeHours}h` : '-'}</td>
                <td>${escapeHtml(l.employerName || '-')}</td>
                <td>${escapeHtml(l.workCategory || l.workType || '-')}</td>
                <td>${l.salaryOrRate ? formatCurrency(l.salaryOrRate) : '-'}</td>
                <td style="color: ${(l.advanceReceived || 0) > 0 ? '#D97706' : '#64748B'};">${l.advanceReceived ? formatCurrency(l.advanceReceived) : '-'}</td>
                <td>${l.paymentReceived ? formatCurrency(l.paymentReceived) : '-'}</td>
                <td style="color: ${(l.pendingPayment || 0) > 0 ? '#0284C7' : '#15803D'}; font-weight: bold;">${l.pendingPayment ? formatCurrency(l.pendingPayment) : 'PAID'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">Generated By Daily Khata Pro <span style="float:right;">www.rozfiber.com</span></div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-xl">
        <div className="flex items-start gap-2.5 sm:items-center sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[18px] sm:text-[22px] font-extrabold text-[var(--theme-text,#F8FAFC)] flex items-start gap-2 leading-tight">
              <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--theme-primary,#38BDF8)] shrink-0 mt-0.5" />
              <span>{isHindi ? 'दैनिक उपस्थिति एवं कार्य रजिस्टर' : 'Attendance & Work Tracker'}</span>
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi
                ? 'मल्टीपल काम, अलग-अलग कंपनी व ठेकेदारों का हिसाब और 1-क्लिक बल्क पेमेंट निपटान'
                : 'Multi-category attendance, multiple employer dues, and 1-click bulk wage settlements.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto flex-wrap">
          {/* Daily Details Inspector Button */}
          <button
            type="button"
            onClick={() => {
              setDailyDetailsDate(todayStr);
              setIsDailyDetailsModalOpen(true);
              triggerHapticSound('click');
            }}
            className="justify-center px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] xs:text-[12px] sm:text-[12.5px] flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all truncate"
            title="Today's & Daily Detailed Attendance Inspector"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-purple-200" />
            <span className="truncate">{isHindi ? 'आज का विवरण' : 'Daily Details'}</span>
          </button>

          {/* Quick Bulk Settlement Button */}
          <button
            type="button"
            onClick={() => handleOpenBulkSettlement('all')}
            className="justify-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] xs:text-[12px] sm:text-[12.5px] flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all truncate"
            title="Settle Lump-sum / Pending Dues in One Click"
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{isHindi ? 'बल्क निपटान' : 'Settle Dues'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPrintFilterModalOpen(true)}
            className="justify-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[11px] xs:text-[12px] font-bold flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all truncate"
            title="Print Attendance Slip & Filtered Reports"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
            <span className="truncate">{isHindi ? 'प्रिंट रिपोर्ट' : 'Print Slip'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenNewModal()}
            className="justify-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[11px] xs:text-[12px] sm:text-[13px] flex items-center gap-1 sm:gap-1.5 cursor-pointer hover:opacity-95 shadow-md active:scale-95 truncate"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{isHindi ? 'नया रिकॉर्ड' : 'Log Entry'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs: Register | Employer Accounts | Analytics */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl min-w-0">
        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            triggerHapticSound('click');
          }}
          className={`min-w-0 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[10.5px] xs:text-[11.5px] sm:text-[13px] font-bold flex items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all ${
            activeTab === 'register'
              ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-md font-extrabold'
              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)]'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">{isHindi ? 'दैनिक रजिस्टर' : 'Daily Register'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('employers');
            triggerHapticSound('click');
          }}
          className={`min-w-0 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[10.5px] xs:text-[11.5px] sm:text-[13px] font-bold flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all ${
            activeTab === 'employers'
              ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-md font-extrabold'
              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)]'
          }`}
        >
          <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">{isHindi ? 'कंपनी खाते' : 'Accounts'}</span>
          {globalTotalPending > 0 && (
            <span className="shrink-0 text-[9px] xs:text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 leading-none">
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
          className={`min-w-0 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[10.5px] xs:text-[11.5px] sm:text-[13px] font-bold flex items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all ${
            activeTab === 'summary'
              ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 shadow-md font-extrabold'
              : 'text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)]'
          }`}
        >
          <PieChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">{isHindi ? 'एनालिटिक्स' : 'Analytics'}</span>
        </button>
      </div>

      {/* TAB 1: DAILY REGISTER VIEW */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          
          {/* Quick Mark Today Banner */}
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'आज की उपस्थिति दर्ज करें (Today):' : "Today's Attendance Status:"}
                </span>
                <span className="shrink-0 whitespace-nowrap text-[12px] font-mono text-[var(--theme-primary,#38BDF8)] font-bold">
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
                className={`min-w-0 py-2.5 px-2 sm:px-3 rounded-xl border text-[12px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'present'
                    ? 'bg-[#10B981] text-[#04140D] border-[#10B981] shadow-md'
                    : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="min-w-0 text-center leading-tight">{isHindi ? 'उपस्थित (Full Day)' : 'Present (Full Day)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickMarkToday('half_day')}
                className={`min-w-0 py-2.5 px-2 sm:px-3 rounded-xl border text-[12px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'half_day'
                    ? 'bg-[#F59E0B] text-[#070E18] border-[#F59E0B] shadow-md'
                    : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/20'
                }`}
              >
                <Clock3 className="w-4 h-4 shrink-0" />
                <span className="min-w-0 text-center leading-tight">{isHindi ? 'हाफ डे (Half Day)' : 'Half Day'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickMarkToday('overtime')}
                className={`min-w-0 py-2.5 px-2 sm:px-3 rounded-xl border text-[12px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'overtime'
                    ? 'bg-[#A855F7] text-white border-[#A855F7] shadow-md'
                    : 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/30 hover:bg-[#A855F7]/20'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="min-w-0 text-center leading-tight">{isHindi ? 'ओवरटाइम (OT)' : 'Overtime'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickMarkToday('absent')}
                className={`min-w-0 py-2.5 px-2 sm:px-3 rounded-xl border text-[12px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95 ${
                  todayLog?.status === 'absent'
                    ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-md'
                    : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/20'
                }`}
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span className="min-w-0 text-center leading-tight">{isHindi ? 'अनुपस्थित (Absent)' : 'Absent / Off'}</span>
              </button>
            </div>
          </div>

          {/* Month Navigator & KPI Cards */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0 text-[14px] sm:text-[17px] font-bold text-[var(--theme-text,#F8FAFC)] px-1 sm:px-2 text-center truncate">
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

            {/* 7 KPI Cards (including Advance) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-[#10B981] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'पूर्ण दिन' : 'Full Days'}</span>
                </div>
                <div className="text-[17px] sm:text-[19px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-1">
                  {stats.presentDays}
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-[#F59E0B] flex items-center justify-center gap-1">
                  <Clock3 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'हाफ डे' : 'Half Days'}</span>
                </div>
                <div className="text-[17px] sm:text-[19px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-1">
                  {stats.halfDays}
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-[#A855F7] flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'ओवरटाइम' : 'OT Hours'}</span>
                </div>
                <div className="text-[17px] sm:text-[19px] font-mono font-extrabold text-[var(--theme-text,#F8FAFC)] mt-1">
                  {stats.totalOvertimeHours}h
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कुल कमाई' : 'Total Earned'}</span>
                </div>
                <div className="text-[14.5px] sm:text-[16px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] mt-1 truncate">
                  {formatCurrency(stats.totalEarnings, privacyMask)}
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-amber-500/30 bg-amber-500/5 shadow-xs text-center">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-amber-500 flex items-center justify-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कुल एडवांस' : 'Total Advance'}</span>
                </div>
                <div className="text-[14.5px] sm:text-[16px] font-mono font-extrabold text-amber-500 mt-1 truncate">
                  {formatCurrency(stats.totalAdvance, privacyMask)}
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs text-center">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-[#10B981] flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्राप्त' : 'Received'}</span>
                </div>
                <div className="text-[14.5px] sm:text-[16px] font-mono font-extrabold text-[#10B981] mt-1 truncate">
                  {formatCurrency(stats.totalReceived, privacyMask)}
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-amber-500/40 shadow-xs text-center col-span-2 sm:col-span-1">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'बाकी राशि' : 'Pending'}</span>
                </div>
                <div className="text-[14.5px] sm:text-[16px] font-mono font-extrabold text-amber-400 mt-1 truncate">
                  {formatCurrency(stats.totalPending, privacyMask)}
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter Toolbar with Work Category & Employer filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3 sm:p-4">
            
            {/* Search */}
            <div className="relative w-full sm:flex-1 min-w-0 sm:min-w-[180px] max-w-none sm:max-w-xs">
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
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto min-w-0 truncate bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
              >
                <option value="all">{isHindi ? 'सभी श्रेणियां' : 'All Categories'}</option>
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
                  className="w-full sm:w-auto min-w-0 truncate bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
                >
                  <option value="all">{isHindi ? 'सभी नियोक्ता' : 'All Employers'}</option>
                  {existingEmployers.map((emp) => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              )}

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto min-w-0 truncate bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
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
                className="w-full sm:w-auto min-w-0 truncate bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] font-semibold cursor-pointer outline-hidden"
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
                const adv = log.advanceReceived || 0;
                const pend = log.pendingPayment !== undefined ? log.pendingPayment : Math.max(0, rate - rec - adv);

                return (
                  <div
                    key={log.id}
                    className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Left: Date, Status, Employer & Category */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setDailyDetailsDate(log.date);
                            setIsDailyDetailsModalOpen(true);
                            triggerHapticSound('click');
                          }}
                          className="font-mono font-extrabold text-[14.5px] text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 cursor-pointer transition-colors group"
                          title={isHindi ? 'इस दिन का सम्पूर्ण विवरण देखें' : "Inspect this day's details"}
                        >
                          <Calendar className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] opacity-70 group-hover:opacity-100" />
                          <span className="underline decoration-dotted decoration-[var(--theme-border,#213E61)] group-hover:decoration-[var(--theme-primary,#38BDF8)]">{dayLabel}</span>
                        </button>

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

                        {adv > 0 && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 flex-wrap">
                            <Coins className="w-3 h-3" />
                            <span>{isHindi ? 'एडवांस' : 'Adv'}: {formatCurrency(adv, privacyMask)}</span>
                            {log.advanceReason && (
                              <span className="text-amber-300 font-normal max-w-[160px] truncate">({log.advanceReason})</span>
                            )}
                            {log.advances && log.advances.length > 1 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-[9px] font-black">
                                {log.advances.length} {isHindi ? 'किस्त' : 'items'}
                              </span>
                            )}
                          </span>
                        )}

                        {rate > 0 ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${payBadge.color}`}>
                            {payBadge.label}
                          </span>
                        ) : null}
                      </div>

                      {/* Timings, Employer and Location Details */}
                      <div className="flex items-center gap-3 text-[12px] text-[var(--theme-text-muted,#94A3B8)] flex-wrap min-w-0">
                        {log.startTime && log.endTime ? (
                          <div className="flex items-center gap-1 font-mono text-[11.5px] text-[var(--theme-text,#F8FAFC)] bg-[var(--theme-surface,#0E1A29)]/80 px-2 py-0.5 rounded-md border border-[var(--theme-border,#213E61)]/40">
                            <Clock className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                            <span>{formatTime12h(log.startTime)} - {formatTime12h(log.endTime)} ({log.workingHours || 0}h)</span>
                          </div>
                        ) : null}

                        {log.employerName ? (
                          <div className="flex items-center gap-1 text-[var(--theme-text,#F8FAFC)] font-semibold">
                            <Building className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span className="min-w-0 break-words">{log.employerName}</span>
                          </div>
                        ) : null}

                        {log.workAddress ? (
                          <div className="flex items-center gap-1 text-rose-300 font-medium bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="min-w-0 break-words">{log.workAddress}</span>
                          </div>
                        ) : null}
                      </div>

                      {log.jobDescription || log.notes ? (
                        <div className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-surface,#0E1A29)]/60 px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)]/40 max-w-xl break-words overflow-hidden">
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
                          {adv > 0 && (
                            <div className="text-[10.5px] font-mono text-amber-500 font-bold">
                              {isHindi ? 'एडवांस:' : 'Adv:'} {formatCurrency(adv, privacyMask)}
                            </div>
                          )}
                          {pend > 0 ? (
                            <div className="text-[10.5px] font-mono text-amber-400 font-bold">
                              {isHindi ? 'बाकी:' : 'Due:'} {formatCurrency(pend, privacyMask)}
                            </div>
                          ) : (
                            <div className="text-[10.5px] font-mono text-[#10B981]">
                              ✓ {isHindi ? 'पूर्ण चुकता' : 'Paid'}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <div className="flex items-center gap-1">
                        {/* Quick Update Advance Payment */}
                        <button
                          type="button"
                          onClick={() => handleOpenQuickAdvance(log)}
                          className="p-2 rounded-xl bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-colors cursor-pointer"
                          title={isHindi ? 'एडवांस / पेशगी अपडेट करें' : 'Update Advance Payment'}
                        >
                          <Coins className="w-4 h-4" />
                        </button>

                        {/* Quick Settle for this single log if pending */}
                        {pend > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenBulkSettlement(log.employerName || 'all')}
                            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-amber-400 hover:bg-amber-500/15 border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                            title={isHindi ? 'बल्क भुगतान में शामिल करें' : 'Settle in Bulk Payment'}
                          >
                            <CalendarCheck className="w-4 h-4" />
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

      {/* Sponsored Partner Responsive Leaderboard (728x90 Desktop / 468x60 Tablet / 320x50 Mobile) */}
      <AdsterraResponsiveLeaderboard className="mt-6" />

      {/* Add / Edit Attendance Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
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

              {/* Location / Area / Site Selection & Entry */}
              <div>
                <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isHindi ? 'कार्य स्थल / लोकेशन / साइट / एरिया' : 'Work Location / Area / Site'}</span>
                  </span>
                  <span className="text-[10.5px] font-normal text-[var(--theme-text-dim,#94A3B8)]">
                    {isHindi ? '(वैकल्पिक / Optional)' : '(Optional)'}
                  </span>
                </label>
                <input
                  type="text"
                  value={formWorkAddress}
                  onChange={(e) => setFormWorkAddress(e.target.value)}
                  placeholder={isHindi ? 'उदा. साइट नं. 4, मेन मार्केट दुकान, वर्कशॉप शेड, फील्ड...' : 'e.g. Site #4, Main Market Shop, Workshop, Field...'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                />
                {/* Quick Location Preset Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">{isHindi ? 'क्विक चयन:' : 'Quick:'}</span>
                  {[
                    { label: isHindi ? 'साइट' : 'Site', val: isHindi ? 'कार्य साइट (Site)' : 'Site' },
                    { label: isHindi ? 'दुकान' : 'Shop', val: isHindi ? 'दुकान (Shop)' : 'Shop' },
                    { label: isHindi ? 'फैक्ट्री' : 'Factory', val: isHindi ? 'कारखाना (Factory)' : 'Factory' },
                    { label: isHindi ? 'ऑफिस' : 'Office', val: isHindi ? 'कार्यालय (Office)' : 'Office' },
                    { label: isHindi ? 'फील्ड' : 'Field', val: isHindi ? 'फील्ड वर्क (Field)' : 'Field' },
                    { label: isHindi ? 'घर' : 'Home', val: isHindi ? 'घर / घरेलू (Home)' : 'Home' },
                    { label: isHindi ? 'गोदाम' : 'Godown', val: isHindi ? 'गोदाम / वेयरहाउस' : 'Godown' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormWorkAddress(preset.val);
                        triggerHapticSound('click');
                      }}
                      className="text-[10.5px] px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                    >
                      +{preset.label}
                    </button>
                  ))}
                  {/* Recent used locations */}
                  {existingLocations.slice(0, 3).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setFormWorkAddress(loc);
                        triggerHapticSound('click');
                      }}
                      className="text-[10.5px] px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)] cursor-pointer"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'दैनिक दर / वेतन (Rate)' : 'Daily Wage / Rate'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-mono text-[var(--theme-text-dim,#94A3B8)]">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={formSalaryOrRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormSalaryOrRate(val);
                          const r = parseFloat(val) || 0;
                          const rec = parseFloat(formPaymentReceived) || 0;
                          const a = parseFloat(formAdvanceReceived) || 0;
                          setFormPendingPayment(String(Math.max(0, r - rec - a)));
                        }}
                        placeholder="0.00"
                        className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] font-mono text-[13px] pl-7 pr-3 py-2 rounded-lg border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Advance Payment Section with Multiple Advances & Reasons */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11.5px] font-extrabold text-amber-400 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'एडवांस / पेशगी (Multiple Advances & Reasons)' : 'Advance Payments & Reasons'}</span>
                        <span className="text-[10px] text-amber-400/80 font-normal">({isHindi ? 'वेतन से कटौती' : 'Deducted'})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAdvanceInline(!isAddingAdvanceInline);
                          triggerHapticSound('click');
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isHindi ? '+ नया एडवांस जोड़ें' : '+ Add Advance'}</span>
                      </button>
                    </div>

                    {/* List of existing advances */}
                    {formAdvances.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {formAdvances.map((adv, idx) => (
                          <div
                            key={adv.id || idx}
                            className="flex items-center justify-between text-[11.5px] bg-[var(--theme-card,#132438)] px-2.5 py-1.5 rounded-lg border border-amber-500/30"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono font-extrabold text-amber-400">₹{adv.amount}</span>
                              <span className="text-[var(--theme-text,#F8FAFC)] font-medium truncate">
                                {adv.reason || (isHindi ? 'सामान्य पेशगी' : 'General Advance')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {adv.paymentMode && (
                                <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                                  {adv.paymentMode}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveAdvanceInline(adv.id)}
                                className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                                title="Remove Advance"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Advance Adder Form */}
                    {isAddingAdvanceInline && (
                      <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-amber-500/40 space-y-2 animate-in fade-in duration-150">
                        <div className="text-[11px] font-extrabold text-amber-400 flex items-center justify-between">
                          <span>{isHindi ? 'नया एडवांस दर्ज करें:' : 'Enter New Advance Item:'}</span>
                          <button
                            type="button"
                            onClick={() => setIsAddingAdvanceInline(false)}
                            className="text-[10px] text-[var(--theme-text-muted,#94A3B8)] hover:text-white cursor-pointer"
                          >
                            ✕ {isHindi ? 'रद्द' : 'Cancel'}
                          </button>
                        </div>

                        {/* Amount & Mode */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-mono text-amber-400">₹</span>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={inlineAdvAmount}
                              onChange={(e) => setInlineAdvAmount(e.target.value)}
                              placeholder={isHindi ? 'एडवांस रकम...' : 'Advance Amount...'}
                              className="w-full bg-[var(--theme-surface,#0E1A29)] text-amber-300 font-mono text-[13px] pl-7 pr-3 py-1.5 rounded-lg border border-amber-500/40 focus:outline-hidden"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            {(['cash', 'upi', 'bank'] as PaymentMode[]).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setInlineAdvMode(mode)}
                                className={`flex-1 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                                  inlineAdvMode === mode
                                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border-[var(--theme-border,#213E61)]'
                                }`}
                              >
                                {mode === 'cash' ? (isHindi ? 'नकद' : 'Cash') : mode === 'upi' ? 'UPI' : (isHindi ? 'बैंक' : 'Bank')}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Amount presets for inline advance */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {[100, 200, 500, 1000, 2000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                const cur = parseFloat(inlineAdvAmount) || 0;
                                setInlineAdvAmount(String(cur + amt));
                                triggerHapticSound('click');
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-mono font-bold cursor-pointer"
                            >
                              +{amt}
                            </button>
                          ))}
                        </div>

                        {/* Reason Selection Chips */}
                        <div className="space-y-1">
                          <span className="text-[10.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] block">
                            {isHindi ? 'एडवांस का कारण / वजह (Reason):' : 'Advance Reason / Purpose:'}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {ADVANCE_REASONS_CATALOG.slice(0, 8).map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                  setInlineAdvReason(r.id);
                                  setInlineAdvCustomReason('');
                                  triggerHapticSound('click');
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded-md border cursor-pointer transition-all flex items-center gap-1 ${
                                  inlineAdvReason === r.id && !inlineAdvCustomReason
                                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-surface,#0E1A29)]/80'
                                }`}
                              >
                                <span>{r.icon}</span>
                                <span>{isHindi ? r.labelHi : r.labelEn}</span>
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={inlineAdvCustomReason}
                            onChange={(e) => setInlineAdvCustomReason(e.target.value)}
                            placeholder={isHindi ? 'या अन्य कारण लिखें (उदा. डॉक्टर, बस किराया, राशन...)' : 'Or type custom reason (e.g. medicine, fare...)'}
                            className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[11.5px] px-2.5 py-1.5 rounded-lg border border-[var(--theme-border,#213E61)] focus:outline-hidden"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAddAdvanceInline}
                          disabled={!inlineAdvAmount || parseFloat(inlineAdvAmount) <= 0}
                          className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-[12px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'यह एडवांस सूची में जोड़ें' : 'Add This Advance to List'}</span>
                        </button>
                      </div>
                    )}

                    {/* Total Advance Summary & Direct Input if not using multi-line */}
                    <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)]">
                          {isHindi ? 'कुल एडवांस रकम:' : 'Total Advance:'}
                        </span>
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11.5px] font-mono text-amber-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={formAdvanceReceived}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormAdvanceReceived(val);
                              const r = parseFloat(formSalaryOrRate) || 0;
                              const rec = parseFloat(formPaymentReceived) || 0;
                              const a = parseFloat(val) || 0;
                              setFormPendingPayment(String(Math.max(0, r - rec - a)));
                            }}
                            placeholder="0.00"
                            className="w-full bg-[var(--theme-card,#132438)] text-amber-300 font-mono text-[12px] pl-6 pr-2 py-1 rounded-lg border border-amber-500/40 focus:border-amber-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Quick preset chips */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {[100, 200, 500, 1000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              const cur = parseFloat(formAdvanceReceived) || 0;
                              const next = cur + amt;
                              setFormAdvanceReceived(String(next));
                              const r = parseFloat(formSalaryOrRate) || 0;
                              const rec = parseFloat(formPaymentReceived) || 0;
                              setFormPendingPayment(String(Math.max(0, r - rec - next)));
                              triggerHapticSound('click');
                            }}
                            className="text-[9.5px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 cursor-pointer"
                          >
                            +{amt}
                          </button>
                        ))}
                        {parseFloat(formAdvanceReceived) > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormAdvanceReceived('');
                              setFormAdvances([]);
                              const r = parseFloat(formSalaryOrRate) || 0;
                              const rec = parseFloat(formPaymentReceived) || 0;
                              setFormPendingPayment(String(Math.max(0, r - rec)));
                              triggerHapticSound('click');
                            }}
                            className="text-[9.5px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                          >
                            {isHindi ? 'साफ' : 'Reset'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                      {isHindi ? 'आज प्राप्त भुगतान' : 'Payment Received'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-mono text-[#10B981]">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={formPaymentReceived}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormPaymentReceived(val);
                          const r = parseFloat(formSalaryOrRate) || 0;
                          const rec = parseFloat(val) || 0;
                          const a = parseFloat(formAdvanceReceived) || 0;
                          setFormPendingPayment(String(Math.max(0, r - rec - a)));
                        }}
                        placeholder="0.00"
                        className="w-full bg-[var(--theme-card,#132438)] text-[#10B981] font-mono text-[13px] pl-7 pr-3 py-2 rounded-lg border border-[var(--theme-border,#213E61)] focus:border-[#10B981] focus:outline-hidden"
                      />
                    </div>
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
                      <option value="paid">{isHindi ? 'पूर्ण चुकता (Paid)' : 'Paid'}</option>
                      <option value="partial">{isHindi ? 'आंशिक (Partial)' : 'Partial'}</option>
                    </select>
                  </div>
                </div>

                {/* Live Real-time Calculation Breakdown Bar */}
                {parseFloat(formSalaryOrRate) > 0 && (
                  <div className="p-2.5 rounded-lg bg-[var(--theme-card,#132438)]/80 border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2 flex-wrap text-[11.5px] font-mono">
                    <div className="flex items-center gap-2 flex-wrap text-[var(--theme-text-muted,#94A3B8)]">
                      <span>{isHindi ? 'दर' : 'Rate'}: <strong className="text-[var(--theme-text,#F8FAFC)]">₹{parseFloat(formSalaryOrRate) || 0}</strong></span>
                      {parseFloat(formAdvanceReceived) > 0 && (
                        <span>- {isHindi ? 'एडवांस' : 'Adv'}: <strong className="text-amber-400">₹{parseFloat(formAdvanceReceived)}</strong></span>
                      )}
                      {parseFloat(formPaymentReceived) > 0 && (
                        <span>- {isHindi ? 'प्राप्त' : 'Rec'}: <strong className="text-[#10B981]">₹{parseFloat(formPaymentReceived)}</strong></span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-[var(--theme-text-muted,#94A3B8)]">{isHindi ? '= शेष बाकी:' : '= Net Due:'}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        Math.max(0, (parseFloat(formSalaryOrRate) || 0) - (parseFloat(formPaymentReceived) || 0) - (parseFloat(formAdvanceReceived) || 0)) > 0
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        ₹{Math.max(0, (parseFloat(formSalaryOrRate) || 0) - (parseFloat(formPaymentReceived) || 0) - (parseFloat(formAdvanceReceived) || 0))}
                      </span>
                    </div>
                  </div>
                )}
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
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-[var(--theme-border,#213E61)]">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] text-[12.5px] font-bold cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto justify-center px-5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[13px] flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
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

      {/* Attendance History Print / Export Filter Modal */}
      <AttendancePrintModal
        isOpen={isPrintFilterModalOpen}
        onClose={() => setIsPrintFilterModalOpen(false)}
        logs={attendanceLogs}
        existingEmployers={existingEmployers}
        language={language}
        privacyMask={privacyMask}
        formatCurrency={formatCurrency}
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

      {/* Dedicated Quick Advance Modal */}
      {quickAdvanceLog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                    {isHindi ? 'एडवांस / पेशगी भुगतान' : 'Advance Payment Update'}
                  </h3>
                  <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-mono">
                    {quickAdvanceLog.date} {quickAdvanceLog.employerName ? `• ${quickAdvanceLog.employerName}` : ''}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickAdvanceLog(null)}
                className="p-1.5 rounded-xl text-[var(--theme-text-dim,#94A3B8)] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleSaveQuickAdvance} className="p-5 space-y-4">
              {/* Context Summary */}
              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)]/60 border border-[var(--theme-border,#213E61)]/50 grid grid-cols-2 gap-2 text-center text-[12px] font-mono">
                <div>
                  <span className="text-[10.5px] text-[var(--theme-text-muted,#94A3B8)] block">
                    {isHindi ? 'दैनिक दर / वेतन' : 'Daily Wage'}
                  </span>
                  <span className="font-bold text-[var(--theme-text,#F8FAFC)]">
                    {formatCurrency(quickAdvanceLog.salaryOrRate || 0, privacyMask)}
                  </span>
                </div>
                <div>
                  <span className="text-[10.5px] text-[var(--theme-text-muted,#94A3B8)] block">
                    {isHindi ? 'वर्तमान कुल एडवांस' : 'Current Advance'}
                  </span>
                  <span className="font-bold text-amber-400">
                    {formatCurrency(quickAdvanceLog.advanceReceived || 0, privacyMask)}
                  </span>
                </div>
              </div>

              {/* Existing advances if any */}
              {quickAdvanceLog.advances && quickAdvanceLog.advances.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-amber-500/25 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
                    {isHindi ? 'पहले लिए गए एडवांस:' : 'Previously Taken Advances:'}
                  </span>
                  <div className="space-y-1">
                    {quickAdvanceLog.advances.map((a, i) => (
                      <div key={a.id || i} className="flex items-center justify-between text-[11px] text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-surface,#0E1A29)] px-2 py-0.5 rounded">
                        <span className="font-mono font-bold text-amber-300">₹{a.amount}</span>
                        <span className="truncate max-w-[140px]">{a.reason || 'Adv'}</span>
                        <span className="text-[9.5px] uppercase opacity-75">{a.paymentMode || 'cash'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Type Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'एडवांस जोड़ने का तरीका' : 'Action Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAdvanceActionType('add');
                      triggerHapticSound('click');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      quickAdvanceActionType === 'add'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border-[var(--theme-border,#213E61)]'
                    }`}
                  >
                    {isHindi ? '+ नया जोड़ें (Add to Existing)' : '+ Add to Existing'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuickAdvanceActionType('replace');
                      triggerHapticSound('click');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      quickAdvanceActionType === 'replace'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border-[var(--theme-border,#213E61)]'
                    }`}
                  >
                    {isHindi ? 'कुल बदलें (Set Total)' : 'Set Total'}
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-[12px] font-bold text-amber-400 mb-1">
                  {quickAdvanceActionType === 'add' 
                    ? (isHindi ? 'नया एडवांस रकम दर्ज करें' : 'New Advance Amount to Add')
                    : (isHindi ? 'कुल एडवांस रकम दर्ज करें' : 'Set Total Advance Amount')} *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-mono text-amber-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    autoFocus
                    value={quickAdvanceAmount}
                    onChange={(e) => setQuickAdvanceAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[var(--theme-surface,#0E1A29)] text-amber-300 font-mono text-[16px] font-bold pl-8 pr-3 py-2.5 rounded-xl border border-amber-500/40 focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                {/* Quick Add Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[100, 200, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        const cur = parseFloat(quickAdvanceAmount) || 0;
                        setQuickAdvanceAmount(String(cur + amt));
                        triggerHapticSound('click');
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-mono font-bold cursor-pointer active:scale-95"
                    >
                      +{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAdvanceAmount('0');
                      triggerHapticSound('click');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-bold cursor-pointer active:scale-95"
                  >
                    {isHindi ? 'शून्य (0)' : 'Reset 0'}
                  </button>
                </div>
              </div>

              {/* Reason Selection Chips */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)]">
                  {isHindi ? 'एडवांस का कारण / वजह (Reason)' : 'Advance Reason / Purpose'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ADVANCE_REASONS_CATALOG.slice(0, 8).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setQuickAdvanceReason(r.id);
                        setQuickAdvanceCustomReason('');
                        triggerHapticSound('click');
                      }}
                      className={`text-[10.5px] px-2.5 py-1 rounded-lg border cursor-pointer transition-all flex items-center gap-1 ${
                        quickAdvanceReason === r.id && !quickAdvanceCustomReason
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                          : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-surface,#0E1A29)]/80'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span>{isHindi ? r.labelHi : r.labelEn}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={quickAdvanceCustomReason}
                  onChange={(e) => setQuickAdvanceCustomReason(e.target.value)}
                  placeholder={isHindi ? 'या अन्य कारण लिखें (उदा. डॉक्टर खर्च, बस टिकट, राशन...)' : 'Or custom reason (e.g. medicine, grocery, fare...)'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden"
                />
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'भुगतान माध्यम (Mode)' : 'Payment Mode'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash' as PaymentMode, label: isHindi ? 'नकद (Cash)' : 'Cash' },
                    { id: 'upi' as PaymentMode, label: 'UPI / Online' },
                    { id: 'bank' as PaymentMode, label: isHindi ? 'बैंक' : 'Bank' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setQuickAdvanceMode(m.id);
                        triggerHapticSound('click');
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border text-center transition-all cursor-pointer ${
                        quickAdvanceMode === m.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-bold'
                          : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-surface,#0E1A29)]/80'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'अतिरिक्त टिप्पणी (वैकल्पिक)' : 'Optional Note'}
                </label>
                <input
                  type="text"
                  value={quickAdvanceNote}
                  onChange={(e) => setQuickAdvanceNote(e.target.value)}
                  placeholder={isHindi ? 'कोई अतिरिक्त विवरण...' : 'Any extra details...'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                />
              </div>

              {/* Live Preview Box */}
              {quickAdvanceLog.salaryOrRate && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1 text-[11.5px] font-mono">
                  <div className="flex justify-between text-[var(--theme-text-muted,#94A3B8)]">
                    <span>{isHindi ? 'दैनिक वेतन:' : 'Daily Wage:'}</span>
                    <span className="text-[var(--theme-text,#F8FAFC)]">₹{quickAdvanceLog.salaryOrRate || 0}</span>
                  </div>
                  {(quickAdvanceLog.paymentReceived || 0) > 0 && (
                    <div className="flex justify-between text-[var(--theme-text-muted,#94A3B8)]">
                      <span>{isHindi ? 'प्राप्त वेतन:' : 'Received:'}</span>
                      <span className="text-[#10B981]">₹{quickAdvanceLog.paymentReceived}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>{isHindi ? 'नया एडवांस:' : 'New Advance:'}</span>
                    <span>₹{parseFloat(quickAdvanceAmount) || 0}</span>
                  </div>
                  <div className="pt-1 border-t border-amber-500/20 flex justify-between font-bold text-[12px]">
                    <span className="text-[var(--theme-text,#F8FAFC)]">{isHindi ? 'शेष बाकी मजदूरी:' : 'Net Pending Due:'}</span>
                    <span className="text-amber-400">
                      ₹{Math.max(0, (quickAdvanceLog.salaryOrRate || 0) - (quickAdvanceLog.paymentReceived || 0) - (
                        quickAdvanceActionType === 'add'
                          ? ((quickAdvanceLog.advanceReceived || 0) + (parseFloat(quickAdvanceAmount) || 0))
                          : (parseFloat(quickAdvanceAmount) || 0)
                      ))}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--theme-border,#213E61)]">
                <button
                  type="button"
                  onClick={() => setQuickAdvanceLog(null)}
                  className="px-4 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] text-[12.5px] font-bold cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[13px] flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{isHindi ? 'एडवांस सुरक्षित करें' : 'Save Advance'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Detailed Attendance & Multi-Advance Inspector Modal */}
      <DailyAttendanceDetailsModal
        isOpen={isDailyDetailsModalOpen}
        onClose={() => setIsDailyDetailsModalOpen(false)}
        initialDate={dailyDetailsDate}
        attendanceLogs={attendanceLogs}
        onOpenEditModal={(log) => {
          setIsDailyDetailsModalOpen(false);
          handleOpenEditModal(log);
        }}
        onOpenQuickAdvance={(log) => {
          setIsDailyDetailsModalOpen(false);
          handleOpenQuickAdvance(log);
        }}
        onOpenNewModalForDate={(date) => {
          setIsDailyDetailsModalOpen(false);
          handleOpenNewModal(undefined, date);
        }}
        onDeleteAttendanceLog={(id) => {
          setDeleteConfirmId(id);
        }}
        formatCurrency={formatCurrency}
        language={language}
        privacyMask={privacyMask}
      />
    </div>
  );
};
