import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  PiggyBank,
  CheckCircle2,
  Heart,
  Mail,
  FolderGit2,
  Instagram,
  Twitter,
  Globe,
  Layers,
  Lock,
  Sparkles,
  Smartphone,
  FileSpreadsheet,
  Code2
} from 'lucide-react';
import { AppLanguage } from '../types';

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
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            About Daily Khata: Pro
          </span>
        </div>
      </div>

      {/* Hero Intro Card */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary,#38BDF8)] via-[#10B981] to-[#F59E0B]" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#070E18] border border-[var(--theme-primary,#38BDF8)]/40 p-2 shrink-0 shadow-lg flex items-center justify-center">
            <img
              src="/daily-Khata-Pro.png"
              alt="Daily Khata Pro Logo"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Release v1.0 • 100% Offline &amp; Private</span>
            </div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight">
              About Daily Khata: Pro™
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] text-[#94A3B8] font-normal leading-relaxed">
              Universal Financial Ledger, 6-Fund Rule Money Manager, Work Deliverables &amp; Daily Life Journal.
            </p>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">Platform</div>
            <div className="text-[14px] font-bold text-[#F8FAFC] mt-0.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>rozfiber.com</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">Architecture</div>
            <div className="text-[14px] font-bold text-[#10B981] mt-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              <span>100% Local Storage</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">License</div>
            <div className="text-[14px] font-bold text-[#38BDF8] mt-0.5 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>MIT Open Source</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">Creator</div>
            <div className="text-[14px] font-bold text-amber-300 mt-0.5 truncate flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MD Zafeer Hasan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[16px]">
          <Heart className="w-5 h-5 text-[#EF4444]" />
          <h2>Our Mission &amp; Purpose</h2>
        </div>
        <p className="text-[13.5px] text-[#CBD5E1] leading-relaxed">
          Daily Khata: Pro was created with a single uncompromising mission: <strong>to give individuals, freelancers, shopkeepers, and families an honest, lightning-fast financial ledger that respects their complete privacy</strong> without requiring cloud logins, phone number tracking, or hidden subscriptions.
        </p>
        <p className="text-[13.5px] text-[#CBD5E1] leading-relaxed">
          Most modern finance apps upload your transactions to remote servers, mine your purchasing behavior for marketing, or lock essential export features behind paywalls. Daily Khata: Pro flips this model entirely — your data never leaves your browser or phone, all calculations happen instantly on your device, and every single feature is permanently free under the MIT Open Source license.
        </p>
      </div>

      {/* What Makes Daily Khata Pro Unique (6 Core Pillars) */}
      <div className="space-y-3">
        <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Core Capabilities &amp; Architecture
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[14px]">
              <PiggyBank className="w-4 h-4" />
              <h4>Automated 6-Fund Allocation Rule</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              Whenever you log an income entry, Daily Khata Pro automatically allocates it across 6 intelligent pots: Personal (30%), Family (30%), Buffer (10%), Emergency (10%), Savings (10%), and Investment (10%). Percentages are completely customizable.
            </p>
          </div>

          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[14px]">
              <Lock className="w-4 h-4" />
              <h4>Zero-Knowledge Client Storage</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              Your entries are saved exclusively in your device&apos;s Web LocalStorage (<code className="text-[#38BDF8] font-mono">hasvolt_khata_v1</code>). No centralized database, no server tracking, and zero tracking cookies.
            </p>
          </div>

          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[14px]">
              <Layers className="w-4 h-4" />
              <h4>Work &amp; Daily Life Journal</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              Track project deliverables, client billing, billable hours, morning/night routines, moods, and key learnings alongside your financial transactions in a unified view.
            </p>
          </div>

          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#8B5CF6] font-bold text-[14px]">
              <FileSpreadsheet className="w-4 h-4" />
              <h4>Print, PDF &amp; JSON Backup</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              Export high-resolution monthly print statements, clean accounting invoices, or complete JSON backup archives in one click. Restore your data anytime on any device.
            </p>
          </div>
        </div>
      </div>

      {/* Official Contacts & Social Profiles */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
          <Mail className="w-4.5 h-4.5" />
          <h3>Official Support &amp; Social Channels</h3>
        </div>
        <p className="text-[13px] text-[#CBD5E1]">
          For suggestions, technical support, bug reports, and official communication, use our verified channels below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href="https://rozfiber.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">Official Domain &amp; Website</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] font-mono truncate group-hover:text-[var(--theme-primary,#38BDF8)]">rozfiber.com</div>
            </div>
          </a>

          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">Official Support &amp; Contact</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] font-mono truncate group-hover:text-[var(--theme-primary,#38BDF8)]">{email}</div>
            </div>
          </a>

          <a
            href="https://github.com/hasvolt/Daily-Khata-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
              <FolderGit2 className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">Open Source GitHub Repository</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] truncate group-hover:text-[#10B981]">hasvolt/Daily-Khata-Pro</div>
            </div>
          </a>

          <a
            href="https://www.instagram.com/dailykhatapro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E1306C]/15 text-[#E1306C] flex items-center justify-center shrink-0">
              <Instagram className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">Official Instagram Profile</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] truncate group-hover:text-[#E1306C]">@dailykhatapro</div>
            </div>
          </a>

          <a
            href="https://x.com/Dailykhatapro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#1DA1F2] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1DA1F2]/15 text-[#1DA1F2] flex items-center justify-center shrink-0">
              <Twitter className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">Official X (Twitter) Profile</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] truncate group-hover:text-[#1DA1F2]">@Dailykhatapro</div>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[12px] text-[#94A3B8]">
        {onNavigateTab && (
          <>
            <button
              onClick={() => onNavigateTab('privacy')}
              className="hover:text-white underline cursor-pointer"
            >
              Privacy Policy
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
export default AboutPage;
