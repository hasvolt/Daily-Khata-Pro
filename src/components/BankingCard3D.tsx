import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, ShieldCheck, Eye, EyeOff, TrendingUp, Sparkles, BadgeCheck } from 'lucide-react';
import { getCurrencyConfig } from '../utils/currencyConfig';

interface BankingCard3DProps {
  totalWealth: number;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
  dateFormatted: string;
  t: any;
  pageT: any;
  onAddClick: (type: 'income' | 'expense') => void;
  onTogglePrivacyMask?: () => void;
}

function numberToWords(amount: number, isHindi: boolean = false, currencyCode: string = 'INR'): string {
  if (isNaN(amount)) return '';
  const isNegative = amount < 0;
  const abs = Math.abs(Math.round(amount * 100) / 100);
  const whole = Math.floor(abs);
  const paise = Math.round((abs - whole) * 100);

  if (whole === 0 && paise === 0) {
    return isHindi ? 'शून्य रुपये मात्र' : 'Zero Rupees Only';
  }

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    const unit = n % 10;
    return `${tens[Math.floor(n / 10)]}${unit > 0 ? ' ' + ones[unit] : ''}`;
  };

  const convertNumber = (n: number): string => {
    if (n < 100) return convertTwoDigits(n);
    const h = Math.floor(n / 100);
    const r = n % 100;
    return `${ones[h]} Hundred${r > 0 ? ' ' + convertTwoDigits(r) : ''}`;
  };

  const crore = Math.floor(whole / 10000000);
  const lakh = Math.floor((whole % 10000000) / 100000);
  const thousand = Math.floor((whole % 100000) / 1000);
  const hundred = Math.floor((whole % 1000) / 100);
  const rest = whole % 100;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${convertNumber(crore)} Crore`);
  if (lakh > 0) parts.push(`${convertNumber(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${convertNumber(thousand)} Thousand`);
  if (hundred > 0) parts.push(`${ones[hundred]} Hundred`);
  if (rest > 0) parts.push(convertTwoDigits(rest));

  let words = parts.join(' ').trim();
  if (!words) words = 'Zero';

  const currencyName = currencyCode === 'INR' ? (isHindi ? 'रुपये' : 'Rupees') : (isHindi ? 'रुपये' : 'Rupees');

  if (isHindi) {
    return `${isNegative ? 'माइनस ' : ''}${words} ${currencyName} मात्र`;
  }

  let result = `${isNegative ? 'Minus ' : ''}${words} ${currencyName}`;
  if (paise > 0) {
    result += ` and ${convertTwoDigits(paise)} Paise`;
  }
  result += ' Only';
  return result;
}

export function BankingCard3D({
  totalWealth,
  formatCurrency,
  privacyMask,
  dateFormatted,
  t,
  pageT: _pageT,
  onAddClick,
  onTogglePrivacyMask,
}: BankingCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['2.5deg', '-2.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-2.5deg', '2.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isHindi = t?.language === 'hi' || /मंग|बुध|गुरु|शुक्र|शनि|रवि|सोम/.test(dateFormatted);
  const currencyCode = getCurrencyConfig().code || 'INR';

  const activeDate = useMemo(() => {
    try {
      const d = new Date();
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const day = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const year = d.getFullYear();
      return `${dayName}, ${day} ${month}, ${year}`;
    } catch {
      return (dateFormatted || '').toUpperCase();
    }
  }, [dateFormatted]);

  return (
    <div style={{ perspective: 1200 }} className="w-full relative z-10">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="banking-card-3d relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] backdrop-blur-xl p-2.5 xs:p-3 sm:p-4 md:p-[18px] transition-all"
      >
        {/* Luxury Multi-Layer Ambient Glow Nebulae (Dynamically matches active theme) */}
        <div className="banking-card-ambient-glow absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top-Right Luminous Accent Nebula */}
          <div className="absolute -right-6 -top-10 h-48 w-56 rounded-full bg-[radial-gradient(circle,var(--theme-primary,#38BDF8)_0%,transparent_70%)] opacity-25 blur-2xl" />
          {/* Bottom-Left Deep Atmospheric Glow */}
          <div className="absolute -left-10 -bottom-10 h-48 w-56 rounded-full bg-[radial-gradient(circle,var(--card-gradient-from,#1D4ED8)_0%,transparent_70%)] opacity-20 blur-2xl" />
          {/* Subtle Mid-Center Bloom */}
          <div className="absolute left-1/3 top-1/4 h-32 w-36 rounded-full bg-[radial-gradient(circle,var(--theme-primary,#38BDF8)_0%,transparent_70%)] opacity-15 blur-xl" />
        </div>

        {/* High-Precision Guilloché Security Watermark & Luxury Texture */}
        <div className="banking-card-waves absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Luxury Brushed Carbon Cross-Weave Micro-Texture (No dots) */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0px, rgba(255, 255, 255, 0.22) 1px, transparent 1px, transparent 8px),
                               repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.12) 0px, rgba(255, 255, 255, 0.12) 1px, transparent 1px, transparent 8px)`,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Precision Guilloché curves & concentric security orbital rings */}
          <svg
            className="absolute right-0 -top-4 w-80 h-60 sm:w-96 sm:h-72 pointer-events-none stroke-[var(--theme-primary,#38BDF8)]"
            viewBox="0 0 360 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="guillocheGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--theme-primary, #38BDF8)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#818CF8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Concentric orbital rings */}
            <circle cx="280" cy="65" r="35" stroke="url(#guillocheGrad)" strokeWidth="1.2" strokeOpacity="0.35" />
            <circle cx="280" cy="65" r="60" stroke="url(#guillocheGrad)" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
            <circle cx="280" cy="65" r="95" stroke="url(#guillocheGrad)" strokeWidth="1.2" strokeOpacity="0.2" />
            <circle cx="280" cy="65" r="130" stroke="url(#guillocheGrad)" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="5 5" />

            {/* Parabolic Guilloché security waves */}
            <path
              d="M10 260 C80 180, 160 210, 260 110 C310 60, 335 30, 360 -10"
              stroke="url(#guillocheGrad)"
              strokeWidth="2"
              strokeOpacity="0.45"
            />
            <path
              d="M40 270 C110 195, 190 225, 280 130 C325 80, 345 45, 365 5"
              stroke="url(#guillocheGrad)"
              strokeWidth="1.5"
              strokeOpacity="0.35"
            />
            <path
              d="M80 280 C140 210, 220 240, 300 150 C340 100, 355 60, 370 20"
              stroke="url(#guillocheGrad)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              strokeOpacity="0.25"
            />
          </svg>
        </div>

        {/* Specular Diagonal Glass Glaze and Top Rim Laser Bevel */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent select-none" />
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--theme-primary,#38BDF8)]/70 via-white/80 to-transparent pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10">
          {/* Header Row: Wallet + TOTAL NET BALANCE & Rounded Badges */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Left: Wallet Icon Box & Titles */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="banking-card-icon-box w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border border-[var(--theme-primary-border,rgba(56,189,248,0.40))] bg-gradient-to-br from-[var(--theme-primary,#38BDF8)]/25 to-[var(--theme-primary,#38BDF8)]/10 flex items-center justify-center shrink-0 transition-transform duration-200 shadow-xs">
                <Wallet className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[var(--theme-primary,#38BDF8)] stroke-[2.2] drop-shadow-sm" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <h2 className="banking-card-title text-[11.5px] xs:text-[12.5px] sm:text-[14px] font-bold text-white tracking-wide uppercase leading-tight whitespace-nowrap">
                    {isHindi ? 'कुल शुद्ध बैलेंस' : 'TOTAL NET BALANCE'}
                  </h2>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onTogglePrivacyMask) onTogglePrivacyMask();
                    }}
                    title={privacyMask ? (isHindi ? 'बैलेंस दिखाएं' : 'Show Balance') : (isHindi ? 'बैलेंस छिपाएं' : 'Hide Balance')}
                    className="text-[var(--theme-primary,#38BDF8)] hover:text-white p-0.5 rounded-full hover:bg-[var(--theme-primary,#38BDF8)]/20 active:scale-90 transition-all cursor-pointer shrink-0"
                    aria-label={privacyMask ? 'Show Balance' : 'Hide Balance'}
                  >
                    {privacyMask ? (
                      <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" strokeWidth={2.4} />
                    ) : (
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)] hover:text-white" strokeWidth={2.4} />
                    )}
                  </button>
                </div>
                <p className="text-[9.5px] sm:text-[10.5px] font-medium text-[var(--theme-text-muted,#CBD5E1)] leading-tight mt-0.5 truncate">
                  {isHindi ? 'आपका संपूर्ण वित्तीय सारांश' : 'Your overall financial summary'}
                </p>
              </div>
            </div>

            {/* Right: EMV Smart Card Gold Chip + Stacked Badges */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Authentic EMV Gold Smart Contact Chip */}
              <div className="hidden xs:flex flex-col items-center gap-0.5 select-none" title="EMV Smart Banking Chip">
                <div className="w-8 h-6 sm:w-9 sm:h-6.5 rounded-[5px] bg-gradient-to-tr from-[#A67C1E] via-[#F3CE72] to-[#FFE8A3] p-[1px] shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.7)] relative overflow-hidden">
                  <div className="w-full h-full rounded-[4px] bg-gradient-to-br from-[#D4AF37] via-[#F5E6B3] to-[#B8860B] relative flex items-center justify-center">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[0.8px] bg-[#6B4B1B]/70" />
                    <div className="absolute inset-y-0 left-1/3 w-[0.8px] bg-[#6B4B1B]/70" />
                    <div className="absolute inset-y-0 right-1/3 w-[0.8px] bg-[#6B4B1B]/70" />
                    <div className="w-2.5 h-2.5 rounded-full border border-[#6B4B1B]/70 bg-[#F5E6B3]/60" />
                  </div>
                </div>
              </div>

              {/* Stacked Badges (SECURED & Date) */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {/* SECURED badge with professional ShieldCheck icon */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] bg-[var(--theme-surface,#060D1A)]/90 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" strokeWidth={2.4} />
                  <span className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-bold text-white tracking-wider uppercase">
                    SECURED
                  </span>
                </div>
                {/* Date badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] bg-[var(--theme-surface,#060D1A)]/90 shadow-2xs">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" strokeWidth={2.4} />
                  <span className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-bold text-white tracking-wide uppercase whitespace-nowrap">
                    {activeDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: AVAILABLE BALANCE & Exact Amount / In Words */}
          <div className="mt-1.5 sm:mt-2.5">
            <div className="mb-0.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" strokeWidth={2.4} />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[var(--theme-text-muted,#CBD5E1)] uppercase">
                {isHindi ? 'उपलब्ध बैलेंस' : 'AVAILABLE BALANCE'}
              </span>
            </div>

            {privacyMask ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-white font-mono leading-none">
                    ₹
                  </span>
                  <span className="text-lg sm:text-xl text-white tracking-[0.25em] font-mono leading-none select-none">
                    • • • • •
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-[var(--theme-text-muted,#CBD5E1)] mt-0.5 tracking-widest select-none">
                  ••••••••••••••
                </p>
              </div>
            ) : (
              <div className="min-w-0">
                <div className="text-[22px] xs:text-[26px] sm:text-[32px] md:text-[36px] font-black text-white tracking-tight leading-tight break-words drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  {formatCurrency(totalWealth, false)}
                </div>
                <div className="mt-0.5 max-w-full">
                  <p
                    className="banking-card-words text-[7px] xs:text-[7.5px] sm:text-[10px] font-medium text-[var(--theme-text-muted,#94A3B8)] leading-tight break-words line-clamp-2 select-none"
                    title={numberToWords(totalWealth, isHindi, currencyCode)}
                  >
                    {numberToWords(totalWealth, isHindi, currencyCode)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Divider Line above buttons - Crisp Specular Horizon Line */}
          <div className="hero-buttons-divider border-t-2 border-[var(--theme-primary,#38BDF8)] shadow-[0_1px_12px_var(--theme-glow,rgba(56,189,248,0.45))] pt-2 sm:pt-2.5 mt-2 sm:mt-2.5 opacity-95">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <motion.button
                type="button"
                onClick={() => onAddClick('income')}
                id="hero-add-income-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00C853] via-[#00E676] to-[#00B047] hover:from-[#00E676] hover:to-[#00C853] active:scale-[0.98] text-slate-950 font-black text-[12.5px] sm:text-[14px] flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,230,118,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-all cursor-pointer select-none"
              >
                <span className="text-base sm:text-lg font-black leading-none">+</span>
                <span>{isHindi ? 'आय जोड़ें' : 'Add Income'}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => onAddClick('expense')}
                id="hero-add-expense-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF1744] via-[#FF5252] to-[#D50000] hover:from-[#FF5252] hover:to-[#FF1744] active:scale-[0.98] text-white font-black text-[12.5px] sm:text-[14px] flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(255,23,68,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all cursor-pointer select-none"
              >
                <span className="text-base sm:text-lg font-black leading-none">−</span>
                <span>{isHindi ? 'खर्च जोड़ें' : 'Add Expense'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BankingCard3D;


