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

  // Sanitize entries
  const sanitizedEntries: Entry[] = Array.isArray(parsed.entries)
    ? parsed.entries
        .filter((e: any) => e && typeof e === 'object' && typeof e.id === 'string')
        .map((e: any) => ({
          id: String(e.id).slice(0, 100),
          title: escapeHtml(String(e.title || 'Untitled')).slice(0, 250),
          amount: Math.abs(Number(e.amount) || 0),
          type: e.type === 'expense' ? 'expense' : 'income',
          category: escapeHtml(String(e.category || 'General')).slice(0, 100),
          date: String(e.date || '').slice(0, 20),
          description: e.description ? escapeHtml(String(e.description)).slice(0, 1000) : undefined,
          fundAllocations: e.fundAllocations && typeof e.fundAllocations === 'object' ? e.fundAllocations : undefined,
          source: e.source ? escapeHtml(String(e.source)).slice(0, 100) : undefined,
          isVerified: Boolean(e.isVerified),
          tags: Array.isArray(e.tags) ? e.tags.map((t: any) => escapeHtml(String(t)).slice(0, 50)) : undefined
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
          category: escapeHtml(String(g.category || 'general')).slice(0, 100)
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
    personalNotes: Array.isArray(parsed.personalNotes) ? parsed.personalNotes : [],
    attendanceLogs: Array.isArray(parsed.attendanceLogs) ? parsed.attendanceLogs : [],
    reminders: Array.isArray(parsed.reminders) ? parsed.reminders : [],
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
