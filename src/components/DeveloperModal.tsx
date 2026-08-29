import React, { useState } from 'react';
import {
  X,
  Mail,
  FolderGit2,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
  ShieldCheck,
  Heart,
  Code2,
  Layers,
  Terminal,
  Globe
} from 'lucide-react';
import { triggerHapticSound } from '../utils/khataCalculations';
import { AppLanguage } from '../types';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 no-print">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                {isHindi ? 'डेवलपर जानकारी' : 'Developer Information'}
              </h2>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'क्रिएटर व फाउंडर प्रोफाइल' : 'Creator, Founder & Project Overview'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto bg-[var(--theme-bg,#070E18)]">
          {/* Developer Profile Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Photo - Full uncropped view */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-28 h-auto max-h-36 sm:w-32 sm:max-h-40 rounded-2xl overflow-hidden border-2 border-[var(--theme-primary,#38BDF8)] shadow-lg bg-[var(--theme-bg,#070E18)] p-1">
                  <img
                    src="/md-zafeer-hasan-yazdaan.jpg"
                    alt="MD Zafeer Hasan (YAZDAAN)"
                    className="w-full h-auto object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-1.5 px-2 py-0.5 rounded-md bg-[#10B981] text-[#04140D] text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Creator &amp; Founder</span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                    MD Zafeer Hasan
                  </h3>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                    (YAZDAAN)
                  </span>
                </div>

                <div className="text-[12.5px] font-medium text-[var(--theme-primary,#38BDF8)]">
                  Independent Developer, Creator &amp; Founder
                </div>

                <div className="text-[11px] text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                  <Mail className="w-3 h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:underline text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] truncate font-mono"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Focus Tags */}
            <div className="mt-4 pt-3 border-t border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mr-1">Focus:</span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Open Source
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                Productivity
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Personal Finance
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                Digital Tools
              </span>
            </div>
          </div>

          {/* Mission & Philosophy Bio */}
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5 text-[12.5px] text-[#CBD5E1] leading-relaxed">
            <p>
              I&apos;m an independent developer focused on creating simple, practical, and privacy-conscious digital tools that are useful in everyday life.
            </p>
            <p>
              This project is developed with the goal of providing a simple and accessible way for users to manage their daily income, expenses, and financial records.
            </p>
            <p className="text-[#F8FAFC] font-medium italic border-l-2 border-[var(--theme-primary,#38BDF8)] pl-2.5 my-1 text-[12px]">
              &ldquo;I believe in building useful software that is transparent, easy to use, and accessible to everyone.&rdquo;
            </p>
          </div>

          {/* Project Details Box */}
          <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2 text-[12px]">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">Project:</span>
              <span className="text-[#F8FAFC] font-bold">Daily Income &amp; Expense Tracker (Daily Khata Pro)</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">License:</span>
              <span className="text-[#10B981] font-mono font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                Open Source (MIT)
              </span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">Support &amp; Feedback:</span>
              <a href={`mailto:${email}`} className="text-[var(--theme-primary,#38BDF8)] hover:underline font-mono">
                {email}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={`mailto:${email}`}
              className="py-2.5 px-4 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:bg-[var(--theme-btn-hover,#0EA5E9)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Developer</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="py-2.5 px-4 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12.5px] flex items-center justify-center gap-2 transition-all cursor-pointer"
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

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#CBD5E1] hover:text-[#10B981] font-bold text-[12.5px] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4 text-[#10B981]" />
            <span>View GitHub Repository (hasvolt/Daily-Khata-Pro)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
          </a>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">
            Transparent • Free • Open Source
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[12px] font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
