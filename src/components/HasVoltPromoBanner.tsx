import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ExternalLink,
  MessageSquare,
  Maximize2,
  X,
  MapPin,
  Globe,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Wrench,
  Building2
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getCurrentLanguage } from '../utils/currencyConfig';

interface HasVoltPromoBannerProps {
  className?: string;
  variant?: 'card' | 'bar';
  language?: AppLanguage;
}

export const HasVoltPromoBanner: React.FC<HasVoltPromoBannerProps> = ({
  className = '',
  variant = 'card',
  language
}) => {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/Hasvolt-peofasianal-electrical-services-ads-1.png');
  const [imgError, setImgError] = useState(false);

  const currentLang = language || getCurrentLanguage();
  const isHindi = currentLang === 'hi';

  const brand = 'HASVOLT';
  const tagline = isHindi
    ? 'प्रोफेशनल इलेक्ट्रिकल सर्विसेज'
    : 'Professional Electrical Services';

  const subDesc = isHindi
    ? 'घरेलू व दुकान वायरिंग, शॉर्ट सर्किट व फॉल्ट रिपेयर, इंडस्ट्रियल प्रोजेक्ट्स एवं AMC।'
    : 'Wiring, breakdown repairs, industrial electrical projects & annual maintenance.';

  const websiteUrl = 'https://www.hasvolt.com';
  const reviewUrl = 'https://g.page/r/CdgSZ8fLkYKVEBM/review';
  const whatsappNumber = '+91 8383098574';
  const whatsappUrl = `https://wa.me/918383098574?text=${encodeURIComponent(
    isHindi
      ? 'नमस्ते HasVolt, मुझे इलेक्ट्रिकल सर्विस / इलेक्ट्रीशियन की आवश्यकता है।'
      : 'Hi HasVolt, I need electrical service assistance / electrician booking.'
  )}`;

  const primaryServiceArea = isHindi ? 'दिल्ली एनसीआर एवं बिहार' : 'Delhi NCR & Bihar';
  const secondaryServiceArea = isHindi ? 'पैन-इंडिया प्रोजेक्ट्स' : 'Pan-India Projects';

  const servicePills = [
    {
      icon: Zap,
      label: isHindi ? 'वायरिंग व फिटिंग' : 'Wiring & Fitting'
    },
    {
      icon: Wrench,
      label: isHindi ? 'फाल्ट व रिपेयर' : 'Fault Repairs'
    },
    {
      icon: Building2,
      label: isHindi ? 'इंडस्ट्रियल वर्क' : 'Industrial Work'
    },
    {
      icon: ShieldCheck,
      label: isHindi ? 'वार्षिक AMC' : 'AMC Care'
    }
  ];

  // Keyboard escape listener & body scroll lock
  useEffect(() => {
    if (!isPosterModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPosterModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPosterModalOpen]);

  const handleImageError = () => {
    if (imgSrc !== '/Hasvolt-peofasianal-electrical-services-ads-1.png') {
      setImgSrc('/Hasvolt-peofasianal-electrical-services-ads-1.png');
    } else {
      setImgError(true);
    }
  };

  return (
    <>
      {variant === 'card' ? (
        /* HasVolt Sponsored Ad Card - 100% Theme Adaptive (Light & Dark), Solid Border, Ultra-Compact */
        <div
          role="region"
          aria-label="Sponsored Ad: HasVolt Professional Electrical Services"
          className={`w-full bg-[var(--theme-card,#FFFFFF)] border border-[var(--theme-border,#E2E8F0)] hover:border-[var(--theme-primary,#0284C7)]/60 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-md flex flex-col justify-between space-y-2 text-left transition-all duration-300 ${className}`}
        >
          {/* Top Bar: Brand, Ad Badge, Tagline & View Flyer */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border,#E2E8F0)]/70 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Clickable Flyer Thumbnail */}
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg overflow-hidden border border-[var(--theme-border,#E2E8F0)] bg-[var(--theme-surface,#F8FAFC)] hover:border-[var(--theme-primary,#0284C7)] transition-all flex items-center justify-center shadow-2xs cursor-pointer group"
                title={isHindi ? 'हसवोल्ट पोस्टर देखें' : 'View HasVolt poster'}
                aria-label="View HasVolt poster"
              >
                {!imgError ? (
                  <img
                    src={imgSrc}
                    alt="HasVolt Professional Electrical Services"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)]" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-2.5 h-2.5 text-white" />
                </div>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[13px] sm:text-[14px] font-black text-[var(--theme-text,#0F172A)] tracking-tight">
                    {brand}
                  </span>
                  <span className="font-mono font-bold text-[8px] uppercase px-1.5 py-0.2 rounded bg-[var(--theme-primary-dim,rgba(2,132,199,0.1))] text-[var(--theme-primary,#0284C7)] border border-[var(--theme-primary-border,rgba(2,132,199,0.25))]">
                    AD &bull; SPONSORED
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] font-bold text-[var(--theme-primary,#0284C7)] truncate">
                  {tagline}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="text-[10px] sm:text-[10.5px] font-semibold text-[var(--theme-primary,#0284C7)] hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--theme-surface,#F8FAFC)] border border-[var(--theme-border,#E2E8F0)] shrink-0 transition-colors cursor-pointer"
              title={isHindi ? 'विज्ञापन पोस्टर बड़ा करके देखें' : 'View full Ad poster'}
            >
              <Maximize2 className="w-2.5 h-2.5" />
              <span>{isHindi ? 'पोस्टर' : 'Poster'}</span>
            </button>
          </div>

          {/* Service Highlights (Compact 4 Pills) */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
            {servicePills.map((pill, idx) => {
              const IconComp = pill.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text,#0F172A)] text-[10px] font-medium truncate"
                >
                  <IconComp className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
                  <span className="truncate">{pill.label}</span>
                </div>
              );
            })}
          </div>

          {/* Location & Verified Strip */}
          <div className="flex items-center justify-between gap-1 text-[9.5px] px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text-muted,#475569)]">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
              <span className="truncate">{primaryServiceArea} &bull; {secondaryServiceArea}</span>
            </span>
            <span className="text-[9px] font-mono text-[var(--theme-primary,#0284C7)] font-semibold shrink-0">
              {isHindi ? 'वेरिफाइड टीम' : 'Verified Team'}
            </span>
          </div>

          {/* Action Buttons: WhatsApp Booking, Google Review & Website */}
          <div className="pt-0.5 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* WhatsApp Booking CTA - Light Glassy Aesthetic */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-xs font-bold text-[10px] sm:text-[10.5px] flex items-center gap-1 transition-all cursor-pointer shadow-xs shrink-0"
                title={`Chat on WhatsApp (${whatsappNumber})`}
                aria-label="Chat on WhatsApp"
              >
                <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                <span>{isHindi ? 'बुकिंग / चैट' : 'Book / Chat'}</span>
              </a>

              {/* Compact Review Button with ThumbsUp & Zero Yellow */}
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] active:scale-95 border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text-muted,#475569)] hover:text-[var(--theme-text,#0F172A)] font-medium text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
                title={isHindi ? 'गूगल पर हसवोल्ट का रिव्यू दें' : 'Review HasVolt on Google'}
                aria-label="Review on Google"
              >
                <ThumbsUp className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
                <span>{isHindi ? 'रिव्यू' : 'Review'}</span>
              </a>
            </div>

            {/* Official Website Link */}
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-primary,#0284C7)] font-medium text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs truncate"
              title="Visit HasVolt Official Website (https://www.hasvolt.com)"
            >
              <Globe className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
              <span className="truncate">hasvolt.com</span>
              <ExternalLink className="w-2 h-2 opacity-70 shrink-0" />
            </a>
          </div>
        </div>
      ) : (
        /* Footer Bar Variant - Theme-Adaptive, Solid Border & Compact */
        <div
          role="region"
          aria-label="Sponsored Ad: HasVolt Electrical Services"
          className={`w-full bg-[var(--theme-card,#FFFFFF)] border border-[var(--theme-border,#E2E8F0)] hover:border-[var(--theme-primary,#0284C7)]/60 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-2 text-left ${className}`}
        >
          {/* Left Brand & Details */}
          <div className="flex items-center gap-2.5 min-w-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--theme-border,#E2E8F0)] bg-[var(--theme-surface,#F8FAFC)] shrink-0 flex items-center justify-center cursor-pointer hover:border-[var(--theme-primary,#0284C7)] transition-colors shadow-2xs"
              title="View HasVolt poster"
            >
              {!imgError ? (
                <img
                  src={imgSrc}
                  alt="HasVolt Logo"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Zap className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)]" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono font-bold text-[8px] uppercase px-1.5 py-0.2 rounded bg-[var(--theme-primary-dim,rgba(2,132,199,0.1))] text-[var(--theme-primary,#0284C7)] border border-[var(--theme-primary-border,rgba(2,132,199,0.25))]">
                  AD
                </span>
                <span className="font-black text-[var(--theme-text,#0F172A)] text-[12.5px] sm:text-[13px]">
                  {brand}
                </span>
                <span className="text-[10.5px] sm:text-[11px] text-[var(--theme-primary,#0284C7)] font-bold truncate">
                  &bull; {tagline}
                </span>
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-[var(--theme-text-muted,#475569)] truncate mt-0.5">
                {isHindi
                  ? 'वायरिंग, फिटिंग, रिपेयर व इंडस्ट्रियल प्रोजेक्ट्स &bull; ' + primaryServiceArea
                  : 'Wiring, Installation, Fault Repairs & Industrial Projects &bull; ' + primaryServiceArea}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text,#0F172A)] text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Maximize2 className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)]" />
              <span>{isHindi ? 'पोस्टर' : 'Poster'}</span>
            </button>

            {/* Small Review Button without yellow */}
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text-muted,#475569)] hover:text-[var(--theme-text,#0F172A)] text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
              title="Review HasVolt Services on Google"
            >
              <ThumbsUp className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)]" />
              <span>{isHindi ? 'रिव्यू' : 'Review'}</span>
            </a>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-primary,#0284C7)] text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Globe className="w-2.5 h-2.5 text-[var(--theme-primary,#0284C7)]" />
              <span>{isHindi ? 'वेबसाइट' : 'Website'}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-xs font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all shrink-0 shadow-xs"
              title={`Chat on WhatsApp (${whatsappNumber})`}
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Full-Screen Poster View Modal rendered via React Portal */}
      {isPosterModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsPosterModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="HasVolt Professional Electrical Services Poster"
          >
            <div
              className="relative max-w-xl w-full max-h-[92vh] bg-[var(--theme-card,#FFFFFF)] border border-[var(--theme-border,#E2E8F0)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[var(--theme-border,#E2E8F0)] bg-[var(--theme-surface,#F8FAFC)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[8.5px] uppercase px-1.5 py-0.5 rounded bg-[var(--theme-primary-dim,rgba(2,132,199,0.1))] text-[var(--theme-primary,#0284C7)] border border-[var(--theme-primary-border,rgba(2,132,199,0.25))]">
                      AD &bull; SPONSORED
                    </span>
                    <h4 className="text-[15px] sm:text-[17px] font-black text-[var(--theme-text,#0F172A)]">
                      {brand}
                    </h4>
                  </div>
                  <p className="text-[11.5px] sm:text-[12px] font-semibold text-[var(--theme-primary,#0284C7)] mt-0.5">
                    {tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text-muted,#475569)] hover:text-[var(--theme-text,#0F172A)] transition-colors cursor-pointer"
                  aria-label="Close poster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content: Poster Image & Details */}
              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3 bg-[var(--theme-surface,#F8FAFC)]/50">
                <div className="flex items-center justify-center bg-black/5 rounded-xl p-2 border border-[var(--theme-border,#E2E8F0)]">
                  <img
                    src={imgSrc}
                    alt="HasVolt Professional Electrical Services Poster"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="max-h-[42vh] w-auto rounded-lg object-contain"
                  />
                </div>

                {/* Service Highlights */}
                <div className="p-3 rounded-xl bg-[var(--theme-card,#FFFFFF)] border border-[var(--theme-border,#E2E8F0)] space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--theme-primary,#0284C7)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)]" />
                    <span>{isHindi ? 'प्रमाणित इलेक्ट्रीशियन व टेक्नीशियन टीम' : 'Verified Electrician & Technician Team'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11.5px] text-[var(--theme-text,#0F172A)]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
                      <span>{isHindi ? 'घरेलू व दुकान वायरिंग' : 'Wiring & Fitting'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
                      <span>{isHindi ? 'शॉर्ट सर्किट व रिपेयरिंग' : 'Fault Repair & Breakdown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
                      <span>{isHindi ? 'इंडस्ट्रियल प्रोजेक्ट' : 'Industrial Projects'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)] shrink-0" />
                      <span>{isHindi ? 'वार्षिक मेंटेनेंस (AMC)' : 'Annual AMC Care'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--theme-border,#E2E8F0)]/60 flex items-center justify-between flex-wrap gap-1 text-[11px] text-[var(--theme-text-muted,#475569)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--theme-primary,#0284C7)]" />
                      <span>{primaryServiceArea}</span>
                    </span>
                    <span className="text-[var(--theme-primary,#0284C7)] font-medium">
                      {secondaryServiceArea}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Quick Actions */}
              <div className="p-3.5 sm:p-4 border-t border-[var(--theme-border,#E2E8F0)] bg-[var(--theme-surface,#F8FAFC)] flex items-center justify-between gap-2 flex-wrap">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text,#0F172A)] text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)]" />
                  <span>{isHindi ? 'वेबसाइट' : 'Website'}</span>
                </a>

                {/* Small Clean Review Button - Zero Yellow */}
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#F8FAFC)] hover:bg-[var(--theme-card-hover,#F1F5F9)] border border-[var(--theme-border,#E2E8F0)] text-[var(--theme-text-muted,#475569)] hover:text-[var(--theme-text,#0F172A)] text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  title="Review HasVolt Services on Google"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)]" />
                  <span>{isHindi ? 'गूगल रिव्यू' : 'Google Review'}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-xs font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                  <span>{isHindi ? 'व्हाट्सएप पर संपर्क करें' : 'Contact on WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
