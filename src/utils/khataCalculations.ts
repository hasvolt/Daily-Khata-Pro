import { Entry, FundType } from '../types';
import { FUND_ORDER } from '../data/defaults';
import confetti from 'canvas-confetti';

export const formatCurrency = (n: number, mask: boolean = false): string => {
  if (mask) {
    return '₹ •••••';
  }
  const isNegative = n < 0;
  const abs = Math.abs(Math.round(n));
  return (isNegative ? '-₹' : '₹') + abs.toLocaleString('en-IN');
};

export const formatPercent = (n: number): string => {
  return `${Number(n.toFixed(2))}%`;
};

export const getTodayISO = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const splitIncome = (
  amount: number,
  percentages: Record<FundType, number>
): Record<FundType, number> => {
  const result: Record<FundType, number> = {
    personal: 0,
    family: 0,
    buffer: 0,
    emergency: 0,
    saving: 0,
    investment: 0
  };

  let running = 0;
  const keys = FUND_ORDER;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const pct = percentages[k] || 0;
    const v = Math.round(amount * (pct / 100));
    result[k] = v;
    running += v;
  }

  // Ensure last fund takes remainder so total sum is mathematically exact
  const lastKey = keys[keys.length - 1];
  result[lastKey] = Math.round(amount) - running;

  return result;
};

export const calculateFundSplits = splitIncome;

export const calculateFundTotals = (
  entries: Entry[]
): Record<FundType, number> => {
  const totals: Record<FundType, number> = {
    personal: 0,
    family: 0,
    buffer: 0,
    emergency: 0,
    saving: 0,
    investment: 0
  };

  entries.forEach((e) => {
    if (e.type === 'income') {
      if (e.splits) {
        FUND_ORDER.forEach((f) => {
          totals[f] += e.splits?.[f] || 0;
        });
      }
    } else if (e.type === 'expense' && e.fund) {
      if (totals[e.fund] !== undefined) {
        totals[e.fund] -= e.amount;
      }
    }
  });

  return totals;
};

