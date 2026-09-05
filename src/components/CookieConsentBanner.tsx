import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, Settings2, X, ChevronDown, ChevronUp, Lock, ExternalLink } from 'lucide-react';
import { AppLanguage } from '../types';
import {
  getCookieConsent,
  saveCookieConsent,
  CookieConsentData,
  CookiePreferences
} from '../utils/cookieConsent';
import { triggerHaptic } from '../utils/haptics';

interface CookieConsentBannerProps {
  language?: AppLanguage;
  onOpenPolicy?: () => void;
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  language = 'en',
  onOpenPolicy,
  forceOpen = false,
  onCloseForceOpen
}) => {
  const isHindi = language === 'hi';
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    advertising: true
  });

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setPrefs(existing.preferences);
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      const existing = getCookieConsent();
      if (existing) {
        setPrefs(existing.preferences);
      }
      setIsVisible(true);
      setShowCustomize(true);
    }
  }, [forceOpen]);

  const handleAcceptAll = () => {
    triggerHaptic('medium');
    saveCookieConsent('accepted');
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleEssentialOnly = () => {
    triggerHaptic('light');
    saveCookieConsent('essential_only');
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleSaveCustom = () => {
    triggerHaptic('medium');
    saveCookieConsent('custom', prefs);
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Storage Consent"
      className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
    >
      <div className="bg-[var(--theme-card,#132438)]/95 backdrop-blur-md border border-[var(--theme-border,#213E61)] shadow-2xl rounded-2xl p-4 sm:p-5 text-left text-[var(--theme-text,#F8FAFC)] overflow-hidden relative">
        {/* Top Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary,#38BDF8)] via-[#10B981] to-[var(--theme-primary,#38BDF8)]" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[14px] sm:text-[15px] text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'कुकीज़ व डेटा अनुमति' : 'Cookie & Storage Consent'}
                </h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30">
                  {isHindi ? 'सुरक्षित' : 'PRIVATE'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? '100% ऑफ़लाइन लोकल स्टोरेज उपयोग' : '100% Client-Side Device Storage'}
              </p>
            </div>
          </div>

          {forceOpen && (
            <button
              onClick={() => {
                setIsVisible(false);
                if (onCloseForceOpen) onCloseForceOpen();
              }}
              className="p-1 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-white hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-[12px] sm:text-[12.5px] text-[var(--theme-text-muted,#94A3B8)] leading-relaxed mb-3">
          {isHindi
            ? 'Daily Khata Pro आपके वित्तीय रिकॉर्ड, पासवर्ड (PIN) और थीम सेटिंग्स को सुरक्षित रखने के लिए आपके डिवाइस के LocalStorage का उपयोग करता है। हम आपका डेटा किसी भी सर्वर पर ट्रैक या अपलोड नहीं करते।'
            : 'Daily Khata Pro uses browser LocalStorage & essential cookies to store your financial logs, PIN encryption, and theme preferences securely on your device. Zero external cloud tracking.'}
        </p>

        {/* Read policy link */}
        <div className="mb-3.5">
          <button
            type="button"
            onClick={() => {
              if (onOpenPolicy) {
                onOpenPolicy();
              }
            }}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--theme-primary,#38BDF8)] hover:underline cursor-pointer"
          >
            <span>{isHindi ? 'हमारी सम्पूर्ण कुकीज़ नीति पढ़ें' : 'Read Full Cookies Policy'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Expandable Customization Panel */}
        {showCustomize && (
          <div className="p-3 mb-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 space-y-2.5 animate-in fade-in duration-200">
            {/* Essential */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--theme-border,#213E61)]/50 text-[11.5px]">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[var(--theme-text,#F8FAFC)]">
                  <Lock className="w-3.5 h-3.5 text-green-400" />
                  <span>{isHindi ? 'अत्यावश्यक स्टोरेज (Essential)' : 'Strictly Necessary'}</span>
                </div>
                <p className="text-[10px] text-[var(--theme-text-dim,#64748B)]">
                  {isHindi ? 'खाता रिकॉर्ड्स, पिन सुरक्षा, ऑफ़लाइन फंक्शन' : 'Financial ledger, PIN protection, offline data'}
                </p>
              </div>
              <span className="text-[10px] font-bold text-green-400 uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                {isHindi ? 'अनिवार्य' : 'Required'}
              </span>
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--theme-border,#213E61)]/50 text-[11.5px]">
              <div>
                <div className="font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'पसंद व अनुकूलन (Preferences)' : 'Functional & Themes'}
                </div>
                <p className="text-[10px] text-[var(--theme-text-dim,#64748B)]">
                  {isHindi ? 'डार्क/लाइट मोड, भाषा, फॉन्ट साइज़' : 'Dark/light theme, language, font scale'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.functional}
                  onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--theme-primary,#38BDF8)]"></div>
              </label>
            </div>

            {/* Advertising */}
            <div className="flex items-center justify-between gap-2 text-[11.5px]">
              <div>
                <div className="font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'विज्ञापन व प्रायोजक (Ads & Sponsors)' : 'Ads & Sponsor Support'}
                </div>
                <p className="text-[10px] text-[var(--theme-text-dim,#64748B)]">
                  {isHindi ? 'गूगल ऐडसेंस नॉन-इंट्रूसिव बैनर डिस्प्ले' : 'Google AdSense non-intrusive ads'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.advertising}
                  onChange={(e) => setPrefs({ ...prefs, advertising: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--theme-primary,#38BDF8)]"></div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {showCustomize ? (
            <>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isHindi ? 'प्राथमिकताएं सहेजें' : 'Save Preferences'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="py-2 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] font-bold text-[12px] transition-all cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Back'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isHindi ? 'सभी स्वीकारें' : 'Accept All'}</span>
              </button>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="py-2 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[12px] transition-all cursor-pointer"
              >
                {isHindi ? 'केवल आवश्यक' : 'Essential Only'}
              </button>

              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-all cursor-pointer"
                title={isHindi ? 'पसंद कस्टमाइज़ करें' : 'Customize preferences'}
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
