import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Settings2,
  CheckCircle2,
  Layout,
  Github,
  Info,
  Shield
} from 'lucide-react';
import { AppLanguage } from '../types';
import { APP_RELEASE_LABEL } from '../utils/version';
import devPhoto from '../assets/md-zafeer-hasan-yazdaan.jpg';

interface DeveloperProfilePageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const DeveloperProfilePage: React.FC<DeveloperProfilePageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const [imgError, setImgError] = useState(false);
  const isHindi = language === 'hi';

  return (
    <div className="w-full max-w-2xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[var(--theme-bg,#070E18)]/85 backdrop-blur-xl border-b border-[var(--theme-border,#213E61)] mb-5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-[16.5px] font-bold text-white tracking-wide">
                {isHindi ? 'डेवलपर प्रोफ़ाइल' : 'Developer Profile'}
              </h1>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'स्वतंत्र डेवलपर व पारदर्शिता' : 'Independent Developer & Transparency'}
              </p>
            </div>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('about')}
              className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 hover:bg-[var(--theme-primary,#38BDF8)]/20 px-3 py-1.5 rounded-lg border border-[var(--theme-primary,#38BDF8)]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{isHindi ? 'ऐप के बारे में' : 'About App'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* 1. Profile Header */}
        <div className="flex flex-col items-center text-center p-6 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-sm">
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-[var(--theme-surface,#0E1A29)] border-4 border-[var(--theme-border,#213E61)] flex items-center justify-center shrink-0 shadow-md">
            {!imgError ? (
              <img
                src={devPhoto || "/md-zafeer-hasan-yazdaan.jpg"}
                alt="MD Zafeer Hasan (YAZDAAN)"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <User className="w-10 h-10 text-[var(--theme-text-dim,#94A3B8)]" />
            )}
          </div>
          <h2 className="text-[22px] font-extrabold text-white leading-tight">MD Zafeer Hasan</h2>
          <div className="text-[13.5px] font-bold text-[var(--theme-primary,#38BDF8)] tracking-widest uppercase mt-1 mb-2">
            YAZDAAN
          </div>
          <div className="text-[12.5px] font-medium text-[var(--theme-text-dim,#94A3B8)] bg-white/5 px-4 py-1 rounded-full border border-white/10">
            Independent Developer
          </div>
        </div>

        {/* 2. About the Developer */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">About the Developer</h3>
          </div>
          <p className="text-[13.5px] leading-relaxed text-[var(--theme-text-muted,#CBD5E1)] border-l-2 border-[var(--theme-border,#213E61)] pl-3.5 italic">
            MD Zafeer Hasan (YAZDAAN) is an independent developer focused on creating practical, privacy-conscious digital tools with an emphasis on simplicity, usability, and transparency.
          </p>
        </div>

        {/* 3. Development Philosophy */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3.5">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">Why I Build</h3>
          </div>

          <div className="text-[13.5px] font-bold text-[var(--theme-primary,#38BDF8)] border-l-2 border-[var(--theme-primary,#38BDF8)] pl-3.5 py-1.5 italic bg-[var(--theme-primary,#38BDF8)]/5 rounded-r-lg">
            "Build useful. Keep it simple. Respect privacy."
          </div>

          <p className="text-[13px] text-[var(--theme-text-muted,#CBD5E1)]">
            Daily Khata Pro is developed with a simple approach:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              'Useful over unnecessary',
              'Simple over complicated',
              'Privacy over excessive data collection',
              'Transparency over hidden systems',
              'Continuous improvement over unnecessary complexity'
            ].map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-[var(--theme-surface,#0E1A29)] p-2.5 rounded-xl border border-white/5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[12.5px] text-[var(--theme-text-muted,#CBD5E1)]">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Project Details */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Layout className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">Project Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-[var(--theme-surface,#0E1A29)] p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mb-0.5">Project</div>
              <div className="text-[13px] font-bold text-white">Daily Khata Pro</div>
            </div>
            <div className="bg-[var(--theme-surface,#0E1A29)] p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mb-0.5">Category</div>
              <div className="text-[13px] font-bold text-white">Daily Income & Expense Tracker</div>
            </div>
            <div className="bg-[var(--theme-surface,#0E1A29)] p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mb-0.5">Platform</div>
              <div className="text-[13px] font-bold text-white">Progressive Web App (PWA)</div>
            </div>
            <div className="bg-[var(--theme-surface,#0E1A29)] p-3 rounded-xl border border-white/5">
              <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mb-0.5">License</div>
              <div className="text-[13px] font-bold text-white">MIT License</div>
            </div>
            <div className="bg-[var(--theme-surface,#0E1A29)] p-3 rounded-xl border border-white/5 sm:col-span-2">
              <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mb-0.5">Version</div>
              <div className="text-[13px] font-bold text-white">{APP_RELEASE_LABEL || '-'}</div>
            </div>
          </div>
        </div>

        {/* 5. Source Code Repository */}
        <div className="p-5 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Github className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)]" />
            <h3 className="text-[15.5px] font-bold text-white">Open Source Repository</h3>
          </div>

          <a
            href="https://github.com/hasvolt/Daily-Khata-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 p-3 bg-[var(--theme-surface,#0E1A29)] hover:bg-white/5 border border-[var(--theme-border,#213E61)] rounded-xl transition-colors group cursor-pointer"
          >
            <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">GitHub Repository</div>
            <div className="text-[13.5px] font-mono text-[var(--theme-primary,#38BDF8)] group-hover:underline break-all">
              https://github.com/hasvolt/Daily-Khata-Pro
            </div>
          </a>

          <p className="text-[13px] leading-relaxed text-[var(--theme-text-muted,#CBD5E1)] border-l-2 border-[var(--theme-border,#213E61)] pl-3.5 italic">
            The source code is publicly available for transparency, learning, review, and further development.
          </p>
        </div>

        {/* Switch to About App Banner */}
        {onNavigateTab && (
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Shield className="w-4.5 h-4.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-white truncate">
                  {isHindi ? 'ऐप के बारे में और जानें' : 'Want to know more about the App?'}
                </div>
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                  {isHindi ? 'मिशन, 6-फंड फॉर्मूला व ऑफ़लाइन आर्किटेक्चर' : 'Mission, 6-fund formula & offline architecture'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('about')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 hover:bg-[var(--theme-primary,#38BDF8)]/25 text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold border border-[var(--theme-primary,#38BDF8)]/30 cursor-pointer"
            >
              {isHindi ? 'About App देखें' : 'View About App'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
