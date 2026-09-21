import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { LucideIcon } from 'lucide-react';

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
}

export function FundCard3D({
  config,
  val,
  pct,
  fundTranslatedName,
  subtitle,
  FundIcon,
  formatCurrency,
  privacyMask,
  onClick,
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

  const categoryColor = config?.color || '#38BDF8';

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] p-3 sm:p-3.5 shadow-sm transition-all duration-300 hover:border-[var(--theme-primary,#38BDF8)]/40 hover:bg-[var(--theme-card-hover,#19304A)]"
      >
        <div className="flex items-center gap-2.5 min-w-0" style={{ transform: 'translateZ(14px)' }}>
          <div
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${categoryColor}18`,
              borderColor: `${categoryColor}35`,
              color: categoryColor,
            }}
          >
            <FundIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-semibold text-[var(--theme-text,#F8FAFC)] truncate">{fundTranslatedName}</div>
            <div className={`mt-0.5 font-mono text-[12px] sm:text-[13px] font-extrabold truncate notranslate ${val < 0 ? 'text-rose-400' : 'text-[var(--theme-text,#F8FAFC)]'}`} translate="no">
              {val < 0 ? '-' : ''}{formatCurrency(Math.abs(val), privacyMask)}
            </div>
          </div>

          <div className="relative h-7 w-7 sm:h-8 sm:w-8 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14.5" fill="none" stroke="currentColor" className="text-[var(--theme-border,#213E61)]/50" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14.5"
                fill="none"
                stroke={categoryColor}
                strokeWidth="3"
                strokeDasharray="91.1"
                strokeDashoffset={91.1 - (91.1 * clampedPct) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-[var(--theme-text,#F8FAFC)] notranslate" translate="no">
              {Math.round(clampedPct)}%
            </span>
          </div>
        </div>

        {subtitle && (
          <div className="mt-2 pt-1.5 border-t border-[var(--theme-border,#213E61)]/40" style={{ transform: 'translateZ(8px)' }}>
            <p className="text-[8px] sm:text-[9px] text-[var(--theme-text-dim,#94A3B8)] truncate">{subtitle}</p>
          </div>
        )}

        <div className="mt-2.5 h-1 rounded-full bg-[var(--theme-surface,#0E1A29)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(4, clampedPct))}%`, backgroundColor: categoryColor }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default FundCard3D;
