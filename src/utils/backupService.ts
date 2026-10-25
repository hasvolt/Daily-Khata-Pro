import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  KhataData,
  Entry,
  AttendanceLog,
  PersonalNote,
  DebtItem,
  AppReminder,
  Goal,
  WorkLog,
  DailyLifeLog,
  TrashItem,
  CategoryBudget,
  FundConfig,
  FundType,
  AppTheme,
  AppLanguage,
  AppViewMode,
  AppLayout,
  SecurityLockConfig
} from '../types';
import { getLocalDateString, formatTime12h } from './dateUtils';
import { escapeHtml } from './security';
import { triggerHapticSound, triggerCelebration } from './khataCalculations';

export interface LocalSnapshot {
  id: string;
  name: string;
  createdAt: string;
  timestamp: number;
  stats: {
    entriesCount: number;
    attendanceCount: number;
    notesCount: number;
    debtsCount: number;
    remindersCount: number;
    goalsCount: number;
  };
  data: KhataData;
}

export interface ExportFilterOptions {
  modules: {
    entries: boolean;
    attendance: boolean;
    loans: boolean;
    notes: boolean;
    goals: boolean;
    settings: boolean;
  };
  dateRange: {
    type: 'all' | 'this_month' | 'last_month' | 'last_3_months' | 'custom';
    startDate?: string;
    endDate?: string;
    label?: string;
  };
}

export const DEFAULT_EXPORT_OPTIONS: ExportFilterOptions = {
  modules: {
    entries: true,
    attendance: true,
    loans: true,
    notes: true,
    goals: true,
    settings: true
  },
  dateRange: {
    type: 'all',
    label: 'All Time (सम्पूर्ण)'
  }
};

const SNAPSHOTS_STORAGE_KEY = 'dailykhata_snapshots_v1';
const MAX_SNAPSHOTS = 6;

/**
 * Filter KhataData by selected modules and date range
 */
export function filterKhataDataByOptions(data: KhataData, options?: ExportFilterOptions): KhataData {
  if (!options) return data;
  const { modules, dateRange } = options;
  const today = new Date();

  let start = '1970-01-01';
  let end = '2099-12-31';

  if (dateRange.type === 'this_month') {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    start = `${y}-${m}-01`;
    end = `${y}-${m}-31`;
  } else if (dateRange.type === 'last_month') {
    const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const y = prev.getFullYear();
    const m = String(prev.getMonth() + 1).padStart(2, '0');
    start = `${y}-${m}-01`;
    end = `${y}-${m}-31`;
  } else if (dateRange.type === 'last_3_months') {
    const d3 = new Date();
    d3.setMonth(d3.getMonth() - 3);
    start = getLocalDateString(d3);
    end = getLocalDateString(today);
  } else if (dateRange.type === 'custom') {
    if (dateRange.startDate) start = dateRange.startDate;
    if (dateRange.endDate) end = dateRange.endDate;
  }

  const isDateInRange = (d?: string) => {
    if (dateRange.type === 'all') return true;
    if (!d) return false;
    return d >= start && d <= end;
  };

  const filteredEntries = modules.entries
    ? data.entries.filter((e) => isDateInRange(e.date))
    : [];

  const filteredAttendance = modules.attendance
    ? (data.attendanceLogs || []).filter((a) => isDateInRange(a.date))
    : [];

  const filteredLoans = modules.loans
    ? (data.debtItems || []).filter(
        (d) =>
          dateRange.type === 'all' ||
          isDateInRange(d.startDate) ||
          (d.payments && d.payments.some((p) => isDateInRange(p.date)))
      )
    : [];

  const filteredNotes = modules.notes
    ? (data.personalNotes || []).filter((n) =>
        isDateInRange(n.date || getLocalDateString(new Date(n.createdAt)))
      )
    : [];

  const filteredGoals = modules.goals ? data.goals || [] : [];
  const filteredBudgets = modules.goals ? data.budgets || [] : [];

  return {
    ...data,
    entries: filteredEntries,
    attendanceLogs: filteredAttendance,
    debtItems: filteredLoans,
    personalNotes: filteredNotes,
    goals: filteredGoals,
    budgets: filteredBudgets
  };
}

/**
 * Build complete comprehensive backup payload
 */
