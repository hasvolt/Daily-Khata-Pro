import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Database,
  Cookie,
  UserCheck,
  Mail,
  HardDrive,
  EyeOff,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getPageTranslation } from '../utils/pageTranslations';

interface PrivacyPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const pageT = getPageTranslation(language);
  const t = pageT.privacy;
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
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            {t.badge}
          </span>
        </div>
      </div>

      {/* Privacy Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 border border-[#10B981]/30">
            <Lock className="w-5 h-5" />
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
          {t.corePledgeDesc}
        </p>

        {/* 3 Core Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
              <EyeOff className="w-4 h-4" />
              <span>{t.highlights.offlineTitle}</span>
            </div>
            <div className="text-[11.5px] text-[#94A3B8] mt-1">{t.highlights.offlineDesc}</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[13px]">
              <HardDrive className="w-4 h-4" />
              <span>{t.highlights.localVaultTitle}</span>
            </div>
            <div className="text-[11.5px] text-[#94A3B8] mt-1">{t.highlights.localVaultDesc}</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[13px]">
              <UserCheck className="w-4 h-4" />
              <span>{t.highlights.exportControlTitle}</span>
            </div>
            <div className="text-[11.5px] text-[#94A3B8] mt-1">{t.highlights.exportControlDesc}</div>
          </div>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-4 text-[13px] text-[#CBD5E1]">
        {/* Section 1 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.</span>
            <span>{t.corePledgeTitle}</span>
          </h2>
          <p className="leading-relaxed">
            {t.corePledgeDesc}
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">2.</span>
            <span>{t.dataRetentionTitle}</span>
          </h2>
          <p className="leading-relaxed">
            {t.dataRetentionDesc}
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">3.</span>
            <span>{t.thirdPartyTitle}</span>
          </h2>
          <p className="leading-relaxed">
            {t.thirdPartyDesc}
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">4.</span>
            <span>{t.userRightsTitle}</span>
          </h2>
          <p className="leading-relaxed">
            {t.userRightsDesc}
          </p>
        </div>

        {/* Section 5: Contact */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">5.</span>
            <span>Support &amp; Contact</span>
          </h2>
          <p className="leading-relaxed">
            If you have any questions or suggestions regarding this Privacy Policy, please contact the developer directly:
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
              About
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
              onClick={() => onNavigateTab('cookies')}
              className="hover:text-white underline cursor-pointer"
            >
              Cookies
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('terms')}
              className="hover:text-white underline cursor-pointer"
            >
              Terms of Service
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default PrivacyPage;
