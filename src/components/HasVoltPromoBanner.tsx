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
      {/* Professional & Balanced Sponsored Ad Banner */}
      <div
        role="complementary"
        aria-label="Sponsored by HasVolt : Professional Electrical Services"
        className={`w-full max-w-4xl mx-auto rounded-2xl border border-[#25384E] bg-gradient-to-r from-[#0B131F] via-[#080D16] to-[#0B131F] shadow-lg overflow-hidden text-left hover:border-[#38BDF8]/40 transition-all ${className}`}
      >
        <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left Section: Thumbnail + Info */}
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
            {/* Clickable Mini Poster Thumbnail */}
            <div
              onClick={() => setIsPosterModalOpen(true)}
              className="relative w-22 h-16 sm:w-24 sm:h-18 shrink-0 rounded-xl overflow-hidden border border-[#2B3E54] bg-[#05080E] cursor-pointer group shadow-sm select-none flex items-center justify-center"
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
                  <Wrench className="w-5 h-5 text-amber-400 mx-auto" />
                  <div className="text-[9px] font-bold text-white mt-0.5">HasVolt</div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-1 rounded-md bg-black/80 text-[10px] text-white flex items-center gap-1 font-medium">
                  <Maximize2 className="w-3 h-3" />
                  <span>Zoom</span>
                </span>
              </div>
            </div>

            {/* Clear Typography & Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold uppercase px-2 py-0.5 rounded text-[9.5px] tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  SPONSORED
                </span>
                <span className="text-white font-bold text-[14px] sm:text-[15px] tracking-tight">HasVolt</span>
                <span className="text-[#64748B] text-[12px] hidden xs:inline">•</span>
                <span className="text-[#94A3B8] text-[12px] sm:text-[12.5px] font-medium truncate">Professional Electrical Services</span>
              </div>

              <p className="text-[11.5px] text-[#CBD5E1] truncate mt-1 font-normal">
                House Wiring, Repairing, Breakdown &amp; Installation • Certified Electricians
              </p>

              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1 font-medium">
                <span className="flex items-center gap-1 text-[#CBD5E1]">
                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>8:00 AM – 9:00 PM</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#CBD5E1] truncate">
                  <MapPin className="w-3 h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                  <span>Delhi NCR &amp; Across India</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Section: Crisp Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E2C3D]/70">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#05080E] font-bold text-[12px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Chat on WhatsApp (+91 8383098574)"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${phoneRaw}`}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#05080E] font-bold text-[12px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title={`Call ${phoneFormatted}`}
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call</span>
            </a>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] hover:border-[#38BDF8]/50 text-[#CBD5E1] hover:text-white transition-all flex items-center gap-1 text-[11.5px] font-medium"
              title="Visit HasVolt Official Website"
            >
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden md:inline">Website</span>
            </a>

            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-amber-400 hover:text-amber-300 transition-all flex items-center gap-1 text-[11.5px] font-medium"
              title="Rate HasVolt or Give Ad Feedback on Google"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="hidden lg:inline">Feedback</span>
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
                <span className="px-2 py-0.5 rounded font-extrabold text-[9.5px] uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  SPONSORED
                </span>
                <h3 className="font-bold text-[13.5px] text-white flex items-center gap-1.5">
                  <span className="font-black text-white">HasVolt</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="text-[#CBD5E1] font-normal italic text-[12px]">Professional Electrical Services</span>
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
                    <Wrench className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-base font-bold text-white">HasVolt : Professional Electrical Services</div>
                    <div className="text-xs text-[#94A3B8]">Certified Electricians &amp; Technicians • Repairing • Installation • Emergency • House Wiring</div>
                  </div>
                )}
              </div>

              {/* Working Hours & Contact Strip */}
              <div className="w-full bg-[#0D1420] border border-[#2B3A4E] rounded-xl p-2.5 text-[11.5px] text-[#94A3B8] space-y-1">
                <div className="flex justify-between items-center text-white font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#CBD5E1]" />
                    <span>Working Hours: 8:00 AM – 9:00 PM</span>
                  </span>
                  <span className="text-[#94A3B8]">Delhi NCR &amp; Across India</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#223042]">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Certified Electricians &amp; Technicians on Call</span>
                  </span>
                  <span className="font-mono text-white">Ph: {phoneFormatted}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-4 py-2.5 bg-[#06090F] border-t border-[#223042] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-white text-[11.5px] font-semibold flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#CBD5E1]" />
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3 text-[#64748B]" />
              </a>

              <div className="flex items-center gap-1.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-[#05080E] font-bold text-[11.5px] flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-white font-medium text-[11.5px] flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden xs:inline">Feedback</span>
                </a>
                <a
                  href={`tel:${phoneRaw}`}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#05080E] font-bold text-[11.5px] flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
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


