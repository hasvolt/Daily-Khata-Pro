import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Calendar, CalendarDays, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCard3DProps {
  type: 'daily' | 'monthly';
  title: string;
  subtitle: string;
  periodBadge: string;
  incomeLabel: string;
  incomeValue: number;
  expenseLabel: string;
  expenseValue: number;
  netLabel: string;
  netValue: number;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
  isHindi: boolean;
}

export function SummaryCard3D({
  type, title, subtitle, periodBadge, incomeLabel, incomeValue,
  expenseLabel, expenseValue, netLabel, netValue, formatCurrency,
  privacyMask, isHindi,
}: SummaryCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 28 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 28 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-4deg', '4deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const isNetPositive = netValue >= 0;
  const IconComponent = type === 'daily' ? Calendar : CalendarDays;

  return (
    <div style={{ perspective: 1100 }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--theme-border,rgba(255,255,255,.08))] bg-[linear-gradient(145deg,#101c2d,#0b1422)] p-3 sm:p-4 shadow-[0_12px_30px_-20px_rgba(0,0,0,.8)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

        <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-white/[.06]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
              <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11.5px] sm:text-sm font-bold text-slate-100 truncate">{title}</div>
              <div className="text-[8.5px] sm:text-[10px] text-slate-400 truncate">{subtitle}</div>
            </div>
          </div>
          <span className="shrink-0 text-[8px] sm:text-[10px] font-bold text-sky-300 bg-sky-400/10 border border-sky-400/20 px-2 py-1 rounded-lg notranslate" translate="no">
            {periodBadge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <div className="rounded-xl bg-[#0b1220] border border-white/[.06] p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-semibold truncate">{incomeLabel}</span>
            </div>
            <div className="mt-1 font-mono text-[12px] sm:text-sm font-extrabold text-emerald-400 truncate notranslate" translate="no">
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          <div className="rounded-xl bg-[#0b1220] border border-white/[.06] p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-semibold truncate">{expenseLabel}</span>
            </div>
            <div className="mt-1 font-mono text-[12px] sm:text-sm font-extrabold text-rose-400 truncate notranslate" translate="no">
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-xl bg-[#0b1220] border border-white/[.06] px-2.5 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isNetPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold truncate">{netLabel}</span>
          </div>
          <span className={`font-mono text-[11px] sm:text-xs font-extrabold truncate ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isNetPositive ? '+' : ''}{formatCurrency(netValue, privacyMask)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
