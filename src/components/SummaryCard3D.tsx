import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Calendar, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

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
  incomeLabel,
  incomeValue,
  expenseLabel,
  expenseValue,
  netLabel,
  netValue,
  formatCurrency,
  privacyMask,
  isHindi = false,
  onClick,
}: SummaryCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 26 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 26 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['2deg', '-2deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-2deg', '2deg']);

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

  const isDaily = type === 'daily';
  const isNetPositive = netValue >= 0;

  const defaultIncomeLabel = incomeLabel || (isDaily ? (isHindi ? 'आज की आय' : 'Today Income') : (isHindi ? 'महीने की आय' : 'Month Income'));
  const defaultExpenseLabel = expenseLabel || (isDaily ? (isHindi ? 'आज का खर्च' : 'Today Expense') : (isHindi ? 'महीने का खर्च' : 'Month Expense'));
  const defaultNetLabel = netLabel || (isDaily ? (isHindi ? "आज की बचत:" : "Today's Savings:") : (isHindi ? "मासिक बचत:" : "Monthly Savings:"));

  return (
    <div style={{ perspective: 1100 }} className="w-full">
      <motion.div
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="group summary-card-3d homepage-elevated-card relative overflow-hidden rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 hover:border-[var(--theme-primary-border,rgba(56,189,248,0.45))] bg-[var(--theme-card,#132438)] shadow-sm hover:shadow-md transition-all cursor-pointer select-none text-left px-3.5 py-2.5 sm:px-4.5 sm:py-4 md:p-5"
      >
        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105">
              <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13.5px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate leading-tight tracking-tight">
                {title}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-medium text-[var(--theme-text-dim,#94A3B8)] truncate mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Period Badge */}
          <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] text-[10.5px] sm:text-[11.5px] font-bold shrink-0 shadow-2xs notranslate">
            {periodBadge}
          </div>
        </div>

        {/* 2 Inner Cards Grid: Income & Expense */}
        <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3">
          {/* Income Box */}
          <div className="summary-stat-box rounded-xl sm:rounded-2xl border border-[var(--theme-border,#213E61)]/75 bg-[var(--theme-surface,#0E1A29)]/80 px-3 py-1.5 sm:px-3.5 sm:py-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[var(--theme-text,#F8FAFC)]">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 stroke-[2.5] shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-semibold truncate">
                {defaultIncomeLabel}
              </span>
            </div>
            <div
              className="font-mono text-[16px] xs:text-[18px] sm:text-[21px] font-bold text-emerald-500 dark:text-emerald-400 mt-0.5 truncate notranslate tracking-tight"
              translate="no"
            >
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          {/* Expense Box */}
          <div className="summary-stat-box rounded-xl sm:rounded-2xl border border-[var(--theme-border,#213E61)]/75 bg-[var(--theme-surface,#0E1A29)]/80 px-3 py-1.5 sm:px-3.5 sm:py-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[var(--theme-text,#F8FAFC)]">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 stroke-[2.5] shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-semibold truncate">
                {defaultExpenseLabel}
              </span>
            </div>
            <div
              className="font-mono text-[16px] xs:text-[18px] sm:text-[21px] font-bold text-rose-500 dark:text-rose-400 mt-0.5 truncate notranslate tracking-tight"
              translate="no"
            >
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>

        {/* Bottom Savings Row */}
        <div className="relative z-10 mt-1.5 sm:mt-2.5 rounded-lg sm:rounded-xl border border-[var(--theme-border,#213E61)]/60 bg-[var(--theme-surface,#0E1A29)]/60 px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[var(--theme-text,#F8FAFC)] font-semibold text-[11px] sm:text-[12.5px] truncate">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 stroke-[2.2] shrink-0" />
            <span>{defaultNetLabel}</span>
          </div>
          <div
            className={`font-mono text-[13px] sm:text-[15px] font-bold truncate notranslate ${
              isNetPositive
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-rose-500 dark:text-rose-400'
            }`}
            translate="no"
          >
            {isNetPositive ? '+' : '-'}{formatCurrency(Math.abs(netValue), privacyMask)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SummaryCard3D;
