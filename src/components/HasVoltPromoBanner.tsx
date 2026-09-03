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
  variant?: 'card' | 'bar';
}

export const HasVoltPromoBanner: React.FC<HasVoltPromoBannerProps> = ({
  className = '',
  variant = 'card'
}) => {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('/Hasvolt-peofasianal-electrical-services-ads-1.png');
  const [imgError, setImgError] = useState(false);

  const websiteUrl = 'https://www.hasvolt.com';
  const googleReviewUrl = 'https://g.page/r/CdgSZ8fLkYKVEBM/review';
  const phoneFormatted = '+91 8383098574';
  const phoneRaw = '+918383098574';
  const whatsappUrl = `https://wa.me/918383098574?text=${encodeURIComponent('Hi HasVolt, I need electrical service assistance.')}`;

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
        setShowBanner(true);
      }
    } catch (e) {
      setShowBanner(true);
    }
  }, []);

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

  if (!showBanner) return null;

  return (
    <>
      {variant === 'card' ? (
        /* HasVolt Sponsored Ad Card (Homepage Side-by-side with Recent Transactions) */
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
          className={`w-full h-full bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-2xl p-3.5 sm:p-5 shadow-md flex flex-col justify-between space-y-3.5 text-left transition-all duration-300 cursor-pointer group select-none ${className}`}
        >
          {/* Top Section: Photo Thumbnail + Service Info */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Clickable Mini Poster Thumbnail */}
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-[var(--theme-border,#0D2654)] bg-[var(--theme-surface,#020A1A)] group-hover:border-[var(--theme-primary,#1E4E9E)] transition-colors flex items-center justify-center shadow-xs"
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
                  <Wrench className="w-5 h-5 text-[var(--theme-primary,#38BDF8)] mx-auto" />
                  <div className="text-[9px] font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">HasVolt</div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white drop-shadow" />
              </div>
            </div>

            {/* Service Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold uppercase px-2 py-0.5 rounded text-[9.5px] tracking-wider bg-[#0284C7] text-white shadow-xs inline-flex items-center gap-1">
                  SPONSORED
                </span>
                <span className="text-[var(--theme-text,#F8FAFC)] font-bold text-[15px] sm:text-[17px] tracking-tight">HasVolt</span>
              </div>
              <p className="text-[12px] sm:text-[13px] font-medium text-[var(--theme-text-muted,#8BA4D0)] truncate">
                Professional Electrical Services
              </p>
              <p className="text-[11px] sm:text-[11.5px] text-[var(--theme-text-dim,#7E9BC9)] leading-snug line-clamp-2">
                House Wiring, Repairing, Breakdown &amp; Installation • Certified Electricians
              </p>
            </div>
          </div>

          {/* Middle Row: Availability & Service Coverage Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] text-[11px] text-[var(--theme-text-muted,#8BA4D0)] font-medium">
              <Clock className="w-3 h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <span>8 AM – 9 PM</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] text-[11px] text-[var(--theme-text-muted,#8BA4D0)] font-medium truncate">
              <MapPin className="w-3 h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <span>Delhi NCR &amp; Across India</span>
            </span>
          </div>

          {/* Bottom Row: Action Buttons */}
          <div
            className="flex items-center gap-2 pt-2 border-t border-[var(--theme-border,#0A1E42)] flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            {/* View Full Poster Button */}
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-[var(--theme-surface,#020A1A)] hover:bg-[var(--theme-card-hover,#07183D)] border border-[var(--theme-border,#0D2B5E)] hover:border-[var(--theme-primary,#1E4E9E)] text-[var(--theme-text,#F8FAFC)] font-semibold text-[11px] sm:text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Open full poster and service card"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>Poster</span>
            </button>

            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-2.5 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#10B981] font-bold text-[11px] sm:text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Chat on WhatsApp (+91 8383098574)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Call Button */}
            <a
              href={`tel:${phoneRaw}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-[var(--theme-surface,#020A1A)] hover:bg-[var(--theme-card-hover,#07183D)] border border-[var(--theme-border,#0D2B5E)] text-[var(--theme-text,#F8FAFC)] font-semibold text-[11px] sm:text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title={`Call ${phoneFormatted}`}
            >
              <Phone className="w-3.5 h-3.5 text-[var(--theme-text-muted,#8BA4D0)]" />
              <span>Call</span>
            </a>

            {/* Google Review Star Button */}
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[var(--theme-surface,#020A1A)] hover:bg-[var(--theme-card-hover,#07183D)] border border-[var(--theme-border,#0D2B5E)] text-[#F59E0B] transition-colors flex items-center justify-center cursor-pointer shadow-xs shrink-0"
              title="Rate & Review HasVolt on Google"
            >
              <Star className="w-4 h-4 fill-[#F59E0B]/20 text-[#F59E0B]" />
            </a>
          </div>
        </div>
      ) : (
        /* Footer Bar Variant */
        <div
          role="region"
          aria-label="Sponsored Partner Banner: HasVolt"
          className={`w-full bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-left ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
            <div
              onClick={() => setIsPosterModalOpen(true)}
              className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--theme-border,#0D2654)] bg-[var(--theme-surface,#020A1A)] shrink-0 cursor-pointer flex items-center justify-center"
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
                <Zap className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase px-1.5 py-0.5 rounded text-[9px] tracking-wider bg-[#0284C7] text-white">
                  SPONSORED
                </span>
                <span className="font-bold text-[var(--theme-text,#F8FAFC)] text-[13px] sm:text-[14px]">HasVolt Electrical Services</span>
              </div>
              <p className="text-[11px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                House Wiring • Breakdown &amp; Repair • Installation • Delhi NCR &amp; Pan-India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsPosterModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#020A1A)] hover:bg-[var(--theme-card-hover,#07183D)] border border-[var(--theme-border,#0D2B5E)] text-[var(--theme-text,#F8FAFC)] text-[11.5px] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>Poster</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 text-[11.5px] font-bold flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${phoneRaw}`}
              className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-[11.5px] font-bold flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

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
              className="relative max-w-2xl w-full max-h-[90vh] bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[var(--theme-border,#0D2654)] bg-[var(--theme-surface,#020A1A)]">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded text-[9.5px] tracking-wider bg-[#0284C7] text-white">
                    SPONSORED
                  </span>
                  <h4 className="text-[14px] sm:text-[16px] font-bold text-[var(--theme-text,#F8FAFC)]">HasVolt Electrical Services</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--theme-card,#040E24)] hover:bg-[var(--theme-card-hover,#07183D)] border border-[var(--theme-border,#0D2654)] text-[var(--theme-text-muted,#8BA4D0)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                  aria-label="Close poster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Area */}
              <div className="p-3 sm:p-5 flex items-center justify-center bg-black/40 overflow-y-auto max-h-[60vh]">
                <img
                  src={imgSrc}
                  alt="HasVolt Professional Electrical Services Full Poster"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="max-h-[55vh] w-auto rounded-xl object-contain border border-[var(--theme-border,#0D2654)] shadow-lg"
                />
              </div>

              {/* Modal Footer Quick Actions */}
              <div className="p-3.5 sm:p-4 border-t border-[var(--theme-border,#0D2654)] bg-[var(--theme-surface,#020A1A)] flex flex-wrap items-center justify-between gap-2.5">
                <div className="text-[11.5px] text-[var(--theme-text-muted,#8BA4D0)]">
                  Delhi NCR &amp; Pan-India Service <span className="text-[var(--theme-primary,#38BDF8)]">•</span> +91 8383098574
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[12px] flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-[12px] flex items-center gap-1.5 shadow-sm transition-colors"
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
