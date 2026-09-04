import React from 'react';
import { Entry, FundType } from '../types';
import { FUND_ORDER, FUND_LABELS } from '../data/defaults';
import { formatCurrency, calculateFundTotals } from '../utils/khataCalculations';

interface PrintAreaProps {
  entries: Entry[];
  targetMonth?: Date;
}

export const PrintArea: React.FC<PrintAreaProps> = ({ entries, targetMonth = new Date() }) => {
  const fundTotals = calculateFundTotals(entries);
  const monthKey = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = targetMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const monthEntries = entries
    .filter((e) => e.date.startsWith(monthKey))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalInc = monthEntries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExp = monthEntries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const netSaved = totalInc - totalExp;

  const grandTotal = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  return (
    <div id="printArea" className="print-only hidden p-6 bg-white text-black font-sans text-[12px] max-w-4xl mx-auto relative">
      {/* Clean Official Ledger Watermark for print */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-30deg)',
          fontSize: '40px',
          fontWeight: 900,
          color: 'rgba(15, 23, 42, 0.035)',
          letterSpacing: '3px',
          pointerEvents: 'none',
          zIndex: 0,
          textAlign: 'center',
          lineHeight: '1.3',
          userSelect: 'none'
        }}
      >
        DAILY KHATA PRO<br />
        <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '4px' }}>OFFICIAL FINANCIAL STATEMENT</span>
      </div>

      {/* Brand Header */}
      <div className="border-b-2 border-sky-600 pb-3 mb-5 flex justify-between items-start relative z-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Daily Khata Pro — Financial Statement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            6-Fund Income &amp; Expense Money Ledger · Verified
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div>Statement Period: <strong>{monthLabel}</strong></div>
          <div>Printed: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Monthly Cashflow Summary */}
      <div className="mb-5">
        <div className="grid grid-cols-3 gap-3 text-center bg-slate-900 text-white p-3.5 rounded-lg">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Income</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">+{formatCurrency(totalInc)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Expense</div>
            <div className="text-base font-bold text-rose-400 mt-0.5">-{formatCurrency(totalExp)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Net Surplus / Savings</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{formatCurrency(netSaved)}</div>
          </div>
        </div>
      </div>

      {/* Fund Balances Summary */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
          Capital Pot Balances (All-Time)
        </h2>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-left text-slate-600">
              <th className="py-1.5 px-2.5 font-bold">Fund Name</th>
              <th className="py-1.5 px-2.5 text-right font-bold">Current Balance</th>
            </tr>
          </thead>
          <tbody>
            {FUND_ORDER.map((f) => (
              <tr key={f} className="border-b border-slate-200">
                <td className="py-1.5 px-2.5 font-medium text-slate-800">{FUND_LABELS[f]}</td>
                <td className="py-1.5 px-2.5 text-right font-mono font-bold">{formatCurrency(fundTotals[f])}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-900 font-bold bg-slate-50">
              <td className="py-2 px-2.5 text-slate-900">Grand Total Combined Wealth</td>
              <td className="py-2 px-2.5 text-right font-mono text-sm text-slate-900">{formatCurrency(grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Itemized Transactions Table */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
          Itemized Monthly Transactions ({monthEntries.length} Records)
        </h2>
        {monthEntries.length === 0 ? (
          <div className="text-xs text-slate-500 py-4 italic text-center bg-slate-50 rounded border border-slate-200">
            No income or expense entries recorded for this month.
          </div>
        ) : (
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300 text-left text-slate-700">
                <th className="py-1.5 px-2 font-bold">Date</th>
                <th className="py-1.5 px-2 font-bold">Type</th>
                <th className="py-1.5 px-2 font-bold">Category / Description</th>
                <th className="py-1.5 px-2 font-bold">Fund Pot</th>
                <th className="py-1.5 px-2 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {monthEntries.map((e) => (
                <tr key={e.id} className="border-b border-slate-200">
                  <td className="py-1.5 px-2 font-mono text-slate-600">{e.date}</td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        e.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {e.type}
                    </span>
                  </td>
                  <td className="py-1.5 px-2">
                    <span className="font-semibold text-slate-900">
                      {e.type === 'income' ? (e.source || 'Daily Income') : (e.category || 'Expense')}
                    </span>
                    {e.note && <span className="text-slate-500 block text-[11px] mt-0.5">{e.note}</span>}
                  </td>
                  <td className="py-1.5 px-2 text-slate-600">
                    {e.type === 'income' ? '6-Fund Auto Split' : FUND_LABELS[e.fund || 'personal']}
                  </td>
                  <td
                    className={`py-1.5 px-2 text-right font-mono font-bold ${
                      e.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {e.type === 'income' ? `+${formatCurrency(e.amount)}` : `-${formatCurrency(e.amount)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Document Statement Completion Bar */}
      <div className="border-t-2 border-slate-200 pt-2.5 flex justify-between items-center text-[10.5px] text-slate-500 relative z-10 mb-4">
        <span>• End of Financial Statement Record •</span>
        <span className="font-mono text-[10px]">Daily Khata Pro Systematic Ledger · Verified Audit</span>
      </div>

      {/* Developer Colophon & Watermark Signature in Distinct Bottom Container */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-[10px] text-slate-600 relative z-10 break-inside-avoid shadow-xs">
        <div className="flex items-center gap-2.5">
          <img
            src="/md-zafeer-hasan-yazdaan.jpg"
            alt="MD Zafeer Hasan (YAZDAAN)"
            className="w-6 h-6 rounded-full object-cover border border-sky-600 shadow-2xs"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/mdzafeerhasan';
            }}
          />
          <div>
            <div className="font-bold text-slate-900 text-[10.5px]">MD Zafeer Hasan (YAZDAAN)</div>
            <div className="text-[9px] text-slate-500">Developer &amp; Software Architect · Daily Khata Pro</div>
          </div>
        </div>
        <div className="text-right border-l border-slate-200 pl-3">
          <div className="font-mono text-[9.5px] font-bold text-slate-800">WATERMARK SIGNATURE: HASVOLT</div>
          <div className="text-[8.5px] text-slate-500">Professional Engineering &bull; www.hasvolt.com</div>
        </div>
      </div>
    </div>
  );
};
