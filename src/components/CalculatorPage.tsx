import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
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
  ArrowLeft,
  Target,
  Printer,
  History,
  Trash2,
  Sliders,
  Tag,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { TRANSLATIONS } from '../utils/translations';

export type CalculatorViewType = 'standard' | 'funds' | 'sip' | 'emi' | 'gst' | 'discount' | 'inflation';

interface CalculatorPageProps {
  onBack: () => void;
  percentages?: Record<FundType, number>;
  onApplyToIncome?: (amount: number) => void;
  onApplyToExpense?: (amount: number) => void;
  onApplyToGoal?: (title: string, targetAmount: number) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

interface CalcHistoryItem {
  expr: string;
  res: string;
  time: string;
}

// Fast & safe math expression evaluator
function evaluateMath(raw: string): { result: number | null; error: string | null } {
  if (!raw || !raw.trim()) return { result: null, error: null };
  try {
    let sanitized = raw
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Handle percentage logic e.g., "1000 + 18%" -> 1180 or "500 * 20%" -> 100
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*([+\-])\s*(\d+(\.\d+)?)\s*%/g, (_, base, _d1, op, pct) => {
      const b = parseFloat(base);
      const p = parseFloat(pct);
      const amt = (b * p) / 100;
      return `${b} ${op} ${amt}`;
    });
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*%/g, '($1/100)');

