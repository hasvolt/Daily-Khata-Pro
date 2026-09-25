import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X, ArrowUpCircle } from 'lucide-react';
import { APP_VERSION_TAG } from '../utils/version';
import { triggerHapticSound } from '../utils/khataCalculations';

interface UpdateNotificationProps {
  isHindi?: boolean;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({ isHindi = false }) => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Listen for Service Worker updatefound -> installed event
    const handleUpdateAvailable = () => {
      setHasUpdate(true);
      setIsDismissed(false);
    };

    window.addEventListener('app-update-available', handleUpdateAvailable);

    // 2. Also check if a service worker is already waiting
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setHasUpdate(true);
        }
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('app-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleApplyUpdate = async () => {
    triggerHapticSound('save');
    setIsUpdating(true);

    try {
      // 1. Post SKIP_WAITING to waiting worker if available
      const waitingWorker = (window as unknown as { __dailyKhataWaitingWorker?: ServiceWorker }).__dailyKhataWaitingWorker;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      }

      // 2. Also call force refresh if defined in index.html
      const forceRefreshFn = (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__?: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__;
      if (typeof forceRefreshFn === 'function') {
        await forceRefreshFn();
      } else {
        // Fallback: update all registrations
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const reg of regs) {
            if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            if (reg.installing) reg.installing.postMessage({ type: 'SKIP_WAITING' });
          }
        }
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch {
      window.location.reload();
    }
  };

  if (!hasUpdate || isDismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed top-2 sm:top-4 inset-x-3 sm:inset-x-auto sm:right-4 sm:max-w-md z-[9999] rounded-2xl bg-[#0B1A2C] border-2 border-sky-400 p-3 sm:p-4 text-white shadow-[0_10px_35px_rgba(2,132,199,0.35)] animate-in slide-in-from-top duration-300 select-none notranslate"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
          {isUpdating ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 animate-pulse text-sky-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[13.5px] font-bold text-white leading-tight">
                {isHindi ? 'नया ऐप अपडेट उपलब्ध है!' : 'New Update Available!'}
              </h4>
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                {APP_VERSION_TAG}
              </span>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title={isHindi ? 'बंद करें' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11.5px] text-slate-300 mt-1 leading-snug">
            {isHindi
              ? 'Daily Khata Pro में नए सुधार और फ़ीचर्स जोड़े गए हैं। तुरंत लागू करने के लिए अपडेट करें।'
              : 'New improvements and fixes are ready. Update now to load the latest build smoothly.'}
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleApplyUpdate}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-[12px] shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-70"
            >
              <ArrowUpCircle className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>
                {isUpdating
                  ? (isHindi ? 'अपडेट हो रहा है...' : 'Updating...')
                  : (isHindi ? 'अभी अपडेट करें' : 'Update Now')}
              </span>
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setIsDismissed(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11.5px] font-semibold transition-colors cursor-pointer"
            >
              {isHindi ? 'बाद में' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
