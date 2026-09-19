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
  config, val, pct, fundTranslatedName, subtitle, FundIcon, formatCurrency, privacyMask, onClick
}: FundCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-4deg', '4deg']);
  const clampedPct = Math.min(100, Math.max(0, pct || 0));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[.07] bg-[linear-gradient(145deg,#111f31,#0d1828)] p-2.5 sm:p-3 shadow-sm transition-all duration-300 hover:border-sky-400/25 hover:shadow-[0_10px_25px_-18px_rgba(56,189,248,.8)]"
      >
        <div className="flex items-center gap-2 min-w-0" style={{ transform: 'translateZ(14px)' }}>
          <div
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shrink-0 border"
            style={{ backgroundColor: `${config.color}18`, borderColor: `${config.color}35`, color: config.color }}
          >
            <FundIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[11px] font-semibold text-slate-300 truncate">{fundTranslatedName}</div>
            <div className={`mt-0.5 font-mono text-[12px] sm:text-sm font-extrabold truncate ${val < 0 ? 'text-rose-400' : 'text-white'}`}>
              {val < 0 ? '-' : ''}{formatCurrency(Math.abs(val), privacyMask)}
            </div>
          </div>

          <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14.5" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
              <circle cx="18" cy="18" r="14.5" fill="none" stroke={config.color} strokeWidth="3" strokeDasharray="91.1" strokeDashoffset={91.1 - (91.1 * clampedPct) / 100} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white">{Math.round(clampedPct)}%</span>
          </div>
        </div>

        {subtitle && (
          <div className="mt-2 pt-1.5 border-t border-white/[.06]" style={{ transform: 'translateZ(8px)' }}>
            <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">{subtitle}</p>
          </div>
        )}

        <div className="mt-2 h-1 rounded-full bg-[#09111e] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.max(4, clampedPct))}%`, backgroundColor: config.color }} />
        </div>
      </motion.div>
    </div>
  );
}
