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
        className="group summary-card-3d relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--theme-primary-border,rgba(56,189,248,0.30))] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.5))] backdrop-blur-xl transition-all cursor-pointer select-none text-left p-2.5 xs:p-3 sm:p-4 md:p-[18px]"
      >
        {/* Subtle diagonal luxury glass sheen and top rim highlight */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent select-none" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between gap-1.5 mb-2 sm:mb-2.5">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-xl border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="summary-card-title text-[13px] sm:text-[14.5px] font-bold text-white truncate leading-tight tracking-tight">
                {title}
              </h3>
              <p className="summary-card-sub text-[9.5px] sm:text-[11px] font-medium text-[var(--theme-text-muted,#94A3B8)] truncate mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Period Badge (Rounded) */}
          <div className="summary-badge px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] bg-[var(--theme-surface,#0E1A29)]/85 text-[var(--theme-primary,#38BDF8)] text-[9.5px] sm:text-[10.5px] font-bold shrink-0 shadow-2xs notranslate">
            {periodBadge}
          </div>
        </div>

        {/* 2 Inner Cards Grid: Income & Expense (Rounded Themed Boxes with 3D Perimeter Line & Depth) */}
        <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-2.5">
          {/* Income Box */}
          <div className="summary-stat-box summary-stat-box-income rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 transition-all">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[var(--theme-surface,#0F1724)] border border-[var(--theme-border,#26364D)] flex items-center justify-center text-emerald-400 shrink-0">
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <span className="summary-stat-label text-[10.5px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {defaultIncomeLabel}
              </span>
            </div>
            <div
              className="summary-stat-income font-mono text-[14.5px] xs:text-[16px] sm:text-[19px] font-bold text-emerald-400 mt-1 truncate notranslate tracking-tight"
              translate="no"
            >
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          {/* Expense Box */}
          <div className="summary-stat-box summary-stat-box-expense rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 transition-all">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[var(--theme-surface,#0F1724)] border border-[var(--theme-border,#26364D)] flex items-center justify-center text-[var(--theme-expense,#FF4D4D)] shrink-0">
                <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <span className="summary-stat-label text-[10.5px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {defaultExpenseLabel}
              </span>
            </div>
            <div
              className="summary-stat-expense font-mono text-[14.5px] xs:text-[16px] sm:text-[19px] font-extrabold text-[var(--theme-expense,#FF4D4D)] mt-1 truncate notranslate tracking-tight drop-shadow-[0_0_8px_rgba(255,77,77,0.35)]"
              translate="no"
            >
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>

        {/* Bottom Savings Row (Rounded Themed Box with 3D Perimeter Line & Depth) */}
        <div className="summary-stat-box summary-stat-box-savings relative z-10 mt-1.5 sm:mt-2.5 rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <div className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-[0_0_8px_var(--theme-glow,rgba(56,189,248,0.2))]">
              <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
            </div>
            <span className="summary-stat-label text-[10.5px] sm:text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
              {defaultNetLabel}
            </span>
          </div>
          <div
            className={`summary-savings-val font-mono text-[14.5px] xs:text-[16px] sm:text-[18px] font-bold truncate notranslate ${
              isNetPositive
                ? 'text-[var(--theme-primary,#38BDF8)]'
                : 'text-[var(--theme-expense,#FF4D4D)]'
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
