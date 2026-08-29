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
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Only push if not already pushed for this mount
    if (!isPushed.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (err) {
        // Handle ad-blockers or iframe preview constraints quietly
        console.debug('AdSense initialization notice:', err);
      }
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto my-3 overflow-hidden text-center select-none ${className}`}>
      {label && (
        <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#64748B] mb-1 text-center">
          {label}
        </div>
      )}
      <div className="rounded-xl border border-[#1E2C3D]/60 bg-[#060B12]/60 p-2 min-h-[90px] flex items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '60px' }}
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
