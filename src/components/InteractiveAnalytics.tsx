import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Entry, FundType, FundConfig, AppLanguage } from '../types';
import { DEFAULT_FUNDS, getFundConfig, getFundLabel } from '../data/defaults';
import { formatCurrency, calculateFundTotals } from '../utils/khataCalculations';
import { getCategoryIcon } from '../utils/iconMap';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface InteractiveAnalyticsProps {
  entries: Entry[];
  funds?: FundConfig[];
  language?: AppLanguage;
  privacyMask?: boolean;
}

type TimeRange = 'this_month' | 'last_month' | 'last_3_months' | 'all';

const FUND_COLORS: Record<string, string> = {
  personal: '#38BDF8',
  family: '#EC4899',
  buffer: '#F59E0B',
  emergency: '#EF4444',
  saving: '#10B981',
  investment: '#8B5CF6',
  business: '#06B6D4'
};

export const InteractiveAnalytics: React.FC<InteractiveAnalyticsProps> = ({
  entries,
  funds,
  language = 'en',
  privacyMask = false
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('this_month');
  const [activeTab, setActiveTab] = useState<'cashflow' | 'funds' | 'categories'>('cashflow');

  const activeFunds = funds && funds.length > 0 ? funds : DEFAULT_FUNDS;

  // Filter entries based on selected time range
  const filteredEntries = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return entries.filter((e) => {
      if (!e.date) return false;
      const [year, month] = e.date.split('-').map(Number);
      if (!year || !month) return false;

      if (timeRange === 'this_month') {
        return year === currentYear && month === currentMonth + 1;
      }
      if (timeRange === 'last_month') {
        const targetMonth = currentMonth === 0 ? 12 : currentMonth;
        const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return year === targetYear && month === targetMonth;
      }
      if (timeRange === 'last_3_months') {
        const d = new Date(year, month - 1, 1);
        const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
        return d >= threeMonthsAgo && d <= now;
      }
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, timeRange]);

  // Aggregate daily cash flow data for Area Chart
  const cashFlowData = useMemo(() => {
    const dateMap: Record<string, { date: string; displayDate: string; income: number; expense: number; net: number }> = {};

    filteredEntries.forEach((e) => {
      const d = e.date;
      if (!dateMap[d]) {
        const parts = d.split('-');
        const displayDate = `${parts[2]}/${parts[1]}`;
        dateMap[d] = { date: d, displayDate, income: 0, expense: 0, net: 0 };
      }
      if (e.type === 'income') {
        dateMap[d].income += e.amount;
      } else {
        dateMap[d].expense += e.amount;
      }
      dateMap[d].net = dateMap[d].income - dateMap[d].expense;
    });

    const sorted = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate cumulative balance curve
    let runningBalance = 0;
    return sorted.map((item) => {
      runningBalance += item.net;
      return {
        ...item,
        runningBalance
      };
    });
  }, [filteredEntries]);

  // Aggregate fund allocation data for Donut Chart
  const fundAllocationData = useMemo(() => {
    const fundTotals = calculateFundTotals(filteredEntries.length > 0 ? filteredEntries : entries, activeFunds.map(f => f.id));
    const totalPositive = Object.values(fundTotals).reduce((sum, v) => sum + Math.max(0, v), 0);

    return activeFunds.map((fund) => {
      const balance = Math.max(0, fundTotals[fund.id] || 0);
      const percentage = totalPositive > 0 ? Math.round((balance / totalPositive) * 100) : 0;
      return {
        id: fund.id,
        name: getFundLabel(fund.id, activeFunds),
        value: balance,
        percentage,
        color: fund.color || FUND_COLORS[fund.id] || '#38BDF8'
      };
    }).filter(f => f.value > 0);
  }, [filteredEntries, entries, activeFunds, language]);

  // Aggregate category expense data for Bar Chart
  const categoryExpenseData = useMemo(() => {
    const catMap: Record<string, number> = {};
    filteredEntries
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        const cat = e.category || 'General Expense';
        catMap[cat] = (catMap[cat] || 0) + e.amount;
      });

    return Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 7);
  }, [filteredEntries]);

  // Totals & Metrics
  const totalIncome = useMemo(() => 
    filteredEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0),
    [filteredEntries]
  );

  const totalExpense = useMemo(() => 
    filteredEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0),
    [filteredEntries]
  );

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] p-2.5 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-semibold text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,#213E61)] pb-1 mb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-[var(--theme-text,#F8FAFC)] font-mono">
                {formatCurrency(entry.value, privacyMask)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header with Title and Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--theme-border,#213E61)]">
        <div>
          <h3 className="font-serif-display text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary, #38BDF8)' }} />
            <span>Interactive Financial Analytics</span>
          </h3>
          <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
            Real-time cash flow trajectory &amp; fund allocations
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-[var(--theme-bg,#070E18)] p-1 rounded-xl border border-[var(--theme-border,#213E61)] text-xs overflow-x-auto max-w-full">
          {(
            [
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'last_3_months', label: '3 Months' },
              { id: 'all', label: 'All Time' }
            ] as { id: TimeRange; label: string }[]
          ).map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                timeRange === range.id
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] shadow-xs'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block">Total In</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
            +{formatCurrency(totalIncome, privacyMask)}
          </span>
        </div>
        <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block">Total Out</span>
          <span className="text-sm sm:text-base font-bold text-rose-400 font-mono">
            -{formatCurrency(totalExpense, privacyMask)}
          </span>
        </div>
        <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block">Net Saved</span>
          <span className={`text-sm sm:text-base font-bold font-mono ${netSavings >= 0 ? 'text-sky-400' : 'text-amber-400'}`}>
            {netSavings >= 0 ? '+' : ''}{formatCurrency(netSavings, privacyMask)}
          </span>
        </div>
        <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-2.5">
          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] uppercase font-semibold block">Savings Rate</span>
          <span className="text-sm sm:text-base font-bold text-amber-300 font-mono">
            {savingsRate}%
          </span>
        </div>
      </div>

      {/* Visual Chart Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--theme-border,#213E61)] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'cashflow'
              ? 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]'
              : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Cash Flow Trajectory</span>
        </button>
        <button
          onClick={() => setActiveTab('funds')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'funds'
              ? 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]'
              : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
          }`}
        >
          <PieChartIcon className="w-3.5 h-3.5" />
          <span>6-Fund Allocation</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]'
              : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Category Expenses</span>
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 sm:h-72">
        {activeTab === 'cashflow' && (
          cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
                <Area type="monotone" dataKey="runningBalance" name="Cumulative Balance" stroke="#38BDF8" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#balanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--theme-text-dim,#94A3B8)] text-xs gap-2">
              <Calendar className="w-8 h-8 opacity-40" />
              <span>No transactions recorded for this period</span>
            </div>
          )
        )}

        {activeTab === 'funds' && (
          fundAllocationData.length > 0 ? (
            <div className="h-full flex flex-col sm:flex-row items-center justify-around gap-4">
              <div className="w-full sm:w-1/2 h-48 sm:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fundAllocationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {fundAllocationData.map((item, idx) => (
                        <Cell key={`cell-${idx}`} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val), privacyMask), 'Balance']}
                      contentStyle={{ backgroundColor: '#132438', borderColor: '#213E61', borderRadius: '12px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Fund Legend */}
              <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2 text-xs">
                {fundAllocationData.map((fund) => (
                  <div key={fund.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]/50">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fund.color }} />
                    <div className="truncate">
                      <p className="font-semibold text-[var(--theme-text,#F8FAFC)] truncate">{fund.name}</p>
                      <p className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-mono">{fund.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--theme-text-dim,#94A3B8)] text-xs gap-2">
              <PieChartIcon className="w-8 h-8 opacity-40" />
              <span>Fund balances are empty or zero</span>
            </div>
          )
        )}

        {activeTab === 'categories' && (
          categoryExpenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryExpenseData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val), privacyMask), 'Expense']}
                  contentStyle={{ backgroundColor: '#132438', borderColor: '#213E61', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="amount" name="Spent" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--theme-text-dim,#94A3B8)] text-xs gap-2">
              <BarChart2 className="w-8 h-8 opacity-40" />
              <span>No category expense data found</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};
