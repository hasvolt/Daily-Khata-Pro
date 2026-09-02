import React, { useState } from 'react';

interface HasVoltLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const HasVoltLogo: React.FC<HasVoltLogoProps> = ({
  size = 36,
  className = '',
  showText = false
}) => {
  const [imageError, setImageError] = useState(false);

  // Normalize sizing whether number or preset like 'sm'
  let pixelSize = 36;
  if (typeof size === 'number') {
    pixelSize = size;
  } else if (size === 'sm') {
    pixelSize = 24;
  } else if (size === 'md') {
    pixelSize = 36;
  } else if (size === 'lg') {
    pixelSize = 48;
  } else {
    pixelSize = parseInt(String(size), 10) || 36;
  }

  const dimension = `${pixelSize}px`;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {!imageError ? (
        <img
          src="/daily-Khata-Pro.png"
          alt="Daily Khata Pro Logo"
          width={pixelSize}
          height={pixelSize}
          style={{ width: dimension, height: dimension, objectFit: 'cover' }}
          className="shrink-0 rounded-xl shadow-md select-none transition-transform hover:scale-105 border border-[#213E61]/60"
          onError={() => setImageError(true)}
          loading="eager"
        />
      ) : (
        <div
          style={{ width: dimension, height: dimension }}
          className="shrink-0 rounded-xl bg-[#0E1A29] border border-[#38BDF8] flex items-center justify-center font-bold text-[#F59E0B] shadow-md select-none"
        >
          <span style={{ fontSize: `${Math.max(12, Math.round(pixelSize * 0.45))}px` }}>₹</span>
        </div>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif-display font-bold text-[18px] tracking-tight">
            <span className="text-[#FFFFFF]">Daily</span>
            <span className="text-[#38BDF8] ml-1">Khata</span>
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
