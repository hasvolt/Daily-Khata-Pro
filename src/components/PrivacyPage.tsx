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
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight">
              {t.title}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-dim,#94A3B8)]">
              {t.subtitle}
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[var(--theme-text-muted,#CBD5E1)] mt-4 leading-relaxed">
          {t.corePledgeDesc}
        </p>

        {/* 3 Core Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
              <EyeOff className="w-4 h-4" />
              <span>{t.highlights.offlineTitle}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1">{t.highlights.offlineDesc}</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[13px]">
              <HardDrive className="w-4 h-4" />
              <span>{t.highlights.localVaultTitle}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1">{t.highlights.localVaultDesc}</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[13px]">
              <UserCheck className="w-4 h-4" />
              <span>{t.highlights.exportControlTitle}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1">{t.highlights.exportControlDesc}</div>
          </div>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-4 text-[13px] text-[var(--theme-text-muted,#CBD5E1)]">
        {/* Section 1 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.1</span>
            <span>No Data Collection by Design</span>
          </h2>
          <p className="leading-relaxed">
            Daily Khata Pro does not collect, transmit, sell, or share your personal or financial information with us or with any third party. All transactions, notes, goals, and journal entries are computed and stored exclusively within your own browser or device.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.2</span>
            <span>Data Retention &amp; Control</span>
          </h2>
          <p className="leading-relaxed">
            All records remain in your device&apos;s local storage (LocalStorage/SessionStorage). You retain complete and exclusive authority over your financial data at all times. Clearing your browser&apos;s site data, uninstalling the app, or using the in-app Reset function will permanently and irreversibly erase all locally stored records. We strongly recommend exporting regular JSON/Excel backups.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.3</span>
            <span>Third-Party Services</span>
          </h2>
          <p className="leading-relaxed">
            Daily Khata Pro does not transmit your personal financial entries, client names, or monetary amounts to any advertising, marketing, or analytics network. Where the app draws on public reference data (e.g., indicative market rates), no personal data is sent as part of that request.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.4</span>
            <span>Your Data Rights</span>
          </h2>
          <p className="leading-relaxed">
            You have the right, at any time and without restriction, to: (a) export your data to standard JSON/CSV formats, (b) inspect the publicly available open-source code, and (c) run the application entirely offline without any internet connectivity.
          </p>
        </div>

        {/* Section 5: Voice Dictation & Camera Hardware Access */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.5</span>
            <span>Voice Input &amp; Camera Hardware Privacy</span>
          </h2>
          <p className="leading-relaxed">
            Where voice transaction dictation is used, speech recognition is processed locally via your browser&apos;s native Web Speech API; Daily Khata Pro does not record, store, or transmit voice clips or transcripts to any server. Where receipt or barcode scanning is used, camera frames are processed instantaneously on-device via HTML5 Canvas/BarcodeDetector APIs and are discarded immediately after processing — no image or video data is retained or uploaded.
          </p>
        </div>

        {/* Section 6: DPDP Act 2023 & GDPR Compliance */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.6</span>
            <span>Regulatory Alignment</span>
          </h2>
          <p className="leading-relaxed">
            Daily Khata Pro is designed in line with the data-minimization and privacy-by-design principles reflected in India&apos;s Digital Personal Data Protection (DPDP) Act, 2023, and the EU General Data Protection Regulation (GDPR). Because all personal, financial, and employment-related records remain exclusively in your local custody, you retain full practical rights of access, portability (via JSON/CSV export), and erasure (via one-click Reset in Settings). As the application does not itself collect or process personal data on any server, these frameworks are referenced here for transparency and best-practice alignment rather than as a claim of formal regulatory certification.
          </p>
        </div>

        {/* Section 7: Grievance Officer & Official Contact */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.7</span>
            <span>Grievance Officer &amp; Support Contact</span>
          </h2>
          <p className="leading-relaxed">
            For privacy inquiries, technical questions, or data-related concerns, please contact:
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

        <p className="text-[11.5px] italic text-[var(--theme-text-dim,#94A3B8)] text-center pt-2 leading-relaxed">
          This Privacy Policy may be updated periodically to reflect changes in the application or applicable law. Continued use of the application after an update constitutes acceptance of the revised policy.
        </p>
      </div>

      {/* Navigation Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
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
