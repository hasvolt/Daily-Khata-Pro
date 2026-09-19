import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, ShieldCheck } from 'lucide-react';

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
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

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
    <div style={{ perspective: 1200 }} className="w-full relative z-10">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-[var(--theme-primary-border,rgba(56,189,248,.35))] bg-[radial-gradient(circle_at_78%_15%,rgba(14,165,233,.20),transparent_32%),linear-gradient(135deg,#071426_0%,#0c1a2e_48%,#08111f_100%)] p-3.5 sm:p-6 md:p-7 shadow-[0_18px_45px_-18px_rgba(0,0,0,.75),inset_0_1px_0_rgba(255,255,255,.08)]"
      >
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -right-12 -top-10 h-44 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          <svg className="absolute right-0 top-0 h-full w-[58%] opacity-75" viewBox="0 0 500 240" fill="none" preserveAspectRatio="none">
            <path d="M0 166C130 166 220 105 350 78C415 65 468 80 500 92" stroke="var(--theme-primary,#38BDF8)" strokeWidth="2.5" strokeOpacity=".75" />
            <path d="M35 182C165 174 255 116 372 89C430 76 475 90 500 99" stroke="var(--theme-primary,#38BDF8)" strokeWidth="1.8" strokeOpacity=".6" />
            <path d="M70 198C195 188 280 130 392 101C442 89 482 103 500 112" stroke="var(--theme-primary,#38BDF8)" strokeWidth="1.2" strokeOpacity=".45" />
            <path d="M0 145C125 145 210 94 330 70C400 57 465 72 500 82" stroke="var(--theme-primary,#38BDF8)" strokeWidth="1" strokeOpacity=".28" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4 sm:space-y-6" style={{ transform: 'translateZ(28px)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-sky-400/10 border border-sky-400/25 text-sky-300 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(56,189,248,.12)]">
                <Wallet className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-sm font-extrabold tracking-wide text-white uppercase truncate">
                  {isHindi ? 'कुल बैलेंस (Total Balance)' : 'TOTAL BALANCE'}
                </div>
                <div className="text-[9px] sm:text-[11px] text-slate-400 truncate">
                  {isHindi ? 'सभी खातों का कुल बैलेंस' : 'Total cash & account balance'}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-300">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span className="text-[7px] sm:text-[8px] font-bold tracking-widest">SECURED</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-sky-400/10 border border-sky-400/20">
                <Calendar className="w-3 h-3 text-sky-300" />
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-200 whitespace-nowrap notranslate" translate="no">
                  {dateFormatted}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[8px] sm:text-[11px] text-slate-400 font-semibold tracking-[.18em] uppercase">
              {isHindi ? 'उपलब्ध बैलेंस' : 'AVAILABLE BALANCE'}
            </div>
            <div
              className="mt-1 font-mono text-[30px] sm:text-[48px] md:text-[54px] leading-none font-extrabold text-white tracking-tight truncate notranslate"
              translate="no"
              title={formatCurrency(totalWealth, privacyMask)}
            >
              {formatCurrency(totalWealth, privacyMask)}
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 sm:pt-4">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <button
                type="button"
                onClick={() => onAddClick('income')}
                id="hero-add-income-btn"
                className="min-h-10 sm:min-h-12 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-extrabold text-[12px] sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_-8px_rgba(16,185,129,.7)] active:scale-[.98] cursor-pointer"
              >
                + Income
              </button>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                id="hero-add-expense-btn"
                className="min-h-10 sm:min-h-12 rounded-xl sm:rounded-2xl bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white font-extrabold text-[12px] sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_-8px_rgba(244,63,94,.7)] active:scale-[.98] cursor-pointer"
              >
                − Expense
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
