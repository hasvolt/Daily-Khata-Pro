import React from 'react';
import {
  ArrowLeft,
  FileText,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  FolderGit2
} from 'lucide-react';
import { AppLanguage } from '../types';

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
            Terms of Service
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary,#38BDF8)] via-[#10B981] to-[#8B5CF6]" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 border border-[var(--theme-primary,#38BDF8)]/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight">
              Terms of Service &amp; Open Source License
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#94A3B8]">
              Standard Open Source MIT Terms • Official Domain: <strong>rozfiber.com</strong>
            </p>
          </div>
        </div>

        <p className="text-[13.5px] text-[#CBD5E1] mt-4 leading-relaxed">
          Welcome to <strong>Daily Khata: Pro</strong>. By accessing or using this web application at <code>https://rozfiber.com</code>, you agree to be bound by these Terms of Service.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-4 text-[13px] text-[#CBD5E1]">
        {/* 1. Open Source MIT License */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-[15px]">
            <Code2 className="w-4.5 h-4.5" />
            <h2>1. Open Source MIT License</h2>
          </div>
          <p className="leading-relaxed">
            Daily Khata: Pro is open-source software licensed under the <strong>MIT License</strong>. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the software without restriction, including the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.
          </p>
          <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] font-mono text-[12px] text-[#94A3B8] border border-[var(--theme-border,#213E61)]">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          </div>
        </div>

        {/* 2. Permitted Use */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[15px]">
            <ShieldCheck className="w-4.5 h-4.5" />
            <h2>2. Permitted &amp; Fair Use</h2>
          </div>
          <p className="leading-relaxed">
            You may use Daily Khata: Pro for personal financial tracking, business ledger bookkeeping, freelance deliverable logging, and daily routine journals. You agree not to use the application for any illegal, fraudulent, or unauthorized activities.
          </p>
        </div>

        {/* 3. Intellectual Property */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[15px]">
            <FolderGit2 className="w-4.5 h-4.5" />
            <h2>3. Attribution &amp; Source Code</h2>
          </div>
          <p className="leading-relaxed">
            The official open-source code repository is maintained at <a href="https://github.com/hasvolt/Daily-Khata-Pro" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary,#38BDF8)] underline font-mono">github.com/hasvolt/Daily-Khata-Pro</a> by creator <strong>MD Zafeer Hasan</strong>.
          </p>
        </div>

        {/* 4. Official Contact */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-[15px]">
            <Mail className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h2>4. Contact &amp; Questions</h2>
          </div>
          <p className="leading-relaxed">
            For questions regarding these terms, contact us at:
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
              onClick={() => onNavigateTab('disclaimer')}
              className="hover:text-white underline cursor-pointer"
            >
              Disclaimer
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
export default TermsPage;
