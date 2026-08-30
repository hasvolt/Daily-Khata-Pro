import React, { useState } from 'react';
import {
  X,
  Calculator,
  Layers,
  TrendingUp,
  Landmark,
  Percent,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  Sparkles,
  Info,
  DollarSign,
  Receipt,
  PiggyBank,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { TRANSLATIONS } from '../utils/translations';

type CalculatorTab = 'standard' | 'funds' | 'sip' | 'emi' | 'gst';

interface MultiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentages?: Record<FundType, number>;
  onApplyToIncome?: (amount: number) => void;
  onApplyToExpense?: (amount: number) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

interface CalcHistoryItem {
  expr: string;
  res: string;
  time: string;
}

// Safe math evaluator for standard arithmetic calculator
function safeEvaluate(expr: string): { result: number | null; error: string | null } {
  try {
    // Sanitize expression: allow only digits, operators, parens, decimal, %, spaces
    const sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/%/g, '/100');

    if (!/^[\d\s+\-*/.()]+$/.test(sanitized)) {
      return { result: null, error: 'Invalid characters' };
    }

    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${sanitized})`)();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      // Round to maximum 6 decimal places to avoid floating point precision quirks
      return { result: Math.round(val * 1000000) / 1000000, error: null };
    }
    return { result: null, error: 'Math Error' };
  } catch (err) {
    return { result: null, error: 'Invalid Expression' };
  }
}

export const MultiCalculatorModal: React.FC<MultiCalculatorModalProps> = ({
  isOpen,
  onClose,
  percentages = DEFAULT_PERCENTAGES,
  onApplyToIncome,
  onApplyToExpense,
  language = 'en',
  privacyMask = false
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('standard');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi';

  // --- 1. Standard Calculator State ---
  const [stdExpr, setStdExpr] = useState<string>('');
  const [stdResult, setStdResult] = useState<string>('0');
  const [calcHistory, setCalcHistory] = useState<CalcHistoryItem[]>([]);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);
  const [memoryVal, setMemoryVal] = useState<number>(0);

  // --- 2. 6-Fund Split State ---
  const [fundAmountInput, setFundAmountInput] = useState<string>('50000');
  const [fundCustomPct, setFundCustomPct] = useState<Record<FundType, number>>(percentages);
  const [showFundPctSliders, setShowFundPctSliders] = useState<boolean>(false);

  // --- 3. SIP & Compound State ---
  const [sipMode, setSipMode] = useState<'sip' | 'lumpsum'>('sip');
  const [sipMonthlyAmt, setSipMonthlyAmt] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipTenureYears, setSipTenureYears] = useState<number>(10);

  // --- 4. Loan EMI State ---
  const [loanPrincipal, setLoanPrincipal] = useState<number>(500000);
  const [loanRate, setLoanRate] = useState<number>(9.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // --- 5. GST / Discount State ---
  const [gstSubTab, setGstSubTab] = useState<'gst' | 'discount'>('gst');
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstSlab, setGstSlab] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const [discOriginalPrice, setDiscOriginalPrice] = useState<number>(2000);
  const [discPercent, setDiscPercent] = useState<number>(20);

  if (!isOpen) return null;

  // --- Handlers for Standard Calculator ---
  const handleKeypadPress = (val: string) => {
    triggerHapticSound('click');
    if (val === 'C') {
      setStdExpr('');
      setStdResult('0');
      return;
    }
    if (val === '⌫') {
      const next = stdExpr.slice(0, -1);
      setStdExpr(next);
      if (next.trim()) {
        const evalRes = safeEvaluate(next);
        if (evalRes.result !== null) setStdResult(evalRes.result.toString());
      } else {
        setStdResult('0');
      }
      return;
    }
    if (val === '=') {
      if (!stdExpr.trim()) return;
      const evalRes = safeEvaluate(stdExpr);
      if (evalRes.result !== null) {
        const finalRes = evalRes.result.toString();
        setCalcHistory((prev) => [
          { expr: stdExpr, res: finalRes, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...prev.slice(0, 7)
        ]);
        setStdExpr(finalRes);
        setStdResult(finalRes);
      }
      return;
    }

    const nextExpr = stdExpr + val;
    setStdExpr(nextExpr);
    const evalRes = safeEvaluate(nextExpr);
    if (evalRes.result !== null) {
      setStdResult(evalRes.result.toString());
    }
  };

  const handleCopyResult = (valToCopy: string) => {
    if (!valToCopy) return;
    navigator.clipboard.writeText(valToCopy);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 1800);
  };

  // --- Calculations for 6-Fund Split ---
  const fundInflowNum = parseFloat(fundAmountInput) || 0;
  const totalFundPct = (Object.values(fundCustomPct) as number[]).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const isFund100 = Math.abs(totalFundPct - 100) < 0.01;

  const fundSplits: Record<FundType, number> = FUND_ORDER.reduce((acc, fund) => {
    const pct = fundCustomPct[fund] || 0;
    acc[fund] = (fundInflowNum * pct) / 100;
    return acc;
  }, {} as Record<FundType, number>);

  // --- Calculations for SIP / Wealth ---
  let sipInvested = 0;
  let sipTotalValue = 0;
  let sipGain = 0;

  if (sipMode === 'sip') {
    const months = sipTenureYears * 12;
    const monthlyRate = sipRate / 100 / 12;
    sipInvested = sipMonthlyAmt * months;
    if (monthlyRate > 0) {
      sipTotalValue =
        sipMonthlyAmt *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
    } else {
      sipTotalValue = sipInvested;
    }
    sipGain = Math.max(0, sipTotalValue - sipInvested);
  } else {
    sipInvested = sipMonthlyAmt;
    sipTotalValue = sipMonthlyAmt * Math.pow(1 + sipRate / 100, sipTenureYears);
    sipGain = Math.max(0, sipTotalValue - sipInvested);
  }

  // --- Calculations for EMI ---
  const loanMonths = loanTenureYears * 12;
  const loanMonthlyRate = loanRate / 100 / 12;
  let monthlyEmi = 0;
  let totalLoanPayment = 0;
  let totalLoanInterest = 0;

  if (loanPrincipal > 0 && loanMonths > 0) {
    if (loanMonthlyRate > 0) {
      monthlyEmi =
        (loanPrincipal * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonths)) /
        (Math.pow(1 + loanMonthlyRate, loanMonths) - 1);
    } else {
      monthlyEmi = loanPrincipal / loanMonths;
    }
    totalLoanPayment = monthlyEmi * loanMonths;
    totalLoanInterest = Math.max(0, totalLoanPayment - loanPrincipal);
  }

  // --- Calculations for GST & Discount ---
  let gstBase = 0;
  let gstTotalTax = 0;
  let gstCgst = 0;
  let gstSgst = 0;
  let gstFinalGross = 0;

  if (gstType === 'exclusive') {
    gstBase = gstAmount;
    gstTotalTax = (gstAmount * gstSlab) / 100;
    gstCgst = gstTotalTax / 2;
    gstSgst = gstTotalTax / 2;
    gstFinalGross = gstBase + gstTotalTax;
  } else {
    gstFinalGross = gstAmount;
    gstBase = (gstAmount * 100) / (100 + gstSlab);
    gstTotalTax = gstFinalGross - gstBase;
    gstCgst = gstTotalTax / 2;
    gstSgst = gstTotalTax / 2;
  }

  const discSaved = (discOriginalPrice * discPercent) / 100;
  const discFinal = Math.max(0, discOriginalPrice - discSaved);

  const tabs: { id: CalculatorTab; label: string; icon: any; color: string }[] = [
    { id: 'standard', label: isHindi ? 'साधारण गणित' : 'Standard', icon: Calculator, color: '#38BDF8' },
    { id: 'funds', label: isHindi ? '6-फंड फॉर्मूला' : '6-Fund Split', icon: Layers, color: '#10B981' },
    { id: 'sip', label: isHindi ? 'SIP / वेल्थ' : 'SIP & Wealth', icon: TrendingUp, color: '#F59E0B' },
    { id: 'emi', label: isHindi ? 'लोन EMI' : 'Loan EMI', icon: Landmark, color: '#8B5CF6' },
    { id: 'gst', label: isHindi ? 'GST एवं छूट' : 'GST & Discount', icon: Percent, color: '#EC4899' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 no-print text-left">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[var(--theme-border,#213E61)] flex justify-between items-center bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.35))] flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[17px] sm:text-[18px] font-bold text-[#F8FAFC]">
                  {isHindi ? 'मल्टीपर्पस कैलकुलेटर' : 'Multi-Purpose Calculator'}
                </h2>
                <span className="text-[10px] font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] px-2 py-0.5 rounded-md border border-[var(--theme-primary,#38BDF8)]/30 uppercase tracking-wider">
                  Pro Tools
                </span>
              </div>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'दैनिक खर्च, 6-फंड आवंटन, SIP वेल्थ और लोन ईएमआई' : 'Arithmetic, 6-Fund Formula, SIP Wealth & Loan EMI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Tabs */}
        <div className="bg-[var(--theme-bg,#070E18)] border-b border-[var(--theme-border,#213E61)] px-2 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  triggerHapticSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-md font-extrabold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-[var(--theme-surface,#0E1A29)]/50">
          
          {/* ========================================================= */}
          {/* TAB 1: Standard / Arithmetic Keypad Calculator */}
          {/* ========================================================= */}
          {activeTab === 'standard' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Display Screen */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] shadow-inner space-y-1 text-right">
                <div className="text-[13px] font-mono text-[#94A3B8] h-5 overflow-x-auto whitespace-nowrap">
                  {stdExpr || '0'}
                </div>
                <div className="text-[28px] sm:text-[32px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] tracking-tight truncate">
                  {privacyMask ? '₹ ****' : `₹ ${Number(stdResult || 0).toLocaleString('en-IN')}`}
                </div>
              </div>

              {/* Memory & Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono font-bold">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setMemoryVal(0);
                      triggerHapticSound('click');
                    }}
                    className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-bg,#070E18)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    MC
                  </button>
                  <button
                    onClick={() => {
                      handleKeypadPress(memoryVal.toString());
                      triggerHapticSound('click');
                    }}
                    className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-bg,#070E18)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    MR ({memoryVal})
                  </button>
                  <button
                    onClick={() => {
                      const cur = parseFloat(stdResult) || 0;
                      setMemoryVal((prev) => prev + cur);
                      triggerHapticSound('click');
                    }}
                    className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-bg,#070E18)] text-[#10B981] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    M+
                  </button>
                  <button
                    onClick={() => {
                      const cur = parseFloat(stdResult) || 0;
                      setMemoryVal((prev) => prev - cur);
                      triggerHapticSound('click');
                    }}
                    className="px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-bg,#070E18)] text-[#EF4444] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    M-
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyResult(stdResult)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[#CBD5E1] border border-[var(--theme-border,#213E61)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedResult ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedResult ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'C', val: 'C', cls: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/25' },
                  { label: '⌫', val: '⌫', cls: 'bg-[var(--theme-card,#132438)] text-[#F59E0B] border-[var(--theme-border,#213E61)]' },
                  { label: '%', val: '%', cls: 'bg-[var(--theme-card,#132438)] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-border,#213E61)]' },
                  { label: '÷', val: '/', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.3))] font-bold' },

                  { label: '7', val: '7' },
                  { label: '8', val: '8' },
                  { label: '9', val: '9' },
                  { label: '×', val: '*', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.3))] font-bold' },

                  { label: '4', val: '4' },
                  { label: '5', val: '5' },
                  { label: '6', val: '6' },
                  { label: '−', val: '-', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.3))] font-bold' },

                  { label: '1', val: '1' },
                  { label: '2', val: '2' },
                  { label: '3', val: '3' },
                  { label: '+', val: '+', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.3))] font-bold' },

                  { label: '0', val: '0' },
                  { label: '00', val: '00' },
                  { label: '.', val: '.' },
                  { label: '=', val: '=', cls: 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold shadow-md border-transparent hover:brightness-110' }
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleKeypadPress(btn.val)}
                    className={`h-12 rounded-xl text-[16px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs border ${
                      btn.cls ||
                      'bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Direct Send To Inflow / Outflow Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const num = parseFloat(stdResult) || 0;
                    if (onApplyToIncome && num > 0) {
                      onApplyToIncome(num);
                      onClose();
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 hover:border-[#10B981] text-[#10B981] font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isHindi ? 'आय में भेजें (+)' : 'Send to Income (+)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const num = parseFloat(stdResult) || 0;
                    if (onApplyToExpense && num > 0) {
                      onApplyToExpense(num);
                      onClose();
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 hover:border-[#EF4444] text-[#EF4444] font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>{isHindi ? 'खर्च में भेजें (-)' : 'Send to Expense (-)'}</span>
                </button>
              </div>

              {/* Recent Calculation Tape */}
              {calcHistory.length > 0 && (
                <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                    <span>{isHindi ? 'हालिया हिसाब-किताब (History)' : 'Recent History Tape'}</span>
                    <button
                      onClick={() => setCalcHistory([])}
                      className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                    {calcHistory.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setStdExpr(item.res);
                          setStdResult(item.res);
                          triggerHapticSound('click');
                        }}
                        className="flex items-center justify-between text-[12px] font-mono text-[#CBD5E1] p-1 rounded hover:bg-[var(--theme-card,#132438)] cursor-pointer"
                      >
                        <span className="text-[#94A3B8] truncate">{item.expr}</span>
                        <span className="font-bold text-[var(--theme-primary,#38BDF8)] shrink-0">= ₹{item.res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 6-Fund Formula Allocation Engine */}
          {/* ========================================================= */}
          {activeTab === 'funds' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Income Inflow Input */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#CBD5E1] block">
                  {isHindi ? 'प्राप्त कुल आय (Total Inflow Amount):' : 'Total Income Inflow Amount:'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={fundAmountInput}
                    onChange={(e) => setFundAmountInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold rounded-xl pl-9 pr-3 py-2.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none transition-all"
                    placeholder="50000"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[10000, 25000, 50000, 100000, 250000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setFundAmountInput(amt.toString());
                        triggerHapticSound('click');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[11px] font-mono text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      ₹{(amt / 1000).toLocaleString('en-IN')}k
                    </button>
                  ))}
                </div>
              </div>

              {/* 6-Fund Results Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px] font-bold text-[#94A3B8]">
                  <span>{isHindi ? '6-फंड विभाजन (Automatic Breakdown)' : '6-Fund Mathematical Allocation'}</span>
                  <button
                    type="button"
                    onClick={() => setShowFundPctSliders(!showFundPctSliders)}
                    className="text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>{showFundPctSliders ? 'Hide Sliders' : 'Customize %'}</span>
                  </button>
                </div>

                {/* Fund percentage sliders (Collapsible) */}
                {showFundPctSliders && (
                  <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-[#CBD5E1]">Adjust Fund Weights:</span>
                      <span className={`font-mono font-bold ${isFund100 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        Total: {totalFundPct}% {isFund100 ? '✓' : '(Must equal 100%)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FUND_ORDER.map((f) => (
                        <div key={f} className="space-y-1">
                          <div className="flex justify-between text-[10px] text-[#94A3B8]">
                            <span>{FUND_LABELS[f]}</span>
                            <span className="font-mono font-bold text-[#F8FAFC]">{fundCustomPct[f]}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={fundCustomPct[f]}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setFundCustomPct((prev) => ({ ...prev, [f]: val }));
                            }}
                            className="w-full h-1 bg-[var(--theme-border,#213E61)] rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FUND_ORDER.map((fund) => {
                    const cfg = FUND_CONFIGS[fund];
                    const allocatedAmt = fundSplits[fund] || 0;
                    const pct = fundCustomPct[fund] || 0;

                    return (
                      <div
                        key={fund}
                        className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-[#F8FAFC] truncate">
                              {FUND_LABELS[fund]}
                            </div>
                            <div className="text-[10px] text-[#94A3B8] font-mono">
                              {pct}% Allocation
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[14px] font-mono font-bold text-[#F8FAFC]">
                            {privacyMask ? '₹ ****' : formatCurrency(allocatedAmt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Record Inflow Action Button */}
              {onApplyToIncome && (
                <button
                  type="button"
                  onClick={() => {
                    if (fundInflowNum > 0) {
                      onApplyToIncome(fundInflowNum);
                      onClose();
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-bold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {isHindi
                      ? `इस ₹${fundInflowNum.toLocaleString('en-IN')} को आय के रूप में दर्ज करें`
                      : `Record ₹${fundInflowNum.toLocaleString('en-IN')} as Income Inflow`}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SIP & Wealth Compound Growth Planner */}
          {/* ========================================================= */}
          {activeTab === 'sip' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Mode Toggle */}
              <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-1">
                <button
                  type="button"
                  onClick={() => setSipMode('sip')}
                  className={`flex-1 py-1.5 text-center text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    sipMode === 'sip'
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {isHindi ? 'मासिक SIP (Monthly)' : 'Monthly SIP'}
                </button>
                <button
                  type="button"
                  onClick={() => setSipMode('lumpsum')}
                  className={`flex-1 py-1.5 text-center text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    sipMode === 'lumpsum'
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {isHindi ? 'एकमुश्त निवेश (Lumpsum)' : 'One-Time Lumpsum'}
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-[#CBD5E1]">
                      {sipMode === 'sip' ? (isHindi ? 'मासिक निवेश:' : 'Monthly Investment:') : (isHindi ? 'एकमुश्त राशि:' : 'Total Investment:')}
                    </span>
                    <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                      ₹{sipMonthlyAmt.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={sipMonthlyAmt}
                    onChange={(e) => setSipMonthlyAmt(parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-[#CBD5E1]">{isHindi ? 'अपेक्षित वार्षिक रिटर्न (% p.a.):' : 'Expected Return Rate (% p.a.):'}</span>
                    <span className="font-mono font-bold text-[#10B981]">{sipRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={sipRate}
                    onChange={(e) => setSipRate(parseFloat(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                  />
                  {/* Benchmarks */}
                  <div className="flex gap-1.5 pt-0.5">
                    {[
                      { l: '8% (FD/Gold)', v: 8 },
                      { l: '12% (Nifty Index)', v: 12 },
                      { l: '15% (Mutual Fund)', v: 15 },
                      { l: '18% (Aggressive)', v: 18 }
                    ].map((b) => (
                      <button
                        key={b.v}
                        onClick={() => setSipRate(b.v)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          sipRate === b.v ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]' : 'border-[var(--theme-border,#213E61)] text-[#94A3B8]'
                        }`}
                      >
                        {b.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-[#CBD5E1]">{isHindi ? 'समय अवधि (Years):' : 'Time Horizon (Years):'}</span>
                    <span className="font-mono font-bold text-[#F59E0B]">{sipTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="35"
                    step="1"
                    value={sipTenureYears}
                    onChange={(e) => setSipTenureYears(parseInt(e.target.value) || 1)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                  />
                </div>
              </div>

              {/* Summary Dashboard Card */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3 shadow-inner">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[10px] text-[#94A3B8] font-bold">{isHindi ? 'कुल जमा राशि' : 'Total Invested'}</div>
                    <div className="text-[13px] font-mono font-bold text-[#F8FAFC] mt-0.5">
                      ₹{Math.round(sipInvested).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[10px] text-[#10B981] font-bold">{isHindi ? 'अनुमानित मुनाफा' : 'Est. Wealth Gain'}</div>
                    <div className="text-[13px] font-mono font-bold text-[#10B981] mt-0.5">
                      +₹{Math.round(sipGain).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[10px] text-[var(--theme-primary,#38BDF8)] font-bold">{isHindi ? 'कुल संपत्ति मूल्य' : 'Total Corpus Value'}</div>
                    <div className="text-[13px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                      ₹{Math.round(sipTotalValue).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Progress Ratio Bar */}
                <div className="space-y-1 pt-1">
                  <div className="h-3 w-full bg-[var(--theme-card,#132438)] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${sipTotalValue > 0 ? (sipInvested / sipTotalValue) * 100 : 50}%` }}
                      className="bg-[#38BDF8] h-full"
                      title="Invested Amount"
                    />
                    <div
                      style={{ width: `${sipTotalValue > 0 ? (sipGain / sipTotalValue) * 100 : 50}%` }}
                      className="bg-[#10B981] h-full"
                      title="Wealth Gain"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Invested (
                      {sipTotalValue > 0 ? Math.round((sipInvested / sipTotalValue) * 100) : 0}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Gain (
                      {sipTotalValue > 0 ? Math.round((sipGain / sipTotalValue) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: Loan EMI & Interest Calculator */}
          {/* ========================================================= */}
          {activeTab === 'emi' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-[#CBD5E1]">{isHindi ? 'लोन मूलधन (Principal Amount):' : 'Loan Principal Amount:'}</span>
                    <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                      ₹{loanPrincipal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-[#CBD5E1]">{isHindi ? 'ब्याज दर (Interest Rate % p.a.):' : 'Annual Interest Rate (%):'}</span>
                    <span className="font-mono font-bold text-[#8B5CF6]">{loanRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.25"
                    value={loanRate}
                    onChange={(e) => setLoanRate(parseFloat(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-bold text-[#CBD5E1]">{isHindi ? 'लोन अवधि (Tenure):' : 'Loan Tenure:'}</span>
                    <span className="font-mono font-bold text-[#F59E0B]">{loanTenureYears} Years ({loanTenureYears * 12} Months)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(parseInt(e.target.value) || 1)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                  />
                </div>
              </div>

              {/* Results Breakdown */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="text-center p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[#8B5CF6]/30">
                  <div className="text-[11px] font-bold text-[#94A3B8]">{isHindi ? 'मासिक EMI किस्त' : 'Monthly EMI Payment'}</div>
                  <div className="text-[24px] font-mono font-bold text-[#8B5CF6] mt-0.5">
                    ₹{Math.round(monthlyEmi).toLocaleString('en-IN')}
                    <span className="text-[12px] font-normal text-[#94A3B8]"> /mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[10.5px] text-[#EF4444] font-bold">{isHindi ? 'कुल ब्याज (Interest)' : 'Total Interest'}</div>
                    <div className="text-[13px] font-mono font-bold text-[#EF4444] mt-0.5">
                      ₹{Math.round(totalLoanInterest).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
                    <div className="text-[10.5px] text-[#F8FAFC] font-bold">{isHindi ? 'कुल भुगतान (Total)' : 'Total Payment'}</div>
                    <div className="text-[13px] font-mono font-bold text-[#F8FAFC] mt-0.5">
                      ₹{Math.round(totalLoanPayment).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: GST / Tax & Discount Calculator */}
          {/* ========================================================= */}
          {activeTab === 'gst' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-1">
                <button
                  type="button"
                  onClick={() => setGstSubTab('gst')}
                  className={`flex-1 py-1.5 text-center text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    gstSubTab === 'gst'
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  GST / Tax Calculator
                </button>
                <button
                  type="button"
                  onClick={() => setGstSubTab('discount')}
                  className={`flex-1 py-1.5 text-center text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    gstSubTab === 'discount'
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Discount &amp; Sale %
                </button>
              </div>

              {gstSubTab === 'gst' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-[#CBD5E1]">
                      {gstType === 'exclusive' ? 'Base Amount (₹):' : 'Gross Amount (₹):'}
                    </label>
                    <input
                      type="number"
                      value={gstAmount}
                      onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[16px] font-mono font-bold rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                    />
                  </div>

                  {/* GST Slabs */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#94A3B8]">GST Tax Slab (%):</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[3, 5, 12, 18, 28].map((slab) => (
                        <button
                          key={slab}
                          onClick={() => setGstSlab(slab)}
                          className={`py-1.5 rounded-lg text-[12px] font-mono font-bold border transition-colors cursor-pointer ${
                            gstSlab === slab
                              ? 'bg-[#EC4899] text-white border-[#EC4899]'
                              : 'bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] border-[var(--theme-border,#213E61)]'
                          }`}
                        >
                          {slab}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGstType('exclusive')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        gstType === 'exclusive'
                          ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                          : 'border-[var(--theme-border,#213E61)] text-[#94A3B8]'
                      }`}
                    >
                      + Add GST (Exclusive)
                    </button>
                    <button
                      onClick={() => setGstType('inclusive')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        gstType === 'inclusive'
                          ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                          : 'border-[var(--theme-border,#213E61)] text-[#94A3B8]'
                      }`}
                    >
                      - Extract GST (Inclusive)
                    </button>
                  </div>

                  {/* GST Breakdown Results */}
                  <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 text-[12.5px] font-mono">
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Net Base Price:</span>
                      <span className="font-bold text-[#F8FAFC]">₹{gstBase.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>CGST ({gstSlab / 2}%):</span>
                      <span className="font-bold text-[#EC4899]">₹{gstCgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>SGST ({gstSlab / 2}%):</span>
                      <span className="font-bold text-[#EC4899]">₹{gstSgst.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[var(--theme-border,#213E61)] pt-2 flex justify-between text-[14px] font-bold">
                      <span className="text-[#F8FAFC]">Total Final Price:</span>
                      <span className="text-[var(--theme-primary,#38BDF8)]">₹{gstFinalGross.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-[#CBD5E1]">Original Price (₹):</label>
                    <input
                      type="number"
                      value={discOriginalPrice}
                      onChange={(e) => setDiscOriginalPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[16px] font-mono font-bold rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[12px]">
                      <span className="font-bold text-[#CBD5E1]">Discount Percentage:</span>
                      <span className="font-mono font-bold text-[#EC4899]">{discPercent}% OFF</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="90"
                      step="1"
                      value={discPercent}
                      onChange={(e) => setDiscPercent(parseInt(e.target.value) || 0)}
                      className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded-lg appearance-none cursor-pointer accent-[#EC4899]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 text-[13px] font-mono">
                    <div className="flex justify-between text-[#10B981]">
                      <span>You Save:</span>
                      <span className="font-bold">-₹{discSaved.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[var(--theme-border,#213E61)] pt-2 flex justify-between text-[15px] font-bold">
                      <span className="text-[#F8FAFC]">Final Payable Price:</span>
                      <span className="text-[var(--theme-primary,#38BDF8)]">₹{discFinal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
