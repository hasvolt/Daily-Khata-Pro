import React from 'react';

export type BannerSize = '300x250' | '728x90' | '320x50' | '468x60' | '160x300' | '160x600';

interface BannerConfig {
  key: string;
  width: number;
  height: number;
}

const BANNER_CONFIGS: Record<BannerSize, BannerConfig> = {
  '300x250': {
    key: 'e432e8158e7d540cae438af7a234d032',
    width: 300,
    height: 250,
  },
  '728x90': {
    key: 'c478eda89690e4ebe13a043e7f995250',
    width: 728,
    height: 90,
  },
  '320x50': {
    key: '141345fc438aef099852795339c3fc1e',
    width: 320,
    height: 50,
  },
  '468x60': {
    key: '0f3b84c5f58f3f169c415b8411791fd6',
    width: 468,
    height: 60,
  },
  '160x300': {
    key: '3c4c4bc340020706c750502102dd94a4',
    width: 160,
    height: 300,
  },
  '160x600': {
    key: '967b96c8d7c24de26a777fff54901aec',
    width: 160,
    height: 600,
  },
};

/**
 * Single Iframe-isolated Adsterra Banner component
 */
export const AdsterraBanner: React.FC<{
  size?: BannerSize;
  className?: string;
  showLabel?: boolean;
}> = ({ size = '300x250', className = '', showLabel = true }) => {
  const cfg = BANNER_CONFIGS[size] || BANNER_CONFIGS['300x250'];

  const bannerHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; overflow: hidden; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${cfg.key}',
        'format' : 'iframe',
        'height' : ${cfg.height},
        'width' : ${cfg.width},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/${cfg.key}"></script>
  </body>
</html>`;

  return (
    <aside
      aria-label="Advertisement"
      className={`my-3 sm:my-4 flex flex-col items-center justify-center p-2 rounded-2xl bg-[var(--theme-card,#132438)]/40 border border-[var(--theme-border,#213E61)]/70 max-w-full overflow-hidden ${className}`}
    >
      {showLabel && (
        <div className="text-[9.5px] font-mono tracking-wider uppercase text-[var(--theme-text-dim,#64748B)] mb-1 select-none">
          Sponsored
        </div>
      )}
      <div
        style={{ width: `${cfg.width}px`, height: `${cfg.height}px` }}
        className="flex items-center justify-center overflow-hidden max-w-full rounded-lg"
      >
        <iframe
          srcDoc={bannerHtml}
          width={cfg.width}
          height={cfg.height}
          title={`Sponsored Advertisement ${size}`}
          className="border-none overflow-hidden block"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </aside>
  );
};

/**
 * Responsive Leaderboard / Banner Component
 * On Desktop (>= 768px): displays 728x90 Leaderboard
 * On Tablet (480px - 767px): displays 468x60 Banner
 * On Mobile (< 480px): displays 320x50 Mobile Leaderboard
 */
export const AdsterraResponsiveLeaderboard: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = true }) => {
  const [activeSize, setActiveSize] = React.useState<BannerSize>(() => {
    if (typeof window === 'undefined') return '728x90';
    if (window.innerWidth >= 768) return '728x90';
    if (window.innerWidth >= 480) return '468x60';
    return '320x50';
  });

  React.useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 768) setActiveSize('728x90');
      else if (w >= 480) setActiveSize('468x60');
      else setActiveSize('320x50');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`my-4 flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-[var(--theme-card,#132438)]/40 border border-[var(--theme-border,#213E61)]/70 max-w-full overflow-hidden ${className}`}
    >
      {showLabel && (
        <div className="text-[9.5px] font-mono tracking-wider uppercase text-[var(--theme-text-dim,#64748B)] mb-1.5 select-none">
          Sponsored
        </div>
      )}
      <div className="flex justify-center items-center overflow-hidden max-w-full">
        <AdsterraBanner size={activeSize} showLabel={false} className="my-0 p-0 border-0 bg-transparent" />
      </div>
    </aside>
  );
};

/**
 * 300x250 Medium Rectangle Component
 */
export const AdsterraMediumRectangle: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = true,
}) => {
  return <AdsterraBanner size="300x250" className={className} showLabel={showLabel} />;
};

/**
 * 320x50 Mobile Banner Component
 */
export const AdsterraMobileBanner: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = true,
}) => {
  return <AdsterraBanner size="320x50" className={className} showLabel={showLabel} />;
};

/**
 * 728x90 Desktop Leaderboard Component
 */
export const AdsterraLeaderboard: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = true,
}) => {
  return <AdsterraBanner size="728x90" className={className} showLabel={showLabel} />;
};

/**
 * Backward compatible alias for 300x250 Medium Rectangle
 */
export const AdsterraBanner300x250: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <AdsterraBanner size="300x250" className={className} />;
};

/**
 * Adsterra Native Banner Component
 * Script: https://bauval.org/21/f5bbfccec2bbdc526388b13f1b3de5e6
 * Target Container: container-f5bbfccec2bbdc526388b13f1b3de5e6
 */
export const AdsterraNativeBanner: React.FC<{
  className?: string;
  label?: string;
  showLabel?: boolean;
}> = ({
  className = '',
  label = 'Sponsored / Recommended',
  showLabel = true,
}) => {
  const nativeHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; display: flex; justify-content: center; }
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 { width: 100%; max-width: 100%; }
    </style>
  </head>
  <body>
    <div id="container-f5bbfccec2bbdc526388b13f1b3de5e6"></div>
    <script async="async" data-cfasync="false" src="https://bauval.org/21/f5bbfccec2bbdc526388b13f1b3de5e6"></script>
  </body>
</html>`;

  return (
    <aside
      aria-label="Recommended Content"
      className={`my-4 sm:my-5 p-2.5 sm:p-3.5 rounded-2xl bg-[var(--theme-card,#132438)]/40 border border-[var(--theme-border,#213E61)]/70 max-w-full overflow-hidden ${className}`}
    >
      {showLabel && (
        <div className="text-[9.5px] font-mono tracking-wider uppercase text-[var(--theme-text-dim,#64748B)] mb-1.5 select-none px-1">
          {label}
        </div>
      )}
      <div className="w-full min-h-[120px] sm:min-h-[140px] flex items-center justify-center overflow-hidden rounded-xl">
        <iframe
          srcDoc={nativeHtml}
          title="Sponsored Recommendation"
          className="w-full min-h-[120px] sm:min-h-[140px] border-none overflow-hidden block"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </aside>
  );
};
