import React, { useEffect, useRef, useState } from 'react';

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
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);

  // Monitor real-time online / offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize AdSense tag on mount and when coming back online
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      try {
        if (!pushedRef.current && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      } catch (err) {
        console.debug('AdSense push notice:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOnline]);

  return (
    <div
      id="google-adsense-banner-container"
      className={`w-full max-w-4xl mx-auto my-3 text-center select-none overflow-hidden transition-all duration-300 ${
        isOnline ? 'block' : 'hidden'
      } ${className}`}
    >
      {label && (
        <div className="text-[9.5px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5 text-center opacity-80">
          {label}
        </div>
      )}

      {/* Official Google AdSense Tag Container - Always intact in DOM for verification & crawlers */}
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



