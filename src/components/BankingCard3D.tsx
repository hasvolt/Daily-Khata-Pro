import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, ShieldCheck, Eye, TrendingUp, ArrowUpRight } from 'lucide-react';

interface BankingCard3DProps {
  totalWealth: number;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
  dateFormatted: string;
  t: any;
  pageT: any;
  onAddClick: (type: 'income' | 'expense') => void;
}

export function BankingCard3D({
  totalWealth,
  formatCurrency,
  privacyMask,
  dateFormatted,
  t,
  pageT,
  onAddClick,
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
        className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-sky-400/35 bg-[radial-gradient(circle_at_82%_18%,rgba(14,165,233,.24),transparent_34%),radial-gradient(circle_at_20%_100%,rgba(37,99,235,.10),transparent_42%),linear-gradient(135deg,#07182b_0%,#0a2037_48%,#071221_100%)] px-4 py-5 sm:px-6 sm:py-6 md:p-7 shadow-[0_22px_55px_-22px_rgba(0,0,0,.85),inset_0_1px_0_rgba(255,255,255,.10)]"
      >
        {/* Decorative financial wave */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-14 h-56 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[-5%] bottom-[12%] w-[65%] h-[58%] opacity-90">
            <svg className="w-full h-full" viewBox="0 0 520 280" fill="none" preserveAspectRatio="none">
              <path d="M0 230C105 229 166 183 247 151C325 120 380 64 445 71C481 75 505 91 520 104" stroke="#20BFF8" strokeWidth="2.8" strokeOpacity=".78" />
              <path d="M0 248C105 247 174 201 255 169C332 139 386 84 449 91C482 95 505 108 520 119" stroke="#1D9FE0" strokeWidth="2.1" strokeOpacity=".62" />
              <path d="M0 263C105 262 181 216 264 186C341 157 393 103 454 110C485 114 507 126 520 137" stroke="#1787C5" strokeWidth="1.6" strokeOpacity=".52" />
              <path d="M55 209C151 208 209 170 286 137C354 108 402 62 456 65C486 67 507 78 520 87" stroke="#52D4FF" strokeWidth="1.3" strokeOpacity=".40" />
            </svg>
          </div>

          {/* subtle dotted texture */}
          <div
            className="absolute right-0 top-0 w-[58%] h-[58%] opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(56,189,248,.55) 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              maskImage: 'linear-gradient(135deg, black, transparent 72%)',
              WebkitMaskImage: 'linear-gradient(135deg, black, transparent 72%)'
            }}
          />
        </div>

        <div className="relative z-10" style={{ transform: 'translateZ(28px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_22px_rgba(56,189,248,.13)]">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-[13px] sm:text-base md:text-lg font-extrabold tracking-wide text-white uppercase">
                    {isHindi ? 'कुल बैलेंस' : 'TOTAL BALANCE'}
                  </h2>
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 shrink-0" />
                </div>
                <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-400">
                  {isHindi ? 'कुल कैश और अकाउंट बैलेंस' : 'Total cash & account balance'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="text-[7px] sm:text-[8px] font-bold tracking-widest">SECURED</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/25">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-100 whitespace-nowrap notranslate" translate="no">
                  {dateFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Balance area */}
          <div className="relative mt-8 sm:mt-9 md:mt-10 min-h-[132px] sm:min-h-[150px] md:min-h-[165px]">
            <div className="relative z-10">
              <div className="text-[9px] sm:text-[11px] text-slate-400 font-bold tracking-[.20em] uppercase">
                {isHindi ? 'उपलब्ध बैलेंस' : 'AVAILABLE BALANCE'}
              </div>

              <div
                className="mt-1.5 sm:mt-2 font-mono text-[40px] sm:text-[52px] md:text-[60px] leading-none font-extrabold text-white tracking-tight truncate notranslate"
                translate="no"
                title={formatCurrency(totalWealth, privacyMask)}
              >
                {formatCurrency(totalWealth, privacyMask)}
              </div>

              {/* Small positive trend indicator, visual only */}
              <div className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[9px] sm:text-[10px] font-bold">12%</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-white/10 pt-3 sm:pt-4">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <button
                type="button"
                onClick={() => onAddClick('income')}
                id="hero-add-income-btn"
                className="min-h-12 sm:min-h-14 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-extrabold text-[13px] sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_24px_-9px_rgba(16,185,129,.8)] active:scale-[.98] cursor-pointer"
              >
                + Income
                <ArrowUpRight className="hidden sm:block w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onAddClick('expense')}
                id="hero-add-expense-btn"
                className="min-h-12 sm:min-h-14 rounded-xl sm:rounded-2xl bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white font-extrabold text-[13px] sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_24px_-9px_rgba(244,63,94,.8)] active:scale-[.98] cursor-pointer"
              >
                − Expense
                <ArrowUpRight className="hidden sm:block w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BankingCard3D;
