import React, { useState } from 'react';
import { Entry, FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats, downloadCSVReport, triggerHapticSound } from '../utils/khataCalculations';
import { getCategoryIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { ChevronLeft, ChevronRight, Printer, Download, Save, Plus, Trash2, PieChart, Sparkles, Check, AlertCircle, TrendingUp, BarChart3, Wallet, Sliders, Tags } from 'lucide-react';

interface ReportViewProps {
  entries: Entry[];
  categories: string[];
  percentages: Record<FundType, number>;
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
  onUpdatePercentages,
  onAddCategory,
  onRemoveCategory,
  onTriggerPrint,
  language = 'en',
  privacyMask = false
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [localPct, setLocalPct] = useState<Record<FundType, number>>({ ...percentages });
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [pctSuccessMsg, setPctSuccessMsg] = useState<string>('');
  const [pctErrorMsg, setPctErrorMsg] = useState<string>('');

  const fundTotals = calculateFundTotals(entries);
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
      setPctErrorMsg(language === 'hi' ? 'कुल प्रतिशत ठीक 100% होना चाहिए।' : 'Total percentage sum must equal exactly 100%.');
      setTimeout(() => setPctErrorMsg(''), 3000);
      return;
    }
    setPctErrorMsg('');
    onUpdatePercentages(localPct);
    setPctSuccessMsg(language === 'hi' ? 'फंड आवंटन प्रतिशत सफलतापूर्वक सेव हो गया!' : 'Fund allocation percentages saved successfully!');
    triggerHapticSound('save');
    setTimeout(() => setPctSuccessMsg(''), 2500);
  };

  const handleResetToDefaultPercentages = () => {
    setLocalPct({ ...DEFAULT_PERCENTAGES });
    onUpdatePercentages(DEFAULT_PERCENTAGES);
    setPctSuccessMsg(language === 'hi' ? 'डिफ़ॉल्ट 50-20-10-10-5-5 नियम रीसेट हो गया।' : 'Reset to standard 50-20-10-10-5-5 rule.');
    triggerHapticSound('save');
    setTimeout(() => setPctSuccessMsg(''), 2500);
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
    <div className="w-full space-y-4 animate-in fade-in duration-200 text-left">
      {/* Month Navigator Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5 sm:px-4 sm:py-2.5 shadow-sm gap-2 no-print">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
            style={{ color: 'var(--theme-primary, #38BDF8)' }}
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="font-serif-display font-bold text-[15px] sm:text-[16px] text-[#F8FAFC] flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
            <span>{monthTitle}</span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
            style={{ color: 'var(--theme-primary, #38BDF8)' }}
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Export & Print Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => downloadCSVReport(entries, selectedDate)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] hover:text-[var(--theme-primary,#38BDF8)] text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.reports?.exportCsv || 'Export CSV'}</span>
          </button>

          <button
            onClick={() => onTriggerPrint(selectedDate)}
            className="px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column (Monthly Overview + Category Breakdown) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Monthly Performance Stats Card */}
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span>Monthly Cashflow ({monthTitle})</span>
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {t.reports?.savingsRate || 'Savings Rate'}: <strong style={{ color: 'var(--theme-primary, #38BDF8)' }}>{monthStats.savingsRate}%</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              <div className="bg-[var(--theme-bg,#070E18)] p-2.5 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] text-center">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold">{t.home?.thisMonthIncome || 'Income'}</span>
                <span className="font-serif-display text-[14.5px] sm:text-[16.5px] font-bold text-[#10B981] num block mt-0.5 truncate">
                  +{formatCurrency(monthStats.income, privacyMask)}
                </span>
              </div>

              <div className="bg-[var(--theme-bg,#070E18)] p-2.5 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] text-center">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold">{t.home?.thisMonthExpense || 'Expense'}</span>
                <span className="font-serif-display text-[14.5px] sm:text-[16.5px] font-bold text-[#EF4444] num block mt-0.5 truncate">
                  -{formatCurrency(monthStats.expense, privacyMask)}
                </span>
              </div>

              <div className="bg-[var(--theme-bg,#070E18)] p-2.5 sm:p-3 rounded-xl border border-[var(--theme-border,#213E61)] text-center">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold">{t.home?.netSavings || 'Net Surplus'}</span>
                <span
                  className={`font-serif-display text-[14.5px] sm:text-[16.5px] font-bold num block mt-0.5 truncate ${
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
                <span className="font-mono font-bold text-[#F8FAFC]">{monthStats.savingsRate}%</span>
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
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5">
            <h3 className="font-serif-display text-[14.5px] sm:text-[15px] font-bold text-[#F8FAFC] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PieChart className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span>{t.reports?.topExpenseCategories || 'Category Spending'}</span>
              </span>
              <span className="text-[11px] font-sans text-[#94A3B8]">{catEntries.length} categories</span>
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
                      <div className="flex justify-between items-center text-[12.5px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-6 h-6 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center shrink-0"
                            style={{ color: 'var(--theme-primary, #38BDF8)' }}
                          >
                            <CategoryIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[#F8FAFC] font-medium truncate">{cat}</span>
                          <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">({pctOfTotal}%)</span>
                        </div>
                        <span className="font-serif-display font-bold text-[#EF4444] num shrink-0 ml-2">
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
        <div className="lg:col-span-6 space-y-4">
          {/* Fund Totals Card (All-Time Portfolio) */}
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
            <h3 className="font-serif-display text-[14.5px] sm:text-[15px] font-bold text-[#F8FAFC] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span>6-Fund Total Portfolio</span>
              </span>
              <span
                className="text-[11px] font-sans font-bold font-mono"
                style={{ color: 'var(--theme-primary, #38BDF8)' }}
              >
                {formatCurrency(grandTotal, privacyMask)}
              </span>
            </h3>

            <div className="space-y-2 pt-1">
              {FUND_ORDER.map((f) => {
                const val = fundTotals[f] ?? 0;
                const config = FUND_CONFIGS[f];
                const fundLabel = t.funds?.[f]?.name ? t.funds[f].name.split(' (')[0] : FUND_LABELS[f];
                return (
                  <div
                    key={f}
                    className="flex justify-between items-center text-[12.5px] sm:text-[13px] py-1 border-b border-[var(--theme-border,#213E61)] last:border-none"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                      <span className="text-[#94A3B8] font-medium truncate">{fundLabel}</span>
                    </div>
                    <span
                      className={`font-serif-display font-bold num shrink-0 ml-2 ${
                        val < 0 ? 'text-[#EF4444]' : 'text-[#F8FAFC]'
                      }`}
                    >
                      {formatCurrency(val, privacyMask)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocation Percentages Settings */}
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="font-serif-display text-[14.5px] sm:text-[15px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Sliders className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                  <span>{t.home?.allocationRule || 'Fund Allocation Rules'}</span>
                </h3>
                <p className="text-[11px] text-[#94A3B8]">
                  Custom split applied automatically whenever income is recorded.
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md font-mono shrink-0 ${
                  isPctValid
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                    : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                }`}
              >
                Sum: {pctSum}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {FUND_ORDER.map((f) => {
                const config = FUND_CONFIGS[f];
                const fundLabel = t.funds?.[f]?.name ? t.funds[f].name.split(' (')[0] : FUND_LABELS[f];
                return (
                  <div key={f} className="bg-[var(--theme-bg,#070E18)] p-2.5 rounded-xl border border-[var(--theme-border,#213E61)] flex items-center justify-between">
                    <span className="text-[12px] text-[#94A3B8] font-medium truncate pr-1">
                      {fundLabel}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={localPct[f] ?? config.defaultPct}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          setLocalPct({ ...localPct, [f]: val });
                        }}
                        className="w-12 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-center font-bold text-[13px] rounded-lg py-1 focus:outline-none"
                        style={{ color: 'var(--theme-primary, #38BDF8)' }}
                      />
                      <span className="text-[11px] text-[#64748B]">%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {pctErrorMsg && (
              <div className="text-[12px] text-[#EF4444] bg-[#EF4444]/10 p-2.5 rounded-xl border border-[#EF4444]/30 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pctErrorMsg}</span>
              </div>
            )}

            {pctSuccessMsg && (
              <div className="text-[12px] text-[#10B981] bg-[#10B981]/10 p-2.5 rounded-xl border border-[#10B981]/30 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{pctSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSavePercentages}
                disabled={!isPctValid}
                className="flex-1 py-2.5 px-3 rounded-xl disabled:opacity-50 font-bold text-[12.5px] sm:text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
                  color: 'var(--theme-btn-text, #040D17)'
                }}
              >
                <Save className="w-4 h-4" />
                <span>{t.settings?.saveRuleBtn || 'Save Allocations'}</span>
              </button>

              <button
                onClick={handleResetToDefaultPercentages}
                className="py-2.5 px-3 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[#F8FAFC] text-[11.5px] font-semibold cursor-pointer shrink-0"
              >
                {t.settings?.resetRuleBtn || 'Reset to Default'}
              </button>
            </div>
          </div>

          {/* Custom Category Manager */}
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
            <h3 className="font-serif-display text-[14.5px] sm:text-[15px] font-bold text-[#F8FAFC] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Tags className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                <span>Expense Categories Manager</span>
              </span>
              <span className="text-[11px] text-[#94A3B8]">{categories.length} Active</span>
            </h3>

            {/* Add Category Input */}
            <form onSubmit={handleAddNewCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="New Category Name..."
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[12.5px] rounded-xl px-3 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="py-2 px-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[12px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                style={{ color: 'var(--theme-primary, #38BDF8)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Category Chips with Delete */}
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto">
              {categories.map((cat) => {
                const CatIcon = getCategoryIcon(cat);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 bg-[var(--theme-bg,#070E18)] text-[#94A3B8] hover:text-[#F8FAFC] border border-[var(--theme-border,#213E61)] px-2.5 py-1 rounded-lg text-[11px] transition-colors"
                  >
                    <CatIcon className="w-3 h-3" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
                    <span>{cat}</span>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveCategory(cat)}
                        className="text-[#64748B] hover:text-[#EF4444] ml-0.5 cursor-pointer"
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
