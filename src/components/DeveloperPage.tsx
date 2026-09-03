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
  Terminal,
  Share2,
  Instagram,
  Twitter,
  Search,
  Briefcase,
  Cpu,
  Users,
  Lock,
  Compass,
  Building2,
  Zap,
  MapPin,
  Layers,
  Award,
  FileCheck2,
  BadgeCheck
} from 'lucide-react';
import { triggerHapticSound } from '../utils/khataCalculations';
import { AppLanguage } from '../types';
import { getPageTranslation } from '../utils/pageTranslations';

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
  const pageT = getPageTranslation(language);
  const t = pageT.developer;
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
        {
          title: 'स्वतंत्र सॉफ़्टवेयर डेवलपर (Independent Developer)',
          desc: 'टाइपस्क्रिप्ट, रिएक्ट और PWA ऑफ़लाइन-फ़र्स्ट आर्किटेक्चर के साथ सुरक्षित, पारदर्शी डिजिटल टूल्स का स्वतंत्र निर्माण।',
          proof: '100% क्लाइंट-साइड निष्पादन, शून्य एक्सटर्नल सर्वर लेटेंसी, तेज़ और सटीक गणना',
          icon: Terminal,
          tagColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30'
        },
        {
          title: 'ओपन-सोर्स क्रिएटर (Open Source Creator)',
          desc: 'आधिकारिक ओपन सोर्स MIT लाइसेंस प्रमाण पत्र के तहत Daily Khata Pro का निर्माण व रख-रखाव।',
          proof: 'MIT लाइसेंस प्रमाण पत्र • सार्वजनिक कोड रिपॉजिटरी: github.com/hasvolt/Daily-Khata-Pro',
          icon: FolderGit2,
          tagColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30'
        },
        {
          title: 'स्वतंत्र तकनीक शोधकर्ता (Independent Tech Researcher)',
          desc: 'ऑफ़लाइन-फ़र्स्ट डेटा मॉडल, लोकल ब्राउज़र सेल्फ-कस्टडी, और एयर-गैप्ड स्टोरेज का गहन विश्लेषण।',
          proof: '100% प्राइवेट, एयर-गैप्ड डेटा आर्किटेक्चर, नो-क्लाउड प्राइवेसी मानक',
          icon: Sparkles,
          tagColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
        },
        {
          title: 'सुरक्षा एवं प्राइवेसी शोधकर्ता (Security Researcher)',
          proof: 'Web Crypto API SHA-256 हैशिंग, AES-GCM एन्क्रिप्शन, शून्य टेलीमेट्री/ट्रैकिंग',
          desc: 'क्लाइंट-साइड ज़ीरो-नॉलेज सिस्टम, लोकल ब्राउज़र सेल्फ-कस्टडी और एंड-टू-एंड डेटा सुरक्षा।',
          icon: ShieldCheck,
          tagColor: 'text-[#818CF8] bg-[#818CF8]/10 border-[#818CF8]/30'
        },
        {
          title: 'सॉफ़्टवेयर डेवलपर (Software Developer)',
          desc: 'आधुनिक वेब एप्लिकेशन, डेटा स्ट्रक्चर्स और वित्तीय एल्गोरिदम का सुरक्षित एवं तेज़ विकास।',
          proof: 'शून्य निर्भरता, मॉड्यूलर टाइपस्क्रिप्ट आर्किटेक्चर, क्रॉस-डिवाइस PWA रेस्पॉन्सिवनेस',
          icon: Code2,
          tagColor: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30'
        },
        {
          title: 'फ्रीलांसर व उद्यमी (Freelancer & Entrepreneur)',
          desc: 'HASVOLT (स्थापना 2012) के तहत एमएसएमई पंजीकृत औद्योगिक व डिजिटल परियोजनाएं।',
          proof: 'Powered by HASVOLT',
          icon: Building2,
          tagColor: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30'
        },
        {
          title: 'मानवता व लोक संसाधन सहायक (Humanity Public Resources Helper)',
          proof: '100% निःशुल्क, पूर्णतः प्राइवेट व सुरक्षित डिजिटल पब्लिक टूल्स',
          desc: 'आम नागरिकों, फ्रीलांसरों और छोटे व्यापारियों के वित्तीय अनुशासन हेतु डिजिटल सार्वजनिक उपयोगिता।',
          icon: Heart,
          tagColor: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/30'
        }
      ]
    : [
        {
          title: 'Independent Developer',
          desc: 'Self-directed development of offline-first, client-side digital utilities and modern financial software.',
          proof: 'Direct browser execution, zero external server latency, fast & accurate computation',
          icon: Terminal,
          tagColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30'
        },
        {
          title: 'Open Source Creator',
          desc: 'Authoring and maintaining Daily Khata Pro under the official Open Source MIT License Certificate.',
          proof: 'MIT License Certificate • Verified GitHub Repository: github.com/hasvolt/Daily-Khata-Pro',
          icon: FolderGit2,
          tagColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30'
        },
        {
          title: 'Independent Tech Researcher',
          desc: 'Investigating offline storage durability, zero-dependency calculation formulas, and private computing.',
          proof: '100% private, air-gapped data persistence architectures, no-cloud standards',
          icon: Sparkles,
          tagColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
        },
        {
          title: 'Security & Privacy Researcher',
          desc: 'Researching and deploying client-side zero-knowledge architecture, PIN security.',
          proof: 'Web Crypto API SHA-256 hashing, AES-GCM encrypted backups, 0 analytics trackers',
          icon: ShieldCheck,
          tagColor: 'text-[#818CF8] bg-[#818CF8]/10 border-[#818CF8]/30'
        },
        {
          title: 'Software Developer',
          desc: 'Engineering zero-dependency TypeScript & React offline-first Progressive Web Apps (PWAs).',
          proof: 'Local browser compute, instant reactivity, offline data storage',
          icon: Code2,
          tagColor: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30'
        },
        {
          title: 'Freelancer & Entrepreneur',
          desc: 'Operating HASVOLT (Est. 2012) • Powered by HASVOLT.',
          proof: 'Powered by HASVOLT',
          icon: Building2,
          tagColor: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30'
        },
        {
          title: 'Humanity Public Resources Helper',
          desc: 'Creating free, non-monetized financial management utilities empowering households and small businesses.',
          proof: '100% free, zero data monetization public digital utilities',
          icon: Heart,
          tagColor: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/30'
        }
      ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Nav & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{t.backToHome}</span>
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
            {t.badge}
          </span>
        </div>
      </div>

      {/* Hero Developer Profile Card */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Full Image Box */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-2xl overflow-hidden border border-[var(--theme-border,#213E61)] shadow-sm bg-[var(--theme-surface,#0E1A29)] p-1.5 relative group">
              <img
                src="/md-zafeer-hasan-yazdaan.jpg"
                alt="MD Zafeer Hasan - Developer & Creator"
                className="w-full h-auto max-h-[380px] object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#10B981] text-[#04140D] text-[11px] font-extrabold flex items-center gap-1 shadow-lg">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Verified Creator</span>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] text-center mt-2.5 font-mono">
              MD Zafeer Hasan • Developer &amp; Creator
            </p>
          </div>

          {/* Bio & Details Column */}
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[var(--theme-primary,#38BDF8)] text-[12px] font-mono font-bold mb-2">
                <Code2 className="w-3.5 h-3.5" />
                <span>{t.badge}</span>
              </div>
              <h1 className="font-serif-display text-[26px] sm:text-[32px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
                MD Zafeer Hasan <span className="text-[var(--theme-primary,#38BDF8)]">(YAZDAAN)</span>
              </h1>
              <p className="text-[14px] sm:text-[15px] font-semibold text-[var(--theme-primary,#38BDF8)] mt-1">
                {isHindi
                  ? 'स्वतंत्र सॉफ़्टवेयर डेवलपर • ओपन-सोर्स क्रिएटर • सुरक्षा शोधकर्ता'
                  : 'Independent Software Developer • Open Source Creator • Security Researcher'}
              </p>
              <p className="text-[12.5px] text-[#94A3B8] mt-1.5 leading-relaxed">
                {isHindi
                  ? 'मानवता के लाभ के लिए स्वतंत्र शोध, पारदर्शी डिजिटल सिस्टम्स और 100% ऑफ़लाइन पब्लिक टूल्स का निर्माण।'
                  : 'Devoted to independent technical research, digital security, and crafting transparent public software resources for humanity.'}
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

            {/* Core Domain Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                Independent Developer
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Open Source
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Security Research
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                Entrepreneurship
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#14B8A6]/15 text-[#14B8A6] border border-[#14B8A6]/30">
                Public Utilities
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
              <a
                href={`mailto:${email}`}
                className="py-3 px-5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{t.connectTitle}</span>
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

      {/* Professional Roles & Competencies Section */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-[17px] sm:text-[19px] font-bold text-[#F8FAFC]">
                {isHindi ? 'पेशेवर भूमिकाएं एवं विशेषज्ञता' : 'Professional Roles & Focus Areas'}
              </h2>
              <p className="text-[12px] text-[#94A3B8]">
                {isHindi
                  ? 'तकनीक, शोध, ओपन सोर्स और जनहित में डिजिटल संसाधनों के निर्माण की रूपरेखा'
                  : 'Core technical competencies, independent research domains, and public software contributions'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30 self-start sm:self-auto">
            Ethical &amp; Transparent
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {roles.map((r, i) => {
            const IconComponent = r.icon;
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/60 transition-all space-y-2 text-left group"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${r.tagColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold text-[#F8FAFC] group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                    {r.title}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#94A3B8] leading-relaxed pl-8">
                  {r.desc}
                </p>
                <div className="ml-8 p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 text-[10.5px] font-mono text-[#CBD5E1] flex items-start gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-snug">{r.proof}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Legal Registrations & Verified Certificates */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                {isHindi ? 'ऐप विवरण और जानकारी' : 'App Details & Information'}
              </h2>
              <p className="text-[12px] text-[#94A3B8]">
                {isHindi
                  ? 'HASVOLT द्वारा विकसित और MIT ओपन सोर्स'
                  : 'App developed under HASVOLT and MIT Open Source License'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-md border border-[#10B981]/30 self-start sm:self-auto flex items-center gap-1.5">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>Legally Verified Records</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Open Source MIT License Certificate */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] sm:text-[15px] font-bold text-[#F8FAFC]">
                    Open Source MIT License Certificate
                  </h3>
                  <span className="text-[11px] font-mono text-[#38BDF8]">SPDX-License-Identifier: MIT</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded border border-[#38BDF8]/25">
                OSI Approved
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 space-y-2 text-[12px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#94A3B8]">Protected Software:</span>
                <span className="font-bold text-[#F8FAFC]">Daily Khata Pro</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#94A3B8]">Copyright Holder:</span>
                <span className="font-mono text-[#CBD5E1]">© 2026 MD Zafeer Hasan</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#94A3B8]">Public Repository:</span>
                <a
                  href="https://github.com/hasvolt/Daily-Khata-Pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1"
                >
                  <span>hasvolt/Daily-Khata-Pro</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#94A3B8]">Commercial &amp; Audit Rights:</span>
                <span className="text-[#10B981] font-semibold">100% Free to Use &amp; Self-Host</span>
              </div>
            </div>

            <p className="text-[11.5px] text-[#94A3B8] leading-relaxed">
              {isHindi
                ? 'यह सॉफ़्टवेयर अंतरराष्ट्रीय स्तर पर स्वीकृत MIT लाइसेंस के अंतर्गत सुरक्षित है। कोई भी व्यक्ति इसके सोर्स कोड का स्वतंत्र रूप से निरीक्षण एवं इस्तेमाल कर सकता है।'
                : 'Guaranteed by the internationally recognized Open Source MIT License. Code transparency ensures independent verifiability and unrestricted community auditing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Projects Business Ventures & Brands Ecosystem Applications */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                {isHindi ? 'प्रोजेक्ट्स और एप्लीकेशन' : 'Projects Business Ventures & Brands Ecosystem Applications'}
              </h2>
              <p className="text-[12px] text-[#94A3B8]">
                {isHindi
                  ? 'HASVOLT द्वारा विकसित एप्लीकेशन'
                  : 'Applications and tools developed by HASVOLT'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-3 py-1 rounded-md border border-[#F59E0B]/30 self-start sm:self-auto">
            Operating Since 2012
          </span>
        </div>

        {/* Parent Umbrella Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] relative overflow-hidden space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#F8FAFC] tracking-wide">
                HASVOLT
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded border border-[#38BDF8]/30">
                Official Parent Operator
              </span>
              <span className="text-[10.5px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                Since 2012
              </span>
            </div>
          </div>

          <p className="text-[12.5px] text-[#CBD5E1] leading-relaxed">
            {isHindi ? (
              <>
                <strong>HASVOLT</strong> के संस्थापक <strong>MD ज़फ़ीर हसन</strong> हैं। यह आधुनिक तकनीकी पहलों (जैसे Daily Khata Pro) का विकास करता है।
              </>
            ) : (
              <>
                Founded by <strong>MD Zafeer Hasan</strong>, <strong>HASVOLT</strong> develops modern digital utilities (including Daily Khata Pro).
              </>
            )}
          </p>
        </div>

        {/* Service Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Hasvolt Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8]/60 transition-all space-y-3 flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] sm:text-[15px] font-bold text-[#F8FAFC] group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                      Hasvolt : Professional Electrical Services
                    </h4>
                    <span className="text-[11px] font-mono text-[#38BDF8]">hasvolt.com</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                  Launched 2026
                </span>
              </div>

              <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                {isHindi
                  ? 'इलेक्ट्रिकल सर्विसेज प्रोवाइडर ब्रांड जो इंस्टॉलेशन, रिपेयरिंग, इमरजेंसी मेंटेनेंस और प्रोजेक्ट वर्क प्रदान करता है। दिल्ली NCR और बिहार में संपूर्ण सेवाएं तथा पूरे भारत (Pan-India) में प्रोजेक्ट वर्क के लिए समर्पित। यह HSES Connect का 2026 में लॉन्च हुआ आधुनिक अपग्रेडेड वर्जन ब्रांड है।'
                  : 'Premier electrical services provider delivering professional installations, repairs, emergency maintenance, and specialized project works. Providing complete field services in Delhi NCR and Bihar, with Pan-India availability for commercial and industrial project works. The 2026 upgraded evolution of HSES Connect.'}
              </p>

              {/* Badges / Key Specs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  Delhi NCR &amp; Bihar (Full Services)
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  Pan-India (Project Work)
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                  Installation &amp; Maintenance
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">
                {isHindi ? 'आधिकारिक वेबसाइट' : 'Official Website'}
              </span>
              <a
                href="https://hasvolt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] text-[var(--theme-primary,#38BDF8)] hover:text-[#F8FAFC] font-mono text-[11.5px] font-bold transition-all"
              >
                <span>Visit hasvolt.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* HSES Connect Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981]/60 transition-all space-y-3 flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] sm:text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                      HSES CONNECT
                    </h4>
                    <span className="text-[11px] font-mono text-[#10B981]">hses247help.com</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                  Since 2012
                </span>
              </div>

              <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                {isHindi
                  ? '2012 से निरंतर सक्रिय प्रतिष्ठित इलेक्ट्रिकल सर्विसेज व प्रोजेक्ट वर्क समाधान। वर्ष 2026 से सभी परिचालन व ग्राहक सेवाओं को Hasvolt के तहत और अधिक गति व आधुनिकता के साथ संचालित किया जा रहा है।'
                  : 'Established in 2012 providing dependable electrical solutions, maintenance services, and project works. As of 2026, all ongoing operations and services are strategically unified and powered through Hasvolt.'}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  Established 2012
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                  Electrical Solutions &amp; Projects
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  Transitioned into Hasvolt (2026)
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">
                {isHindi ? 'सपोर्ट एवं हेल्पडेस्क' : 'Support & Solutions Portal'}
              </span>
              <a
                href="https://hses247help.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#10B981] hover:text-[#F8FAFC] font-mono text-[11.5px] font-bold transition-all"
              >
                <span>Visit hses247help.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Note on Daily Khata Pro integration under the same umbrella */}
        <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)]/60 border border-[var(--theme-border,#213E61)] flex items-center justify-between flex-wrap gap-2 text-[12px]">
          <div className="flex items-center gap-2 text-[#CBD5E1]">
            <Code2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
            <span>
              {isHindi ? (
                <><strong>Daily Khata Pro</strong> भी इसी प्रौद्योगिकी एवं लोक सेवा पहल के तहत संचालित एक डिजिटल टूल है।</>
              ) : (
                <><strong>Daily Khata Pro</strong> is also developed and operated as a free digital public utility under this technology initiative.</>
              )}
            </span>
          </div>
          <span className="text-[10.5px] font-mono text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
            100% Free &amp; Offline
          </span>
        </div>
      </div>

      {/* Developer Statement & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[14px]">
            <Heart className="w-4 h-4 text-[#EF4444]" />
            <span>{t.bioTitle}</span>
          </div>
          <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
            {t.bioDesc}
          </p>
          <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
            {t.visionDesc}
          </p>
          <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] mt-2">
            <div className="flex items-center gap-2 text-[#38BDF8] text-[12px] font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>{isHindi ? 'निजता एवं डेटा सुरक्षा का सिद्धांत' : 'Privacy & Security Principle'}</span>
            </div>
            <p className="text-[11.5px] text-[#94A3B8] mt-1">
              {isHindi
                ? 'उपयोगकर्ता का डेटा पूरी तरह उनका व्यक्तिगत अधिकार है। यह ऐप 100% आपके डिवाइस पर रहता है और कभी किसी बाहरी सर्वर पर नहीं भेजा जाता।'
                : 'User data belongs strictly to the individual. Software must run locally, respect device boundaries, and never monetize user behavior.'}
            </p>
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
                <span className="text-[#94A3B8]">Project:</span>
                <span className="font-bold text-[#F8FAFC]">Daily Khata Pro</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">License:</span>
                <span className="font-mono font-extrabold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                  Open Source (MIT)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">Powered by:</span>
                <span className="font-mono font-extrabold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                  HASVOLT
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">Data Privacy:</span>
                <span className="font-bold text-[#38BDF8]">100% Offline-First Client Storage</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">Electrical Services:</span>
                <a
                  href="https://hasvolt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#38BDF8] hover:underline font-mono text-[12px] flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>hasvolt.com</span>
                </a>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">Solutions &amp; Support:</span>
                <a
                  href="https://hses247help.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#10B981] hover:underline font-mono text-[12px] flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>hses247help.com</span>
                </a>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
                <span className="text-[#94A3B8]">App Domain:</span>
                <a
                  href="https://rozfiber.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--theme-primary,#38BDF8)] hover:underline font-mono text-[12px] flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>rozfiber.com</span>
                </a>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#94A3B8]">Support:</span>
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
              className="py-2.5 px-3 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] text-[#CBD5E1] hover:text-[#38BDF8] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Twitter className="w-4 h-4 text-[#38BDF8]" />
              <span>Twitter (X)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeveloperPage;
