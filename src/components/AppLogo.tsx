import React, { useState } from 'react';

interface AppLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

const LOGO_CANDIDATES = [
  '/daily-khata-pro-v4.png',
  '/daily-Khata-Pro.png',
  '/daily-Khata-Pro-aap-icon.png',
  '/icon-192.png'
];

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 32,
  className = '',
  showText = false
}) => {
  const [candidateIdx, setCandidateIdx] = useState(0);

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
  const currentSrc = LOGO_CANDIDATES[candidateIdx] || LOGO_CANDIDATES[0];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        style={{ width: dimension, height: dimension }}
        className="shrink-0 rounded-xl bg-[#060606] border border-[var(--theme-border,#213E61)]/70 hover:border-[var(--theme-primary,#38BDF8)]/60 shadow-md flex items-center justify-center p-0.5 overflow-hidden transition-all hover:scale-105 select-none"
      >
        <img
          src={currentSrc}
          alt="Daily Khata Pro Logo"
          width={pixelSize}
          height={pixelSize}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          className="select-none block rounded-lg"
          onError={() => {
            if (candidateIdx < LOGO_CANDIDATES.length - 1) {
              setCandidateIdx(prev => prev + 1);
            }
          }}
          loading="eager"
          decoding="async"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif-display font-bold text-[18px] tracking-tight">
            <span className="text-[#FFFFFF]">Daily</span>
            <span className="text-[var(--theme-text,#F8FAFC)] ml-1">Khata</span>
            <span className="text-[#38BDF8] ml-1">Pro</span>
          </span>
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-medium">
            Income &amp; Expense Tracker
          </span>
        </div>
      )}
    </div>
  );
};

