import React, { useState } from 'react';
import {
  X,
  Mail,
  FolderGit2,
  ExternalLink,
  Copy,
  Check,
  Code2,
  ShieldCheck,
  Heart,
  Globe,
  Briefcase,
  Search,
  Sparkles,
  Users,
  Terminal,
  Cpu,
  Building2,
  Zap,
  MapPin
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

  const roles = isHindi
    ? [
        { label: 'स्वतंत्र डेवलपर', icon: Code2, color: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30' },
        { label: 'सॉफ़्टवेयर डेवलपर', icon: Terminal, color: 'text-[#818CF8] bg-[#818CF8]/10 border-[#818CF8]/30' },
        { label: 'ओपन-सोर्स क्रिएटर', icon: FolderGit2, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' },
        { label: 'सुरक्षा शोधकर्ता', icon: ShieldCheck, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' },
        { label: 'स्वतंत्र शोधकर्ता', icon: Search, color: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/30' },
        { label: 'टेक्नोलॉजी व डिजिटल सिस्टम्स', icon: Cpu, color: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30' },
        { label: 'फ्रीलांसर एवं उद्यमी', icon: Briefcase, color: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30' },
        { label: 'मानवता व लोक संसाधन सहायक', icon: Heart, color: 'text-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6]/30' }
      ]
    : [
        { label: 'Independent Developer', icon: Code2, color: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30' },
        { label: 'Software Developer', icon: Terminal, color: 'text-[#818CF8] bg-[#818CF8]/10 border-[#818CF8]/30' },
        { label: 'Open Source Creator', icon: FolderGit2, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' },
        { label: 'Security Researcher', icon: ShieldCheck, color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' },
        { label: 'Independent Researcher', icon: Search, color: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/30' },
        { label: 'Technology & Digital Systems', icon: Cpu, color: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30' },
        { label: 'Freelancer & Entrepreneur', icon: Briefcase, color: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30' },
        { label: 'Humanity & Public Resources Helper', icon: Heart, color: 'text-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6]/30' }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 no-print">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                {isHindi ? 'डेवलपर प्रोफाइल' : 'Developer Profile'}
              </h2>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'पेशेवर विवरण व तकनीकी मिशन' : 'Professional Profile, Research & Public Resources'}
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
          {/* Developer Identity Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Photo */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-28 h-auto max-h-36 sm:w-32 sm:max-h-40 rounded-2xl overflow-hidden border-2 border-[var(--theme-primary,#38BDF8)] shadow-lg bg-[var(--theme-bg,#070E18)] p-1">
                  <img
                    src="/md-zafeer-hasan-yazdaan.jpg"
                    alt="MD Zafeer Hasan (YAZDAAN)"
                    className="w-full h-auto object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-1.5 px-2.5 py-0.5 rounded-md bg-[#10B981] text-[#04140D] text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Verified Creator</span>
                </div>
              </div>

              {/* Identity & Core Titles */}
              <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif-display text-[19px] sm:text-[21px] font-bold text-[#F8FAFC]">
                    MD Zafeer Hasan
                  </h3>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                    (YAZDAAN)
                  </span>
                </div>

                <div className="text-[13px] font-semibold text-[var(--theme-primary,#38BDF8)]">
                  {isHindi
                    ? 'स्वतंत्र सॉफ़्टवेयर डेवलपर एवं ओपन-सोर्स क्रिएटर'
                    : 'Independent Software Developer & Open Source Creator'}
                </div>

                <p className="text-[11.5px] text-[#94A3B8] leading-relaxed">
                  {isHindi
                    ? 'टेक्नोलॉजी, सुरक्षा शोध व जनहित में मुफ़्त डिजिटल पब्लिक टूल्स के निर्माण हेतु समर्पित।'
                    : 'Dedicated to technology development, security research, and building free public digital utilities for humanity.'}
                </p>

                <div className="text-[11px] text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:underline text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] truncate font-mono"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Pillars & Competencies */}
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>{isHindi ? 'पेशेवर प्रोफ़ाइल एवं विशेषज्ञता' : 'Professional Profile & Domains'}</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">Verified Specializations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {roles.map((r, i) => {
                const IconComponent = r.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-[11.5px] font-semibold transition-colors ${r.color}`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{r.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Professional Philosophy & Purpose */}
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2 text-[12.5px] text-[#CBD5E1] leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#F8FAFC] font-bold text-[13px]">
              <Heart className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>{isHindi ? 'उद्देश्य व मानवीय दृष्टिकोण' : 'Purpose & Public Commitment'}</span>
            </div>
            <p>
              {isHindi
                ? 'एक स्वतंत्र डेवलपर व शोधकर्ता के रूप में मेरा लक्ष्य ऐसे उपयोगी डिजिटल टूल्स तैयार करना है जो आम नागरिकों, फ्रीलांसरों और छोटे व्यापारियों के दैनिक जीवन को सरल और व्यवस्थित बनाएं।'
                : 'As an independent developer and researcher, the mission is to create clean, reliable software tools that help people, freelancers, and small businesses organize their work and life with absolute privacy.'}
            </p>
            <p>
              {isHindi
                ? 'यह सॉफ़्टवेयर बिना किसी सब्सक्रिप्शन, डेटा बिक्री या बाहरी क्लाउड ट्रैकर के पूरी तरह ऑफ़लाइन और मुफ़्त जनता की सेवा के लिए उपलब्ध है।'
                : 'All tools are built to run 100% offline, zero-tracking, and zero monetization of user data—serving as accessible public digital resources for humanity.'}
            </p>
            <p className="text-[#F8FAFC] font-medium italic border-l-2 border-[var(--theme-primary,#38BDF8)] pl-2.5 my-1 text-[12px]">
              {isHindi
                ? '“तकनीक का वास्तविक उद्देश्य मानव जीवन को आसान बनाना और गोपनीयता की रक्षा करना है।”'
                : '“Technology should empower people, protect individual privacy, and serve the common good.”'}
            </p>
          </div>

          {/* Business Ventures & Brands Ecosystem */}
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[13px] font-bold text-[#F8FAFC]">
                  {isHindi ? 'बिजनेस व ब्रांड्स इकोसिस्टम' : 'Business Ecosystem & Brands'}
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                Since 2012
              </span>
            </div>

            {/* Parent Organization Banner */}
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[12.5px] font-bold text-[#F8FAFC] tracking-wide">
                  HASAN SMART ELECTRICAL SOLUTIONS ®
                </span>
                <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                  Parent Operator
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {isHindi
                  ? 'संस्थापक एवं स्वामी: MD ज़फ़ीर हसन (YAZDAAN)। 2012 से सभी इलेक्ट्रिकल सर्विसेज, प्रोजेक्ट सॉल्यूशंस और डिजिटल इनिशिएटिव्स (जैसे Daily Khata Pro) का आधिकारिक संचालन।'
                  : 'Founder & Owner: MD Zafeer Hasan (YAZDAAN). Officially operating and managing electrical services, project solutions, and digital initiatives (including Daily Khata Pro) since 2012.'}
              </p>
            </div>

            {/* Brands Cards */}
            <div className="space-y-2 pt-0.5">
              {/* Hasvolt */}
              <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8]/50 transition-colors space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="text-[12px] font-bold text-[#F8FAFC]">Hasvolt.com</span>
                    <span className="text-[11px] text-[#CBD5E1]">| Hasvolt : Professional Electrical Services</span>
                  </div>
                  <a
                    href="https://hasvolt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--theme-primary,#38BDF8)] hover:underline font-mono"
                  >
                    <span>hasvolt.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {isHindi
                    ? 'इलेक्ट्रिकल सर्विसेज ब्रांड जो इंस्टॉलेशन, रिपेयरिंग, इमरजेंसी मेंटेनेंस और प्रोजेक्ट वर्क प्रदान करता है। दिल्ली NCR व बिहार में संपूर्ण सेवाएं और पूरे भारत (Pan-India) में प्रोजेक्ट वर्क। HSES Connect का 2026 में लॉन्च हुआ अपग्रेडेड वर्जन ब्रांड।'
                    : 'Premier electrical services provider delivering installation, repair, emergency maintenance, and specialized project works across Delhi NCR, Bihar, and Pan-India (Project Works). Upgraded brand of HSES Connect launched in 2026.'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                    Delhi NCR &amp; Bihar
                  </span>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                    Pan-India Projects
                  </span>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                    Launched 2026
                  </span>
                </div>
              </div>

              {/* HSES Connect */}
              <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981]/50 transition-colors space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[12px] font-bold text-[#F8FAFC]">hses247help.com</span>
                    <span className="text-[11px] text-[#CBD5E1]">| HSES CONNECT</span>
                  </div>
                  <a
                    href="https://hses247help.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#10B981] hover:underline font-mono"
                  >
                    <span>hses247help.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {isHindi
                    ? '2012 से कार्यरत विश्वसनीय इलेक्ट्रिकल सॉल्यूशंस एवं प्रोजेक्ट वर्क ब्रांड। 2026 से सभी सक्रिय सेवाएं Hasvolt द्वारा संचालित की जा रही हैं।'
                    : 'Established in 2012 delivering comprehensive electrical solutions & project works. From 2026, active field services transition and are powered through Hasvolt.'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                    Est. 2012
                  </span>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                    Operated by Hasan Smart Electrical Solutions ®
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project & License Specs */}
          <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2 text-[12px]">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">{isHindi ? 'प्रोजेक्ट:' : 'Project:'}</span>
              <span className="text-[#F8FAFC] font-bold">Daily Income &amp; Expense Tracker (Daily Khata Pro)</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">{isHindi ? 'लाइसेंस:' : 'License:'}</span>
              <span className="text-[#10B981] font-mono font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                Open Source (MIT)
              </span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">{isHindi ? 'गोपनीयता:' : 'Data Privacy:'}</span>
              <span className="text-[#38BDF8] font-semibold">100% Client-Side LocalStorage</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-semibold text-[#CBD5E1]">{isHindi ? 'ईमेल संपर्क:' : 'Contact:'}</span>
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
              <span>{isHindi ? 'डेवलपर से संपर्क करें' : 'Contact Developer'}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="py-2.5 px-4 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12.5px] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981] stroke-[3]" />
                  <span className="text-[#10B981]">{isHindi ? 'ईमेल कॉपी हो गया!' : 'Email Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#94A3B8]" />
                  <span>{isHindi ? 'ईमेल कॉपी करें' : 'Copy Email Address'}</span>
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
            <span>{isHindi ? 'गिटहब रिपॉजिटरी देखें' : 'View GitHub Repository'} (hasvolt/Daily-Khata-Pro)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
          </a>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">
            {isHindi ? 'पारदर्शी • निःशुल्क • ओपन-सोर्स' : 'Transparent • Free • Open Source'}
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
export default DeveloperModal;
