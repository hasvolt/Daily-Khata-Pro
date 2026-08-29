import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  FolderGit2,
  ExternalLink,
  Copy,
  Check,
  Code2,
  ShieldCheck,
  Heart,
  Globe,
  Sparkles,
  Layers,
  Terminal,
  Share2,
  Instagram,
  Twitter
} from 'lucide-react';
import { triggerHapticSound } from '../utils/khataCalculations';
import { AppLanguage } from '../types';

interface DeveloperPageProps {
  onBack: () => void;
  language?: AppLanguage;
  onOpenShare?: () => void;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({
  onBack,
  language = 'en',
  onOpenShare
}) => {
  const [copied, setCopied] = useState(false);
  const isHindi = language === 'hi';
  const email = 'daily-Khata-Pro@gmail.com';
  const githubUrl = 'https://github.com/hasvolt/Daily-Khata-Pro';

  const handleCopyEmail = () => {
    triggerHapticSound('click');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Nav & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{isHindi ? 'वापस जाएं' : 'Back to Khata'}</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] font-bold text-[12px] transition-all cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span className="hidden sm:inline">Share Profile</span>
            </button>
          )}

          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            Open Source
          </span>
        </div>
      </div>

      {/* Hero Developer Profile Card with FULL UNCLIPPED Image */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary,#38BDF8)] via-[#10B981] to-[#8B5CF6]" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Full Image Box (Uncropped, Full Aspect Ratio Display) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-2xl overflow-hidden border-2 border-[var(--theme-primary,#38BDF8)]/70 shadow-2xl bg-[#070E18] p-1.5 relative group">
              <img
                src="/md-zafeer-hasan-yazdaan.jpg"
                alt="MD Zafeer Hasan (YAZDAAN) - Independent Developer & Creator"
                className="w-full h-auto max-h-[380px] object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#10B981] text-[#04140D] text-[11px] font-extrabold flex items-center gap-1 shadow-lg">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Verified Creator</span>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] text-center mt-2.5 font-mono">
              MD Zafeer Hasan • Founder &amp; Developer
            </p>
          </div>

          {/* Bio & Details Column */}
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[var(--theme-primary,#38BDF8)] text-[12px] font-mono font-bold mb-2">
                <Code2 className="w-3.5 h-3.5" />
                <span>Developer Information</span>
              </div>
              <h1 className="font-serif-display text-[26px] sm:text-[32px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
                MD Zafeer Hasan <span className="text-[var(--theme-primary,#38BDF8)]">(YAZDAAN)</span>
              </h1>
              <p className="text-[14px] sm:text-[15px] font-medium text-[var(--theme-primary,#38BDF8)] mt-1">
                Independent Developer, Creator &amp; Founder
              </p>
            </div>

            {/* Email link badge */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] hover:text-[#F8FAFC] font-mono text-[12.5px] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{email}</span>
              </a>
            </div>

            {/* Focus Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mr-1">Focus Areas:</span>
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 shadow-xs">
                Open Source
              </span>
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-xs">
                Productivity
              </span>
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 shadow-xs">
                Personal Finance
              </span>
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 shadow-xs">
                Digital Tools
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
              <a
                href={`mailto:${email}`}
                className="py-3 px-5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact via Email</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="py-3 px-5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#10B981] stroke-[3]" />
                    <span className="text-[#10B981]">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#94A3B8]" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Statement & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[14px]">
            <Heart className="w-4 h-4 text-[#EF4444]" />
            <span>Mission &amp; Philosophy</span>
          </div>
          <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
            I&apos;m an independent developer focused on creating simple, practical, and privacy-conscious digital tools that are useful in everyday life.
          </p>
          <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
            This project is developed with the goal of providing a simple and accessible way for users to manage their daily income, expenses, and financial records.
          </p>
          <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border-l-4 border-[var(--theme-primary,#38BDF8)] text-[13px] text-[#F8FAFC] font-medium italic">
            &ldquo;I believe in building useful software that is transparent, easy to use, and accessible to everyone.&rdquo;
          </div>
        </div>

        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[14px]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Project &amp; License Specifications</span>
            </div>
            
            <div className="mt-3 space-y-2.5 text-[12.5px]">
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">Project Name:</span>
                <span className="font-bold text-[#F8FAFC]">Daily Khata Pro (Daily Income &amp; Expense Tracker)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">License:</span>
                <span className="font-mono font-extrabold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                  Open Source (MIT)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">Data Privacy:</span>
                <span className="font-bold text-[#38BDF8]">100% Offline-First Client Storage</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#94A3B8]">Official Email:</span>
                <a href={`mailto:${email}`} className="text-[var(--theme-primary,#38BDF8)] hover:underline font-mono font-bold text-[12px]">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#CBD5E1] hover:text-[#10B981] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-[#10B981]" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.instagram.com/dailykhatapro"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] text-[#CBD5E1] hover:text-[#E1306C] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>Instagram</span>
            </a>

            <a
              href="https://x.com/Dailykhatapro"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[#1DA1F2] text-[#CBD5E1] hover:text-[#1DA1F2] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Twitter className="w-4 h-4 text-[#1DA1F2]" />
              <span>X (Twitter)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
