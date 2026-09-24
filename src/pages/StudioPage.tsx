import React, { useState } from 'react';
import { ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

export function StudioPage() {
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div className="w-full min-h-[92vh] flex flex-col bg-[#070E18] text-white">
      {/* Studio Header Bar */}
      <div className="px-4 py-3 border-b border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] shadow-xs">
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
            <p className="text-[10px] text-slate-400">
              Project: 3zccyf67 · Dataset: production · Cloud CMS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
            title="Reload Studio"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href="https://daily-khata-pro.sanity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Open Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Sanity Studio View */}
      <div className="w-full flex-1 min-h-[85vh] relative">
        <iframe
          key={iframeKey}
          src="https://daily-khata-pro.sanity.studio"
          title="Daily Khata Pro Sanity Studio"
          className="w-full h-full min-h-[85vh] border-none"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
