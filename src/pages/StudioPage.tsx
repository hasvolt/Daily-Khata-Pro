import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Studio } from 'sanity';
import sanityConfig from '../sanity/sanity.config';
import { ExternalLink, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, ArrowLeft, Maximize, Minimize } from 'lucide-react';

class StudioErrorBoundary extends React.Component<
  { children: React.ReactNode; currentStudioUrl: string; onReload: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; currentStudioUrl: string; onReload: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Sanity Studio Error Catch]:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-[#070E18] text-white">
          <div className="max-w-md w-full bg-[var(--theme-card,#132438)] border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Sanity Studio Load Notice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {this.state.error?.message || 'Studio encountered a display or connection issue. If using an embedded iframe or preview, open in a new browser tab.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onReload();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Reloading</span>
              </button>
              <a
                href={this.props.currentStudioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function StudioPage() {
  const navigate = useNavigate();
  const [isInIframe, setIsInIframe] = useState(false);
  const [studioKey, setStudioKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const currentStudioUrl = typeof window !== 'undefined' ? `${window.location.origin}/studio` : '/studio';

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-[#070E18] text-white overflow-hidden">
      {/* Studio Header & Utility Bar */}
      <header className="h-11 px-3 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] shadow-xs shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Return to Daily Khata Pro Homepage"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">Daily Khata Pro</span>
          </button>

          <div className="h-4 w-px bg-slate-700/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-white">Sanity Studio</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline">
                Daily Khata Pro
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (100% Full Viewport)'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-emerald-400" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>

          <button
            type="button"
            onClick={() => setStudioKey((k) => k + 1)}
            className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
            title="Reload Studio Component"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Reload</span>
          </button>

          <a
            href={currentStudioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            title="Open Studio in a Dedicated Clean Browser Tab"
          >
            <span>New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://3zccyf67.sanity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Open Hosted Sanity Cloud Studio Directly"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Cloud Studio</span>
          </a>

          <a
            href="https://www.sanity.io/manage/project/3zccyf67/api#cors-origins"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-medium hidden lg:flex items-center gap-1 cursor-pointer transition-colors"
            title="Check Sanity Project CORS settings"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CORS</span>
          </a>
        </div>
      </header>

      {/* Helpful Login Notice for Iframe Environments */}
      {isInIframe && (
        <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Preview Iframe:</strong> If OAuth login does not complete inside the preview iframe, click <strong>"New Tab"</strong> above.
            </span>
          </div>
          <a
            href={currentStudioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-amber-300 hover:text-white whitespace-nowrap text-xs shrink-0"
          >
            Open New Tab →
          </a>
        </div>
      )}

      {/* Native Embedded Sanity Studio View - 100% Full Height & Width */}
      <div
        key={studioKey}
        className="w-full flex-1 min-h-0 h-full relative overflow-hidden bg-[#070E18]"
      >
        <StudioErrorBoundary currentStudioUrl={currentStudioUrl} onReload={() => setStudioKey((k) => k + 1)}>
          <Studio config={sanityConfig} />
        </StudioErrorBoundary>
      </div>
    </div>
  );
}
export default StudioPage;
