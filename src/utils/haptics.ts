/**
 * Native Haptic Feedback & Vibration Engine
 * Provides native-app tactile feedback for APK, PWA, Android, and iOS WebViews.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

export const triggerHaptic = (type: HapticType = 'light'): void => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(35);
          break;
        case 'success':
          navigator.vibrate([15, 40, 20]);
          break;
        case 'warning':
          navigator.vibrate([25, 50, 25]);
          break;
        case 'error':
          navigator.vibrate([40, 60, 40, 60, 50]);
          break;
        default:
          navigator.vibrate(12);
      }
    }
  } catch {
    // Ignore if vibration is restricted or not permitted by browser sandbox
  }
};
