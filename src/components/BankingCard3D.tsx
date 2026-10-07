import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, ShieldCheck, Eye, EyeOff } from 'lucide-react';
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
        {/* Subtle, soft localized corner accent atmosphere */}
        <div className="banking-card-ambient-glow absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute right-0 top-0 h-28 w-36 rounded-full bg-[var(--theme-primary,#38BDF8)]/10 blur-xl" />
        </div>

        {/* Decorative Wave & Dotted Background Geometry (Theme Foil Accent) */}
        <div className="banking-card-waves absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Subtle dotted matrix watermark */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--theme-primary, #38BDF8) 1.2px, transparent 1.2px)',
              backgroundSize: '16px 16px',
            }}
          />
          {/* Elegant geometric banking card arcs & security wave watermark */}
          <svg
            className="absolute -right-4 -top-6 w-72 h-52 sm:w-88 sm:h-64 pointer-events-none stroke-[var(--theme-primary,#38BDF8)]"
            viewBox="0 0 320 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Concentric security watermark rings */}
            <circle cx="260" cy="50" r="40" strokeWidth="1.2" strokeOpacity="0.28" />
            <circle cx="260" cy="50" r="70" strokeWidth="1.2" strokeOpacity="0.22" strokeDasharray="4 4" />
            <circle cx="260" cy="50" r="105" strokeWidth="1" strokeOpacity="0.18" />
            
            {/* Flowing modern financial wave curves */}
            <path
              d="M30 220 C100 150, 180 180, 260 90 C300 45, 315 20, 330 -10"
              strokeWidth="1.8"
              strokeOpacity="0.38"
            />
            <path
              d="M70 230 C130 170, 200 195, 275 115 C310 75, 325 50, 340 10"
              strokeWidth="2.2"
              strokeOpacity="0.48"
            />
            <path
              d="M110 240 C160 190, 220 210, 290 140 C320 105, 335 80, 350 30"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              strokeOpacity="0.32"
            />
          </svg>
        </div>

        {/* Subtle diagonal luxury glass sheen and top rim highlight */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent select-none" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10">
          {/* Header Row: Wallet + TOTAL NET BALANCE & Rounded Badges */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Left: Wallet Icon Box & Titles */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="banking-card-icon-box w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border border-[var(--theme-primary-border,rgba(56,189,248,0.40))] bg-gradient-to-br from-[var(--theme-primary,#38BDF8)]/25 to-[var(--theme-primary,#38BDF8)]/10 flex items-center justify-center shrink-0 transition-transform duration-200">
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

            {/* Right: Stacked Rounded Badges (SECURED & Date) */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {/* SECURED badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] bg-[var(--theme-surface,#0E1A29)]/85 shadow-2xs">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" strokeWidth={2.4} />
                <span className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-bold text-white tracking-wider uppercase">
                  SECURED
                </span>
              </div>
              {/* Date badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] bg-[var(--theme-surface,#0E1A29)]/85 shadow-2xs">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--theme-primary,#38BDF8)] shrink-0" strokeWidth={2.4} />
                <span className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-bold text-white tracking-wide uppercase whitespace-nowrap">
                  {activeDate}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section: AVAILABLE BALANCE & Exact Amount / In Words */}
          <div className="mt-1.5 sm:mt-2.5">
            <div className="mb-0.5 flex items-center gap-1.5">
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
                <div className="text-[21px] xs:text-[24px] sm:text-[30px] md:text-[34px] font-black text-white tracking-tight leading-tight break-words drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
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

          {/* Divider Line above buttons - Crisp 3D Horizon Line (Boosted Visibility) */}
          <div className="hero-buttons-divider border-t-2 border-[var(--theme-primary,#38BDF8)] shadow-[0_1px_8px_var(--theme-glow,rgba(56,189,248,0.45))] pt-2 sm:pt-2.5 mt-2 sm:mt-2.5 opacity-90">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <motion.button
                type="button"
                onClick={() => onAddClick('income')}
                id="hero-add-income-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="py-2 sm:py-2.5 px-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00c853] to-[#00b047] hover:from-[#00e676] hover:to-[#00c853] active:scale-[0.98] text-white font-extrabold text-[12px] sm:text-[13.5px] flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(0,200,83,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all cursor-pointer select-none"
              >
                <span className="text-sm sm:text-base font-black leading-none">+</span>
                <span>{isHindi ? 'आय जोड़ें' : 'Add Income'}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => onAddClick('expense')}
                id="hero-add-expense-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="py-2 sm:py-2.5 px-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ff1744] to-[#d50000] hover:from-[#ff3d67] hover:to-[#ff1744] active:scale-[0.98] text-white font-extrabold text-[12px] sm:text-[13.5px] flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(255,23,68,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all cursor-pointer select-none"
              >
                <span className="text-sm sm:text-base font-black leading-none">−</span>
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


