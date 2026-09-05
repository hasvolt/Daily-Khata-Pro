import { getCurrencyConfig, getCurrentLanguage, formatCurrencyByLang } from "./utils/currencyConfig";
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Entry, FundType, FundConfig, Goal, WorkLog, DailyLifeLog, PersonalNote, KhataData, AppTheme, AppLanguage, AppViewMode, SecurityLockConfig, AppLayout, TrashItem, AttendanceLog, AppReminder } from './types';
import {
  DEFAULT_FUNDS,
  DEFAULT_PERCENTAGES,
  DEFAULT_CATEGORIES,
  DEFAULT_INCOME_SOURCES,
  DEFAULT_WORK_CATEGORIES,
  DEFAULT_LIFE_TAGS,
  INITIAL_SAMPLE_ENTRIES,
  INITIAL_SAMPLE_PERSONAL_NOTES,
  DEFAULT_SECURITY_LOCK
} from './data/defaults';
import { calculateFundTotals, formatCurrency } from './utils/khataCalculations';
import { setCurrentLanguage } from './utils/currencyConfig';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { AddView } from './components/AddView';
import { GoalsView } from './components/GoalsView';
import { HistoryView } from './components/HistoryView';
import { ReportView } from './components/ReportView';
import { WorkLifeTrackerView } from './components/WorkLifeTrackerView';
import { PersonalNotesView } from './components/PersonalNotesView';
import { WorkModal } from './components/WorkModal';
import { DailyLifeModal } from './components/DailyLifeModal';
import { PersonalNoteModal } from './components/PersonalNoteModal';
import { SettingsModal } from './components/SettingsModal';
import { GoalModal } from './components/GoalModal';
import { DepositGoalModal } from './components/DepositGoalModal';
import { LockScreen } from './components/LockScreen';
import { SecurityLockModal } from './components/SecurityLockModal';
import { UserManualModal } from './components/UserManualModal';
import { MultiCalculatorModal } from './components/MultiCalculatorModal';
import { TrashModal } from './components/TrashModal';
import { MasterEditModal } from './components/MasterEditModal';
import { HasVoltPromoBanner } from './components/HasVoltPromoBanner';
import { GoogleAdBanner } from './components/GoogleAdBanner';
import { PrintModal } from './components/PrintModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { InstallPWA } from './components/InstallPWA';
import { InstallModal } from './components/InstallModal';
import { ShareModal } from './components/ShareModal';
import { SupportFeedbackModal, SupportTab } from './components/SupportFeedbackModal';
import { DeveloperPage } from './components/DeveloperPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { DisclaimerPage } from './components/DisclaimerPage';
import { TermsPage } from './components/TermsPage';
import { GuidePage } from './components/GuidePage';
import { SafetyPage } from './components/SafetyPage';
import { SupportPage } from './components/SupportPage';
import { CalculatorPage } from './components/CalculatorPage';
import { AttendancePage } from './components/AttendancePage';
import { RemindersModal } from './components/RemindersModal';
import { TRANSLATIONS } from './utils/translations';
import { updatePageSEO } from './utils/seo';
import { Mail, Instagram, Twitter, FolderGit2, User, Sparkles, Menu } from 'lucide-react';

