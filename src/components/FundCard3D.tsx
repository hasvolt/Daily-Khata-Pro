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

export function FundCard3D({ config, val, pct, fundTranslatedName, subtitle, FundIcon, formatCurrency, privacyMask, onClick, isPrimary = true }: FundCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const clampedPct = Math.min(100, Math.max(0, pct || 0));

  return (
    <div style={{ perspective: 1000 }} className="w-full relative group">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative p-3.5 sm:p-4 bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[var(--theme-primary-border,rgba(56,189,248,0.5))] rounded-2xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl text-left flex flex-col justify-between min-w-0 w-full overflow-hidden group/card"
      >
        {/* Animated Glare themed to active theme glow */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: "radial-gradient(circle at center, var(--theme-glow, rgba(56,189,248,0.08)) 0%, transparent 65%)",
            x: useTransform(mouseXSpring, [-0.5, 0.5], ["-40%", "40%"]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], ["-40%", "40%"]),
          }}
        />

        {/* Top row: Icon + Name & Amount + Circular Progress Ring */}
        <div className="flex items-center justify-between gap-2.5 relative z-10" style={{ transform: "translateZ(20px)" }}>
          {/* Left: Category Icon */}
          <div 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-xs transition-transform group-hover/card:scale-105"
            style={{ 
              backgroundColor: `${config.color}18`,
              borderColor: `${config.color}35`,
              color: config.color
            }}
          >
            <FundIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={2.2} />
          </div>

          {/* Center: Title & Value */}
          <div className="flex-1 min-w-0">
            <span className="text-[12px] sm:text-[13.5px] font-semibold text-[var(--theme-text-muted,#CBD5E1)] group-hover/card:text-[var(--theme-text,#F8FAFC)] transition-colors block truncate">
              {fundTranslatedName}
            </span>
            <span 
              className={`font-mono font-extrabold text-[15px] sm:text-[18px] tracking-tight truncate max-w-full block leading-snug sensitive-amount ${val < 0 ? 'text-[#EF4444]' : 'text-[var(--theme-text,#F8FAFC)]'}`} 
              title={formatCurrency(val, privacyMask)}
            >
              {val < 0 ? '-' : ''}{formatCurrency(Math.abs(val), privacyMask)}
            </span>
          </div>

          {/* Right: Circular Progress Ring */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-xs" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle 
                cx="18" 
                cy="18" 
                r="14.5" 
                fill="none" 
                stroke={config.color} 
                strokeWidth="3" 
                strokeDasharray="91.1" 
                strokeDashoffset={91.1 - (91.1 * clampedPct) / 100} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out" 
              />
            </svg>
            <span className="absolute text-[9px] sm:text-[10.5px] font-mono font-bold text-[var(--theme-text,#F8FAFC)] tracking-tighter">
              {Number(clampedPct).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Bottom row: Subtitle Description + Micro Progress Bar */}
        <div className="mt-2.5 pt-2 border-t border-[var(--theme-border,#0D2654)]/60 relative z-10 space-y-1.5" style={{ transform: "translateZ(10px)" }}>
          {subtitle && (
            <p className="text-[11px] sm:text-[12px] text-[var(--theme-text-muted,#7E9BC9)] leading-snug line-clamp-1">
              {subtitle}
            </p>
          )}
          {/* Subtle micro progress line */}
          <div className="w-full h-1 bg-[var(--theme-surface,#020A1A)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700" 
              style={{ 
                width: `${Math.min(100, Math.max(4, clampedPct))}%`,
                backgroundColor: config.color 
              }} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
