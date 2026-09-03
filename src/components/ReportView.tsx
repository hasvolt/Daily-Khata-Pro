import React, { useState, useEffect } from 'react';
import { Entry, FundType, FundConfig, AppLanguage } from '../types';
import { DEFAULT_FUNDS, FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES, getFundConfig, getFundLabel } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats, downloadCSVReport, triggerHapticSound } from '../utils/khataCalculations';
import { getCategoryIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { GenericCard3D } from './GenericCard3D';
import { ChevronLeft, ChevronRight, Printer, Download, Save, Plus, Minus, Trash2, PieChart, Sparkles, Check, AlertCircle, TrendingUp, BarChart3, Wallet, Sliders, Tags, RotateCcw } from 'lucide-react';

interface ReportViewProps {
  entries: Entry[];
  categories: string[];
  percentages: Record<FundType, number>;
  funds?: FundConfig[];
  onUpdatePercentages: (newPct: Record<FundType, number>) => void;
  onAddCategory: (categoryName: string) => void;
  onRemoveCategory: (categoryName: string) => void;
  onTriggerPrint: (targetMonth: Date) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  entries,
  categories,
  percentages,
  funds,
  onUpdatePercentages,
  onAddCategory,
  onRemoveCategory,
  onTriggerPrint,
  language = 'en',
  privacyMask = false
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi';
  const activeFunds = funds && funds.length > 0 ? funds : DEFAULT_FUNDS;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [localPct, setLocalPct] = useState<Record<FundType, number>>({ ...percentages });
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [pctSuccessMsg, setPctSuccessMsg] = useState<string>('');
  const [pctErrorMsg, setPctErrorMsg] = useState<string>('');

  useEffect(() => {
    setLocalPct({ ...percentages });
  }, [percentages]);

  const fundTotals = calculateFundTotals(entries, activeFunds.map((f) => f.id));
  const grandTotal = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  const monthStats = calculatePeriodStats(entries, { type: 'month', targetDate: selectedDate });
  const monthTitle = selectedDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long', year: 'numeric' });

  // Handle Month Navigation
  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    triggerHapticSound('click');
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    triggerHapticSound('click');
  };

  // Calculate local percentage sum
  const pctSum: number = (Object.values(localPct) as number[]).reduce(
    (sum: number, val: number) => sum + (Number(val) || 0),
    0
  );
  const isPctValid = Math.abs(pctSum - 100) < 0.05;

  const handleSavePercentages = () => {
    if (!isPctValid) {
      setPctErrorMsg(
        isHindi
          ? `कुल प्रतिशत ठीक 100% होना चाहिए (वर्तमान: ${pctSum}%)`
          : `Total percentage sum must equal exactly 100% (currently ${pctSum}%).`
      );
      setTimeout(() => setPctErrorMsg(''), 3500);
      return;
    }
    setPctErrorMsg('');
    onUpdatePercentages(localPct);
    setPctSuccessMsg(isHindi ? 'फंड आवंटन नियम सफलतापूर्वक सेव हो गया!' : 'Fund split rule saved successfully!');
    triggerHapticSound('save');
    setTimeout(() => setPctSuccessMsg(''), 2500);
  };

  const handleResetToDefaultPercentages = () => {
    const defaultMap: Record<string, number> = {};
    activeFunds.forEach((f) => {
      defaultMap[f.id] = f.defaultPct || 0;
    });
    setLocalPct(defaultMap);
    onUpdatePercentages(defaultMap);
    setPctSuccessMsg(isHindi ? 'डिफ़ॉल्ट नियम रीसेट हो गया।' : 'Reset to default fund percentages.');
    triggerHapticSound('save');
    setTimeout(() => setPctSuccessMsg(''), 2500);
  };

  const handleApplyPreset = (preset: Record<FundType, number>) => {
    setLocalPct({ ...preset });
    triggerHapticSound('click');
  };

  const handleAdjustFundPct = (fundId: string, delta: number) => {
    const fundCfg = getFundConfig(fundId, activeFunds);
    const current = localPct[fundId] ?? fundCfg.defaultPct;
    const next = Math.max(0, Math.min(100, current + delta));
    setLocalPct({ ...localPct, [fundId]: next });
    triggerHapticSound('click');
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setNewCatInput('');
    triggerHapticSound('click');
  };

  // Categories sorted by expense
  const catEntries = Object.entries(monthStats.categoryExpenses).sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4 animate-in fade-in duration-200 text-left">
      {/* Month Navigator Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 sm:px-4 sm:py-2.5 shadow-sm gap-2 no-print min-w-0">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer shrink-0"
            style={{ color: 'var(--theme-primary, #38BDF8)' }}
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="font-serif-display font-bold text-[14px] sm:text-[16px] text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 sm:gap-2 truncate">
            <BarChart3 className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
            <span className="truncate">{monthTitle}</span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer shrink-0"
            style={{ color: 'var(--theme-primary, #38BDF8)' }}
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Export & Print Buttons */}
        <div className="flex items-center gap-1.5 justify-end shrink-0">
          <button
            onClick={() => downloadCSVReport(entries, selectedDate)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.reports?.exportCsv || 'Export CSV'}</span>
          </button>

          <button
            onClick={() => onTriggerPrint(selectedDate)}
            className="px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            style={{
              backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
              color: 'var(--theme-btn-text, #040D17)'
            }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.reports?.printStatement || 'Print Statement'}</span>
          </button>
        </div>
      </div>

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start w-full min-w-0">
        {/* Left Column (Monthly Overview + Category Breakdown) */}
        <div className="lg:col-span-6 space-y-4 w-full min-w-0">
          {/* Monthly Performance Stats Card */}
          <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3.5 min-w-0">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold flex items-center gap-1.5 truncate">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span className="truncate">Cashflow ({monthTitle})</span>
              </span>
              <span className="text-[11px] text-[#94A3B8] shrink-0 font-medium">
                {t.reports?.savingsRate || 'Savings'}: <strong style={{ color: 'var(--theme-primary, #38BDF8)' }}>{monthStats.savingsRate}%</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              <div className="bg-[var(--theme-bg,#070E18)] p-2 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] text-center min-w-0">
                <span className="text-[9.5px] sm:text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold truncate">{t.home?.thisMonthIncome || 'Income'}</span>
                <span className="font-serif-display text-[13px] sm:text-[16px] font-bold text-[#10B981] num block mt-0.5 truncate">
                  +{formatCurrency(monthStats.income, privacyMask)}
                </span>
              </div>

              <div className="bg-[var(--theme-bg,#070E18)] p-2 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] text-center min-w-0">
                <span className="text-[9.5px] sm:text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold truncate">{t.home?.thisMonthExpense || 'Expense'}</span>
                <span className="font-serif-display text-[13px] sm:text-[16px] font-bold text-[#EF4444] num block mt-0.5 truncate">
                  -{formatCurrency(monthStats.expense, privacyMask)}
                </span>
              </div>

              <div className="bg-[var(--theme-bg,#070E18)] p-2 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] text-center min-w-0">
                <span className="text-[9.5px] sm:text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold truncate">{t.home?.netSavings || 'Surplus'}</span>
                <span
                  className={`font-serif-display text-[13px] sm:text-[16px] font-bold num block mt-0.5 truncate ${
                    monthStats.net < 0 ? 'text-[#EF4444]' : 'text-[#10B981]'
                  }`}
                >
                  {formatCurrency(monthStats.net, privacyMask)}
                </span>
              </div>
            </div>

            {/* Savings Rate Progress Indicator */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-[#94A3B8]">
                <span>Financial Efficiency Score</span>
                <span className="font-mono font-bold text-[var(--theme-text,#F8FAFC)]">{monthStats.savingsRate}%</span>
              </div>
              <div className="w-full h-2 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden border border-[var(--theme-border,#213E61)]">
                <div
                  className="h-full bg-gradient-to-r from-[#EF4444] via-[#FFC700] to-[#10B981] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, monthStats.savingsRate))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Spending Breakdown */}
          <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3.5 min-w-0">
            <h3 className="font-serif-display text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 truncate">
                <PieChart className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span className="truncate">{t.reports?.topExpenseCategories || 'Category Spending'}</span>
              </span>
              <span className="text-[11px] font-sans text-[#94A3B8] shrink-0">{catEntries.length} categories</span>
            </h3>

            {catEntries.length === 0 ? (
              <div className="text-center text-[#94A3B8] py-8 text-[12.5px] border border-dashed border-[var(--theme-border,#213E61)] rounded-xl bg-[var(--theme-bg,#070E18)]/40">
                No expense transactions logged for {monthTitle}.
              </div>
            ) : (
              <div className="space-y-2.5">
                {catEntries.map(([cat, amt]) => {
                  const CategoryIcon = getCategoryIcon(cat);
                  const pctOfTotal = monthStats.expense > 0 ? Math.round((amt / monthStats.expense) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-[12px] sm:text-[12.5px] gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                          <div
                            className="w-6 h-6 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center shrink-0"
                            style={{ color: 'var(--theme-primary, #38BDF8)' }}
                          >
                            <CategoryIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[var(--theme-text,#F8FAFC)] font-medium truncate">{cat}</span>
                          <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">({pctOfTotal}%)</span>
                        </div>
                        <span className="font-mono font-bold text-[12.5px] sm:text-[13px] text-[#EF4444] shrink-0 ml-1">
                          -{formatCurrency(amt, privacyMask)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#EF4444] rounded-full transition-all duration-300"
                          style={{ width: `${pctOfTotal}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (All-Time Portfolio + Fund % Splitter + Category Manager) */}
        <div className="lg:col-span-6 space-y-4 w-full min-w-0">
          {/* Fund Totals Card (All-Time Portfolio) */}
          <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3 min-w-0">
            <h3 className="font-serif-display text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 truncate">
                <Wallet className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span className="truncate">Capital & Funds Portfolio</span>
              </span>
              <span
                className="text-[12px] sm:text-[13px] font-mono font-bold shrink-0"
                style={{ color: 'var(--theme-primary, #38BDF8)' }}
              >
                {formatCurrency(grandTotal, privacyMask)}
              </span>
            </h3>

            <div className="space-y-1.5 pt-1">
              {activeFunds.map((f) => {
                const val = fundTotals[f.id] ?? 0;
                const config = getFundConfig(f.id, activeFunds);
                const fundLabel = (language === 'hi' && f.labelHi)
                  ? f.labelHi
                  : (t.funds?.[f.id]?.name ? t.funds[f.id].name.split(' (')[0] : getFundLabel(f.id, activeFunds));
                return (
                  <div
                    key={f.id}
                    className="flex justify-between items-center text-[12px] sm:text-[13px] py-1 border-b border-[var(--theme-border,#213E61)] last:border-none gap-2 min-w-0"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                      <span className="text-[#94A3B8] font-medium truncate">{fundLabel}</span>
                    </div>
                    <span
                      className={`font-mono font-bold text-[12.5px] sm:text-[13.5px] shrink-0 ml-1 ${
                        val < 0 ? 'text-[#EF4444]' : 'text-[var(--theme-text,#F8FAFC)]'
                      }`}
                    >
                      {formatCurrency(val, privacyMask)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocation Percentages Settings (Split Rule) - Mobile Friendly & Responsive */}
          <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3.5 w-full min-w-0 overflow-hidden">
            {/* Header: Title + Sum Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-serif-display text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                  <Sliders className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                  <span className="truncate">{t.home?.allocationRule || 'Fund Allocation Rules'}</span>
                </h3>
                <p className="text-[11px] text-[#94A3B8] line-clamp-1 sm:line-clamp-none mt-0.5">
                  {isHindi
                    ? 'आय दर्ज करने पर फंड्स में ऑटो-विभाजन का प्रतिशत नियम'
                    : 'Custom split applied automatically whenever income is split across all funds.'}
                </p>
              </div>

              <div
                className={`text-[11.5px] font-bold px-2.5 py-1 rounded-lg font-mono shrink-0 flex items-center gap-1.5 ${
                  isPctValid
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                    : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                }`}
              >
                <span>{isHindi ? 'कुल योग' : 'Sum'}:</span>
                <span className="font-extrabold">{pctSum}%</span>
                {isPctValid ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : null}
              </div>
            </div>

            {/* Visual Multi-Fund Allocation Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden flex border border-[var(--theme-border,#213E61)]">
                {activeFunds.map((f) => {
                  const config = getFundConfig(f.id, activeFunds);
                  const pct = localPct[f.id] ?? config.defaultPct;
                  const fundLabel = (language === 'hi' && f.labelHi)
                    ? f.labelHi
                    : (t.funds?.[f.id]?.name ? t.funds[f.id].name.split(' (')[0] : getFundLabel(f.id, activeFunds));
                  if (pct <= 0) return null;
                  return (
                    <div
                      key={f.id}
                      className="h-full transition-all duration-300 relative group"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: config.color
                      }}
                      title={`${fundLabel}: ${pct}%`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[9.5px] sm:text-[10px] text-[#64748B] font-mono">
                <span>0%</span>
                <span className={isPctValid ? 'text-[#10B981] font-bold' : 'text-[#EF4444] font-bold'}>
                  {pctSum}% / 100%
                </span>
              </div>
            </div>

            {/* Fund Percentage Inputs Grid: 1 col on mobile, 2 col on tablet/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full min-w-0">
              {activeFunds.map((f) => {
                const config = getFundConfig(f.id, activeFunds);
                const fundLabel = (language === 'hi' && f.labelHi)
                  ? f.labelHi
                  : (t.funds?.[f.id]?.name ? t.funds[f.id].name.split(' (')[0] : getFundLabel(f.id, activeFunds));
                const currentPct = localPct[f.id] ?? config.defaultPct;

                return (
                  <div
                    key={f.id}
                    className="bg-[var(--theme-bg,#070E18)] p-2.5 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2 min-w-0 shadow-2xs hover:border-[var(--theme-primary,#38BDF8)]/40 transition-colors"
                  >
                    {/* Fund Label + Color Dot */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="text-[12.5px] sm:text-[13px] text-[var(--theme-text,#F8FAFC)] font-medium truncate">
                        {fundLabel}
                      </span>
                    </div>

                    {/* Stepper + Input Box */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAdjustFundPct(f.id, -5)}
                        className="w-6 h-6 rounded-md bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)] flex items-center justify-center cursor-pointer transition-colors active:scale-95 text-xs font-bold"
                        title="-5%"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentPct}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                            setLocalPct({ ...localPct, [f.id]: val });
                          }}
                          className="w-11 sm:w-12 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-center font-bold text-[13px] rounded-lg py-1 text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                        />
                        <span className="text-[10.5px] text-[#64748B] ml-1 font-mono">%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdjustFundPct(f.id, 5)}
                        className="w-6 h-6 rounded-md bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)] flex items-center justify-center cursor-pointer transition-colors active:scale-95 text-xs font-bold"
                        title="+5%"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error / Warning Alert */}
            {pctErrorMsg ? (
              <div className="text-[12px] text-[#EF4444] bg-[#EF4444]/10 p-2.5 rounded-xl border border-[#EF4444]/30 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{pctErrorMsg}</span>
              </div>
            ) : !isPctValid ? (
              <div className="text-[11.5px] text-amber-400 bg-amber-500/10 p-2 sm:p-2.5 rounded-xl border border-amber-500/25 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>
                  {isHindi
                    ? `योग 100% होना चाहिए (${pctSum > 100 ? `+${pctSum - 100}% घटाएं` : `${100 - pctSum}% और जोड़ें`})`
                    : `Sum must be 100% (${pctSum > 100 ? `reduce by ${pctSum - 100}%` : `add ${100 - pctSum}%`})`}
                </span>
              </div>
            ) : null}

            {/* Success Alert */}
            {pctSuccessMsg && (
              <div className="text-[12px] text-[#10B981] bg-[#10B981]/10 p-2.5 rounded-xl border border-[#10B981]/30 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span>{pctSuccessMsg}</span>
              </div>
            )}

            {/* Quick Action Buttons (Save & Reset) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 w-full">
              <button
                type="button"
                onClick={handleSavePercentages}
                disabled={!isPctValid}
                className="flex-1 py-2.5 px-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[12.5px] sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
                  color: 'var(--theme-btn-text, #040D17)'
                }}
              >
                <Save className="w-4 h-4" />
                <span>{t.settings?.saveRuleBtn || 'Save Allocations'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefaultPercentages}
                className="py-2.5 px-3.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)] text-[11.5px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.settings?.resetRuleBtn || 'Reset Default (50-20-10-10-5-5)'}</span>
              </button>
            </div>
          </div>

          {/* Custom Category Manager */}
          <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3 min-w-0">
            <h3 className="font-serif-display text-[14px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 truncate">
                <Tags className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span className="truncate">Expense Categories Manager</span>
              </span>
              <span className="text-[11px] text-[#94A3B8] shrink-0">{categories.length} Active</span>
            </h3>

            {/* Add Category Input */}
            <form onSubmit={handleAddNewCategory} className="flex gap-2 min-w-0">
              <input
                type="text"
                placeholder={isHindi ? 'नई श्रेणी का नाम...' : 'New Category Name...'}
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                className="flex-1 min-w-0 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[12.5px] rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
              <button
                type="submit"
                className="py-2 px-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[12px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                style={{ color: 'var(--theme-primary, #38BDF8)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? 'जोड़ें' : 'Add'}</span>
              </button>
            </form>

            {/* Category Chips with Delete */}
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto min-w-0">
              {categories.map((cat) => {
                const CatIcon = getCategoryIcon(cat);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 bg-[var(--theme-bg,#070E18)] text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)] border border-[var(--theme-border,#213E61)] px-2.5 py-1 rounded-lg text-[11px] transition-colors max-w-full"
                  >
                    <CatIcon className="w-3 h-3 shrink-0" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                    <span className="truncate">{cat}</span>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveCategory(cat)}
                        className="text-[#64748B] hover:text-[#EF4444] ml-0.5 cursor-pointer shrink-0"
                        title={`Remove ${cat}`}
                      >
                        ×
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
