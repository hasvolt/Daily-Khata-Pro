import { getCurrencyConfig, getCurrentLanguage } from '../utils/currencyConfig';
import React, { useState } from 'react';
import { Calculator, X, ArrowRight } from 'lucide-react';
import { FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { TRANSLATIONS } from '../utils/translations';

interface FundSplitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentages: Record<FundType, number>;
  onApplyToIncome?: (amount: number) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const FundSplitCalculatorModal: React.FC<FundSplitCalculatorModalProps> = ({
  isOpen,
  onClose,
  percentages,
  onApplyToIncome,
  language = 'en',
  privacyMask = false
}) => {
  const [customAmount, setCustomAmount] = useState<string>('50000');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const numAmount = parseFloat(customAmount) || 0;
  const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000, 1000000, 5000000];

  const handleSelectQuick = (amt: number) => {
    setCustomAmount(amt.toString());
    triggerHapticSound('click');
  };

  const handleApply = () => {
    if (onApplyToIncome && numAmount > 0) {
      onApplyToIncome(numAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 no-print">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--theme-border,#213E61)] flex justify-between items-center bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                {t.calculator.title}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {t.calculator.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Input Amount Section */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              {t.calculator.enterAmount}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] font-bold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
              <input
                type="number"
                min="0"
                step="100"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="50000"
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-[var(--theme-primary,#38BDF8)] rounded-xl pl-9 pr-4 py-2.5 text-[18px] font-mono font-bold text-[#F8FAFC] outline-none transition-all shadow-inner"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-[#64748B] flex items-center pr-1">{t.calculator.presets}:</span>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectQuick(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                    numAmount === amt
                      ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))]'
                      : 'bg-[var(--theme-surface,#0E1A29)] text-[#CBD5E1] border-[var(--theme-border,#213E61)] hover:border-white/20'
                  }`}
                >
                  {getCurrencyConfig(getCurrentLanguage()).symbol}{amt >= 10000000 ? `${amt / 10000000}Cr` : amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Cards */}
          <div className="space-y-2 pt-2 border-t border-[var(--theme-border,#213E61)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                {t.calculator.calculatedBreakdown}
              </span>
              <span className="text-[11px] text-[#64748B]">
                Total: <span className="font-mono font-bold text-[#F8FAFC]">{formatCurrency(numAmount, privacyMask)}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FUND_ORDER.map((f) => {
                const cfg = FUND_CONFIGS[f];
                const pct = percentages[f] ?? DEFAULT_PERCENTAGES[f];
                const splitValue = (numAmount * pct) / 100;
                const fundLabel = t.funds?.[f]?.name ? t.funds[f].name.split(' (')[0] : FUND_LABELS[f];

                return (
                  <div
                    key={f}
                    className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3 shadow-xs hover:border-[var(--theme-primary,#38BDF8)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] shrink-0"
                        style={{
                          backgroundColor: `${cfg.color}1A`,
                          color: cfg.color,
                          border: `1px solid ${cfg.color}33`
                        }}
                      >
                        {pct}%
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-bold text-[#F8FAFC] truncate">
                          {fundLabel}
                        </div>
                        <div className="text-[10px] text-[#64748B] truncate">
                          {cfg.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className="text-[14px] font-mono font-bold"
                        style={{ color: cfg.color }}
                      >
                        {formatCurrency(splitValue, privacyMask)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] text-[12px] font-bold transition-colors cursor-pointer"
          >
            {t.add.cancel}
          </button>

          {onApplyToIncome && (
            <button
              type="button"
              onClick={handleApply}
              disabled={numAmount <= 0}
              className="px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
                color: 'var(--theme-btn-text, #040D17)'
              }}
            >
              <span>{t.calculator.applyToIncome}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
