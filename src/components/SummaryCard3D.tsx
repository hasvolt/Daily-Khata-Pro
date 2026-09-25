import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Calendar, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

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

  const isNetPositive = netValue >= 0;

  const defaultIncomeLabel = incomeLabel || (isHindi ? 'आय' : 'Income');
  const defaultExpenseLabel = expenseLabel || (isHindi ? 'खर्च' : 'Expense');
  const defaultNetLabel = netLabel || (isHindi ? 'बचत' : 'Savings');

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
        className="group summary-card-3d homepage-elevated-card relative overflow-hidden rounded-[18px] sm:rounded-2xl border border-[var(--theme-border,#143750)] hover:border-[var(--theme-primary,#38BDF8)]/50 bg-[var(--theme-card,#0c1d2e)] shadow-sm hover:shadow-md transition-all cursor-pointer select-none text-left px-3 py-2 sm:px-3.5 sm:py-2.5 md:p-3.5"
      >
        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.4))] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-transform duration-200 group-hover:scale-105">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="summary-card-title text-[12.5px] sm:text-[13.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate leading-tight tracking-tight">
                {title}
              </h3>
              <p className="summary-card-sub text-[9px] sm:text-[10px] font-medium text-[var(--theme-text-muted,#94A3B8)] truncate mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Period Badge */}
          <div className="summary-badge px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg border border-[var(--theme-border,#143750)] bg-[var(--theme-surface,#0b2234)] text-[var(--theme-primary,#38BDF8)] text-[9.5px] sm:text-[10.5px] font-bold shrink-0 shadow-2xs notranslate">
            {periodBadge}
          </div>
        </div>

        {/* 2 Inner Cards Grid: Income & Expense */}
        <div className="relative z-10 grid grid-cols-2 gap-1.5 sm:gap-2">
          {/* Income Box */}
          <div className="summary-stat-box rounded-xl border border-[var(--theme-border,#213E61)]/75 bg-[var(--theme-surface,#071927)] px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </div>
              <span className="summary-stat-label text-[10.5px] sm:text-[11.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {defaultIncomeLabel}
              </span>
            </div>
            <div
              className="summary-stat-income font-mono text-[14px] xs:text-[15.5px] sm:text-[18px] font-bold text-emerald-500 dark:text-[#10B981] mt-1 truncate notranslate tracking-tight drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]"
              translate="no"
            >
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          {/* Expense Box */}
          <div className="summary-stat-box rounded-xl border border-[var(--theme-border,#213E61)]/75 bg-[var(--theme-surface,#071927)] px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </div>
              <span className="summary-stat-label text-[10.5px] sm:text-[11.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {defaultExpenseLabel}
              </span>
            </div>
            <div
              className="summary-stat-expense font-mono text-[14px] xs:text-[15.5px] sm:text-[18px] font-bold text-rose-500 dark:text-[#FF5252] mt-1 truncate notranslate tracking-tight drop-shadow-[0_0_6px_rgba(244,63,94,0.3)]"
              translate="no"
            >
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>

        {/* Bottom Savings Row */}
        <div className="summary-stat-box relative z-10 mt-1.5 sm:mt-2 rounded-xl border border-[var(--theme-border,#213E61)]/75 bg-[var(--theme-surface,#071927)] px-2.5 py-1.5 sm:px-3 sm:py-1.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </div>
            <span className="summary-stat-label text-[10.5px] sm:text-[11.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
              {defaultNetLabel}
            </span>
          </div>
          <div
            className={`summary-savings-val font-mono text-[13.5px] xs:text-[15px] sm:text-[17px] font-bold truncate notranslate drop-shadow-[0_0_6px_rgba(16,185,129,0.3)] ${
              isNetPositive
                ? 'text-emerald-500 dark:text-[#10B981]'
                : 'text-rose-500 dark:text-[#FF5252]'
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
