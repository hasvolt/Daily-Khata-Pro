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
  MoreVertical,
  WifiOff,
  Zap,
  ShieldCheck,
  HardDriveDownload,
  ExternalLink
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

  useEffect(() => {
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

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (onTriggerInstall) {
      onTriggerInstall();
    }
  };

  const isHindi = language === 'hi';

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
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-[#CBD5E1]">
          {/* Main Action Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--theme-surface,#0E1A29)] to-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/40 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 shadow-inner">
                  <Download className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-[#F8FAFC]">
                    {isHindi ? 'डेली खाता: प्रो ऐप' : 'Daily Khata: Pro App'}
                  </div>
                  <div className="text-[12px] text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                    <WifiOff className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{isHindi ? 'बिना इंटरनेट के भी पूरा काम करता है' : 'Works 100% Offline with zero internet'}</span>
                  </div>
                </div>
              </div>

              {/* Install Button */}
              {isInstalled ? (
                <div className="px-4 py-2 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-bold text-[13px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'इंस्टॉल हो चुका है' : 'Already Installed'}</span>
                </div>
              ) : installSuccess ? (
                <div className="px-4 py-2 rounded-xl bg-[#10B981] text-[#04140D] font-bold text-[13px] flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'सफलतापूर्वक इंस्टॉल हुआ!' : 'Installed Successfully!'}</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <HardDriveDownload className="w-4.5 h-4.5" />
                  <span>{isHindi ? 'अभी इंस्टॉल करें' : 'Install App Now'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Platform Guide Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8]">
                {isHindi ? 'अपने डिवाइस के अनुसार निर्देश देखें:' : 'Step-by-Step Guide for your Device:'}
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
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                  <Smartphone className="w-4 h-4 text-[#10B981]" />
                  <span>{isHindi ? 'Android (Chrome / Brave / Edge)' : 'Android Chrome / Edge / Samsung Internet'}</span>
                </div>
                <div className="space-y-2.5 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>ऊपर दिए गए <strong className="text-[#F8FAFC]">"अभी इंस्टॉल करें"</strong> बटन पर क्लिक करें या ब्राउज़र मेन्यू दबाएं।</>
                      ) : (
                        <>Click the <strong className="text-[#F8FAFC]">"Install App Now"</strong> button above, or open the browser menu.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#F8FAFC]">"Install app"</strong> या <strong className="text-[#F8FAFC]">"Add to Home screen"</strong> (होम स्क्रीन में जोड़ें) विकल्प चुनें।</>
                      ) : (
                        <>Select <strong className="text-[#F8FAFC]">"Install app"</strong> or <strong className="text-[#F8FAFC]">"Add to Home screen"</strong>.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#10B981]">"Install"</strong> पर कन्फर्म करें। ऐप आपके फोन की स्क्रीन पर नेटिव ऐप की तरह आ जाएगा!</>
                      ) : (
                        <>Confirm <strong className="text-[#10B981]">"Install"</strong>. The app icon will appear instantly on your phone's home screen!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: IOS */}
            {activeTab === 'ios' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                  <Apple className="w-4 h-4 text-[#38BDF8]" />
                  <span>{isHindi ? 'iPhone और iPad (Apple Safari ब्राउज़र)' : 'iPhone & iPad (Apple Safari Browser)'}</span>
                </div>
                <div className="space-y-2.5 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>Safari ब्राउज़र में सबसे नीचे दिए गए <strong className="text-[#F8FAFC]">Share बटन ( <Share2 className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> पर टैप करें।</>
                      ) : (
                        <>In Safari, tap the <strong className="text-[#F8FAFC]">Share button ( <Share2 className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> at the bottom bar.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <>नीचे स्क्रॉल करके <strong className="text-[#F8FAFC]">"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> चुनें।</>
                      ) : (
                        <>Scroll down and select <strong className="text-[#F8FAFC]">"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong>.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      {isHindi ? (
                        <>ऊपर कोने में <strong className="text-[#10B981]">"Add"</strong> दबाएं। अब ऐप आपके iPhone पर बिना इंटरनेट के भी चलेगा!</>
                      ) : (
                        <>Tap <strong className="text-[#10B981]">"Add"</strong> in the top right. Daily Khata is now installed on your iOS home screen!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DESKTOP */}
            {activeTab === 'desktop' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                  <Laptop className="w-4 h-4 text-[#F59E0B]" />
                  <span>{isHindi ? 'Windows PC / Mac / Chrome / Edge' : 'Windows PC / Mac (Chrome & Edge)'}</span>
                </div>
                <div className="space-y-2.5 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>ब्राउज़र के एड्रेस बार (Address bar) के दाएं तरफ <strong className="text-[#F8FAFC]">Install Icon</strong> देखें या ऊपर दिए गए बटन को दबाएं।</>
                      ) : (
                        <>Look for the <strong className="text-[#F8FAFC]">Install Icon</strong> in your address bar or click the button above.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#10B981]">"Install"</strong> पर क्लिक करें। यह आपके कंप्यूटर के डेस्कटॉप पर एक अलग ऐप विंडो में खुल जाएगा!</>
                      ) : (
                        <>Click <strong className="text-[#10B981]">"Install"</strong>. Daily Khata will now run as a dedicated desktop app with its own taskbar icon!</>
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
                    {isHindi ? 'बिना ब्राउज़र यूआरएल बार के सीधे फुलस्क्रीन ऐप की तरह खुलता है' : 'Opens immediately from home screen in fullscreen'}
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
                    {isHindi ? 'आपका वित्तीय डेटा केवल आपके फोन में सुरक्षित रहता है' : 'All accounts stay safely on your local device only'}
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
