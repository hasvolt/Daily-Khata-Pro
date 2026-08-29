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
  const isHindi = language === 'hi';
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
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            Legal &amp; Financial Disclaimer
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] via-[#EF4444] to-[var(--theme-primary,#38BDF8)]" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#F59E0B]/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight">
              Financial &amp; Legal Disclaimer
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#94A3B8]">
              Please read carefully • Official Domain: <strong>rozfiber.com</strong>
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[#CBD5E1] mt-4 leading-relaxed">
          The information and calculations provided by <strong>Daily Khata: Pro</strong> are for general informational, personal record-keeping, and self-management purposes only.
        </p>
      </div>

      {/* Detailed Disclaimer Cards */}
      <div className="space-y-4 text-[13px] text-[#CBD5E1]">
        {/* 1. Not Financial or Tax Advice */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[15px]">
            <AlertTriangle className="w-4.5 h-4.5" />
            <h2>1. No Financial, Investment or Tax Advisory</h2>
          </div>
          <p className="leading-relaxed">
            Daily Khata: Pro is a software utility and calculation calculator. It is <strong>not</strong> a registered financial advisory service, chartered accountant, banking institution, or certified tax consultant.
          </p>
          <p className="leading-relaxed text-[#94A3B8]">
            The 6-Fund Rule allocation (Personal, Family, Buffer, Emergency, Saving, Investment) is an educational budgeting methodology and should not be construed as individualized investment advice. Users should consult a qualified financial advisor or tax specialist before making major investment or tax decisions.
          </p>
        </div>

        {/* 2. User Responsibility for Data Backups */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <ShieldAlert className="w-4.5 h-4.5" />
            <h2>2. User Responsibility for Local Data &amp; Backups</h2>
          </div>
          <p className="leading-relaxed">
            Because Daily Khata: Pro stores all records strictly on the client-side (your local device) to ensure 100% privacy, the developer has no access to your files and cannot recover lost data if you clear your browser storage, reset your device, or lose your device.
          </p>
          <p className="leading-relaxed text-[#94A3B8]">
            Users are strongly advised to regularly export backup copies (via <strong>Settings → Export Backup</strong>) to safe external storage.
          </p>
        </div>

        {/* 3. Accuracy of Calculations */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-[15px]">
            <CheckCircle2 className="w-4.5 h-4.5" />
            <h2>3. Mathematical Calculation Accuracy</h2>
          </div>
          <p className="leading-relaxed">
            While all arithmetic algorithms and financial percentage equations in Daily Khata: Pro have been thoroughly tested, the software is provided &quot;as is&quot; without warranty of any kind. You are responsible for verifying your transactional figures and statements before filing legal returns.
          </p>
        </div>

        {/* 4. Contact regarding Disclaimers */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-[15px]">
            <Mail className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h2>4. Questions &amp; Clarifications</h2>
          </div>
          <p className="leading-relaxed">
            If you have questions regarding this disclaimer, you can reach out via official email:
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
