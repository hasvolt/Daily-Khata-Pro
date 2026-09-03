import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ExternalLink,
  MessageSquare,
  Maximize2,
  X,
  MapPin,
  Globe,
  Wrench,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

interface HasVoltPromoBannerProps {
  className?: string;
  variant?: 'card' | 'bar';
}

export const HasVoltPromoBanner: React.FC<HasVoltPromoBannerProps> = ({
  className = '',
  variant = 'card'
}) => {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/Hasvolt-peofasianal-electrical-services-ads-1.png');
  const [imgError, setImgError] = useState(false);

  const brand = 'HasVolt';
  const tagline = 'Professional Electrical Services';
  const websiteUrl = 'https://www.hasvolt.com';
  const whatsappNumber = '+91 8383098574';
  const whatsappUrl = `https://wa.me/918383098574?text=${encodeURIComponent('Hi HasVolt, I need electrical service assistance.')}`;

  const services = ['Repairing', 'Installation', 'Maintenance', 'Project Work'];
  const teamInfo = 'Verified Electrician & Technician';
  const primaryServiceArea = 'Delhi NCR & Bihar';
  const secondaryServiceArea = 'Pan-India Project Work Only';

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
        /* HasVolt Sponsored Ad Card (Homepage - 50% Compact Size) */
        <div
          role="region"
          aria-label="HasVolt Professional Electrical Services"
          className={`w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8]/60 rounded-xl p-2.5 sm:p-3 shadow-xs flex flex-col justify-between space-y-2 text-left transition-all duration-300 ${className}`}
        >
          {/* Brand Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Logo / Poster Thumbnail with click to expand */}
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg overflow-hidden border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] hover:border-[#38BDF8] transition-colors flex items-center justify-center shadow-xs cursor-pointer group"
                title="View full HasVolt poster"
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
                  <div className="p-1 text-center">
                    <Zap className="w-4 h-4 text-[#38BDF8] mx-auto" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-3 h-3 text-white drop-shadow" />
                </div>
              </button>

              {/* Brand & Tagline */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold uppercase px-1 py-0.2 rounded text-[7.5px] tracking-wider bg-[#0284C7] text-white shadow-2xs">
                    SPONSORED
                  </span>
                  <span className="text-[var(--theme-text,#F8FAFC)] font-black text-[13px] sm:text-[14px] tracking-tight">
                    {brand}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#38BDF8] tracking-tight truncate">
                  {tagline}
                </p>
                <div className="flex items-center gap-1 text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)]">
                  <ShieldCheck className="w-3 h-3 text-[#10B981] shrink-0" />
                  <span className="font-medium truncate">{teamInfo}</span>
                </div>
              </div>
            </div>

            {/* Poster quick open icon */}
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="p-1 rounded-md text-[var(--theme-text-muted,#8BA4D0)] hover:text-[#38BDF8] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors shrink-0 cursor-pointer"
              title="View full poster"
              aria-label="View full poster"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact Services & Coverage */}
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              {services.map((svc) => (
                <div
                  key={svc}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[9.5px] font-medium text-[var(--theme-text,#F8FAFC)]"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#38BDF8] shrink-0" />
                  <span className="truncate">{svc}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[9px] text-[var(--theme-text-muted,#8BA4D0)] truncate pt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#38BDF8] shrink-0" />
              <span className="truncate">{primaryServiceArea}</span>
              <span className="text-slate-500">•</span>
              <Briefcase className="w-2.5 h-2.5 text-[#F59E0B] shrink-0" />
              <span className="truncate">{secondaryServiceArea}</span>
            </div>
          </div>

          {/* Glassy WhatsApp Button & Website */}
          <div className="pt-1.5 border-t border-[var(--theme-border,#213E61)] space-y-1.5">
            <div className="flex items-center justify-between text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] px-0.5">
              <span>WA: <strong className="text-[var(--theme-text,#F8FAFC)]">{whatsappNumber}</strong></span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#38BDF8] hover:underline font-semibold"
              >
                hasvolt.com
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Glassy WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-300 hover:text-white border border-emerald-400/40 hover:border-emerald-300/80 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(16,185,129,0.15)] font-bold text-[11px] sm:text-[11.5px] flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer group"
                title={`WhatsApp Chat (${whatsappNumber})`}
              >
                {/* Subtle glass reflection highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-white/15 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                <MessageSquare className="w-3.5 h-3.5 fill-emerald-400/25 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="relative z-10 tracking-tight">WhatsApp Chat</span>
              </a>

              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)]/80 hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8]/60 text-[var(--theme-text,#F8FAFC)] hover:text-[#38BDF8] font-bold text-[11px] sm:text-[11.5px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs backdrop-blur-xs"
                title="Visit HasVolt Official Website (https://www.hasvolt.com)"
              >
                <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="hidden sm:inline">Website</span>
                <ExternalLink className="w-2.5 h-2.5 text-[var(--theme-text-muted,#8BA4D0)]" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Footer Bar Variant */
        <div
          role="region"
          aria-label="Sponsored Partner Banner: HasVolt"
          className={`w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3 text-left ${className}`}
        >
          {/* Left Brand & Details */}
          <div className="flex items-center gap-3 min-w-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="w-11 h-11 rounded-xl overflow-hidden border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] shrink-0 cursor-pointer flex items-center justify-center hover:border-[#38BDF8] transition-colors"
              title="View full HasVolt poster"
              aria-label="View full HasVolt poster"
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
                <Zap className="w-5 h-5 text-[#38BDF8]" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold uppercase px-1.5 py-0.5 rounded text-[8.5px] tracking-wider bg-[#0284C7] text-white">
                  SPONSORED
                </span>
                <span className="font-bold text-[var(--theme-text,#F8FAFC)] text-[14px]">
                  {brand}
                </span>
                <span className="text-[12px] text-[#38BDF8] font-semibold">
                  • {tagline}
                </span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-muted,#8BA4D0)] truncate mt-0.5">
                {services.join(' • ')} | {primaryServiceArea} ({secondaryServiceArea})
              </p>
            </div>
          </div>

          {/* Right Action Buttons (NO CALL BUTTON) */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Poster</span>
            </button>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Website</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-400/40 hover:border-emerald-300/80 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(16,185,129,0.15)] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-white/15 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-400/25 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Full-Screen Poster View Modal rendered via React Portal */}
      {isPosterModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsPosterModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="HasVolt Professional Electrical Services Poster"
          >
            <div
              className="relative max-w-xl w-full max-h-[92vh] bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase px-1.5 py-0.5 rounded text-[9px] tracking-wider bg-[#0284C7] text-white">
                      SPONSORED
                    </span>
                    <h4 className="text-[15px] sm:text-[17px] font-extrabold text-[var(--theme-text,#F8FAFC)]">
                      {brand}
                    </h4>
                  </div>
                  <p className="text-[12px] font-semibold text-[#38BDF8]">
                    {tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#8BA4D0)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                  aria-label="Close poster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content: Poster Image & Details */}
              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3 bg-[var(--theme-surface,#0E1A29)]/60">
                <div className="flex items-center justify-center bg-black/40 rounded-xl p-2 border border-[var(--theme-border,#213E61)]">
                  <img
                    src={imgSrc}
                    alt="HasVolt Professional Electrical Services Poster"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="max-h-[42vh] w-auto rounded-lg object-contain"
                  />
                </div>

                {/* Service Highlights */}
                <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{teamInfo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11.5px] text-[var(--theme-text,#F8FAFC)]">
                    {services.map((svc) => (
                      <div key={svc} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#38BDF8] shrink-0" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/60 flex items-center justify-between flex-wrap gap-1 text-[11px] text-[var(--theme-text-muted,#8BA4D0)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#38BDF8]" />
                      <span>{primaryServiceArea}</span>
                    </span>
                    <span className="text-[#F59E0B] font-medium">
                      {secondaryServiceArea}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Quick Actions (NO CALL BUTTON) */}
              <div className="p-3.5 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between gap-3">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#38BDF8]" />
                  <span>Visit Website</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden flex-1 max-w-[200px] py-2 px-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-300 hover:text-white border border-emerald-400/40 hover:border-emerald-300/80 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(16,185,129,0.15)] font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-white/15 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                  <MessageSquare className="w-4 h-4 fill-emerald-400/25 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
