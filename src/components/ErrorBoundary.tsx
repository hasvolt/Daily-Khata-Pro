import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[var(--theme-text,#F8FAFC)]">
            {this.props.fallbackTitle || 'Something went wrong while loading this page'}
          </h2>
          <p className="text-sm text-[var(--theme-text-dim,#94A3B8)] max-w-md mx-auto leading-relaxed">
            {this.props.fallbackMessage || 'A temporary display error occurred. Your financial ledger data is 100% safe in your local storage.'}
          </p>
          {this.state.error?.message && (
            <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-amber-300/80 text-left overflow-x-auto">
              {this.state.error.message}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-[var(--theme-card-hover,#19304A)] active:scale-95 transition-all"
            >
              <Home className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
