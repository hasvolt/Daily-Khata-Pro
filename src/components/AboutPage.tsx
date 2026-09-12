import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  PiggyBank,
  Heart,
  Globe,
  Layers,
  Lock,
  FileSpreadsheet,
  Code2,
  CalendarCheck,
  Calculator,
  User,
  ExternalLink,
  ChevronRight,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { AppLanguage } from '../types';
import { APP_RELEASE_LABEL } from '../utils/version';
import devPhoto from '../assets/md-zafeer-hasan-yazdaan.jpg';

interface AboutPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="w-full max-w-2xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-[var(--theme-bg,#070E18)]/85 backdrop-blur-xl border-b border-[var(--theme-border,#213E61)] mb-5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-[16.5px] font-bold text-white tracking-wide">
                {isHindi ? 'ऐप के बारे में' : 'About Daily Khata Pro'}
              </h1>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'दैनिक आय-व्यय व वित्तीय खाता' : 'Daily Income & Expense Tracker'}
              </p>
            </div>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('developer')}
              className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 hover:bg-[var(--theme-primary,#38BDF8)]/20 px-3 py-1.5 rounded-lg border border-[var(--theme-primary,#38BDF8)]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isHindi ? 'डेवलपर' : 'Developer'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* App Hero Banner */}
        <div className="p-6 bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-sm text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-blue-500/10 to-indigo-500/20 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-[var(--theme-primary,#38BDF8)]" />
          </div>
          <h2 className="text-[22px] font-extrabold text-white tracking-tight">
            Daily Khata Pro
          </h2>
          <p className="text-[13px] font-medium text-[var(--theme-primary,#38BDF8)] mt-0.5">
            {isHindi ? 'दैनिक आय-व्यय, बचत व वित्तीय ट्रैकर' : 'Daily Income & Expense Tracker'}
          </p>
          <p className="text-[13px] text-[var(--theme-text-muted,#CBD5E1)] mt-3 max-w-lg mx-auto leading-relaxed">
            {isHindi
              ? 'डेली खाता प्रो एक ओपन-सोर्स और प्राइवेसी-केंद्रित डिजिटल टूल है, जो उपयोगकर्ताओं को बिना किसी सर्वर ट्रैकिंग या इंटरनेट निर्भरता के अपने दैनिक वित्तीय रिकॉर्ड को सुरक्षित और व्यवस्थित रखने में मदद करता है।'
              : 'Daily Khata Pro is an open-source, privacy-first application designed to help users manage everyday income and expense records with simplicity, total data ownership, and offline reliability.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10 text-[11.5px] font-mono text-[var(--theme-text-dim,#94A3B8)]">
            <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/10">Version: {APP_RELEASE_LABEL || 'v2.8.0'}</span>
            <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/10">License: MIT</span>
            <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/10">Architecture: 100% Offline-First</span>
          </div>
        </div>

        {/* Developer Profile Cross-Link Card */}
        {onNavigateTab && (
          <div
            onClick={() => onNavigateTab('developer')}
            className="p-4 bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-2xl cursor-pointer transition-all duration-200 group flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--theme-surface,#0E1A29)] border-2 border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-center shrink-0">
                <img
                  src={devPhoto || "/md-zafeer-hasan-yazdaan.jpg"}
                  alt="MD Zafeer Hasan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
                <User className="w-6 h-6 text-[var(--theme-primary,#38BDF8)] hidden" />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-bold text-white group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors flex items-center gap-1.5">
                  <span>MD Zafeer Hasan</span>
                  <span className="text-[11px] text-[var(--theme-primary,#38BDF8)] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/15">YAZDAAN</span>
                </div>
                <div className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                  {isHindi ? 'डेवलपर प्रोफाइल व प्रोजेक्ट ट्रांसपेरेंसी देखें' : 'View Developer Profile & Project Transparency'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--theme-text-dim,#94A3B8)] group-hover:text-[var(--theme-primary,#38BDF8)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}

        {/* Core Principles */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-rose-400" />
            <h3 className="text-[15.5px] font-bold text-white">
              {isHindi ? 'मूल सिद्धांत (Core Principles)' : 'Core Principles'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-white mb-0.5">Privacy-Focused</div>
                <div className="text-[11.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {isHindi ? 'कोई क्लाउड ट्रैकिंग नहीं। सारा डेटा केवल आपके डिवाइस पर सुरक्षित रहता है।' : 'Zero telemetry. All records remain encrypted & local to your device.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-white mb-0.5">Offline-First</div>
                <div className="text-[11.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {isHindi ? 'इंटरनेट के बिना कभी भी, कहीं भी सहज रूप से काम करता है।' : 'Functions seamlessly anywhere without requiring an active internet connection.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-white mb-0.5">Open Source</div>
                <div className="text-[11.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {isHindi ? 'ओपन सोर्स कोड सार्वजनिक समीक्षा और पारदर्शिता के लिए उपलब्ध है।' : 'Publicly verifiable source code released under the permissive MIT license.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-white mb-0.5">6-Fund Formula</div>
                <div className="text-[11.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {isHindi ? 'आय को उद्देश्य-आधारित श्रेणियों (Personal, Family, Buffer, Emergency) में विभाजित करें।' : 'Divide income purposefully into Personal, Family, Buffer, Emergency & Savings.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Built-in Functional Tools */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">
              {isHindi ? 'मुख्य सुविधाएं (Features & Utilities)' : 'Features & Utilities'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--theme-primary,#38BDF8)] font-bold text-[12.5px]">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Statements &amp; PDF</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                Export monthly, daily and annual financial statements directly to PDF &amp; Excel.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--theme-primary,#38BDF8)] font-bold text-[12.5px]">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Any-to-Any Calculators</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                Universal 25+ country cross-currency converter, SIP, Loan EMI, and GST slips with instant print.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--theme-primary,#38BDF8)] font-bold text-[12.5px]">
                <CalendarCheck className="w-4 h-4 text-blue-400" />
                <span>Attendance &amp; Work</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                Dedicated daily attendance registry, shift wage calculations, and timeline tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Official Contact & Developer Inquiries */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">
              {isHindi ? 'संपर्क व डेवलपर सहयोग' : 'Official Support & Developer Contact'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="mailto:daily-Khata-Pro@gmail.com"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-white/5 border border-[var(--theme-border,#213E61)] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-medium">App Support</div>
                <div className="text-[12.5px] font-bold text-white font-mono group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors truncate">
                  daily-Khata-Pro@gmail.com
                </div>
              </div>
            </a>

            <a
              href="mailto:mdzafeerhasan.official@gmail.com"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-white/5 border border-[var(--theme-border,#213E61)] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-medium">Developer Direct</div>
                <div className="text-[12.5px] font-bold text-white font-mono group-hover:text-emerald-400 transition-colors truncate">
                  mdzafeerhasan.official@gmail.com
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Official Links & Code Repository */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">
              {isHindi ? 'आधिकारिक लिंक (Official Links)' : 'Official Links'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={typeof window !== 'undefined' ? window.location.origin : "https://rozfiber.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-white/5 border border-[var(--theme-border,#213E61)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-medium">Website</div>
                  <div className="text-[13px] font-bold text-white font-mono group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors truncate">
                    {typeof window !== 'undefined' ? window.location.hostname : 'rozfiber.com'}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] group-hover:text-[var(--theme-primary,#38BDF8)] shrink-0" />
            </a>

            <a
              href="https://github.com/hasvolt/Daily-Khata-Pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-white/5 border border-[var(--theme-border,#213E61)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-medium">GitHub Repository</div>
                  <div className="text-[13px] font-bold text-white font-mono group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors truncate">
                    Daily-Khata-Pro
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] group-hover:text-[var(--theme-primary,#38BDF8)] shrink-0" />
            </a>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
          {onNavigateTab && (
            <>
              <button
                onClick={() => onNavigateTab('developer')}
                className="hover:text-white underline cursor-pointer"
              >
                {isHindi ? 'डेवलपर प्रोफाइल' : 'Developer Profile'}
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('privacy')}
                className="hover:text-white underline cursor-pointer"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('terms')}
                className="hover:text-white underline cursor-pointer"
              >
                Terms
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('disclaimer')}
                className="hover:text-white underline cursor-pointer"
              >
                Disclaimer
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('safety')}
                className="hover:text-white underline cursor-pointer"
              >
                Safety
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
