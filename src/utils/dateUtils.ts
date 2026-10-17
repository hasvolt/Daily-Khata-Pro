/**
 * Robust Local Date Utilities
 * Fixes timezone bug where UTC `toISOString().slice(0, 10)` returned yesterday's date
 * in UTC+ offset zones (e.g., India UTC+5:30) between 12:00 AM and 5:30 AM.
 */

/**
 * Returns formatted YYYY-MM-DD string according to the user's LOCAL timezone.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns formatted YYYY-MM string according to the user's LOCAL timezone.
 */
export function getLocalMonthString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Returns YYYY-MM-DD date string for N days ago in user's LOCAL timezone.
 */
export function getDaysAgoDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return getLocalDateString(d);
}

/**
 * Normalizes any date string or Date object into valid local YYYY-MM-DD.
 */
export function normalizeDateToLocal(val: string | Date | undefined | null): string {
  if (!val) return getLocalDateString();
  if (val instanceof Date) return getLocalDateString(val);
  const trimmed = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parsed = new Date(val);
  if (isNaN(parsed.getTime())) return getLocalDateString();
  return getLocalDateString(parsed);
}
