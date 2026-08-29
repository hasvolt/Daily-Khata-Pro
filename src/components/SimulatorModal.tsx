import React, { useState } from 'react';
import { X, Calculator, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import { FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency } from '../utils/khataCalculations';
import { TRANSLATIONS } from '../utils/translations';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
  percentages?: Record<FundType, number>;
  onRecordEntry: (amount: number, splits: Record<FundType, number>) => void;
  privacyMask?: boolean;
}

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000];

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  percentages = DEFAULT_PERCENTAGES,
  onRecordEntry,
  privacyMask = false
}) => {
  const [simAmount, setSimAmount] = useState<number>(50000);
  const [simInput, setSimInput] = useState<string>('50000');
  const [customPct, setCustomPct] = useState<Record<FundType, number>>(percentages);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const totalPct = (Object.values(customPct) as number[]).reduce((sum: number, v: number) => sum + (Number(v) || 0), 0);
  const is100 = Math.abs(Number(totalPct) - 100) < 0.01;

  // Calculate splits
  const calculatedSplits: Record<FundType, number> = FUND_ORDER.reduce((acc, fund) => {
    const pct = customPct[fund] || 0;
    acc[fund] = (simAmount * pct) / 100;
    return acc;
  }, {} as Record<FundType, number>);

  const handleAmountChange = (valStr: string) => {
    setSimInput(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num >= 0) {
      setSimAmount(num);
    } else if (valStr === '') {
      setSimAmount(0);
    }
  };

  const handlePresetClick = (amount: number) => {
    setSimAmount(amount);
    setSimInput(amount.toString());
  };

  const handleResetPct = () => {
    setCustomPct(DEFAULT_PERCENTAGES);
  };

  const handleSaveToEntry = () => {
    if (simAmount <= 0) return;
    onRecordEntry(simAmount, calculatedSplits);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 text-left">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/90">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: 'var(--theme-primary-dim, rgba(56,189,248,0.15))',
                color: 'var(--theme-primary, #38BDF8)',
                borderColor: 'var(--theme-primary-border, rgba(56,189,248,0.35))'
              }}
            >
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-[17px] sm:text-[19px] font-bold text-[#F8FAFC]">
                {t.simulator.title}
              </h2>
              <p className="text-[11.5px] sm:text-[12px] text-[#94A3B8]">
                {t.simulator.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Income Input Section */}
          <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 space-y-3.5">
            <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {t.simulator.enterIncome}
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#94A3B8]">
                ₹
              </span>
              <input
                id="simulator-amount-input"
                type="number"
                min="0"
                step="100"
                value={simInput}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="50000"
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] text-[#F8FAFC] text-2xl sm:text-3xl font-bold pl-10 pr-4 py-3 rounded-xl outline-none num transition-all shadow-inner"
              />
            </div>

            {/* Quick Amount Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-medium text-[#64748B]">
                {t.simulator.sliderLabel}:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetClick(amt)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                      simAmount === amt
                        ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-xs'
                        : 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:border-[var(--theme-primary,#38BDF8)]'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6-Fund Live Partition Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{t.simulator.breakdownHeading}</span>
              </div>
              <button
                type="button"
                onClick={handleResetPct}
                className="text-[11px] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.simulator.resetDefaults}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FUND_ORDER.map((fund) => {
                const cfg = FUND_CONFIGS[fund];
                const pct = customPct[fund] || 0;
                const allocated = calculatedSplits[fund] || 0;
                const fundLabel = t.funds?.[fund]?.name ? t.funds[fund].name.split(' (')[0] : cfg.label;
                const fundDesc = t.funds?.[fund]?.description || cfg.description;

                return (
                  <div
                    key={fund}
                    className="p-3.5 rounded-xl border bg-[var(--theme-bg,#070E18)] transition-all hover:bg-[var(--theme-surface,#0E1A29)] flex flex-col justify-between"
                    style={{ borderColor: `${cfg.color}35` }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border,#213E61)]/60">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <span className="font-bold text-[13.5px] text-[#F8FAFC]">
                          {fundLabel}
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${cfg.color}15`,
                          color: cfg.color,
                          borderColor: `${cfg.color}40`
                        }}
                      >
                        {pct}%
                      </span>
                    </div>

                    <div className="pt-2 flex items-baseline justify-between">
                      <span className="text-[11px] text-[#94A3B8]">
                        {fundDesc}
                      </span>
                      <span
                        className="text-[16px] sm:text-[17px] font-bold num text-[#F8FAFC]"
                        style={{ color: cfg.color }}
                      >
                        {formatCurrency(allocated, privacyMask)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 sm:p-5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-[#94A3B8] flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#10B981]" />
            <span>Mathematical exact partition: 100% disciplined</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:bg-[var(--theme-card,#132438)] text-[13px] font-bold transition-all cursor-pointer"
            >
              {t.add.cancel}
            </button>
            <button
              type="button"
              onClick={handleSaveToEntry}
              disabled={simAmount <= 0}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary-hover,#0EA5E9)] text-[#040D17] font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{t.simulator.recordEntryBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