const STORAGE_KEY = 'daily-khata-pro-v3';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [dailyLifeLogs, setDailyLifeLogs] = useState<DailyLifeLog[]>([]);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);
  
  // Custom Dynamic Lists
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [incomeSources, setIncomeSources] = useState<string[]>(DEFAULT_INCOME_SOURCES);
  const [workCategories, setWorkCategories] = useState<string[]>(DEFAULT_WORK_CATEGORIES);
  const [lifeTags, setLifeTags] = useState<string[]>(DEFAULT_LIFE_TAGS);

  // Dynamic Funds & Homepage Categories
  const [funds, setFunds] = useState<FundConfig[]>(DEFAULT_FUNDS);
  const [homepageFundIds, setHomepageFundIds] = useState<string[]>(
    DEFAULT_FUNDS.slice(0, 6).map((f) => f.id)
  );

  const [percentages, setPercentages] = useState<Record<FundType, number>>(DEFAULT_PERCENTAGES);
  const [theme, setTheme] = useState<AppTheme>('blue');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<AppViewMode>('auto');
  const [appLayout, setAppLayout] = useState<AppLayout>('dashboard');
    const [securityLock, setSecurityLock] = useState<SecurityLockConfig>(() => {
    try {
      const saved = localStorage.getItem('khata_security_config');
      return saved ? JSON.parse(saved) : DEFAULT_SECURITY_LOCK;
    } catch (e) {
      return DEFAULT_SECURITY_LOCK;
    }
  });
    const [isAppLocked, setIsAppLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('khata_security_config');
      if (saved) {
        const config = JSON.parse(saved);
        return config.isEnabled && !!config.pin;
      }
      return false;
    } catch (e) {
      return false;
    }
  });
  
  // Re-add currentTab and normalize it based on pathname
  const rawPath = location.pathname.substring(1);
  const currentTab = rawPath === '' ? 'home' : rawPath;

  const setCurrentTab = (tab: string) => {
    if (tab === 'home') navigate('/');
    else navigate(`/${tab}`);
  };

  const [addInitialType, setAddInitialType] = useState<'income' | 'expense'>('income');
  const [addInitialAmount, setAddInitialAmount] = useState<number | undefined>(undefined);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [supportModalTab, setSupportModalTab] = useState<SupportTab>('help');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isTrashOpen, setIsTrashOpen] = useState<boolean>(false);
  const [isMasterEditOpen, setIsMasterEditOpen] = useState<boolean>(false);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [reminders, setReminders] = useState<AppReminder[]>([]);
  const [isRemindersOpen, setIsRemindersOpen] = useState<boolean>(false);
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

  // Personal Notes Modal State
  const [isPersonalNoteModalOpen, setIsPersonalNoteModalOpen] = useState<boolean>(false);
  const [editingPersonalNote, setEditingPersonalNote] = useState<PersonalNote | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Listen for PWA Install event with early capture fallback
  useEffect(() => {
    // Check if early capture in index.html already received the prompt
    if (typeof window !== 'undefined') {
      const earlyPrompt = (window as any).deferredPrompt || (window as any).__DAILY_KHATA_PWA_PROMPT__;
      if (earlyPrompt) {
        setInstallPrompt(earlyPrompt);
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      (window as any).__DAILY_KHATA_PWA_PROMPT__ = e;
      setInstallPrompt(e);
    };

    const handleCustomInstallReady = (e: any) => {
      if (e?.detail) {
        setInstallPrompt(e.detail);
      }
    };

    const handleAppInstalled = () => {
      (window as any).deferredPrompt = null;
      (window as any).__DAILY_KHATA_PWA_PROMPT__ = null;
      setInstallPrompt(null);
      setToastMessage(language === 'hi' ? 'ऐप सफलतापूर्वक इंस्टॉल हो गया!' : 'Daily Khata App Installed Successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('pwa-install-ready', handleCustomInstallReady);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('pwa-install-ready', handleCustomInstallReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [language]);

  // Dynamic SEO Synchronization: Updates document.title, canonical tag, and meta description per route for Google Search Console
  useEffect(() => {
    updatePageSEO(location.pathname);
  }, [location.pathname]);

  // Deep Link URL Sync: Read hashes and query params on mount & navigation for universal deep linking
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        if (typeof window === 'undefined') return;

        // 1. Check window.location.hash (e.g. #/developer or #developer)
        if (window.location.hash) {
          const cleanHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
          if (cleanHash === 'developer' || cleanHash === 'dev' || cleanHash === 'creator' || cleanHash === 'founder') {
            navigate('/developer');
            return;
          }
          if (['about', 'privacy', 'terms', 'disclaimer', 'safety', 'guide', 'calculator', 'support', 'history', 'report', 'goals', 'tracker', 'notes'].includes(cleanHash)) {
            navigate(`/${cleanHash}`);
            return;
          }
        }

        // 2. Check query params (e.g. ?p=developer from 404.html or ?tab=developer)
        const searchParams = new URLSearchParams(window.location.search);
        const pParam = searchParams.get('p');
        if (pParam) {
          const cleanP = pParam.replace(/^\/+/, '').toLowerCase().trim();
          if (cleanP === 'developer' || cleanP === 'dev' || cleanP === 'creator' || cleanP === 'founder') {
            navigate('/developer');
            return;
          }
          if (cleanP) {
            navigate(`/${cleanP}`);
            return;
          }
        }

        const tabParam = searchParams.get('tab');
        const pageParam = searchParams.get('page') || searchParams.get('view');
        const targetRoute = (tabParam || pageParam || '').toLowerCase().trim();

        if (targetRoute) {
          if (targetRoute === 'dev' || targetRoute === 'creator' || targetRoute === 'founder' || targetRoute === 'developer') {
            navigate('/developer');
            return;
          }
          if (targetRoute === 'reports') setCurrentTab('report');
          else if (targetRoute === 'about-us' || targetRoute === 'about') navigate('/about');
          else if (targetRoute === 'privacy-policy' || targetRoute === 'privacy') navigate('/privacy');
          else if (targetRoute === 'terms-of-service' || targetRoute === 'terms') navigate('/terms');
          else setCurrentTab(targetRoute);
        }

        const fundParam = searchParams.get('fund');
        const actionParam = searchParams.get('action');

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
  }, []);

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
        if (parsed.personalNotes && Array.isArray(parsed.personalNotes)) {
          setPersonalNotes(parsed.personalNotes);
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
        if (parsed.funds && Array.isArray(parsed.funds) && parsed.funds.length > 0) {
          setFunds(parsed.funds);
        } else if (parsed.settings?.funds && Array.isArray(parsed.settings.funds) && parsed.settings.funds.length > 0) {
          setFunds(parsed.settings.funds);
        }
        if (parsed.homepageFundIds && Array.isArray(parsed.homepageFundIds) && parsed.homepageFundIds.length > 0) {
          setHomepageFundIds(parsed.homepageFundIds);
        } else if (parsed.settings?.homepageFundIds && Array.isArray(parsed.settings.homepageFundIds) && parsed.settings.homepageFundIds.length > 0) {
          setHomepageFundIds(parsed.settings.homepageFundIds);
        }
        if (parsed.settings?.percentages) {
          setPercentages(parsed.settings.percentages);
        }
        if (parsed.settings?.theme) {
          setTheme(parsed.settings.theme);
        }
        if (parsed.settings?.language) {
          setLanguage(parsed.settings.language);
          setCurrentLanguage(parsed.settings.language);
        }
        if (typeof parsed.settings?.privacyMask === 'boolean') {
          setPrivacyMask(parsed.settings.privacyMask);
        }
        if (parsed.settings?.viewMode) {
          setViewMode(parsed.settings.viewMode);
        }
        if (parsed.settings?.appLayout) {
          setAppLayout(parsed.settings.appLayout);
        }
        if (parsed.settings?.securityLock) {
          setSecurityLock(parsed.settings.securityLock);
          if (parsed.settings.securityLock.isEnabled && parsed.settings.securityLock.pin) {
            setIsAppLocked(true);
          }
        }
      } else {
        // Clean record start
        setEntries([]);
        setGoals([]);
        setWorkLogs([]);
        setDailyLifeLogs([]);
        setCategories(DEFAULT_CATEGORIES);
        setIncomeSources(DEFAULT_INCOME_SOURCES);
        setWorkCategories(DEFAULT_WORK_CATEGORIES);
        setLifeTags(DEFAULT_LIFE_TAGS);
        setFunds(DEFAULT_FUNDS);
        setHomepageFundIds(DEFAULT_FUNDS.slice(0, 6).map((f) => f.id));
        setTheme('blue');
        setLanguage('en');
        setViewMode('auto');
        setAppLayout('dashboard');
        setSecurityLock(DEFAULT_SECURITY_LOCK);
        setIsAppLocked(false);
        saveToLocalStorage({
          entries: [],
          goals: [],
          categories: DEFAULT_CATEGORIES,
          incomeSources: DEFAULT_INCOME_SOURCES,
          workCategories: DEFAULT_WORK_CATEGORIES,
          lifeTags: DEFAULT_LIFE_TAGS,
          funds: DEFAULT_FUNDS,
          homepageFundIds: DEFAULT_FUNDS.slice(0, 6).map((f) => f.id),
          percentages: DEFAULT_PERCENTAGES,
          theme: 'blue',
          language: 'en',
          privacyMask: false,
          workLogs: [],
          dailyLifeLogs: [],
          securityLock: DEFAULT_SECURITY_LOCK,
          personalNotes: [],
          viewMode: 'auto'
        });
      }

      // Load Trash/Recycle items
      try {
        const storedTrash = localStorage.getItem('dailykhata_trash_v1');
        if (storedTrash) {
          const parsedTrash = JSON.parse(storedTrash);
          if (Array.isArray(parsedTrash)) {
            setTrashItems(parsedTrash);
          }
        }
      } catch (e) {
        console.error('Failed to load trash data', e);
      }

      // Load Attendance records
      try {
        const storedAttendance = localStorage.getItem('dailykhata_attendance_v1');
        if (storedAttendance) {
          const parsed = JSON.parse(storedAttendance);
          if (Array.isArray(parsed)) {
            setAttendanceLogs(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load attendance logs', e);
      }

      // Load Reminders
      try {
        const storedReminders = localStorage.getItem('dailykhata_reminders_v1');
        if (storedReminders) {
          const parsed = JSON.parse(storedReminders);
          if (Array.isArray(parsed)) {
            setReminders(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load reminders', e);
      }
    } catch (e) {
      console.error('Failed to load local data', e);
    }
  }, []);

  // Auto-lock when user leaves tab / switches app (if autoLockOnLeave is enabled)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (securityLock.isEnabled && securityLock.pin && securityLock.autoLockOnLeave) {
          setIsAppLocked(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [securityLock]);

  const saveToLocalStorage = (
    arg1?: {
      entries?: Entry[];
      goals?: Goal[];
      categories?: string[];
      incomeSources?: string[];
      workCategories?: string[];
      lifeTags?: string[];
      funds?: FundConfig[];
      homepageFundIds?: string[];
      percentages?: Record<FundType, number>;
      theme?: AppTheme;
      language?: AppLanguage;
      privacyMask?: boolean;
      viewMode?: AppViewMode;
      appLayout?: AppLayout;
      workLogs?: WorkLog[];
      dailyLifeLogs?: DailyLifeLog[];
      securityLock?: SecurityLockConfig;
      personalNotes?: PersonalNote[];
    } | Entry[],
    newGoals?: Goal[],
    newCategories?: string[],
    newIncomeSources?: string[],
    newWorkCategories?: string[],
    newLifeTags?: string[],
    newPct?: Record<FundType, number>,
    newTheme?: AppTheme,
    newLang?: AppLanguage,
    newMask?: boolean,
    newWorkLogs?: WorkLog[],
    newDailyLifeLogs?: DailyLifeLog[],
    newSecurityLock?: SecurityLockConfig,
    newPersonalNotes?: PersonalNote[],
    newViewMode?: AppViewMode,
    newAppLayout?: AppLayout,
    newFunds?: FundConfig[],
    newHomepageFundIds?: string[]
  ) => {
    try {
      let data: KhataData;

      if (arg1 && !Array.isArray(arg1) && typeof arg1 === 'object') {
        const updates = arg1;
        const currentFunds = updates.funds ?? funds;
        const currentHomepage = updates.homepageFundIds ?? homepageFundIds;
        data = {
          entries: updates.entries ?? entries,
          funds: currentFunds,
          homepageFundIds: currentHomepage,
          categories: updates.categories ?? categories,
          incomeSources: updates.incomeSources ?? incomeSources,
          workCategories: updates.workCategories ?? workCategories,
          lifeTags: updates.lifeTags ?? lifeTags,
          goals: updates.goals ?? goals,
          workLogs: updates.workLogs ?? workLogs,
          dailyLifeLogs: updates.dailyLifeLogs ?? dailyLifeLogs,
          personalNotes: updates.personalNotes ?? personalNotes,
          settings: {
            percentages: updates.percentages ?? percentages,
            funds: currentFunds,
            homepageFundIds: currentHomepage,
            theme: updates.theme ?? theme,
            language: updates.language ?? language,
            privacyMask: updates.privacyMask ?? privacyMask,
            viewMode: updates.viewMode ?? viewMode,
            appLayout: updates.appLayout ?? appLayout,
            securityLock: updates.securityLock ?? securityLock
          }
        };
      } else {
        const currentFunds = newFunds ?? funds;
        const currentHomepage = newHomepageFundIds ?? homepageFundIds;
        data = {
          entries: (Array.isArray(arg1) ? arg1 : undefined) ?? entries,
          funds: currentFunds,
          homepageFundIds: currentHomepage,
          categories: newCategories ?? categories,
          incomeSources: newIncomeSources ?? incomeSources,
          workCategories: newWorkCategories ?? workCategories,
          lifeTags: newLifeTags ?? lifeTags,
          goals: newGoals ?? goals,
          workLogs: newWorkLogs ?? workLogs,
          dailyLifeLogs: newDailyLifeLogs ?? dailyLifeLogs,
          personalNotes: newPersonalNotes ?? personalNotes,
          settings: {
            percentages: newPct ?? percentages,
            funds: currentFunds,
            homepageFundIds: currentHomepage,
            theme: newTheme ?? theme,
            language: newLang ?? language,
            privacyMask: newMask ?? privacyMask,
            viewMode: newViewMode ?? viewMode,
            appLayout: newAppLayout ?? appLayout,
            securityLock: newSecurityLock ?? securityLock
          }
        };
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  };

  const handleUnlockSuccess = () => {
    setIsAppLocked(false);
    const updated: SecurityLockConfig = {
      ...securityLock,
      lastUnlockedAt: Date.now()
    };
    setSecurityLock(updated);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs, updated, personalNotes, viewMode);
    showToast(language === 'hi' ? 'वॉल्ट अनलॉक हुआ (Vault Unlocked)' : 'Vault unlocked successfully');
  };

  const handleInstantLock = () => {
    if (securityLock.isEnabled && securityLock.pin) {
      setIsAppLocked(true);
      showToast(language === 'hi' ? 'ऐप तुरंत लॉक किया गया' : 'App locked');
    } else {
      setIsSecurityModalOpen(true);
    }
  };

  const handleSaveSecurityConfig = (config: SecurityLockConfig) => {
    setSecurityLock(config);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs, config, personalNotes, viewMode);
    if (!config.isEnabled) {
      setIsAppLocked(false);
    }
    showToast(
      config.isEnabled
        ? language === 'hi' ? 'सुरक्षा पिन सुरक्षित रूप से सहेजा गया' : 'PIN security enabled & saved'
        : language === 'hi' ? 'सुरक्षा लॉक हटा दिया गया' : 'PIN security disabled'
    );
  };

  const handleEmergencyReset = () => {
    setEntries([]);
    setGoals([]);
    setWorkLogs([]);
    setDailyLifeLogs([]);
    setCategories(DEFAULT_CATEGORIES);
    setIncomeSources(DEFAULT_INCOME_SOURCES);
    setWorkCategories(DEFAULT_WORK_CATEGORIES);
    setLifeTags(DEFAULT_LIFE_TAGS);
    setPercentages(DEFAULT_PERCENTAGES);
    setSecurityLock(DEFAULT_SECURITY_LOCK);
    setIsAppLocked(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('hasvolt-khata-v2');
    showToast(language === 'hi' ? 'सभी डेटा रीसेट और सुरक्षा पिन हटा दिया गया' : 'Emergency wipe complete. All locks reset.');
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
    setCurrentLanguage(newLang);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, newLang, privacyMask, workLogs, dailyLifeLogs);
    showToast(newLang === 'hi' ? 'भाषा हिन्दी सेट हो गई' : newLang === 'hinglish' ? 'Language Hinglish set' : 'Language set to English');
  };

  const handleTogglePrivacyMask = () => {
    const nextMask = !privacyMask;
    setPrivacyMask(nextMask);
    saveToLocalStorage({ privacyMask: nextMask });
    showToast(nextMask ? 'Privacy Mask Enabled' : 'Privacy Mask Disabled');
  };

  
  const handleAppLayoutChange = (newLayout: AppLayout) => {
    setAppLayout(newLayout);
    saveToLocalStorage({ appLayout: newLayout });
    showToast('App layout updated');
  };

  const handleViewModeChange = (newMode: AppViewMode) => {
    setViewMode(newMode);
    saveToLocalStorage({ viewMode: newMode });
    showToast(
      newMode === 'mobile'
        ? language === 'hi' ? 'मोबाइल मोड सक्रिय' : 'Mobile view mode activated'
        : newMode === 'desktop'
        ? language === 'hi' ? 'डेस्कटॉप मोड सक्रिय' : 'Desktop view mode activated'
        : language === 'hi' ? 'ऑटो स्क्रीन व्यू' : 'Auto responsive view restored'
    );
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

  // Trash / Recycle Bin Helper to record deleted items
  const pushToTrash = (item: TrashItem) => {
    setTrashItems((prev) => {
      const next = [item, ...prev];
      try {
        localStorage.setItem('dailykhata_trash_v1', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save trash', e);
      }
      return next;
    });
  };

  const saveAttendanceLogs = (logs: AttendanceLog[]) => {
    try {
      localStorage.setItem('dailykhata_attendance_v1', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save attendance logs', e);
    }
  };

  const saveReminders = (rems: AppReminder[]) => {
    try {
      localStorage.setItem('dailykhata_reminders_v1', JSON.stringify(rems));
    } catch (e) {
      console.error('Failed to save reminders', e);
    }
  };

  const handleRestoreTrashItem = (item: TrashItem) => {
    if (item.type === 'entry' && item.data) {
      const restored = [item.data as Entry, ...entries];
      setEntries(restored);
      saveToLocalStorage(restored, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    } else if (item.type === 'goal' && item.data) {
      const restored = [item.data as Goal, ...goals];
      setGoals(restored);
      saveToLocalStorage(entries, restored, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    } else if (item.type === 'work_log' && item.data) {
      const restored = [item.data as WorkLog, ...workLogs];
      setWorkLogs(restored);
      saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, restored, dailyLifeLogs);
    } else if (item.type === 'daily_log' && item.data) {
      const restored = [item.data as DailyLifeLog, ...dailyLifeLogs];
      setDailyLifeLogs(restored);
      saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, restored);
    } else if (item.type === 'note' && item.data) {
      const restored = [item.data as PersonalNote, ...personalNotes];
      setPersonalNotes(restored);
      saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs, securityLock, restored);
    } else if (item.type === 'attendance_log' && item.data) {
      const restored = [item.data as AttendanceLog, ...attendanceLogs];
      setAttendanceLogs(restored);
      saveAttendanceLogs(restored);
    } else if (item.type === 'reminder' && item.data) {
      const restored = [item.data as AppReminder, ...reminders];
      setReminders(restored);
      saveReminders(restored);
    }

    setTrashItems((prev) => {
      const next = prev.filter((t) => t.id !== item.id);
      try {
        localStorage.setItem('dailykhata_trash_v1', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(language === 'hi' ? 'आइटम सफलतापूर्वक पुनर्स्थापित किया गया' : 'Item restored successfully');
  };

  const handlePermanentDeleteTrashItem = (id: string) => {
    setTrashItems((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('dailykhata_trash_v1', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(language === 'hi' ? 'हमेशा के लिए हटाया गया' : 'Permanently removed from Trash');
  };

  const handleEmptyTrash = () => {
    setTrashItems([]);
    try {
      localStorage.removeItem('dailykhata_trash_v1');
    } catch (e) {
      console.error(e);
    }
    showToast(language === 'hi' ? 'ट्रैश खाली कर दिया गया' : 'Trash emptied completely');
  };

  // Delete Entry with Trash/Recycle Bin support
  const handleDeleteEntry = (id: string) => {
    const itemToDelete = entries.find((e) => e.id === id);
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveToLocalStorage(updated, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);

    if (itemToDelete) {
      pushToTrash({
        id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        originalId: itemToDelete.id,
        type: 'entry',
        title: itemToDelete.type === 'income' ? (itemToDelete.source || 'Income') : (itemToDelete.category || 'Expense'),
        subtitle: `${itemToDelete.date} · ${itemToDelete.note || (itemToDelete.type === 'income' ? 'Distributed across funds' : (itemToDelete.fund || 'Personal'))}`,
        amount: itemToDelete.amount,
        dateDeleted: new Date().toISOString(),
        data: itemToDelete
      });
      showToast(language === 'hi' ? 'लेनदेन रीसायकल बिन (ट्रैश) में भेजा गया' : 'Entry moved to Trash (Recycle Bin)');
    } else {
      showToast('Entry deleted');
    }
  };

  // Quick Trigger for Add (from Home buttons)
  const handleAddClick = (type: 'income' | 'expense') => {
    setEditingEntry(null);
    setAddInitialType(type);
    setAddInitialAmount(undefined);
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
    saveToLocalStorage({ percentages: newPct });
    showToast(language === 'hi' ? 'फंड आवंटन नियम अपडेट हुए' : 'Fund allocation rules updated');
  };

  const handleUpdateFunds = (newFunds: FundConfig[], newPercentages: Record<FundType, number>) => {
    setFunds(newFunds);
    setPercentages(newPercentages);
    const validIds = newFunds.map((f) => f.id);
    let updatedHomepage = homepageFundIds.filter((id) => validIds.includes(id));
    if (updatedHomepage.length === 0) {
      updatedHomepage = validIds.slice(0, 6);
    }
    setHomepageFundIds(updatedHomepage);
    saveToLocalStorage({
      funds: newFunds,
      percentages: newPercentages,
      homepageFundIds: updatedHomepage
    });
    showToast(language === 'hi' ? 'फंड श्रेणियां व नियम सुरक्षित हो गए!' : 'Fund categories and rules updated successfully!');
  };

  const handleUpdateHomepageFundIds = (newIds: string[]) => {
    setHomepageFundIds(newIds);
    saveToLocalStorage({
      homepageFundIds: newIds
    });
    showToast(language === 'hi' ? 'होमपेज श्रेणियां अपडेट हुईं!' : 'Homepage categories updated!');
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
    const goalToDelete = goals.find((g) => g.id === goalId);
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    saveToLocalStorage(entries, updated, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    if (goalToDelete) {
      pushToTrash({
        id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        originalId: goalToDelete.id,
        type: 'goal',
        title: goalToDelete.title,
        subtitle: `Target: ${formatCurrency(goalToDelete.targetAmount)} · Saved: ${formatCurrency(goalToDelete.currentAmount)}`,
        amount: goalToDelete.targetAmount,
        dateDeleted: new Date().toISOString(),
        data: goalToDelete
      });
      showToast(language === 'hi' ? 'लक्ष्य रीसायकल बिन (ट्रैश) में भेजा गया' : 'Goal moved to Trash');
    } else {
      showToast('Goal removed');
    }
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
      showToast(`${getCurrencyConfig(getCurrentLanguage()).symbol}${amount} deposited to goal`);
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
    const workToDelete = workLogs.find((w) => w.id === id);
    const updated = workLogs.filter((w) => w.id !== id);
    setWorkLogs(updated);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, updated, dailyLifeLogs);
    if (workToDelete) {
      pushToTrash({
        id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        originalId: workToDelete.id,
        type: 'work_log',
        title: workToDelete.title,
        subtitle: `${workToDelete.date} · ${workToDelete.clientOrCompany || workToDelete.category}`,
        amount: workToDelete.earningsOrCost,
        dateDeleted: new Date().toISOString(),
        data: workToDelete
      });
      showToast(language === 'hi' ? 'कार्य रिकॉर्ड रीसायकल बिन में भेजा गया' : 'Work record moved to Trash');
    } else {
      showToast(language === 'hi' ? 'कार्य रिकॉर्ड हटाया गया' : 'Work record deleted');
    }
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
    const lifeToDelete = dailyLifeLogs.find((l) => l.id === id);
    const updated = dailyLifeLogs.filter((l) => l.id !== id);
    setDailyLifeLogs(updated);
    saveToLocalStorage(entries, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, updated);
    if (lifeToDelete) {
      pushToTrash({
        id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        originalId: lifeToDelete.id,
        type: 'daily_log',
        title: lifeToDelete.title,
        subtitle: `${lifeToDelete.date} · ${lifeToDelete.tag || 'Daily Life'}`,
        dateDeleted: new Date().toISOString(),
        data: lifeToDelete
      });
      showToast(language === 'hi' ? 'डायरी प्रविष्टि रीसायकल बिन में भेजी गई' : 'Journal entry moved to Trash');
    } else {
      showToast(language === 'hi' ? 'डायरी प्रविष्टि हटाई गई' : 'Journal entry deleted');
    }
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
    showToast(language === 'hi' ? `${getCurrencyConfig(getCurrentLanguage()).symbol}${work.earningsOrCost} खाता में दर्ज` : `${getCurrencyConfig(getCurrentLanguage()).symbol}${work.earningsOrCost} recorded to record`);
  };

  // Personal Notes Handlers
  const handleSavePersonalNote = (
    noteData: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    let updatedNotes: PersonalNote[];
    if (id) {
      updatedNotes = personalNotes.map((n) =>
        n.id === id ? { ...n, ...noteData, updatedAt: Date.now() } : n
      );
      showToast(language === 'hi' ? 'पर्सनल नोट अपडेट हो गया' : 'Personal note updated');
    } else {
      const newNote: PersonalNote = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...noteData
      };
      updatedNotes = [newNote, ...personalNotes];
      showToast(language === 'hi' ? 'नया पर्सनल नोट सुरक्षित सहेजा गया' : 'Personal note saved securely');
    }
    setPersonalNotes(updatedNotes);
    saveToLocalStorage(
      entries,
      goals,
      categories,
      incomeSources,
      workCategories,
      lifeTags,
      percentages,
      theme,
      language,
      privacyMask,
      workLogs,
      dailyLifeLogs,
      securityLock,
      updatedNotes
    );
    setIsPersonalNoteModalOpen(false);
    setEditingPersonalNote(null);
  };

  const handleDeletePersonalNote = (id: string) => {
    const noteToDelete = personalNotes.find((n) => n.id === id);
    const updated = personalNotes.filter((n) => n.id !== id);
    setPersonalNotes(updated);
    saveToLocalStorage(
      entries,
      goals,
      categories,
      incomeSources,
      workCategories,
      lifeTags,
      percentages,
      theme,
      language,
      privacyMask,
      workLogs,
      dailyLifeLogs,
      securityLock,
      updated
    );
    if (noteToDelete) {
      pushToTrash({
        id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        originalId: noteToDelete.id,
        type: 'note',
        title: noteToDelete.title,
        subtitle: noteToDelete.category || 'Personal Note',
        dateDeleted: new Date().toISOString(),
        data: noteToDelete
      });
      showToast(language === 'hi' ? 'पर्सनल नोट रीसायकल बिन (ट्रैश) में भेजा गया' : 'Personal note moved to Trash');
    } else {
      showToast(language === 'hi' ? 'पर्सनल नोट हटाया गया' : 'Personal note deleted');
    }
  };

  const handleTogglePinPersonalNote = (id: string) => {
    const updated = personalNotes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n
    );
    setPersonalNotes(updated);
    saveToLocalStorage(
      entries,
      goals,
      categories,
      incomeSources,
      workCategories,
      lifeTags,
      percentages,
      theme,
      language,
      privacyMask,
      workLogs,
      dailyLifeLogs,
      securityLock,
      updated
    );
  };

  const handleToggleLockPersonalNote = (id: string) => {
    const updated = personalNotes.map((n) =>
      n.id === id ? { ...n, isLocked: !n.isLocked, updatedAt: Date.now() } : n
    );
    setPersonalNotes(updated);
    saveToLocalStorage(
      entries,
      goals,
      categories,
      incomeSources,
      workCategories,
      lifeTags,
      percentages,
      theme,
      language,
      privacyMask,
      workLogs,
      dailyLifeLogs,
      securityLock,
      updated
    );
    showToast(language === 'hi' ? 'नोट की सुरक्षा बदली गई' : 'Note lock status updated');
  };

  const handleQuickAddPersonalNote = (title: string, content: string) => {
    const newNote: PersonalNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      title,
      content,
      category: 'Personal',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updatedNotes = [newNote, ...personalNotes];
    setPersonalNotes(updatedNotes);
    saveToLocalStorage(
      entries,
      goals,
      categories,
      incomeSources,
      workCategories,
      lifeTags,
      percentages,
      theme,
      language,
      privacyMask,
      workLogs,
      dailyLifeLogs,
      securityLock,
      updatedNotes
    );
    showToast(language === 'hi' ? 'त्वरित पर्सनल नोट सहेजा गया' : 'Quick personal note saved');
  };

  // Attendance & Work Register Handlers
  const handleSaveAttendanceLog = (
    logData: Omit<AttendanceLog, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    let updated: AttendanceLog[];
    if (editingId) {
      updated = attendanceLogs.map((l) =>
        l.id === editingId ? { ...l, ...logData, updatedAt: Date.now() } : l
      );
      showToast(language === 'hi' ? 'उपस्थिति रिकॉर्ड अपडेट हुआ' : 'Attendance record updated');
    } else {
      const newLog: AttendanceLog = {
        id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        createdAt: Date.now(),
        ...logData
      };
      updated = [newLog, ...attendanceLogs];
      showToast(language === 'hi' ? 'उपस्थिति सुरक्षित दर्ज हो गई' : 'Attendance recorded successfully');
    }
    setAttendanceLogs(updated);
    saveAttendanceLogs(updated);
  };

  const handleDeleteAttendanceLog = (id: string) => {
    const item = attendanceLogs.find((l) => l.id === id);
    if (!item) return;

    pushToTrash({
      id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      originalId: item.id,
      type: 'attendance_log',
      title: `${item.date} (${item.status.toUpperCase()})`,
      subtitle: item.employerName ? `Employer: ${item.employerName}` : `Hours: ${item.workingHours || 0}h`,
      amount: item.salaryOrRate,
      dateDeleted: new Date().toISOString(),
      data: item
    });

    const updated = attendanceLogs.filter((l) => l.id !== id);
    setAttendanceLogs(updated);
    saveAttendanceLogs(updated);
    showToast(language === 'hi' ? 'उपस्थिति रिकॉर्ड रीसायकल बिन में भेजा गया' : 'Attendance record moved to Trash');
  };

  const handleRecordAttendanceIncomeToKhata = (log: AttendanceLog) => {
    if (!log.paymentReceived || log.paymentReceived <= 0) return;
    const newEntry: Entry = {
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      date: log.date || new Date().toISOString().slice(0, 10),
      amount: log.paymentReceived,
      type: 'income',
      fund: 'personal',
      category: 'Salary',
      source: log.employerName || log.workType || 'Duty / Salary',
      note: `Recorded from Attendance on ${log.date}. Work: ${log.jobDescription || log.workType || 'Duty'}`,
      createdAt: Date.now()
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveToLocalStorage(updated, goals, categories, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
    showToast(language === 'hi' ? 'वेतन खाता में आय के रूप में दर्ज हुआ!' : 'Wage recorded as Income in Khata!');
  };

  // Smart Reminders Handlers
  const handleSaveReminder = (
    reminderData: Omit<AppReminder, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    let updated: AppReminder[];
    if (editingId) {
      updated = reminders.map((r) =>
        r.id === editingId ? { ...r, ...reminderData } : r
      );
      showToast(language === 'hi' ? 'रिमाइंडर अपडेट हुआ' : 'Reminder updated');
    } else {
      const newReminder: AppReminder = {
        id: 'rem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        createdAt: Date.now(),
        ...reminderData
      };
      updated = [newReminder, ...reminders];
      showToast(language === 'hi' ? 'रिमाइंडर सेट किया गया' : 'Reminder scheduled successfully');
    }
    setReminders(updated);
    saveReminders(updated);
  };

  const handleToggleCompleteReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    setReminders(updated);
    saveReminders(updated);
    showToast(language === 'hi' ? 'रिमाइंडर स्थिति बदली गई' : 'Reminder status updated');
  };

  const handleDeleteReminder = (id: string) => {
    const item = reminders.find((r) => r.id === id);
    if (!item) return;

    pushToTrash({
      id: 'trash_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      originalId: item.id,
      type: 'reminder',
      title: item.title,
      subtitle: `Due: ${item.dueDate} ${item.dueTime || ''}`,
      amount: item.amount,
      dateDeleted: new Date().toISOString(),
      data: item
    });

    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
    showToast(language === 'hi' ? 'रिमाइंडर रीसायकल बिन में भेजा गया' : 'Reminder moved to Trash');
  };

  // Daily Checks for Smart Reminders
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const hasTransactionsToday = entries.some((e) => e.date === todayDateStr);
  const hasAttendanceToday = attendanceLogs.some((l) => l.date === todayDateStr);
  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length + (!hasTransactionsToday ? 1 : 0) + (!hasAttendanceToday ? 1 : 0);

  // Restore backup
  const handleRestoreData = (restored: KhataData) => {
    setEntries(restored.entries || []);
    setGoals(restored.goals || []);
    setWorkLogs(restored.workLogs || []);
    setDailyLifeLogs(restored.dailyLifeLogs || []);
    setPersonalNotes(restored.personalNotes || []);
    setCategories(restored.categories || DEFAULT_CATEGORIES);
    setIncomeSources(restored.incomeSources || DEFAULT_INCOME_SOURCES);
    setWorkCategories(restored.workCategories || DEFAULT_WORK_CATEGORIES);
    setLifeTags(restored.lifeTags || DEFAULT_LIFE_TAGS);
    
    const restoredFunds = (restored.funds && Array.isArray(restored.funds) && restored.funds.length > 0)
      ? restored.funds
      : ((restored.settings?.funds && Array.isArray(restored.settings.funds) && restored.settings.funds.length > 0) ? restored.settings.funds : DEFAULT_FUNDS);
    setFunds(restoredFunds);

    const restoredHomepage = (restored.homepageFundIds && Array.isArray(restored.homepageFundIds) && restored.homepageFundIds.length > 0)
      ? restored.homepageFundIds
      : ((restored.settings?.homepageFundIds && Array.isArray(restored.settings.homepageFundIds) && restored.settings.homepageFundIds.length > 0) ? restored.settings.homepageFundIds : restoredFunds.slice(0, 6).map((f) => f.id));
    setHomepageFundIds(restoredHomepage);

    setPercentages(restored.settings?.percentages || DEFAULT_PERCENTAGES);
    if (restored.settings?.theme) {
      setTheme(restored.settings.theme);
    }
    if (restored.settings?.language) {
      setLanguage(restored.settings.language);
    }
    saveToLocalStorage({
      entries: restored.entries || [],
      goals: restored.goals || [],
      categories: restored.categories || DEFAULT_CATEGORIES,
      incomeSources: restored.incomeSources || DEFAULT_INCOME_SOURCES,
      workCategories: restored.workCategories || DEFAULT_WORK_CATEGORIES,
      lifeTags: restored.lifeTags || DEFAULT_LIFE_TAGS,
      funds: restoredFunds,
      homepageFundIds: restoredHomepage,
      percentages: restored.settings?.percentages || DEFAULT_PERCENTAGES,
      theme: restored.settings?.theme || theme,
      language: restored.settings?.language || language,
      privacyMask: typeof restored.settings?.privacyMask === 'boolean' ? restored.settings.privacyMask : privacyMask,
      workLogs: restored.workLogs || [],
      dailyLifeLogs: restored.dailyLifeLogs || [],
      securityLock: restored.settings?.securityLock || securityLock,
      personalNotes: restored.personalNotes || []
    });
    showToast('Backup restored successfully');
  };

  // Reset all
  const handleResetData = () => {
    setEntries([]);
    setGoals([]);
    setWorkLogs([]);
    setDailyLifeLogs([]);
    setPersonalNotes([]);
    setFunds(DEFAULT_FUNDS);
    setHomepageFundIds(DEFAULT_FUNDS.slice(0, 6).map((f) => f.id));
    saveToLocalStorage({
      entries: [],
      goals: [],
      categories,
      incomeSources,
      workCategories,
      lifeTags,
      funds: DEFAULT_FUNDS,
      homepageFundIds: DEFAULT_FUNDS.slice(0, 6).map((f) => f.id),
      percentages: DEFAULT_PERCENTAGES,
      theme,
      language,
      privacyMask,
      workLogs: [],
      dailyLifeLogs: [],
      securityLock,
      personalNotes: []
    });
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
    setPersonalNotes(INITIAL_SAMPLE_PERSONAL_NOTES);

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
      sampleLife,
      securityLock,
      INITIAL_SAMPLE_PERSONAL_NOTES
    );
    showToast('Sample data loaded');
  };

  // Print PDF trigger
  const handleTriggerPrint = (targetMonth: Date = new Date()) => {
    setPrintMonthDate(targetMonth);
    setIsPrintModalOpen(true);
  };

  const fundTotals = calculateFundTotals(entries, funds.map((f) => f.id));


  // Allow public informational pages to be accessed directly via URL without private PIN lockout
  const isPublicPage = ['/developer', '/devloper', '/dev', '/creator', '/founder', '/about', '/privacy', '/terms', '/disclaimer', '/safety', '/guide'].some(
    (p) => location.pathname.toLowerCase() === p || location.pathname.toLowerCase().startsWith(p + '/')
  );

  const isLockedState = isAppLocked && securityLock.isEnabled && securityLock.pin && !isPublicPage;

  if (isLockedState) {
    return (
      <div
        data-theme={theme}
        data-view-mode={viewMode}
        className="min-h-screen w-full h-full fixed inset-0 overflow-hidden bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col font-sans"
        style={{ touchAction: 'none' }}
      >
        <LockScreen
          securityConfig={securityLock}
          onUnlockSuccess={handleUnlockSuccess}
          onUpdateSecurityConfig={handleSaveSecurityConfig}
          onResetAllData={handleEmergencyReset}
          language={language}
        />
      </div>
    );
  }

  return (
    <div
      data-theme={theme}
      data-view-mode={viewMode}
      className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col font-sans transition-colors duration-300"
    >
      {/* Top Header */}
      <div className="no-print">
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenManual={() => setCurrentTab('guide')}
          onOpenSupport={(tab) => {
            setCurrentTab('support');
            navigate(`/support?tab=${tab || 'help'}`);
          }}
          onOpenNotes={() => setCurrentTab('notes')}
          onOpenSimulator={() => setCurrentTab('calculator')}
          onOpenMasterEdit={() => setIsMasterEditOpen(true)}
          onOpenTrash={() => setIsTrashOpen(true)}
          trashCount={trashItems.length}
          onOpenReminders={() => setIsRemindersOpen(true)}
          remindersCount={pendingRemindersCount}
          onOpenSourceCode={() => setCurrentTab('safety')}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenSecurity={() => setIsSecurityModalOpen(true)}
          isLockEnabled={Boolean(securityLock.isEnabled && securityLock.pin)}
          onLockNow={handleInstantLock}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onThemeChange={handleThemeChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          privacyMask={privacyMask}
          onTogglePrivacyMask={handleTogglePrivacyMask}
          viewMode={viewMode}
          appLayout={appLayout}
          onViewModeChange={handleViewModeChange}
        onLayoutChange={handleAppLayoutChange}
        />
      </div>

      {/* Main Content Area */}
      <main className="no-print flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-6 pb-20 sm:pb-8">
        <div className="w-full">
          <Routes>
          <Route path="/" element={
            <HomeView
              appLayout={appLayout}
              onLayoutChange={handleAppLayoutChange}
              entries={entries}
              goals={goals}
              workLogs={workLogs}
              dailyLifeLogs={dailyLifeLogs}
              personalNotes={personalNotes}
              percentages={percentages}
              funds={funds}
              homepageFundIds={homepageFundIds}
              onUpdateHomepageFundIds={handleUpdateHomepageFundIds}
              onOpenFundSettings={() => setIsSettingsOpen(true)}
              onAddClick={handleAddClick}
              onFilterFund={handleFilterFund}
              onViewHistory={() => {
                setHistoryFilter('all');
                setCurrentTab('history');
              }}
              onNavigateGoals={() => setCurrentTab('goals')}
              onNavigateTracker={() => setCurrentTab('tracker')}
              onNavigateNotes={() => setCurrentTab('notes')}
              onOpenNoteModal={() => {
                setEditingPersonalNote(null);
                setIsPersonalNoteModalOpen(true);
              }}
              onOpenWorkModal={() => {
                setEditingWork(null);
                setIsWorkModalOpen(true);
              }}
              onOpenDailyLifeModal={() => {
                setEditingDailyLife(null);
                setIsDailyLifeModalOpen(true);
              }}
              onOpenManual={() => setCurrentTab('guide')}
              language={language}
              privacyMask={privacyMask}
            />
          } />

          <Route path="/notes" element={
            <PersonalNotesView
              notes={personalNotes}
              onOpenCreateModal={() => {
                setEditingPersonalNote(null);
                setIsPersonalNoteModalOpen(true);
              }}
              onEditNote={(note) => {
                setEditingPersonalNote(note);
                setIsPersonalNoteModalOpen(true);
              }}
              onDeleteNote={handleDeletePersonalNote}
              onTogglePin={handleTogglePinPersonalNote}
              onToggleLock={handleToggleLockPersonalNote}
              onQuickAdd={handleQuickAddPersonalNote}
              language={language}
              onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
            />
          } />

          <Route path="/add" element={
            <AddView
              initialType={addInitialType}
              initialAmount={addInitialAmount}
              editingEntry={editingEntry}
              categories={categories}
              incomeSources={incomeSources}
              percentages={percentages}
              funds={funds}
              fundTotals={fundTotals}
              onSaveEntry={handleSaveEntry}
              onCancelEdit={() => {
                setEditingEntry(null);
                setAddInitialAmount(undefined);
                setCurrentTab('home');
              }}
              onAddCategory={handleAddCategory}
              onAddIncomeSource={handleAddIncomeSource}
              language={language}
              privacyMask={privacyMask}
            />
          } />

          <Route path="/attendance" element={
            <AttendancePage
              attendanceLogs={attendanceLogs}
              onSaveAttendanceLog={handleSaveAttendanceLog}
              onDeleteAttendanceLog={handleDeleteAttendanceLog}
              onRecordAttendanceIncomeToKhata={handleRecordAttendanceIncomeToKhata}
              onBack={() => setCurrentTab('home')}
              language={language}
              privacyMask={privacyMask}
            />
          } />

          <Route path="/tracker" element={
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
          } />

          <Route path="/goals" element={
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
          } />

          <Route path="/history" element={
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
              funds={funds}
            />
          } />

          <Route path="/report" element={
            <ReportView
              entries={entries}
              categories={categories}
              percentages={percentages}
              funds={funds}
              onUpdatePercentages={handleUpdatePercentages}
              onAddCategory={handleAddCategory}
              onRemoveCategory={(cat) => handleUpdateCategories(categories.filter((c) => c !== cat))}
              onTriggerPrint={handleTriggerPrint}
              language={language}
              privacyMask={privacyMask}
            />
          } />

          <Route path="/developer" element={
            <DeveloperPage
              onBack={() => {
                navigate('/');
                setCurrentTab('home');
              }}
              language={language}
              onOpenShare={() => setIsShareOpen(true)}
            />
          } />
          <Route path="/developer/*" element={
            <DeveloperPage
              onBack={() => {
                navigate('/');
                setCurrentTab('home');
              }}
              language={language}
              onOpenShare={() => setIsShareOpen(true)}
            />
          } />
          <Route path="/developer/" element={<Navigate to="/developer" replace />} />
          <Route path="/Developer" element={<Navigate to="/developer" replace />} />
          <Route path="/DEVELOPER" element={<Navigate to="/developer" replace />} />
          <Route path="/devloper" element={<Navigate to="/developer" replace />} />
          <Route path="/devloper/*" element={<Navigate to="/developer" replace />} />
          <Route path="/dev" element={<Navigate to="/developer" replace />} />
          <Route path="/dev/*" element={<Navigate to="/developer" replace />} />
          <Route path="/Dev" element={<Navigate to="/developer" replace />} />
          <Route path="/creator" element={<Navigate to="/developer" replace />} />
          <Route path="/creator/*" element={<Navigate to="/developer" replace />} />
          <Route path="/founder" element={<Navigate to="/developer" replace />} />
          <Route path="/founder/*" element={<Navigate to="/developer" replace />} />
          <Route path="/developer.html" element={<Navigate to="/developer" replace />} />
          <Route path="/dev.html" element={<Navigate to="/developer" replace />} />

          <Route path="/about" element={
            <AboutPage
              onBack={() => setCurrentTab('home')}
              onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              language={language}
            />
          } />

          <Route path="/privacy" element={
            <PrivacyPage
              onBack={() => setCurrentTab('home')}
              onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              language={language}
            />
          } />

          <Route path="/disclaimer" element={
            <DisclaimerPage
              onBack={() => setCurrentTab('home')}
              onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              language={language}
            />
          } />

          <Route path="/terms" element={
            <TermsPage
              onBack={() => setCurrentTab('home')}
              onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              language={language}
            />
          } />

          <Route path="/guide" element={
            <GuidePage
              onBack={() => setCurrentTab('home')}
              onOpenSourceCode={() => setCurrentTab('safety')}
              onOpenSecurityLock={() => setIsSecurityModalOpen(true)}
              language={language}
            />
          } />

          <Route path="/safety" element={
            <SafetyPage
              onBack={() => setCurrentTab('home')}
              language={language}
              entriesCount={entries.length}
              goalsCount={goals.length}
            />
          } />

          <Route path="/support" element={
            <SupportPage
              onBack={() => setCurrentTab('home')}
              onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
              language={language}
              onOpenManual={() => setCurrentTab('guide')}
              onOpenSourceCode={() => setCurrentTab('safety')}
            />
          } />

          <Route path="/calculator" element={
            <CalculatorPage
              onBack={() => setCurrentTab('home')}
              percentages={percentages}
              privacyMask={privacyMask}
              language={language}
              onApplyToIncome={(amount) => {
                setEditingEntry(null);
                setAddInitialType('income');
                setAddInitialAmount(amount);
                setCurrentTab('add');
              }}
              onApplyToExpense={(amount) => {
                setEditingEntry(null);
                setAddInitialType('expense');
                setAddInitialAmount(amount);
                setCurrentTab('add');
              }}
              onApplyToGoal={(title, targetAmount) => {
                handleSaveGoal({
                  title,
                  targetAmount,
                  currentAmount: 0,
                  category: 'Future Investment',
                  note: 'Created via Inflation & Goal Horizon Calculator'
                });
                setCurrentTab('goals');
              }}
            />
          } />
          
          <Route path="*" element={<HomeView
              appLayout={appLayout}
              onLayoutChange={handleAppLayoutChange}
              entries={entries}
              goals={goals}
              workLogs={workLogs}
              dailyLifeLogs={dailyLifeLogs}
              personalNotes={personalNotes}
              percentages={percentages}
              funds={funds}
              homepageFundIds={homepageFundIds}
              onUpdateHomepageFundIds={handleUpdateHomepageFundIds}
              onOpenFundSettings={() => setIsSettingsOpen(true)}
              onAddClick={handleAddClick}
              onFilterFund={handleFilterFund}
              onViewHistory={() => {
                setHistoryFilter('all');
                setCurrentTab('history');
              }}
              onNavigateGoals={() => setCurrentTab('goals')}
              onNavigateTracker={() => setCurrentTab('tracker')}
              onNavigateNotes={() => setCurrentTab('notes')}
              onOpenNoteModal={() => {
                setEditingPersonalNote(null);
                setIsPersonalNoteModalOpen(true);
              }}
              onOpenWorkModal={() => {
                setEditingWork(null);
                setIsWorkModalOpen(true);
              }}
              onOpenDailyLifeModal={() => {
                setEditingDailyLife(null);
                setIsDailyLifeModalOpen(true);
              }}
              onOpenManual={() => setCurrentTab('guide')}
              language={language}
              privacyMask={privacyMask}
            />} />
          </Routes>
        </div>
      </main>

      {/* Unified Global Footer with Integrated Sponsor Promo Banner & Advertisement */}
      <footer className="no-print mt-auto w-full border-t border-[var(--theme-border,#213E61)]/40 bg-[var(--theme-bg,#070E18)]/95 backdrop-blur-xs select-none">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-24 sm:pb-28 space-y-3">
          {/* Sponsor / HasVolt Promo Banner (Anchored inside Footer on other pages) */}
          {currentTab !== 'home' && (
            <section aria-label="Sponsored Partner" className="w-full">
              <HasVoltPromoBanner variant="bar" language={language} />
            </section>
          )}

          {/* Google AdSense Responsive Ad Unit */}
          <section aria-label="Advertisement Space" className="w-full">
            <GoogleAdBanner slotId="1364027408" client="ca-pub-4744063610455678" />
          </section>

          {/* Streamlined Minimal Footer Details */}
          <div className="pt-1 text-center text-[11px] text-[#64748B] space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* Compact Verified Social & Email Links */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href="https://github.com/hasvolt/Daily-Khata-Pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
                  title="GitHub Repository (hasvolt/Daily-Khata-Pro)"
                >
                  <FolderGit2 className="w-4 h-4" />
                </a>

                <a
                  href="mailto:daily-Khata-Pro@gmail.com"
                  className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#38BDF8] text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
                  title="Official Email: daily-Khata-Pro@gmail.com"
                >
                  <Mail className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/dailykhatapro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#E1306C] text-[#94A3B8] hover:text-[#E1306C] transition-colors"
                  title="Instagram: @dailykhatapro"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://x.com/Dailykhatapro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[#1DA1F2] text-[#94A3B8] hover:text-[#1DA1F2] transition-colors"
                  title="X / Twitter: @Dailykhatapro"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Legal & Informational Separate Page Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-medium text-[11px] text-[#94A3B8]">
              <button
                onClick={() => setCurrentTab('about')}
                className={`hover:text-white underline transition-colors cursor-pointer ${currentTab === 'about' ? 'text-[var(--theme-primary,#38BDF8)] font-bold' : ''}`}
              >
                About Us
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('privacy')}
                className={`hover:text-white underline transition-colors cursor-pointer ${currentTab === 'privacy' ? 'text-[var(--theme-primary,#38BDF8)] font-bold' : ''}`}
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('disclaimer')}
                className={`hover:text-white underline transition-colors cursor-pointer ${currentTab === 'disclaimer' ? 'text-[var(--theme-primary,#38BDF8)] font-bold' : ''}`}
              >
                Disclaimer
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('terms')}
                className={`hover:text-white underline transition-colors cursor-pointer ${currentTab === 'terms' ? 'text-[var(--theme-primary,#38BDF8)] font-bold' : ''}`}
              >
                Terms
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('safety')}
                className={`text-[#38BDF8] hover:underline font-medium transition-colors cursor-pointer ${currentTab === 'safety' ? 'font-bold' : ''}`}
              >
                Source Safety
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('guide')}
                className={`text-[var(--theme-primary,#38BDF8)] hover:underline font-medium transition-colors cursor-pointer ${currentTab === 'guide' ? 'font-bold' : ''}`}
              >
                Guide
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('calculator')}
                className={`text-[#F59E0B] hover:underline font-medium transition-colors cursor-pointer ${currentTab === 'calculator' ? 'font-bold' : ''}`}
              >
                Calculators
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 font-medium text-[10.5px] text-[#64748B]">
              <span className="font-semibold text-[#94A3B8]">Daily Khata Pro</span>
              <span>•</span>
              <span>Official Domain: <strong>rozfiber.com</strong></span>
              <span>•</span>
              <span>100% Offline &amp; Private</span>
              <span>•</span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] underline transition-colors cursor-pointer"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </footer>

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
          personalNotes,
          categories,
          incomeSources,
          workCategories,
          lifeTags,
          funds,
          homepageFundIds,
          settings: { percentages, funds, homepageFundIds, theme, language, privacyMask, viewMode, appLayout, securityLock }
        }}
        funds={funds}
        onUpdateFunds={handleUpdateFunds}
        homepageFundIds={homepageFundIds}
        onUpdateHomepageFundIds={handleUpdateHomepageFundIds}
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
        onOpenSupport={(tab) => {
          setSupportModalTab(tab || 'help');
          setIsSupportModalOpen(true);
        }}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        securityLock={securityLock}
        onInstantLock={handleInstantLock}
        theme={theme}
        onThemeChange={handleThemeChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        privacyMask={privacyMask}
        onTogglePrivacyMask={handleTogglePrivacyMask}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        appLayout={appLayout}
        onLayoutChange={handleAppLayoutChange}
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

      {/* Personal Private Note Create / Edit Modal */}
      <PersonalNoteModal
        isOpen={isPersonalNoteModalOpen}
        onClose={() => {
          setIsPersonalNoteModalOpen(false);
          setEditingPersonalNote(null);
        }}
        onSave={handleSavePersonalNote}
        initialNote={editingPersonalNote}
        language={language}
      />

      {/* Multi-Purpose Pro Financial Calculator Modal */}
      <MultiCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        percentages={percentages}
        language={language}
        privacyMask={privacyMask}
        onApplyToIncome={(amount) => {
          setEditingEntry(null);
          setAddInitialType('income');
          setAddInitialAmount(amount);
          setCurrentTab('add');
        }}
        onApplyToExpense={(amount) => {
          setEditingEntry(null);
          setAddInitialType('expense');
          setAddInitialAmount(amount);
          setCurrentTab('add');
        }}
      />

      {/* Central Master Edit Hub Modal */}
      <MasterEditModal
        isOpen={isMasterEditOpen}
        onClose={() => setIsMasterEditOpen(false)}
        entries={entries}
        percentages={percentages}
        onSavePercentages={handleUpdatePercentages}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={(cat) => {
          const updated = categories.filter((c) => c !== cat);
          setCategories(updated);
          saveToLocalStorage(entries, goals, updated, incomeSources, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
          showToast(language === 'hi' ? 'श्रेणी हटाई गई' : 'Category removed');
        }}
        incomeSources={incomeSources}
        onAddSource={handleAddIncomeSource}
        onDeleteSource={(src) => {
          const updated = incomeSources.filter((s) => s !== src);
          setIncomeSources(updated);
          saveToLocalStorage(entries, goals, categories, updated, workCategories, lifeTags, percentages, theme, language, privacyMask, workLogs, dailyLifeLogs);
          showToast(language === 'hi' ? 'आय स्रोत हटाया गया' : 'Income source removed');
        }}
        goals={goals}
        onEditGoal={(goal) => {
          setEditingGoal(goal);
          setIsGoalModalOpen(true);
        }}
        onDeleteGoal={handleDeleteGoal}
        notes={personalNotes}
        onEditNote={(note) => {
          setEditingPersonalNote(note);
          setIsPersonalNoteModalOpen(true);
        }}
        onDeleteNote={handleDeletePersonalNote}
        onEditEntry={handleEditEntry}
        onDeleteEntry={handleDeleteEntry}
        onOpenTrash={() => {
          setIsMasterEditOpen(false);
          setIsTrashOpen(true);
        }}
        language={language}
        privacyMask={privacyMask}
      />

      {/* Recycle Bin / Trash Modal */}
      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        trashItems={trashItems}
        onRestoreItem={handleRestoreTrashItem}
        onPermanentlyDeleteItem={handlePermanentDeleteTrashItem}
        onEmptyTrash={handleEmptyTrash}
        language={language}
        privacyMask={privacyMask}
      />

      {/* Smart Alerts & Warning Reminders Modal */}
      <RemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        reminders={reminders}
        onSaveReminder={handleSaveReminder}
        onToggleCompleteReminder={handleToggleCompleteReminder}
        onDeleteReminder={handleDeleteReminder}
        language={language}
        hasTransactionsToday={hasTransactionsToday}
        hasAttendanceToday={hasAttendanceToday}
        pendingPaymentCount={attendanceLogs.filter((l) => l.paymentStatus === 'unpaid').length}
        onNavigateAdd={() => {
          setIsRemindersOpen(false);
          setCurrentTab('add');
        }}
        onNavigateAttendance={() => {
          setIsRemindersOpen(false);
          setCurrentTab('attendance');
        }}
      />

      {/* User Manual Modal */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onOpenSecurityLock={() => setIsSecurityModalOpen(true)}
        language={language}
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

      {/* Bug Report, Suggestion & Help Centre Modal */}
      <SupportFeedbackModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        initialTab={supportModalTab}
        language={language}
        onOpenManual={() => setCurrentTab('guide')}
        onOpenSourceCode={() => setCurrentTab('safety')}
        onOpenFullPage={(tab) => {
          setIsSupportModalOpen(false);
          setCurrentTab('support');
          navigate(`/support?tab=${tab || 'help'}`);
        }}
      />

      {/* App Passcode / PIN Security Configuration Modal */}
      <SecurityLockModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        securityConfig={securityLock}
        onSaveSecurityConfig={handleSaveSecurityConfig}
        onInstantLock={handleInstantLock}
        language={language}
      />
    </div>
  );
}
