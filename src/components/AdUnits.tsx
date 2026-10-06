import React, { useEffect, useRef } from 'react';

/**
 * Adsterra 300x250 Medium Rectangle Banner Component
 * Key: e432e8158e7d540cae438af7a234d032
 * Renders in a dedicated container with subtle frame & sponsored label
 */
export const AdsterraBanner300x250: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous contents if re-mounted
    container.innerHTML = '';

    // Create iframe to safely isolate document.write from modern React DOM
    const iframe = document.createElement('iframe');
    iframe.width = '300';
    iframe.height = '250';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.setAttribute('scrolling', 'no');
    iframe.title = 'Sponsored Advertisement';

    container.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : 'e432e8158e7d540cae438af7a234d032',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://bauval.org/22/e432e8158e7d540cae438af7a234d032"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--theme-card,#132438)]/40 border border-[var(--theme-border,#213E61)]/70 ${className}`}
    >
      <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--theme-text-dim,#64748B)] mb-2 select-none">
        Sponsored
      </div>
      <div ref={containerRef} className="w-[300px] h-[250px] flex items-center justify-center overflow-hidden" />
    </aside>
  );
};

/**
 * Adsterra Native Banner Component
 * Script: https://bauval.org/21/f5bbfccec2bbdc526388b13f1b3de5e6
 * Target Container: container-f5bbfccec2bbdc526388b13f1b3de5e6
 */
export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  useEffect(() => {
    const scriptSrc = 'https://bauval.org/21/f5bbfccec2bbdc526388b13f1b3de5e6';
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptSrc;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <aside
      aria-label="Recommended Content"
      className={`my-8 p-4 rounded-2xl bg-[var(--theme-card,#132438)]/50 border border-[var(--theme-border,#213E61)] ${className}`}
    >
      <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--theme-text-dim,#64748B)] mb-2 select-none">
        Sponsored / Partner Content
      </div>
      <div id="container-f5bbfccec2bbdc526388b13f1b3de5e6" className="w-full min-h-[90px] overflow-hidden" />
    </aside>
  );
};
