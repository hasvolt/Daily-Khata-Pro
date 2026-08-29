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
  const [imgSrc, setImgSrc] = useState<string>('/daily-Khata-Pro.png');
  const [imgError, setImgError] = useState(false);
  const dimension = typeof size === 'number' ? `${size}px` : size;

  const handleImageError = () => {
    if (imgSrc !== '/daily-Khata-Pro.png') {
      setImgSrc('/daily-Khata-Pro.png');
    } else {
      setImgError(true);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {!imgError ? (
        <img
          src={imgSrc}
          alt="Daily Khata: Pro Logo"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          style={{ width: dimension, height: dimension }}
          className="shrink-0 object-contain rounded-xl drop-shadow-sm select-none"
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-sm select-none"
        >
          <defs>
            <linearGradient id="khataGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE566" />
              <stop offset="45%" stopColor="#FFC700" />
              <stop offset="100%" stopColor="#D99B00" />
            </linearGradient>
            <linearGradient id="khataGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="khataRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="khataBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#162433" />
              <stop offset="100%" stopColor="#0B1017" />
            </linearGradient>
          </defs>

          {/* Outer Financial Shield Badge */}
          <rect
            x="24"
            y="24"
            width="464"
            height="464"
            rx="128"
            fill="url(#khataBgGrad)"
            stroke="url(#khataGoldGrad)"
            strokeWidth="16"
          />

          {/* Ledger Book Backplate */}
          <rect
            x="100"
            y="104"
            width="312"
            height="304"
            rx="28"
            fill="#101A24"
            stroke="#2A3D52"
            strokeWidth="10"
          />

          {/* Rupee & Financial accents */}
          <line x1="140" y1="168" x2="372" y2="168" stroke="#25384B" strokeWidth="8" strokeLinecap="round" />
          <line x1="140" y1="220" x2="372" y2="220" stroke="#25384B" strokeWidth="8" strokeLinecap="round" />
          <line x1="140" y1="272" x2="372" y2="272" stroke="#25384B" strokeWidth="8" strokeLinecap="round" />

          {/* Indian Rupee ₹ Core Symbol */}
          <g id="RupeeCore">
            <path d="M204 186 L308 186" stroke="url(#khataGoldGrad)" strokeWidth="18" strokeLinecap="round" />
            <path d="M204 222 L290 222" stroke="url(#khataGoldGrad)" strokeWidth="18" strokeLinecap="round" />
            <path
              d="M236 186 C280 186 280 258 236 258 L218 258 L286 348"
              stroke="url(#khataGoldGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif-display font-bold text-[18px] tracking-tight">
            <span className="text-[#FFFFFF]">Daily</span>
            <span className="text-[#38BDF8] ml-1">Khata</span>
            <span className="text-[#F8FAFC]">: Pro</span>
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium">
            Daily Income &amp; Expense Tracker
          </span>
        </div>
      )}
    </div>
  );
};
