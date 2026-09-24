import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface FundCard3DProps {
  key?: React.Key;
  config: any;
  val: number;
  pct: number;
  fundTranslatedName: string;
  subtitle?: string;
  FundIcon: LucideIcon;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
  onClick: () => void;
  isPrimary?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export function FundCard3D({
  config: _config,
  val,
  pct,
  fundTranslatedName,
  subtitle,
  FundIcon,
  formatCurrency,
  privacyMask,
  onClick,
  trend,
}: FundCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-3deg', '3deg']);
  const clampedPct = Math.min(100, Math.max(0, pct || 0));

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

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="fund-card-3d group relative min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--theme-border,rgba(255,255,255,0.08))] bg-[var(--theme-card,#FFFFFF)] p-3 sm:p-3.5 shadow-xs transition-all duration-200 hover:border-[var(--theme-primary,#38BDF8)]/50 hover:shadow-md"
      >
        {/* Top Row: Icon on left, Allocation Ring on right */}
        <div className="flex items-center justify-between gap-2 min-w-0" style={{ transform: 'translateZ(14px)' }}>
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shrink-0 border border-[var(--theme-primary-border,rgba(56,189,248,0.28))] bg-[var(--theme-primary-dim,rgba(56,189,248,0.14))] text-[var(--theme-primary,#38BDF8)] shadow-xs transition-transform duration-200 group-hover:scale-105">
            <FundIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.4} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {trend && trend !== 'neutral' && (
              <span
                className={`inline-flex items-center gap-0.5 text-[7.5px] sm:text-[8px] font-bold px-1 py-0.5 rounded ${
                  trend === 'up'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
                title={trend === 'up' ? 'Trending up vs last month' : 'Trending down vs last month'}
              >
                {trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              </span>
            )}
            <div className="relative h-7 w-7 sm:h-7.5 sm:w-7.5 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14.5" fill="none" stroke="currentColor" className="text-slate-200/70 dark:text-slate-800" strokeWidth="3.2" />
                <circle
                  cx="18"
                  cy="18"
                  r="14.5"
                  fill="none"
                  stroke="var(--theme-primary,#38BDF8)"
                  strokeWidth="3.2"
                  strokeDasharray="91.1"
                  strokeDashoffset={91.1 - (91.1 * clampedPct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8.5px] sm:text-[9.5px] font-black font-mono text-[var(--theme-text,#0F172A)] notranslate" translate="no">
                {Math.round(clampedPct)}%
              </span>
            </div>
          </div>
        </div>

        {/* Content Row: Full width for Title & Amount without truncation */}
        <div className="mt-2.5 min-w-0" style={{ transform: 'translateZ(10px)' }}>
          <div className="text-[12px] sm:text-[13px] font-bold text-[var(--theme-text,#0F172A)] truncate group-hover:text-[var(--theme-primary,#0284C7)] transition-colors">
            {fundTranslatedName}
          </div>
          <div
            className={`mt-0.5 font-mono text-[14px] sm:text-[15.5px] font-black tracking-tight truncate notranslate ${
              val < 0
                ? 'text-rose-600 dark:text-rose-400 font-black'
                : val > 0
                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                : 'text-[var(--theme-text-muted,#475569)] font-black'
            }`}
            translate="no"
          >
            {val < 0 ? '-' : val > 0 ? '+' : ''}
            {formatCurrency(Math.abs(val), privacyMask)}
          </div>
        </div>

        {subtitle && (
          <div className="mt-2 pt-1.5 border-t border-[var(--theme-border-subtle,rgba(0,0,0,0.06))]" style={{ transform: 'translateZ(8px)' }}>
            <p className="text-[8.5px] sm:text-[9.5px] text-[var(--theme-text-dim,#64748B)] truncate">{subtitle}</p>
          </div>
        )}

        {/* Bottom micro progress track */}
        <div className="mt-2.5 h-1 sm:h-1.5 rounded-full bg-[var(--theme-surface,#F1F5F9)] overflow-hidden" style={{ transform: 'translateZ(6px)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 bg-[var(--theme-primary,#38BDF8)]"
            style={{ width: `${Math.min(100, Math.max(4, clampedPct))}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default FundCard3D;