export function buildCompleteBackupData(args: {
  entries: Entry[];
  attendanceLogs?: AttendanceLog[];
  personalNotes?: PersonalNote[];
  debtItems?: DebtItem[];
  reminders?: AppReminder[];
  goals?: Goal[];
  workLogs?: WorkLog[];
  dailyLifeLogs?: DailyLifeLog[];
  trashItems?: TrashItem[];
  budgets?: CategoryBudget[];
  categories: string[];
  incomeSources: string[];
  workCategories: string[];
  lifeTags: string[];
  funds: FundConfig[];
  homepageFundIds: string[];
  percentages: Record<FundType, number>;
  theme: AppTheme;
  language: AppLanguage;
  privacyMask?: boolean;
  viewMode?: AppViewMode;
  appLayout?: AppLayout;
  securityLock?: SecurityLockConfig;
}): KhataData {
  return {
    exportVersion: 3,
    exportedAt: new Date().toISOString(),
    entries: args.entries || [],
    attendanceLogs: args.attendanceLogs || [],
    personalNotes: args.personalNotes || [],
    debtItems: args.debtItems || [],
    reminders: args.reminders || [],
    goals: args.goals || [],
    workLogs: args.workLogs || [],
    dailyLifeLogs: args.dailyLifeLogs || [],
    trashItems: args.trashItems || [],
    budgets: args.budgets || [],
    categories: args.categories || [],
    incomeSources: args.incomeSources || [],
    workCategories: args.workCategories || [],
    lifeTags: args.lifeTags || [],
    funds: args.funds,
    homepageFundIds: args.homepageFundIds,
    settings: {
      percentages: args.percentages,
      funds: args.funds,
      homepageFundIds: args.homepageFundIds,
      theme: args.theme,
      language: args.language,
      privacyMask: args.privacyMask,
      viewMode: args.viewMode,
      appLayout: args.appLayout,
      securityLock: args.securityLock
        ? {
            isEnabled: args.securityLock.isEnabled,
            pin: '', // Never include raw PIN in export file
            securityAnswer: '',
            securityQuestion: args.securityLock.securityQuestion,
            securityQuestionId: args.securityLock.securityQuestionId,
            autoLockOnLeave: args.securityLock.autoLockOnLeave,
            autoLockTimeoutMinutes: args.securityLock.autoLockTimeoutMinutes
          }
        : undefined
    }
  };
}

/**
 * 1. Download JSON Backup (All Data or Filtered by Options)
 */
export function downloadCompleteJsonBackup(
  data: KhataData,
  options?: ExportFilterOptions,
  customFilename?: string
): void {
  const payloadToExport = options ? filterKhataDataByOptions(data, options) : data;

  // Redact secrets
  const safeData: KhataData = {
    ...payloadToExport,
    settings: {
      ...payloadToExport.settings,
      securityLock: payloadToExport.settings?.securityLock
        ? {
            ...payloadToExport.settings.securityLock,
            pin: '',
            securityAnswer: ''
          }
        : undefined
    }
  };

  const jsonStr = JSON.stringify(safeData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = getLocalDateString();
  a.download = customFilename || `daily-khata-pro-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerHapticSound('save');
}

/**
 * 2. Local Rolling Snapshot Checkpoints
 */
export function createLocalSnapshot(name: string, data: KhataData): LocalSnapshot {
  const snapshots = getLocalSnapshots();
  const newSnapshot: LocalSnapshot = {
    id: 'snap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name: name.trim() || `Snapshot ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    createdAt: new Date().toLocaleString(),
    timestamp: Date.now(),
    stats: {
      entriesCount: data.entries?.length || 0,
      attendanceCount: data.attendanceLogs?.length || 0,
      notesCount: data.personalNotes?.length || 0,
      debtsCount: data.debtItems?.length || 0,
      remindersCount: data.reminders?.length || 0,
      goalsCount: data.goals?.length || 0
    },
    data
  };

  const updated = [newSnapshot, ...snapshots.slice(0, MAX_SNAPSHOTS - 1)];
  try {
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save snapshot to localStorage', err);
  }
  return newSnapshot;
}

export function getLocalSnapshots(): LocalSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function deleteLocalSnapshot(id: string): LocalSnapshot[] {
  const snapshots = getLocalSnapshots().filter((s) => s.id !== id);
  try {
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots));
  } catch {}
  return snapshots;
}

/**
 * 3. Export Comprehensive CSV (Excel Compatible with UTF-8 BOM)
 */
