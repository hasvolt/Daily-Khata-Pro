import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Target,
  Zap,
  Tag
} from 'lucide-react';
import { FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { TRANSLATIONS } from '../utils/translations';

type CalculatorTab = 'standard' | 'funds' | 'sip' | 'emi' | 'gst' | 'discount' | 'inflation';

interface MultiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
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

// Helper to convert large numbers to Indian Lakhs / Crores string for instant readability
function formatIndianWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return '';
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${cr} Crore`;
  }
  if (num >= 100000) {
    const lk = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `${lk} Lakh`;
  }
  if (num >= 1000) {
    const th = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `${th}k`;
  }
  return '';
}

// Safe math evaluator for standard arithmetic calculator
function safeEvaluate(expr: string): { result: number | null; error: string | null } {
  try {
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

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
  onApplyToGoal,
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

  // --- 3. SIP & Compound State (Unlimited Custom) ---
  const [sipMode, setSipMode] = useState<'sip' | 'lumpsum'>('sip');
  const [sipAmountInput, setSipAmountInput] = useState<string>('5000');
  const [sipRateInput, setSipRateInput] = useState<string>('12');
  const [sipTenureInput, setSipTenureInput] = useState<string>('10');
  const [sipStepUpInput, setSipStepUpInput] = useState<string>('0');

  // --- 4. Loan EMI State (Unlimited Principal) ---
  const [loanPrincipalInput, setLoanPrincipalInput] = useState<string>('500000');
  const [loanRateInput, setLoanRateInput] = useState<string>('9.5');
  const [loanTenureInput, setLoanTenureInput] = useState<string>('5');
  const [loanTenureUnit, setLoanTenureUnit] = useState<'years' | 'months'>('years');

  // --- 5. GST State (Custom Rate & Intra/Inter-state) ---
  const [gstAmountInput, setGstAmountInput] = useState<string>('10000');
  const [gstSlabMode, setGstSlabMode] = useState<number | 'custom'>(18);
  const [gstCustomRateInput, setGstCustomRateInput] = useState<string>('18');
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [gstTaxType, setGstTaxType] = useState<'intra' | 'inter'>('intra');

  // --- 6. Discount & Margin State ---
  const [discMode, setDiscMode] = useState<'discount' | 'margin'>('discount');
  const [discOriginalPriceInput, setDiscOriginalPriceInput] = useState<string>('2000');
  const [discPercentInput, setDiscPercentInput] = useState<string>('20');
  const [discFlatAmountInput, setDiscFlatAmountInput] = useState<string>('0');
  const [costPriceInput, setCostPriceInput] = useState<string>('1000');
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('1400');

  // --- 7. Goal & Inflation State ---
  const [goalNameInput, setGoalNameInput] = useState<string>('Dream Goal');
  const [goalTargetTodayInput, setGoalTargetTodayInput] = useState<string>('1000000');
  const [inflationRateInput, setInflationRateInput] = useState<string>('6.5');
  const [goalYearsInput, setGoalYearsInput] = useState<string>('7');
  const [goalExpectedReturnInput, setGoalExpectedReturnInput] = useState<string>('12');

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
  const sipAmtNum = Math.max(0, parseFloat(sipAmountInput) || 0);
  const sipRateNum = Math.max(0, parseFloat(sipRateInput) || 0);
  const sipTenureNum = Math.max(1, parseFloat(sipTenureInput) || 1);
  const sipStepUpNum = Math.max(0, parseFloat(sipStepUpInput) || 0);

  const sipCalculation = useMemo(() => {
    const months = Math.round(sipTenureNum * 12);
    const monthlyRate = sipRateNum / 100 / 12;
    let sipInvested = 0;
    let sipTotalValue = 0;

    if (sipMode === 'sip') {
      if (sipStepUpNum === 0) {
        sipInvested = sipAmtNum * months;
        if (monthlyRate > 0) {
          sipTotalValue =
            sipAmtNum *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate);
        } else {
          sipTotalValue = sipInvested;
        }
      } else {
        let curMonthly = sipAmtNum;
        let cumulativeVal = 0;
        let cumulativeInv = 0;
        const yearsCount = Math.ceil(sipTenureNum);
        for (let y = 1; y <= yearsCount; y++) {
          const monthsInThisYear = y === yearsCount && sipTenureNum % 1 !== 0 ? Math.round((sipTenureNum % 1) * 12) : 12;
          for (let m = 1; m <= monthsInThisYear; m++) {
            cumulativeInv += curMonthly;
            cumulativeVal = (cumulativeVal + curMonthly) * (1 + monthlyRate);
          }
          curMonthly = curMonthly * (1 + sipStepUpNum / 100);
        }
        sipInvested = cumulativeInv;
        sipTotalValue = cumulativeVal;
      }
    } else {
      sipInvested = sipAmtNum;
      sipTotalValue = sipAmtNum * Math.pow(1 + sipRateNum / 100, sipTenureNum);
    }

    const sipGain = Math.max(0, sipTotalValue - sipInvested);
    const multiplier = sipInvested > 0 ? (sipTotalValue / sipInvested).toFixed(2) : '1.0';
    return { sipInvested, sipTotalValue, sipGain, multiplier };
  }, [sipMode, sipAmtNum, sipRateNum, sipTenureNum, sipStepUpNum]);

  // --- Calculations for EMI ---
  const loanPrincipalNum = Math.max(0, parseFloat(loanPrincipalInput) || 0);
  const loanRateNum = Math.max(0, parseFloat(loanRateInput) || 0);
  const rawTenure = parseFloat(loanTenureInput) || 0;
  const loanMonths = loanTenureUnit === 'years' ? Math.round(rawTenure * 12) : Math.round(rawTenure);

  const emiCalculation = useMemo(() => {
    const loanMonthlyRate = loanRateNum / 100 / 12;
    let monthlyEmi = 0;
    let totalLoanPayment = 0;
    let totalLoanInterest = 0;

    if (loanPrincipalNum > 0 && loanMonths > 0) {
      if (loanMonthlyRate > 0) {
        monthlyEmi =
          (loanPrincipalNum * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonths)) /
          (Math.pow(1 + loanMonthlyRate, loanMonths) - 1);
      } else {
        monthlyEmi = loanPrincipalNum / loanMonths;
      }
      totalLoanPayment = monthlyEmi * loanMonths;
      totalLoanInterest = Math.max(0, totalLoanPayment - loanPrincipalNum);
    }

    const interestPct = totalLoanPayment > 0 ? ((totalLoanInterest / totalLoanPayment) * 100).toFixed(1) : '0';
    const principalPct = totalLoanPayment > 0 ? ((loanPrincipalNum / totalLoanPayment) * 100).toFixed(1) : '100';

    return { monthlyEmi, totalLoanPayment, totalLoanInterest, loanMonths, interestPct, principalPct };
  }, [loanPrincipalNum, loanRateNum, loanMonths]);

  // --- Calculations for GST ---
  const gstAmountNum = Math.max(0, parseFloat(gstAmountInput) || 0);
  const effectiveGstSlab = gstSlabMode === 'custom'
    ? Math.max(0, parseFloat(gstCustomRateInput) || 0)
    : gstSlabMode;

  let gstBase = 0;
  let gstTotalTax = 0;
  let gstCgst = 0;
  let gstSgst = 0;
  let gstIgst = 0;
  let gstFinalGross = 0;

  if (gstType === 'exclusive') {
    gstBase = gstAmountNum;
    gstTotalTax = (gstAmountNum * effectiveGstSlab) / 100;
    if (gstTaxType === 'intra') {
      gstCgst = gstTotalTax / 2;
      gstSgst = gstTotalTax / 2;
    } else {
      gstIgst = gstTotalTax;
    }
    gstFinalGross = gstBase + gstTotalTax;
  } else {
    gstFinalGross = gstAmountNum;
    gstBase = (gstAmountNum * 100) / (100 + effectiveGstSlab);
    gstTotalTax = gstFinalGross - gstBase;
    if (gstTaxType === 'intra') {
      gstCgst = gstTotalTax / 2;
      gstSgst = gstTotalTax / 2;
    } else {
      gstIgst = gstTotalTax;
    }
  }

  // --- Calculations for Discount & Margin ---
  const discOrigNum = Math.max(0, parseFloat(discOriginalPriceInput) || 0);
  const discPctNum = Math.max(0, parseFloat(discPercentInput) || 0);
  const discFlatNum = Math.max(0, parseFloat(discFlatAmountInput) || 0);
  const discSaved = discFlatNum > 0 ? Math.min(discOrigNum, discFlatNum) : (discOrigNum * discPctNum) / 100;
  const discFinal = Math.max(0, discOrigNum - discSaved);
  const effectiveDiscPct = discOrigNum > 0 ? (discSaved / discOrigNum) * 100 : 0;

  const costPriceNum = Math.max(0, parseFloat(costPriceInput) || 0);
  const sellingPriceNum = Math.max(0, parseFloat(sellingPriceInput) || 0);
  const grossProfit = sellingPriceNum - costPriceNum;
  const profitMarginPct = sellingPriceNum > 0 ? (grossProfit / sellingPriceNum) * 100 : 0;
  const markupPct = costPriceNum > 0 ? (grossProfit / costPriceNum) * 100 : 0;

  // --- Calculations for Inflation & Goal Horizon ---
  const goalTargetTodayNum = Math.max(0, parseFloat(goalTargetTodayInput) || 0);
  const inflationRateNum = Math.max(0, parseFloat(inflationRateInput) || 0);
  const goalYearsNum = Math.max(1, parseFloat(goalYearsInput) || 1);
  const goalReturnNum = Math.max(0, parseFloat(goalExpectedReturnInput) || 0);

  const futureInflatedCost = goalTargetTodayNum * Math.pow(1 + inflationRateNum / 100, goalYearsNum);
  const extraInflationBurden = Math.max(0, futureInflatedCost - goalTargetTodayNum);
  const goalMonths = Math.round(goalYearsNum * 12);
  const goalMonthlyRate = goalReturnNum / 100 / 12;

  let requiredMonthlySIP = 0;
  if (goalMonthlyRate > 0 && goalMonths > 0) {
    requiredMonthlySIP =
      (futureInflatedCost * goalMonthlyRate) /
      ((Math.pow(1 + goalMonthlyRate, goalMonths) - 1) * (1 + goalMonthlyRate));
  } else {
    requiredMonthlySIP = futureInflatedCost / goalMonths;
  }

  const tabs: { id: CalculatorTab; label: string; icon: any; color: string }[] = [
    { id: 'standard', label: isHindi ? 'साधारण गणित' : 'Standard', icon: Calculator, color: '#38BDF8' },
    { id: 'funds', label: isHindi ? '6-फंड फॉर्मूला' : '6-Fund Split', icon: Layers, color: '#10B981' },
    { id: 'sip', label: isHindi ? 'SIP / वेल्थ' : 'SIP & Wealth', icon: TrendingUp, color: '#F59E0B' },
    { id: 'emi', label: isHindi ? 'लोन EMI' : 'Loan EMI', icon: Landmark, color: '#8B5CF6' },
    { id: 'gst', label: isHindi ? 'GST टैक्स' : 'GST Tax', icon: Percent, color: '#EC4899' },
    { id: 'discount', label: isHindi ? 'छूट / मार्जिन' : 'Discount', icon: Tag, color: '#06B6D4' },
    { id: 'inflation', label: isHindi ? 'लक्ष्य महंगाई' : 'Goal Planner', icon: Target, color: '#EAB308' }
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
                  Unlimited
                </span>
              </div>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'कस्टम इनपुट, कोई पाबंदी नहीं, रीयल-टाइम गणना' : 'Custom inputs with zero restrictions & instant results'}
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
          {/* TAB 1: Standard Keypad Calculator */}
          {/* ========================================================= */}
          {activeTab === 'standard' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] shadow-inner space-y-1 text-right">
                <div className="text-[13px] font-mono text-[#94A3B8] h-5 overflow-x-auto whitespace-nowrap">
                  {stdExpr || '0'}
                </div>
                <div className="text-[28px] sm:text-[32px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] tracking-tight truncate">
                  {privacyMask ? '₹ ****' : `₹ ${Number(stdResult || 0).toLocaleString('en-IN')}`}
                </div>
              </div>

              {/* Memory Buttons */}
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

                <button
                  type="button"
                  onClick={() => handleCopyResult(stdResult)}
                  className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
                >
                  {copiedResult ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResult ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'C', val: 'C', cls: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/25' },
                  { label: '⌫', val: '⌫', cls: 'bg-[var(--theme-card,#132438)] text-[#F59E0B] border-[var(--theme-border,#213E61)]' },
                  { label: '%', val: '%', cls: 'bg-[var(--theme-card,#132438)] text-[#38BDF8] border-[var(--theme-border,#213E61)]' },
                  { label: '÷', val: '÷', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[18px]' },

                  { label: '7', val: '7' },
                  { label: '8', val: '8' },
                  { label: '9', val: '9' },
                  { label: '×', val: '×', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[18px]' },

                  { label: '4', val: '4' },
                  { label: '5', val: '5' },
                  { label: '6', val: '6' },
                  { label: '−', val: '−', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[18px]' },

                  { label: '1', val: '1' },
                  { label: '2', val: '2' },
                  { label: '3', val: '3' },
                  { label: '+', val: '+', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.18))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.4))] font-bold text-[18px]' },

                  { label: '0', val: '0' },
                  { label: '00', val: '00' },
                  { label: '.', val: '.' },
                  { label: '=', val: '=', cls: 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-black text-[20px] shadow-md border-transparent hover:brightness-110' }
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleKeypadPress(btn.val)}
                    className={`h-12 rounded-xl text-[17px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 select-none shadow-xs border ${
                      btn.cls ||
                      'bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const num = parseFloat(stdResult) || 0;
                    if (onApplyToIncome && num > 0) {
                      onApplyToIncome(num);
                      onClose();
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
                    const num = parseFloat(stdResult) || 0;
                    if (onApplyToExpense && num > 0) {
                      onApplyToExpense(num);
                      onClose();
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 hover:border-[#EF4444] text-[#EF4444] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>{isHindi ? 'खर्च में जोड़ें (-)' : 'Send to Expense (-)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 6-Fund Formula Split */}
          {/* ========================================================= */}
          {activeTab === 'funds' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11.5px]">
                  <label className="font-bold text-[#CBD5E1]">
                    {isHindi ? 'कुल आय / इनफ्लो राशि (₹):' : 'Total Inflow Amount (₹):'}
                  </label>
                  {fundInflowNum > 0 && (
                    <span className="font-mono text-[11px] text-[var(--theme-primary,#38BDF8)] font-bold">
                      {formatIndianWords(fundInflowNum)}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={fundAmountInput}
                    onChange={(e) => setFundAmountInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold rounded-xl pl-8 pr-4 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                    placeholder="50000"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {[10000, 25000, 50000, 100000, 250000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFundAmountInput(amt.toString())}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--theme-card,#132438)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] cursor-pointer"
                    >
                      ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fund Breakdown */}
              <div className="grid grid-cols-2 gap-2">
                {FUND_ORDER.map((fund) => {
                  const cfg = FUND_CONFIGS[fund];
                  const allocatedAmt = fundSplits[fund] || 0;
                  const pct = fundCustomPct[fund] || 0;

                  return (
                    <div
                      key={fund}
                      className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-[12px] font-bold text-[#F8FAFC] truncate">
                          {FUND_LABELS[fund]}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">
                          {pct}%
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[13px] font-mono font-bold text-[#F8FAFC]">
                          {privacyMask ? '₹ ****' : formatCurrency(allocatedAmt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {onApplyToIncome && (
                <button
                  type="button"
                  onClick={() => {
                    if (fundInflowNum > 0) {
                      onApplyToIncome(fundInflowNum);
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Apply ₹{fundInflowNum.toLocaleString('en-IN')} to Income</span>
                </button>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SIP & Wealth Compounder */}
          {/* ========================================================= */}
          {activeTab === 'sip' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-[#F8FAFC]">Investment Type:</span>
                <div className="flex rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setSipMode('sip')}
                    className={`px-3 py-1 text-[11px] font-bold rounded ${sipMode === 'sip' ? 'bg-[#F59E0B] text-[#070E18]' : 'text-[#94A3B8]'}`}
                  >
                    Monthly SIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setSipMode('lumpsum')}
                    className={`px-3 py-1 text-[11px] font-bold rounded ${sipMode === 'lumpsum' ? 'bg-[#F59E0B] text-[#070E18]' : 'text-[#94A3B8]'}`}
                  >
                    Lumpsum
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-[#CBD5E1]">Amount (₹):</span>
                    {sipAmtNum > 0 && <span className="text-[var(--theme-primary,#38BDF8)] font-mono">{formatIndianWords(sipAmtNum)}</span>}
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={sipAmountInput}
                    onChange={(e) => setSipAmountInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Return (% p.a.):</span>
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={sipRateInput}
                    onChange={(e) => setSipRateInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#10B981] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Tenure (Years):</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={sipTenureInput}
                    onChange={(e) => setSipTenureInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] grid grid-cols-3 gap-2 text-center text-mono">
                <div>
                  <div className="text-[10px] text-[#94A3B8]">Total Invested</div>
                  <div className="text-[13px] font-bold text-[#F8FAFC] mt-0.5">
                    ₹{Math.round(sipCalculation.sipInvested).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#10B981]">Wealth Gains</div>
                  <div className="text-[13px] font-bold text-[#10B981] mt-0.5">
                    +₹{Math.round(sipCalculation.sipGain).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--theme-primary,#38BDF8)]">Maturity Value</div>
                  <div className="text-[14px] font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                    ₹{Math.round(sipCalculation.sipTotalValue).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: Loan EMI */}
          {/* ========================================================= */}
          {activeTab === 'emi' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-[#CBD5E1]">Principal (₹):</span>
                    {loanPrincipalNum > 0 && <span className="text-[var(--theme-primary,#38BDF8)] font-mono">{formatIndianWords(loanPrincipalNum)}</span>}
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={loanPrincipalInput}
                    onChange={(e) => setLoanPrincipalInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Interest Rate (%):</span>
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.05"
                    value={loanRateInput}
                    onChange={(e) => setLoanRateInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#8B5CF6] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Tenure (Years):</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={loanTenureInput}
                    onChange={(e) => setLoanTenureInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] grid grid-cols-3 gap-2 text-center text-mono">
                <div>
                  <div className="text-[10px] text-[var(--theme-primary,#38BDF8)]">Monthly EMI</div>
                  <div className="text-[14px] font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                    ₹{Math.round(emiCalculation.monthlyEmi).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#EF4444]">Total Interest</div>
                  <div className="text-[13px] font-bold text-[#EF4444] mt-0.5">
                    ₹{Math.round(emiCalculation.totalLoanInterest).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#10B981]">Total Payment</div>
                  <div className="text-[13px] font-bold text-[#10B981] mt-0.5">
                    ₹{Math.round(emiCalculation.totalLoanPayment).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: GST Tax */}
          {/* ========================================================= */}
          {activeTab === 'gst' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setGstType('exclusive')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded ${gstType === 'exclusive' ? 'bg-[#EC4899] text-white' : 'text-[#94A3B8]'}`}
                  >
                    + Add GST
                  </button>
                  <button
                    type="button"
                    onClick={() => setGstType('inclusive')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded ${gstType === 'inclusive' ? 'bg-[#EC4899] text-white' : 'text-[#94A3B8]'}`}
                  >
                    - Extract GST
                  </button>
                </div>

                <div className="flex rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setGstTaxType('intra')}
                    className={`px-2 py-0.5 text-[10.5px] font-bold rounded ${gstTaxType === 'intra' ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]' : 'text-[#94A3B8]'}`}
                  >
                    Intra (CGST+SGST)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGstTaxType('inter')}
                    className={`px-2 py-0.5 text-[10.5px] font-bold rounded ${gstTaxType === 'inter' ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]' : 'text-[#94A3B8]'}`}
                  >
                    Inter (IGST)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-[#CBD5E1]">Amount (₹):</span>
                    {gstAmountNum > 0 && <span className="font-mono text-[#EC4899]">{formatIndianWords(gstAmountNum)}</span>}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={gstAmountInput}
                    onChange={(e) => setGstAmountInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                    placeholder="10000"
                  />
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {[1000, 5000, 10000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setGstAmountInput(amt.toString())}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-card,#132438)] text-[#94A3B8] hover:text-[#EC4899] border border-[var(--theme-border,#213E61)] cursor-pointer"
                      >
                        ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-[#CBD5E1]">GST Rate:</span>
                    <span className="font-mono text-[#EC4899] font-bold">{effectiveGstSlab}%</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[0, 5, 12, 18, 28].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setGstSlabMode(s)}
                        className={`py-1 text-[11px] font-mono font-bold rounded border cursor-pointer ${gstSlabMode === s ? 'bg-[#EC4899] text-white border-transparent' : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#CBD5E1]'}`}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setGstSlabMode('custom')}
                      className={`px-2 py-1 rounded text-[10.5px] font-bold border transition-colors cursor-pointer shrink-0 ${gstSlabMode === 'custom' ? 'bg-[#EC4899] text-white border-transparent' : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[#94A3B8]'}`}
                    >
                      Custom %:
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={gstCustomRateInput}
                      onFocus={() => setGstSlabMode('custom')}
                      onChange={(e) => {
                        setGstCustomRateInput(e.target.value);
                        setGstSlabMode('custom');
                      }}
                      placeholder="e.g. 0.25, 6, 40"
                      className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-mono text-[11px] font-bold rounded px-2 py-1 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 font-mono text-[12px]">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Base Price:</span>
                  <span className="font-bold text-[#F8FAFC]">₹{gstBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#EC4899]">
                  <span>GST Tax ({effectiveGstSlab}%):</span>
                  <span className="font-bold">+₹{gstTotalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#F8FAFC] border-t border-[var(--theme-border,#213E61)] pt-1 text-[14px]">
                  <span className="font-bold">Total Final Price:</span>
                  <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">₹{gstFinalGross.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: Discount & Profit Margin */}
          {/* ========================================================= */}
          {activeTab === 'discount' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Original MRP (₹):</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={discOriginalPriceInput}
                    onChange={(e) => setDiscOriginalPriceInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Discount %:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discPercentInput}
                    onChange={(e) => setDiscPercentInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#10B981] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 font-mono text-[12px]">
                <div className="flex justify-between text-[#10B981]">
                  <span>Discount Saved ({discPctNum}%):</span>
                  <span className="font-bold">-₹{discSaved.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#F8FAFC] border-t border-[var(--theme-border,#213E61)] pt-1 text-[14px]">
                  <span className="font-bold">Payable Price:</span>
                  <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">₹{discFinal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: Goal & Inflation */}
          {/* ========================================================= */}
          {activeTab === 'inflation' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Today's Cost (₹):</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={goalTargetTodayInput}
                    onChange={(e) => setGoalTargetTodayInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Inflation Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={inflationRateInput}
                    onChange={(e) => setInflationRateInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Years:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={goalYearsInput}
                    onChange={(e) => setGoalYearsInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#10B981] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#CBD5E1]">Expected Return (%):</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={goalExpectedReturnInput}
                    onChange={(e) => setGoalExpectedReturnInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#38BDF8] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 font-mono text-[12px]">
                <div className="flex justify-between text-[#EF4444]">
                  <span>Future Cost in {goalYearsNum} Yrs:</span>
                  <span className="font-bold">₹{Math.round(futureInflatedCost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#10B981] border-t border-[var(--theme-border,#213E61)] pt-1 text-[13px]">
                  <span>Required Monthly SIP:</span>
                  <span className="font-extrabold text-[#10B981]">₹{Math.round(requiredMonthlySIP).toLocaleString('en-IN')} /mo</span>
                </div>
              </div>

              {onApplyToGoal && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyToGoal(goalNameInput, Math.round(futureInflatedCost));
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EAB308] hover:brightness-110 text-[#040D17] font-bold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Target className="w-4 h-4" />
                  <span>Create Goal in Khata</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
