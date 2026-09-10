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
  isHindi,
}: SummaryCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 28 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 28 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5.5deg", "-5.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5.5deg", "5.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isNetPositive = netValue >= 0;
  const IconComponent = type === 'daily' ? Calendar : CalendarDays;

  return (
    <div style={{ perspective: 1100 }} className="w-full relative group">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.5))] rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-md hover:shadow-2xl transition-all duration-300 space-y-2.5 sm:space-y-3 min-w-0 overflow-hidden"
      >
        {/* Animated 3D Interactive Glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at center, var(--theme-glow, rgba(56,189,248,0.08)) 0%, transparent 65%)",
            x: useTransform(mouseXSpring, [-0.5, 0.5], ["-35%", "35%"]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], ["-35%", "35%"]),
          }}
        />

        {/* Luminous Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--theme-primary,#38BDF8)] to-transparent opacity-75" />

        {/* Header Layer (Z-25) */}
        <div
          className="relative z-10 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-[var(--theme-border,#0D2654)]/80"
          style={{ transform: "translateZ(25px)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[12.5px] sm:text-[14.5px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                {title}
              </span>
              <span className="text-[9.5px] sm:text-[11.5px] text-[var(--theme-text-muted,#7E9BC9)] block truncate">
                {subtitle}
              </span>
            </div>
          </div>

          <span className="text-[9.5px] sm:text-[11px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.12))] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-[var(--theme-primary-border,rgba(56,189,248,0.25))] shrink-0 shadow-xs">
            {periodBadge}
          </span>
        </div>

        {/* Middle Stats Grid (Z-18) */}
        <div
          className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 min-w-0"
          style={{ transform: "translateZ(18px)" }}
        >
          {/* Income Box */}
          <div
            className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-0.5 sm:space-y-1 min-w-0 overflow-hidden flex flex-col justify-center select-none shadow-xs group-hover:border-emerald-500/30 transition-colors"
            data-sensitive="true"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-bold truncate">
                {incomeLabel}
              </span>
            </div>
            <div
              className="font-mono font-extrabold text-[13.5px] sm:text-[17px] text-emerald-400 tracking-tight truncate w-full block sensitive-amount"
              title={formatCurrency(incomeValue, privacyMask)}
            >
              +{formatCurrency(incomeValue, privacyMask)}
            </div>
          </div>

          {/* Expense Box */}
          <div
            className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] space-y-0.5 sm:space-y-1 min-w-0 overflow-hidden flex flex-col justify-center select-none shadow-xs group-hover:border-rose-500/30 transition-colors"
            data-sensitive="true"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-md bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] sm:text-[12px] text-[var(--theme-text-muted,#8BA4D0)] font-bold truncate">
                {expenseLabel}
              </span>
            </div>
            <div
              className="font-mono font-extrabold text-[13.5px] sm:text-[17px] text-rose-400 tracking-tight truncate w-full block sensitive-amount"
              title={formatCurrency(expenseValue, privacyMask)}
            >
              -{formatCurrency(expenseValue, privacyMask)}
            </div>
          </div>
        </div>

        {/* Bottom Net Balance Strip (Z-14) */}
        <div
          className="relative z-10 flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0A2249)] text-[10.5px] sm:text-[12.5px] min-w-0 overflow-hidden shadow-xs"
          style={{ transform: "translateZ(14px)" }}
          data-sensitive="true"
        >
          <div className="flex items-center gap-1.5 min-w-0 mr-1.5">
            {isNetPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span className="text-[var(--theme-text-muted,#8BA4D0)] font-bold truncate">
              {netLabel}
            </span>
          </div>

          <span
            className={`font-mono font-extrabold text-[13px] sm:text-[15.5px] truncate max-w-[55%] text-right sensitive-amount ${
              isNetPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
            title={formatCurrency(netValue, privacyMask)}
          >
            {isNetPositive ? '+' : ''}
            {formatCurrency(netValue, privacyMask)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
