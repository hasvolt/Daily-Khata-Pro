import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { AppLanguage } from '../types';

interface OfflineIndicatorProps {
  language?: AppLanguage;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language = 'en' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnectedToast, setShowReconnectedToast] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const isHindi = language === 'hi';

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Back online brief confirmation banner
  if (showReconnectedToast) {
    return (
      <div 
        id="pwa-online-reconnect-badge"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white shadow-2xl border border-emerald-400/40 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        <Wifi className="w-4 h-4 text-emerald-200 animate-pulse" />
        <span>
          {isHindi ? 'इंटरनेट कनेक्ट हो गया — बैकअप व सिंक सक्रिय' : 'Back Online — Cloud sync & live feeds restored'}
        </span>
      </div>
    );
  }

  // If user is online or dismissed the banner, don't display
  if (isOnline || isDismissed) {
    return null;
  }

  return (
    <aside 
      id="pwa-offline-status-banner"
      aria-label="Offline Mode Notice"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl bg-slate-900/95 text-slate-100 border border-amber-500/40 shadow-2xl p-3.5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 text-left"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
          <WifiOff className="w-4 h-4 animate-pulse" />
        </div>
        
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-amber-400 tracking-wide uppercase">
              {isHindi ? '100% ऑफ़लाइन मोड' : '100% Offline Mode'}
            </span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {isHindi ? 'डिवाइस पर सुरक्षित' : 'Safe on Device'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {isHindi 
              ? 'इंटरनेट बंद होने पर भी आपका दैनिक खाता, सभी कैलकुलेटर, लोन बहीखाता व नोट्स पूरी तरह काम कर रहे हैं।'
              : 'Daily Khata is fully functional offline. Income, expenses, calculators, loans and notes save safely to device storage.'}
          </p>

          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              {isHindi ? 'लोकल सेविंग चालू' : 'Local Storage Active'}
            </span>
            <span>•</span>
            <span>
              {isHindi ? 'नेटवर्क आते ही स्वतः सिंक' : 'Auto-syncs on reconnect'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          title={isHindi ? 'छिपाएं' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
