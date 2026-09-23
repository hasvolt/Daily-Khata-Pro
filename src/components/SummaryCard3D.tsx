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
  const iconBoxBg = 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.14))] border-[var(--theme-primary-border,rgba(56,189,248,0.30))] text-[var(--theme-primary,#38BDF8)]';

  return (
    <div style={{ perspective: 1100 }} className="w-full">
      <motion.div
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="summary-card-3d relative overflow-hidden rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3 sm:p-4 shadow-xs transition-all hover:border-[var(--theme-primary,#38BDF8)]/40 cursor-pointer"
      >
        {/* Top subtle highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-primary,#38BDF8)]/30 to-transparent" />

        {/* Top row */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105 ${iconBoxBg}`}>
              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] xs:text-[12px] sm:text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)] leading-snug whitespace-normal sm:truncate">{title}</div>
              <div className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate hidden xs:block">{subtitle}</div>
            </div>
          </div>
          <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[var(--theme-text-muted,#CBD5E1)] bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] px-1 sm:px-1.5 py-0.5 rounded-md sm:rounded-lg whitespace-nowrap shrink-0 notranslate" translate="no">
            {periodBadge}
          </span>
        </div>

        {/* Center Net Figure */}
        <div className="mt-2.5 sm:mt-3">
          <div className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
            {isHindi ? 'शुद्ध बचत' : 'Net Total'}
          </div>
          <div
            className={`font-mono text-[18px] xs:text-[21px] sm:text-[24px] font-black tracking-tight truncate notranslate ${
              isNetPositive ? 'summary-net-positive text-emerald-500 dark:text-emerald-400' : 'summary-net-negative text-rose-500 dark:text-rose-400'
            }`}
            translate="no"
          >
            {isNetPositive ? '+' : ''}{formatCurrency(netValue, privacyMask)}
          </div>
        </div>

        {/* Bottom 2-stat row with high-contrast distinct surfaces and crisp text */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 mt-2.5 pt-2.5 border-t border-[var(--theme-border,#213E61)]/40">
          <div className="summary-stat-box rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-emerald-500/35 px-2 py-1.5 min-w-0 shadow-xs flex xs:block items-center justify-between">
            <div className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-bold text-emerald-500 dark:text-emerald-400">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.8]" />
              </span>
              <span className="truncate">{isHindi ? 'आय' : 'Income'}</span>
            </div>
            <div className="summary-stat-income font-mono text-[11px] xs:text-[11.5px] sm:text-[13px] font-black text-emerald-500 dark:text-emerald-400 mt-0.5 tracking-tight notranslate whitespace-nowrap" translate="no">
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          <div className="summary-stat-box rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-rose-500/35 px-2 py-1.5 min-w-0 shadow-xs flex xs:block items-center justify-between">
            <div className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-bold text-rose-500 dark:text-rose-400">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-2.5 h-2.5 stroke-[2.8]" />
              </span>
              <span className="truncate">{isHindi ? 'व्यय' : 'Expense'}</span>
            </div>
            <div className="summary-stat-expense font-mono text-[11px] xs:text-[11.5px] sm:text-[13px] font-black text-rose-500 dark:text-rose-400 mt-0.5 tracking-tight notranslate whitespace-nowrap" translate="no">
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SummaryCard3D;
