import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  Lock,
  Database,
  Sliders,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  EyeOff,
  FileCheck,
  Mail,
  AlertCircle,
  HelpCircle,
  Laptop
} from 'lucide-react';
import { AppLanguage } from '../types';
import {
  getCookieConsent,
  saveCookieConsent,
  resetCookieConsent,
  CookieConsentData,
  CookiePreferences
} from '../utils/cookieConsent';
import { triggerHaptic } from '../utils/haptics';

interface CookiesPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const CookiesPage: React.FC<CookiesPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const isHindi = language === 'hi';
  const email = 'daily-Khata-Pro@gmail.com';

  const [consentData, setConsentData] = useState<CookieConsentData | null>(null);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    advertising: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const data = getCookieConsent();
    if (data) {
      setConsentData(data);
      setPrefs(data.preferences);
    }
  }, []);

  const handleSavePreferences = () => {
    triggerHaptic('medium');
    const updated = saveCookieConsent('custom', prefs);
    setConsentData(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    triggerHaptic('heavy');
    resetCookieConsent();
    setConsentData(null);
    setPrefs({
      essential: true,
      functional: true,
      advertising: true
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30 flex items-center gap-1.5">
            <Cookie className="w-3.5 h-3.5" />
            <span>{isHindi ? 'कुकीज़ व लोकल स्टोरेज नीति' : 'Cookies & Storage Policy'}</span>
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 border border-[var(--theme-primary,#38BDF8)]/30">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[24px] sm:text-[30px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight">
              {isHindi ? 'कुकीज़ और लोकल स्टोरेज नीति' : 'Cookies & Local Storage Policy'}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi
                ? 'Daily Khata Pro में आपके डेटा और कुकीज़ की सुरक्षा की पारदर्शी व्याख्या'
                : 'Transparent disclosure on device storage, cookies, and privacy controls'}
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[var(--theme-text,#CBD5E1)] mt-4 leading-relaxed">
          {isHindi
            ? 'Daily Khata Pro पूरी तरह से क्लाइंट-साइड (Client-Side) और ऑफ़लाइन-फर्स्ट वेब ऐप्लिकेशन है। हम उपयोगकर्ता की गोपनीयता को सर्वोपरि मानते हैं। यह नीति स्पष्ट रूप से समझाती है कि हम आपके डिवाइस के ब्राउज़र में किन डेटा टोकन्स व कुकीज़ का उपयोग करते हैं और आप उन्हें कैसे नियंत्रित कर सकते हैं।'
            : 'Daily Khata Pro is a client-side, 100% offline-first accounting application designed with privacy at its core. This policy explains how and why we utilize browser LocalStorage, session storage, and minimal third-party cookies, and provides you with full controls.'}
        </p>

        {/* 3 Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-green-400 font-bold text-[13px]">
              <HardDrive className="w-4 h-4" />
              <span>{isHindi ? '100% ऑन-डिवाइस' : '100% On-Device Vault'}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] mt-1">
              {isHindi ? 'लेज़र और वित्तीय डेटा केवल आपके फोन/पीसी पर रहता है' : 'Ledger & financial logs never leave your device'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[13px]">
              <EyeOff className="w-4 h-4" />
              <span>{isHindi ? 'शून्य ट्रैकिंग कुकीज़' : 'Zero Tracking Cookies'}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] mt-1">
              {isHindi ? 'कोई क्रॉस-साइट ट्रैकिंग या प्रोफाइलिंग नहीं की जाती' : 'No behavioral fingerprinting or cross-site tracking'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[13px]">
              <Sliders className="w-4 h-4" />
              <span>{isHindi ? 'उपयोगकर्ता का पूर्ण नियंत्रण' : 'Full User Control'}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] mt-1">
              {isHindi ? 'आप कभी भी अपनी प्राथमिकताएं बदल या हटा सकते हैं' : 'Easily revoke or adjust storage consent anytime'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Cookie Consent Manager */}
      <div className="bg-[var(--theme-card,#132438)] border-2 border-[var(--theme-primary,#38BDF8)]/40 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
            <h2 className="text-[17px] font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? 'आपकी कुकीज़ व स्टोरेज अनुमतियाँ (Consent Manager)' : 'Your Cookie & Storage Preferences'}
            </h2>
          </div>
          {consentData && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-semibold">
              {isHindi ? 'सहमति दर्ज है' : 'Consent Recorded'}
            </span>
          )}
        </div>

        <p className="text-[12.5px] text-[var(--theme-text-muted,#94A3B8)] mb-4">
          {isHindi
            ? 'आप नीचे दिए गए विकल्पों से नियंत्रित कर सकते हैं कि ऐप आपके डिवाइस पर किन अनुमतियों का उपयोग करे:'
            : 'Review and customize the storage categories allowed on this device:'}
        </p>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-[12px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isHindi ? 'आपकी प्राथमिकताएं सफलतापूर्वक सहेजी गईं!' : 'Preferences successfully saved on your device!'}</span>
          </div>
        )}

        <div className="space-y-3 mb-5">
          {/* 1. Essential */}
          <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                    {isHindi ? '1. अनिवार्य स्टोरेज (Strictly Necessary)' : '1. Strictly Necessary Storage'}
                  </span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase">
                    {isHindi ? 'आवश्यक' : 'Mandatory'}
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                  {isHindi
                    ? 'आपके खाते, आय-व्यय प्रविष्टियां, 6-फंड लेज़र, और पिन लॉक पासकोड को डिवाइस पर सुरक्षित रखने के लिए अपरिहार्य है।'
                    : 'Required for core accounting logs, offline transaction ledger, balance calculations, and PIN passcode security.'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-green-400 shrink-0">
              {isHindi ? 'सदा सक्रिय' : 'Always Active'}
            </span>
          </div>

          {/* 2. Functional */}
          <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 mt-0.5">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? '2. कार्यक्षमता व थीम पसंद (Preferences & Themes)' : '2. Functional & Interface Preferences'}
                </span>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                  {isHindi
                    ? 'डार्क/लाइट मोड, पसंदीदा भाषा (हिंदी/अंग्रेजी), फॉन्ट साइज़ और प्राइवेसी आई-मास्क स्थिति को याद रखता है।'
                    : 'Remembers active color theme, Hindi/English language selection, font scale, and privacy eye mask toggle.'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={prefs.functional}
                onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--theme-primary,#38BDF8)]"></div>
            </label>
          </div>

          {/* 3. Advertising & Sponsors */}
          <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? '3. गैर-आक्रामक विज्ञापन (AdSense / Non-Intrusive Ads)' : '3. Non-Intrusive Ads & Sponsors'}
                </span>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                  {isHindi
                    ? 'गूगल ऐडसेंस (Google AdSense) के गैर-आक्रामक बैनर विज्ञापनों के लिए कुकीज़ ताकि ऐप मुफ्त में उपलब्ध रह सके।'
                    : 'Standard Google AdSense cookies to serve contextually relevant, non-intrusive ads that keep this tool 100% free.'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={prefs.advertising}
                onChange={(e) => setPrefs({ ...prefs, advertising: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--theme-primary,#38BDF8)]"></div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-4 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHindi ? 'प्राथमिकताएं सहेजें' : 'Save Preferences'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-red-400 font-bold text-[12px] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isHindi ? 'अनुमति रीसेट करें' : 'Reset All Consent'}</span>
          </button>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-4">
        {/* Section 1: What is Cookie & LocalStorage */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 text-left">
          <div className="flex items-center gap-2.5 mb-2.5 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <Database className="w-4 h-4" />
            <h2>{isHindi ? '1. कुकीज़ और लोकल स्टोरेज क्या हैं?' : '1. What Are Cookies and Local Storage?'}</h2>
          </div>
          <p className="text-[13px] text-[var(--theme-text-muted,#94A3B8)] leading-relaxed mb-3">
            {isHindi
              ? 'कुकीज़ (Cookies) और वेब स्टोरेज (LocalStorage व SessionStorage) छोटी डेटा फाइलें होती हैं जिन्हें आपका वेब ब्राउज़र आपके कंप्यूटर या मोबाइल की स्थानीय मेमोरी में सुरक्षित रखता है। पारंपरिक वेबसाइटें इन कुकीज़ को अपने सर्वर पर भेजकर आपको ट्रैक करती हैं, लेकिन Daily Khata Pro में हमारा दृष्टिकोण बिल्कुल अलग है:'
              : 'Cookies and Web Storage (LocalStorage and SessionStorage) are small data units stored directly inside your browser on your device. Unlike traditional web platforms that transmit your financial data back to cloud servers, Daily Khata Pro keeps everything purely client-side.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-[12px]">
            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
              <div className="font-bold text-[var(--theme-text,#F8FAFC)] mb-1">
                {isHindi ? 'HTML5 LocalStorage (लोकल स्टोरेज)' : 'HTML5 LocalStorage'}
              </div>
              <p className="text-[var(--theme-text-dim,#64748B)]">
                {isHindi
                  ? 'यह आपके डिवाइस की सुरक्षित मेमोरी है। जब तक आप खुद कैश साफ़ नहीं करते, आपका खाता और सेटिंग्स सुरक्षित रूप से बिना इंटरनेट के भी चालू रहती हैं।'
                  : 'Encrypted offline storage inside your browser. Allows full accounting access and speed even when your device is completely disconnected from the internet.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
              <div className="font-bold text-[var(--theme-text,#F8FAFC)] mb-1">
                {isHindi ? 'ब्राउज़र कुकीज़ (Cookies)' : 'Browser Cookies'}
              </div>
              <p className="text-[var(--theme-text-dim,#64748B)]">
                {isHindi
                  ? 'Daily Khata Pro स्वयं कोई आंतरिक ट्रैकिंग कुकी नहीं बनाता। केवल आवश्यकतानुसार गूगल ऐडसेंस जैसे तृतीय पक्ष सेवा प्रदाता मानक विज्ञापन कुकी का उपयोग कर सकते हैं।'
                  : 'Daily Khata Pro sets zero proprietary tracking cookies. Only standard third-party partner scripts (e.g. Google AdSense) may place temporary session cookies if enabled.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Exact Storage Keys Table */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 text-left">
          <div className="flex items-center gap-2.5 mb-2.5 text-green-400 font-bold text-[15px]">
            <FileCheck className="w-4 h-4" />
            <h2>{isHindi ? '2. हम आपके डिवाइस पर क्या स्टोर करते हैं?' : '2. Exact Data Keys Stored on Your Device'}</h2>
          </div>
          <p className="text-[13px] text-[var(--theme-text-muted,#94A3B8)] leading-relaxed mb-3">
            {isHindi
              ? 'पूर्ण पारदर्शिता के लिए, यहाँ उन सभी स्टोरेज कीज़ (Keys) की सूची दी गई है जिनका उपयोग Daily Khata Pro करता है:'
              : 'In full accordance with transparency guidelines, here is the exact breakdown of data stored in your browser:'}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#64748B)] font-mono text-[11px]">
                  <th className="py-2.5 px-3">{isHindi ? 'स्टोरेज कुंजी (Key)' : 'Storage Key'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'प्रकार (Type)' : 'Type'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'उद्देश्य (Purpose)' : 'Purpose'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'अवधि (Duration)' : 'Retention'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--theme-border,#213E61)]/50 text-[var(--theme-text-muted,#94A3B8)]">
                <tr>
                  <td className="py-2.5 px-3 font-mono text-[var(--theme-primary,#38BDF8)] font-semibold">daily_khata_records</td>
                  <td className="py-2.5 px-3">LocalStorage</td>
                  <td className="py-2.5 px-3">{isHindi ? 'आपकी सभी आय, व्यय और 6-फंड प्रविष्टियां' : 'Ledger entries, amounts, fund distribution'}</td>
                  <td className="py-2.5 px-3">{isHindi ? 'स्थायी (जब तक डिलीट न करें)' : 'Persistent until user clears'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-[var(--theme-primary,#38BDF8)] font-semibold">dk_security_lock</td>
                  <td className="py-2.5 px-3">LocalStorage</td>
                  <td className="py-2.5 px-3">{isHindi ? 'सुरक्षा पासकोड का SHA-256 हैश व ऑटो-लॉक' : 'PIN passcode hash & timeout settings'}</td>
                  <td className="py-2.5 px-3">{isHindi ? 'स्थायी' : 'Persistent'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-[var(--theme-primary,#38BDF8)] font-semibold">app_theme_v2</td>
                  <td className="py-2.5 px-3">LocalStorage</td>
                  <td className="py-2.5 px-3">{isHindi ? 'चुना गया रंग (Blue, Emerald, Purple आदि)' : 'User selected color palette'}</td>
                  <td className="py-2.5 px-3">{isHindi ? 'स्थायी' : 'Persistent'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-[var(--theme-primary,#38BDF8)] font-semibold">app_language_v2</td>
                  <td className="py-2.5 px-3">LocalStorage</td>
                  <td className="py-2.5 px-3">{isHindi ? 'भाषा प्राथमिकता (हिंदी या अंग्रेजी)' : 'Interface language (Hindi/English)'}</td>
                  <td className="py-2.5 px-3">{isHindi ? 'स्थायी' : 'Persistent'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-[var(--theme-primary,#38BDF8)] font-semibold">dk_cookie_consent_v1</td>
                  <td className="py-2.5 px-3">LocalStorage</td>
                  <td className="py-2.5 px-3">{isHindi ? 'आपकी कुकीज़ व स्टोरेज सहमति विकल्प' : 'Records your consent preferences'}</td>
                  <td className="py-2.5 px-3">{isHindi ? 'स्थायी' : 'Persistent'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-[var(--theme-text-dim,#64748B)] font-semibold">Google AdSense (_gads, _gpi)</td>
                  <td className="py-2.5 px-3">Third-Party Cookie</td>
                  <td className="py-2.5 px-3">{isHindi ? 'विज्ञापन प्रदर्शन व धोखाधड़ी रोकथाम' : 'Ad impression frequency & fraud prevention'}</td>
                  <td className="py-2.5 px-3">13 {isHindi ? 'महीने' : 'Months'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: How to Clear Cookies in Browser */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 text-left">
          <div className="flex items-center gap-2.5 mb-2.5 text-amber-400 font-bold text-[15px]">
            <HelpCircle className="w-4 h-4" />
            <h2>{isHindi ? '3. ब्राउज़र में कुकीज़ कैसे साफ़ या ब्लॉक करें?' : '3. How to Clear or Block Cookies in Your Browser'}</h2>
          </div>
          <p className="text-[13px] text-[var(--theme-text-muted,#94A3B8)] leading-relaxed mb-3">
            {isHindi
              ? 'आप किसी भी समय अपने ब्राउज़र की सेटिंग्स में जाकर कुकीज़ और लोकल डेटा को मिटा सकते हैं। ध्यान रखें कि लोकल स्टोरेज मिटाने से आपकी वित्तीय प्रविष्टियाँ भी हट सकती हैं, इसलिए पहले बैकअप (JSON/Excel) अवश्य निर्यात कर लें।'
              : 'You can manage, restrict, or clear browser cookies and cached storage at any time through your browser settings. Note that clearing LocalStorage will remove offline transaction entries, so always export a JSON/Excel backup first.'}
          </p>

          <div className="space-y-2 text-[12px] text-[var(--theme-text-dim,#64748B)]">
            <p>• <strong>Google Chrome:</strong> Settings → Privacy and security → Third-party cookies / Clear browsing data.</p>
            <p>• <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data.</p>
            <p>• <strong>Apple Safari:</strong> Settings → Safari → Advanced → Website Data.</p>
            <p>• <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies.</p>
          </div>
        </div>

        {/* Section 4: Contact & Legal Compliance */}
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 text-left">
          <div className="flex items-center gap-2.5 mb-2.5 text-[var(--theme-text,#F8FAFC)] font-bold text-[15px]">
            <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <h2>{isHindi ? '4. संपर्क व विधिक प्रश्न' : '4. Contact & Compliance Inquiries'}</h2>
          </div>
          <p className="text-[13px] text-[var(--theme-text-muted,#94A3B8)] leading-relaxed mb-3">
            {isHindi
              ? 'यदि आपकी इस कुकीज़ नीति या डेटा स्टोरेज के संबंध में कोई जिज्ञासा या प्रश्न है, तो आप हमारी सहायता टीम से सीधे संपर्क कर सकते हैं:'
              : 'If you have questions regarding this Cookies Policy or your on-device data rights, contact our privacy officer directly:'}
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12.5px] font-mono text-[var(--theme-primary,#38BDF8)]">
            <Mail className="w-4 h-4 text-red-400" />
            <a href={`mailto:${email}`} className="hover:underline">{email}</a>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[var(--theme-text-muted,#94A3B8)] border-t border-[var(--theme-border,#213E61)]/60">
        <button
          onClick={onBack}
          className="hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Return to Home'}</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateTab && onNavigateTab('privacy')}
            className="hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
          >
            {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('terms')}
            className="hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
          >
            {isHindi ? 'नियम व शर्तें' : 'Terms of Service'}
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('safety')}
            className="hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
          >
            {isHindi ? 'सोर्स कोड सुरक्षा' : 'Security Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};
