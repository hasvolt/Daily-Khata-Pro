import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wallet, Calendar, Plus, Minus } from 'lucide-react';

interface BankingCard3DProps {
  totalWealth: number;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
  dateFormatted: string;
  t: any;
  pageT: any;
  onAddClick: (type: 'income' | 'expense') => void;
}

export function BankingCard3D({ totalWealth, formatCurrency, privacyMask, dateFormatted, t, pageT, onAddClick }: BankingCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full relative z-10 group">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="banking-card-3d relative bg-gradient-to-r from-[#021338] via-[#05286E] to-[#011438] border border-[#0E3680] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(0,18,50,0.5)] overflow-hidden"
      >
        {/* Luminous Glowing Waves & Dot Matrix Pattern on the Right */}
        <div className="banking-card-waves absolute right-0 top-0 bottom-0 w-3/5 sm:w-1/2 pointer-events-none overflow-hidden select-none opacity-80">
          <svg className="w-full h-full" viewBox="0 0 500 240" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D2FF" stopOpacity="0" />
                <stop offset="30%" stopColor="#00D2FF" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
                <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.75" />
                <stop offset="80%" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
              </linearGradient>
              <pattern id="dotGrid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="#38BDF8" fillOpacity="0.2" />
              </pattern>
            </defs>
            <rect x="80" y="0" width="420" height="240" fill="url(#dotGrid)" />
            {/* Smooth luminous stream curves */}
            <path d="M 0 160 C 140 160, 220 100, 350 78 C 410 68, 470 82, 500 92" stroke="url(#waveGrad1)" strokeWidth="2.8" filter="drop-shadow(0 0 10px rgba(56,189,248,0.9))" />
            <path d="M 40 178 C 170 170, 250 115, 370 88 C 420 78, 470 90, 500 98" stroke="url(#waveGrad2)" strokeWidth="2" filter="drop-shadow(0 0 6px rgba(56,189,248,0.7))" />
            <path d="M 80 195 C 200 185, 280 130, 390 100 C 440 90, 480 102, 500 110" stroke="url(#waveGrad1)" strokeWidth="1.2" opacity="0.6" />
            <path d="M 0 145 C 130 145, 210 90, 330 70 C 390 60, 460 72, 500 80" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
          </svg>
        </div>

        {/* Animated 3D Interactive Glare */}
        <motion.div 
          className="banking-card-glare absolute inset-0 pointer-events-none z-20"
          style={{
            background: "radial-gradient(circle at center, rgba(56,189,248,0.12) 0%, transparent 60%)",
            x: useTransform(mouseXSpring, [-0.5, 0.5], ["-40%", "40%"]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], ["-40%", "40%"]),
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8" style={{ transform: "translateZ(30px)" }}>
          {/* Header Row: Total Net Balance & Date */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="banking-card-icon-box p-2 sm:p-2.5 rounded-xl bg-[#0B2A6B] border border-[#17459E] text-[#38BDF8] flex items-center justify-center shrink-0 shadow-sm transition-colors">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="banking-card-title text-[12px] sm:text-[14px] font-extrabold tracking-wider text-white uppercase truncate transition-colors">
                  TOTAL NET BALANCE
                </span>
                <span className="banking-card-subtitle text-[10px] sm:text-[11.5px] text-[#8BA4D0] truncate transition-colors">
                  Your overall financial summary
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="banking-card-subtitle text-[9.5px] sm:text-[11.5px] font-semibold tracking-wider text-[#8BA4D0] uppercase hidden xs:inline transition-colors">
                {dateFormatted}
              </span>
              <div className="banking-card-icon-box p-1.5 sm:p-2 rounded-xl bg-[#0B2A6B] border border-[#17459E] text-[#38BDF8] flex items-center justify-center shadow-sm transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Available Balance Amount */}
          <div className="space-y-1 sm:space-y-1.5">
            <p className="banking-card-label text-[10.5px] sm:text-[12px] text-[#7E9BC9] tracking-widest uppercase font-semibold transition-colors">
              AVAILABLE BALANCE
            </p>
            <div 
              className="banking-card-amount font-mono text-[34px] xs:text-[40px] sm:text-[50px] md:text-[56px] font-extrabold text-white tracking-tight leading-none drop-shadow-md truncate max-w-full transition-colors" 
              title={formatCurrency(totalWealth, privacyMask)}
            >
              {formatCurrency(totalWealth, privacyMask)}
            </div>
          </div>
          
          {/* Action Buttons: Add Income (Green) & Add Expense (Red) */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[#00D26A] hover:bg-[#00E676] !text-white font-bold text-[13px] sm:text-[15px] flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(0,210,106,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3] !text-white" />
                <span className="truncate !text-white">Add Income</span>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[#FF334B] hover:bg-[#FF1733] !text-white font-bold text-[13px] sm:text-[15px] flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(255,51,75,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Minus className="w-4 h-4 stroke-[3] !text-white" />
                <span className="truncate !text-white">Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
