import React, { useEffect, useRef } from 'react';

interface GoogleAdBannerProps {
  slotId?: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  slotId = '1364027408',
  client = 'ca-pub-4744063610455678',
  format = 'auto',
  responsive = true,
  className = '',
  label = 'ADVERTISEMENT',
}) => {
  const isPushed = useRef(false);

  useEffect(() => {
    if (!isPushed.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (err) {
        console.debug('AdSense initialization notice:', err);
      }
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto my-3 text-center select-none overflow-hidden ${className}`}>
      {label && (
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5 text-center opacity-85">
          {label}
        </div>
      )}
      {/* Fixed Dedicated AdSense Container with reserved banner height */}
      <div className="w-full min-h-[90px] sm:min-h-[100px] rounded-2xl border border-[var(--theme-border,#213E61)]/60 bg-[var(--theme-card,#132438)]/40 flex items-center justify-center overflow-hidden transition-colors shadow-xs">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px', textAlign: 'center' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};

export default GoogleAdBanner;

