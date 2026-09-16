import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { AppLanguage } from '../types';

interface OfflineIndicatorProps {
  language?: AppLanguage;
}

const OFFLINE_SESSION_NOTIFIED_KEY = 'khata_offline_toast_notified_v1';
const OFFLINE_PERMANENT_DISMISS_KEY = 'khata_offline_popup_permanently_dismissed';

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language = 'en' }) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showReconnectedToast, setShowReconnectedToast] = useState<boolean>(false);

  const isHindi = language === 'hi';

  useEffect(() => {
    // If user opened app while already offline, NEVER throw a popup window in their face.
    // They already know they are offline and want a quiet, seamless experience.
    const wasAlreadyOfflineOnBoot = typeof navigator !== 'undefined' && !navigator.onLine;
    if (wasAlreadyOfflineOnBoot) {
      try {
        sessionStorage.setItem(OFFLINE_SESSION_NOTIFIED_KEY, 'true');
      } catch (e) {}
    }

    const handleOffline = () => {
      // Check if user already dismissed or already notified in this session
      try {
        const isPermanentlyDismissed = localStorage.getItem(OFFLINE_PERMANENT_DISMISS_KEY) === 'true';
        const isAlreadyNotified = sessionStorage.getItem(OFFLINE_SESSION_NOTIFIED_KEY) === 'true';
        if (isPermanentlyDismissed || isAlreadyNotified) {
          return;
        }
        // Mark as notified so it never repeats in this session
        sessionStorage.setItem(OFFLINE_SESSION_NOTIFIED_KEY, 'true');
      } catch (e) {}

      // Show a brief, non-intrusive 2.5s notification toast only once
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2800);
      return () => clearTimeout(timer);
    };

    const handleOnline = () => {
      setShowToast(false);
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDismissPermanently = () => {
    setShowToast(false);
    try {
      localStorage.setItem(OFFLINE_PERMANENT_DISMISS_KEY, 'true');
      sessionStorage.setItem(OFFLINE_SESSION_NOTIFIED_KEY, 'true');
    } catch (e) {}
  };

  // Brief reconnected confirmation toast (auto-disappears in 2.5s)
  if (showReconnectedToast) {
    return (
      <div 
        id="pwa-online-reconnect-badge"
        className="fixed bottom-16 sm:bottom-6 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 text-white shadow-xl border border-emerald-400/30 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
      >
        <Wifi className="w-3.5 h-3.5 text-emerald-200 animate-pulse shrink-0" />
        <span>
          {isHindi ? 'ऑनलाइन कनेक्टेड' : 'Back Online'}
        </span>
      </div>
    );
  }

  // Brief one-time subtle notification toast on network drop (auto-disappears in 2.8s)
  if (showToast) {
    return (
      <div 
        id="pwa-offline-brief-toast"
        role="status"
        aria-live="polite"
        className="fixed bottom-16 sm:bottom-6 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/95 text-slate-100 shadow-2xl border border-amber-500/40 text-xs font-medium backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
        <span className="text-amber-300 font-bold">
          {isHindi ? 'ऑफ़लाइन मोड' : 'Offline Mode'}
        </span>
        <span className="text-slate-300 text-[11px] hidden xs:inline">
          {isHindi ? '— डेटा डिवाइस में सुरक्षित सहेजा जा रहा है' : '— local saving active'}
        </span>
        <button
          type="button"
          onClick={handleDismissPermanently}
          className="p-1 -mr-1 text-slate-400 hover:text-slate-200 rounded-md transition cursor-pointer"
          title={isHindi ? 'बंद करें' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
};
