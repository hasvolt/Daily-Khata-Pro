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
  Building2,
  Zap,
  Lock,
  BadgeCheck,
  CheckCircle2,
  Award,
  Smartphone,
  Laptop
} from 'lucide-react';
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
  const [imgError, setImgError] = useState(false);
  const isHindi = language === 'hi';

  const email = 'daily-Khata-Pro@gmail.com';
  const githubUrl = 'https://github.com/hasvolt/Daily-Khata-Pro';

  const handleCopyEmail = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback
    }
  };

  const handleShare = () => {
    if (onOpenShare) {
      onOpenShare();
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'MD Zafeer Hasan (YAZDAAN) - Developer Profile',
        text: 'Developer & Creator of Daily Khata Pro - 100% Offline Financial Ledger',
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyEmail();
    }
  };

  const roles = isHindi
    ? [
        {
          id: 'dev',
          title: 'स्वतंत्र सॉफ़्टवेयर डेवलपर (Independent Developer)',
          desc: 'टाइपस्क्रिप्ट, रिएक्ट और PWA ऑफ़लाइन-फ़र्स्ट आर्किटेक्चर के साथ सुरक्षित डिजिटल टूल्स का स्वतंत्र निर्माण।',
          proof: '100% क्लाइंट-साइड निष्पादन, शून्य एक्सटर्नल सर्वर लेटेंसी, तेज़ और सटीक गणना',
          icon: Terminal,
          accent: '#38BDF8'
        },
        {
          id: 'opensource',
          title: 'ओपन-सोर्स क्रिएटर (Open Source Creator)',
          desc: 'आधिकारिक ओपन सोर्स MIT लाइसेंस प्रमाण पत्र के तहत Daily Khata Pro का निर्माण व रख-रखाव।',
          proof: 'MIT लाइसेंस प्रमाण पत्र • सार्वजनिक कोड रिपॉजिटरी: github.com/hasvolt/Daily-Khata-Pro',
          icon: FolderGit2,
          accent: '#10B981'
        },
        {
          id: 'research',
          title: 'स्वतंत्र तकनीक शोधकर्ता (Independent Tech Researcher)',
          desc: 'ऑफ़लाइन-फ़र्स्ट डेटा मॉडल, लोकल ब्राउज़र सेल्फ-कस्टडी और एयर-गैप्ड स्टोरेज का गहन विश्लेषण।',
          proof: '100% प्राइवेट, एयर-गैप्ड डेटा आर्किटेक्चर, नो-क्लाउड प्राइवेसी मानक',
          icon: Sparkles,
          accent: '#F59E0B'
        },
        {
          id: 'security',
          title: 'सुरक्षा एवं प्राइवेसी शोधकर्ता (Security Researcher)',
          desc: 'क्लाइंट-साइड ज़ीरो-नॉलेज सिस्टम, लोकल ब्राउज़र सेल्फ-कस्टडी और एंड-टू-एंड डेटा सुरक्षा।',
          proof: 'Web Crypto API SHA-256 हैशिंग, AES-GCM एन्क्रिप्शन, शून्य टेलीमेट्री/ट्रैकिंग',
          icon: ShieldCheck,
          accent: '#818CF8'
        },
        {
          id: 'entrepreneur',
          title: 'उद्यमी व संस्थापक (Founder & Entrepreneur)',
          desc: 'HASVOLT (स्थापना 2012) के संस्थापक। औद्योगिक एवं आधुनिक डिजिटल पहलों का नेतृत्व।',
          proof: 'Powered by HASVOLT • MSME Regd. Since 2012',
          icon: Building2,
          accent: '#A855F7'
        },
        {
          id: 'publicgood',
          title: 'मानवता व लोक संसाधन सहायक (Public Good Advocate)',
          desc: 'आम नागरिकों, परिवारों और छोटे व्यापारियों के वित्तीय अनुशासन हेतु 100% मुफ़्त डिजिटल जनोपयोगी टूल्स।',
          proof: '100% निःशुल्क, पूर्णतः प्राइवेट, नो-मोनेटाइजेशन नीति',
          icon: Heart,
          accent: '#EC4899'
        }
      ]
    : [
        {
          id: 'dev',
          title: 'Independent Software Developer',
          desc: 'Direct development of offline-first, client-side progressive web applications and financial calculation engines.',
          proof: '100% browser execution, zero external server latency, instant arithmetic accuracy',
          icon: Terminal,
          accent: '#38BDF8'
        },
        {
          id: 'opensource',
          title: 'Open Source Creator',
          desc: 'Authoring and maintaining Daily Khata Pro under the official Open Source MIT License.',
          proof: 'MIT License • Verified GitHub Repository: github.com/hasvolt/Daily-Khata-Pro',
          icon: FolderGit2,
          accent: '#10B981'
        },
        {
          id: 'research',
          title: 'Independent Tech Researcher',
          desc: 'Investigating local-first browser persistence, resilient storage durability, and privacy-preserving UI systems.',
          proof: '100% private, air-gapped data persistence architectures, no-cloud standards',
          icon: Sparkles,
          accent: '#F59E0B'
        },
        {
          id: 'security',
          title: 'Security & Privacy Researcher',
          desc: 'Deploying client-side zero-knowledge security, SHA-256 PIN authorization, and encrypted local backups.',
          proof: 'Web Crypto API SHA-256 hashing, AES-GCM encrypted backups, 0 analytics trackers',
          icon: ShieldCheck,
          accent: '#818CF8'
        },
        {
          id: 'entrepreneur',
          title: 'Founder & Entrepreneur',
          desc: 'Founder of HASVOLT (Est. 2012). Driving professional electrical infrastructure and modern digital solutions.',
          proof: 'Powered by HASVOLT • MSME Regd. Since 2012',
          icon: Building2,
          accent: '#A855F7'
        },
        {
          id: 'publicgood',
          title: 'Humanity & Public Good Advocate',
          desc: 'Creating free, non-monetized digital utilities empowering families, freelancers, and small business owners.',
          proof: '100% free, zero data monetization public digital utility',
          icon: Heart,
          accent: '#EC4899'
        }
      ];

  const projects = [
    {
      name: 'Daily Khata Pro',
      domain: 'rozfiber.com',
      url: 'https://rozfiber.com',
      badge: isHindi ? 'प्रमुख डिजिटल प्रोजेक्ट' : 'Flagship Application',
      badgeColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
      desc: isHindi
        ? '100% ऑफ़लाइन, प्राइवेट और मुफ़्त वित्तीय बहीखाता, मल्टी-फंड मैनेजर, उपस्थिति रजिस्टर, वित्तीय कैलकुलेटर और सुरक्षित लोकल डेटा वॉल्ट।'
        : '100% Offline, private, and free personal financial ledger, multi-fund manager, attendance register, calculators, and zero-knowledge privacy vault.',
      specs: isHindi
        ? ['क्लाइंट-साइड PWA', '100% ऑफ़लाइन-फ़र्स्ट', 'ओपन सोर्स MIT']
        : ['Client-Side PWA', '100% Offline-First', 'Open Source MIT']
    },
    {
      name: 'Hasvolt : Electrical Services',
      domain: 'hasvolt.com',
      url: 'https://hasvolt.com',
      badge: isHindi ? 'संस्थापक एवं ऑपरेटर' : 'Founder & Operator',
      badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
      desc: isHindi
        ? 'व्यावसायिक व औद्योगिक इलेक्ट्रिकल इंस्टॉलेशन, इमरजेंसी रिपेयर और प्रोजेक्ट वर्क्स। दिल्ली NCR व बिहार में संपूर्ण फील्ड सेवाएं तथा अखिल भारतीय (Pan-India) स्तर पर प्रोजेक्ट्स।'
        : 'Professional electrical installations, emergency repairs, and commercial project works. Comprehensive field services in Delhi NCR & Bihar with Pan-India capability for turnkey project works.',
      specs: isHindi
        ? ['स्थापना 2012', 'एमएसएमई पंजीकृत', 'दिल्ली NCR, बिहार व पैन-इंडिया']
        : ['Est. 2012', 'MSME Registered', 'Delhi NCR, Bihar & Pan-India']
    },
    {
      name: 'HSES CONNECT',
      domain: 'hses247help.com',
      url: 'https://hses247help.com',
      badge: isHindi ? '2012 से सेवारत' : 'Since 2012',
      badgeColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
      desc: isHindi
        ? '2012 से निरंतर सक्रिय इलेक्ट्रिकल सॉल्यूशंस व सपोर्ट पोर्टल। वर्ष 2026 से सभी परिचालन Hasvolt के तहत और अधिक गति व आधुनिकता के साथ संचालित हैं।'
        : 'Established electrical support and industrial solutions network since 2012. Operations now systematically powered and unified through Hasvolt.',
      specs: isHindi
        ? ['हेल्पडेस्क पोर्टल', '24x7 समाधान', 'Hasvolt से एकीकृत']
        : ['Helpdesk Portal', '24x7 Solutions', 'Unified with Hasvolt']
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left pb-12">
      {/* Top Header & Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          type="button"
          onClick={onBack}
          id="developer-back-btn"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            id="developer-share-btn"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] font-bold text-[12px] transition-all cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
            <span className="hidden sm:inline">{isHindi ? 'शेयर करें' : 'Share'}</span>
          </button>

          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            {isHindi ? 'डेवलपर प्रोफाइल' : 'Developer Profile'}
          </span>
        </div>
      </div>

      {/* Main Executive Profile Card */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--theme-primary,#38BDF8)] via-[#10B981] to-[#F59E0B]" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Creator Photo Column */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[270px] sm:max-w-[300px] rounded-2xl overflow-hidden border-2 border-[var(--theme-border,#213E61)] shadow-2xl bg-[var(--theme-surface,#0E1A29)] p-2 relative group">
              {imgError ? (
                <div className="w-full min-h-[300px] rounded-xl bg-gradient-to-b from-[#132438] to-[#070E18] flex flex-col items-center justify-center p-6 text-center border border-[var(--theme-border,#213E61)]">
                  <div className="w-24 h-24 rounded-2xl bg-[var(--theme-primary,#38BDF8)]/20 border-2 border-[var(--theme-primary,#38BDF8)]/60 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] font-bold text-3xl mb-3 shadow-lg">
                    ZH
                  </div>
                  <div className="font-bold text-[18px] text-[var(--theme-text,#F8FAFC)]">
                    MD Zafeer Hasan
                  </div>
                  <div className="text-[13px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                    (YAZDAAN)
                  </div>
                  <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-2 font-medium">
                    Independent Developer &amp; Creator
                  </div>
                </div>
              ) : (
                <img
                  src="/md-zafeer-hasan-yazdaan.jpg"
                  alt="MD Zafeer Hasan (YAZDAAN) - Developer & Creator"
                  className="w-full h-auto max-h-[360px] object-cover rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              )}

              {/* Verified Badge Overlay */}
              <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-[#040D17] text-[11px] font-extrabold flex items-center gap-1 shadow-lg">
                <BadgeCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Verified Creator</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] text-center mt-2 font-mono">
              MD Zafeer Hasan (YAZDAAN)
            </p>
          </div>

          {/* Bio & Details Column */}
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/35 text-[var(--theme-primary,#38BDF8)] text-[12px] font-mono font-bold mb-2.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'सॉफ़्टवेयर आर्किटेक्ट व क्रिएटर' : 'Software Architect & Creator'}</span>
              </div>

              <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight leading-tight">
                MD Zafeer Hasan <span className="text-[var(--theme-primary,#38BDF8)]">(YAZDAAN)</span>
              </h1>
              {isHindi && (
                <div className="text-[15px] font-semibold text-[var(--theme-text-muted,#CBD5E1)] mt-0.5">
                  एमडी ज़फ़ीर हसन (यज़दान)
                </div>
              )}

              <p className="text-[14px] sm:text-[15px] font-semibold text-[var(--theme-primary,#38BDF8)] mt-1.5">
                {isHindi
                  ? 'स्वतंत्र सॉफ़्टवेयर डेवलपर • ओपन-सोर्स क्रिएटर • सुरक्षा शोधकर्ता'
                  : 'Independent Software Developer • Open Source Creator • Security Researcher'}
              </p>

              <p className="text-[13px] text-[var(--theme-text-muted,#CBD5E1)] mt-2 leading-relaxed">
                {isHindi
                  ? 'मानवता के लाभ हेतु 100% ऑफ़लाइन, स्वतंत्र और पारदर्शी डिजिटल टूल्स का निर्माण। उपयोगकर्ताओं की निजता और डेटा सुरक्षा के प्रति पूर्ण समर्पित।'
                  : 'Dedicated to independent software engineering, air-gapped local computing, and building transparent, zero-telemetry digital utilities for humanity.'}
              </p>
            </div>

            {/* Email Direct Link Pill */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] font-mono text-[12.5px] transition-colors"
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
                Open Source (MIT)
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Security &amp; Privacy
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                Founder: HASVOLT
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
              <a
                href={`mailto:${email}`}
                id="developer-contact-email-btn"
                className="py-3 px-5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{isHindi ? 'ईमेल द्वारा संपर्क करें' : 'Contact via Email'}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                id="developer-copy-email-btn"
                className="py-3 px-5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] stroke-[3]" />
                    <span className="text-[var(--theme-primary,#38BDF8)]">{isHindi ? 'ईमेल कॉपी हो गया!' : 'Email Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)]" />
                    <span>{isHindi ? 'ईमेल कॉपी करें' : 'Copy Email Address'}</span>
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
              <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'पेशेवर भूमिकाएं एवं विशेषज्ञता' : 'Professional Roles & Focus Areas'}
              </h2>
              <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'तकनीकी दक्षता, सिद्धांत एवं कार्यक्षेत्र' : 'Technical expertise, philosophy, and verified competencies'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 px-2.5 py-1 rounded-md border border-[var(--theme-primary,#38BDF8)]/25 w-fit">
            6 Core Domains
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-xl border flex items-center justify-center"
                      style={{
                        backgroundColor: `${role.accent}15`,
                        borderColor: `${role.accent}35`,
                        color: role.accent
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)] leading-snug">
                      {role.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                    {role.desc}
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-medium border"
                  style={{
                    backgroundColor: `${role.accent}08`,
                    borderColor: `${role.accent}25`,
                    color: role.accent
                  }}
                >
                  ✓ {role.proof}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Ventures & Projects Grid */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'आधिकारिक प्रोजेक्ट्स व उद्यम' : 'Official Projects & Ventures'}
              </h2>
              <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'HASVOLT (स्थापना 2012) एवं Daily Khata Pro' : 'HASVOLT (Est. 2012) & Daily Khata Pro'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md border border-[#F59E0B]/25">
            Verified Portfolios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {projects.map((proj) => (
            <div
              key={proj.name}
              className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${proj.badgeColor}`}>
                    {proj.badge}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {proj.name}
                </h3>

                <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.specs.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] px-2 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] border border-[var(--theme-border,#213E61)] font-mono"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/50 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[var(--theme-primary,#38BDF8)]">
                  {proj.domain}
                </span>
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] text-[var(--theme-text,#F8FAFC)] text-[11px] font-bold border border-[var(--theme-border,#213E61)] transition-colors"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Security Specifications Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Architecture Specs */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[14px]">
            <Laptop className="w-4 h-4" />
            <span>{isHindi ? 'तकनीकी विनिर्देश (Specifications)' : 'Technical Specifications'}</span>
          </div>

          <div className="space-y-2 text-[12.5px]">
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">Application:</span>
              <span className="font-bold text-[var(--theme-text,#F8FAFC)]">Daily Khata Pro</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">Author / Creator:</span>
              <span className="font-bold text-[var(--theme-primary,#38BDF8)]">MD Zafeer Hasan (YAZDAAN)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">License:</span>
              <span className="font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/15 px-2 py-0.5 rounded border border-[var(--theme-primary,#38BDF8)]/30">
                Open Source (MIT)
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">Architecture:</span>
              <span className="font-semibold text-[var(--theme-text,#F8FAFC)]">100% Client-Side PWA</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[var(--theme-border,#213E61)]/50">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">Enterprise Partner:</span>
              <span className="font-bold text-[#F59E0B]">HASVOLT (Est. 2012)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[var(--theme-text-dim,#94A3B8)]">Repository:</span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1"
              >
                <span>github.com/hasvolt/...</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Security & Privacy Commitment */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[14px]">
              <Lock className="w-4 h-4" />
              <span>{isHindi ? 'डेटा प्राइवेसी और सुरक्षा गारंटी' : 'Data Privacy & Security Guarantee'}</span>
            </div>

            <p className="text-[12.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
              {isHindi
                ? 'MD Zafeer Hasan के अनुसार प्रत्येक नागरिक का वित्तीय डेटा उसका व्यक्तिगत अधिकार है। Daily Khata Pro कभी भी क्लाउड सर्वर पर कोई डेटा अपलोड नहीं करता।'
                : 'Financial records belong exclusively to the individual. Daily Khata Pro operates strictly in the local browser without telemetry or remote logging.'}
            </p>

            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-1.5 text-[11.5px]">
              <div className="flex items-center gap-1.5 text-[#10B981] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Cloud Telemetry &amp; Air-Gapped Storage</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#38BDF8] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Web Crypto API SHA-256 PIN Security</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AES-GCM Encrypted JSON File Backups</span>
              </div>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] font-bold text-[11.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.instagram.com/dailykhatapro"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[#E1306C] font-bold text-[11.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span>Instagram</span>
            </a>

            <a
              href="https://x.com/Dailykhatapro"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[#38BDF8] font-bold text-[11.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Twitter className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Return Button */}
      <div className="pt-4 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[13px] transition-all cursor-pointer shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{isHindi ? 'दैनिक खाता (Home) पर वापस जाएं' : 'Return to Daily Khata Pro'}</span>
        </button>
      </div>
    </div>
  );
};

export default DeveloperPage;
