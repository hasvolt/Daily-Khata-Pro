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
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            Privacy Policy
          </span>
        </div>
      </div>

      {/* Privacy Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] via-[var(--theme-primary,#38BDF8)] to-[#8B5CF6]" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 border border-[#10B981]/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight">
              Privacy Policy &amp; Data Security
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#94A3B8]">
              Effective Date: August 2026 • Official Domain: <strong>rozfiber.com</strong>
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[#CBD5E1] mt-4 leading-relaxed">
          At <strong>Daily Khata: Pro</strong> (accessible via <code>https://rozfiber.com</code>), the privacy and ownership of your financial records is our foundational principle. This Privacy Policy document outlines how your data is handled, stored, and protected.
        </p>

        {/* 3 Core Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
              <EyeOff className="w-4 h-4" />
              <span>Zero Server Telemetry</span>
            </div>
            <div className="text-[11.5px] text-[#94A3B8] mt-1">We do not store your ledger transactions on any cloud server.</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[13px]">
              <HardDrive className="w-4 h-4" />
              <span>100% Local Storage</span>
            </div>
            <div className="text-[11.5px] text-[#94A3B8] mt-1">Data stays in your device browser storage exclusively.</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[13px]">
              <UserCheck className="w-4 h-4" />
              <span>Full Data Sovereignty</span>
            </div>
            <div className="text-[11.5px] text-[#94A3B8] mt-1">Export, backup, or erase your records anytime in 1 click.</div>
          </div>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-4 text-[13px] text-[#CBD5E1]">
        {/* Section 1: Information We Do NOT Collect */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.</span>
            <span>Data That We Do NOT Collect</span>
          </h2>
          <p className="leading-relaxed">
            Daily Khata: Pro is an <strong>offline-first Progressive Web Application (PWA)</strong>. Unlike traditional banking apps or accounting software:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-2">
            <li>We do <strong>not</strong> collect your name, phone number, or email address for account creation.</li>
            <li>We do <strong>not</strong> store, sync, or transmit your financial amounts, incomes, expenses, categories, or notes to any external database.</li>
            <li>We do <strong>not</strong> access your bank accounts, OTPs, UPI pins, or SMS messages.</li>
          </ul>
        </div>

        {/* Section 2: Local Storage Architecture */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">2.</span>
            <span>How Your Data Is Stored Locally</span>
          </h2>
          <p className="leading-relaxed">
            All your transaction logs, 6-fund balances, savings goals, and daily journal notes are saved locally in your browser&apos;s standard <code>localStorage</code> database under the storage key <code className="text-[#38BDF8] font-mono">hasvolt_khata_v1</code>.
          </p>
          <p className="leading-relaxed text-[#94A3B8]">
            This data is accessible only by your web browser on that specific device. If you clear your browser cache or site data, this local storage may be wiped unless you have exported a JSON backup file using the <strong>Settings → Export Backup</strong> tool.
          </p>
        </div>

        {/* Section 3: Third-Party Advertising & Google AdSense */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">3.</span>
            <span>Third-Party Advertising &amp; Google AdSense</span>
          </h2>
          <p className="leading-relaxed">
            To keep Daily Khata: Pro 100% free and open-source for all users, we may display third-party advertisements served by Google AdSense (Publisher ID: <code>ca-pub-4744063610455678</code>).
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-[#94A3B8] pl-2">
            <li>Google, as a third-party vendor, uses cookies to serve ads on <code>rozfiber.com</code> based on a user&apos;s prior visits to websites.</li>
            <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary,#38BDF8)] underline">Google Ads Settings</a>.</li>
            <li><strong>Important:</strong> Google AdSense does NOT have access to your local financial records or offline ledger entries.</li>
          </ul>
        </div>

        {/* Section 4: Data Export & Erasure Rights */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">4.</span>
            <span>Your Rights (Export, Transfer &amp; Erasure)</span>
          </h2>
          <p className="leading-relaxed">
            Because all your information resides on your local device, you hold absolute, unilateral control over it at all times:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-2">
            <li><strong>Right to Export:</strong> You can download a complete copy of your records in standard JSON or printable PDF format at any time.</li>
            <li><strong>Right to Erase:</strong> You can delete all data permanently via <strong>Settings → Reset / Wipe Data</strong> or by clearing browser cache.</li>
          </ul>
        </div>

        {/* Section 5: Contact Information */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">5.</span>
            <span>Contact Regarding Privacy</span>
          </h2>
          <p className="leading-relaxed">
            If you have any questions or suggestions regarding this Privacy Policy, please contact the developer directly at:
          </p>
          <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <span className="font-mono text-white font-bold">{email}</span>
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
              onClick={() => onNavigateTab('disclaimer')}
              className="hover:text-white underline cursor-pointer"
            >
              Disclaimer
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
export default PrivacyPage;
