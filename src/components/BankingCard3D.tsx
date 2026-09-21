import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, ShieldCheck, Eye, EyeOff, ArrowUpRight } from 'lucide-react';

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

  return (
    <div style={{ perspective: 1400 }} className="w-full relative z-10">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="banking-card-3d relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-cyan-400/30 bg-[radial-gradient(circle_at_82%_15%,#0d2e50_0%,#091d33_45%,#061120_100%)] p-3.5 sm:p-5 shadow-[0_20px_50px_-15px_rgba(25,191,255,0.18),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {/* Subtle radial glow & financial waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-16 -top-12 h-64 w-80 rounded-full bg-cyan-400/15 blur-3xl banking-card-glare" />
          <div className="absolute -left-16 -bottom-12 h-48 w-64 rounded-full bg-blue-600/10 blur-3xl banking-card-glare" />

          {/* Flowing financial wave decoration */}
          <div className="banking-card-waves absolute right-[-4%] bottom-[16%] w-[68%] h-[58%] opacity-75">
            <svg className="w-full h-full" viewBox="0 0 520 280" fill="none" preserveAspectRatio="none">
              <path d="M0 230C105 229 166 183 247 151C325 120 380 64 445 71C481 75 505 91 520 104" stroke="#19BFFF" strokeWidth="2.8" strokeOpacity=".85" />
              <path d="M0 248C105 247 174 201 255 169C332 139 386 84 449 91C482 95 505 108 520 119" stroke="#0877D9" strokeWidth="2.1" strokeOpacity=".65" />
              <path d="M0 263C105 262 181 216 264 186C341 157 393 103 454 110C485 114 507 126 520 137" stroke="#06569E" strokeWidth="1.6" strokeOpacity=".50" />
            </svg>
          </div>

          {/* Dotted texture */}
          <div
            className="banking-card-glare absolute right-0 top-0 w-[55%] h-[55%] opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(25,191,255,.6) 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              maskImage: 'linear-gradient(135deg, black, transparent 72%)',
              WebkitMaskImage: 'linear-gradient(135deg, black, transparent 72%)'
            }}
          />
        </div>

        <div className="relative z-10" style={{ transform: 'translateZ(28px)' }}>
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <div className="banking-card-icon-box h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(25,191,255,0.2)]">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="banking-card-label text-[12px] sm:text-[13.5px] font-extrabold tracking-wider text-slate-100 uppercase whitespace-nowrap">
                  {isHindi ? 'कुल बैलेंस' : 'Total Balance'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTogglePrivacyMask) onTogglePrivacyMask();
                  }}
                  title={privacyMask ? 'Show Balance' : 'Hide Balance'}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer p-0.5 shrink-0"
                >
                  {privacyMask ? (
                    <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="text-[7px] sm:text-[8px] font-bold tracking-wider">SECURED</span>
              </div>
              <div className="banking-card-date-box hidden xs:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/[.05] border border-white/[.08] shrink-0">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
                <span className="banking-card-date text-[8px] sm:text-[9.5px] font-semibold text-slate-200 whitespace-nowrap notranslate" translate="no">
                  {dateFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Balance area with 3D Wallet Graphic */}
          <div className="relative mt-2 sm:mt-2.5 flex items-center justify-between gap-3">
            <div className="relative z-10 min-w-0 flex-1">
              <div
                className="banking-card-amount font-mono text-[28px] xs:text-[32px] sm:text-[40px] md:text-[44px] leading-tight font-black text-white tracking-tight notranslate"
                translate="no"
                title={formatCurrency(totalWealth, privacyMask)}
              >
                {formatCurrency(totalWealth, privacyMask)}
              </div>
              <p className="banking-card-subtitle text-[9.5px] sm:text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
                {isHindi ? 'कुल कैश और अकाउंट बैलेंस' : 'Total cash & account balance'}
              </p>
            </div>

            {/* 3D Glossy Blue Wallet Graphic */}
            <div className="relative w-16 h-13 sm:w-22 sm:h-18 shrink-0 pointer-events-none select-none drop-shadow-[0_8px_18px_rgba(25,191,255,0.20)]">
              <svg viewBox="0 0 120 100" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="walletBodyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1E88E5" />
                    <stop offset="60%" stopColor="#0D47A1" />
                    <stop offset="100%" stopColor="#072454" />
                  </linearGradient>
                  <linearGradient id="walletFlapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#42A5F5" />
                    <stop offset="100%" stopColor="#1565C0" />
                  </linearGradient>
                  <linearGradient id="cardGradHero" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#19BFFF" />
                    <stop offset="100%" stopColor="#0288D1" />
                  </linearGradient>
                </defs>
                {/* Background card peek */}
                <rect x="25" y="10" width="58" height="32" rx="6" fill="url(#cardGradHero)" transform="rotate(-6 55 27)" opacity="0.9" />
                <rect x="30" y="14" width="22" height="3" rx="1.5" fill="#E1F5FE" opacity="0.65" transform="rotate(-6 55 27)" />
                {/* Main Wallet Base */}
                <rect x="14" y="24" width="92" height="66" rx="14" fill="url(#walletBodyGrad)" stroke="#4FC3F7" strokeWidth="1.2" strokeOpacity="0.6" />
                {/* Top specular highlight */}
                <path d="M 22 26 Q 60 22 98 26" stroke="#E1F5FE" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
                {/* Clasp tab */}
                <path d="M 72 45 L 98 45 A 9 9 0 0 1 98 63 L 72 63 Z" fill="url(#walletFlapGrad)" stroke="#81D4FA" strokeWidth="1" />
                {/* Clasp button */}
                <circle cx="88" cy="54" r="4.5" fill="#E1F5FE" />
                <circle cx="88" cy="54" r="2.5" fill="#0288D1" />
              </svg>
            </div>
          </div>

          {/* Actions: + Income and − Expense */}
          <div className="border-t border-white/10 pt-2.5 sm:pt-3 mt-2.5 sm:mt-3">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <button
                type="button"
                onClick={() => onAddClick('income')}
                id="hero-add-income-btn"
                className="min-h-10 sm:min-h-12 px-3 rounded-xl sm:rounded-2xl bg-[#22C55E] hover:bg-[#1ea34d] active:bg-[#18803d] text-white font-extrabold text-[12.5px] sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-[0_6px_16px_rgba(34,197,94,0.32)] active:scale-[.98] cursor-pointer"
              >
                <span>+ Income</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onAddClick('expense')}
                id="hero-add-expense-btn"
                className="min-h-10 sm:min-h-12 px-3 rounded-xl sm:rounded-2xl bg-[#EF4444] hover:bg-[#dc2626] active:bg-[#b91c1c] text-white font-extrabold text-[12.5px] sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-[0_6px_16px_rgba(239,68,68,0.32)] active:scale-[.98] cursor-pointer"
              >
                <span>− Expense</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BankingCard3D;

