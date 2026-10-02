import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, ShieldCheck, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

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
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-3deg', '3deg']);

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

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ perspective: 1200 }} className="w-full relative z-10">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="banking-card-3d relative overflow-hidden rounded-[20px] sm:rounded-2xl border border-[var(--theme-border,rgba(46,236,163,0.35))] bg-gradient-to-br from-[#0f3d25] via-[#092919] to-[#05170e] p-3.5 sm:p-4 md:p-[18px] shadow-xl"
      >
        {/* Subtle radial glow & theme-adaptive financial design watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Theme Primary Ambient Glow Spots */}
          <div className="banking-card-ambient-glow absolute -right-16 -top-12 h-64 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
          <div className="banking-card-ambient-glow absolute -left-16 -bottom-12 h-48 w-64 rounded-full bg-emerald-600/20 blur-3xl" />

          {/* Flowing Financial Vector Waves (Matches All Active Themes) */}
          <div className="banking-card-waves absolute right-[-2%] bottom-[12%] w-[72%] h-[64%] opacity-85">
            <svg className="w-full h-full" viewBox="0 0 520 280" fill="none" preserveAspectRatio="none">
              <path d="M0 230C105 229 166 183 247 151C325 120 380 64 445 71C481 75 505 91 520 104" stroke="var(--theme-primary,#10B981)" strokeWidth="2.5" strokeOpacity=".85" />
              <path d="M0 248C105 247 174 201 255 169C332 139 386 84 449 91C482 95 505 108 520 119" stroke="var(--theme-primary,#10B981)" strokeWidth="1.8" strokeOpacity=".55" />
              <path d="M0 263C105 262 181 216 264 186C341 157 393 103 454 110C485 114 507 126 520 137" stroke="var(--theme-primary,#10B981)" strokeWidth="1.2" strokeOpacity=".3" />
            </svg>
          </div>

          {/* Concentric Precision Radar Rings in Active Theme Color */}
          <div className="absolute -right-14 -bottom-14 w-56 h-56 rounded-full border border-emerald-400/20" />
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border border-emerald-400/25" />
          <div className="absolute -right-2 -bottom-2 w-32 h-32 rounded-full border border-emerald-400/35" />

          {/* Luxury Geometric Cyber Security Accents */}
          <div className="absolute left-1/4 top-0 w-36 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/45 to-transparent" />
          <div className="absolute left-1/3 bottom-0 w-48 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />

          {/* Micro-Dot Grid Security Matrix in Theme Color */}
          <div
            className="absolute right-0 top-0 w-[55%] h-[55%] opacity-30"
            style={{
              backgroundImage: 'radial-gradient(var(--theme-primary,#10B981) 1.2px, transparent 1.2px)',
              backgroundSize: '12px 12px',
              maskImage: 'linear-gradient(135deg, black, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(135deg, black, transparent 75%)'
            }}
          />
        </div>

        {/* Razor-Sharp High-Definition Text & Content Container */}
        <div
          className="relative z-10"
          style={{
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'geometricPrecision'
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
              <div
                className="banking-card-icon-box h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 hover:scale-105"
              >
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                <span className="banking-card-label text-[12px] sm:text-[14px] font-black tracking-wider text-white uppercase truncate">
                  {isHindi ? 'कुल बैलेंस' : 'TOTAL BALANCE'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTogglePrivacyMask) onTogglePrivacyMask();
                  }}
                  title={privacyMask ? (isHindi ? 'बैलेंस दिखाएं' : 'Show Balance') : (isHindi ? 'बैलेंस छिपाएं' : 'Hide Balance')}
                  className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-500/20 active:scale-90 transition-all cursor-pointer shrink-0"
                  aria-label={privacyMask ? 'Show Balance' : 'Hide Balance'}
                >
                  {privacyMask ? (
                    <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" strokeWidth={2.4} />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-200 hover:text-white" strokeWidth={2.4} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 max-w-[55%] xs:max-w-none">
              {/* Distinct SECURE badge */}
              <div className="hidden xs:flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg bg-emerald-950/80 border border-emerald-500/40 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline text-[7.5px] sm:text-[8px] font-bold tracking-wider uppercase text-emerald-400">SECURED</span>
              </div>
              {/* Distinct Date badge */}
              <div className="banking-card-date-box flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg bg-emerald-950/70 border border-emerald-500/35 shadow-xs shrink-0 max-w-full">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                <span className="banking-card-date text-[7.5px] xs:text-[8px] sm:text-[9px] font-bold text-emerald-300 uppercase whitespace-nowrap notranslate" translate="no">
                  {dateFormatted}
                </span>
                <span className="hidden md:inline text-[8px] text-emerald-400/50">·</span>
                <span className="hidden md:inline banking-card-date text-[8px] font-semibold text-emerald-300 whitespace-nowrap notranslate" translate="no">
                  {currentTime}
                </span>
              </div>
            </div>
          </div>

          {/* Balance area & 3D Wallet Graphic */}
          <div className="relative mt-2 sm:mt-2.5 flex items-center justify-between gap-3">
            <div className="relative z-10 min-w-0 flex-1">
              <div
                className="banking-card-amount font-mono text-[26px] xs:text-[31px] sm:text-[37px] md:text-[40px] leading-tight font-black text-white tracking-tight notranslate drop-shadow-none"
                translate="no"
                style={{
                  letterSpacing: '-0.03em',
                  textRendering: 'geometricPrecision'
                }}
                title={formatCurrency(totalWealth, privacyMask)}
              >
                {formatCurrency(totalWealth, privacyMask)}
              </div>
              <p className="banking-card-subtitle text-[10.5px] sm:text-[12px] font-medium text-emerald-300/90 mt-0.5 whitespace-nowrap tracking-wide">
                {isHindi ? 'दैनिक खाता कुल शुद्ध शेष' : 'Total Net Cash & Account Balance'}
              </p>
            </div>

            {/* 3D Glossy Theme-Adaptive Wallet Graphic */}
            <div
              className="banking-card-wallet-graphic relative w-[54px] h-[44px] sm:w-[74px] sm:h-[60px] shrink-0 pointer-events-none select-none drop-shadow-none"
              style={{ filter: 'none', boxShadow: 'none' }}
            >
              <svg viewBox="0 0 120 100" fill="none" className="w-full h-full" style={{ filter: 'none' }}>
                <defs>
                  <linearGradient id="walletBodyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="65%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="walletFlapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6EE7B7" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="cardGradHero" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                {/* Background card peek */}
                <rect x="25" y="10" width="58" height="32" rx="6" fill="url(#cardGradHero)" transform="rotate(-6 55 27)" opacity="0.95" />
                <rect x="30" y="14" width="22" height="3" rx="1.5" fill="#FFFFFF" opacity="0.75" transform="rotate(-6 55 27)" />
                {/* Main Wallet Base */}
                <rect x="14" y="24" width="92" height="66" rx="14" fill="url(#walletBodyGrad)" stroke="#34D399" strokeWidth="1.2" strokeOpacity="0.7" style={{ filter: 'none' }} />
                {/* Top specular highlight */}
                <path d="M 22 26 Q 60 22 98 26" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
                {/* Clasp tab */}
                <path d="M 72 45 L 98 45 A 9 9 0 0 1 98 63 L 72 63 Z" fill="url(#walletFlapGrad)" stroke="#A7F3D0" strokeWidth="1" />
                {/* Clasp button */}
                <circle cx="88" cy="54" r="4.5" fill="#FFFFFF" />
                <circle cx="88" cy="54" r="2.5" fill="#047857" />
              </svg>
            </div>
          </div>

          {/* Actions: + Income and − Expense */}
          <div className="banking-card-divider border-t border-white/10 pt-2.5 sm:pt-3 mt-2 sm:mt-2.5">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <motion.button
                type="button"
                onClick={() => onAddClick('income')}
                id="hero-add-income-btn"
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ y: 1, scale: 0.98 }}
                className="group min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] hover:from-[#2ecc71] hover:to-[#16a34a] text-white font-extrabold text-[12px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-none cursor-pointer select-none"
              >
                <span>+ Income</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => onAddClick('expense')}
                id="hero-add-expense-btn"
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ y: 1, scale: 0.98 }}
                className="group min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#B91C1C] hover:from-[#f87171] hover:to-[#dc2626] text-white font-extrabold text-[12px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-none cursor-pointer select-none"
              >
                <span>− Expense</span>
                <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.5] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-150" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BankingCard3D;

