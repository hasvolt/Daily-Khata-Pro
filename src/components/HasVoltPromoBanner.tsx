import React, { useState } from 'react';
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
  ShieldCheck
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

  const handleImageError = () => {
    if (imgSrc !== '/Hasvolt-peofasianal-electrical-services-ads-1.png') {
      setImgSrc('/Hasvolt-peofasianal-electrical-services-ads-1.png');
    } else {
      setImgError(true);
    }
  };

  return (
    <>
      {/* Professional & Elegant Sponsored Ad Banner */}
      <div
        role="complementary"
        aria-label="Sponsored by HasVolt : Professional Electrical Services"
        className={`w-full max-w-4xl mx-auto rounded-xl border border-[var(--theme-border,#213E61)]/70 bg-[var(--theme-card,#132438)]/60 shadow-xs overflow-hidden text-left hover:border-[var(--theme-border,#213E61)] transition-colors ${className}`}
      >
        <div className="p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Left Section: Thumbnail + Info */}
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto flex-1">
            {/* Clickable Mini Poster Thumbnail */}
            <div
              onClick={() => setIsPosterModalOpen(true)}
              className="relative w-16 h-12 sm:w-18 sm:h-14 shrink-0 rounded-lg overflow-hidden border border-[var(--theme-border,#213E61)] bg-[#05080E] cursor-pointer group select-none flex items-center justify-center"
              title="Click to view full HasVolt poster"
            >
              {!imgError ? (
                <img
                  src={imgSrc}
                  alt="HasVolt Professional Electrical Services"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-150"
                />
              ) : (
                <div className="p-1 text-center">
                  <Wrench className="w-4 h-4 text-[#94A3B8] mx-auto" />
                  <div className="text-[8.5px] font-medium text-[#94A3B8] mt-0.5">HasVolt</div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Clear Typography & Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold uppercase px-2 py-0.5 rounded-md text-[9px] tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-xs">
                  ★ SPONSORED
                </span>
                <span className="text-[#F1F5F9] font-bold text-[13px] tracking-tight">HasVolt</span>
                <span className="text-[#64748B] text-[11px] hidden xs:inline">•</span>
                <span className="text-[#94A3B8] text-[11.5px] font-normal truncate">Professional Electrical Services</span>
              </div>

              <p className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-normal">
                House Wiring, Repairing, Breakdown &amp; Installation • Certified Electricians
              </p>

              <div className="flex items-center gap-2 text-[10.5px] text-[#64748B] mt-0.5">
                <span className="flex items-center gap-1 text-[#94A3B8]">
                  <Clock className="w-3 h-3 text-[#64748B] shrink-0" />
                  <span>8 AM – 9 PM</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#94A3B8] truncate">
                  <MapPin className="w-3 h-3 text-[#64748B] shrink-0" />
                  <span>Delhi NCR &amp; India</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Crisp Action Buttons (Calm, non-irritating) */}
          <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[var(--theme-border,#213E61)]/40">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.2 rounded-lg bg-[#10B981]/12 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Chat on WhatsApp (+91 8383098574)"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${phoneRaw}`}
              className="px-2.5 py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title={`Call ${phoneFormatted}`}
            >
              <Phone className="w-3 h-3 text-[#94A3B8]" />
              <span>Call</span>
            </a>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center justify-center cursor-pointer"
              title="Visit HasVolt Official Website"
            >
              <Globe className="w-3 h-3" />
            </a>

            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-amber-300 transition-colors flex items-center justify-center cursor-pointer"
              title="Rate HasVolt on Google"
            >
              <Star className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Full-Screen Poster View Modal */}
      {isPosterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div
            className="bg-[#0B1019] border border-[#2B3A4E] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-2.5 bg-[#06090F] border-b border-[#223042] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md font-extrabold text-[9px] uppercase bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-xs">
                  ★ SPONSORED
                </span>
                <h3 className="font-bold text-[13.5px] text-white flex items-center gap-1.5">
                  <span className="font-bold text-[#F1F5F9]">HasVolt</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="text-[#94A3B8] font-normal text-[12px]">Professional Electrical Services</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Poster Image View */}
            <div className="p-3.5 bg-[#06090F] overflow-y-auto space-y-3 flex flex-col items-center">
              <div className="w-full rounded-xl overflow-hidden border border-[#2B3A4E] bg-[#05080E] flex items-center justify-center p-1">
                {!imgError ? (
                  <img
                    src={imgSrc}
                    alt="HasVolt Professional Electrical Services"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <Wrench className="w-6 h-6 text-[#94A3B8] mx-auto" />
                    <div className="text-base font-bold text-white">HasVolt : Professional Electrical Services</div>
                    <div className="text-xs text-[#94A3B8]">Certified Electricians &amp; Technicians • Repairing • Installation • Emergency • House Wiring</div>
                  </div>
                )}
              </div>

              {/* Working Hours & Contact Strip */}
              <div className="w-full bg-[#0D1420] border border-[#2B3A4E] rounded-xl p-2.5 text-[11.5px] text-[#94A3B8] space-y-1">
                <div className="flex justify-between items-center text-white font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Working Hours: 8:00 AM – 9:00 PM</span>
                  </span>
                  <span className="text-[#94A3B8]">Delhi NCR &amp; Across India</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#223042]">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#38BDF8]" />
                    <span>Certified Electricians &amp; Technicians on Call</span>
                  </span>
                  <span className="font-mono text-[#CBD5E1]">Ph: {phoneFormatted}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-4 py-2.5 bg-[#06090F] border-t border-[#223042] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-[#CBD5E1] hover:text-white text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3 text-[#64748B]" />
              </a>

              <div className="flex items-center gap-1.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 text-[#34D399] font-semibold text-[11.5px] flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-[#94A3B8] hover:text-amber-300 font-medium text-[11.5px] flex items-center gap-1.5 transition-colors"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Feedback</span>
                </a>
                <a
                  href={`tel:${phoneRaw}`}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569]/50 text-[#F1F5F9] font-semibold text-[11.5px] flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


