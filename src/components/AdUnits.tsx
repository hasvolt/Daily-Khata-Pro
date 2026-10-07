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
        <div className="flex items-center justify-center w-full mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Sponsored
          </span>
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
        <div className="flex items-center justify-center w-full mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Sponsored
          </span>
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
 * Adsterra Native Banner Component (Multi-Card / 4-Image Format)
 * Script: https://bauval.org/21/f5bbfccec2bbdc526388b13f1b3de5e6
 * Target Container: container-f5bbfccec2bbdc526388b13f1b3de5e6
 */
export const AdsterraNativeBanner: React.FC<{
  className?: string;
  label?: string;
  showLabel?: boolean;
}> = ({
  className = '',
  label = 'Partner Recommendations',
  showLabel = true,
}) => {
  const [frameHeight, setFrameHeight] = React.useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return 460;
    return 280;
  });

  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'adsterra-native-height' && typeof e.data.height === 'number') {
        const measured = Math.max(Math.ceil(e.data.height), 240);
        setFrameHeight(measured);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const nativeHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        width: 100%;
        min-height: 100%;
        overflow-x: hidden;
        color: #F8FAFC !important;
        touch-action: pan-y;
      }
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        min-height: 220px;
        touch-action: pan-y;
      }
      /* Ensure title words & text are bright white/light in dark or color themes */
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 * {
        color: #E2E8F0 !important;
      }
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 a {
        color: #FFFFFF !important;
        text-decoration: none !important;
      }
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 a:hover {
        color: #38BDF8 !important;
      }
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 h1,
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 h2,
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 h3,
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 h4,
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 [class*="title"],
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 [class*="header"] {
        color: #FFFFFF !important;
        font-weight: 700 !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
      }
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 [class*="desc"],
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 [class*="domain"],
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 p,
      #container-f5bbfccec2bbdc526388b13f1b3de5e6 span {
        color: #94A3B8 !important;
      }
    </style>
  </head>
  <body>
    <div id="container-f5bbfccec2bbdc526388b13f1b3de5e6"></div>
    <script async="async" data-cfasync="false" src="https://bauval.org/21/f5bbfccec2bbdc526388b13f1b3de5e6"></script>
    <script>
      function reportHeight() {
        var el = document.getElementById('container-f5bbfccec2bbdc526388b13f1b3de5e6');
        var h = Math.max(
          document.body.scrollHeight || 0,
          document.documentElement.scrollHeight || 0,
          el ? el.scrollHeight : 0
        );
        if (h > 60) {
          window.parent.postMessage({ type: 'adsterra-native-height', height: h }, '*');
        }
      }
      function enforceLightText() {
        var el = document.getElementById('container-f5bbfccec2bbdc526388b13f1b3de5e6');
        if (!el) return;
        var nodes = el.querySelectorAll('*');
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          var computed = window.getComputedStyle(n).color;
          if (computed === 'rgb(0, 0, 0)' || computed === 'rgb(34, 34, 34)' || computed === 'rgb(51, 51, 51)' || computed === 'black') {
            n.style.setProperty('color', '#FFFFFF', 'important');
          }
        }
      }
      window.addEventListener('load', function() {
        reportHeight();
        enforceLightText();
      });
      if (window.ResizeObserver) {
        new ResizeObserver(function() {
          reportHeight();
          enforceLightText();
        }).observe(document.body);
      }
      setInterval(function() {
        reportHeight();
        enforceLightText();
      }, 1000);
    </script>
  </body>
</html>`;

  return (
    <aside
      aria-label="Recommended Content"
      className={`my-4 sm:my-5 p-3 sm:p-4 rounded-2xl bg-[var(--theme-card,#132438)]/40 border border-[var(--theme-border,#213E61)]/70 max-w-full overflow-hidden ${className}`}
    >
      {showLabel && (
        <div className="flex items-center justify-between w-full mb-2.5 pb-1.5 border-b border-[var(--theme-border,#213E61)]/40 px-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Sponsored
          </span>
          <span className="text-[10px] font-mono text-[var(--theme-text,#F8FAFC)]/90 uppercase tracking-wider font-semibold">
            {label}
          </span>
        </div>
      )}
      <div
        style={{ minHeight: `${frameHeight}px`, touchAction: 'pan-y' }}
        className="w-full flex items-center justify-center overflow-hidden rounded-xl transition-[min-height] duration-200"
      >
        <iframe
          srcDoc={nativeHtml}
          title="Sponsored Recommendation"
          style={{ height: `${frameHeight}px`, minHeight: `${frameHeight}px`, touchAction: 'pan-y' }}
          className="w-full border-none overflow-hidden block"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </aside>
  );
};
