/**
 * Daily Khata Pro — Smart Reminders & Notification Engine
 * Handles background & foreground checking of scheduled bill alerts,
 * daily khata reminders, browser Web Notifications, lock-screen alerts, and audio chimes.
 */

import { AppReminder } from '../types';
import { triggerHapticSound } from './khataCalculations';

export interface DueCheckResult {
  updatedReminders: AppReminder[];
  triggeredReminders: AppReminder[];
  hasNewlyTriggered: boolean;
}

/**
 * Check if the browser or platform supports Notifications
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Get current browser notification permission
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (isNotificationSupported()) {
    return Notification.permission;
  }
  return 'denied';
};

/**
 * Request notification permission from user with error tolerance
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
};

/**
 * Accurate Unix timestamp calculation for a reminder's scheduled due date & time.
 * Handles both "HH:mm" and "H:mm", defaulting to 09:00 AM if no time is provided.
 */
export const getReminderTimestamp = (dueDate: string, dueTime?: string): number => {
  if (!dueDate) return 0;
  const time = dueTime && dueTime.trim() ? dueTime.trim() : '09:00';
  const parts = time.split(':');
  const h = parseInt(parts[0] || '9', 10);
  const m = parseInt(parts[1] || '0', 10);

  const [yStr, monStr, dStr] = dueDate.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(monStr, 10) - 1; // 0-indexed in JS Date
  const day = parseInt(dStr, 10);

  const date = new Date(year, month, day, h, m, 0, 0);
  return date.getTime();
};

/**
 * Robust notification dispatcher:
 * Prefers Service Worker Registration (essential for Android PWA / mobile Chrome & lock screen),
 * with graceful fallback to standard window Notification constructor.
 * Always includes tactile vibration patterns and sound markers.
 */
export const sendDeviceNotification = async (
  title: string,
  options: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
    vibrate?: number[];
    actions?: Array<{ action: string; title: string }>;
  } = {}
): Promise<boolean> => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const notificationOptions = {
    body: options.body || '',
    icon: options.icon || '/daily-khata-pro-v4.png',
    badge: options.badge || '/icons/icon-192x192.png',
    tag: options.tag || 'daily-khata-reminder',
    renotify: true,
    requireInteraction: options.requireInteraction ?? true,
    silent: false,
    vibrate: options.vibrate || [350, 150, 350, 150, 450],
    data: options.data || { url: '/?open=reminders' },
    actions: options.actions || [
      { action: 'open_reminders', title: 'View / देखें' },
      { action: 'add_entry', title: '+ Add Entry' }
    ]
  };

  // 1. Try ServiceWorkerRegistration.showNotification (standard for PWA & mobile lock screen)
  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      // First try active controller
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          options: notificationOptions
        });
      }

      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
      ]);

      if (registration && typeof registration.showNotification === 'function') {
        await registration.showNotification(title, notificationOptions as any);
        return true;
      }
    }
  } catch (swErr) {
    console.warn('SW showNotification was bypassed, trying standard Notification fallback:', swErr);
  }

  // 2. Fallback to standard window.Notification constructor (desktop browsers)
  try {
    const notif = new Notification(title, {
      body: notificationOptions.body,
      icon: notificationOptions.icon,
      badge: notificationOptions.badge,
      tag: notificationOptions.tag,
      data: notificationOptions.data,
      requireInteraction: notificationOptions.requireInteraction
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
      const event = new CustomEvent('open-reminders-modal');
      window.dispatchEvent(event);
    };

    return true;
  } catch (winErr) {
    console.warn('Standard window.Notification constructor failed:', winErr);
    return false;
  }
};

/**
 * Format date & time helper
 */
export const getCurrentDateTimeStrings = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return {
    currentDateStr: `${year}-${month}-${day}`,
    currentTimeStr: `${hours}:${minutes}`,
    nowTimestamp: now.getTime()
  };
};

/**
 * Evaluates whether an individual reminder is currently due or overdue
 * Uses precise millisecond timestamps rather than brittle string comparisons.
 */
