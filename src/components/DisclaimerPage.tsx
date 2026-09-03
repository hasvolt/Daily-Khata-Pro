import React from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Scale,
  ShieldAlert,
  FileText,
  Mail,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getPageTranslation } from '../utils/pageTranslations';

interface DisclaimerPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const pageT = getPageTranslation(language);
  const t = pageT.disclaimer;
  const email = 'daily-Khata-Pro@gmail.com';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            {t.badge}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#F59E0B]/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight">
              {t.title}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#94A3B8]">
              {t.subtitle}
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[#CBD5E1] mt-4 leading-relaxed">
          {t.alertDesc}
        </p>
      </div>

      {/* Detailed Disclaimer Cards */}
      <div className="space-y-4 text-[13px] text-[#CBD5E1]">
        {/* 1. Non-advisory */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[15px]">
            <AlertTriangle className="w-4.5 h-4.5" />
            <h2>{t.sections.nonAdvisoryTitle}</h2>
          </div>
          <p className="leading-relaxed">
            {t.sections.nonAdvisoryDesc}
          </p>
        </div>

        {/* 2. Calculation Integrity & System Errors */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <ShieldAlert className="w-4.5 h-4.5" />
            <h2>{t.sections.calculationTitle} &amp; Technical Limitations</h2>
          </div>
          <p className="leading-relaxed">
            {t.sections.calculationDesc}
          </p>
          <div className="mt-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl">
            <h3 className="font-bold text-[#EF4444] mb-1">Important Disclaimer on Calculations</h3>
            <p className="text-[#F8FAFC]">
              Although our calculators and algorithms are designed for precision, technical glitches or calculation mistakes can occasionally happen. <strong>Always manually verify any financial numbers, interest, or margins before making actual financial decisions.</strong> The app is not responsible for any financial loss due to calculation errors.
            </p>
          </div>
        </div>

        {/* Ads and Free Version Disclaimer */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[15px]">
            <AlertTriangle className="w-4.5 h-4.5" />
            <h2>Free Version &amp; App Sponsorships</h2>
          </div>
          <p className="leading-relaxed">
            Please be informed that in the <strong>Free version</strong> of Daily Khata Pro, you may see occasional advertisements, sponsored links, or developer watermarks on generated PDFs and exports. This helps us maintain server costs and provide updates for free. You may upgrade to a premium plan (if available) to remove watermarks and ads.
          </p>
        </div>

        {/* 3. Self Responsibility */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-[15px]">
            <CheckCircle2 className="w-4.5 h-4.5" />
            <h2>{t.sections.selfResponsibilityTitle}</h2>
          </div>
          <p className="leading-relaxed">
            {t.sections.selfResponsibilityDesc}
          </p>
        </div>

        {/* Support & Inquiries */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <Mail className="w-4.5 h-4.5" />
            <h2>Legal &amp; Policy Inquiries</h2>
          </div>
          <p className="leading-relaxed">
            For questions regarding our legal disclaimer and calculation methodology:
          </p>
          <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <span className="font-mono text-[#F8FAFC] font-bold">{email}</span>
          </div>
        </div>
      </div>

      {/* Navigation Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[12px] text-[#94A3B8]">
        {onNavigateTab && (
          <>
            <button
              onClick={() => onNavigateTab('about')}
              className="hover:text-white underline cursor-pointer"
            >
              About Us
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('privacy')}
              className="hover:text-white underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('terms')}
              className="hover:text-white underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('developer')}
              className="hover:text-white underline cursor-pointer"
            >
              Developer Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default DisclaimerPage;
