import React, { useState } from 'react';

interface HasVoltLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const HasVoltLogo: React.FC<HasVoltLogoProps> = ({
  size = 32,
  className = '',
  showText = false
}) => {
  const [imageError, setImageError] = useState(false);

  // Normalize sizing whether number or preset like 'sm'
  let pixelSize = 32;
  if (typeof size === 'number') {
    pixelSize = size;
  } else if (size === 'sm') {
    pixelSize = 22;
  } else if (size === 'md') {
    pixelSize = 32;
  } else if (size === 'lg') {
    pixelSize = 42;
  } else {
    pixelSize = parseInt(String(size), 10) || 32;
  }

  const dimension = `${pixelSize}px`;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {!imageError ? (
        <div
          style={{ width: dimension, height: dimension }}
          className="shrink-0 rounded-xl bg-[#060606] border border-[var(--theme-border,#213E61)]/70 hover:border-[var(--theme-primary,#00D26A)]/60 shadow-md flex items-center justify-center p-0.5 overflow-hidden transition-all hover:scale-105 select-none"
        >
          <img
            src="/daily-khata-pro-v4.png"
            alt="Daily Khata Pro Logo"
            width={pixelSize}
            height={pixelSize}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            className="select-none block"
            onError={() => setImageError(true)}
            loading="eager"
          />
        </div>
      ) : (
        <div
          style={{ width: dimension, height: dimension }}
          className="shrink-0 rounded-xl bg-[#0E1A29] border border-[var(--theme-primary)] flex items-center justify-center font-bold text-[#F59E0B] shadow-md select-none"
        >
          <span style={{ fontSize: `${Math.max(11, Math.round(pixelSize * 0.45))}px` }}>₹</span>
        </div>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif-display font-bold text-[18px] tracking-tight">
            <span className="text-[#FFFFFF]">Daily</span>
            <span className="text-[var(--theme-primary,#38BDF8)] ml-1">Khata</span>
            <span className="text-[#F8FAFC] ml-1">Pro</span>
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium">
            Income &amp; Expense Tracker
          </span>
        </div>
      )}
    </div>
  );
};
