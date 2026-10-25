import React, { useState, useMemo } from 'react';
import { Entry, FundType, FundConfig, AppLanguage, CategoryBudget, DebtItem, Goal, UserPurpose } from '../types';
import { DEFAULT_FUNDS } from '../data/defaults';
import { formatCurrency, calculateFundTotals, calculatePeriodStats } from '../utils/khataCalculations';
import { getLocalDateString, getDaysAgoDateString, getLocalMonthString } from '../utils/dateUtils';
import { getCurrencyConfig } from '../utils/currencyConfig';
import { getFundIcon, getCategoryIcon, getSourceIcon } from '../utils/iconMap';
import { TRANSLATIONS } from '../utils/translations';
import { getPageTranslation } from '../utils/pageTranslations';
import { getUIText } from '../utils/localization';
import { HomepageFundSelectorModal } from './HomepageFundSelectorModal';
import { BankingCard3D } from './BankingCard3D';
import { FundCard3D } from './FundCard3D';
import { SummaryCard3D } from './SummaryCard3D';
import { LoanUdharWidget } from './LoanUdharWidget';
import { ActiveGoalsWidget } from './ActiveGoalsWidget';
import { BudgetOverviewWidget } from './BudgetOverviewWidget';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  History,
  Target,
  Landmark,
  Calculator,
  BarChart3,
  Grid2X2,
  Zap,
  Lightbulb,
  FileText,
  Trash2,
  ClipboardList,
  Receipt,
  CalendarCheck,
  Menu,
  Store,
  HardHat,
  Factory,
  Tractor,
  Home as HomeIcon,
  UserCheck,
  Sparkles,
  RefreshCw,
  Users,
  Download
} from 'lucide-react';

interface HomeViewProps {
  entries: Entry[];
  percentages: Record<FundType, number>;
  funds?: FundConfig[];
  homepageFundIds?: string[];
  onUpdateHomepageFundIds?: (ids: string[]) => void;
  onOpenFundSettings?: () => void;
  onAddClick: (type: 'income' | 'expense') => void;
  onFilterFund: (fund: FundType) => void;
  onViewHistory?: () => void;
  onNavigateGoals?: () => void;
  onNavigateCalculator?: () => void;
  onNavigateReports?: () => void;
  onTogglePrivacyMask?: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
  budgets?: CategoryBudget[];
  onOpenBudgetManager?: () => void;
  debtItems?: DebtItem[];
  onNavigateLoans?: () => void;
  onOpenAddDebtModal?: () => void;
  goals?: Goal[];
  onOpenCreateGoal?: () => void;
  onOpenDepositGoal?: (goal: Goal) => void;
  onNavigateInvoice?: () => void;
  onOpenTrash?: () => void;
  onNavigateAttendance?: () => void;
  onOpenSplitBill?: () => void;
  userPurpose?: UserPurpose;
  onOpenChangePurpose?: () => void;
  hasDemoData?: boolean;
  onRemoveDemoData?: () => void;
  [key: string]: any;
}

const FINANCIAL_TIPS = [
  'Small Steps Today → Bigger Financial Freedom Tomorrow',
  'Track every transaction: What gets measured, gets managed.',
  'Pay yourself first by putting 20% into savings and emergency fund.',
  'Avoid high-interest debt and keep EMI below 30% of income.',
  'Review monthly subscriptions regularly to plug financial leaks.',
];