    if (!/^[\d\s+\-*/.()]+$/.test(sanitized)) {
      return { result: null, error: 'Invalid' };
    }

    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${sanitized})`)();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return { result: Math.round(val * 1000000) / 1000000, error: null };
    }
    return { result: null, error: 'Error' };
  } catch {
    return { result: null, error: 'Invalid' };
  }
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  onBack,
  percentages = DEFAULT_PERCENTAGES,
  onApplyToIncome,
  onApplyToExpense,
  onApplyToGoal,
  language = 'en',
  privacyMask = false
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorViewType>('standard');
  const isHindi = language === 'hi';

  // --- 1. Standard Calculator State ---
  const [stdExpr, setStdExpr] = useState<string>('');
  const [stdLiveResult, setStdLiveResult] = useState<string>('0');
  const [calcHistory, setCalcHistory] = useState<CalcHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [memoryVal, setMemoryVal] = useState<number>(0);

  // --- 2. 6-Fund Split State ---
  const [fundAmountInput, setFundAmountInput] = useState<string>('50000');
  const [fundCustomPct, setFundCustomPct] = useState<Record<FundType, number>>(percentages);
  const [showFundSliders, setShowFundSliders] = useState<boolean>(false);

  // --- 3. SIP State ---
  const [sipMode, setSipMode] = useState<'sip' | 'lumpsum'>('sip');
  const [sipMonthlyAmt, setSipMonthlyAmt] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipTenureYears, setSipTenureYears] = useState<number>(10);
  const [sipStepUpPct, setSipStepUpPct] = useState<number>(0);

  // --- 4. Loan EMI State ---
  const [loanPrincipal, setLoanPrincipal] = useState<number>(500000);
  const [loanRate, setLoanRate] = useState<number>(9.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // --- 5. GST State ---
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstSlab, setGstSlab] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // --- 6. Discount & Margin State ---
  const [discMode, setDiscMode] = useState<'discount' | 'margin'>('discount');
  const [discOriginalPrice, setDiscOriginalPrice] = useState<number>(2500);
  const [discPercent, setDiscPercent] = useState<number>(20);
  const [costPrice, setCostPrice] = useState<number>(1000);
  const [sellingPrice, setSellingPrice] = useState<number>(1400);

  // --- 7. Inflation & Horizon State ---
  const [goalTargetToday, setGoalTargetToday] = useState<number>(1000000);
  const [inflationRate, setInflationRate] = useState<number>(6.5);
  const [goalYears, setGoalYears] = useState<number>(7);
  const [goalExpectedReturn] = useState<number>(12);
  const [goalNameInput, setGoalNameInput] = useState<string>('Dream Goal');

  // Copy helper
  const handleCopy = (text: string, keyId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    triggerHapticSound('click');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- Calculator Keypad Handlers ---
  const handleKeypadPress = useCallback((val: string) => {
    triggerHapticSound('click');

    if (val === 'C') {
      setStdExpr('');
      setStdLiveResult('0');
      return;
    }

    if (val === '⌫') {
      setStdExpr((prev) => {
        const next = prev.slice(0, -1);
        if (!next.trim()) {
          setStdLiveResult('0');
        } else {
          const evalRes = evaluateMath(next);
          if (evalRes.result !== null) setStdLiveResult(evalRes.result.toString());
        }
        return next;
      });
      return;
    }

    if (val === '=') {
      setStdExpr((prev) => {
        if (!prev.trim()) return prev;
        const evalRes = evaluateMath(prev);
        if (evalRes.result !== null) {
          const resStr = evalRes.result.toString();
          setCalcHistory((h) => [
            { expr: prev, res: resStr, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ...h.slice(0, 9)
          ]);
          setStdLiveResult(resStr);
          return resStr;
        }
        return prev;
      });
      return;
    }

    // Append operator/digit
    setStdExpr((prev) => {
      // Prevent consecutive operators
      const operators = ['+', '-', '×', '÷', '*', '/'];
      const lastChar = prev.slice(-1);
      let next = prev;

      if (operators.includes(val) && operators.includes(lastChar)) {
        next = prev.slice(0, -1) + val;
      } else {
        next = prev + val;
      }

      const evalRes = evaluateMath(next);
      if (evalRes.result !== null) {
        setStdLiveResult(evalRes.result.toString());
      }
      return next;
    });
  }, []);

  // Keyboard shortcut listener for standard calculator
  useEffect(() => {
    if (activeTab !== 'standard') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside an input element
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        e.preventDefault();
        handleKeypadPress(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleKeypadPress('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleKeypadPress('−');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleKeypadPress('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleKeypadPress('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleKeypadPress('%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleKeypadPress('=');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeypadPress('⌫');
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleKeypadPress('C');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleKeypadPress]);

  // --- Calculations for 6-Fund Split ---
  const fundInflowNum = parseFloat(fundAmountInput) || 0;
  const totalFundPct = (Object.values(fundCustomPct) as number[]).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const isFundBalanced = Math.abs(totalFundPct - 100) < 0.01;

  const fundSplits: Record<FundType, number> = FUND_ORDER.reduce((acc, fund) => {
    const pct = fundCustomPct[fund] || 0;
    acc[fund] = (fundInflowNum * pct) / 100;
    return acc;
  }, {} as Record<FundType, number>);

  // --- Calculations for SIP / Wealth ---
  const sipCalculation = useMemo(() => {
    const months = sipTenureYears * 12;
    const monthlyRate = sipRate / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;

    if (sipMode === 'sip') {
      if (sipStepUpPct === 0) {
        totalInvested = sipMonthlyAmt * months;
        if (monthlyRate > 0) {
          totalValue =
            sipMonthlyAmt *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate);
        } else {
          totalValue = totalInvested;
        }
      } else {
        let curMonthly = sipMonthlyAmt;
        let cumulativeVal = 0;
        let cumulativeInv = 0;
        for (let y = 1; y <= sipTenureYears; y++) {
          for (let m = 1; m <= 12; m++) {
            cumulativeInv += curMonthly;
            cumulativeVal = (cumulativeVal + curMonthly) * (1 + monthlyRate);
          }
          curMonthly = curMonthly * (1 + sipStepUpPct / 100);
        }
        totalInvested = cumulativeInv;
        totalValue = cumulativeVal;
      }
    } else {
      totalInvested = sipMonthlyAmt;
      totalValue = sipMonthlyAmt * Math.pow(1 + sipRate / 100, sipTenureYears);
    }

    const totalGain = Math.max(0, totalValue - totalInvested);
    return { totalInvested, totalValue, totalGain };
  }, [sipMode, sipMonthlyAmt, sipRate, sipTenureYears, sipStepUpPct]);

  // --- Calculations for EMI ---
  const emiCalculation = useMemo(() => {
    const loanMonths = loanTenureYears * 12;
    const loanMonthlyRate = loanRate / 100 / 12;
    let monthlyEmi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (loanPrincipal > 0 && loanMonths > 0) {
      if (loanMonthlyRate > 0) {
        monthlyEmi =
          (loanPrincipal * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonths)) /
          (Math.pow(1 + loanMonthlyRate, loanMonths) - 1);
      } else {
        monthlyEmi = loanPrincipal / loanMonths;
      }
      totalPayment = monthlyEmi * loanMonths;
      totalInterest = Math.max(0, totalPayment - loanPrincipal);
    }

    return { monthlyEmi, totalPayment, totalInterest, loanMonths };
  }, [loanPrincipal, loanRate, loanTenureYears]);

  // --- Calculations for GST ---
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

  // --- Calculations for Discount & Margin ---
  const discSaved = (discOriginalPrice * discPercent) / 100;
  const discFinal = Math.max(0, discOriginalPrice - discSaved);
  const grossProfit = sellingPrice - costPrice;
  const profitMarginPct = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const markupPct = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  // --- Calculations for Inflation & Horizon ---
  const futureInflatedCost = goalTargetToday * Math.pow(1 + inflationRate / 100, goalYears);
  const goalMonths = goalYears * 12;
  const goalMonthlyRate = goalExpectedReturn / 100 / 12;
  let requiredMonthlySIP = 0;
  if (goalMonthlyRate > 0 && goalMonths > 0) {
    requiredMonthlySIP =
      (futureInflatedCost * goalMonthlyRate) /
      ((Math.pow(1 + goalMonthlyRate, goalMonths) - 1) * (1 + goalMonthlyRate));
  } else {
    requiredMonthlySIP = futureInflatedCost / goalMonths;
  }

  // Clean, focused tool tabs
  const navTabs: { id: CalculatorViewType; label: string; hindi: string; icon: any }[] = [
    { id: 'standard', label: 'Calculator', hindi: 'साधारण कैलकुलेटर', icon: Calculator },
    { id: 'funds', label: '6-Fund Split', hindi: '6-फंड विभाजन', icon: Layers },
    { id: 'sip', label: 'SIP & Wealth', hindi: 'SIP वेल्थ', icon: TrendingUp },
    { id: 'emi', label: 'Loan EMI', hindi: 'लोन EMI', icon: Landmark },
    { id: 'gst', label: 'GST Tax', hindi: 'GST टैक्स', icon: Percent },
    { id: 'discount', label: 'Discount & Margin', hindi: 'छूट एवं मार्जिन', icon: Tag },
    { id: 'inflation', label: 'Goal & Inflation', hindi: 'महंगाई लक्ष्य', icon: Target }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-150 pb-16 text-left" id="calculator-page-container">
      {/* Top Header Bar: Clean, Minimal, Fast */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="Back to Ledger"
            id="calc-back-to-home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-[17px] sm:text-[19px] font-bold text-[#F8FAFC] flex items-center gap-2">
              <span>{isHindi ? 'वित्तीय कैलकुलेटर' : 'Financial Calculator'}</span>
              <span className="text-[10px] font-mono font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] px-2 py-0.5 rounded-md border border-[var(--theme-primary,#38BDF8)]/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-[#94A3B8]">
              {isHindi ? 'तेज़, सटीक एवं खाता-सिंक्ड गणना' : 'Fast, accurate, keyboard-ready calculations'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] text-[12px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <span>{isHindi ? 'खाता' : 'Ledger'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Selector - Clean Segments */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] p-1.5 rounded-2xl shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  triggerHapticSound('click');
                }}
                className={`px-3 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-sm font-extrabold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)]'
                }`}
                id={`calc-tab-${tab.id}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isHindi ? tab.hindi : tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STANDARD ARITHMETIC CALCULATOR (TACTILE, RESPONSIVE, ZERO-LAG) */}
      {/* ========================================================================= */}
      {activeTab === 'standard' && (
        <div className="max-w-md mx-auto bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
          
          {/* LCD / OLED Display Screen */}
          <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] shadow-inner space-y-1 text-right relative overflow-hidden">
            {/* Top row: Active Expression & History button */}
            <div className="flex items-center justify-between text-[13px] font-mono text-[#94A3B8]">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
                title="View History Tape"
              >
                <History className="w-3.5 h-3.5" />
                <span>{calcHistory.length > 0 ? `Tape (${calcHistory.length})` : 'History'}</span>
              </button>

              <div className="overflow-x-auto whitespace-nowrap custom-scrollbar pl-2">
                {stdExpr || '0'}
              </div>
            </div>

            {/* Main Result Display */}
            <div className="text-[36px] sm:text-[42px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] tracking-tight truncate select-all py-1">
              {privacyMask ? '₹ ****' : (stdLiveResult || '0')}
            </div>

            {/* Quick Memory indicator */}
            {memoryVal !== 0 && (
              <div className="absolute bottom-2 left-3 text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30">
                M = {memoryVal}
              </div>
            )}
          </div>

          {/* History Tape Drawer */}
          {showHistory && (
            <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 animate-in fade-in max-h-44 overflow-y-auto custom-scrollbar text-[12px] font-mono">
              <div className="flex justify-between items-center text-[10.5px] font-bold text-[#64748B] border-b border-[var(--theme-border,#213E61)] pb-1">
                <span>RECENT CALCULATIONS</span>
                <button
                  onClick={() => setCalcHistory([])}
                  className="hover:text-[#EF4444] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              {calcHistory.length === 0 ? (
                <div className="text-[#64748B] text-center py-2 text-[11px]">No history yet</div>
              ) : (
                calcHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setStdExpr(item.res);
                      setStdLiveResult(item.res);
                      triggerHapticSound('click');
                    }}
                    className="flex justify-between items-center p-1.5 rounded-lg hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer text-[#CBD5E1]"
                  >
                    <span className="text-[#94A3B8] truncate max-w-[160px]">{item.expr}</span>
                    <span className="font-bold text-[var(--theme-primary,#38BDF8)]">= {item.res}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Memory Functions Row */}
          <div className="grid grid-cols-4 gap-2 text-[11px] font-mono font-bold">
            <button
              onClick={() => {
                setMemoryVal(0);
                triggerHapticSound('click');
              }}
              className="py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            >
              MC
            </button>
            <button
              onClick={() => {
                handleKeypadPress(memoryVal.toString());
                triggerHapticSound('click');
              }}
              className="py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            >
              MR
            </button>
            <button
              onClick={() => {
                const cur = parseFloat(stdLiveResult) || 0;
                setMemoryVal((prev) => prev + cur);
                triggerHapticSound('click');
              }}
              className="py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#10B981] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            >
              M+
            </button>
            <button
              onClick={() => {
                const cur = parseFloat(stdLiveResult) || 0;
                setMemoryVal((prev) => prev - cur);
                triggerHapticSound('click');
              }}
              className="py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#EF4444] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            >
              M-
            </button>
          </div>

          {/* Keypad Grid (Tactile, Clean, Fast) */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: 'C', val: 'C', cls: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/25' },
              { label: '⌫', val: '⌫', cls: 'bg-[var(--theme-surface,#0E1A29)] text-[#F59E0B] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-bg,#070E18)]' },
              { label: '%', val: '%', cls: 'bg-[var(--theme-surface,#0E1A29)] text-[#38BDF8] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-bg,#070E18)]' },
              { label: '÷', val: '÷', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[20px]' },

              { label: '7', val: '7' },
              { label: '8', val: '8' },
              { label: '9', val: '9' },
              { label: '×', val: '×', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[20px]' },

              { label: '4', val: '4' },
              { label: '5', val: '5' },
              { label: '6', val: '6' },
              { label: '−', val: '−', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[20px]' },

              { label: '1', val: '1' },
              { label: '2', val: '2' },
              { label: '3', val: '3' },
              { label: '+', val: '+', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[20px]' },

              { label: '0', val: '0' },
              { label: '00', val: '00' },
              { label: '.', val: '.' },
              { label: '=', val: '=', cls: 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-black text-[22px] shadow-md border-transparent hover:brightness-110' }
            ].map((btn, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleKeypadPress(btn.val)}
                className={`h-13 rounded-xl text-[18px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer active:scale-90 select-none shadow-xs border ${
                  btn.cls ||
                  'bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-surface,#0E1A29)]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Quick 1-Click Send to Ledger Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                const num = parseFloat(stdLiveResult) || 0;
                if (onApplyToIncome && num > 0) {
                  onApplyToIncome(num);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 hover:border-[#10B981] text-[#10B981] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isHindi ? 'आय में जोड़ें (+)' : 'Send to Income (+)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const num = parseFloat(stdLiveResult) || 0;
                if (onApplyToExpense && num > 0) {
                  onApplyToExpense(num);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 hover:border-[#EF4444] text-[#EF4444] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <MinusCircle className="w-4 h-4" />
              <span>{isHindi ? 'खर्च में जोड़ें (-)' : 'Send to Expense (-)'}</span>
            </button>
          </div>

          {/* Copy Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => handleCopy(stdLiveResult, 'std')}
              className="text-[11px] font-mono text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedKey === 'std' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'std' ? 'Copied to Clipboard' : 'Copy Result'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 6-FUND SPLIT FORMULA */}
      {/* ========================================================================= */}
      {activeTab === 'funds' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                {isHindi ? '6-फंड आय विभाजन' : '6-Fund Income Split Allocation'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Divide income across 6 buckets instantly before spending.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFundSliders(!showFundSliders)}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showFundSliders ? 'Hide Sliders' : 'Edit %'}</span>
            </button>
          </div>

          {/* Amount Inflow Input */}
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={fundAmountInput}
                onChange={(e) => setFundAmountInput(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[22px] font-mono font-bold rounded-xl pl-10 pr-4 py-2.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none shadow-inner"
                placeholder="50000"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[25000, 50000, 75000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setFundAmountInput(amt.toString());
                    triggerHapticSound('click');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[11.5px] font-mono text-[#CBD5E1] transition-colors cursor-pointer"
                >
                  ₹{(amt / 1000).toLocaleString('en-IN')}k
                </button>
              ))}
            </div>
          </div>

          {/* Sliders (if open) */}
          {showFundSliders && (
            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="font-bold text-[#CBD5E1]">Adjust Fund % Weights:</span>
                <span className={`font-mono font-bold ${isFundBalanced ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  Total: {totalFundPct}% {isFundBalanced ? '✓' : '(Must equal 100%)'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FUND_ORDER.map((f) => (
                  <div key={f} className="p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-1">
                    <div className="flex justify-between text-[10.5px]">
                      <span className="font-bold text-[#CBD5E1] truncate">{FUND_LABELS[f]}</span>
                      <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{fundCustomPct[f]}%</span>
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
                      className="w-full h-1 bg-[var(--theme-border,#213E61)] rounded appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fund Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FUND_ORDER.map((fund) => {
              const cfg = FUND_CONFIGS[fund];
              const allocatedAmt = fundSplits[fund] || 0;
              const pct = fundCustomPct[fund] || 0;

              return (
                <div
                  key={fund}
                  className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#F8FAFC] truncate">
                        {FUND_LABELS[fund]}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">
                        {pct}% allocation
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-mono font-bold text-[#F8FAFC]">
                      {privacyMask ? '₹ ****' : formatCurrency(allocatedAmt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Apply to income */}
          {onApplyToIncome && (
            <button
              type="button"
              onClick={() => {
                if (fundInflowNum > 0) onApplyToIncome(fundInflowNum);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record ₹{fundInflowNum.toLocaleString('en-IN')} Inflow in Khata</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SIP & COMPOUND WEALTH */}
      {/* ========================================================================= */}
      {activeTab === 'sip' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                {isHindi ? 'SIP एवं चक्रवृद्धि वेल्थ' : 'SIP & Wealth Compounder'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Calculate future value of systematic or lumpsum investments.
              </p>
            </div>

            <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
              <button
                type="button"
                onClick={() => setSipMode('sip')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  sipMode === 'sip'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                    : 'text-[#94A3B8]'
                }`}
              >
                Monthly SIP
              </button>
              <button
                type="button"
                onClick={() => setSipMode('lumpsum')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  sipMode === 'lumpsum'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                    : 'text-[#94A3B8]'
                }`}
              >
                Lumpsum
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">{sipMode === 'sip' ? 'Monthly Amount' : 'Lumpsum'}</span>
                <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">₹{sipMonthlyAmt.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={sipMonthlyAmt}
                onChange={(e) => setSipMonthlyAmt(parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Return Rate (p.a.)</span>
                <span className="font-mono font-bold text-[#10B981]">{sipRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={sipRate}
                onChange={(e) => setSipRate(parseFloat(e.target.value) || 0)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[#10B981]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Time Period</span>
                <span className="font-mono font-bold text-[#F59E0B]">{sipTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={sipTenureYears}
                onChange={(e) => setSipTenureYears(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[#F59E0B]"
              />
            </div>
          </div>

          {/* Outcome Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center">
            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#94A3B8] font-bold">Invested Amount</div>
              <div className="text-[16px] font-mono font-bold text-[#F8FAFC] mt-0.5">
                ₹{Math.round(sipCalculation.totalInvested).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#10B981] font-bold">Est. Wealth Gains</div>
              <div className="text-[16px] font-mono font-bold text-[#10B981] mt-0.5">
                +₹{Math.round(sipCalculation.totalGain).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30">
              <div className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Total Future Value</div>
              <div className="text-[18px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                ₹{Math.round(sipCalculation.totalValue).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LOAN EMI CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'emi' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
            <h2 className="text-[16px] font-bold text-[#F8FAFC]">
              {isHindi ? 'लोन EMI एवं ब्याज गणना' : 'Loan EMI & Interest Calculator'}
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              Monthly repayment and interest burden for Home, Car, or Personal loans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Principal Loan (₹)</span>
                <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">₹{loanPrincipal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Interest Rate (% p.a.)</span>
                <span className="font-mono font-bold text-[#8B5CF6]">{loanRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={loanRate}
                onChange={(e) => setLoanRate(parseFloat(e.target.value) || 0)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Tenure (Years)</span>
                <span className="font-mono font-bold text-[#F59E0B]">{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[#F59E0B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center">
            <div className="p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30">
              <div className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Monthly EMI</div>
              <div className="text-[18px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                ₹{Math.round(emiCalculation.monthlyEmi).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#EF4444] font-bold">Total Interest</div>
              <div className="text-[16px] font-mono font-bold text-[#EF4444] mt-0.5">
                ₹{Math.round(emiCalculation.totalInterest).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#94A3B8] font-bold">Total Payment</div>
              <div className="text-[16px] font-mono font-bold text-[#F8FAFC] mt-0.5">
                ₹{Math.round(emiCalculation.totalPayment).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GST TAX SPLITTER */}
      {/* ========================================================================= */}
      {activeTab === 'gst' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                {isHindi ? 'GST टैक्स गणना' : 'GST & Tax Calculator'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Calculate GST slabs with CGST + SGST tax invoice breakdowns.
              </p>
            </div>

            <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
              <button
                type="button"
                onClick={() => setGstType('exclusive')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  gstType === 'exclusive' ? 'bg-[#EC4899] text-white' : 'text-[#94A3B8]'
                }`}
              >
                + Add GST
              </button>
              <button
                type="button"
                onClick={() => setGstType('inclusive')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  gstType === 'inclusive' ? 'bg-[#EC4899] text-white' : 'text-[#94A3B8]'
                }`}
              >
                - Extract GST
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-bold text-[#CBD5E1]">
                {gstType === 'exclusive' ? 'Base Net Amount (₹):' : 'Gross MRP Amount (₹):'}
              </label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold rounded-xl px-4 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11.5px] font-bold text-[#CBD5E1]">GST Rate Slab:</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[3, 5, 12, 18, 28].map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setGstSlab(slab)}
                    className={`py-2 rounded-xl text-[12px] font-mono font-bold border transition-colors cursor-pointer ${
                      gstSlab === slab
                        ? 'bg-[#EC4899] text-white border-transparent'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[#CBD5E1]'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 font-mono text-[13px]">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Net Base Price:</span>
              <span className="font-bold text-[#F8FAFC]">₹{gstBase.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#EC4899]">
              <span>Total GST ({gstSlab}%):</span>
              <span className="font-bold">+₹{gstTotalTax.toFixed(2)} (CGST: ₹{gstCgst.toFixed(2)} | SGST: ₹{gstSgst.toFixed(2)})</span>
            </div>
            <div className="flex justify-between text-[#F8FAFC] border-t border-[var(--theme-border,#213E61)] pt-2 text-[15px]">
              <span className="font-bold">Total Final Price:</span>
              <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">₹{gstFinalGross.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DISCOUNT & MARGIN CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'discount' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                {isHindi ? 'छूट एवं मार्जिन' : 'Discount & Profit Margin'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Calculate sales discount or retail markup profit margins.
              </p>
            </div>

            <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
              <button
                type="button"
                onClick={() => setDiscMode('discount')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  discMode === 'discount' ? 'bg-[#06B6D4] text-[#040D17]' : 'text-[#94A3B8]'
                }`}
              >
                Sale Discount
              </button>
              <button
                type="button"
                onClick={() => setDiscMode('margin')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  discMode === 'margin' ? 'bg-[#06B6D4] text-[#040D17]' : 'text-[#94A3B8]'
                }`}
              >
                Profit Margin
              </button>
            </div>
          </div>

          {discMode === 'discount' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Original MRP (₹):</label>
                  <input
                    type="number"
                    value={discOriginalPrice}
                    onChange={(e) => setDiscOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11.5px]">
                    <span className="font-bold text-[#CBD5E1]">Discount:</span>
                    <span className="font-mono font-bold text-[#10B981]">{discPercent}% OFF</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    step="1"
                    value={discPercent}
                    onChange={(e) => setDiscPercent(parseFloat(e.target.value) || 0)}
                    className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[#10B981]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 font-mono text-[13px]">
                <div className="flex justify-between text-[#10B981]">
                  <span>Discount Saved:</span>
                  <span className="font-bold">-₹{discSaved.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#F8FAFC] border-t border-[var(--theme-border,#213E61)] pt-2 text-[15px]">
                  <span className="font-bold">Final Payable Price:</span>
                  <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">₹{discFinal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Cost Price (CP ₹):</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Selling Price (SP ₹):</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 font-mono text-[13px]">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Gross Profit:</span>
                  <span className={`font-bold ${grossProfit >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>₹{grossProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Profit Margin (on SP):</span>
                  <span className="font-bold text-[var(--theme-primary,#38BDF8)]">{profitMarginPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Markup (on CP):</span>
                  <span className="font-bold text-[#F59E0B]">{markupPct.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. INFLATION & FUTURE GOAL HORIZON */}
      {/* ========================================================================= */}
      {activeTab === 'inflation' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
            <h2 className="text-[16px] font-bold text-[#F8FAFC]">
              {isHindi ? 'मुद्रास्फीति एवं भविष्य लक्ष्य' : 'Inflation & Goal Horizon Planner'}
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              Calculate future inflated cost and required monthly SIP savings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11.5px] font-bold text-[#CBD5E1]">Goal Name:</label>
              <input
                type="text"
                value={goalNameInput}
                onChange={(e) => setGoalNameInput(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[13px] font-bold rounded-xl px-3 py-2"
                placeholder="e.g. Higher Education / Car"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11.5px]">
                <span className="font-bold text-[#CBD5E1]">Today's Cost:</span>
                <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">₹{goalTargetToday.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="10000000"
                step="50000"
                value={goalTargetToday}
                onChange={(e) => setGoalTargetToday(parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11.5px]">
                <span className="font-bold text-[#CBD5E1]">Inflation ({inflationRate}%):</span>
                <span className="font-mono font-bold text-[#F59E0B]">{goalYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={goalYears}
                onChange={(e) => setGoalYears(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-[var(--theme-bg,#070E18)] rounded appearance-none cursor-pointer accent-[#F59E0B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center">
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[#EF4444]/30">
              <div className="text-[10.5px] text-[#EF4444] font-bold">Future Cost in {goalYears} Yrs</div>
              <div className="text-[17px] font-mono font-bold text-[#F8FAFC] mt-0.5">
                ₹{Math.round(futureInflatedCost).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[#10B981]/30">
              <div className="text-[10.5px] text-[#10B981] font-bold">Required Monthly SIP</div>
              <div className="text-[17px] font-mono font-bold text-[#10B981] mt-0.5">
                ₹{Math.round(requiredMonthlySIP).toLocaleString('en-IN')}<span className="text-[11px] font-normal text-[#94A3B8]"> /mo</span>
              </div>
            </div>
          </div>

          {onApplyToGoal && (
            <button
              type="button"
              onClick={() => {
                onApplyToGoal(goalNameInput, Math.round(futureInflatedCost));
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#EAB308] hover:brightness-110 text-[#040D17] font-bold text-[12.5px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Target className="w-4 h-4" />
              <span>Create Goal for ₹{Math.round(futureInflatedCost).toLocaleString('en-IN')} in Khata</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
