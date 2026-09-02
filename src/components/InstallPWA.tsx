import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { AppLanguage } from '../types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPWAProps {
  language?: AppLanguage;
  onOpenInstallModal: () => void;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({
  language = 'en',
  onOpenInstallModal,
  installPrompt
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

  if (isStandalone || isDismissed) {
    return null;
  }

  const isHindi = language === 'hi';

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const promptEvent = installPrompt || (typeof window !== 'undefined' && (window as any).deferredPrompt);
    if (promptEvent && typeof promptEvent.prompt === 'function') {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsDismissed(true);
        }
      } catch {
        onOpenInstallModal();
      }
    } else {
      onOpenInstallModal();
    }
  };

  return (
    <div className="fixed bottom-[74px] sm:bottom-[80px] left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500 w-[94%] max-w-md no-print pointer-events-auto">
      <div className="bg-[var(--theme-surface,#0E1A29)]/95 text-[#F8FAFC] backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-between gap-3 shadow-[var(--theme-primary,#38BDF8)]/10">
        <div
          onClick={handleClick}
          className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
            <Download className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#F8FAFC] truncate">
                {isHindi ? 'डेली खाता ऐप इंस्टॉल करें' : 'Install Daily Khata App'}
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 shrink-0">
                100% Offline
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8] truncate">
              {isHindi ? 'होम स्क्रीन पर जोड़ें और बिना नेट चलाएं' : 'Add to home screen for fast offline access'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleClick}
            className="text-[12px] font-extrabold px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] hover:brightness-110 active:scale-95 transition-transform shadow-xs cursor-pointer"
          >
            {isHindi ? 'इंस्टॉल' : 'Install'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
