import React, { useState, useEffect } from 'react';
import { Studio } from 'sanity';
import sanityConfig from '../sanity/sanity.config';
import { ExternalLink, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Key } from 'lucide-react';

export function StudioPage() {
  const [isInIframe, setIsInIframe] = useState(false);
  const [studioKey, setStudioKey] = useState(0);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  const currentStudioUrl = typeof window !== 'undefined' ? `${window.location.origin}/studio` : '/studio';

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#070E18] text-white">
      {/* Studio Helper & Status Bar */}
      <div className="px-4 py-2.5 border-b border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] shadow-xs select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              <span>Sanity Content Studio</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Daily Khata Pro
              </span>
            </h1>
            <p className="text-[10.5px] text-slate-400">
              Project: <span className="text-emerald-400 font-mono font-semibold">3zccyf67</span> · Dataset: <span className="text-emerald-400 font-mono font-semibold">production</span> · Path: <span className="font-mono">/studio</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStudioKey((k) => k + 1)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Reload Studio Component"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>

          <a
            href={currentStudioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Open Studio in Full Browser Window (Recommended for Google / GitHub OAuth Login)"
          >
            <span>Open in New Tab (Full Window)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://www.sanity.io/manage/project/3zccyf67/api#cors-origins"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Check Sanity Project CORS settings"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">CORS Origins</span>
          </a>
        </div>
      </div>

      {/* Helpful Login Notice for Iframe Environments */}
      {isInIframe && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Note:</strong> Browsers block third-party OAuth cookies inside preview iframes. If Google/GitHub login does not complete here, click <strong>"Open in New Tab (Full Window)"</strong> above to log in directly.
            </span>
          </div>
          <a
            href={currentStudioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-amber-300 hover:text-white whitespace-nowrap"
          >
            Open in New Tab →
          </a>
        </div>
      )}

      {/* Native Embedded Sanity Studio View */}
      <div key={studioKey} className="w-full flex-1 min-h-[calc(100vh-80px)] relative">
        <Studio config={sanityConfig} />
      </div>
    </div>
  );
}
export default StudioPage;
