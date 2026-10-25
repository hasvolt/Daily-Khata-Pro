import DOMPurify from 'dompurify';
import { KhataData, Entry, Goal, WorkLog, DailyLifeLog, PersonalNote } from '../types';

/**
 * HTML Entity Escaper for Print, Export and Plaintext Rendering
 * Prevents Cross-Site Scripting (XSS) when user inputs contain HTML/script fragments.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Robust DOMPurify HTML Sanitizer for Rich Text & Article Rendering
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'br', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
}

/**
 * SHA-256 Asynchronous Cryptographic Hasher for PIN & Security Answers
 */
export async function hashSecret(secret: string): Promise<string> {
  const normalized = secret.trim().toLowerCase();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`dkp_salt_2026_${normalized}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for non-WebCrypto environments
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `fallback_${Math.abs(hash)}`;
}

/**
 * Verify input against stored secret (supports both hashed and legacy plaintext)
 */
export async function verifySecret(input: string, stored: string): Promise<boolean> {
  const cleanInput = input.trim();
  const cleanStored = stored.trim();
  if (!cleanStored || !cleanInput) return false;

  // 1. Direct comparison (legacy plaintext)
  if (cleanInput === cleanStored || cleanInput.toLowerCase() === cleanStored.toLowerCase()) {
    return true;
  }

  // 2. Hash comparison
  try {
    const inputHash = await hashSecret(cleanInput);
    return inputHash === cleanStored;
  } catch {
    return false;
  }
}

/**
 * Schema Validator & Sanitizer for imported backup files (JSON)
 * Prevents corrupted files or malicious payloads from injecting scripts or crashing state.
 */
export function validateAndSanitizeKhataBackup(parsed: any): KhataData | null {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  // Verify at least one essential root structure exists
  if (!Array.isArray(parsed.entries) && !parsed.settings) {
    return null;
  }

  // Sanitize entries with all authentic Daily Khata Pro properties
  const sanitizedEntries: Entry[] = Array.isArray(parsed.entries)
    ? parsed.entries
        .filter((e: any) => e && typeof e === 'object' && typeof e.id === 'string')
        .map((e: any) => ({
          id: String(e.id).slice(0, 100),
          bookId: e.bookId ? String(e.bookId).slice(0, 50) : undefined,
          type: e.type === 'expense' ? 'expense' : 'income',
          amount: Math.abs(Number(e.amount) || 0),
          date: String(e.date || '').slice(0, 20),
          category: escapeHtml(String(e.category || (e.type === 'income' ? 'Salary' : 'General'))).slice(0, 100),
          source: e.source ? escapeHtml(String(e.source)).slice(0, 150) : undefined,
          note: e.note ? escapeHtml(String(e.note)).slice(0, 1000) : (e.description ? escapeHtml(String(e.description)).slice(0, 1000) : undefined),
          splits: e.splits && typeof e.splits === 'object' ? e.splits : (e.fundAllocations && typeof e.fundAllocations === 'object' ? e.fundAllocations : undefined),
          fund: e.fund ? String(e.fund).slice(0, 50) : undefined,
          allocationMode: e.allocationMode === 'single' ? 'single' : 'all',
          targetFund: e.targetFund ? String(e.targetFund).slice(0, 50) : undefined,
          paymentMode: e.paymentMode ? String(e.paymentMode).slice(0, 30) as any : 'cash',
          clientName: e.clientName ? escapeHtml(String(e.clientName)).slice(0, 150) : undefined,
          receiptImage: typeof e.receiptImage === 'string' && e.receiptImage.length < 500000 ? e.receiptImage : undefined,
          createdAt: Number(e.createdAt) || Date.now()
        }))
    : [];

  // Sanitize categories & string lists
  const sanitizeStringArray = (arr: any, fallback: string[]): string[] => {
    if (!Array.isArray(arr)) return fallback;
    return arr
      .filter((item: any) => item && typeof item === 'string')
      .map((item: string) => escapeHtml(item).slice(0, 80));
  };

  const categories = sanitizeStringArray(parsed.categories, []);
  const incomeSources = sanitizeStringArray(parsed.incomeSources, []);
  const workCategories = sanitizeStringArray(parsed.workCategories, []);
  const lifeTags = sanitizeStringArray(parsed.lifeTags, []);

  // Sanitize goals
  const goals: Goal[] = Array.isArray(parsed.goals)
    ? parsed.goals
        .filter((g: any) => g && typeof g === 'object' && typeof g.id === 'string')
        .map((g: any) => ({
          id: String(g.id).slice(0, 100),
          title: escapeHtml(String(g.title || '')).slice(0, 200),
          targetAmount: Math.abs(Number(g.targetAmount) || 0),
          currentAmount: Math.abs(Number(g.currentAmount) || 0),
          targetDate: String(g.targetDate || '').slice(0, 20),
          category: escapeHtml(String(g.category || 'general')).slice(0, 100),
          linkedFund: g.linkedFund ? String(g.linkedFund).slice(0, 50) : undefined,
          note: g.note ? escapeHtml(String(g.note)).slice(0, 500) : undefined,
          isCompleted: Boolean(g.isCompleted),
          createdAt: Number(g.createdAt) || Date.now(),
          completedAt: g.completedAt ? Number(g.completedAt) : undefined
        }))
    : [];

  // Sanitize Attendance Logs with multiple advances & timing
  const attendanceLogs = Array.isArray(parsed.attendanceLogs)
    ? parsed.attendanceLogs
        .filter((l: any) => l && typeof l === 'object' && typeof l.id === 'string')
        .map((l: any) => ({
          id: String(l.id).slice(0, 100),
          date: String(l.date || '').slice(0, 20),
          startTime: l.startTime ? String(l.startTime).slice(0, 10) : undefined,
          endTime: l.endTime ? String(l.endTime).slice(0, 10) : undefined,
          status: ['present', 'absent', 'half_day', 'leave', 'overtime'].includes(l.status) ? l.status : 'present',
          overtimeHours: Number(l.overtimeHours) || 0,
          workingHours: Number(l.workingHours) || 0,
          salaryOrRate: Number(l.salaryOrRate) || 0,
          paymentReceived: Number(l.paymentReceived) || 0,
          advanceReceived: Number(l.advanceReceived) || 0,
          advanceReason: l.advanceReason ? escapeHtml(String(l.advanceReason)).slice(0, 200) : undefined,
          advances: Array.isArray(l.advances)
            ? l.advances.map((adv: any) => ({
                id: String(adv.id || ('adv_' + Math.random().toString(36).slice(2, 6))),
                amount: Math.abs(Number(adv.amount) || 0),
                reason: adv.reason ? escapeHtml(String(adv.reason)).slice(0, 150) : undefined,
                paymentMode: adv.paymentMode ? String(adv.paymentMode).slice(0, 30) : 'cash',
                time: adv.time ? String(adv.time).slice(0, 20) : undefined,
                date: adv.date ? String(adv.date).slice(0, 20) : undefined,
                notes: adv.notes ? escapeHtml(String(adv.notes)).slice(0, 300) : undefined
              }))
            : undefined,
          pendingPayment: Number(l.pendingPayment) || 0,
          paymentDate: l.paymentDate ? String(l.paymentDate).slice(0, 20) : undefined,
          paymentStatus: ['paid', 'pending', 'partial'].includes(l.paymentStatus) ? l.paymentStatus : 'pending',
          paymentNotes: l.paymentNotes ? escapeHtml(String(l.paymentNotes)).slice(0, 500) : undefined,
          employerName: l.employerName ? escapeHtml(String(l.employerName)).slice(0, 150) : undefined,
          workAddress: l.workAddress ? escapeHtml(String(l.workAddress)).slice(0, 200) : undefined,
          workType: l.workType ? escapeHtml(String(l.workType)).slice(0, 150) : undefined,
          workCategory: l.workCategory ? escapeHtml(String(l.workCategory)).slice(0, 100) : undefined,
          jobDescription: l.jobDescription ? escapeHtml(String(l.jobDescription)).slice(0, 500) : undefined,
          notes: l.notes ? escapeHtml(String(l.notes)).slice(0, 1000) : undefined,
          createdAt: Number(l.createdAt) || Date.now(),
          updatedAt: l.updatedAt ? Number(l.updatedAt) : undefined
        }))
    : [];

  // Sanitize Personal Notes
  const personalNotes = Array.isArray(parsed.personalNotes)
    ? parsed.personalNotes
        .filter((n: any) => n && typeof n === 'object' && typeof n.id === 'string')
        .map((n: any) => ({
          id: String(n.id).slice(0, 100),
          title: escapeHtml(String(n.title || 'Untitled')).slice(0, 200),
          content: escapeHtml(String(n.content || '')).slice(0, 50000),
          category: escapeHtml(String(n.category || 'personal')).slice(0, 80),
          color: ['default', 'blue', 'emerald', 'amber', 'purple', 'rose', 'slate'].includes(n.color) ? n.color : 'default',
          isPinned: Boolean(n.isPinned),
          isLocked: Boolean(n.isLocked),
          tags: Array.isArray(n.tags) ? n.tags.map((t: any) => escapeHtml(String(t)).slice(0, 40)) : undefined,
          date: n.date ? String(n.date).slice(0, 20) : undefined,
          time: n.time ? String(n.time).slice(0, 15) : undefined,
          priority: ['normal', 'high', 'urgent'].includes(n.priority) ? n.priority : 'normal',
          reminderDateTime: n.reminderDateTime ? String(n.reminderDateTime).slice(0, 30) : undefined,
          checklist: Array.isArray(n.checklist)
            ? n.checklist.map((item: any) => ({
                id: String(item.id || ('chk_' + Math.random().toString(36).slice(2, 6))),
                text: escapeHtml(String(item.text || '')).slice(0, 300),
                isDone: Boolean(item.isDone)
              }))
            : undefined,
          createdAt: Number(n.createdAt) || Date.now(),
          updatedAt: Number(n.updatedAt) || Date.now()
        }))
    : [];

  // Sanitize Debt / Loan / Udhar items
  const debtItems = Array.isArray(parsed.debtItems)
    ? parsed.debtItems
        .filter((d: any) => d && typeof d === 'object' && typeof d.id === 'string')
        .map((d: any) => ({
          id: String(d.id).slice(0, 100),
          type: ['lent', 'borrowed', 'loan_emi'].includes(d.type) ? d.type : 'lent',
          title: escapeHtml(String(d.title || 'Loan Record')).slice(0, 150),
          personName: d.personName ? escapeHtml(String(d.personName)).slice(0, 100) : undefined,
          personPhone: d.personPhone ? escapeHtml(String(d.personPhone)).slice(0, 50) : undefined,
          phone: d.phone ? escapeHtml(String(d.phone)).slice(0, 50) : undefined,
          principalAmount: Math.abs(Number(d.principalAmount || d.initialAmount) || 0),
          initialAmount: Math.abs(Number(d.initialAmount || d.principalAmount) || 0),
          remainingAmount: Math.abs(Number(d.remainingAmount) || 0),
          startDate: String(d.startDate || '').slice(0, 20),
          dueDate: d.dueDate ? String(d.dueDate).slice(0, 20) : undefined,
          isEmi: Boolean(d.isEmi),
          emiAmount: d.emiAmount ? Math.abs(Number(d.emiAmount)) : undefined,
          emiDayOfMonth: d.emiDayOfMonth ? Number(d.emiDayOfMonth) : undefined,
          totalEmis: d.totalEmis ? Number(d.totalEmis) : undefined,
          paidEmis: d.paidEmis ? Number(d.paidEmis) : 0,
          interestRate: d.interestRate ? Number(d.interestRate) : undefined,
          status: ['active', 'settled', 'overdue'].includes(d.status) ? d.status : 'active',
          note: d.note ? escapeHtml(String(d.note)).slice(0, 500) : undefined,
          createdAt: Number(d.createdAt) || Date.now(),
          updatedAt: Number(d.updatedAt) || Date.now(),
          payments: Array.isArray(d.payments)
            ? d.payments.map((p: any) => ({
                id: String(p.id || ('pay_' + Math.random().toString(36).slice(2, 6))),
                amount: Math.abs(Number(p.amount) || 0),
                date: String(p.date || '').slice(0, 20),
                paymentMode: p.paymentMode ? String(p.paymentMode).slice(0, 30) : 'cash',
                note: p.note ? escapeHtml(String(p.note)).slice(0, 300) : undefined,
                createdAt: Number(p.createdAt) || Date.now()
              }))
            : []
        }))
    : [];

  // Sanitize Reminders
  const reminders = Array.isArray(parsed.reminders)
    ? parsed.reminders
        .filter((r: any) => r && typeof r === 'object' && typeof r.id === 'string')
        .map((r: any) => ({
          id: String(r.id).slice(0, 100),
          type: ['payment', 'khata', 'attendance', 'custom', 'activity'].includes(r.type) ? r.type : 'custom',
          title: escapeHtml(String(r.title || 'Reminder')).slice(0, 150),
          description: r.description ? escapeHtml(String(r.description)).slice(0, 500) : undefined,
          amount: r.amount ? Math.abs(Number(r.amount)) : undefined,
          dueDate: String(r.dueDate || '').slice(0, 20),
          dueTime: r.dueTime ? String(r.dueTime).slice(0, 10) : undefined,
          isCompleted: Boolean(r.isCompleted),
          repeat: ['none', 'daily', 'weekly', 'monthly'].includes(r.repeat) ? r.repeat : 'none',
          notifyViaBrowser: Boolean(r.notifyViaBrowser),
          createdAt: Number(r.createdAt) || Date.now()
        }))
    : [];

  // Sanitize Trash Items
  const trashItems = Array.isArray(parsed.trashItems)
    ? parsed.trashItems
        .filter((t: any) => t && typeof t === 'object' && typeof t.id === 'string')
        .map((t: any) => ({
          id: String(t.id).slice(0, 100),
          originalId: String(t.originalId || t.id).slice(0, 100),
          type: t.type || 'entry',
          title: escapeHtml(String(t.title || 'Deleted Item')).slice(0, 150),
          subtitle: t.subtitle ? escapeHtml(String(t.subtitle)).slice(0, 200) : undefined,
          amount: t.amount ? Number(t.amount) : undefined,
          dateDeleted: String(t.dateDeleted || new Date().toISOString()).slice(0, 40),
          data: t.data
        }))
    : [];

  // Sanitize Category Budgets
  const budgets = Array.isArray(parsed.budgets)
    ? parsed.budgets
        .filter((b: any) => b && typeof b === 'object' && typeof b.category === 'string')
        .map((b: any) => ({
          category: escapeHtml(String(b.category)).slice(0, 100),
          monthlyLimit: Math.abs(Number(b.monthlyLimit) || 0)
        }))
    : [];

  // Sanitize settings, never exposing plaintext credentials
  const settings = parsed.settings && typeof parsed.settings === 'object' ? { ...parsed.settings } : {};
  if (settings.securityLock && typeof settings.securityLock === 'object') {
    // Redact plaintext PIN / answer from imported/exported settings
    const lock = settings.securityLock;
    settings.securityLock = {
      isEnabled: Boolean(lock.isEnabled),
      pin: lock.pin ? String(lock.pin).slice(0, 20) : '',
      securityQuestion: lock.securityQuestion ? escapeHtml(String(lock.securityQuestion)).slice(0, 200) : undefined,
      securityQuestionId: lock.securityQuestionId ? String(lock.securityQuestionId).slice(0, 100) : undefined,
      securityAnswer: lock.securityAnswer ? String(lock.securityAnswer).slice(0, 100) : '',
      autoLockOnLeave: Boolean(lock.autoLockOnLeave),
      autoLockTimeoutMinutes: Number(lock.autoLockTimeoutMinutes) || 0
    };
  }

  return {
    entries: sanitizedEntries,
    categories,
    incomeSources,
    workCategories,
    lifeTags,
    goals,
    workLogs: Array.isArray(parsed.workLogs) ? parsed.workLogs : [],
    dailyLifeLogs: Array.isArray(parsed.dailyLifeLogs) ? parsed.dailyLifeLogs : [],
    personalNotes,
    attendanceLogs,
    debtItems,
    reminders,
    trashItems,
    budgets,
    khataBooks: Array.isArray(parsed.khataBooks) ? parsed.khataBooks : undefined,
    invoices: Array.isArray(parsed.invoices) ? parsed.invoices : undefined,
    exportVersion: Number(parsed.exportVersion) || 3,
    exportedAt: parsed.exportedAt ? String(parsed.exportedAt) : new Date().toISOString(),
    funds: Array.isArray(parsed.funds) ? parsed.funds : undefined,
    homepageFundIds: Array.isArray(parsed.homepageFundIds) ? parsed.homepageFundIds : undefined,
    settings: {
      percentages: settings.percentages || {},
      funds: settings.funds,
      homepageFundIds: settings.homepageFundIds,
      theme: settings.theme,
      language: settings.language,
      privacyMask: settings.privacyMask,
      viewMode: settings.viewMode,
      appLayout: settings.appLayout,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      securityLock: settings.securityLock
    }
  };
}
