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
import { getPageTranslation } from '../utils/pageTranslations';
import { APP_RELEASE_LABEL } from '../utils/version';

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
  const pageT = getPageTranslation(language);
  const t = pageT.about;
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
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            {t.badge}
          </span>
        </div>
      </div>

      {/* Hero Intro Card */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#070E18] border border-[var(--theme-primary,#38BDF8)]/40 p-2 shrink-0 shadow-lg flex items-center justify-center">
            <img
              src="/daily-khata-pro-v4.png"
              alt="Daily Khata Pro Logo"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30 text-[11px] font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{APP_RELEASE_LABEL}</span>
            </div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight">
              {t.title}
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] text-[#94A3B8] font-normal leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">{t.platformLabel}</div>
            <div className="text-[14px] font-bold text-[#F8FAFC] mt-0.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>rozfiber.com</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">{t.architectureLabel}</div>
            <div className="text-[14px] font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{t.architectureValue}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">{t.licenseLabel}</div>
            <div className="text-[14px] font-bold text-[#38BDF8] mt-0.5 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>MIT Open Source</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="text-[11px] text-[#94A3B8] font-medium">{t.creatorLabel}</div>
            <div className="text-[14px] font-bold text-amber-300 mt-0.5 truncate flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MD Zafeer Hasan (YAZDAAN)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[16px]">
          <Heart className="w-5 h-5 text-[#EF4444]" />
          <h2>{t.missionTitle}</h2>
        </div>
        <p className="text-[13.5px] text-[#CBD5E1] leading-relaxed">
          {t.missionP1}
        </p>
        <p className="text-[13.5px] text-[#CBD5E1] leading-relaxed">
          {t.missionP2}
        </p>
      </div>

      {/* What Makes Daily Khata Pro Unique (6 Core Pillars) */}
      <div className="space-y-3">
        <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#94A3B8]">
          {t.capabilitiesTitle}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[14px]">
              <PiggyBank className="w-4 h-4" />
              <h4>{t.pillars.fundsTitle}</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              {t.pillars.fundsDesc}
            </p>
          </div>

          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[14px]">
              <Lock className="w-4 h-4" />
              <h4>{t.pillars.privacyTitle}</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              {t.pillars.privacyDesc}
            </p>
          </div>

          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[14px]">
              <Layers className="w-4 h-4" />
              <h4>{t.pillars.journalTitle}</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              {t.pillars.journalDesc}
            </p>
          </div>

          <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#8B5CF6] font-bold text-[14px]">
              <FileSpreadsheet className="w-4 h-4" />
              <h4>{t.pillars.backupTitle}</h4>
            </div>
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              {t.pillars.backupDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Official Contacts & Social Profiles */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
          <Mail className="w-4.5 h-4.5" />
          <h3>{t.contactsTitle}</h3>
        </div>
        <p className="text-[13px] text-[#CBD5E1]">
          {t.contactsDesc}
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
              <div className="text-[11px] text-[#94A3B8] font-medium">{t.officialWebsite}</div>
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
              <div className="text-[11px] text-[#94A3B8] font-medium">{t.officialSupport}</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] font-mono truncate group-hover:text-[var(--theme-primary,#38BDF8)]">{email}</div>
            </div>
          </a>

          <a
            href="https://github.com/hasvolt/Daily-Khata-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
              <FolderGit2 className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">{t.githubRepo}</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] truncate group-hover:text-[var(--theme-primary,#38BDF8)]">hasvolt/Daily-Khata-Pro</div>
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
              <div className="text-[11px] text-[#94A3B8] font-medium">{t.instaProfile}</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] font-mono truncate group-hover:text-[#E1306C]">@dailykhatapro</div>
            </div>
          </a>

          <a
            href="https://x.com/dailykhatapro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
              <Twitter className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94A3B8] font-medium">{t.twitterProfile}</div>
              <div className="text-[13px] font-bold text-[#F8FAFC] font-mono truncate group-hover:text-[#38BDF8]">@dailykhatapro</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
