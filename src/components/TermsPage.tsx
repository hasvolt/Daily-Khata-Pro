import React from 'react';
import {
  ArrowLeft,
  FileText,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  FolderGit2,
  Layers
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getPageTranslation } from '../utils/pageTranslations';

interface TermsPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const pageT = getPageTranslation(language);
  const t = pageT.terms;
  const email = 'daily-Khata-Pro@gmail.com';
  const devEmail = 'mzhyazdaan@gmail.com';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            {t.badge}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 border border-[var(--theme-primary,#38BDF8)]/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight">
              {t.title}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-dim,#94A3B8)]">
              {t.subtitle}
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[var(--theme-text-muted,#CBD5E1)] mt-4 leading-relaxed">
          {t.openSourceDesc}
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-4 text-[13px] text-[var(--theme-text-muted,#CBD5E1)]">
        {/* 2.1 Ownership */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-[15px]">
            <Code2 className="w-4.5 h-4.5" />
            <h2>2.1 Absolute Data Ownership</h2>
          </div>
          <p className="leading-relaxed">
            You retain 100% exclusive ownership of, and responsibility for, all financial records, personal notes, and data you enter into the application. We claim no ownership interest in your data at any time.
          </p>
        </div>

        {/* 2.2 Lawful & Personal Use */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <ShieldCheck className="w-4.5 h-4.5" />
            <h2>2.2 Lawful &amp; Personal Use</h2>
          </div>
          <p className="leading-relaxed">
            You may use this application for any lawful purpose, including personal budgeting, family accounting, freelance income logs, or small commercial/shop bookkeeping, subject to compliance with applicable local laws.
          </p>
        </div>

        {/* 2.3 No Financial Warranty */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[15px]">
            <FolderGit2 className="w-4.5 h-4.5" />
            <h2>2.3 No Financial Warranty</h2>
          </div>
          <p className="leading-relaxed">
            Daily Khata Pro is an organizational and calculation-assistance tool. It is not a certified accountant, tax consultant, financial advisor, or legal advisor, and nothing in the application constitutes professional financial, tax, investment, or legal advice.
          </p>
        </div>

        {/* 2.4 Backup Responsibility */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#8B5CF6] font-bold text-[15px]">
            <FileText className="w-4.5 h-4.5" />
            <h2>2.4 Backup Responsibility</h2>
          </div>
          <p className="leading-relaxed">
            Because data is stored solely on your client device with no central server, maintaining regular JSON/Excel backup copies is the sole responsibility of the user. We are not liable for data loss arising from device failure, browser cache clearing, uninstallation, or similar events.
          </p>
        </div>

        {/* 2.5 Free Standard Edition & Future Commercial Disclosures */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-[15px]">
            <Layers className="w-4.5 h-4.5" />
            <h2>2.5 Free Standard Edition &amp; Future Commercial Disclosures</h2>
          </div>
          <p className="leading-relaxed">
            The core features of Daily Khata Pro are provided free of charge under the MIT License. To sustain long-term infrastructure, community support, and continued engineering, the platform reserves the right to introduce optional paid tiers, sponsor partnerships, or contextual advertisements in future releases. Any such changes will be clearly disclosed and will not compromise the core offline bookkeeping functionality of the free edition.
          </p>
        </div>

        {/* 2.6 License Terms */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-[15px]">
            <Code2 className="w-4.5 h-4.5" />
            <h2>2.6 License Terms</h2>
          </div>
          <p className="leading-relaxed">
            The MIT License permits use, copying, modification, merging, publishing, and distribution of the software, subject to the inclusion of the original copyright and permission notice. The software is provided &quot;as is,&quot; without warranty of any kind, express or implied.
          </p>
        </div>

        {/* 2.7 Support & Contact */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <Mail className="w-4.5 h-4.5" />
            <h2>2.7 Support &amp; Contact</h2>
          </div>
          <p className="leading-relaxed">
            For licensing inquiries or clarification of these terms, please contact the project maintainer:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">Official Support</div>
                <div className="font-mono text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] truncate">{email}</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">Developer Direct</div>
                <div className="font-mono text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] truncate">{devEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
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
              onClick={() => onNavigateTab('cookies')}
              className="hover:text-white underline cursor-pointer"
            >
              Cookies
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('disclaimer')}
              className="hover:text-white underline cursor-pointer"
            >
              Disclaimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default TermsPage;
