import React, { useState } from 'react';
import { ArrowLeft, Trash2, ArrowUpRight, ArrowDownRight, Search, Download } from 'lucide-react';
import { Transaction } from '../utils/khataCalculations';
import { generateTransactionHistoryPDF } from '../utils/pdfGenerator';

interface HistoryViewProps {
  onBack: () => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  formatCurrency: (val: number, mask: boolean) => string;
  privacyMask: boolean;
}

export function HistoryView({
  onBack,
  transactions,
  onDeleteTransaction,
  formatCurrency,
  privacyMask,
}: HistoryViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDesc = (t.description || '').toLowerCase().includes(q);
      const matchCat = (t.category || '').toLowerCase().includes(q);
      return matchDesc || matchCat;
    }
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => generateTransactionHistoryPDF(transactions)}
              className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          )}
          <span className="text-xs font-bold text-slate-400">All Transactions</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--theme-border,#1a3658)] bg-[#0a192b] text-white text-xs outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex rounded-xl bg-[#0a192b] p-1 border border-[var(--theme-border,#1a3658)] shrink-0">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--theme-border,#1a3658)] bg-[#0a192b]/95 p-3 sm:p-5 shadow-xs">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No transactions match your search.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#071322] hover:bg-[#0c2035] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {tx.description || tx.category || (tx.type === 'income' ? 'Income' : 'Expense')}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{tx.date}</span>
                      {tx.category && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">{tx.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold text-sm ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, privacyMask)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryView;
