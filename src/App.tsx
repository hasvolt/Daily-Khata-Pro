import React, { useState, useEffect } from 'react';
import { Entry, FundType, Goal, WorkLog, DailyLifeLog, KhataData, AppTheme, AppLanguage } from './types';
import {
  DEFAULT_PERCENTAGES,
  DEFAULT_CATEGORIES,
  DEFAULT_INCOME_SOURCES,
  DEFAULT_WORK_CATEGORIES,
  DEFAULT_LIFE_TAGS,
  INITIAL_SAMPLE_ENTRIES
} from './data/defaults';
import { calculateFundTotals } from './utils/khataCalculations';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { AddView } from './components/AddView';
import { GoalsView } from './components/GoalsView';
import { HistoryView } from './components/HistoryView';
import { ReportView } from './components/ReportView';
import { WorkLifeTrackerView } from './components/WorkLifeTrackerView';
import { WorkModal } from './components/WorkModal';
import { DailyLifeModal } from './components/DailyLifeModal';
import { SettingsModal } from './components/SettingsModal';
import { GoalModal } from './components/GoalModal';
import { DepositGoalModal } from './components/DepositGoalModal';
import { UserManualModal } from './components/UserManualModal';
import { FundSplitCalculatorModal } from './components/FundSplitCalculatorModal';
import { HasVoltPromoBanner } from './components/HasVoltPromoBanner';
import { PrintArea } from './components/PrintArea';
import { PrintModal } from './components/PrintModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { InstallPWA } from './components/InstallPWA';
import { InstallModal } from './components/InstallModal';
import { ShareModal } from './components/ShareModal';
import { DeveloperModal } from './components/DeveloperModal';
import { DeveloperPage } from './components/DeveloperPage';
import { TRANSLATIONS } from './utils/translations';
import { Mail, Instagram, Twitter, FolderGit2, User, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'daily-khata-pro-v3';

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [dailyLifeLogs, setDailyLifeLogs] = useState<DailyLifeLog[]>([]);
  
  // Custom Dynamic Lists
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [incomeSources, setIncomeSources] = useState<string[]>(DEFAULT_INCOME_SOURCES);
  const [workCategories, setWorkCategories] = useState<string[]>(DEFAULT_WORK_CATEGORIES);
  const [lifeTags, setLifeTags] = useState<string[]>(DEFAULT_LIFE_TAGS);

  const [percentages, setPercentages] = useState<Record<FundType, number>>(DEFAULT_PERCENTAGES);
  const [theme, setTheme] = useState<AppTheme>('blue');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);
  
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [addInitialType, setAddInitialType] = useState<'income' | 'expense'>('income');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isDeveloperOpen, setIsDeveloperOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [printMonthDate, setPrintMonthDate] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string>('');

  // Goal Modals State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [depositGoal, setDepositGoal] = useState<Goal | null>(null);

  // Work & Daily Life Modals State
  const [isWorkModalOpen, setIsWorkModalOpen] = useState<boolean>(false);
  const [editingWork, setEditingWork] = useState<WorkLog | null>(null);
  const [isDailyLifeModalOpen, setIsDailyLifeModalOpen] = useState<boolean>(false);
  const [editingDailyLife, setEditingDailyLife] = useState<DailyLifeLog | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Listen for PWA Install event
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Deep Link URL Sync: Read query params on mount & popstate
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        if (typeof window === 'undefined') return;
        const searchParams = new URLSearchParams(window.location.search);
        const tabParam = searchParams.get('tab');
        const fundParam = searchParams.get('fund');
        const actionParam = searchParams.get('action');

        if (tabParam) {
          const normalized = tabParam.toLowerCase();
          if (normalized === 'home') setCurrentTab('home');
          else if (normalized === 'add') setCurrentTab('add');
          else if (normalized === 'tracker') setCurrentTab('tracker');
          else if (normalized === 'goals') setCurrentTab('goals');
          else if (normalized === 'history') setCurrentTab('history');
          else if (normalized === 'report' || normalized === 'reports') setCurrentTab('report');
          else if (normalized === 'developer' || normalized === 'dev' || normalized === 'creator' || normalized === 'founder') setCurrentTab('developer');
        }

        if (fundParam && ['personal', 'family', 'buffer', 'emergency', 'saving', 'investment'].includes(fundParam.toLowerCase())) {
          setHistoryFilter(fundParam.toLowerCase());
          setCurrentTab('history');
        }

        if (actionParam && (actionParam === 'income' || actionParam === 'expense')) {
          setAddInitialType(actionParam);
          setCurrentTab('add');
        }
      } catch (err) {
        console.error('URL sync read error', err);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // Update browser URL query string when active tab or fund filter changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      if (currentTab === 'home') {
        url.searchParams.delete('tab');
        url.searchParams.delete('fund');
        url.searchParams.delete('action');
      } else {
        url.searchParams.set('tab', currentTab);
        if (currentTab === 'history' && historyFilter !== 'all') {
          url.searchParams.set('fund', historyFilter);
        } else {
          url.searchParams.delete('fund');
        }
      }
      window.history.replaceState(null, '', url.toString());
    } catch (err) {
      // safe fallback in sandboxes
    }
  }, [currentTab, historyFilter]);

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('hasvolt-khata-v2');
      if (stored) {
        const parsed: KhataData = JSON.parse(stored);
        if (parsed.entries && Array.isArray(parsed.entries)) {
          setEntries(parsed.entries);
        }
        if (parsed.goals && Array.isArray(parsed.goals)) {
          setGoals(parsed.goals);
        }
        if (parsed.workLogs && Array.isArray(parsed.workLogs)) {
          setWorkLogs(parsed.workLogs);
        }
        if (parsed.dailyLifeLogs && Array.isArray(parsed.dailyLifeLogs)) {
          setDailyLifeLogs(parsed.dailyLifeLogs);
        }
        if (parsed.categories && Array.isArray(parsed.categories)) {
          setCategories(parsed.categories);
        }
        if (parsed.incomeSources && Array.isArray(parsed.incomeSources)) {
          setIncomeSources(parsed.incomeSources);
        }
        if (parsed.workCategories && Array.isArray(parsed.workCategories)) {
          setWorkCategories(parsed.workCategories);
        }
        if (parsed.lifeTags && Array.isArray(parsed.lifeTags)) {
          setLifeTags(parsed.lifeTags);
        }
        if (parsed.settings?.percentages) {
          setPercentages(parsed.settings.percentages);
        }
        if (parsed.settings?.theme) {
          setTheme(parsed.settings.theme);
        }
        if (parsed.settings?.language) {
          setLanguage(parsed.settings.language);
        }
        if (typeof parsed.settings?.privacyMask === 'boolean') {
          setPrivacyMask(parsed.settings.privacyMask);
        }
      } else {
        // Clean ledger start
        setEntries([]);
        setGoals([]);
        setWorkLogs([]);
        setDailyLifeLogs([]);
        setCategories(DEFAULT_CATEGORIES);
        setIncomeSources(DEFAULT_INCOME_SOURCES);
        setWorkCategories(DEFAULT_WORK_CATEGORIES);
        setLifeTags(DEFAULT_LIFE_TAGS);
        setTheme('blue');
        setLanguage('en');
        saveToLocalStorage([], [], DEFAULT_CATEGORIES, DEFAULT_INCOME_SOURCES, DEFAULT_WORK_CATEGORIES, DEFAULT_LIFE_TAGS, DEFAULT_PERCENTAGES, 'blue', 'en', false, [], []);
      }
    } catch (e) {
      console.error('Failed to load local data', e);
    }
  }, []);

  const saveToLocalStorage = (
    newEntries: Entry[] = entries,
    newGoals: Goal[] = goals,
    newCategories: string[] = categories,
    newIncomeSources: string[] = incomeSources,
    newWorkCategories: string[] = workCategories,
    newLifeTags: string[] = lifeTags,
    newPct: Record<FundType, number> = percentages,
    newTheme: AppTheme = theme,
    newLang: AppLanguage = language,
    newMask: boolean = privacyMask,
    newWorkLogs: WorkLog[] = workLogs,
    newDailyLifeLogs: DailyLifeLog[] = dailyLifeLogs
  ) => {
    try {
      const data: KhataData = {
        entries: newEntries,
        categories: newCategories,
        incomeSources: newIncomeSources,
        workCategories: newWorkCategories,
        lifeTags: newLifeTags,
        goals: newGoals,
        workLogs: newWorkLogs,
        dailyLifeLogs: newDailyLifeLogs,
        settings: {
          percentages: newPct,
          theme: newTheme,
          language: newLang,
          privacyMask: newMask
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2200);
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, newTheme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast(`Theme updated: ${newTheme.toUpperCase()}`);
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, newLang, privacyMask, workLogs, dailyLifeLogs);
    showToast(newLang === 'hi' ? 'भाषा हिन्दी सेट हो गई' : newLang === 'hinglish' ? 'Language Hinglish set' : 'Language set to English');
  };

  const handleTogglePrivacyMask = () => {
    const nextMask = !privacyMask;
    setPrivacyMask(nextMask);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, nextMask, workLogs, dailyLifeLogs);
    showToast(nextMask ? 'Privacy Mask Enabled' : 'Privacy Mask Disabled');
  };

  // Add / Edit Entry
  const handleSaveEntry = (
    entryData: Omit<Entry, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    let updatedEntries: Entry[];

    if (editingId) {
      updatedEntries = entries.map((e) =>
        e.id === editingId
          ? {
              ...e,
              ...entryData
            }
          : e
      );
      showToast(entryData.type === 'income' ? 'Income entry updated' : 'Expense entry updated');
    } else {
      const newEntry: Entry = {
        id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        createdAt: Date.now(),
        ...entryData
      };
      updatedEntries = [newEntry, ...entries];
      showToast(entryData.type === 'income' ? 'Income recorded successfully' : 'Expense recorded successfully');
    }

    setEntries(updatedEntries);
    saveToLocalStorage(updatedEntries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    setEditingEntry(null);
    setCurrentTab('home');
  };

  // Delete Entry
  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveToLocalStorage(updated, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast('Entry deleted');
  };

  // Quick Trigger for Add (from Home buttons)
  const handleAddClick = (type: 'income' | 'expense') => {
    setEditingEntry(null);
    setAddInitialType(type);
    setCurrentTab('add');
  };

  // Filter Fund from Home tile
  const handleFilterFund = (fund: FundType) => {
    setHistoryFilter(`fund:${fund}`);
    setCurrentTab('history');
  };

  // Custom Categories & Sources Handlers
  const handleAddCategory = (categoryName: string) => {
    if (!categories.includes(categoryName)) {
      const updated = [...categories, categoryName];
      setCategories(updated);
      saveToLocalStorage(entries, goals, updated, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
      showToast(`Category added: ${categoryName}`);
    }
  };

  const handleAddIncomeSource = (sourceName: string) => {
    if (!incomeSources.includes(sourceName)) {
      const updated = [...incomeSources, sourceName];
      setIncomeSources(updated);
      saveToLocalStorage(entries, goals, categories, updated, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
      showToast(`Income source added: ${sourceName}`);
    }
  };

  const handleAddWorkCategory = (catName: string) => {
    if (!workCategories.includes(catName)) {
      const updated = [...workCategories, catName];
      setWorkCategories(updated);
      saveToLocalStorage(entries, goals, categories, incomeSources, updated, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
      showToast(`Work category added: ${catName}`);
    }
  };

  const handleAddLifeTag = (tagName: string) => {
    if (!lifeTags.includes(tagName)) {
      const updated = [...lifeTags, tagName];
      setLifeTags(updated);
      saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, updated, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
      showToast(`Tag added: #${tagName}`);
    }
  };

  const handleUpdateCategories = (updatedCategories: string[]) => {
    setCategories(updatedCategories);
    saveToLocalStorage(entries, goals, updatedCategories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
  };

  const handleUpdateIncomeSources = (updatedSources: string[]) => {
    setIncomeSources(updatedSources);
    saveToLocalStorage(entries, goals, categories, updatedSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
  };

  const handleUpdateWorkCategories = (updatedWorkCats: string[]) => {
    setWorkCategories(updatedWorkCats);
    saveToLocalStorage(entries, goals, categories, incomeSources, updatedWorkCats, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
  };

  const handleUpdateLifeTags = (updatedTags: string[]) => {
    setLifeTags(updatedTags);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, updatedTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
  };

  const handleUpdatePercentages = (newPct: Record<FundType, number>) => {
    setPercentages(newPct);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, newPct, theme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast('6-Fund allocation rules updated');
  };

  // Edit action
  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setAddInitialType(entry.type);
    setCurrentTab('add');
  };

  // Goals Handlers
  const handleSaveGoal = (
    goalData: Omit<Goal, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    let updatedGoals: Goal[];
    if (editingId) {
      updatedGoals = goals.map((g) =>
        g.id === editingId
          ? {
              ...g,
              ...goalData
            }
          : g
      );
      showToast('Goal updated');
    } else {
      const newGoal: Goal = {
        id: 'goal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        createdAt: Date.now(),
        ...goalData
      };
      updatedGoals = [newGoal, ...goals];
      showToast('New Financial Goal created');
    }
    setGoals(updatedGoals);
    saveToLocalStorage(entries, updatedGoals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    saveToLocalStorage(entries, updated, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast('Goal removed');
  };

  const handleToggleCompleteGoal = (goalId: string) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const nextDone = !g.isCompleted;
        return {
          ...g,
          isCompleted: nextDone,
          completedAt: nextDone ? Date.now() : undefined
        };
      }
      return g;
    });
    setGoals(updated);
    saveToLocalStorage(entries, updated, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast('Goal status updated');
  };

  const handleDepositToGoal = (
    goalId: string,
    amount: number,
    deductFromFund?: FundType,
    note?: string
  ) => {
    let targetGoalTitle = 'Goal';
    let isNowComplete = false;

    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        targetGoalTitle = g.title;
        const newTotal = g.currentAmount + amount;
        const completed = newTotal >= g.targetAmount;
        isNowComplete = completed;
        return {
          ...g,
          currentAmount: newTotal,
          isCompleted: completed ? true : g.isCompleted,
          completedAt: completed ? Date.now() : g.completedAt
        };
      }
      return g;
    });

    let updatedEntries = entries;
    if (deductFromFund) {
      const newEntry: Entry = {
        id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        createdAt: Date.now(),
        type: 'expense',
        amount: amount,
        date: new Date().toISOString().slice(0, 10),
        fund: deductFromFund,
        category: categories[0] || 'General',
        note: note || `Goal Saving: ${targetGoalTitle}`,
        paymentMode: 'upi'
      };
      updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
    }

    setGoals(updatedGoals);
    saveToLocalStorage(updatedEntries, updatedGoals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);

    if (isNowComplete) {
      showToast(`Target achieved: ${targetGoalTitle}`);
    } else {
      showToast(`₹${amount} deposited to goal`);
    }
  };

  // Work & Daily Life Handlers
  const handleSaveWorkLog = (
    workData: Omit<WorkLog, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    let updatedWork: WorkLog[];
    if (editingId) {
      updatedWork = workLogs.map((w) =>
        w.id === editingId
          ? {
              ...w,
              ...workData
            }
          : w
      );
      showToast(language === 'hi' ? 'कार्य प्रविष्टि अपडेट हो गई' : 'Work record updated');
    } else {
      const newWork: WorkLog = {
        id: 'work_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        createdAt: Date.now(),
        ...workData
      };
      updatedWork = [newWork, ...workLogs];
      showToast(language === 'hi' ? 'नया कार्य रिकॉर्ड सहेजा गया' : 'Work deliverable recorded');
    }
    setWorkLogs(updatedWork);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, updatedWork, dailyLifeLogs);
    setIsWorkModalOpen(false);
    setEditingWork(null);
  };

  const handleDeleteWorkLog = (id: string) => {
    const updated = workLogs.filter((w) => w.id !== id);
    setWorkLogs(updated);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, updated, dailyLifeLogs);
    showToast(language === 'hi' ? 'कार्य रिकॉर्ड हटाया गया' : 'Work record deleted');
  };

  const handleSaveDailyLifeLog = (
    logData: Omit<DailyLifeLog, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    let updatedLife: DailyLifeLog[];
    if (editingId) {
      updatedLife = dailyLifeLogs.map((l) =>
        l.id === editingId
          ? {
              ...l,
              ...logData
            }
          : l
      );
      showToast(language === 'hi' ? 'दैनिक डायरी प्रविष्टि अपडेट हो गई' : 'Daily journal entry updated');
    } else {
      const newLog: DailyLifeLog = {
        id: 'life_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        createdAt: Date.now(),
        ...logData
      };
      updatedLife = [newLog, ...dailyLifeLogs];
      showToast(language === 'hi' ? 'आज की डायरी सहेजी गई' : "Today's journal entry saved");
    }
    setDailyLifeLogs(updatedLife);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, updatedLife);
    setIsDailyLifeModalOpen(false);
    setEditingDailyLife(null);
  };

  const handleDeleteDailyLifeLog = (id: string) => {
    const updated = dailyLifeLogs.filter((l) => l.id !== id);
    setDailyLifeLogs(updated);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, updated);
    showToast(language === 'hi' ? 'डायरी प्रविष्टि हटाई गई' : 'Journal entry deleted');
  };

  const handleRecordWorkIncomeToKhata = (work: WorkLog) => {
    if (!work.earningsOrCost || work.earningsOrCost <= 0) {
      showToast(language === 'hi' ? 'कृपया पहले आय राशि दर्ज करें' : 'Please enter income amount first');
      return;
    }
    const newEntry: Entry = {
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      createdAt: Date.now(),
      type: 'income',
      amount: work.earningsOrCost,
      date: work.date || new Date().toISOString().slice(0, 10),
      source: work.category || incomeSources[0] || 'Client Project',
      clientName: work.clientOrCompany || '',
      note: `Work Income: ${work.title}${work.clientOrCompany ? ` (${work.clientOrCompany})` : ''}`,
      paymentMode: 'upi'
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveToLocalStorage(updatedEntries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast(language === 'hi' ? `₹${work.earningsOrCost} खाता में दर्ज` : `₹${work.earningsOrCost} recorded to ledger`);
  };

  // Restore backup
  const handleRestoreData = (restored: KhataData) => {
    setEntries(restored.entries || []);
    setGoals(restored.goals || []);
    setWorkLogs(restored.workLogs || []);
    setDailyLifeLogs(restored.dailyLifeLogs || []);
    setCategories(restored.categories || DEFAULT_CATEGORIES);
    setIncomeSources(restored.incomeSources || DEFAULT_INCOME_SOURCES);
    setWorkCategories(restored.workCategories || DEFAULT_WORK_CATEGORIES);
    setLifeTags(restored.lifeTags || DEFAULT_LIFE_TAGS);
    setPercentages(restored.settings?.percentages || DEFAULT_PERCENTAGES);
    if (restored.settings?.theme) {
      setTheme(restored.settings.theme);
    }
    if (restored.settings?.language) {
      setLanguage(restored.settings.language);
    }
    saveToLocalStorage(
      restored.entries || [],
      restored.goals || [],
      restored.categories || DEFAULT_CATEGORIES,
      restored.incomeSources || DEFAULT_INCOME_SOURCES,
      restored.workCategories || DEFAULT_WORK_CATEGORIES,
      restored.lifeTags || DEFAULT_LIFE_TAGS,
      restored.settings?.percentages || DEFAULT_PERCENTAGES,
      restored.settings?.theme || theme,
      restored.settings?.language || language,
      typeof restored.settings?.privacyMask === 'boolean' ? restored.settings.privacyMask : privacyMask,
      restored.workLogs || [],
      restored.dailyLifeLogs || []
    );
    showToast('Backup restored successfully');
  };

  // Reset all
  const handleResetData = () => {
    setEntries([]);
    setGoals([]);
    setWorkLogs([]);
    setDailyLifeLogs([]);
    saveToLocalStorage([], [], categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, [], []);
    showToast('All local data reset');
  };

  // Load sample
  const handleLoadSampleData = () => {
    const sampleWork: WorkLog[] = [
      {
        id: 'sample_work_1',
        date: new Date().toISOString().slice(0, 10),
        title: 'Full-Stack Architecture & Cloud Deployment',
        clientOrCompany: 'Nexus Enterprise',
        category: 'Development',
        status: 'completed',
        hoursSpent: 6,
        earningsOrCost: 15000,
        notes: 'API endpoints deployed, database scaled, security audit completed.',
        deliverables: ['Production API rollout', 'Database indexing', 'Client approval'],
        location: 'Remote',
        createdAt: Date.now() - 3600000 * 4
      },
      {
        id: 'sample_work_2',
        date: new Date().toISOString().slice(0, 10),
        title: 'Q3 Financial Audit & Strategy Review',
        clientOrCompany: 'Apex Retail',
        category: 'Consulting',
        status: 'in_progress',
        hoursSpent: 4,
        earningsOrCost: 8000,
        notes: 'Reviewing quarterly balance sheets, tax allocations and cash flow.',
        deliverables: ['Audit spreadsheet', 'P&L analysis'],
        location: 'Office',
        createdAt: Date.now() - 3600000 * 8
      }
    ];

    const sampleLife: DailyLifeLog[] = [
      {
        id: 'sample_life_1',
        date: new Date().toISOString().slice(0, 10),
        title: 'High Focus & Healthy Discipline',
        highlights: 'Woke at 6:00 AM. Completed major deliverables on schedule. Evening exercise and family conversation.',
        morningRoutine: 'Morning run 5km, meditation, balanced breakfast.',
        afternoonRoutine: 'Deep work sprint, completed client milestones.',
        eveningRoutine: 'Reading, financial review on Daily Khata, restful sleep.',
        mood: 'productive',
        wakeTime: '06:00',
        sleepTime: '22:30',
        keyLearnings: 'Consistent morning routines enhance daily execution focus.',
        gratitude: 'Grateful for health, supportive peers, and daily progress.',
        tags: ['Productivity', 'Health', 'Focus', 'Finance'],
        createdAt: Date.now()
      }
    ];

    setEntries(INITIAL_SAMPLE_ENTRIES);
    setGoals([
      {
        id: 'sample_goal_1',
        title: 'Emergency 6-Month Reserve',
        icon: 'shield',
        category: 'Emergency Reserve',
        targetAmount: 100000,
        currentAmount: 35000,
        linkedFund: 'emergency',
        targetDate: '2026-12-31',
        createdAt: Date.now()
      }
    ]);
    setWorkLogs(sampleWork);
    setDailyLifeLogs(sampleLife);

    saveToLocalStorage(
      INITIAL_SAMPLE_ENTRIES,
      [
        {
          id: 'sample_goal_1',
          title: 'Emergency 6-Month Reserve',
          icon: 'shield',
          category: 'Emergency Reserve',
          targetAmount: 100000,
          currentAmount: 35000,
          linkedFund: 'emergency',
          targetDate: '2026-12-31',
          createdAt: Date.now()
        }
      ],
      DEFAULT_CATEGORIES,
      DEFAULT_INCOME_SOURCES,
      DEFAULT_WORK_CATEGORIES,
      DEFAULT_LIFE_TAGS,
      DEFAULT_PERCENTAGES,
      theme,
      language,
      privacyMask,
      sampleWork,
      sampleLife
    );
    showToast('Sample data loaded');
  };

  // Print PDF trigger
  const handleTriggerPrint = (targetMonth: Date = new Date()) => {
    setPrintMonthDate(targetMonth);
    setIsPrintModalOpen(true);
  };

  const fundTotals = calculateFundTotals(entries);

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] flex flex-col font-sans pb-24 md:pb-28 transition-colors duration-300"
    >
      {/* Top Header */}
      <div className="no-print">
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenManual={() => setIsManualOpen(true)}
          onOpenSimulator={() => setIsCalculatorOpen(true)}
          onOpenSourceCode={() => setIsSourceCodeOpen(true)}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenDeveloper={() => setIsDeveloperOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onThemeChange={handleThemeChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          privacyMask={privacyMask}
          onTogglePrivacyMask={handleTogglePrivacyMask}
        />
      </div>

      {/* Main Container */}
      <main className="no-print flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6">
        {currentTab === 'home' && (
          <HomeView
            entries={entries}
            goals={goals}
            workLogs={workLogs}
            dailyLifeLogs={dailyLifeLogs}
            percentages={percentages}
            onAddClick={handleAddClick}
            onFilterFund={handleFilterFund}
            onViewHistory={() => {
              setHistoryFilter('all');
              setCurrentTab('history');
            }}
            onNavigateGoals={() => setCurrentTab('goals')}
            onNavigateTracker={() => setCurrentTab('tracker')}
            onOpenWorkModal={() => {
              setEditingWork(null);
              setIsWorkModalOpen(true);
            }}
            onOpenDailyLifeModal={() => {
              setEditingDailyLife(null);
              setIsDailyLifeModalOpen(true);
            }}
            onOpenManual={() => setIsManualOpen(true)}
            language={language}
            privacyMask={privacyMask}
          />
        )}

        {currentTab === 'add' && (
          <AddView
            initialType={addInitialType}
            editingEntry={editingEntry}
            categories={categories}
            incomeSources={incomeSources}
            percentages={percentages}
            fundTotals={fundTotals}
            onSaveEntry={handleSaveEntry}
            onCancelEdit={() => {
              setEditingEntry(null);
              setCurrentTab('home');
            }}
            onAddCategory={handleAddCategory}
            onAddIncomeSource={handleAddIncomeSource}
            language={language}
            privacyMask={privacyMask}
          />
        )}

        {currentTab === 'tracker' && (
          <WorkLifeTrackerView
            workLogs={workLogs}
            dailyLifeLogs={dailyLifeLogs}
            onOpenWorkModal={(work) => {
              setEditingWork(work || null);
              setIsWorkModalOpen(true);
            }}
            onOpenDailyLifeModal={(log) => {
              setEditingDailyLife(log || null);
              setIsDailyLifeModalOpen(true);
            }}
            onDeleteWorkLog={handleDeleteWorkLog}
            onDeleteDailyLifeLog={handleDeleteDailyLifeLog}
            onRecordWorkIncomeToKhata={handleRecordWorkIncomeToKhata}
            language={language}
          />
        )}

        {currentTab === 'goals' && (
          <GoalsView
            goals={goals}
            onOpenCreateGoal={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            onEditGoal={(goal) => {
              setEditingGoal(goal);
              setIsGoalModalOpen(true);
            }}
            onDeleteGoal={handleDeleteGoal}
            onOpenDeposit={(goal) => {
              setDepositGoal(goal);
            }}
            onToggleComplete={handleToggleCompleteGoal}
            language={language}
            privacyMask={privacyMask}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            entries={entries}
            activeFilter={historyFilter}
            onFilterChange={setHistoryFilter}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onTriggerPrint={handleTriggerPrint}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateAdd={() => {
              setEditingEntry(null);
              setAddInitialType('income');
              setCurrentTab('add');
            }}
            language={language}
            privacyMask={privacyMask}
          />
        )}

        {currentTab === 'report' && (
          <ReportView
            entries={entries}
            categories={categories}
            percentages={percentages}
            onUpdatePercentages={handleUpdatePercentages}
            onAddCategory={handleAddCategory}
            onRemoveCategory={(cat) => handleUpdateCategories(categories.filter((c) => c !== cat))}
            onTriggerPrint={handleTriggerPrint}
            language={language}
            privacyMask={privacyMask}
          />
        )}

        {currentTab === 'developer' && (
          <DeveloperPage
            onBack={() => setCurrentTab('home')}
            language={language}
            onOpenShare={() => setIsShareOpen(true)}
          />
        )}

        {/* Sponsor / Ad Banner */}
        <section className="pt-6 pb-2">
          <HasVoltPromoBanner />
        </section>

        {/* Professional Footer */}
        <footer className="pt-4 pb-3 text-center text-[11.5px] text-[#64748B] space-y-2.5 select-none">
          {/* Creator & Developer Badge */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setCurrentTab('developer')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all cursor-pointer shadow-xs active:scale-95 text-[11.5px]"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--theme-primary,#38BDF8)] bg-[#070E18] shrink-0">
                <img
                  src="/md-zafeer-hasan-yazdaan.jpg"
                  alt="MD Zafeer Hasan (YAZDAAN)"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[#94A3B8]">Creator:</span>
              <span className="font-bold text-[#F8FAFC]">MD Zafeer Hasan <span className="text-[var(--theme-primary,#38BDF8)] font-mono text-[10.5px]">(YAZDAAN)</span></span>
              <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.2 rounded font-bold">Verified</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[12px]">
            <a
              href="https://github.com/hasvolt/Daily-Khata-Pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#CBD5E1] hover:text-[#10B981] transition-colors"
              title="GitHub Source Code Repository"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-medium">GitHub / Daily-Khata-Pro</span>
            </a>

            <a
              href="mailto:yazdaantalk@gmail.com"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] text-[#CBD5E1] hover:text-[#38BDF8] transition-colors"
              title="Official Developer Email"
            >
              <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-medium">yazdaantalk@gmail.com</span>
            </a>

            <a
              href="https://www.instagram.com/dailykhatapro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] text-[#CBD5E1] hover:text-[#E1306C] transition-colors"
              title="Official Instagram @dailykhatapro"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span className="font-medium">@dailykhatapro</span>
            </a>

            <a
              href="https://x.com/Dailykhatapro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#1DA1F2] text-[#CBD5E1] hover:text-[#1DA1F2] transition-colors"
              title="Official X / Twitter @Dailykhatapro"
            >
              <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
              <span className="font-medium">@Dailykhatapro</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-medium text-[11px]">
            <span className="font-bold text-[#CBD5E1]">Daily Khata: Pro™</span>
            <span>•</span>
            <span>100% Client-Side Universal Ledger</span>
            <span>•</span>
            <button
              onClick={() => setIsDeveloperOpen(true)}
              className="text-[var(--theme-primary,#38BDF8)] hover:underline font-bold transition-colors cursor-pointer"
            >
              Developer Info
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSourceCodeOpen(true)}
              className="text-[#10B981] hover:underline font-bold transition-colors cursor-pointer"
            >
              Verify Safety &amp; Code
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] underline transition-colors cursor-pointer"
            >
              Trust &amp; Privacy
            </button>
          </div>
          <p className="text-[10px] text-[#475569]">
            Universal Income &amp; Expense Accounting · Work Deliverables &amp; Daily Life Journal · Open Source MIT
          </p>
        </footer>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="no-print">
        <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} language={language} />
      </div>

      {/* Goal Create / Edit Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        editingGoal={editingGoal}
      />

      {/* Deposit to Goal Modal */}
      <DepositGoalModal
        isOpen={Boolean(depositGoal)}
        onClose={() => setDepositGoal(null)}
        goal={depositGoal}
        onDeposit={handleDepositToGoal}
      />

      {/* Settings, Custom Options & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={{
          entries,
          goals,
          workLogs,
          dailyLifeLogs,
          categories,
          incomeSources,
          workCategories,
          lifeTags,
          settings: { percentages, theme, language, privacyMask }
        }}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
        onLoadSampleData={handleLoadSampleData}
        onUpdatePercentages={handleUpdatePercentages}
        onUpdateCategories={handleUpdateCategories}
        onUpdateIncomeSources={handleUpdateIncomeSources}
        onUpdateWorkCategories={handleUpdateWorkCategories}
        onUpdateLifeTags={handleUpdateLifeTags}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenDeveloper={() => setIsDeveloperOpen(true)}
        theme={theme}
        onThemeChange={handleThemeChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        privacyMask={privacyMask}
        onTogglePrivacyMask={handleTogglePrivacyMask}
      />

      {/* Work Log Create / Edit Modal */}
      <WorkModal
        isOpen={isWorkModalOpen}
        onClose={() => {
          setIsWorkModalOpen(false);
          setEditingWork(null);
        }}
        onSave={handleSaveWorkLog}
        initialLog={editingWork}
        workCategories={workCategories}
        onAddWorkCategory={handleAddWorkCategory}
        language={language}
      />

      {/* Daily Life Story Create / Edit Modal */}
      <DailyLifeModal
        isOpen={isDailyLifeModalOpen}
        onClose={() => {
          setIsDailyLifeModalOpen(false);
          setEditingDailyLife(null);
        }}
        onSave={handleSaveDailyLifeLog}
        initialLog={editingDailyLife}
        lifeTags={lifeTags}
        onAddLifeTag={handleAddLifeTag}
        language={language}
      />

      {/* 6-Fund Split Simulator Modal */}
      <FundSplitCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        percentages={percentages}
        language={language}
        onApplyToIncome={() => {
          setEditingEntry(null);
          setAddInitialType('income');
          setCurrentTab('add');
        }}
      />

      {/* User Manual Modal */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
      />

      {/* Source Code & Security Audit Modal */}
      <SourceCodeModal
        isOpen={isSourceCodeOpen}
        onClose={() => setIsSourceCodeOpen(false)}
        language={language}
        entriesCount={entries.length}
        goalsCount={goals.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-22 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full font-bold text-[13px] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none"
          style={{
            backgroundColor: 'var(--theme-btn-bg, #38BDF8)',
            color: 'var(--theme-btn-text, #040D17)'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Print View for PDF generation */}
      <PrintArea entries={entries} targetMonth={printMonthDate} />

      {/* Interactive Print & PDF Statement Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        entries={entries}
        targetMonth={printMonthDate}
      />

      {/* Floating PWA Install Bar */}
      <InstallPWA
        language={language}
        installPrompt={installPrompt}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Dedicated Install / Download App Guide Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
        installPrompt={installPrompt}
        onTriggerInstall={() => {
          if (installPrompt) {
            installPrompt.prompt();
          }
        }}
      />

      {/* Share Page & Deep Link Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        currentTab={currentTab}
        language={language}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsShareOpen(false);
        }}
      />

      {/* Developer Information Modal */}
      <DeveloperModal
        isOpen={isDeveloperOpen}
        onClose={() => setIsDeveloperOpen(false)}
        language={language}
      />
    </div>
  );
}