export const HomeView: React.FC<HomeViewProps> = ({
  entries,
  percentages,
  funds,
  homepageFundIds,
  onUpdateHomepageFundIds,
  onOpenFundSettings,
  onAddClick,
  onFilterFund,
  onViewHistory,
  onNavigateGoals,
  onNavigateCalculator,
  onNavigateReports,
  onTogglePrivacyMask,
  language = 'en',
  privacyMask = false,
  debtItems = [],
  onNavigateLoans,
  onOpenAddDebtModal,
  goals = [],
  onOpenCreateGoal,
  onOpenDepositGoal,
  budgets = [],
  onOpenBudgetManager,
  onNavigateInvoice,
  onOpenTrash,
  onNavigateAttendance,
  onOpenSplitBill,
  userPurpose = 'shop',
  onOpenChangePurpose,
  hasDemoData = false,
  onRemoveDemoData,
  onOpenMultiBackup,
  onOneClickPdf
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const pageT = getPageTranslation(language);

  const activeFunds: FundConfig[] = funds && funds.length > 0 ? funds : DEFAULT_FUNDS;
  const fundKeys = activeFunds.map((f) => f.id);

  const todayStats = calculatePeriodStats(entries, { type: 'today' });
  const monthStats = calculatePeriodStats(entries, { type: 'month' });
  const fundTotals = calculateFundTotals(entries, fundKeys);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isViewMoreExpanded, setIsViewMoreExpanded] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % FINANCIAL_TIPS.length);
  };

  const primaryFunds: FundConfig[] = useMemo(() => {
    if (homepageFundIds && homepageFundIds.length > 0) {
      const selected: FundConfig[] = [];
      homepageFundIds.forEach((id) => {
        const match = activeFunds.find((f) => f.id === id);
        if (match) selected.push(match);
      });
      if (selected.length < 6) {
        const remaining = activeFunds.filter((f) => !selected.some((s) => s.id === f.id));
        selected.push(...remaining.slice(0, 6 - selected.length));
      }
      return selected.slice(0, 6);
    }
    return activeFunds.slice(0, 6);
  }, [activeFunds, homepageFundIds]);

  const overflowFunds = useMemo(() => {
    const primaryIds = new Set(primaryFunds.map((f) => f.id));
    return activeFunds.filter((f) => !primaryIds.has(f.id));
  }, [activeFunds, primaryFunds]);

  const [recentFilter, setRecentFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const categoryTrends = useMemo(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const prevMonthDate = new Date(curYear, curMonth - 1, 1);
    const curMonthPrefix = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;
    const prevMonthPrefix = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const curMonthSums: Record<string, number> = {};
    const prevMonthSums: Record<string, number> = {};

    entries.forEach((entry) => {
      if (!entry.date) return;
      const amount = Math.abs(entry.amount || 0);
      const categoryKey = (entry.fund || entry.category || '').toLowerCase();
      if (entry.date.startsWith(curMonthPrefix)) {
        curMonthSums[categoryKey] = (curMonthSums[categoryKey] || 0) + amount;
      } else if (entry.date.startsWith(prevMonthPrefix)) {
        prevMonthSums[categoryKey] = (prevMonthSums[categoryKey] || 0) + amount;
      }
    });

    const trends: Record<string, 'up' | 'down' | 'neutral'> = {};
    activeFunds.forEach((f) => {
      const key = f.id.toLowerCase();
      const cur = curMonthSums[key] || 0;
      const prev = prevMonthSums[key] || 0;
      if (cur > prev) trends[f.id] = 'up';
      else if (cur < prev && prev > 0) trends[f.id] = 'down';
      else trends[f.id] = 'neutral';
    });
    return trends;
  }, [entries, activeFunds]);

  const filteredRecentEntries = useMemo(() => {
    const sorted = entries.slice().sort((a, b) => b.createdAt - a.createdAt);
    if (recentFilter === 'all') return sorted.slice(0, 4);

    const todayStr = getLocalDateString();
    const sevenDaysStr = getDaysAgoDateString(7);
    const curMonthPrefix = getLocalMonthString();

    if (recentFilter === 'today') {
      return sorted.filter((e) => e.date === todayStr).slice(0, 4);
    }
    if (recentFilter === 'week') {
      return sorted.filter((e) => e.date && e.date >= sevenDaysStr).slice(0, 4);
    }
    if (recentFilter === 'month') {
      return sorted.filter((e) => e.date && e.date.startsWith(curMonthPrefix)).slice(0, 4);
    }
    return sorted.slice(0, 4);
  }, [entries, recentFilter]);

  const localeMap: Record<string, string> = {
    hi: 'hi-IN',
    hinglish: 'en-IN',
    es: 'es-ES',
    ar: 'ar-SA',
    fr: 'fr-FR',
    de: 'de-DE',
    ru: 'ru-RU',
    pt: 'pt-BR',
    bn: 'bn-BD',
    ur: 'ur-PK',
    id: 'id-ID',
    ja: 'ja-JP',
    zh: 'zh-CN',
    en: 'en-IN',
  };

  const activeLocale = getCurrencyConfig(language).locale || localeMap[language] || 'en-US';
  const today = new Date();
  const dateFormatted = today.toLocaleDateString(activeLocale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const monthFormatted = today.toLocaleString(activeLocale, {
    month: 'short',
    year: 'numeric',
  });
  const totalWealth = Object.values(fundTotals).reduce((sum, v) => sum + v, 0);

  const quickAccess = [
    {
      label: isHindi ? '1-क्लिक PDF' : '1-Click PDF',
      icon: Download,
      action: onOneClickPdf || (() => window.dispatchEvent(new CustomEvent('trigger-1click-pdf'))),
      iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500/50',
    },
    {
      label: isHindi ? 'मल्टी बैकअप' : 'Multi-Backup',
      icon: Sparkles,
      action: onOpenMultiBackup || (() => window.dispatchEvent(new CustomEvent('open-multi-backup-modal'))),
      iconBg: 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30',
      hoverBorder: 'hover:border-sky-500/50',
    },
    {
      label: getUIText('Invoice Generator', language),
      icon: FileText,
      action: onNavigateInvoice,
      iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500/50',
    },
    {
      label: getUIText('Recycle Bin', language),
      icon: Trash2,
      action: onOpenTrash,
      iconBg: 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
      hoverBorder: 'hover:border-rose-500/50',
    },
    {
      label: isHindi ? 'हाजिरी रजिस्टर' : 'Attendance',
      icon: CalendarCheck,
      action: onNavigateAttendance,
      iconBg: 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30',
      hoverBorder: 'hover:border-sky-500/50',
    },
    {
      label: getUIText('Loans / Udhar', language),
      icon: Landmark,
      action: onNavigateLoans,
      iconBg: 'bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
      hoverBorder: 'hover:border-purple-500/50',
    },
    {
      label: getUIText('Multi Calculator', language),
      icon: Calculator,
      action: onNavigateCalculator,
      iconBg: 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      hoverBorder: 'hover:border-amber-500/50',
    },
    {
      label: getUIText('Split Bill', language),
      icon: Receipt,
      action: onOpenSplitBill,
      iconBg: 'bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30',
      hoverBorder: 'hover:border-teal-500/50',
    },
    {
      label: getUIText('Budget Manager', language),
      icon: PieChart,
      action: onOpenBudgetManager,
      iconBg: 'bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      hoverBorder: 'hover:border-indigo-500/50',
    },
    {
      label: isHindi ? 'और मेनू' : 'More Menu',
      icon: Menu,
      action: () => {
        window.dispatchEvent(new CustomEvent('open-main-menu'));
      },
      iconBg: 'bg-pink-500/15 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30',
      hoverBorder: 'hover:border-pink-500/50',
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto pb-10 sm:pb-14 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
      {/* 1. HERO BALANCE CARD (Always at the very top) */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <BankingCard3D
          totalWealth={totalWealth}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          dateFormatted={dateFormatted}
          t={t}
          pageT={pageT}
          onAddClick={onAddClick}
          onTogglePrivacyMask={onTogglePrivacyMask}
        />
      </motion.div>

      {/* 2. TODAY + THIS MONTH SUMMARY CARDS (Full Width Stack) */}
      <motion.section
        className="space-y-2 sm:space-y-2.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.04 }}
      >
        <SummaryCard3D
          type="daily"
          title={isHindi ? "आज" : "Today"}
          subtitle={isHindi ? "आय, खर्च और बचत" : "Income, expense & savings"}
          periodBadge={language === 'en' ? "Today" : (isHindi ? "आज" : (t.home.dailySummaryHeading?.split(' ')[0] || "Today"))}
          incomeLabel={isHindi ? 'आय' : 'Income'}
          incomeValue={todayStats.income}
          expenseLabel={isHindi ? 'खर्च' : 'Expense'}
          expenseValue={todayStats.expense}
          netLabel={isHindi ? 'बचत' : 'Savings'}
          netValue={todayStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
          onClick={onViewHistory}
        />
        <SummaryCard3D
          type="monthly"
          title={isHindi ? "इस महीने" : "This Month"}
          subtitle={isHindi ? "आय, खर्च और बचत" : "Income, expense & savings"}
          periodBadge={monthFormatted}
          incomeLabel={isHindi ? 'आय' : 'Income'}
          incomeValue={monthStats.income}
          expenseLabel={isHindi ? 'खर्च' : 'Expense'}
          expenseValue={monthStats.expense}
          netLabel={isHindi ? 'बचत' : 'Savings'}
          netValue={monthStats.net}
          formatCurrency={formatCurrency}
          privacyMask={privacyMask}
          isHindi={isHindi}
          onClick={onViewHistory}
        />
      </motion.section>

      {/* 3. PURPOSE-TAILORED QUICK BANNER & SHORTCUTS (Directly below Total Balance & Month Cards) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-[var(--theme-border,#213E61)] bg-gradient-to-r from-[var(--theme-card,#132438)] via-[var(--theme-card,#132438)] to-[var(--theme-bg,#070E1A)] p-3 sm:p-3.5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5 pb-2 border-b border-[var(--theme-border,#213E61)]/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)]">
              {userPurpose === 'shop' && <Store className="w-4 h-4" />}
              {userPurpose === 'construction' && <HardHat className="w-4 h-4" />}
              {userPurpose === 'factory' && <Factory className="w-4 h-4" />}
              {userPurpose === 'farm' && <Tractor className="w-4 h-4" />}
              {userPurpose === 'household' && <HomeIcon className="w-4 h-4" />}
              {userPurpose === 'personal' && <UserCheck className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] sm:text-[13.5px] font-black text-[var(--theme-text,#F8FAFC)] tracking-tight">
                  {userPurpose === 'shop' && (isHindi ? 'दुकान व रिटेल बहीखाता' : 'Shop & Retail Ledger')}
                  {userPurpose === 'construction' && (isHindi ? 'ठेकेदारी व निर्माण लेजर' : 'Contractor & Site Ledger')}
                  {userPurpose === 'factory' && (isHindi ? 'कारखाना व वर्कशॉप खाता' : 'Factory & Workshop Ledger')}
                  {userPurpose === 'farm' && (isHindi ? 'खेत व किसानी बहीखाता' : 'Farm & Krishi Ledger')}
                  {userPurpose === 'household' && (isHindi ? 'घरेलू व परिवार बजट' : 'Home & Family Budget')}
                  {userPurpose === 'personal' && (isHindi ? 'पर्सनल वेल्थ खाता' : 'Personal Finance Engine')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {isHindi ? 'सक्रिय मोड' : 'Active Mode'}
                </span>
              </div>
              <p className="text-[10.5px] text-[var(--theme-text-muted,#8BA4D0)] line-clamp-1">
                {userPurpose === 'shop' && (isHindi ? 'गल्ला, बिक्री, सप्लायर भुगतान व ग्राहक उधारी' : 'Counter cash, retail sales, supplier & udhar')}
                {userPurpose === 'construction' && (isHindi ? 'साइट खर्च, मजदूर हाजिरी व क्लाइंट बिलिंग' : 'Site materials, labour attendance & client bills')}
                {userPurpose === 'factory' && (isHindi ? 'कारीगर मजदूरी, कच्चा माल खर्च व प्रोडक्शन' : 'Worker wages, raw materials & production orders')}
                {userPurpose === 'farm' && (isHindi ? 'फसल बिक्री, खाद-बीज, खेत मजदूर व ट्रैक्टर डीजल' : 'Crop sales, seeds & fertilizer, farm labour')}
                {userPurpose === 'household' && (isHindi ? 'मासिक राशन, घरेलू स्टाफ वेतन व पारिवारिक बचत' : 'Groceries, domestic staff wages & family savings')}
                {userPurpose === 'personal' && (isHindi ? 'मासिक वेतन, व्यक्तिगत खर्च, ईएमआई व 6-फंड बचत' : 'Salary, personal expenses, EMI & wealth goals')}
              </p>
            </div>
          </div>

          {onOpenChangePurpose && (
            <button
              type="button"
              onClick={onOpenChangePurpose}
              className="px-2.5 py-1 rounded-xl border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-bg,#070E1A)] text-[10.5px] font-bold text-[var(--theme-text-muted,#8BA4D0)] hover:text-[var(--theme-text,#F8FAFC)] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title={isHindi ? 'व्यापार या उपयोग का प्रकार बदलें' : 'Change Business / Usage Mode'}
            >
              <RefreshCw className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'मोड बदलें' : 'Switch Mode'}</span>
            </button>
          )}
        </div>

        {/* Tailored Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {userPurpose === 'shop' && (
            <>
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  +
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-emerald-300 truncate">
                    {isHindi ? 'दुकान बिक्री आय' : 'Counter Sale'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'गल्ला / कैश इन' : '+ Cash Income'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="p-2 sm:p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                  -
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-rose-300 truncate">
                    {isHindi ? 'सप्लायर / स्टॉक' : 'Supplier Pay'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'माल खरीद खर्च' : '- Purchase Expense'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateLoans}
                className="p-2 sm:p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-amber-300 truncate">
                    {isHindi ? 'ग्राहक उधारी' : 'Customer Udhar'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'बाकी खाता' : 'Ledger & Dues'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateInvoice}
                className="p-2 sm:p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-sky-300 truncate">
                    {isHindi ? 'बिल व चालान' : 'Bill / Invoice'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'रसीद बनाएं' : 'Instant Receipt'}
                  </div>
                </div>
              </button>
            </>
          )}

          {userPurpose === 'construction' && (
            <>
              <button
                type="button"
                onClick={onNavigateAttendance}
                className="p-2 sm:p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <CalendarCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-sky-300 truncate">
                    {isHindi ? 'मजदूर हाजिरी' : 'Labour Attendance'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'दैनिक उपस्थिति' : 'Daily Roll Call'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="p-2 sm:p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                  -
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-rose-300 truncate">
                    {isHindi ? 'साइट मटेरियल' : 'Site Material'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'सीमेंट, रेत, लोहा' : '- Site Expenses'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  +
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-emerald-300 truncate">
                    {isHindi ? 'क्लाइंट भुगतान' : 'Client Payment'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'साइट से आय' : '+ Contract Income'}
                  </div>
                </div>
              </button>
              <a
                href="https://staff.rozfiber.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-indigo-300 truncate">
                    Staff Manager ↗
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'फुल स्टाफ सैलरी' : 'Payroll & Slips'}
                  </div>
                </div>
              </a>
            </>
          )}

          {userPurpose === 'factory' && (
            <>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="p-2 sm:p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                  -
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-rose-300 truncate">
                    {isHindi ? 'कच्चा माल खर्च' : 'Raw Materials'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'फैक्टरी इनपुट' : '- Factory Material'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  +
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-emerald-300 truncate">
                    {isHindi ? 'उत्पाद बिक्री आय' : 'Product Sales'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'ऑर्डर इनकम' : '+ Order Income'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateAttendance}
                className="p-2 sm:p-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <CalendarCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-teal-300 truncate">
                    {isHindi ? 'कारीगर हाजिरी' : 'Worker Roll'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'दैनिक मजदूरी' : 'Attendance & Wage'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateReports}
                className="p-2 sm:p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-indigo-300 truncate">
                    {isHindi ? 'लागत रिपोर्ट' : 'Cost Report'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'लाभ व हानि' : 'Factory Analytics'}
                  </div>
                </div>
              </button>
            </>
          )}

          {userPurpose === 'farm' && (
            <>
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  🌾
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-emerald-300 truncate">
                    {isHindi ? 'फसल बिक्री आय' : 'Harvest Income'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'मंडी बिक्री' : '+ Crop Sales'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="p-2 sm:p-2.5 rounded-xl border border-lime-500/30 bg-lime-500/10 hover:bg-lime-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-xs shrink-0">
                  🧪
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-lime-300 truncate">
                    {isHindi ? 'खाद, बीज व डीजल' : 'Seeds & Diesel'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'खेती खर्च' : '- Farm Expenses'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateAttendance}
                className="p-2 sm:p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <CalendarCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-amber-300 truncate">
                    {isHindi ? 'खेत मजदूर हाजिरी' : 'Farm Labour'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'मजदूरी हिसाब' : 'Daily Mazdoor'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateLoans}
                className="p-2 sm:p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-sky-300 truncate">
                    {isHindi ? 'उधारी व ऋण खाता' : 'Loans & Credit'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'दुकानदार / किसान' : 'Udhar & Dues'}
                  </div>
                </div>
              </button>
            </>
          )}

          {userPurpose === 'household' && (
            <>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="p-2 sm:p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                  🛒
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-purple-300 truncate">
                    {isHindi ? 'राशन व बिजली बिल' : 'Groceries & Bills'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'घर खर्च' : '- House Expense'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  +
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-emerald-300 truncate">
                    {isHindi ? 'पारिवारिक आय' : 'Family Income'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'वेतन / जमा' : '+ Salary Deposit'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateGoals}
                className="p-2 sm:p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-indigo-300 truncate">
                    {isHindi ? 'पारिवारिक बचत' : 'Family Savings'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'बच्चों की शिक्षा' : 'Goals & Wealth'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onOpenBudgetManager}
                className="p-2 sm:p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <PieChart className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-sky-300 truncate">
                    {isHindi ? 'मासिक बजट' : 'Monthly Budget'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'खर्च सीमाएं' : 'Budget Planner'}
                  </div>
                </div>
              </button>
            </>
          )}

          {userPurpose === 'personal' && (
            <>
              <button
                type="button"
                onClick={() => onAddClick('income')}
                className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  +
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-emerald-300 truncate">
                    {isHindi ? 'मासिक सैलरी / आय' : 'Salary / Income'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'वेतन व फ्रीलांस' : '+ Earnings'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAddClick('expense')}
                className="p-2 sm:p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                  -
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-rose-300 truncate">
                    {isHindi ? 'दैनिक खर्च' : 'Daily Expense'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'पर्सनल खर्च' : '- Spends'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateGoals}
                className="p-2 sm:p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-sky-300 truncate">
                    {isHindi ? 'बचत लक्ष्य' : 'Savings Goals'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? '6-फंड वेल्थ' : 'Wealth Engine'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={onNavigateCalculator}
                className="p-2 sm:p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-amber-300 truncate">
                    {isHindi ? 'कैलकुलेटर' : 'Calculator'}
                  </div>
                  <div className="text-[9.5px] text-[var(--theme-text-muted,#8BA4D0)] truncate">
                    {isHindi ? 'ईएमआई व ब्याज' : 'Financial Tool'}
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* 4. DEMO / SAMPLE DATA REMOVAL (1-Click Clean) */}
      {hasDemoData && onRemoveDemoData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] sm:text-[13px] font-bold text-amber-200">
                {isHindi ? 'डेमो / सैंपल रिकॉर्ड्स सक्रिय हैं' : 'Sample / Demo Records Active'}
              </div>
              <div className="text-[10px] text-amber-300/80 truncate">
                {isHindi ? 'आप 1-क्लिक में सभी डेमो रिकॉर्ड्स हटाकर अपना असली खाता शुरू कर सकते हैं' : 'You can remove all sample records in 1 click and start fresh'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveDemoData}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] sm:text-[12px] shrink-0 transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डेमो हटाएं' : 'Remove Demo'}</span>
          </button>
        </motion.div>
      )}

      {/* 3. QUICK ACCESS */}
      <motion.section
        className="homepage-elevated-card rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06 }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.30))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <h3 className="text-[12.5px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {isHindi ? 'त्वरित पहुंच' : 'Quick Access'}
              </h3>
              <p className="text-[8.5px] sm:text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi ? 'इनवॉइस, रीसायकल, रजिस्टर व उपयोगी वित्तीय टूल्स' : 'Invoice, Recycle Bin, Register & key utilities'}
              </p>
            </div>
          </div>
          {onOpenFundSettings && (
            <button
              type="button"
              onClick={onOpenFundSettings}
              className="text-[9.5px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
            >
              Manage →
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 xs:gap-2 sm:gap-2.5">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                type="button"
                onClick={item.action}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 1, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                className={`quick-access-btn group relative min-w-0 rounded-xl sm:rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] px-1 py-2 sm:py-2.5 flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${item.hoverBorder} hover:bg-[var(--theme-card-hover,#19304A)] transition-colors shadow-xs cursor-pointer select-none`}
              >
                <div className={`h-7 w-7 sm:h-8.5 sm:w-8.5 rounded-lg sm:rounded-xl border ${item.iconBg} flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-110 shrink-0`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.3]" />
                </div>
                <span className="text-[9.5px] xs:text-[10px] sm:text-[11px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight text-center px-0.5 group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors leading-tight line-clamp-2 max-w-full break-words">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* 4. FINANCIAL GOALS + LOANS & EMIs (Responsive 2-column bento) */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
      >
        <ActiveGoalsWidget
          goals={goals}
          onOpenCreateGoal={onOpenCreateGoal}
          onOpenDepositGoal={onOpenDepositGoal}
          onNavigateGoals={onNavigateGoals}
          language={language}
          privacyMask={privacyMask}
        />
        {onNavigateLoans && (
          <LoanUdharWidget
            debtItems={debtItems}
            onOpenLedger={onNavigateLoans}
            onOpenAddModal={onOpenAddDebtModal || onNavigateLoans}
            language={language}
            privacyMask={privacyMask}
          />
        )}
      </motion.section>

      {/* 4.5 CATEGORY MONTHLY BUDGET OVERVIEW WIDGET */}
      {onOpenBudgetManager && (
        <BudgetOverviewWidget
          budgets={budgets}
          entries={entries}
          onOpenBudgetManager={onOpenBudgetManager}
          privacyMask={privacyMask}
        />
      )}

      {/* 5. TOP CATEGORIES */}
      <motion.section
        className="space-y-2.5 sm:space-y-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.14))] border border-[var(--theme-primary-border,rgba(56,189,248,0.28))] text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 shadow-xs">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[16px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {isHindi ? 'कैटेगरी के अनुसार खर्च' : 'Top Categories'}
              </h3>
              <p className="hidden sm:block text-[9.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">Your fund allocation at a glance</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] hover:opacity-80 cursor-pointer transition-opacity"
            >
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {primaryFunds.map((config) => {
            const FundIcon = getFundIcon(config.id, config.iconName);
            const pct = percentages[config.id] ?? config.defaultPct;
            const val = fundTotals[config.id] ?? 0;
            const fundTranslatedName =
              t.funds?.[config.id]?.name
                ? t.funds[config.id].name.split(' (')[0]
                : config.hindiLabel && isHindi
                ? config.hindiLabel
                : config.label;

            return (
              <FundCard3D
                key={config.id}
                config={config}
                val={val}
                pct={pct}
                fundTranslatedName={fundTranslatedName}
                subtitle={undefined}
                FundIcon={FundIcon}
                formatCurrency={formatCurrency}
                privacyMask={privacyMask}
                onClick={() => onFilterFund(config.id)}
                isPrimary={true}
                trend={categoryTrends[config.id]}
              />
            );
          })}
        </div>

        {overflowFunds.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-1">
            <button
              type="button"
              id="btn-view-more-categories"
              onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
              className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#0284C7)] hover:opacity-80 flex items-center gap-1 cursor-pointer transition-opacity"
            >
              {isViewMoreExpanded
                ? isHindi
                  ? 'कम श्रेणियां दिखाएं'
                  : 'Show Fewer Categories'
                : isHindi
                ? `+${overflowFunds.length} और देखें`
                : `View More Categories (+${overflowFunds.length})`}
              {isViewMoreExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span className="text-[9.5px] font-medium text-[var(--theme-text-dim,#64748B)]">{`6 of ${activeFunds.length} shown`}</span>
          </div>
        )}

        {isViewMoreExpanded && overflowFunds.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {overflowFunds.map((config) => {
              const FundIcon = getFundIcon(config.id, config.iconName);
              const pct = percentages[config.id] ?? config.defaultPct;
              const val = fundTotals[config.id] ?? 0;
              const fundTranslatedName =
                t.funds?.[config.id]?.name
                  ? t.funds[config.id].name.split(' (')[0]
                  : config.hindiLabel && isHindi
                  ? config.hindiLabel
                  : config.label;

              return (
                <FundCard3D
                  key={config.id}
                  config={config}
                  val={val}
                  pct={pct}
                  fundTranslatedName={fundTranslatedName}
                  subtitle={undefined}
                  FundIcon={FundIcon}
                  formatCurrency={formatCurrency}
                  privacyMask={privacyMask}
                  onClick={() => onFilterFund(config.id)}
                  isPrimary={false}
                  trend={categoryTrends[config.id]}
                />
              );
            })}
          </div>
        )}
      </motion.section>

      {/* 6. RECENT TRANSACTIONS */}
      <motion.section
        className="homepage-elevated-card rounded-[22px] sm:rounded-3xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3.5 sm:p-4 md:p-5 shadow-xs"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--theme-border,#213E61)]/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
              <History className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                {isHindi ? 'हाल ही के लेन-देन' : 'Recent Transactions'}
              </h3>
              <p className="hidden sm:block text-[9.5px] text-[var(--theme-text-dim,#94A3B8)]">Your latest transactions</p>
            </div>
          </div>

          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 cursor-pointer shrink-0 hover:opacity-80 transition-opacity"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick filter chips row (All / Today / Week / Month) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1">
          {[
            { id: 'all', label: isHindi ? 'सभी' : 'All' },
            { id: 'today', label: isHindi ? 'आज' : 'Today' },
            { id: 'week', label: isHindi ? 'इस सप्ताह' : 'Week' },
            { id: 'month', label: isHindi ? 'इस महीने' : 'Month' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setRecentFilter(chip.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[9.5px] sm:text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                recentFilter === chip.id
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 font-black shadow-xs'
                  : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] border border-[var(--theme-border,#213E61)]/60 hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
          {filteredRecentEntries.map((entry) => {
            const TxIcon = entry.type === 'income'
              ? getSourceIcon(entry.source || entry.category || '')
              : getCategoryIcon(entry.category || '');

            return (
              <motion.div
                key={entry.id}
                whileHover={{ y: -1.5, scale: 1.008 }}
                transition={{ duration: 0.18 }}
                className="min-w-0 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-2.5 sm:p-3 flex items-center justify-between gap-2 hover:border-[var(--theme-primary,#38BDF8)]/40 transition-colors shadow-xs cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl shrink-0 flex items-center justify-center ${
                      entry.type === 'income'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-[var(--theme-expense,#FF4D4D)] border border-red-500/35'
                    }`}
                  >
                    <TxIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                    <span
                      className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full flex items-center justify-center text-[7.5px] font-black border ${
                        entry.type === 'income'
                          ? 'bg-emerald-500 text-slate-950 border-slate-900'
                          : 'bg-[#FF4D4D] text-white border-slate-900'
                      }`}
                    >
                      {entry.type === 'income' ? '+' : '-'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] sm:text-xs font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                      {entry.category}
                    </span>
                    <span className="block text-[8px] sm:text-[9.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">{entry.date}</span>
                  </div>
                </div>
                <span
                  className={`font-mono font-extrabold text-[11px] sm:text-xs shrink-0 notranslate ${
                    entry.type === 'income' ? 'text-emerald-400' : 'text-[var(--theme-expense,#FF4D4D)]'
                  }`}
                  translate="no"
                >
                  {entry.type === 'income' ? '+' : '-'}
                  {formatCurrency(entry.amount, privacyMask)}
                </span>
              </motion.div>
            );
          })}

          {filteredRecentEntries.length === 0 && (
            <div className="col-span-full text-center py-6 text-[11px] text-slate-500">
              {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No transactions for selected period'}
            </div>
          )}
        </div>
      </motion.section>

      {/* 7. MOTIVATIONAL / FINANCIAL HINT (Theme-aware frosted glass card) */}
      <motion.div
        onClick={handleNextTip}
        className="homepage-elevated-card rounded-[20px] sm:rounded-2xl border border-[var(--theme-border,#213E61)]/80 bg-[var(--theme-card,#132438)]/90 backdrop-blur-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs cursor-pointer hover:border-[var(--theme-primary,#38BDF8)]/40 transition-all select-none"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.14 }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-[var(--theme-text,#F8FAFC)] truncate">
            {FINANCIAL_TIPS[currentTipIndex]}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] shrink-0" />
      </motion.div>

      {/* 8. SECURITY & PRIVACY TRUST BADGE */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-emerald-400 font-semibold text-[9.5px] sm:text-[10.5px]">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Local Storage • Zero Telemetry</span>
      </div>

      <HomepageFundSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        funds={activeFunds}
        homepageFundIds={primaryFunds.map((f) => f.id)}
        onSaveHomepageFundIds={(ids: string[]) => {
          if (onUpdateHomepageFundIds) onUpdateHomepageFundIds(ids);
          setIsSelectorOpen(false);
        }}
        onOpenFundSettings={onOpenFundSettings}
        language={language}
      />
    </div>
  );
};

export default HomeView;
