import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { HomeView } from './components/HomeView';
import { BlogView } from './components/BlogView';
import { CalculatorView } from './components/CalculatorView';
import { LoanEMIView } from './components/LoanEMIView';
import { InvoiceGeneratorView } from './components/InvoiceGeneratorView';
import { RecycleBinView } from './components/RecycleBinView';
import { HistoryView } from './components/HistoryView';
import { Footer } from './components/Footer';
import { Transaction, DebtItem, calculateStats } from './utils/khataCalculations';
import { formatCurrencyByLang } from './utils/currencyConfig';
import { Wallet, BookOpen, Calculator, Landmark, Home, FileText, Trash2 } from 'lucide-react';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 75000,
    category: 'Salary',
    description: 'Monthly Salary Credit',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 12500,
    category: 'Rent',
    description: 'Office Rent Payment',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'tx-3',
    type: 'income',
    amount: 25000,
    category: 'Business',
    description: 'Client Project Advance',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 900000,
  },
];

const INITIAL_DEBTS: DebtItem[] = [
  {
    id: 'debt-1',
    personName: 'Ramesh Sharma',
    type: 'gave',
    amount: 15000,
    note: 'Shop renovation materials',
    dueDate: '2026-10-15',
    date: new Date().toISOString().split('T')[0],
  },
];

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'calculator' | 'loan-emi' | 'invoice' | 'recycle-bin' | 'blog' | 'history'>('home');
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>('');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('daily_khata_transactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [deletedTransactions, setDeletedTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('daily_khata_deleted');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [debts, setDebts] = useState<DebtItem[]>(() => {
    try {
      const saved = localStorage.getItem('daily_khata_debts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEBTS;
  });

  // Isolated privacy toggle
  const [privacyMask, setPrivacyMask] = useState<boolean>(() => {
    try {
      return localStorage.getItem('daily_khata_privacy') === 'true';
    } catch {}
    return false;
  });

  // Add Transaction Modal
  const [addModalType, setAddModalType] = useState<'income' | 'expense' | null>(null);
  const [modalAmount, setModalAmount] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('daily_khata_transactions', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_khata_deleted', JSON.stringify(deletedTransactions));
    } catch {}
  }, [deletedTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_khata_debts', JSON.stringify(debts));
    } catch {}
  }, [debts]);

  const togglePrivacyMask = () => {
    setPrivacyMask((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('daily_khata_privacy', String(next));
      } catch {}
      return next;
    });
  };

  const stats = useMemo(() => calculateStats(transactions), [transactions]);

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addModalType || !modalAmount) return;

    const amt = parseFloat(modalAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: addModalType,
      amount: amt,
      category: modalCategory.trim() || (addModalType === 'income' ? 'Income' : 'General'),
      description: modalDescription.trim() || (addModalType === 'income' ? 'Income Added' : 'Expense Recorded'),
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (addModalType === 'income') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }

    setAddModalType(null);
    setModalAmount('');
    setModalCategory('');
    setModalDescription('');
  };

  const handleDeleteTransaction = (id: string) => {
    const toDelete = transactions.find((t) => t.id === id);
    if (toDelete) {
      setDeletedTransactions((prev) => [toDelete, ...prev]);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleRestoreTransaction = (id: string) => {
    const toRestore = deletedTransactions.find((t) => t.id === id);
    if (toRestore) {
      setTransactions((prev) => [toRestore, ...prev]);
      setDeletedTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handlePermanentDelete = (id: string) => {
    setDeletedTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearRecycleBin = () => {
    setDeletedTransactions([]);
  };

  const handleAddDebt = (newDebt: Omit<DebtItem, 'id'>) => {
    setDebts((prev) => [{ ...newDebt, id: `debt-${Date.now()}` }, ...prev]);
  };

  const handleDeleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const dateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#05111f] text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[var(--theme-border,#1a3658)] bg-[#040d18]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => {
              setCurrentView('home');
              setSelectedBlogSlug('');
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Wallet className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight leading-tight block">
                Daily Khata <span className="text-emerald-400">Pro</span>
              </span>
              <span className="text-[9px] text-slate-400 tracking-wider block font-semibold -mt-0.5">
                ROZFIBER FINANCE
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                setSelectedBlogSlug('');
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:text-white'
              }`}
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('calculator')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                currentView === 'calculator'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:text-white'
              }`}
              title="Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('loan-emi')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                currentView === 'loan-emi'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:text-white'
              }`}
              title="Loan & EMI"
            >
              <Landmark className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('invoice')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                currentView === 'invoice'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:text-white'
              }`}
              title="Tax Invoice"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('blog');
                setSelectedBlogSlug('');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === 'blog'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Blog</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex-1">
        {currentView === 'home' && (
          <HomeView
            totalWealth={stats.totalWealth}
            todayStats={stats.todayStats}
            monthStats={stats.monthStats}
            transactions={transactions}
            formatCurrency={formatCurrencyByLang}
            privacyMask={privacyMask}
            dateFormatted={dateFormatted}
            onAddClick={(type) => setAddModalType(type)}
            onTogglePrivacyMask={togglePrivacyMask}
            onNavigateCalculator={() => setCurrentView('calculator')}
            onNavigateLoanEMI={() => setCurrentView('loan-emi')}
            onNavigateInvoice={() => setCurrentView('invoice')}
            onNavigateRecycleBin={() => setCurrentView('recycle-bin')}
            onNavigateBlog={() => {
              setCurrentView('blog');
              setSelectedBlogSlug('');
            }}
            onNavigateHistory={() => setCurrentView('history')}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {currentView === 'blog' && (
          <BlogView
            onBack={() => {
              setCurrentView('home');
              setSelectedBlogSlug('');
            }}
            selectedSlug={selectedBlogSlug}
            onSelectPost={(slug) => setSelectedBlogSlug(slug)}
          />
        )}

        {currentView === 'calculator' && (
          <CalculatorView
            onBack={() => setCurrentView('home')}
            onUseAsTransaction={(amt) => {
              setModalAmount(String(amt));
              setAddModalType('expense');
              setCurrentView('home');
            }}
          />
        )}

        {currentView === 'loan-emi' && (
          <LoanEMIView
            onBack={() => setCurrentView('home')}
            debts={debts}
            onAddDebt={handleAddDebt}
            onDeleteDebt={handleDeleteDebt}
          />
        )}

        {currentView === 'invoice' && (
          <InvoiceGeneratorView onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'recycle-bin' && (
          <RecycleBinView
            onBack={() => setCurrentView('home')}
            deletedTransactions={deletedTransactions}
            onRestore={handleRestoreTransaction}
            onPermanentDelete={handlePermanentDelete}
            onClearAll={handleClearRecycleBin}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onBack={() => setCurrentView('home')}
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            formatCurrency={formatCurrencyByLang}
            privacyMask={privacyMask}
          />
        )}
      </main>

      {/* Add Transaction Modal */}
      {addModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-emerald-500/40 bg-[#081525] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-white text-base">
                {addModalType === 'income' ? '+ Add Income' : '− Record Expense'}
              </h3>
              <button
                type="button"
                onClick={() => setAddModalType(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransactionSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  autoFocus
                  placeholder="0.00"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-[#030b14] text-white font-mono text-base font-bold focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  placeholder={addModalType === 'income' ? 'e.g. Salary, Business' : 'e.g. Food, Travel, Rent'}
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-[#030b14] text-white text-sm focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Optional note"
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-[#030b14] text-white text-sm focus:border-emerald-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-black text-sm shadow-md transition-colors cursor-pointer select-none ${
                  addModalType === 'income'
                    ? 'bg-[#00c853] hover:bg-[#00b047]'
                    : 'bg-[#ff1744] hover:bg-[#d50000]'
                }`}
              >
                {addModalType === 'income' ? 'Save Income' : 'Save Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onNavigateHome={() => {
          setCurrentView('home');
          setSelectedBlogSlug('');
        }}
        onNavigateBlog={() => {
          setCurrentView('blog');
          setSelectedBlogSlug('');
        }}
      />
    </div>
  );
}

export default App;