export function downloadCompleteCSVBackup(data: KhataData, options?: ExportFilterOptions): void {
  const exportData = options ? filterKhataDataByOptions(data, options) : data;
  const lines: string[] = [];
  const escapeCsv = (str: unknown): string => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rangeLabel = options?.dateRange?.label || 'All Time';

  // HEADER TITLE
  lines.push(`"DAILY KHATA PRO - EXCEL & CSV DATA EXPORT"`);
  lines.push(`"Generated At: ${new Date().toLocaleString()} | Period: ${rangeLabel}"`);
  lines.push('');

  // 1. FINANCIAL ENTRIES
  if (!options || options.modules.entries) {
    lines.push(`"--- SECTION 1: FINANCIAL TRANSACTIONS (${exportData.entries.length} RECORDS) ---"`);
    lines.push([
      'ID', 'Date', 'Type', 'Amount (INR)', 'Category/Source', 'Payment Mode', 'Client/Person', 'Allocated Fund', 'Note', 'Timestamp'
    ].map(escapeCsv).join(','));

    exportData.entries.forEach((e) => {
      lines.push([
        e.id,
        e.date,
        e.type.toUpperCase(),
        e.amount,
        e.category || e.source || 'General',
        e.paymentMode || 'cash',
        e.clientName || '',
        e.fund || (e.splits ? Object.keys(e.splits).join(';') : ''),
        e.note || '',
        new Date(e.createdAt).toLocaleString()
      ].map(escapeCsv).join(','));
    });
    lines.push('');
  }

  // 2. ATTENDANCE & ADVANCES
  if (!options || options.modules.attendance) {
    const att = exportData.attendanceLogs || [];
    lines.push(`"--- SECTION 2: ATTENDANCE & ADVANCES REGISTER (${att.length} RECORDS) ---"`);
    lines.push([
      'ID', 'Date', 'Worker Name', 'Status', 'Start Time', 'End Time', 'Hours', 'Rate/Salary', 'Advances Received', 'Pending Wage', 'Payment Status', 'Job/Site'
    ].map(escapeCsv).join(','));

    att.forEach((a) => {
      lines.push([
        a.id,
        a.date,
        a.employerName || 'Staff Member',
        a.status.toUpperCase(),
        a.startTime ? formatTime12h(a.startTime) : '',
        a.endTime ? formatTime12h(a.endTime) : '',
        a.workingHours || 0,
        a.salaryOrRate || 0,
        a.advanceReceived || 0,
        a.pendingPayment || 0,
        (a.paymentStatus || 'pending').toUpperCase(),
        a.jobDescription || a.workAddress || ''
      ].map(escapeCsv).join(','));
    });
    lines.push('');
  }

  // 3. LOANS, UDHAR & EMI
  if (!options || options.modules.loans) {
    const debts = exportData.debtItems || [];
    lines.push(`"--- SECTION 3: LOANS, UDHAR & EMI LEDGER (${debts.length} RECORDS) ---"`);
    lines.push([
      'ID', 'Type', 'Person / Bank Name', 'Phone', 'Principal Amount', 'Remaining Balance', 'Start Date', 'Due Date', 'Status', 'Notes'
    ].map(escapeCsv).join(','));

    debts.forEach((d) => {
      lines.push([
        d.id,
        d.type === 'lent' ? 'UDHAR DIYA (LENT)' : d.type === 'borrowed' ? 'UDHAR LIYA (BORROWED)' : 'BANK LOAN / EMI',
        d.title || d.personName || 'Unnamed',
        d.phone || d.personPhone || '',
        d.principalAmount || d.initialAmount || 0,
        d.remainingAmount || 0,
        d.startDate || '',
        d.dueDate || '',
        (d.status || 'active').toUpperCase(),
        d.note || ''
      ].map(escapeCsv).join(','));
    });
    lines.push('');
  }

  // 4. PERSONAL NOTES
  if (!options || options.modules.notes) {
    const notes = exportData.personalNotes || [];
    lines.push(`"--- SECTION 4: PERSONAL NOTES & SECRETS (${notes.length} RECORDS) ---"`);
    lines.push([
      'ID', 'Date', 'Time', 'Category', 'Priority', 'Title', 'Content', 'Pinned', 'Tags', 'Created Date'
    ].map(escapeCsv).join(','));

    notes.forEach((n) => {
      lines.push([
        n.id,
        n.date || getLocalDateString(new Date(n.createdAt)),
        n.time ? formatTime12h(n.time) : '',
        n.category || 'personal',
        n.priority || 'normal',
        n.title,
        n.content,
        n.isPinned ? 'YES' : 'NO',
        (n.tags || []).join('; '),
        new Date(n.createdAt).toLocaleDateString()
      ].map(escapeCsv).join(','));
    });
  }

  // UTF-8 BOM (\uFEFF) so Excel opens Hindi / Unicode text properly
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `daily-khata-pro-export-${getLocalDateString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerHapticSound('save');
}

/**
 * 4. SELECTIVE & COMPREHENSIVE PDF REPORT GENERATOR
 */
export async function exportOneClickComprehensivePDF(
  rawKhataData: KhataData,
  currencySymbol: string = 'Rs.',
  isHindi: boolean = false,
  options?: ExportFilterOptions
): Promise<void> {
  const data = options ? filterKhataDataByOptions(rawKhataData, options) : rawKhataData;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const emeraldColor: [number, number, number] = [16, 185, 129]; // Emerald 500
  const periodLabel = options?.dateRange?.label || (isHindi ? 'सम्पूर्ण डेटा (All Time)' : 'All Time Records');

  // 1. Calculations for Financial Summary
  let totalIncome = 0;
  let totalExpense = 0;
  data.entries.forEach((e) => {
    if (e.type === 'income') totalIncome += Number(e.amount) || 0;
    else totalExpense += Number(e.amount) || 0;
  });
  const netBalance = totalIncome - totalExpense;

  // Attendance stats
  const attLogs = data.attendanceLogs || [];
  let totalWageEarned = 0;
  let totalAdvanceTaken = 0;
  let totalPendingWages = 0;
  attLogs.forEach((l) => {
    totalWageEarned += Number(l.salaryOrRate) || 0;
    totalAdvanceTaken += Number(l.advanceReceived) || 0;
    totalPendingWages += Number(l.pendingPayment) || 0;
  });

  // Loan stats
  const debtItems = data.debtItems || [];
  let totalLentPending = 0;
  let totalBorrowedPending = 0;
  debtItems.forEach((d) => {
    if (d.status !== 'settled') {
      if (d.type === 'lent') totalLentPending += Number(d.remainingAmount) || 0;
      else totalBorrowedPending += Number(d.remainingAmount) || 0;
    }
  });

  const notesCount = data.personalNotes?.length || 0;

  // Draw Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(...emeraldColor);
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('DAILY KHATA PRO • OFFICIAL STATEMENT', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Period: ${periodLabel} | Generated: ${new Date().toLocaleString()} | 100% Safe Offline Record`, 14, 19);

  let currentY = 35;

  // SECTION 1: FINANCIAL OVERVIEW
  if (!options || options.modules.entries) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(isHindi ? '1. वित्तीय सारांश व 6-फंड स्थिति (Financial Overview)' : '1. Financial & Fund Overview', 14, currentY);

    const cardW = (pageWidth - 28 - 9) / 4;
    const cardH = 18;
    const cardY = currentY + 3;

    const drawCard = (x: number, title: string, value: string, color: [number, number, number]) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, cardY, cardW, cardH, 2, 2, 'FD');

      doc.setFillColor(...color);
      doc.rect(x, cardY, 2, cardH, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(title, x + 4, cardY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...color);
      doc.text(value, x + 4, cardY + 13.5);
    };

    drawCard(14, 'TOTAL INCOME', `${currencySymbol} ${totalIncome.toLocaleString('en-IN')}`, [16, 185, 129]);
    drawCard(14 + cardW + 3, 'TOTAL EXPENSES', `${currencySymbol} ${totalExpense.toLocaleString('en-IN')}`, [239, 68, 68]);
    drawCard(14 + (cardW + 3) * 2, 'NET BALANCE', `${currencySymbol} ${netBalance.toLocaleString('en-IN')}`, netBalance >= 0 ? [14, 116, 144] : [239, 68, 68]);
    drawCard(14 + (cardW + 3) * 3, 'TRANSACTIONS', `${data.entries.length} Entries`, [99, 102, 241]);

    currentY += 26;

    // Financial Entries Table (Latest 20)
    const recentEntries = data.entries.slice(0, 25).map((e) => [
      e.date,
      e.type.toUpperCase(),
      (e.category || e.source || 'General').slice(0, 20),
      e.clientName ? e.clientName.slice(0, 18) : (e.fund || 'Direct'),
      (e.paymentMode || 'cash').toUpperCase(),
      `${currencySymbol} ${Number(e.amount).toLocaleString('en-IN')}`
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Date', 'Type', 'Category/Source', 'Ref/Fund', 'Mode', 'Amount']],
      body: recentEntries.length > 0 ? recentEntries : [['-', '-', 'No records in selected period', '-', '-', '-']],
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59]
      },
      columnStyles: {
        5: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable?.finalY || currentY + 40;
  }

  // SECTION 2: ATTENDANCE & ADVANCES
  if (!options || options.modules.attendance) {
    if (currentY > pageHeight - 55) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(
      isHindi
        ? `2. दैनिक उपस्थिति व एडवांस लेजर (Attendance & Advances - ${attLogs.length} Records)`
        : `2. Staff Attendance & Advances Register (${attLogs.length} Records)`,
      14,
      currentY
    );

    const attRows = attLogs.slice(0, 20).map((a) => {
      const advTotal = a.advanceReceived || (a.advances ? a.advances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) : 0);
      const timings = a.startTime && a.endTime ? `${formatTime12h(a.startTime)}-${formatTime12h(a.endTime)}` : (a.workingHours ? `${a.workingHours}h` : '-');
      return [
        a.date,
        (a.employerName || 'Staff Member').slice(0, 20),
        a.status.toUpperCase(),
        timings,
        `${currencySymbol} ${Number(a.salaryOrRate || 0).toLocaleString('en-IN')}`,
        `${currencySymbol} ${Number(advTotal).toLocaleString('en-IN')}`,
        `${currencySymbol} ${Number(a.pendingPayment || 0).toLocaleString('en-IN')}`
      ];
    });

    autoTable(doc, {
      startY: currentY + 3,
      head: [['Date', 'Staff/Worker Name', 'Status', 'Duty Time', 'Salary/Rate', 'Advance Taken', 'Pending Wage']],
      body: attRows.length > 0 ? attRows : [['-', 'No attendance records in period', '-', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: {
        fillColor: [14, 116, 144],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59]
      },
      columnStyles: {
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold', textColor: [220, 38, 38] },
        6: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable?.finalY || currentY + 40;
  }

  // SECTION 3: LOANS & UDHAR
  if (!options || options.modules.loans) {
    if (currentY > pageHeight - 55) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(
      isHindi
        ? `3. ऋण, उधार व EMI स्थिति (Loans & Udhar - ${debtItems.length} Records)`
        : `3. Loans, Udhar & EMI Statement (${debtItems.length} Records)`,
      14,
      currentY
    );

    const debtRows = debtItems.slice(0, 15).map((d) => [
      d.type === 'lent' ? 'UDHAR DIYA' : d.type === 'borrowed' ? 'UDHAR LIYA' : 'BANK EMI',
      (d.title || d.personName || 'Unnamed').slice(0, 22),
      d.startDate || '-',
      `${currencySymbol} ${Number(d.principalAmount || d.initialAmount || 0).toLocaleString('en-IN')}`,
      `${currencySymbol} ${Number(d.remainingAmount || 0).toLocaleString('en-IN')}`,
      (d.status || 'active').toUpperCase()
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['Type', 'Person / Institution', 'Start Date', 'Principal', 'Remaining Due', 'Status']],
      body: debtRows.length > 0 ? debtRows : [['-', 'No active loans in period', '-', '-', '-', '-']],
      theme: 'striped',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59]
      },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable?.finalY || currentY + 40;
  }

  // SECTION 4: PERSONAL NOTES
  if (!options || options.modules.notes) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(
      isHindi
        ? `4. व्यक्तिगत नोट्स (Personal Notes - ${notesCount} Items)`
        : `4. Personal Notes & Key Records (${notesCount} Items)`,
      14,
      currentY
    );

    const notesRows = (data.personalNotes || []).slice(0, 15).map((n) => {
      const noteDate = n.date || (n.createdAt ? getLocalDateString(new Date(n.createdAt)) : '-');
      const noteTime = n.time ? formatTime12h(n.time) : '';
      const dateCol = noteTime ? `${noteDate} ${noteTime}` : noteDate;
      return [
        dateCol,
        n.category.toUpperCase(),
        n.title.slice(0, 22),
        (n.content || '').replace(/\n/g, ' ').slice(0, 50),
        n.priority === 'urgent' ? 'URGENT' : n.isPinned ? 'PINNED' : 'NORMAL'
      ];
    });

    autoTable(doc, {
      startY: currentY + 3,
      head: [['Date & Time', 'Category', 'Title', 'Content Preview', 'Status']],
      body: notesRows.length > 0 ? notesRows : [['-', '-', 'No personal notes recorded', '-', '-']],
      theme: 'plain',
      headStyles: {
        fillColor: [100, 116, 139],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [51, 65, 85]
      },
      margin: { left: 14, right: 14 }
    });
  }

  // FOOTER ON ALL PAGES
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10);

    doc.text('Daily Khata Pro • Official Statement • Confidential Personal & Business Record', 14, pageHeight - 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 28, pageHeight - 6);
  }

  // Trigger browser PDF save
  const pdfFileName = `daily-khata-statement-${getLocalDateString()}.pdf`;
  doc.save(pdfFileName);
  triggerCelebration();
}
