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
  const [isAdVisible, setIsAdVisible] = useState<boolean>(true);
  const insRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  // Monitor real-time online / offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsAdVisible(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsAdVisible(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize AdSense only when online
  useEffect(() => {
    if (!isOnline) {
      setIsAdVisible(false);
      return;
    }

    if (!isPushed.current && typeof window !== 'undefined' && isOnline) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (err) {
        console.debug('AdSense initialization notice:', err);
      }
    }
  }, [isOnline]);

  // Watch for AdSense fill/unfill status via MutationObserver
  useEffect(() => {
    if (!insRef.current || !isOnline) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
          const status = insRef.current?.getAttribute('data-ad-status');
          if (status === 'unfilled') {
            setIsAdVisible(false);
          } else if (status === 'filled') {
            setIsAdVisible(true);
          }
        }
      });
    });

    observer.observe(insRef.current, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    });

    return () => observer.disconnect();
  }, [isOnline]);

  // If user is offline or ad is marked unfilled, hide completely with zero DOM impact
  if (!isOnline || !isAdVisible) {
    return null;
  }

  return (
    <div className={`w-full max-w-4xl mx-auto my-2 text-center select-none overflow-hidden transition-all duration-300 ${className}`}>
      {label && (
        <div className="text-[9.5px] font-bold uppercase tracking-widest text-[#64748B] mb-1 text-center opacity-80">
          {label}
        </div>
      )}
      {/* Dynamic clean ad container - no fixed grey/white placeholder when empty */}
      <div className="w-full flex items-center justify-center overflow-hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center', minHeight: '50px' }}
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


