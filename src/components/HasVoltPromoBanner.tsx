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
  CheckCircle2,
  AlertCircle,
  Home,
  Building2,
  UserCheck,
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
      {/* Distinct Sponsored Ad Banner Container with Unique Dark Volt Theme */}
      <div
        role="complementary"
        aria-label="Sponsored by HasVolt : Professional Electrical Services"
        className={`w-full max-w-5xl mx-auto rounded-2xl border border-[#2B394A] bg-gradient-to-b from-[#0D141F] via-[#090D15] to-[#06090F] shadow-2xl overflow-hidden text-left ring-1 ring-white/5 ${className}`}
      >
        {/* Top Header Strip - Distinct Volt Obsidian Header */}
        <div className="bg-[#05080E]/95 px-4 py-2.5 border-b border-[#223042] flex flex-wrap items-center justify-between gap-2 text-[12px] select-none">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold uppercase px-2.5 py-0.5 rounded text-[10px] tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
              SPONSORED
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[13px]">
              <span className="text-[#94A3B8]">Sponsored by</span>
              <span className="text-white font-black tracking-tight text-[14px]">HasVolt</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#E2E8F0] font-medium italic text-[12.5px]">Professional Electrical Services</span>
            </div>
          </div>

          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#CBD5E1] hover:text-white transition-colors text-[11.5px] font-semibold bg-[#131D2A] hover:bg-[#1A2738] px-2.5 py-1 rounded-lg border border-[#2B3A4E] hover:border-[#3D526C]"
            title="Give Ad Feedback or Rate HasVolt on Google"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Ad Feedback</span>
            <ExternalLink className="w-3 h-3 text-[#64748B]" />
          </a>
        </div>

        {/* Ad Body with Distinct Styling */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-transparent">
          {/* Poster Image Thumbnail with Fixed Proportions */}
          <div
            onClick={() => setIsPosterModalOpen(true)}
            className="relative w-full sm:w-52 md:w-60 shrink-0 aspect-[2.2/1] sm:aspect-[2/1] rounded-xl overflow-hidden border border-[#2B3A4E] bg-[#05080E] cursor-pointer group shadow-lg select-none flex items-center justify-center"
            title="Click to view full poster"
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
              <div className="p-3 text-center space-y-1">
                <Wrench className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-[12px] font-bold text-white">HasVolt</div>
                <div className="text-[10px] text-[#94A3B8]">Certified Electricians &amp; Technicians</div>
              </div>
            )}

            {/* Hover Expand Icon */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="p-1.5 rounded-lg bg-black/90 flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 text-white border border-white/20">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Full Poster</span>
              </span>
            </div>
          </div>

          {/* Ad Content & Direct Action Buttons */}
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-3.5 w-full">
            <div className="space-y-2.5">
              {/* Electrician & Technician Sub-Headline */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Certified Electricians</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-sky-300 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                  <UserCheck className="w-3 h-3" />
                  <span>Expert Technicians</span>
                </span>
              </div>

              {/* Highlighted Services Chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Available Services:
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141F2D] border border-[#2B3D54] text-white text-[12px] font-semibold shadow-xs">
                    <Wrench className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Repairing</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141F2D] border border-[#2B3D54] text-white text-[12px] font-semibold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Installation</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141F2D] border border-[#2B3D54] text-white text-[12px] font-semibold shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Emergency Breakdown</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141F2D] border border-[#2B3D54] text-white text-[12px] font-semibold shadow-xs">
                    <Home className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>House Wiring</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141F2D] border border-[#2B3D54] text-white text-[12px] font-semibold shadow-xs">
                    <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Residential Projects</span>
                  </span>
                </div>
              </div>

              {/* Working Hours & Service Areas */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#94A3B8] pt-0.5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                  <span className="text-[#CBD5E1]">
                    <strong>Working Time:</strong> 8:00 AM – 9:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                  <span className="text-[#CBD5E1]">Delhi NCR &amp; Across India</span>
                </div>
              </div>
            </div>

            {/* Simple Clean Action Buttons (WhatsApp, Website, Ad Feedback, Call) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#05080E] font-bold text-[12.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] hover:border-[#3E5677] text-white font-semibold text-[12.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Globe className="w-4 h-4 text-[#CBD5E1]" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3 text-[#64748B]" />
              </a>

              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] hover:border-[#3E5677] text-[#CBD5E1] hover:text-white font-semibold text-[12.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Ad Feedback</span>
                <ExternalLink className="w-3 h-3 text-[#64748B]" />
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#05080E] font-bold text-[12.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call {phoneFormatted}</span>
              </a>
            </div>
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
            className="bg-[#0B1019] border border-[#2B3A4E] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#06090F] border-b border-[#223042] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-extrabold text-[10px] uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  SPONSORED
                </span>
                <h3 className="font-bold text-[14px] text-white flex items-center gap-1.5">
                  <span className="font-black text-white text-[15px]">HasVolt</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="text-[#CBD5E1] font-normal italic text-[12.5px]">Professional Electrical Services</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster Image View */}
            <div className="p-4 bg-[#06090F] overflow-y-auto space-y-3 flex flex-col items-center">
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
              <div className="w-full bg-[#0D1420] border border-[#2B3A4E] rounded-xl p-3 text-[12px] text-[#94A3B8] space-y-1.5">
                <div className="flex justify-between items-center text-white font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#CBD5E1]" />
                    <span>Working Hours: 8:00 AM – 9:00 PM</span>
                  </span>
                  <span className="text-[#94A3B8]">Delhi NCR &amp; Across India</span>
                </div>
                <div className="flex justify-between items-center text-[11.5px] pt-1 border-t border-[#223042]">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Electricians &amp; Technicians on Call</span>
                  </span>
                  <span>Phone: {phoneFormatted}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-4 py-3 bg-[#06090F] border-t border-[#223042] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-white text-[12px] font-semibold flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#CBD5E1]" />
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3 text-[#64748B]" />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-[#05080E] font-bold text-[12px] flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#141E2B] hover:bg-[#1C2B3E] border border-[#2B3D54] text-white font-medium text-[12px] flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Ad Feedback</span>
                </a>
                <a
                  href={`tel:${phoneRaw}`}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#05080E] font-bold text-[12px] flex items-center gap-1.5"
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

