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
import { getLocalDateString } from './dateUtils';
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

const SNAPSHOTS_STORAGE_KEY = 'dailykhata_snapshots_v1';
const MAX_SNAPSHOTS = 6;

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
 * 1. Download Full JSON Backup (All Data)
 */
export function downloadCompleteJsonBackup(data: KhataData, customFilename?: string): void {
  const exportPayload = {
    ...data,
    settings: {
      ...data.settings,
      securityLock: data.settings?.securityLock
        ? {
            ...data.settings.securityLock,
            pin: '',
            securityAnswer: ''
          }
        : undefined
    }
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const filename = customFilename || `daily-khata-pro-full-backup-${getLocalDateString()}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
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
export function downloadCompleteCSVBackup(data: KhataData): void {
  const lines: string[] = [];
  const escapeCsv = (str: unknown): string => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  // HEADER TITLE
  lines.push(`"DAILY KHATA PRO - COMPREHENSIVE BACKUP EXPORT"`);
  lines.push(`"Generated At: ${new Date().toLocaleString()}"`);
  lines.push('');

  // 1. FINANCIAL TRANSACTIONS
  lines.push(`"--- SECTION 1: FINANCIAL TRANSACTIONS (${data.entries.length} RECORDS) ---"`);
  lines.push([
    'ID', 'Date', 'Type', 'Amount', 'Category', 'Source / Payee', 'Payment Mode', 'Fund', 'Note'
  ].map(escapeCsv).join(','));

  data.entries.forEach((e) => {
    lines.push([
      e.id,
      e.date,
      e.type.toUpperCase(),
      e.amount,
      e.category || '',
      e.source || e.clientName || '',
      e.paymentMode || '',
      e.fund || '',
      e.note || ''
    ].map(escapeCsv).join(','));
  });

  lines.push('');
  lines.push('');

  // 2. ATTENDANCE & ADVANCE REGISTER
  const attLogs = data.attendanceLogs || [];
  lines.push(`"--- SECTION 2: ATTENDANCE & ADVANCE REGISTER (${attLogs.length} RECORDS) ---"`);
  lines.push([
    'ID', 'Date', 'Status', 'Employer / Site', 'Duty In', 'Duty Out', 'Working Hours',
    'Overtime (h)', 'Daily Rate / Salary', 'Payment Received', 'Advance Received',
    'Advance Details', 'Pending Dues', 'Payment Status', 'Work Type / Notes'
  ].map(escapeCsv).join(','));

  attLogs.forEach((l) => {
    const advDetails = (l.advances && l.advances.length > 0)
      ? l.advances.map(a => `${a.amount} (${a.reason || 'Advance'})`).join('; ')
      : (l.advanceReason ? `${l.advanceReceived || 0} (${l.advanceReason})` : '');

    lines.push([
      l.id,
      l.date,
      l.status.toUpperCase(),
      l.employerName || '',
      l.startTime || '',
      l.endTime || '',
      l.workingHours || 0,
      l.overtimeHours || 0,
      l.salaryOrRate || 0,
      l.paymentReceived || 0,
      l.advanceReceived || 0,
      advDetails,
      l.pendingPayment || 0,
      l.paymentStatus.toUpperCase(),
      l.notes || l.jobDescription || l.workType || ''
    ].map(escapeCsv).join(','));
  });

  lines.push('');
  lines.push('');

  // 3. LOANS, EMI & UDHAR LEDGER
  const debts = data.debtItems || [];
  lines.push(`"--- SECTION 3: LOANS, EMI & UDHAR LEDGER (${debts.length} RECORDS) ---"`);
  lines.push([
    'ID', 'Type', 'Person / Bank Title', 'Phone', 'Principal Amount', 'Remaining Balance',
    'Start Date', 'Due Date', 'Is EMI', 'Monthly EMI', 'Total EMIs', 'Paid EMIs', 'Status', 'Note'
  ].map(escapeCsv).join(','));

  debts.forEach((d) => {
    lines.push([
      d.id,
      d.type.toUpperCase(),
      d.title || d.personName || '',
      d.phone || d.personPhone || '',
      d.principalAmount || d.initialAmount || 0,
      d.remainingAmount || 0,
      d.startDate || '',
      d.dueDate || '',
      d.isEmi ? 'YES' : 'NO',
      d.emiAmount || '',
      d.totalEmis || '',
      d.paidEmis || 0,
      d.status.toUpperCase(),
      d.note || ''
    ].map(escapeCsv).join(','));
  });

  lines.push('');
  lines.push('');

  // 4. PERSONAL NOTES
  const notes = data.personalNotes || [];
  lines.push(`"--- SECTION 4: PERSONAL NOTES & SECRETS (${notes.length} RECORDS) ---"`);
  lines.push([
    'ID', 'Category', 'Title', 'Content', 'Pinned', 'Tags', 'Created Date'
  ].map(escapeCsv).join(','));

  notes.forEach((n) => {
    lines.push([
      n.id,
      n.category || 'personal',
      n.title,
      n.content,
      n.isPinned ? 'YES' : 'NO',
      (n.tags || []).join('; '),
      new Date(n.createdAt).toLocaleDateString()
    ].map(escapeCsv).join(','));
  });

  // UTF-8 BOM (\uFEFF) so Excel opens Hindi / Unicode text properly
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `daily-khata-pro-complete-${getLocalDateString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerHapticSound('save');
}

/**
 * 4. ONE-CLICK COMPREHENSIVE PDF REPORT
 * Generates an executive-grade multi-page document covering Financials, Attendance & Advances, Loans, and Notes.
 */
export async function exportOneClickComprehensivePDF(
  data: KhataData,
  currencySymbol: string = 'Rs.',
  isHindi: boolean = false
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const emeraldColor: [number, number, number] = [16, 185, 129]; // Emerald 500
  const skyColor: [number, number, number] = [14, 116, 144]; // Cyan 700

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

  // Loan / Udhar stats
  const debtItems = data.debtItems || [];
  let totalLentPending = 0;
  let totalBorrowedPending = 0;
  debtItems.forEach((d) => {
    if (d.status !== 'settled') {
      if (d.type === 'lent') totalLentPending += Number(d.remainingAmount) || 0;
      else totalBorrowedPending += Number(d.remainingAmount) || 0;
    }
  });

  // Notes & Reminders
  const notesCount = data.personalNotes?.length || 0;
  const remindersCount = data.reminders?.length || 0;

  // Draw Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(...emeraldColor);
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('DAILY KHATA PRO • COMPREHENSIVE RECORD', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Generated: ${new Date().toLocaleString()} | Version: v3.0 | 100% Client-Side Safe`, 14, 19);

  // SUMMARY KPI CARDS
  let startY = 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(isHindi ? '1. वित्तीय व खाता सारांश (Financial Overview)' : '1. Financial & Khata Overview', 14, startY);

  const cardW = (pageWidth - 28 - 9) / 4;
  const cardH = 20;
  const cardY = startY + 4;

  const drawCard = (x: number, title: string, value: string, color: [number, number, number]) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, cardY, cardW, cardH, 2, 2, 'FD');

    // Colored left border strip
    doc.setFillColor(...color);
    doc.rect(x, cardY, 2, cardH, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(title, x + 5, cardY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...color);
    doc.text(value, x + 5, cardY + 15);
  };

  drawCard(14, 'TOTAL INCOME', `${currencySymbol} ${totalIncome.toLocaleString('en-IN')}`, [16, 185, 129]);
  drawCard(14 + cardW + 3, 'TOTAL EXPENSES', `${currencySymbol} ${totalExpense.toLocaleString('en-IN')}`, [239, 68, 68]);
  drawCard(14 + (cardW + 3) * 2, 'NET BALANCE', `${currencySymbol} ${netBalance.toLocaleString('en-IN')}`, netBalance >= 0 ? [14, 116, 144] : [239, 68, 68]);
  drawCard(14 + (cardW + 3) * 3, 'ATTENDANCE ENTRIES', `${attLogs.length} Records`, [99, 102, 241]);

  // SECOND ROW OF MINI STATS
  const row2Y = cardY + cardH + 3;
  drawCard(14, 'ADVANCES TAKEN', `${currencySymbol} ${totalAdvanceTaken.toLocaleString('en-IN')}`, [245, 158, 11]);
  drawCard(14 + cardW + 3, 'PENDING WAGES', `${currencySymbol} ${totalPendingWages.toLocaleString('en-IN')}`, [234, 88, 12]);
  drawCard(14 + (cardW + 3) * 2, 'UDHAR TO RECEIVE', `${currencySymbol} ${totalLentPending.toLocaleString('en-IN')}`, [16, 185, 129]);
  drawCard(14 + (cardW + 3) * 3, 'LOANS / BORROWED', `${currencySymbol} ${totalBorrowedPending.toLocaleString('en-IN')}`, [220, 38, 38]);

  // TABLE 1: RECENT TRANSACTIONS (Top 12 entries or all if small)
  const recentEntries = data.entries.slice(0, 15);
  const entryRows = recentEntries.map((e) => [
    e.date,
    e.type.toUpperCase(),
    e.category || 'General',
    `${currencySymbol} ${Number(e.amount).toLocaleString('en-IN')}`,
    e.paymentMode?.toUpperCase() || 'CASH',
    e.source || e.clientName || '-',
    (e.note || '').slice(0, 35)
  ]);

  autoTable(doc, {
    startY: row2Y + cardH + 7,
    head: [['Date', 'Type', 'Category', 'Amount', 'Mode', 'Party / Source', 'Note']],
    body: entryRows.length > 0 ? entryRows : [['-', '-', 'No financial entries recorded', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      3: { halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  // SECTION 2: ATTENDANCE & ADVANCES REGISTER
  let finalY = (doc as any).lastAutoTable?.finalY || 140;
  if (finalY > pageHeight - 65) {
    doc.addPage();
    finalY = 20;
  } else {
    finalY += 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(
    isHindi
      ? `2. स्टाफ उपस्थिति, ड्यूटी समय व अग्रिम (Attendance & Advances - ${attLogs.length} Records)`
      : `2. Staff Duty Attendance & Advances Register (${attLogs.length} Records)`,
    14,
    finalY
  );

  const attendanceRows = attLogs.slice(0, 25).map((l) => {
    const advStr = (l.advances && l.advances.length > 0)
      ? l.advances.map(a => `${currencySymbol}${a.amount}${a.reason ? ` (${a.reason})` : ''}`).join(', ')
      : (l.advanceReceived ? `${currencySymbol}${l.advanceReceived}${l.advanceReason ? ` (${l.advanceReason})` : ''}` : '-');

    const dutyTime = (l.startTime && l.endTime) ? `${l.startTime}-${l.endTime}` : (l.workingHours ? `${l.workingHours}h` : '-');

    return [
      l.date,
      l.status.toUpperCase(),
      (l.employerName || 'Main').slice(0, 18),
      dutyTime,
      l.overtimeHours ? `+${l.overtimeHours}h` : '-',
      l.salaryOrRate ? `${currencySymbol} ${Number(l.salaryOrRate).toLocaleString('en-IN')}` : '-',
      advStr.slice(0, 30),
      l.pendingPayment ? `${currencySymbol} ${Number(l.pendingPayment).toLocaleString('en-IN')}` : '0',
      l.paymentStatus.toUpperCase()
    ];
  });

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Date', 'Status', 'Employer/Site', 'Duty Time', 'OT', 'Rate/Wage', 'Advances & Reason', 'Pending', 'Payment']],
    body: attendanceRows.length > 0 ? attendanceRows : [['-', '-', 'No attendance logs recorded', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: skyColor,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      5: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  // SECTION 3: LOANS, EMI & UDHAR LEDGER
  finalY = (doc as any).lastAutoTable?.finalY || 160;
  if (finalY > pageHeight - 60) {
    doc.addPage();
    finalY = 20;
  } else {
    finalY += 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(
    isHindi
      ? `3. ऋण, उधार व ईएमआई लेजर (Loans & Udhar - ${debtItems.length} Records)`
      : `3. Loans, Udhar & EMI Register (${debtItems.length} Records)`,
    14,
    finalY
  );

  const debtRows = debtItems.map((d) => [
    d.type === 'lent' ? 'LENT (GIVEN)' : (d.type === 'loan_emi' ? 'BANK/EMI' : 'BORROWED (TAKEN)'),
    (d.title || d.personName || 'Account').slice(0, 20),
    d.phone || '-',
    `${currencySymbol} ${(d.principalAmount || d.initialAmount || 0).toLocaleString('en-IN')}`,
    `${currencySymbol} ${(d.remainingAmount || 0).toLocaleString('en-IN')}`,
    d.isEmi ? `${currencySymbol}${d.emiAmount || 0} (${d.paidEmis || 0}/${d.totalEmis || '-'})` : '-',
    d.dueDate || d.startDate || '-',
    d.status.toUpperCase()
  ]);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Type', 'Party / Institution', 'Phone', 'Principal', 'Remaining', 'EMI Plan', 'Due/Date', 'Status']],
    body: debtRows.length > 0 ? debtRows : [['-', 'No active loan or udhar accounts', '-', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: [71, 85, 105], // Slate 600
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

  // SECTION 4: PERSONAL NOTES & WORK HIGHLIGHTS
  finalY = (doc as any).lastAutoTable?.finalY || 180;
  if (finalY > pageHeight - 50) {
    doc.addPage();
    finalY = 20;
  } else {
    finalY += 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(
    isHindi
      ? `4. पर्सनल नोट्स व महत्वपूर्ण कार्य (Personal Notes - ${notesCount} Items)`
      : `4. Personal Notes & Key Deliverables (${notesCount} Items)`,
    14,
    finalY
  );

  const notesRows = (data.personalNotes || []).slice(0, 15).map((n) => [
    n.category.toUpperCase(),
    n.title.slice(0, 25),
    (n.content || '').replace(/\n/g, ' ').slice(0, 65),
    n.isPinned ? 'PINNED' : 'NORMAL',
    new Date(n.createdAt).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Category', 'Title', 'Content Preview', 'Pin Status', 'Created']],
    body: notesRows.length > 0 ? notesRows : [['-', 'No personal notes recorded', '-', '-', '-']],
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

  // FOOTER ON ALL PAGES
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate 400

    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10);

    doc.text('Daily Khata Pro • Official Statement • Confidential Personal & Business Record', 14, pageHeight - 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 28, pageHeight - 6);
  }

  // Trigger browser PDF save
  const pdfFileName = `daily-khata-pro-statement-${getLocalDateString()}.pdf`;
  doc.save(pdfFileName);
  triggerCelebration();
}
