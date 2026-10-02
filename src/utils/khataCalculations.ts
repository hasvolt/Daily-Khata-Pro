export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category?: string;
  deadline?: string;
}

export interface DebtItem {
  id: string;
  personName: string;
  type: 'gave' | 'got';
  amount: number;
  note?: string;
  dueDate?: string;
  date: string;
}

export function addMoney(a: number, b: number): number {
  return Math.round((a + b) * 100) / 100;
}

export function subtractMoney(a: number, b: number): number {
  return Math.round((a - b) * 100) / 100;
}

export function calculateStats(transactions: Transaction[]) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let totalIncome = 0;
  let totalExpense = 0;

  let todayIncome = 0;
  let todayExpense = 0;

  let monthIncome = 0;
  let monthExpense = 0;

  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    const tDate = new Date(t.date || t.createdAt);
    const tDateStr = tDate.toISOString().split('T')[0];
    const isToday = tDateStr === todayStr;
    const isThisMonth = tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;

    if (t.type === 'income') {
      totalIncome = addMoney(totalIncome, amt);
      if (isToday) todayIncome = addMoney(todayIncome, amt);
      if (isThisMonth) monthIncome = addMoney(monthIncome, amt);
    } else {
      totalExpense = addMoney(totalExpense, amt);
      if (isToday) todayExpense = addMoney(todayExpense, amt);
      if (isThisMonth) monthExpense = addMoney(monthExpense, amt);
    }
  }

  return {
    totalWealth: subtractMoney(totalIncome, totalExpense),
    totalIncome,
    totalExpense,
    todayStats: {
      income: todayIncome,
      expense: todayExpense,
      net: subtractMoney(todayIncome, todayExpense),
    },
    monthStats: {
      income: monthIncome,
      expense: monthExpense,
      net: subtractMoney(monthIncome, monthExpense),
    },
  };
}
