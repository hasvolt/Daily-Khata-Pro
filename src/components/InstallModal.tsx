import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Apple,
  CheckCircle2,
  Share2,
  PlusSquare,
  WifiOff,
  Zap,
  ShieldCheck,
  HardDriveDownload,
  ExternalLink,
  Copy,
  Check,
  Globe,
  FileCode,
  Sparkles,
  Info
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { AppLanguage } from '../types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
  installPrompt?: BeforeInstallPromptEvent | null;
  onTriggerInstall?: () => void;
}

type PlatformTab = 'android' | 'ios' | 'desktop';

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  installPrompt = null,
  onTriggerInstall
}) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('android');
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [installStatusMsg, setInstallStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    // Detect if inside an iframe (like AI Studio preview or embedded viewer)
    try {
      if (window.self !== window.top) {
        setIsIframe(true);
      }
    } catch {
      setIsIframe(true);
    }

    // Detect device OS for smart default tab
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream) {
      setActiveTab('ios');
    } else if (/android/i.test(userAgent)) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleInstallClick = async () => {
    // Check available prompt (passed prop or global window fallback)
    const promptEvent = installPrompt || (window as unknown as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt;

    if (promptEvent && typeof promptEvent.prompt === 'function') {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          setInstallStatusMsg(isHindi ? 'ऐप सफलतापूर्वक इंस्टॉल हो गया!' : 'App successfully added to your home screen!');
          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          setInstallStatusMsg(isHindi ? 'इंस्टॉलेशन रद्द किया गया। आप कभी भी मेनू से इंस्टॉल कर सकते हैं।' : 'Install was dismissed. You can try again anytime.');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
        showFallbackGuide();
      }
    } else if (onTriggerInstall) {
      onTriggerInstall();
    } else {
      showFallbackGuide();
    }
  };

  const showFallbackGuide = () => {
    if (isIframe) {
      setInstallStatusMsg(
        isHindi
          ? 'iFrame प्रीव्यू में डायरेक्ट इंस्टॉल सपोर्टेड नहीं है। कृपया "नये टैब में खोलें" बटन दबाएं।'
          : 'Direct install is restricted inside iframe preview. Please click "Open in New Tab" to install.'
      );
    } else if (activeTab === 'ios') {
      setInstallStatusMsg(
        isHindi
          ? 'iPhone / Safari में इंस्टॉल करने के लिए नीचे दिए गए 3 आसान स्टेप्स फॉलो करें।'
          : 'To install on iPhone/iPad, please follow the 3 steps below using Safari Share menu.'
      );
    } else {
      setInstallStatusMsg(
        isHindi
          ? 'ब्राउज़र मेनू (⋮) खोलकर "Add to Home screen" या "Install app" चुनें।'
          : 'Open your browser menu (⋮) and tap "Install app" or "Add to Home screen".'
      );
    }
  };

  const handleOpenInNewTab = () => {
    const fullUrl = window.location.href;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback copy
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownloadOfflineHTML = () => {
    setDownloadingOffline(true);
    try {
      const offlineDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily Khata Pro - Offline App Launcher</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #070E18; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #132438; border: 1px solid #213E61; border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    h1 { font-size: 24px; margin-bottom: 8px; color: #38BDF8; }
    p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #38BDF8; color: #040D17; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 15px; margin: 6px; }
    .btn:hover { filter: brightness(1.1); }
    .btn-secondary { background: #1E293B; color: #F8FAFC; border: 1px solid #334155; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">OFFLINE BACKUP LAUNCHER</div>
    <h1>Daily Khata Pro</h1>
    <p>Professional Universal Daily Income & Expense Tracker with 6-Fund System, Deliverables, Goals & Ledger.</p>
    <a href="${window.location.href}" class="btn">🚀 Open Full Web App</a>
    <p style="margin-top: 20px; font-size: 12px; color: #64748B;">For full offline access, add this page to your mobile home screen via browser menu.</p>
  </div>
</body>
</html>`;
      const blob = new Blob([offlineDoc], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Daily-Khata-Pro-Offline-Launcher-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setInstallStatusMsg(isHindi ? 'ऑफलाइन HTML लॉन्चर डाउनलोड हो गया!' : 'Offline HTML Launcher downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingOffline(false), 1200);
    }
  };

  const hasNativePrompt = Boolean(installPrompt || (typeof window !== 'undefined' && (window as unknown as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 no-print text-left">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex justify-between items-center bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-3">
            <HasVoltLogo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                  {isHindi ? 'ऐप इंस्टॉल / डाउनलोड करें' : 'Install & Download App'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  OFFLINE PWA
                </span>
              </div>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? '100% ऑफलाइन इस्तेमाल के लिए अपने फोन या कंप्यूटर पर जोड़ें' : 'Add to home screen for instant 100% offline access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-[#CBD5E1]">
          {/* Main Action Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--theme-surface,#0E1A29)] to-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/40 shadow-lg relative overflow-hidden space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 shadow-inner">
                  <Download className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-[#F8FAFC] flex items-center gap-2">
                    <span>{isHindi ? 'डेली खाता: प्रो PWA' : 'Daily Khata: Pro App'}</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">v2.4</span>
                  </div>
                  <div className="text-[12px] text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                    <WifiOff className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{isHindi ? 'बिना इंटरनेट के भी 100% काम करता है' : 'Works 100% Offline with zero internet'}</span>
                  </div>
                </div>
              </div>

              {/* Install / Already Installed Button */}
              {isInstalled ? (
                <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-bold text-[13px] flex items-center justify-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'इंस्टॉल हो चुका है' : 'Already Installed'}</span>
                </div>
              ) : installSuccess ? (
                <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#10B981] text-[#04140D] font-bold text-[13px] flex items-center justify-center gap-1.5 shrink-0 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'सफलतापूर्वक इंस्टॉल हुआ!' : 'Installed Successfully!'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <HardDriveDownload className="w-4.5 h-4.5" />
                  <span>{hasNativePrompt ? (isHindi ? 'अभी इंस्टॉल करें' : 'Install App Now') : (isHindi ? 'इंस्टॉल / होम स्क्रीन' : 'Install / Add to Home')}</span>
                </button>
              )}
            </div>

            {/* If inside iframe preview, show direct open link */}
            {isIframe && (
              <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px]">
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? 'प्रीव्यू में हैं? फुल ब्राउज़र टैब में खोलकर 1-क्लिक इंस्टॉल करें:' : 'Inside preview? Open in standalone tab to trigger native install:'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="px-3 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[11.5px] flex items-center gap-1 shrink-0 hover:brightness-110 cursor-pointer"
                >
                  <span>{isHindi ? 'नये टैब में खोलें' : 'Open in New Tab'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Status Message / Notification */}
            {installStatusMsg && (
              <div className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>{installStatusMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Utility Downloads (Offline HTML & Copy Link) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{isHindi ? 'नये टैब में खोलें' : 'Launch Full Tab'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadOfflineHTML}
              disabled={downloadingOffline}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[12px] font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{downloadingOffline ? (isHindi ? 'डाउनलोड हो रहा...' : 'Downloading...') : (isHindi ? 'ऑफलाइन HTML फाइल' : 'Download Offline App')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#F59E0B] text-[12px] font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#F59E0B]" />}
              <span>{isCopied ? (isHindi ? 'लिंक कॉपी हो गया!' : 'Link Copied!') : (isHindi ? 'ऐप लिंक कॉपी करें' : 'Copy App Link')}</span>
            </button>
          </div>

          {/* Platform Guide Tabs */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8]">
                {isHindi ? 'अपने डिवाइस के अनुसार 3-स्टेप गाइड देखें:' : 'Step-by-Step Device Guide:'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-2 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-2 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`py-2 px-2 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>

            {/* TAB CONTENT: ANDROID */}
            {activeTab === 'android' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                    <Smartphone className="w-4 h-4 text-[#10B981]" />
                    <span>{isHindi ? 'Android (Chrome / Samsung / Brave)' : 'Android Chrome / Samsung Internet'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">Auto-Update</span>
                </div>
                <div className="space-y-2 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>ऊपर दिए गए <strong className="text-[#F8FAFC]">"अभी इंस्टॉल करें"</strong> बटन को दबाएं, या Chrome ब्राउज़र में ऊपर दाएं कोने पर <strong>3 डॉट्स (⋮)</strong> मेनू खोलें।</>
                      ) : (
                        <>Tap the <strong className="text-[#F8FAFC]">"Install App Now"</strong> button above, or tap the top-right <strong>3 dots (⋮)</strong> menu in Chrome.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <>मेन्यू में से <strong className="text-[#F8FAFC]">"Install app"</strong> या <strong className="text-[#F8FAFC]">"Add to Home screen" (होम स्क्रीन में जोड़ें)</strong> चुनें।</>
                      ) : (
                        <>Select <strong className="text-[#F8FAFC]">"Install app"</strong> or <strong className="text-[#F8FAFC]">"Add to Home screen"</strong> from the menu.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#10B981]">"Install"</strong> पर कन्फर्म करें। ऐप का आइकन तुरंत आपके फोन की होम स्क्रीन पर आ जाएगा और फुलस्क्रीन खुलेगा!</>
                      ) : (
                        <>Confirm <strong className="text-[#10B981]">"Install"</strong>. The Daily Khata icon will appear on your phone screen and open in full-screen standalone mode!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: IOS */}
            {activeTab === 'ios' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                    <Apple className="w-4 h-4 text-[#38BDF8]" />
                    <span>{isHindi ? 'iPhone और iPad (Apple Safari ब्राउज़र)' : 'iPhone & iPad (Apple Safari Browser)'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">iOS Safari</span>
                </div>
                <div className="space-y-2 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>Safari ब्राउज़र में सबसे नीचे दिए गए <strong className="text-[#F8FAFC]">Share बटन ( <Share2 className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> पर टैप करें।</>
                      ) : (
                        <>In Apple Safari, tap the bottom <strong className="text-[#F8FAFC]">Share button ( <Share2 className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong>.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <>नीचे स्क्रॉल करके <strong className="text-[#F8FAFC]">"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> पर टैप करें।</>
                      ) : (
                        <>Scroll down and tap <strong className="text-[#F8FAFC]">"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong>.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      {isHindi ? (
                        <>ऊपर दाएं कोने में <strong className="text-[#10B981]">"Add"</strong> दबाएं। अब ऐप आपके iPhone पर बिना इंटरनेट के भी सुपरफास्ट चलेगा!</>
                      ) : (
                        <>Tap <strong className="text-[#10B981]">"Add"</strong> in the top right corner. Daily Khata is now installed on your iOS home screen!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DESKTOP */}
            {activeTab === 'desktop' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                    <Laptop className="w-4 h-4 text-[#F59E0B]" />
                    <span>{isHindi ? 'Windows PC / Mac / Chrome / Edge' : 'Windows PC / Mac (Chrome & Edge)'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-full border border-[#F59E0B]/30">Desktop PWA</span>
                </div>
                <div className="space-y-2 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>ब्राउज़र के एड्रेस बार (URL bar) के दाएं तरफ <strong className="text-[#F8FAFC]">Install Icon (⤓)</strong> देखें या ऊपर दिए गए बटन को दबाएं।</>
                      ) : (
                        <>Look for the <strong className="text-[#F8FAFC]">Install Icon (⤓)</strong> on the right side of the address bar or click the install button above.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#10B981]">"Install"</strong> पर क्लिक करें। यह आपके कंप्यूटर पर एक अलग नेटिव डेस्कटॉप ऐप की तरह खुल जाएगा!</>
                      ) : (
                        <>Click <strong className="text-[#10B981]">"Install"</strong>. Daily Khata will now run as a standalone desktop app with its own taskbar shortcut!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8]">
              {isHindi ? 'ऐप इंस्टॉल करने के खास फायदे:' : 'Key App Features & Offline Benefits:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981] shrink-0 mt-0.5">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? '100% ऑफलाइन चलता है' : '100% Offline Ready'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'इंटरनेट कटे होने पर भी हिसाब जोड़ें और देखें' : 'Add & view income/expenses without active internet'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? 'सुपरफास्ट स्पीड' : 'Instant Launch'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'सीधे फुलस्क्रीन ऐप की तरह खुलता है' : 'Opens immediately from home screen in fullscreen'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? 'सुरक्षित और प्राइवेट' : '100% Private Local Storage'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'आपका वित्तीय डेटा केवल आपके डिवाइस में सुरक्षित रहता है' : 'All accounts stay safely on your local device only'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? 'हमेशा फ्री और नो ऐड्स' : 'Free Forever & No Ads'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'कोई सब्सक्रिप्शन या छुपा शुल्क नहीं' : 'No subscription fees, 6-fund system included'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{isHindi ? 'PWA सर्विस वर्कर सक्रिय' : 'PWA Service Worker Active'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12px] cursor-pointer transition-colors"
          >
            {isHindi ? 'ठीक है (Done)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
