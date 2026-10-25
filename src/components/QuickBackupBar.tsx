import React, { useState } from 'react';
import { Download, FileText, Sparkles, ChevronUp, ChevronDown, ShieldCheck } from 'lucide-react';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface QuickBackupBarProps {
  onOpenMultiBackup: () => void;
  onOneClickPdf: () => void;
  isGeneratingPdf?: boolean;
  language?: AppLanguage;
}

export const QuickBackupBar: React.FC<QuickBackupBarProps> = ({
  onOpenMultiBackup,
  onOneClickPdf,
  isGeneratingPdf = false,
  language = 'en'
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const isHindi = language === 'hi' || language === 'hinglish';

  return (
    <div className="fixed bottom-20 right-3.5 z-30 no-print flex flex-col items-end gap-1.5 select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Expanded Quick Options Menu */}
      {!isMinimized && (
        <div className="p-2 rounded-2xl bg-[var(--theme-surface,#0F172A)]/95 border border-[var(--theme-border,#1E293B)] shadow-2xl backdrop-blur-xl flex flex-col gap-1.5 w-52 mb-1">
          <div className="px-2 py-1 text-[10.5px] font-bold text-[var(--theme-text-dim,#94A3B8)] flex items-center justify-between border-b border-[var(--theme-border,#1E293B)] pb-1.5">
            <span>{isHindi ? 'त्वरित बैकअप मेनू' : 'Quick Backup Menu'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">SAFE</span>
          </div>

          {/* 1-Click PDF Direct Download */}
          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onOneClickPdf();
            }}
            disabled={isGeneratingPdf}
            className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-[11.5px] flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isGeneratingPdf
                ? (isHindi ? 'PDF बन रहा है...' : 'Generating...')
                : (isHindi ? '📥 1-क्लिक PDF डाउनलोड' : '📥 1-Click PDF Report')}
            </span>
          </button>

          {/* Open Full Multi Backup Modal */}
          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onOpenMultiBackup();
            }}
            className="w-full py-2 px-2.5 rounded-xl bg-[var(--theme-card,#1E293B)] hover:bg-[var(--theme-card-hover,#334155)] border border-[var(--theme-border,#334155)] text-[var(--theme-text,#F8FAFC)] hover:border-sky-400 font-bold text-[11.5px] flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">
              {isHindi ? '💾 सभी बैकअप विकल्प...' : '💾 All Backup Options...'}
            </span>
          </button>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--theme-surface,#0F172A)]/90 border border-emerald-500/40 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            triggerHapticSound('click');
            onOneClickPdf();
          }}
          disabled={isGeneratingPdf}
          className="h-8 px-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-[11px] flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          title={isHindi ? '1-क्लिक कम्प्लीट PDF डाउनलोड' : '1-Click Comprehensive PDF'}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline font-bold">1-Click PDF</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHapticSound('click');
            onOpenMultiBackup();
          }}
          className="h-8 px-2.5 rounded-full bg-[var(--theme-card,#1E293B)] hover:bg-[var(--theme-card-hover,#334155)] text-sky-400 hover:text-sky-300 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all border border-sky-500/30 active:scale-95"
          title={isHindi ? 'मल्टीपल बैकअप विकल्प (JSON, Drive, Snapshots, CSV)' : 'Multi-Backup Options'}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{isHindi ? 'बैकअप' : 'Backup'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHapticSound('click');
            setIsMinimized(!isMinimized);
          }}
          className="w-7 h-7 rounded-full text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title={isMinimized ? 'Expand Quick Backup Menu' : 'Minimize'}
        >
          {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
