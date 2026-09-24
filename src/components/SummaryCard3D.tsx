import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sun, Calendar, ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp } from 'lucide-react';

interface SummaryCard3DProps {
  type: 'daily' | 'monthly';
  title: string;
  subtitle: string;
  periodBadge: string;
  incomeLabel?: string;
  incomeValue: number;
  expenseLabel?: string;
  expenseValue: number;
  netLabel?: string;
  netValue: number;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
  isHindi?: boolean;
  onClick?: () => void;
}

export function SummaryCard3D({
  type,
  title,
  subtitle,
  periodBadge,
  incomeValue,
  expenseValue,
  netValue,
  formatCurrency,
  privacyMask,
  isHindi = false,
  onClick,
}: SummaryCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 28 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 28 });
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

  const isNetPositive = netValue >= 0;
  const isDaily = type === 'daily';
  const IconComponent = isDaily ? Sun : Calendar;
  const iconBoxBg = 'summary-card-icon-box bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[var(--theme-primary,#38BDF8)]';

  return (
    <div style={{ perspective: 1100 }} className="w-full">
      <motion.div
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group summary-card-3d homepage-elevated-card relative overflow-hidden rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs hover:border-[var(--theme-primary,#38BDF8)]/60 transition-all cursor-pointer select-none"
      >
        {/* Dynamic theme ambient glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 blur-2xl pointer-events-none" />

        {/* Top subtle highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--theme-primary,#38BDF8)]/50 to-transparent" />

        {/* Top Header Row - matches Quick Access header scale */}
        <div className="relative z-10 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.30))] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105`}>
              <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] leading-tight truncate">{title}</div>
              <div className="text-[9px] sm:text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] font-medium truncate notranslate">{periodBadge}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        {/* Net Figure with Status Indicator */}
        <div className="my-2.5 sm:my-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi ? 'नेट बैलेंस' : 'Net Total'}
            </span>
            <span className={`inline-flex items-center gap-0.5 text-[8.5px] sm:text-[9.5px] font-semibold px-2 py-0.5 rounded-full ${
              isNetPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {isNetPositive ? (isHindi ? 'बचत' : 'Surplus') : (isHindi ? 'घाटा' : 'Deficit')}
            </span>
          </div>
          <div
            className={`font-mono text-[18px] xs:text-[20px] sm:text-[23px] font-black tracking-tight truncate notranslate mt-0.5 ${
              isNetPositive ? 'summary-net-positive text-emerald-500 dark:text-emerald-400' : 'summary-net-negative text-rose-500 dark:text-rose-400'
            }`}
            translate="no"
          >
            {isNetPositive ? '+' : ''}{formatCurrency(netValue, privacyMask)}
          </div>
        </div>

        {/* Full-width Stacked Stat Rows styled identically to Quick Access sub-items */}
        <div className="pt-2.5 border-t border-[var(--theme-border,#213E61)]/40 space-y-1.5">
          <div className="flex items-center justify-between text-[10.5px] xs:text-[11px] sm:text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] shadow-xs">
            <div className="flex items-center gap-1.5 text-[var(--theme-text-muted,#94A3B8)] font-semibold truncate">
              <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.8]" />
              </span>
              <span className="truncate">{isHindi ? 'आय' : 'Income'}</span>
            </div>
            <div className="font-mono font-black text-emerald-500 dark:text-emerald-400 notranslate whitespace-nowrap ml-1.5" translate="no">
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10.5px] xs:text-[11px] sm:text-[12px] px-2.5 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] shadow-xs">
            <div className="flex items-center gap-1.5 text-[var(--theme-text-muted,#94A3B8)] font-semibold truncate">
              <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-2.5 h-2.5 stroke-[2.8]" />
              </span>
              <span className="truncate">{isHindi ? 'व्यय' : 'Expense'}</span>
            </div>
            <div className="font-mono font-black text-rose-500 dark:text-rose-400 notranslate whitespace-nowrap ml-1.5" translate="no">
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SummaryCard3D;
