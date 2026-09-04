import { getCurrencyConfig, getCurrentLanguage, formatCurrencyByLang } from "../utils/currencyConfig";
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
  History,
  Trash2,
  Sliders,
  Tag,
  HelpCircle,
  Zap,
  Info,
  DollarSign,
  Printer,
  FileDown
} from 'lucide-react';
import { FundType, AppLanguage } from '../types';
import { FUND_ORDER, FUND_LABELS, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import { printCalculatorSlip, downloadCalculatorSlipHTML, CalcPrintParams } from '../utils/calculatorPrint';

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

// Fast & safe math expression evaluator for arithmetic calculator
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
  const [calcScale, setCalcScale] = useState<'normal' | 'large' | 'jumbo'>('large');

  // --- 2. 6-Fund Split State ---
  const [fundAmountInput, setFundAmountInput] = useState<string>('50000');
  const [fundCustomPct, setFundCustomPct] = useState<Record<FundType, number>>(percentages);
  const [showFundSliders, setShowFundSliders] = useState<boolean>(false);

  // --- 3. SIP & Wealth Compounder State ---
  const [sipMode, setSipMode] = useState<'sip' | 'lumpsum'>('sip');
  const [sipAmountInput, setSipAmountInput] = useState<string>('5000');
  const [sipRateInput, setSipRateInput] = useState<string>('12');
  const [sipTenureInput, setSipTenureInput] = useState<string>('10');
  const [sipStepUpInput, setSipStepUpInput] = useState<string>('0');

  // --- 4. Loan EMI State ---
  const [loanPrincipalInput, setLoanPrincipalInput] = useState<string>('500000');
  const [loanRateInput, setLoanRateInput] = useState<string>('9.5');
  const [loanTenureInput, setLoanTenureInput] = useState<string>('5');
  const [loanTenureUnit, setLoanTenureUnit] = useState<'years' | 'months'>('years');

  // --- 5. GST State ---
  const [gstAmountInput, setGstAmountInput] = useState<string>('10000');
  const [gstSlabMode, setGstSlabMode] = useState<number | 'custom'>(18);
  const [gstCustomRateInput, setGstCustomRateInput] = useState<string>('18');
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [gstTaxType, setGstTaxType] = useState<'intra' | 'inter'>('intra'); // intra = CGST+SGST, inter = IGST

  // --- 6. Discount & Margin State ---
  const [discMode, setDiscMode] = useState<'discount' | 'margin'>('discount');
  const [discOriginalPriceInput, setDiscOriginalPriceInput] = useState<string>('2500');
  const [discPercentInput, setDiscPercentInput] = useState<string>('20');
  const [discFlatAmountInput, setDiscFlatAmountInput] = useState<string>('0');
  const [costPriceInput, setCostPriceInput] = useState<string>('1000');
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('1400');

  // --- 7. Inflation & Goal Horizon State ---
  const [goalNameInput, setGoalNameInput] = useState<string>('Dream Goal');
  const [goalTargetTodayInput, setGoalTargetTodayInput] = useState<string>('1000000');
  const [inflationRateInput, setInflationRateInput] = useState<string>('6.5');
  const [goalYearsInput, setGoalYearsInput] = useState<string>('7');
  const [goalExpectedReturnInput, setGoalExpectedReturnInput] = useState<string>('12');

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

  const fundSplits: Record<FundType, number> = useMemo(() => {
    return FUND_ORDER.reduce((acc, fund) => {
      const pct = fundCustomPct[fund] || 0;
      acc[fund] = (fundInflowNum * pct) / 100;
      return acc;
    }, {} as Record<FundType, number>);
  }, [fundInflowNum, fundCustomPct]);

  // --- Calculations for SIP / Wealth ---
  const sipAmtNum = Math.max(0, parseFloat(sipAmountInput) || 0);
  const sipRateNum = Math.max(0, parseFloat(sipRateInput) || 0);
  const sipTenureNum = Math.max(1, parseFloat(sipTenureInput) || 1);
  const sipStepUpNum = Math.max(0, parseFloat(sipStepUpInput) || 0);

  const sipCalculation = useMemo(() => {
    const months = Math.round(sipTenureNum * 12);
    const monthlyRate = sipRateNum / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;

    if (sipMode === 'sip') {
      if (sipStepUpNum === 0) {
        totalInvested = sipAmtNum * months;
        if (monthlyRate > 0) {
          totalValue =
            sipAmtNum *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate);
        } else {
          totalValue = totalInvested;
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
        totalInvested = cumulativeInv;
        totalValue = cumulativeVal;
      }
    } else {
      totalInvested = sipAmtNum;
      totalValue = sipAmtNum * Math.pow(1 + sipRateNum / 100, sipTenureNum);
    }

    const totalGain = Math.max(0, totalValue - totalInvested);
    const multiplier = totalInvested > 0 ? (totalValue / totalInvested).toFixed(2) : '1.0';
    return { totalInvested, totalValue, totalGain, multiplier };
  }, [sipMode, sipAmtNum, sipRateNum, sipTenureNum, sipStepUpNum]);

  // --- Calculations for EMI ---
  const loanPrincipalNum = Math.max(0, parseFloat(loanPrincipalInput) || 0);
  const loanRateNum = Math.max(0, parseFloat(loanRateInput) || 0);
  const rawTenure = parseFloat(loanTenureInput) || 0;
  const loanMonths = loanTenureUnit === 'years' ? Math.round(rawTenure * 12) : Math.round(rawTenure);

  const emiCalculation = useMemo(() => {
    const loanMonthlyRate = loanRateNum / 100 / 12;
    let monthlyEmi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (loanPrincipalNum > 0 && loanMonths > 0) {
      if (loanMonthlyRate > 0) {
        monthlyEmi =
          (loanPrincipalNum * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanMonths)) /
          (Math.pow(1 + loanMonthlyRate, loanMonths) - 1);
      } else {
        monthlyEmi = loanPrincipalNum / loanMonths;
      }
      totalPayment = monthlyEmi * loanMonths;
      totalInterest = Math.max(0, totalPayment - loanPrincipalNum);
    }

    const interestPct = totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(1) : '0';
    const principalPct = totalPayment > 0 ? ((loanPrincipalNum / totalPayment) * 100).toFixed(1) : '100';

    return { monthlyEmi, totalPayment, totalInterest, loanMonths, interestPct, principalPct };
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

  // Required One-time Lumpsum today to achieve future cost
  const requiredLumpsumToday = goalReturnNum > 0
    ? futureInflatedCost / Math.pow(1 + goalReturnNum / 100, goalYearsNum)
    : futureInflatedCost;

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

  const getCurrentCalcParams = (): CalcPrintParams => {
    if (activeTab === 'standard') {
      return {
        title: isHindi ? 'साधारण अंकगणित गणना' : 'Standard Arithmetic Calculation',
        type: 'Arithmetic Computation',
        mainResult: stdLiveResult || '0',
        resultLabel: isHindi ? 'गणना परिणाम' : 'Calculated Result',
        secondaryInfo:
          parseFloat(stdLiveResult) > 0
            ? `≈ ₹ ${parseFloat(stdLiveResult).toLocaleString('en-IN')} ${
                formatIndianWords(parseFloat(stdLiveResult)) ? `(${formatIndianWords(parseFloat(stdLiveResult))})` : ''
              }`
            : undefined,
        items: [
          { label: isHindi ? 'इनपुट सूत्र' : 'Input Expression', value: stdExpr || '0', isBold: true },
          { label: isHindi ? 'अंतिम परिणाम' : 'Final Result', value: stdLiveResult || '0', isBold: true, isHighlight: true },
          ...(memoryVal !== 0 ? [{ label: isHindi ? 'मेमोरी मान (M)' : 'Memory Value (M)', value: memoryVal.toString() }] : [])
        ],
        recentTape: calcHistory.map((h) => ({ expr: h.expr, res: h.res }))
      };
    }

    if (activeTab === 'funds') {
      return {
        title: isHindi ? '6-फंड धन आवंटन स्लिप' : '6-Fund Money Allocation Slip',
        type: 'Income Allocation Rule',
        mainResult: formatCurrency(fundInflowNum),
        resultLabel: isHindi ? 'कुल आय / इनफ्लो' : 'Total Inflow Amount',
        secondaryInfo: formatIndianWords(fundInflowNum) ? `≈ ${formatIndianWords(fundInflowNum)}` : undefined,
        items: [
          { label: isHindi ? 'कुल आय इनफ्लो' : 'Total Inflow', value: formatCurrency(fundInflowNum), isBold: true },
          ...FUND_ORDER.map((f) => ({
            label: `${FUND_LABELS[f]} (${fundCustomPct[f]}%)`,
            value: formatCurrency((fundInflowNum * (fundCustomPct[f] || 0)) / 100),
            isHighlight: f === 'savings' || f === 'investment'
          }))
        ],
        notes: isHindi ? '6-फंड नियम के अनुसार विभाजित' : 'Divided as per 6-Fund Wealth Management Rule'
      };
    }

    if (activeTab === 'sip') {
      return {
        title: isHindi ? 'SIP वेल्थ संचय योजना' : 'SIP Wealth Accumulation Plan',
        type: 'Compound Interest & Equity SIP',
        mainResult: formatCurrency(sipCalculation.totalValue),
        resultLabel: isHindi ? 'अनुमानित परिपक्वता मूल्य (Maturity)' : 'Expected Maturity Value',
        secondaryInfo: formatIndianWords(sipCalculation.totalValue) ? `≈ ${formatIndianWords(sipCalculation.totalValue)}` : undefined,
        items: [
          { label: isHindi ? 'मासिक SIP राशि' : 'Monthly Investment', value: formatCurrency(sipAmtNum), isBold: true },
          { label: isHindi ? 'अपेक्षित वार्षिक रिटर्न' : 'Expected Return Rate', value: `${sipRateNum}% p.a.` },
          { label: isHindi ? 'निवेश अवधि' : 'Time Horizon (Tenure)', value: `${sipTenureNum} Years` },
          { label: isHindi ? 'कुल जमा मूलधन' : 'Total Principal Invested', value: formatCurrency(sipCalculation.totalInvested), isBold: true },
          { label: isHindi ? 'अनुमानित लाभ / रिटर्न' : 'Estimated Wealth Gain', value: `+${formatCurrency(sipCalculation.totalGain)}`, isHighlight: true, isBold: true },
          { label: isHindi ? 'परिपक्वता मूल्य' : 'Total Maturity Value', value: formatCurrency(sipCalculation.totalValue), isHighlight: true, isBold: true }
        ]
      };
    }

    if (activeTab === 'emi') {
      return {
        title: isHindi ? 'ऋण / लोन EMI पुनर्भुगतान अनुसूची' : 'Loan EMI Repayment Schedule',
        type: 'Equated Monthly Installment',
        mainResult: formatCurrency(emiCalculation.monthlyEmi),
        resultLabel: isHindi ? 'मासिक EMI देय' : 'Monthly EMI Payable',
        secondaryInfo: formatIndianWords(emiCalculation.totalPayment) ? `कुल भुगतान: ≈ ${formatIndianWords(emiCalculation.totalPayment)}` : undefined,
        items: [
          { label: isHindi ? 'मूल ऋण राशि (Principal)' : 'Loan Principal Amount', value: formatCurrency(loanPrincipalNum), isBold: true },
          { label: isHindi ? 'वार्षिक ब्याज दर' : 'Annual Interest Rate', value: `${loanRateNum}% p.a.` },
          { label: isHindi ? 'ऋण अवधि (Tenure)' : 'Loan Duration', value: `${loanMonths} Months (${(loanMonths / 12).toFixed(1)} Years)` },
          { label: isHindi ? 'मासिक EMI' : 'Monthly EMI', value: formatCurrency(emiCalculation.monthlyEmi), isBold: true, isHighlight: true },
          { label: isHindi ? 'कुल देय ब्याज' : 'Total Interest Payable', value: formatCurrency(emiCalculation.totalInterest) },
          { label: isHindi ? 'कुल चुकौती राशि' : 'Total Payment (Principal + Interest)', value: formatCurrency(emiCalculation.totalPayment), isBold: true }
        ]
      };
    }

    if (activeTab === 'gst') {
      return {
        title: isHindi ? 'GST टैक्स इनवॉइस सारांश' : 'GST Tax Calculation Summary',
        type: 'Goods and Services Tax',
        mainResult: formatCurrency(gstFinalGross),
        resultLabel: isHindi ? 'कुल इनवॉइस राशि' : 'Final Invoice Total',
        items: [
          { label: isHindi ? 'मूल राशि (Base Value)' : 'Base Amount', value: formatCurrency(gstBase), isBold: true },
          { label: isHindi ? 'GST टैक्स स्लैब' : 'GST Tax Slab', value: `${effectiveGstSlab}%` },
          { label: isHindi ? 'प्रकार' : 'Tax Type', value: gstTaxType === 'intra' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)' },
          ...(gstTaxType === 'intra'
            ? [
                { label: 'CGST (Central Tax)', value: formatCurrency(gstCgst) },
                { label: 'SGST (State Tax)', value: formatCurrency(gstSgst) }
              ]
            : [{ label: 'IGST (Integrated Tax)', value: formatCurrency(gstIgst) }]),
          { label: isHindi ? 'कुल टैक्स राशि' : 'Total GST Amount', value: formatCurrency(gstTotalTax), isHighlight: true },
          { label: isHindi ? 'अंतिम देय राशि' : 'Gross Invoice Value', value: formatCurrency(gstFinalGross), isBold: true, isHighlight: true }
        ]
      };
    }

    if (activeTab === 'discount') {
      return {
        title: isHindi ? 'छूट एवं बचत गणना स्लिप' : 'Discount & Savings Calculation Slip',
        type: 'Retail & Commercial Discount',
        mainResult: formatCurrency(discFinal),
        resultLabel: isHindi ? 'अंतिम देय मूल्य' : 'Final Discounted Price',
        items: [
          { label: isHindi ? 'मूल मूल्य / MRP' : 'Original Price / MRP', value: formatCurrency(discOrigNum), isBold: true },
          { label: isHindi ? 'छूट प्रतिशत' : 'Discount Percentage', value: `${effectiveDiscPct.toFixed(1)}%` },
          { label: isHindi ? 'कुल बचत राशि' : 'Total Money Saved', value: `-${formatCurrency(discSaved)}`, isHighlight: true, isBold: true },
          { label: isHindi ? 'अंतिम देय मूल्य' : 'Final Payable Price', value: formatCurrency(discFinal), isBold: true, isHighlight: true }
        ]
      };
    }

    // Default: inflation
    return {
      title: isHindi ? 'महंगाई प्रभाव एवं भविष्य मूल्य स्लिप' : 'Inflation & Purchasing Power Slip',
      type: 'Future Cost Projection',
      mainResult: formatCurrency(futureInflatedCost),
      resultLabel: isHindi ? 'भविष्य में आवश्यक अनुमानित लागत' : 'Future Inflated Cost',
      items: [
        { label: isHindi ? 'वर्तमान लागत' : 'Current Cost Today', value: formatCurrency(goalTargetTodayNum), isBold: true },
        { label: isHindi ? 'वार्षिक अनुमानित महंगाई दर' : 'Annual Inflation Rate', value: `${inflationRateNum}% p.a.` },
        { label: isHindi ? 'समय सीमा' : 'Time Horizon', value: `${goalYearsNum} Years` },
        { label: isHindi ? 'महंगाई के कारण अतिरिक्त भार' : 'Extra Inflation Burden', value: `+${formatCurrency(extraInflationBurden)}`, isHighlight: true },
        { label: isHindi ? 'भविष्य की कुल लागत' : 'Future Inflated Target', value: formatCurrency(futureInflatedCost), isBold: true, isHighlight: true },
        { label: isHindi ? 'आवश्यक मासिक SIP (यदि निवेश करें)' : 'Required Monthly SIP Target', value: formatCurrency(requiredMonthlySIP) }
      ]
    };
  };

  const handlePrintCurrent = () => {
    const params = getCurrentCalcParams();
    printCalculatorSlip(params);
    triggerHapticSound('click');
  };

  const handleDownloadCurrent = () => {
    const params = getCurrentCalcParams();
    downloadCalculatorSlipHTML(params);
    triggerHapticSound('save');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-150 pb-16 text-left" id="calculator-page-container">
      {/* Top Header Bar: Clean, Minimal, Fast */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-md">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 sm:mt-0 p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="Back to Ledger"
            id="calc-back-to-home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="text-[16px] sm:text-[19px] font-bold text-[var(--theme-text,#F8FAFC)] flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="truncate">{isHindi ? 'वित्तीय कैलकुलेटर' : 'Financial Calculator'}</span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] px-1.5 sm:px-2 py-0.5 rounded-md border border-[var(--theme-primary,#38BDF8)]/30 shrink-0">
                PRO • CUSTOM
              </span>
            </h1>
            <p className="text-[10.5px] sm:text-[11px] text-[#94A3B8] leading-tight mt-0.5 sm:mt-0 line-clamp-2 sm:line-clamp-none">
              {isHindi ? 'अनलिमिटेड कस्टम इनपुट, शून्य पाबंदी एवं रीयल-टाइम गणना' : 'Custom inputs with zero limits, flexible rates & instant projections'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-0 border-[var(--theme-border,#213E61)]/50 pt-2.5 sm:pt-0 mt-0.5 sm:mt-0">
          <button
            type="button"
            onClick={handlePrintCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] font-bold text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="Print Calculation Slip"
            id="calc-print-slip-btn"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
            <span className="hidden sm:inline">{isHindi ? 'प्रिंट स्लिप' : 'Print Slip'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] font-bold text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="Download Calculation PDF"
            id="calc-download-pdf-btn"
          >
            <FileDown className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] text-[12px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 ml-auto sm:ml-0"
          >
            <span>{isHindi ? 'खाता' : 'Ledger'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
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
                    : 'text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)]'
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
      {/* 1. STANDARD ARITHMETIC CALCULATOR (ENLARGED & HIGH VISIBILITY) */}
      {/* ========================================================================= */}
      {activeTab === 'standard' && (
        <div className={`mx-auto bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 transition-all ${
          calcScale === 'jumbo' ? 'max-w-3xl' : calcScale === 'large' ? 'max-w-2xl' : 'max-w-md'
        }`}>
          {/* Top Bar: Size Toggle & History & Print/PDF */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] font-mono text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs"
                title="View Calculation Tape / History"
              >
                <History className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{calcHistory.length > 0 ? `Tape (${calcHistory.length})` : (isHindi ? 'हिस्ट्री' : 'History')}</span>
              </button>

              <button
                type="button"
                onClick={handlePrintCurrent}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] font-mono text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95"
                title="Print Calculation Slip"
                id="calc-std-print-btn"
              >
                <Printer className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span className="hidden xs:inline">{isHindi ? 'प्रिंट' : 'Print'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCurrent}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] font-mono text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95"
                title="Download Calculation PDF"
                id="calc-std-pdf-btn"
              >
                <FileDown className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span className="hidden xs:inline">PDF</span>
              </button>
            </div>

            {/* Size / Zoom Switcher */}
            <div className="flex items-center gap-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-1 rounded-xl">
              <span className="text-[10px] font-bold text-[#64748B] px-1.5 uppercase tracking-wider hidden sm:inline">
                {isHindi ? 'साइज:' : 'Size:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCalcScale('normal');
                  triggerHapticSound('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  calcScale === 'normal'
                    ? 'bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] border border-[var(--theme-border,#213E61)] shadow-xs'
                    : 'text-[#64748B] hover:text-[#CBD5E1]'
                }`}
              >
                {isHindi ? 'सामान्य' : 'Normal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalcScale('large');
                  triggerHapticSound('click');
                }}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                  calcScale === 'large'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                {isHindi ? 'बड़ा (Large)' : 'Large'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalcScale('jumbo');
                  triggerHapticSound('click');
                }}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                  calcScale === 'jumbo'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                {isHindi ? 'अतिरिक्त बड़ा (XL)' : 'Extra Large (XL)'}
              </button>
            </div>
          </div>

          {/* LCD / OLED Display Screen */}
          <div className={`p-4 sm:p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] shadow-inner space-y-1 text-right relative overflow-hidden transition-all ${
            calcScale === 'jumbo' ? 'min-h-[150px]' : calcScale === 'large' ? 'min-h-[135px]' : 'min-h-[105px]'
          }`}>
            <div className="flex items-center justify-between text-[#94A3B8]">
              {memoryVal !== 0 ? (
                <span className="text-[11px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/15 px-2 py-0.5 rounded-md border border-[var(--theme-primary,#38BDF8)]/30">
                  MEMORY: {memoryVal}
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#64748B]">CALCULATOR READY</span>
              )}

              <div className={`font-mono text-[#94A3B8] overflow-x-auto whitespace-nowrap custom-scrollbar pl-3 font-semibold ${
                calcScale === 'jumbo' ? 'text-[17px]' : calcScale === 'large' ? 'text-[16px]' : 'text-[14px]'
              }`}>
                {stdExpr || '0'}
              </div>
            </div>

            {/* Main Result Number */}
            <div className={`font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] tracking-tight truncate select-all transition-all py-1 ${
              calcScale === 'jumbo'
                ? 'text-[46px] sm:text-[60px] md:text-[72px]'
                : calcScale === 'large'
                ? 'text-[42px] sm:text-[54px] md:text-[64px]'
                : 'text-[28px] sm:text-[34px] md:text-[40px]'
            }`}>
              {privacyMask ? `${getCurrencyConfig(getCurrentLanguage()).symbol} ****` : (stdLiveResult || '0')}
            </div>

            {/* Indian Lakhs/Crores Word Indicator */}
            {parseFloat(stdLiveResult) > 0 && (
              <div className="text-[12px] sm:text-[13px] font-mono font-bold text-[#10B981] flex items-center justify-end gap-1 pt-0.5">
                <span>≈ {getCurrencyConfig(getCurrentLanguage()).symbol} {parseFloat(stdLiveResult).toLocaleString('en-IN')}</span>
                {formatIndianWords(parseFloat(stdLiveResult)) && (
                  <span className="bg-[#10B981]/15 px-2 py-0.5 rounded text-[#10B981] border border-[#10B981]/30">
                    ({formatIndianWords(parseFloat(stdLiveResult))})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* History Tape Drawer */}
          {showHistory && (
            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5 animate-in fade-in max-h-52 overflow-y-auto custom-scrollbar text-[13px] font-mono">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#64748B] border-b border-[var(--theme-border,#213E61)] pb-1.5">
                <span className="text-[#94A3B8]">RECENT CALCULATION TAPE</span>
                <button
                  onClick={() => setCalcHistory([])}
                  className="text-[#EF4444] hover:brightness-125 transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
              {calcHistory.length === 0 ? (
                <div className="text-[#64748B] text-center py-3 text-[12px]">No calculation history yet</div>
              ) : (
                calcHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setStdExpr(item.res);
                      setStdLiveResult(item.res);
                      triggerHapticSound('click');
                    }}
                    className="flex justify-between items-center p-2 rounded-xl hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer text-[#CBD5E1] border border-transparent hover:border-[var(--theme-border,#213E61)]"
                  >
                    <span className="text-[#94A3B8] truncate max-w-[200px]">{item.expr}</span>
                    <span className="font-bold text-[var(--theme-primary,#38BDF8)] text-[14px]">= {item.res}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Memory Functions Row (Large & Touch-Friendly) */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold">
            <button
              onClick={() => {
                setMemoryVal(0);
                triggerHapticSound('click');
              }}
              className={`rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 ${
                calcScale === 'jumbo' ? 'py-3.5 text-[15px]' : calcScale === 'large' ? 'py-3 text-[13.5px]' : 'py-2 text-[11px]'
              }`}
            >
              MC
            </button>
            <button
              onClick={() => {
                handleKeypadPress(memoryVal.toString());
                triggerHapticSound('click');
              }}
              className={`rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 ${
                calcScale === 'jumbo' ? 'py-3.5 text-[15px]' : calcScale === 'large' ? 'py-3 text-[13.5px]' : 'py-2 text-[11px]'
              }`}
            >
              MR {memoryVal !== 0 && `(${memoryVal})`}
            </button>
            <button
              onClick={() => {
                const cur = parseFloat(stdLiveResult) || 0;
                setMemoryVal((prev) => prev + cur);
                triggerHapticSound('click');
              }}
              className={`rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shadow-xs active:scale-95 ${
                calcScale === 'jumbo' ? 'py-3.5 text-[15px]' : calcScale === 'large' ? 'py-3 text-[13.5px]' : 'py-2 text-[11px]'
              }`}
            >
              M+
            </button>
            <button
              onClick={() => {
                const cur = parseFloat(stdLiveResult) || 0;
                setMemoryVal((prev) => prev - cur);
                triggerHapticSound('click');
              }}
              className={`rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-bg,#070E18)] text-[#EF4444] border border-[var(--theme-border,#213E61)] hover:border-[#EF4444] transition-all cursor-pointer shadow-xs active:scale-95 ${
                calcScale === 'jumbo' ? 'py-3.5 text-[15px]' : calcScale === 'large' ? 'py-3 text-[13.5px]' : 'py-2 text-[11px]'
              }`}
            >
              M-
            </button>
          </div>

          {/* Keypad Grid (Touch-friendly & proportional) */}
          <div className={`grid grid-cols-4 ${
            calcScale === 'jumbo' ? 'gap-3 sm:gap-4' : calcScale === 'large' ? 'gap-2.5 sm:gap-3.5' : 'gap-1.5 sm:gap-2'
          }`}>
            {[
              { label: 'C', val: 'C', cls: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 hover:bg-[#EF4444]/30' },
              { label: '⌫', val: '⌫', cls: 'bg-[var(--theme-surface,#0E1A29)] text-[#F59E0B] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-bg,#070E18)]' },
              { label: '%', val: '%', cls: 'bg-[var(--theme-surface,#0E1A29)] text-[#38BDF8] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-bg,#070E18)]' },
              { label: '÷', val: '÷', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.22))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.5))] font-black' },

              { label: '7', val: '7' },
              { label: '8', val: '8' },
              { label: '9', val: '9' },
              { label: '×', val: '×', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.22))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.5))] font-black' },

              { label: '4', val: '4' },
              { label: '5', val: '5' },
              { label: '6', val: '6' },
              { label: '−', val: '−', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.22))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.5))] font-black' },

              { label: '1', val: '1' },
              { label: '2', val: '2' },
              { label: '3', val: '3' },
              { label: '+', val: '+', cls: 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.22))] text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary-border,rgba(56,189,248,0.5))] font-black' },

              { label: '0', val: '0' },
              { label: '00', val: '00' },
              { label: '.', val: '.' },
              { label: '=', val: '=', cls: 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-black shadow-lg border-transparent hover:brightness-115 active:scale-95' }
            ].map((btn, idx) => {
              const heightClass =
                calcScale === 'jumbo'
                  ? 'h-19 sm:h-23 md:h-25 text-[29px] sm:text-[35px] md:text-[39px] rounded-2xl sm:rounded-3xl'
                  : calcScale === 'large'
                  ? 'h-17 sm:h-20 md:h-22 text-[26px] sm:text-[31px] md:text-[35px] rounded-2xl'
                  : 'h-11 sm:h-13 text-[17px] sm:text-[20px] rounded-xl';

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleKeypadPress(btn.val)}
                  className={`${heightClass} font-mono font-bold flex items-center justify-center transition-all cursor-pointer active:scale-90 select-none shadow-md border ${
                    btn.cls ||
                    'bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-surface,#0E1A29)] hover:border-[var(--theme-primary,#38BDF8)]/50'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Quick 1-Click Send to Ledger Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const num = parseFloat(stdLiveResult) || 0;
                if (onApplyToIncome && num > 0) {
                  onApplyToIncome(num);
                }
              }}
              className="py-3.5 sm:py-4 px-4 rounded-2xl bg-[#10B981]/15 border-2 border-[#10B981]/40 hover:border-[#10B981] hover:bg-[#10B981]/25 text-[#10B981] font-extrabold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
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
              className="py-3.5 sm:py-4 px-4 rounded-2xl bg-[#EF4444]/15 border-2 border-[#EF4444]/40 hover:border-[#EF4444] hover:bg-[#EF4444]/25 text-[#EF4444] font-extrabold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <MinusCircle className="w-5 h-5 shrink-0" />
              <span>{isHindi ? 'खर्च में जोड़ें (-)' : 'Send to Expense (-)'}</span>
            </button>
          </div>

          {/* Copy Result & Keyboard Help Note */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-[12px] font-mono text-[#94A3B8]">
            <span className="text-[#64748B] text-[11px] hidden sm:inline">
              Keyboard: 0-9, +, -, *, /, Enter, Backspace, Esc
            </span>

            <button
              type="button"
              onClick={() => handleCopy(stdLiveResult, 'std')}
              className="ml-auto text-[12px] font-mono text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1.5 cursor-pointer transition-colors p-1"
            >
              {copiedKey === 'std' ? <Check className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" /> : <Copy className="w-4 h-4" />}
              <span className="font-bold">{copiedKey === 'std' ? 'Copied to Clipboard!' : 'Copy Result'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 6-FUND SPLIT FORMULA */}
      {/* ========================================================================= */}
      {activeTab === 'funds' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? '6-फंड आय विभाजन (कस्टम राशि)' : '6-Fund Income Split Allocation'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {isHindi ? 'किसी भी राशि को 6 आवश्यक फंड्स में सीधे बांटें (असीमित इनपुट)' : 'Divide any custom income across 6 funds with zero amount restrictions.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFundSliders(!showFundSliders)}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showFundSliders ? 'Hide Sliders' : 'Custom % Weights'}</span>
            </button>
          </div>

          {/* Amount Inflow Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11.5px]">
              <label className="font-bold text-[#CBD5E1]">
                {isHindi ? `कुल आय / इनफ्लो राशि (${getCurrencyConfig(getCurrentLanguage()).symbol}):` : `Total Inflow Amount (${getCurrencyConfig(getCurrentLanguage()).symbol}):`}
              </label>
              {fundInflowNum > 0 && (
                <span className="font-mono text-[11px] text-[var(--theme-primary,#38BDF8)] font-bold">
                  {formatIndianWords(fundInflowNum)}
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
              <input
                type="number"
                min="0"
                step="any"
                value={fundAmountInput}
                onChange={(e) => setFundAmountInput(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[22px] font-mono font-bold rounded-xl pl-10 pr-4 py-2.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none shadow-inner"
                placeholder="50000"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[10000, 25000, 50000, 100000, 250000, 500000, 1000000, 5000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setFundAmountInput(amt.toString());
                    triggerHapticSound('click');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[11.5px] font-mono text-[#CBD5E1] transition-colors cursor-pointer"
                >
                  {getCurrencyConfig(getCurrentLanguage()).symbol}{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders / Custom Weights */}
          {showFundSliders && (
            <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="font-bold text-[#CBD5E1]">Adjust Fund % Weights:</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${isFundBalanced ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    Total: {totalFundPct}% {isFundBalanced ? '✓' : '(Must equal 100%)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFundCustomPct(DEFAULT_PERCENTAGES)}
                    className="text-[10px] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] underline cursor-pointer"
                  >
                    Reset (55/10/10/10/10/5)
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FUND_ORDER.map((f) => (
                  <div key={f} className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-[#CBD5E1] truncate">{FUND_LABELS[f]}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={fundCustomPct[f]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFundCustomPct((prev) => ({ ...prev, [f]: val }));
                          }}
                          className="w-12 text-right bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] font-mono font-bold text-[11px] rounded px-1 py-0.5 outline-none"
                        />
                        <span className="text-[10px] text-[#94A3B8] font-mono">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
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
                      <div className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                        {FUND_LABELS[fund]}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">
                        {pct}% allocation
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-mono font-bold text-[var(--theme-text,#F8FAFC)]">
                      {privacyMask ? `${getCurrencyConfig(getCurrentLanguage()).symbol} ****` : formatCurrency(allocatedAmt)}
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
                if (fundInflowNum > 0) onApplyToIncome(fundInflowNum);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record {getCurrencyConfig(getCurrentLanguage()).symbol}{fundInflowNum.toLocaleString('en-IN')} Inflow in Khata</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SIP & COMPOUND WEALTH (UNLIMITED CUSTOM INPUTS) */}
      {/* ========================================================================= */}
      {activeTab === 'sip' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{isHindi ? 'SIP एवं वेल्थ कम्पाउंडर' : 'SIP & Wealth Compounder'}</span>
                <span className="text-[10px] bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] font-mono px-1.5 py-0.5 rounded border border-[var(--theme-primary,#38BDF8)]/30">
                  UNLIMITED
                </span>
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {isHindi ? 'बिना किसी पाबंदी के कोई भी राशि, रिटर्न % और समयावधि सीधे टाइप करें' : 'Type custom amounts of any size, return rate %, and tenure years.'}
              </p>
            </div>

            <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
              <button
                type="button"
                onClick={() => setSipMode('sip')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  sipMode === 'sip'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold'
                    : 'text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
              >
                Monthly SIP
              </button>
              <button
                type="button"
                onClick={() => setSipMode('lumpsum')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  sipMode === 'lumpsum'
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold'
                    : 'text-[#94A3B8] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
              >
                Lumpsum
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount Input */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">
                  {sipMode === 'sip' ? `Monthly Investment (${getCurrencyConfig(getCurrentLanguage()).symbol})` : `One-Time Lumpsum (${getCurrencyConfig(getCurrentLanguage()).symbol})`}
                </span>
                {sipAmtNum > 0 && (
                  <span className="font-mono text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">
                    {formatIndianWords(sipAmtNum)}
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={sipAmountInput}
                  onChange={(e) => setSipAmountInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[16px] font-mono font-bold rounded-lg pl-7 pr-2 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                  placeholder="5000"
                />
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSipAmountInput(amt.toString())}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {getCurrencyConfig(getCurrentLanguage()).symbol}{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Return Rate */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Expected Return (% p.a.)</span>
                <span className="font-mono text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Annual CAGR</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={sipRateInput}
                  onChange={(e) => setSipRateInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] text-[16px] font-mono font-bold rounded-lg px-3 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                  placeholder="12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                  %
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[8, 12, 15, 18, 24].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSipRateInput(rate.toString())}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Time Period (Years)</span>
                <span className="font-mono text-[10.5px] text-[#F59E0B] font-bold">
                  {Math.round(sipTenureNum * 12)} Months
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  step="1"
                  value={sipTenureInput}
                  onChange={(e) => setSipTenureInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] text-[16px] font-mono font-bold rounded-lg px-3 py-1.5 focus:border-[#F59E0B] focus:outline-none"
                  placeholder="10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-mono font-bold text-[#F59E0B]">
                  Yrs
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[1, 3, 5, 10, 15, 20, 25, 30].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSipTenureInput(yr.toString())}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[#F59E0B] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {yr}Y
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Step-up SIP */}
          {sipMode === 'sip' && (
            <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#EAB308]" />
                <span className="text-[12px] font-bold text-[#CBD5E1]">
                  Annual Step-Up Increment (%):
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 5, 10, 15, 20].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setSipStepUpInput(step.toString())}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      parseFloat(sipStepUpInput) === step
                        ? 'bg-[#EAB308] text-[#070E18]'
                        : 'bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] border border-[var(--theme-border,#213E61)]'
                    }`}
                  >
                    {step}%
                  </button>
                ))}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={sipStepUpInput}
                  onChange={(e) => setSipStepUpInput(e.target.value)}
                  placeholder="Custom %"
                  className="w-16 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-mono text-[11px] rounded px-2 py-1 outline-none text-right"
                />
              </div>
            </div>
          )}

          {/* Outcome Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center">
            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#94A3B8] font-bold">Invested Amount</div>
              <div className="text-[16px] font-mono font-bold text-[var(--theme-text,#F8FAFC)] mt-0.5">
                {formatCurrency(Math.round(sipCalculation.totalInvested))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#10B981] font-bold">Est. Wealth Gains</div>
              <div className="text-[16px] font-mono font-bold text-[#10B981] mt-0.5">
                +{formatCurrency(Math.round(sipCalculation.totalGain))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#8B5CF6] font-bold">Wealth Multiplier</div>
              <div className="text-[16px] font-mono font-bold text-[#8B5CF6] mt-0.5">
                {sipCalculation.multiplier}x
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30">
              <div className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Total Future Value</div>
              <div className="text-[18px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                {formatCurrency(Math.round(sipCalculation.totalValue))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LOAN EMI CALCULATOR (UNLIMITED PRINCIPAL & CUSTOM TENURE) */}
      {/* ========================================================================= */}
      {activeTab === 'emi' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
            <h2 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <span>{isHindi ? 'लोन EMI एवं ब्याज गणना' : 'Loan EMI & Interest Calculator'}</span>
              <span className="text-[10px] bg-[#8B5CF6]/15 text-[#8B5CF6] font-mono px-1.5 py-0.5 rounded border border-[#8B5CF6]/30">
                FLEXIBLE
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              {isHindi ? 'होम, कार या पर्सनल लोन के लिए कोई भी मूलधन, ब्याज दर और अवधि दर्ज करें' : 'Custom Principal amounts, fractional interest rates, and loan durations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Principal */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Principal Loan ({getCurrencyConfig(getCurrentLanguage()).symbol})</span>
                {loanPrincipalNum > 0 && (
                  <span className="font-mono text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">
                    {formatIndianWords(loanPrincipalNum)}
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={loanPrincipalInput}
                  onChange={(e) => setLoanPrincipalInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[16px] font-mono font-bold rounded-lg pl-7 pr-2 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                  placeholder="500000"
                />
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[100000, 500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLoanPrincipalInput(amt.toString())}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {getCurrencyConfig(getCurrentLanguage()).symbol}{amt >= 10000000 ? `${amt / 10000000}Cr` : `${amt / 100000}L`}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Interest Rate (% p.a.)</span>
                <span className="font-mono text-[10.5px] text-[#8B5CF6] font-bold">Per Annum</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.05"
                  value={loanRateInput}
                  onChange={(e) => setLoanRateInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#8B5CF6] text-[16px] font-mono font-bold rounded-lg px-3 py-1.5 focus:border-[#8B5CF6] focus:outline-none"
                  placeholder="9.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-mono font-bold text-[#8B5CF6]">
                  %
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[6.5, 8.5, 9.5, 11.5, 14.0].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLoanRateInput(r.toString())}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[#8B5CF6] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#CBD5E1] font-bold">Tenure Duration</span>
                <div className="flex rounded bg-[var(--theme-card,#132438)] p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setLoanTenureUnit('years')}
                    className={`px-1.5 py-0.5 rounded ${loanTenureUnit === 'years' ? 'bg-[#F59E0B] text-[#070E18]' : 'text-[#94A3B8]'}`}
                  >
                    Yrs
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanTenureUnit('months')}
                    className={`px-1.5 py-0.5 rounded ${loanTenureUnit === 'months' ? 'bg-[#F59E0B] text-[#070E18]' : 'text-[#94A3B8]'}`}
                  >
                    Mos
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="600"
                  step="1"
                  value={loanTenureInput}
                  onChange={(e) => setLoanTenureInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] text-[16px] font-mono font-bold rounded-lg px-3 py-1.5 focus:border-[#F59E0B] focus:outline-none"
                  placeholder="5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-mono font-bold text-[#F59E0B]">
                  {loanTenureUnit === 'years' ? 'Years' : 'Months'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[1, 3, 5, 7, 10, 15, 20, 25, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setLoanTenureUnit('years');
                      setLoanTenureInput(t.toString());
                    }}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[#F59E0B] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {t}Y
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center">
            <div className="p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30">
              <div className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Monthly EMI</div>
              <div className="text-[18px] font-mono font-extrabold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                {formatCurrency(Math.round(emiCalculation.monthlyEmi))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#EF4444] font-bold">Total Interest ({emiCalculation.interestPct}%)</div>
              <div className="text-[16px] font-mono font-bold text-[#EF4444] mt-0.5">
                {formatCurrency(Math.round(emiCalculation.totalInterest))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#94A3B8] font-bold">Principal Loan ({emiCalculation.principalPct}%)</div>
              <div className="text-[16px] font-mono font-bold text-[var(--theme-text,#F8FAFC)] mt-0.5">
                {formatCurrency(Math.round(loanPrincipalNum))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)]">
              <div className="text-[10.5px] text-[#10B981] font-bold">Total Repayment</div>
              <div className="text-[16px] font-mono font-bold text-[#10B981] mt-0.5">
                {formatCurrency(Math.round(emiCalculation.totalPayment))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GST TAX SPLITTER (CUSTOM % & INTRA/INTER-STATE SUPPORT) */}
      {/* ========================================================================= */}
      {activeTab === 'gst' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{isHindi ? 'GST टैक्स कैलकुलेटर' : 'GST & Tax Invoice Splitter'}</span>
                <span className="text-[10px] bg-[#EC4899]/15 text-[#EC4899] font-mono px-1.5 py-0.5 rounded border border-[#EC4899]/30">
                  CUSTOM SLAB
                </span>
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {isHindi ? 'कोई भी कस्टम GST % दर्ज करें (0.25%, 5%, 12%, 18%, 28%, 40% आदि) और CGST/SGST/IGST ब्रेकडाउन देखें' : 'Enter custom GST percentages, CGST/SGST split, or IGST with instant invoice calculations.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
                <button
                  type="button"
                  onClick={() => setGstType('exclusive')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    gstType === 'exclusive' ? 'bg-[#EC4899] text-white' : 'text-[#94A3B8]'
                  }`}
                >
                  + Add GST (Net)
                </button>
                <button
                  type="button"
                  onClick={() => setGstType('inclusive')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    gstType === 'inclusive' ? 'bg-[#EC4899] text-white' : 'text-[#94A3B8]'
                  }`}
                >
                  - Extract GST (MRP)
                </button>
              </div>

              <div className="flex rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] p-0.5">
                <button
                  type="button"
                  onClick={() => setGstTaxType('intra')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    gstTaxType === 'intra' ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]' : 'text-[#94A3B8]'
                  }`}
                >
                  Intra (CGST+SGST)
                </button>
                <button
                  type="button"
                  onClick={() => setGstTaxType('inter')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    gstTaxType === 'inter' ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]' : 'text-[#94A3B8]'
                  }`}
                >
                  Inter (IGST)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11.5px]">
                <label className="font-bold text-[#CBD5E1]">
                  {gstType === 'exclusive' ? `Base Net Amount (${getCurrencyConfig(getCurrentLanguage()).symbol}):` : `Gross MRP Amount (${getCurrencyConfig(getCurrentLanguage()).symbol}):`}
                </label>
                {gstAmountNum > 0 && (
                  <span className="font-mono text-[10.5px] text-[#EC4899] font-bold">
                    {formatIndianWords(gstAmountNum)}
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] font-mono font-bold text-[#EC4899]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={gstAmountInput}
                  onChange={(e) => setGstAmountInput(e.target.value)}
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[18px] font-mono font-bold rounded-xl pl-8 pr-4 py-2 focus:border-[#EC4899] focus:outline-none"
                  placeholder="10000"
                />
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {[1000, 5000, 10000, 25000, 50000, 100000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setGstAmountInput(amt.toString())}
                    className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[#EC4899] border border-[var(--theme-border,#213E61)] cursor-pointer"
                  >
                    {getCurrencyConfig(getCurrentLanguage()).symbol}{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* GST Slab Rates + Custom */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11.5px]">
                <label className="font-bold text-[#CBD5E1]">GST Rate Slab:</label>
                <span className="font-mono text-[11px] font-bold text-[#EC4899]">
                  Applied: {effectiveGstSlab}%
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {[0, 3, 5, 12, 18, 28].map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setGstSlabMode(slab)}
                    className={`py-2 rounded-xl text-[12px] font-mono font-bold border transition-colors cursor-pointer ${
                      gstSlabMode === slab
                        ? 'bg-[#EC4899] text-white border-transparent'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[#CBD5E1]'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>

              {/* Custom GST % Input Box */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setGstSlabMode('custom')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    gstSlabMode === 'custom'
                      ? 'bg-[#EC4899] text-white border-transparent'
                      : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[#94A3B8]'
                  }`}
                >
                  Custom %:
                </button>
                <div className="relative flex-1">
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
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-mono text-[13px] font-bold rounded-lg px-3 py-1.5 focus:border-[#EC4899] outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-mono text-[#94A3B8]">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5 font-mono text-[13px]">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Net Base Price:</span>
              <span className="font-bold text-[var(--theme-text,#F8FAFC)]">{getCurrencyConfig(getCurrentLanguage()).symbol}{gstBase.toFixed(2)}</span>
            </div>

            {gstTaxType === 'intra' ? (
              <>
                <div className="flex justify-between text-[#EC4899]/80 text-[12px]">
                  <span>CGST ({effectiveGstSlab / 2}%):</span>
                  <span className="font-bold">+{getCurrencyConfig(getCurrentLanguage()).symbol}{gstCgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#EC4899]/80 text-[12px]">
                  <span>SGST ({effectiveGstSlab / 2}%):</span>
                  <span className="font-bold">+{getCurrencyConfig(getCurrentLanguage()).symbol}{gstSgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-[#EC4899] text-[12px]">
                <span>IGST ({effectiveGstSlab}%):</span>
                <span className="font-bold">+{getCurrencyConfig(getCurrentLanguage()).symbol}{gstIgst.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#EC4899] border-t border-[var(--theme-border,#213E61)] pt-1.5">
              <span className="font-bold">Total GST Tax ({effectiveGstSlab}%):</span>
              <span className="font-bold">+{getCurrencyConfig(getCurrentLanguage()).symbol}{gstTotalTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[var(--theme-text,#F8FAFC)] border-t border-[var(--theme-border,#213E61)] pt-2 text-[16px]">
              <span className="font-bold">Total Final Gross Price:</span>
              <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}{gstFinalGross.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DISCOUNT & MARGIN CALCULATOR (UNLIMITED CUSTOM VALUES) */}
      {/* ========================================================================= */}
      {activeTab === 'discount' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--theme-border,#213E61)] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'छूट एवं मार्जिन' : 'Discount & Profit Margin'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {isHindi ? 'बिक्री छूट या प्रॉफिट मार्जिन और मार्कअप प्रतिशत की कस्टम गणना' : 'Custom sale discounts or retail markup profit margin calculations.'}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Original MRP ({getCurrencyConfig(getCurrentLanguage()).symbol}):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={discOriginalPriceInput}
                    onChange={(e) => setDiscOriginalPriceInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11.5px]">
                    <span className="font-bold text-[#CBD5E1]">Discount %:</span>
                    <span className="font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{discPctNum}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discPercentInput}
                    onChange={(e) => {
                      setDiscPercentInput(e.target.value);
                      setDiscFlatAmountInput('0');
                    }}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Or Flat Discount ({getCurrencyConfig(getCurrentLanguage()).symbol}):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={discFlatAmountInput}
                    onChange={(e) => {
                      setDiscFlatAmountInput(e.target.value);
                      setDiscPercentInput('0');
                    }}
                    placeholder="0"
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 font-mono text-[13px]">
                <div className="flex justify-between text-[var(--theme-primary,#38BDF8)]">
                  <span>Discount Saved ({effectiveDiscPct.toFixed(1)}%):</span>
                  <span className="font-bold">-{getCurrencyConfig(getCurrentLanguage()).symbol}{discSaved.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--theme-text,#F8FAFC)] border-t border-[var(--theme-border,#213E61)] pt-2 text-[16px]">
                  <span className="font-bold">Final Payable Price:</span>
                  <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}{discFinal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Cost Price (CP {getCurrencyConfig(getCurrentLanguage()).symbol}):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={costPriceInput}
                    onChange={(e) => setCostPriceInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">Selling Price (SP {getCurrencyConfig(getCurrentLanguage()).symbol}):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sellingPriceInput}
                    onChange={(e) => setSellingPriceInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[16px] font-mono font-bold rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 font-mono text-[13px]">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Gross Profit:</span>
                  <span className={`font-bold ${grossProfit >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{getCurrencyConfig(getCurrentLanguage()).symbol}{grossProfit.toFixed(2)}</span>
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
      {/* 7. INFLATION & FUTURE GOAL HORIZON (UNLIMITED CUSTOM AMOUNTS) */}
      {/* ========================================================================= */}
      {activeTab === 'inflation' && (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-[var(--theme-border,#213E61)] pb-3">
            <h2 className="text-[16px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <span>{isHindi ? 'मुद्रास्फीति एवं भविष्य लक्ष्य' : 'Inflation & Goal Horizon Planner'}</span>
              <span className="text-[10px] bg-[#EAB308]/15 text-[#EAB308] font-mono px-1.5 py-0.5 rounded border border-[#EAB308]/30">
                CUSTOM GOALS
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              {isHindi ? 'भविष्य की महंगाई दर और किसी भी लक्ष्य की सटीक लागत व आवश्यक SIP की गणना' : 'Calculate true future inflated cost of goals and exact monthly SIP needed to achieve it.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Goal Name */}
            <div className="space-y-1 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <label className="text-[11.5px] font-bold text-[#CBD5E1]">Goal Name:</label>
              <input
                type="text"
                value={goalNameInput}
                onChange={(e) => setGoalNameInput(e.target.value)}
                className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[13px] font-bold rounded-lg px-3 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] outline-none"
                placeholder="e.g. Higher Education / Car / Flat"
              />
            </div>

            {/* Today's Cost */}
            <div className="space-y-1 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <label className="font-bold text-[#CBD5E1]">Today's Cost ({getCurrencyConfig(getCurrentLanguage()).symbol}):</label>
                {goalTargetTodayNum > 0 && (
                  <span className="font-mono text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">
                    {formatIndianWords(goalTargetTodayNum)}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">{getCurrencyConfig(getCurrentLanguage()).symbol}</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={goalTargetTodayInput}
                  onChange={(e) => setGoalTargetTodayInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[15px] font-mono font-bold rounded-lg pl-6 pr-2 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] outline-none"
                  placeholder="1000000"
                />
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="space-y-1 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <label className="font-bold text-[#CBD5E1]">Inflation Rate (% p.a.):</label>
                <span className="font-mono text-[10.5px] text-[#F59E0B] font-bold">Annual</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={inflationRateInput}
                  onChange={(e) => setInflationRateInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] text-[15px] font-mono font-bold rounded-lg px-3 py-1.5 focus:border-[#F59E0B] outline-none"
                  placeholder="6.5"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[13px] font-mono font-bold text-[#F59E0B]">
                  %
                </span>
              </div>
            </div>

            {/* Time Horizon (Years) */}
            <div className="space-y-1 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
              <div className="flex justify-between items-center text-[11.5px]">
                <label className="font-bold text-[#CBD5E1]">Target Horizon:</label>
                <span className="font-mono text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">
                  {Math.round(goalYearsNum * 12)} Mos
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  step="1"
                  value={goalYearsInput}
                  onChange={(e) => setGoalYearsInput(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] text-[15px] font-mono font-bold rounded-lg px-3 py-1.5 focus:border-[var(--theme-primary,#38BDF8)] outline-none"
                  placeholder="7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
                  Yrs
                </span>
              </div>
            </div>
          </div>

          {/* Quick preset chips for Goal Cost */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#94A3B8]">
            <span className="font-bold text-[#CBD5E1]">Quick Presets:</span>
            {[200000, 500000, 1000000, 2500000, 5000000, 10000000, 50000000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setGoalTargetTodayInput(amt.toString())}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--theme-surface,#0E1A29)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] cursor-pointer"
              >
                {getCurrencyConfig(getCurrentLanguage()).symbol}{amt >= 10000000 ? `${amt / 10000000}Cr` : `${amt / 100000}L`}
              </button>
            ))}
          </div>

          {/* Return Rate Custom Input */}
          <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="text-[12px] font-bold text-[#CBD5E1]">
                Expected Investment Return Rate (% p.a.):
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[8, 10, 12, 14, 16].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setGoalExpectedReturnInput(r.toString())}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    parseFloat(goalExpectedReturnInput) === r
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                      : 'bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] border border-[var(--theme-border,#213E61)]'
                  }`}
                >
                  {r}%
                </button>
              ))}
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={goalExpectedReturnInput}
                onChange={(e) => setGoalExpectedReturnInput(e.target.value)}
                placeholder="12"
                className="w-16 bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] font-mono text-[11px] font-bold rounded px-2 py-1 outline-none text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-center">
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[#EF4444]/30">
              <div className="text-[10.5px] text-[#EF4444] font-bold">Future Cost in {goalYearsNum} Yrs</div>
              <div className="text-[17px] font-mono font-bold text-[var(--theme-text,#F8FAFC)] mt-0.5">
                {formatCurrency(Math.round(futureInflatedCost))}
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">
                (+{formatCurrency(Math.round(extraInflationBurden))} inflation)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/30">
              <div className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Required Monthly SIP</div>
              <div className="text-[17px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                {formatCurrency(Math.round(requiredMonthlySIP))}<span className="text-[11px] font-normal text-[#94A3B8]"> /mo</span>
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">
                @ {goalReturnNum}% p.a.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/30">
              <div className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] font-bold">Or One-time Lumpsum Today</div>
              <div className="text-[17px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">
                {formatCurrency(Math.round(requiredLumpsumToday))}
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">
                Invested for {goalYearsNum} yrs
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
              <span>Create Goal for {formatCurrency(Math.round(futureInflatedCost))} in Khata</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
