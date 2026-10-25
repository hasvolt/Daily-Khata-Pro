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

/**
 * Formats a time string (e.g. "09:00", "18:30", "13:00") into 12-hour format with AM/PM (e.g. "09:00 AM", "06:30 PM", "01:00 PM").
 * Handles already formatted strings gracefully.
 */
export function formatTime12h(timeStr?: string | null): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (!trimmed) return '';
  
  if (/[ap]m/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  
  const parts = trimmed.split(':');
  if (parts.length < 2) return trimmed;
  
  const hoursNum = parseInt(parts[0], 10);
  const minutes = parts[1].slice(0, 2);
  if (isNaN(hoursNum)) return trimmed;
  
  const ampm = hoursNum >= 12 ? 'PM' : 'AM';
  let h12 = hoursNum % 12;
  if (h12 === 0) h12 = 12;

  return `${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function getCurrentTimeString(d: Date = new Date()): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export interface NoteDisplayDateTime {
  effectiveDate: string; // YYYY-MM-DD
  effectiveTime: string; // HH:mm or formatted
  formattedDate: string; // e.g. 24 Oct 2026
  formattedTime: string; // e.g. 10:30 PM
  relativeBadge: string; // e.g. "आज, 10:30 PM" or "Yesterday, 04:15 PM"
  isToday: boolean;
  isYesterday: boolean;
  isEdited: boolean;
  editedTimeStr?: string;
}

export function getNoteDisplayDateTime(
  note: { date?: string; time?: string; createdAt?: number; updatedAt?: number },
  isHindi: boolean = false
): NoteDisplayDateTime {
  const todayStr = getLocalDateString();
  const yesterdayStr = getDaysAgoDateString(1);

  // Fallback to createdAt if date or time is missing
  const createdDate = note.createdAt ? new Date(note.createdAt) : new Date();
  const effectiveDate = note.date || getLocalDateString(createdDate);

  let rawTime = note.time;
  if (!rawTime && note.createdAt) {
    const ch = String(createdDate.getHours()).padStart(2, '0');
    const cm = String(createdDate.getMinutes()).padStart(2, '0');
    rawTime = `${ch}:${cm}`;
  }
  const effectiveTime = rawTime || getCurrentTimeString();
  const formattedTime = formatTime12h(effectiveTime);

  // Formatted date string
  let formattedDate = effectiveDate;
  try {
    const parts = effectiveDate.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      formattedDate = d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  } catch {
    formattedDate = effectiveDate;
  }

  const isToday = effectiveDate === todayStr;
  const isYesterday = effectiveDate === yesterdayStr;

  let relativeBadge = '';
  if (isToday) {
    relativeBadge = isHindi ? `आज, ${formattedTime}` : `Today, ${formattedTime}`;
  } else if (isYesterday) {
    relativeBadge = isHindi ? `कल, ${formattedTime}` : `Yesterday, ${formattedTime}`;
  } else {
    relativeBadge = `${formattedDate} • ${formattedTime}`;
  }

  const isEdited = Boolean(
    note.updatedAt && note.createdAt && note.updatedAt - note.createdAt > 45000
  );

  let editedTimeStr: string | undefined = undefined;
  if (isEdited && note.updatedAt) {
    const editD = new Date(note.updatedAt);
    const editDateStr = getLocalDateString(editD);
    const editTimeFormatted = formatTime12h(
      `${String(editD.getHours()).padStart(2, '0')}:${String(editD.getMinutes()).padStart(2, '0')}`
    );
    if (editDateStr === todayStr) {
      editedTimeStr = isHindi ? `संशोधित: आज ${editTimeFormatted}` : `Edited: Today ${editTimeFormatted}`;
    } else {
      editedTimeStr = isHindi ? `संशोधित: ${editD.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}` : `Edited: ${editD.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
  }

  return {
    effectiveDate,
    effectiveTime,
    formattedDate,
    formattedTime,
    relativeBadge,
    isToday,
    isYesterday,
    isEdited,
    editedTimeStr
  };
}