export const calculatePeriodStats = (
  entries: Entry[],
  dateFilter?: { type: 'today' | 'month'; targetDate?: Date }
) => {
  let filtered = entries;

  if (dateFilter?.type === 'today') {
    const today = getTodayISO();
    filtered = entries.filter((e) => e.date === today);
  } else if (dateFilter?.type === 'month') {
    const target = dateFilter.targetDate || new Date();
    const prefix = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`;
    filtered = entries.filter((e) => e.date.startsWith(prefix));
  }

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpenses: Record<string, number> = {};

  filtered.forEach((e) => {
    if (e.type === 'income') {
      totalIncome += e.amount;
    } else {
      totalExpense += e.amount;
      const cat = e.category || 'Uncategorized';
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + e.amount;
    }
  });

  const net = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((net / totalIncome) * 100)) : 0;

  return {
    income: totalIncome,
    expense: totalExpense,
    net,
    savingsRate,
    count: filtered.length,
    categoryExpenses
  };
};

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export const triggerHapticSound = (type: 'save' | 'delete' | 'click' | 'error' = 'click') => {
  try {
    // Gentle vibration for mobile devices if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'click') {
        navigator.vibrate(8);
      } else if (type === 'save') {
        navigator.vibrate([15, 30, 20]);
      } else if (type === 'error' || type === 'delete') {
        navigator.vibrate(30);
      }
    }

    // Audio feedback via lightweight shared AudioContext
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'save') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'delete' || type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {
    // ignore audio/haptic failures
  }
};

export const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FFC700', '#10B981', '#F8FAFC', '#38BDF8']
    });
  } catch {
    // ignore
  }
};

export const downloadCSVReport = (entries: Entry[], targetMonthOrDate?: Date | string) => {
  let title = 'daily-khata-pro-export';
  let filtered = entries;

  if (targetMonthOrDate instanceof Date) {
    const prefix = `${targetMonthOrDate.getFullYear()}-${String(targetMonthOrDate.getMonth() + 1).padStart(2, '0')}`;
    filtered = entries.filter((e) => e.date.startsWith(prefix));
    title = `daily-khata-pro-statement-${prefix}`;
  }

  const headers = ['ID', 'Date', 'Type', 'Amount (INR)', 'Category / Source', 'Fund / Splits', 'Payment Mode', 'Note', 'Created At'];
  const rows = filtered.map((e) => {
    const splitDetails = e.splits ? Object.entries(e.splits).map(([k, v]) => `${k}:${v}`).join(';') : (e.fund || '');
    return [
      `"${e.id}"`,
      `"${e.date}"`,
      `"${e.type.toUpperCase()}"`,
      e.amount,
      `"${(e.category || e.source || (e.type === 'income' ? 'Income Earning' : 'General')).replace(/"/g, '""')}"`,
      `"${splitDetails}"`,
      `"${e.paymentMode || 'cash'}"`,
      `"${(e.note || '').replace(/"/g, '""')}"`,
      `"${new Date(e.createdAt).toLocaleString()}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${title}-${getTodayISO()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface HealthDiagnostics {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  label: string;
  color: string;
  runwayMonths: number;
  savingsRate: number;
  advice: string;
}

export const calculateFinancialHealth = (entries: Entry[]): HealthDiagnostics => {
  const fundTotals = calculateFundTotals(entries);
  const monthStats = calculatePeriodStats(entries, { type: 'month' });
  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  const monthlyExpense = monthStats.expense || 1;
  const emergencyReserve = (fundTotals.emergency || 0) + (fundTotals.buffer || 0);
  const runwayMonths = Math.max(0, parseFloat((emergencyReserve / monthlyExpense).toFixed(1)));
  const savingsRate = monthStats.savingsRate;

  let score = 50; // base score

  // 1. Emergency Runway (up to +25)
  if (runwayMonths >= 6) score += 25;
  else if (runwayMonths >= 3) score += 18;
  else if (runwayMonths >= 1) score += 10;
  else score -= 10;

  // 2. Savings Rate (up to +25)
  if (savingsRate >= 30) score += 25;
  else if (savingsRate >= 20) score += 18;
  else if (savingsRate >= 10) score += 10;
  else if (savingsRate < 0) score -= 15;

  // 3. Investment Pot Health (up to +15)
  if (fundTotals.investment > 0 && totalWealth > 0) {
    const investPct = (fundTotals.investment / totalWealth) * 100;
    if (investPct >= 10) score += 15;
    else if (investPct >= 5) score += 8;
  }

  // 4. Positive Net Wealth
  if (totalWealth > 0) score += 10;
  else if (totalWealth < 0) score -= 20;

  // Clamp 0-100
  score = Math.max(10, Math.min(100, score));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  let label = 'Healthy';
  let color = '#38BDF8';
  let advice = 'Maintain your 6-fund split discipline across all incoming transactions.';

  if (score >= 90) {
    grade = 'A+';
    label = 'Excellent (आदर्श)';
    color = '#10B981';
    advice = 'Superb financial discipline! Your emergency runway and investment allocations are on point.';
  } else if (score >= 75) {
    grade = 'A';
    label = 'Strong (मजबूत)';
    color = '#34D399';
    advice = 'Solid financial foundation. Keep directing surplus into long-term investments & saving goals.';
  } else if (score >= 60) {
    grade = 'B';
    label = 'Balanced (संतुलित)';
    color = '#38BDF8';
    advice = 'Your cash flow is steady. Consider boosting your Emergency & Buffer reserves to cover 3+ months.';
  } else if (score >= 40) {
    grade = 'C';
    label = 'Needs Focus (ध्यान दें)';
    color = '#F59E0B';
    advice = 'Expenses are close to incoming revenue. Try trimming discretionary personal spending.';
  } else {
    grade = 'D';
    label = 'Critical Reserve (चेतावनी)';
    color = '#EF4444';
    advice = 'High outflow relative to earnings. Prioritize building the Emergency Fund immediately.';
  }

  return {
    score,
    grade,
    label,
    color,
    runwayMonths,
    savingsRate,
    advice
  };
};

