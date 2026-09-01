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
  const isPushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pushAd = () => {
      if (!isPushedRef.current && adRef.current) {
        try {
          if (!window.adsbygoogle) {
            window.adsbygoogle = [];
          }
          window.adsbygoogle.push({});
          isPushedRef.current = true;
        } catch (err) {
          console.debug('AdSense init notice:', err);
        }
      }
    };

    const timer = setTimeout(pushAd, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="google-adsense-banner-container"
      className={`w-full max-w-4xl mx-auto my-2 text-center select-none overflow-hidden ${className}`}
    >
      {label && (
        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1 text-center opacity-80">
          {label}
        </div>
      )}

      {/* Official Google AdSense Verified Tag Container */}
      <div className="w-full min-h-[90px] rounded-xl border border-[var(--theme-border,#213E61)]/40 bg-[var(--theme-card,#132438)]/30 flex items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
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