export const isReminderDue = (
  reminder: AppReminder,
  currentDateStr?: string,
  currentTimeStr?: string,
  nowTimestamp?: number
): boolean => {
  if (reminder.isCompleted) return false;

  const now = nowTimestamp ?? Date.now();
  const targetTs = getReminderTimestamp(reminder.dueDate, reminder.dueTime);

  // If due time calculation was valid, use timestamp comparison
  if (targetTs > 0) {
    return targetTs <= now;
  }

  // Fallback to date strings if timestamp failed
  const curDate = currentDateStr || new Date().toISOString().slice(0, 10);
  if (reminder.dueDate < curDate) return true;
  if (reminder.dueDate === curDate) {
    if (!reminder.dueTime) return true;
    const curTime = currentTimeStr || `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    return reminder.dueTime <= curTime;
  }

  return false;
};

/**
 * Synchronize scheduled reminders with the Service Worker so background alarms
 * and Notification Triggers (TimestampTrigger) are queued at OS level.
 */
export const syncRemindersWithServiceWorker = async (
  reminders: AppReminder[],
  isHindi = false
): Promise<void> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const payload = reminders.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      amount: r.amount,
      dueDate: r.dueDate,
      dueTime: r.dueTime,
      targetTimestamp: getReminderTimestamp(r.dueDate, r.dueTime),
      isCompleted: !!r.isCompleted,
      notifyViaBrowser: r.notifyViaBrowser !== false
    }));

    // Post to active controller
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_REMINDERS',
        reminders: payload,
        isHindi
      });
    }

    // Also dispatch to ready registration
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
    ]);

    if (reg && reg.active) {
      reg.active.postMessage({
        type: 'SCHEDULE_REMINDERS',
        reminders: payload,
        isHindi
      });
    }
  } catch (err) {
    console.warn('Failed to sync reminders to ServiceWorker:', err);
  }
};

/**
 * Schedule a lock-screen test notification (e.g. 10 seconds from now).
 * Gives the user time to lock their phone and verify sound, vibration & lock screen display.
 */
export const scheduleLockScreenTest = async (
  delaySeconds = 10,
  isHindi = false
): Promise<{ success: boolean; error?: string }> => {
  if (!isNotificationSupported()) {
    return {
      success: false,
      error: isHindi
        ? 'इस ब्राउज़र में नोटिफिकेशन सपोर्ट उपलब्ध नहीं है।'
        : 'Browser notifications are not supported on this device/browser.'
    };
  }

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await requestNotificationPermission();
  }

  if (permission !== 'granted') {
    return {
      success: false,
      error: isHindi
        ? 'नोटिफिकेशन अनुमति अस्वीकृत है। कृपया ब्राउज़र/फोन सेटिंग्स में अनुमति चालू करें।'
        : 'Notification permission is blocked. Please allow notifications in phone/browser settings.'
    };
  }

  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
      ]);

      if (reg) {
        if (reg.active) {
          reg.active.postMessage({
            type: 'SCHEDULE_LOCK_SCREEN_TEST',
            delaySeconds,
            isHindi
          });
          return { success: true };
        }
      }
    }

    // Fallback: client-side setTimeout if Service Worker is not responding
    setTimeout(() => {
      sendDeviceNotification(
        isHindi ? '🔔 Daily Khata Pro: लॉक स्क्रीन टेस्ट' : '🔔 Daily Khata Pro: Lock Screen Test',
        {
          body: isHindi
            ? 'टेस्ट सफल! फोन लॉक होने पर भी रिमाइंडर समय पर प्राप्त होगा।'
            : 'Test successful! Notifications will alert you on lock screen.',
          tag: 'lock-screen-test',
          vibrate: [500, 200, 500, 200, 500]
        }
      );
    }, delaySeconds * 1000);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to schedule test' };
  }
};

/**
 * Cancel a reminder in ServiceWorker
 */
export const cancelServiceWorkerReminder = async (reminderId: string): Promise<void> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CANCEL_REMINDER',
        reminderId
      });
    }
  } catch (err) {
    console.warn('Failed to cancel reminder in ServiceWorker:', err);
  }
};

/**
 * Main Scheduler Check:
 * Inspects all reminders, identifies newly due items, triggers chimes and device notifications,
 * and updates `lastNotifiedAt` to prevent loop spam while ensuring notifications are delivered.
 */
export const checkAndTriggerDueReminders = async (
  reminders: AppReminder[],
  isHindi = false
): Promise<DueCheckResult> => {
  if (!reminders || reminders.length === 0) {
    return { updatedReminders: reminders, triggeredReminders: [], hasNewlyTriggered: false };
  }

  const { currentDateStr, currentTimeStr, nowTimestamp } = getCurrentDateTimeStrings();
  const triggered: AppReminder[] = [];
  let hasNewlyTriggered = false;

  // Re-notify cooldown: Do not re-trigger system notification for the exact same reminder
  // within 2 hours unless it was edited or snoozed.
  const COOLDOWN_MS = 2 * 60 * 60 * 1000;

  const updatedReminders = reminders.map((r) => {
    if (r.isCompleted) return r;

    const due = isReminderDue(r, currentDateStr, currentTimeStr, nowTimestamp);
    if (!due) return r;

    const timeSinceLastNotified = r.lastNotifiedAt ? nowTimestamp - r.lastNotifiedAt : Infinity;
    const shouldNotify = !r.lastNotifiedAt || timeSinceLastNotified >= COOLDOWN_MS;

    if (shouldNotify) {
      triggered.push(r);
      hasNewlyTriggered = true;
      return {
        ...r,
        lastNotifiedAt: nowTimestamp
      };
    }

    return r;
  });

  if (hasNewlyTriggered && triggered.length > 0) {
    // Play dual-tone chime & haptic vibration
    triggerHapticSound('bell');

    // Trigger system notifications
    for (const item of triggered) {
      if (item.notifyViaBrowser !== false) {
        const title = isHindi
          ? `⏰ रिमाइंडर: ${item.title}`
          : `⏰ Reminder: ${item.title}`;

        const parts: string[] = [];
        if (item.amount) {
          parts.push(`₹${item.amount.toLocaleString('en-IN')}`);
        }
        if (item.dueTime) {
          parts.push(`समय: ${item.dueTime}`);
        }
        if (item.description) {
          parts.push(item.description);
        } else {
          parts.push(
            isHindi
              ? 'निर्धारित कार्य या भुगतान का समय आ चुका है।'
              : 'Your scheduled bill payment or khata task is due now.'
          );
        }

        sendDeviceNotification(title, {
          body: parts.join(' • '),
          tag: `rem-${item.id}`,
          vibrate: [400, 200, 400, 200, 500],
          data: { url: '/?open=reminders', reminderId: item.id }
        });
      }
    }
  }

  return {
    updatedReminders,
    triggeredReminders: triggered,
    hasNewlyTriggered
  };
};

/**
 * Snooze a reminder:
 * - by 1 hour (updates dueTime or pushes by +60 mins)
 * - or by N days (updates dueDate)
 */
export const snoozeReminder = (
  reminder: AppReminder,
  type: '1hour' | '1day' | '3days'
): AppReminder => {
  const now = new Date();

  if (type === '1hour') {
    const futureDate = new Date(now.getTime() + 60 * 60 * 1000);
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');

    return {
      ...reminder,
      dueDate: `${year}-${month}-${day}`,
      dueTime: `${hours}:${minutes}`,
      isCompleted: false,
      lastNotifiedAt: undefined
    };
  }

  const daysToAdd = type === '1day' ? 1 : 3;
  const targetDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return {
    ...reminder,
    dueDate: `${year}-${month}-${day}`,
    isCompleted: false,
    lastNotifiedAt: undefined
  };
};

/**
 * If reminder is recurring ('daily', 'weekly', 'monthly'), calculate next due date
 */
export const getNextRecurringReminder = (reminder: AppReminder): AppReminder | null => {
  if (!reminder.repeat || reminder.repeat === 'none') {
    return null;
  }

  const [y, m, d] = reminder.dueDate.split('-').map(Number);
  const baseDate = new Date(y, m - 1, d);

  if (reminder.repeat === 'daily') {
    baseDate.setDate(baseDate.getDate() + 1);
  } else if (reminder.repeat === 'weekly') {
    baseDate.setDate(baseDate.getDate() + 7);
  } else if (reminder.repeat === 'monthly') {
    baseDate.setMonth(baseDate.getMonth() + 1);
  }

  const nextY = baseDate.getFullYear();
  const nextM = String(baseDate.getMonth() + 1).padStart(2, '0');
  const nextD = String(baseDate.getDate()).padStart(2, '0');

  return {
    ...reminder,
    id: 'rem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    dueDate: `${nextY}-${nextM}-${nextD}`,
    isCompleted: false,
    lastNotifiedAt: undefined,
    createdAt: Date.now()
  };
};

/**
 * Send an immediate test notification to verify audio, vibration, and system display
 */
export const sendTestNotification = async (isHindi = false): Promise<{ success: boolean; error?: string }> => {
  triggerHapticSound('bell');

  if (!isNotificationSupported()) {
    return {
      success: false,
      error: isHindi
        ? 'इस ब्राउज़र में नोटिफिकेशन सपोर्ट उपलब्ध नहीं है।'
        : 'Browser notifications are not supported on this device/browser.'
    };
  }

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await requestNotificationPermission();
  }

  if (permission !== 'granted') {
    return {
      success: false,
      error: isHindi
        ? 'नोटिफिकेशन अनुमति अस्वीकृत (Denied) है। कृपया ब्राउज़र या फोन की सेटिंग्स में अनुमति चालू करें।'
        : 'Notification permission is blocked/denied. Please allow notifications in site/browser settings.'
    };
  }

  const sent = await sendDeviceNotification(
    isHindi ? '🔔 Daily Khata Pro: टेस्ट रिमाइंडर' : '🔔 Daily Khata Pro: Test Reminder Alert',
    {
      body: isHindi
        ? 'बधाई हो! आपके डिवाइस पर अलर्ट, साउंड और वाइब्रेशन सफलतापूर्वक सक्रिय हैं।'
        : 'Great news! Reminder alerts, sound, and vibration are active and working.',
      tag: 'daily-khata-test',
      vibrate: [400, 200, 400, 200, 400]
    }
  );

  return { success: sent };
};
