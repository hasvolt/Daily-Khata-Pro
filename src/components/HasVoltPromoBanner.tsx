import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ExternalLink,
  Phone,
  MessageSquare,
  Maximize2,
  X,
  MapPin,
  Clock,
  Globe,
  Star,
  Wrench,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HasVoltPromoBannerProps {
  className?: string;
}

export const HasVoltPromoBanner: React.FC<HasVoltPromoBannerProps> = ({
  className = ''
}) => {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/Hasvolt-peofasianal-electrical-services-ads-1.png');
  const [imgError, setImgError] = useState(false);

  const websiteUrl = 'https://www.hasvolt.com';
  const googleReviewUrl = 'https://g.page/r/CdgSZ8fLkYKVEBM/review';
  const phoneFormatted = '+91 8383098574';
  const phoneRaw = '+918383098574';
  const whatsappUrl = `https://wa.me/918383098574?text=${encodeURIComponent('Hi HasVolt, I need electrical service assistance.')}`;

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
      {/* Professional & Accessible Sponsored Ad Banner (Clickable Card) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsPosterModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsPosterModalOpen(true);
          }
        }}
        aria-label="HasVolt Professional Electrical Services - Click to open full details and poster"
        className={`w-full max-w-4xl mx-auto rounded-xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] shadow-sm overflow-hidden text-left hover:border-[var(--theme-primary,#38BDF8)]/60 transition-all cursor-pointer group select-none ${className}`}
      >
        <div className="p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Section: Thumbnail + Info */}
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
            {/* Clickable Mini Poster Thumbnail */}
            <div
              className="relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg overflow-hidden border border-[var(--theme-border,#213E61)] bg-[#05080E] group-hover:border-[var(--theme-primary,#38BDF8)]/70 transition-colors flex items-center justify-center"
              title="Click to view full HasVolt poster"
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
                <div className="p-1 text-center">
                  <Wrench className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] mx-auto" />
                  <div className="text-[8.5px] font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">HasVolt</div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-3.5 h-3.5 text-white drop-shadow" />
              </div>
            </div>

            {/* Clear Typography & Service Highlights */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold uppercase px-2 py-0.5 rounded-md text-[9.5px] tracking-wider bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] shadow-2xs inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 shrink-0" /> SPONSORED
                </span>
                <span className="text-[var(--theme-text,#F8FAFC)] font-bold text-[13.5px] tracking-tight">HasVolt</span>
                <span className="text-[#64748B] text-[11px] hidden xs:inline">•</span>
                <span className="text-[var(--theme-text-muted,#94A3B8)] text-[12px] font-medium truncate">Professional Electrical Services</span>
              </div>

              <p className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] truncate mt-0.5 font-normal">
                House Wiring, Repairing, Breakdown &amp; Installation • Certified Electricians
              </p>

              <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[var(--theme-text-muted,#94A3B8)]">
                  <Clock className="w-3 h-3 text-[#64748B] shrink-0" />
                  <span>8 AM – 9 PM</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[var(--theme-text-muted,#94A3B8)] truncate">
                  <MapPin className="w-3 h-3 text-[#64748B] shrink-0" />
                  <span>Delhi NCR &amp; Across India</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Crisp Action Buttons with stopPropagation */}
          <div
            className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--theme-border,#213E61)]/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* View Full Poster Button */}
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="px-2.5 py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Open full poster and service card"
            >
              <Maximize2 className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
              <span>Poster</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.2 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#10B981] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              title="Chat on WhatsApp (+91 8383098574)"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${phoneRaw}`}
              className="px-2.5 py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              title={`Call ${phoneFormatted}`}
            >
              <Phone className="w-3 h-3 text-[var(--theme-text-muted,#94A3B8)]" />
              <span>Call</span>
            </a>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Visit HasVolt Official Website (www.hasvolt.com)"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>

            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-amber-400 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Rate & Review HasVolt on Google"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Full-Screen Poster View Modal rendered via React Portal to root document.body */}
      {isPosterModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsPosterModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="HasVolt Professional Electrical Services Poster"
          >
            <div
              className="bg-[var(--theme-surface,#0B1019)] border border-[var(--theme-border,#2B3A4E)] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-4 py-3 bg-[var(--theme-card,#06090F)] border-b border-[var(--theme-border,#223042)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-extrabold text-[9px] uppercase bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] shadow-2xs">
                    ★ SPONSORED
                  </span>
                  <h3 className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5">
                    <span>HasVolt</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[var(--theme-text-muted,#94A3B8)] font-normal text-[12px]">Professional Electrical Services</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#1E293B)] border border-transparent hover:border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  aria-label="Close Poster Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Poster Image View & Highlights */}
              <div className="p-3.5 sm:p-4 bg-[var(--theme-bg,#06090F)] overflow-y-auto space-y-3.5 flex flex-col items-center">
                <div className="w-full rounded-xl overflow-hidden border border-[var(--theme-border,#2B3A4E)] bg-[#05080E] flex items-center justify-center p-1 relative shadow-inner">
                  {!imgError ? (
                    <img
                      src={imgSrc}
                      alt="HasVolt Professional Electrical Services"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-auto max-h-[58vh] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] flex items-center justify-center mx-auto">
                        <Zap className="w-8 h-8 text-[var(--theme-primary,#38BDF8)]" />
                      </div>
                      <div className="text-lg font-bold text-[var(--theme-text,#F8FAFC)]">HasVolt: Professional Electrical Services</div>
                      <p className="text-xs text-[var(--theme-text-muted,#94A3B8)] max-w-md mx-auto">
                        Certified &amp; Verified Electricians • Complete House Wiring • Breakdown &amp; Short-Circuit Repair • Inverter &amp; Appliance Installation
                      </p>
                    </div>
                  )}
                </div>

                {/* Service Offerings Grid */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[var(--theme-card,#0D1420)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span className="truncate">House Wiring</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--theme-card,#0D1420)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span className="truncate">Fast Repairing</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--theme-card,#0D1420)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span className="truncate">Installation</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--theme-card,#0D1420)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span className="truncate">Verified Techs</span>
                  </div>
                </div>

                {/* Working Hours & Contact Strip */}
                <div className="w-full bg-[var(--theme-card,#0D1420)] border border-[var(--theme-border,#2B3A4E)] rounded-xl p-3 text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] space-y-1.5">
                  <div className="flex justify-between items-center text-[var(--theme-text,#F8FAFC)] font-medium flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                      <span>Working Hours: 8:00 AM – 9:00 PM</span>
                    </span>
                    <span className="text-[var(--theme-text-muted,#94A3B8)] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delhi NCR &amp; Across India</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-[var(--theme-border,#223042)] flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-[#10B981]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Certified Electricians &amp; Technicians on Call</span>
                    </span>
                    <span className="font-mono text-[var(--theme-text,#CBD5E1)] font-bold">Ph: {phoneFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-4 py-3 bg-[var(--theme-card,#06090F)] border-t border-[var(--theme-border,#223042)] flex flex-wrap items-center justify-between gap-2 shrink-0">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#141E2B)] hover:bg-[var(--theme-card-hover,#1C2B3E)] border border-[var(--theme-border,#2B3D54)] text-[var(--theme-text,#CBD5E1)] hover:text-[var(--theme-text,#FFFFFF)] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3 text-[#64748B]" />
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/40 text-[#10B981] font-bold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#141E2B)] hover:bg-[var(--theme-card-hover,#1C2B3E)] border border-[var(--theme-border,#2B3D54)] text-amber-400 font-medium text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Feedback</span>
                  </a>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary-hover,#0EA5E9)] text-[var(--theme-btn-text,#040D17)] font-bold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};



