import React, { useRef, useState, useEffect } from 'react';
import { KhataData, AppTheme, AppLanguage, AppViewMode, FundType, FundConfig, SecurityLockConfig, AppLayout } from '../types';
import {
  DEFAULT_PERCENTAGES,
  DEFAULT_CATEGORIES,
  DEFAULT_INCOME_SOURCES,
  DEFAULT_WORK_CATEGORIES,
  DEFAULT_LIFE_TAGS,
  DEFAULT_FUNDS,
  FUND_ORDER,
  FUND_LABELS,
  FUND_CONFIGS
} from '../data/defaults';
import {
  X,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Heart,
  FileText,
  Scale,
  Lock,
  ExternalLink,
  Check,
  Palette,
  Languages,
  Eye,
  EyeOff,
  Code2,
  Plus,
  Sliders,
  Sparkles,
  Tag,
  Briefcase,
  Store,
  Layers,
  Percent,
  RotateCcw,
  FolderGit2,
  Terminal,
  Copy,
  Share2,
  User,
  Mail,
  Smartphone,
  Monitor,
  LayoutGrid,
  HelpCircle,
  Bug,
  Lightbulb,
  Pencil,
  SlidersHorizontal,
  Cookie,
  Github,
  Instagram,
  Twitter,
  Globe,
  Info,
  BookOpen,
  Calculator,
  Shield,
  Volume2,
  VolumeX,
  Volume1,
  Cloud,
  CloudUpload,
  CloudCheck
} from 'lucide-react';
import {
  auth,
  googleSignIn,
  uploadBackupToDrive,
  getAccessToken,
  BACKUP_FILE_NAME
} from '../services/googleDriveService';
import { triggerHapticSound } from '../utils/khataCalculations';
import {
  isAudioEnabled,
  setAudioEnabled,
  getAudioVolume,
  setAudioVolume,
  subscribeAudioChange,
  playIncomeSound,
  playExpenseSound,
  playCelebrationSound,
  playBellSound,
  playKeypadSound,
  playDeleteSound
} from '../utils/audioService';
import { getFundIcon } from '../utils/iconMap';
import { ConfirmModal } from './ConfirmModal';
import { FundEditorModal } from './FundEditorModal';
import { AppLogo } from './AppLogo';
import { TRANSLATIONS, isPureHindi, isHinglish, isHindiOrHinglish, pickTranslation } from '../utils/translations';
import { getAppTranslation } from '../utils/appTranslations';
import { APP_VERSION_FULL, APP_VERSION_FOOTER } from '../utils/version';
import { applyGoogleTranslateLanguage, resetGoogleTranslate } from '../utils/googleTranslate';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KhataData;
  funds?: FundConfig[];
  onUpdateFunds?: (funds: FundConfig[], percentages: Record<FundType, number>) => void;
  homepageFundIds?: string[];
  onUpdateHomepageFundIds?: (ids: string[]) => void;
  onRestoreData: (restored: KhataData) => void;
  onResetData: () => void;
  onLoadSampleData: () => void;
  onUpdatePercentages?: (percentages: Record<FundType, number>) => void;
  onUpdateCategories?: (categories: string[]) => void;
  onUpdateIncomeSources?: (sources: string[]) => void;
  onUpdateWorkCategories?: (categories: string[]) => void;
  onUpdateLifeTags?: (tags: string[]) => void;
  onOpenManual?: () => void;
  onOpenSourceCode?: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenSupport?: (tab?: 'help' | 'bug' | 'suggestion') => void;
  securityLock?: SecurityLockConfig;
  onInstantLock?: () => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  onOpenGoogleTranslate?: () => void;
  privacyMask?: boolean;
  onTogglePrivacyMask?: () => void;
  viewMode?: AppViewMode;
  onViewModeChange?: (mode: AppViewMode) => void;
  appLayout?: AppLayout;
  onLayoutChange?: (layout: AppLayout) => void;
  onOpenCookiesPolicy?: () => void;
  onOpenCookieSettings?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenGoogleDrive?: () => void;
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
  lastSyncTime?: string | null;
  isAutoSyncing?: boolean;
}

type TabType = 'preferences' | 'custom' | 'rules' | 'backup' | 'privacy' | 'legal';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  data,
  funds,
  onUpdateFunds,
  homepageFundIds,
  onUpdateHomepageFundIds,
  onRestoreData,
  onResetData,
  onLoadSampleData,
  onUpdatePercentages,
  onUpdateCategories,
  onUpdateIncomeSources,
  onUpdateWorkCategories,
  onUpdateLifeTags,
  onOpenManual,
  onOpenSourceCode,
  onOpenInstall,
  onOpenShare,
  onOpenSecurityModal,
  onOpenSupport,
  securityLock,
  onInstantLock,
  theme = 'blue',
  onThemeChange,
  language = 'en',
  onLanguageChange,
  onOpenGoogleTranslate,
  privacyMask = false,
  onTogglePrivacyMask,
  viewMode = 'auto',
  appLayout = 'dashboard',
  onLayoutChange,
  onViewModeChange,
  onOpenCookiesPolicy,
  onOpenCookieSettings,
  onNavigate,
  onOpenGoogleDrive,
  autoSyncEnabled = false,
  onToggleAutoSync,
  lastSyncTime = null,
  isAutoSyncing = false
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('preferences');
  const [confirmAction, setConfirmAction] = useState<'reset' | 'sample' | 'reset_settings' | null>(null);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dynamic Funds & Allocation Rules State
  const [currentFunds, setCurrentFunds] = useState<FundConfig[]>(() => {
    if (funds && funds.length > 0) return funds;
    if (data.funds && data.funds.length > 0) return data.funds;
    if (data.settings?.funds && data.settings.funds.length > 0) return data.settings.funds;
    return DEFAULT_FUNDS;
  });

  const [customPercentages, setCustomPercentages] = useState<Record<FundType, number>>(
    data.settings?.percentages || DEFAULT_PERCENTAGES
  );

  const [editingFundItem, setEditingFundItem] = useState<FundConfig | null>(null);
  const [isFundEditorOpen, setIsFundEditorOpen] = useState(false);
  const [fundToDelete, setFundToDelete] = useState<FundConfig | null>(null);

  useEffect(() => {
    if (funds && funds.length > 0) {
      setCurrentFunds(funds);
    }
  }, [funds]);

  useEffect(() => {
    if (data.settings?.percentages) {
      setCustomPercentages(data.settings.percentages);
    }
  }, [data.settings?.percentages]);

  // Custom Category & Source State
  const [customExpCategoryInput, setCustomExpCategoryInput] = useState('');
  const [customIncomeSourceInput, setCustomIncomeSourceInput] = useState('');
  const [customWorkCategoryInput, setCustomWorkCategoryInput] = useState('');
  const [customLifeTagInput, setCustomLifeTagInput] = useState('');
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const [isQuickBackingUp, setIsQuickBackingUp] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => isAudioEnabled());
  const [soundVol, setSoundVol] = useState<number>(() => getAudioVolume());

  useEffect(() => {
    const unsub = subscribeAudioChange((enabled) => {
      setSoundEnabled(enabled);
    });
    return unsub;
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isPure = isPureHindi(language);
  const isHing = isHinglish(language);
  const isHindi = isPure;
  const tr = getAppTranslation((language as AppLanguage) || 'en');
  const tStr = (hi: string, hinglish: string, en: string) => pickTranslation(language, { hi, hinglish, en });

  const currentCategories = data.categories || DEFAULT_CATEGORIES;
  const currentIncomeSources = data.incomeSources || DEFAULT_INCOME_SOURCES;
  const currentWorkCategories = data.workCategories || DEFAULT_WORK_CATEGORIES;
  const currentLifeTags = data.lifeTags || DEFAULT_LIFE_TAGS;

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setModalFeedback({ type, text });
    setTimeout(() => {
      setModalFeedback(null);
    }, 3000);
  };

  const handleForceUpdateApp = async () => {
    setIsUpdatingApp(true);
    showFeedback('success', tStr('कैश रिफ्रेश किया जा रहा है व नया वर्शन लोड हो रहा है...', 'Cache refresh ho raha hai aur fresh build load ho raha hai...', 'Refreshing cache and loading latest build...'));
    setTimeout(async () => {
      try {
        if (typeof (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__?: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__ === 'function') {
          await (window as unknown as { __DAILY_KHATA_FORCE_REFRESH__: () => Promise<void> }).__DAILY_KHATA_FORCE_REFRESH__();
        } else {
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }, 500);
  };

  if (!isOpen) return null;

  const handleQuickDriveBackup = async () => {
    triggerHapticSound('save');
    setIsQuickBackingUp(true);
    try {
      if (!getAccessToken()) {
        await googleSignIn();
      }
      await uploadBackupToDrive(data, BACKUP_FILE_NAME, false);
      showFeedback(
        'success',
        tStr(
          '1-क्लिक बैकअप गूगल ड्राइव पर सफलतापूर्वक सहेज लिया गया!',
          '1-Click backup Google Drive par safalta se save ho gaya!',
          '1-Click backup successfully saved to Google Drive!'
        )
      );
    } catch (err: any) {
      console.error('Drive backup failed:', err);
      showFeedback(
        'error',
        err?.message ||
          tStr(
            'गूगल ड्राइव बैकअप में समस्या आई। कृपया पुनः प्रयास करें।',
            'Google Drive backup mein dikkat aayi. Kripya dobara try karein.',
            'Failed to backup to Google Drive. Please try again.'
          )
      );
    } finally {
      setIsQuickBackingUp(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daily-khata-pro-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerHapticSound('save');
    showFeedback('success', tStr('JSON बैकअप सफलतापूर्वक डाउनलोड हो गया!', 'JSON backup download ho gaya!', 'JSON Backup downloaded successfully!'));
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.entries && Array.isArray(parsed.entries)) {
          onRestoreData({
            entries: parsed.entries,
            categories: parsed.categories || DEFAULT_CATEGORIES,
            incomeSources: parsed.incomeSources || DEFAULT_INCOME_SOURCES,
            workCategories: parsed.workCategories || DEFAULT_WORK_CATEGORIES,
            lifeTags: parsed.lifeTags || DEFAULT_LIFE_TAGS,
            goals: parsed.goals || [],
            workLogs: parsed.workLogs || [],
            dailyLifeLogs: parsed.dailyLifeLogs || [],
            settings: parsed.settings || {
              percentages: DEFAULT_PERCENTAGES,
              theme: theme,
              language: language,
              privacyMask: privacyMask
            }
          });
          showFeedback('success', tStr('खाता डेटा सफलतापूर्वक रिस्टोर हो गया!', 'Record data restore ho gaya!', 'Record data restored successfully!'));
          setTimeout(() => onClose(), 1200);
        } else {
          showFeedback('error', tStr('अमान्य प्रारूप। कृपया सही बैकअप फ़ाइल चुनें।', 'Invalid format. Kripya valid Daily Khata JSON backup select karein.', 'Invalid format. Please select a valid Daily Khata Pro JSON backup.'));
        }
      } catch (err) {
        showFeedback('error', tStr('JSON पार्सिंग में त्रुटि।', 'JSON parse karne mein error aaya.', 'Failed to parse JSON file.'));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Rule percentage calculations across all dynamic funds
  const totalPercent: number = currentFunds.reduce((s: number, f: FundConfig) => s + (Number(customPercentages[f.id]) || 0), 0);
  const isPercentValid = Math.abs(totalPercent - 100) < 0.01;

  const handleAutoBalance = () => {
    if (currentFunds.length === 0) return;
    const diff = 100 - totalPercent;
    if (Math.abs(diff) < 0.01) return;

    const updated = { ...customPercentages };
    const firstId = currentFunds[0].id;
    const currentVal = Number(updated[firstId]) || 0;
    updated[firstId] = Math.max(0, Math.round((currentVal + diff) * 100) / 100);
    setCustomPercentages(updated);
    triggerHapticSound('click');
    showFeedback(
      'success',
      tStr(
        `100% संतुलित किया गया (${currentFunds[0].label} में समायोजित)`,
        `100% balance kiya gaya (${currentFunds[0].label} mein adjust hua)`,
        `Balanced to 100% (adjusted in ${currentFunds[0].label})`
      )
    );
  };

  const handleSavePercentages = () => {
    if (!isPercentValid) {
      showFeedback('error', tStr('कुल प्रतिशत ठीक 100% होना चाहिए।', 'Total allocation exact 100% hona chahiye.', 'Total allocation percentage must equal 100% exactly.'));
      triggerHapticSound('error');
      return;
    }
    if (onUpdateFunds) {
      onUpdateFunds(currentFunds, customPercentages);
    } else if (onUpdatePercentages) {
      onUpdatePercentages(customPercentages);
    }
    triggerHapticSound('save');
    showFeedback('success', tStr('फंड आवंटन नियम सफलतापूर्वक सहेजे गए!', 'Fund allocation rules save ho gaye!', 'Fund allocation rules updated successfully!'));
  };

  const handleResetPercentages = () => {
    setCurrentFunds(DEFAULT_FUNDS);
    setCustomPercentages(DEFAULT_PERCENTAGES);
    if (onUpdateFunds) {
      onUpdateFunds(DEFAULT_FUNDS, DEFAULT_PERCENTAGES);
    } else if (onUpdatePercentages) {
      onUpdatePercentages(DEFAULT_PERCENTAGES);
    }
    triggerHapticSound('click');
    showFeedback('success', tStr('डिफ़ॉल्ट फंड्स व नियमों पर रीसेट कर दिया गया।', 'Default funds aur rules par reset ho gaya.', 'Reset to default fund categories and rules.'));
  };

  const handleSaveFund = (savedFund: FundConfig) => {
    const existingIndex = currentFunds.findIndex((f) => f.id === savedFund.id);
    let updatedFunds: FundConfig[];
    let updatedPct = { ...customPercentages };

    if (existingIndex >= 0) {
      updatedFunds = [...currentFunds];
      updatedFunds[existingIndex] = savedFund;
      if (savedFund.defaultPct !== undefined) {
        updatedPct[savedFund.id] = savedFund.defaultPct;
      }
      showFeedback('success', tStr(`फंड "${savedFund.label}" अपडेट हो गया!`, `Fund "${savedFund.label}" update ho gaya!`, `Fund "${savedFund.label}" updated!`));
    } else {
      updatedFunds = [...currentFunds, savedFund];
      updatedPct[savedFund.id] = savedFund.defaultPct;
      showFeedback('success', tStr(`नया फंड "${savedFund.label}" जोड़ा गया!`, `Naya fund "${savedFund.label}" add ho gaya!`, `New fund "${savedFund.label}" added!`));
    }

    setCurrentFunds(updatedFunds);
    setCustomPercentages(updatedPct);
    if (onUpdateFunds) {
      onUpdateFunds(updatedFunds, updatedPct);
    } else if (onUpdatePercentages) {
      onUpdatePercentages(updatedPct);
    }
    triggerHapticSound('save');
  };

  const handleConfirmDeleteFund = () => {
    if (!fundToDelete) return;
    if (currentFunds.length <= 1) {
      showFeedback('error', tStr('कम से कम एक फंड होना आवश्यक है।', 'Kam se kam ek fund hona zaroori hai.', 'At least one fund must remain.'));
      setFundToDelete(null);
      return;
    }

    const updatedFunds = currentFunds.filter((f) => f.id !== fundToDelete.id);
    const updatedPct = { ...customPercentages };
    const freedPct = updatedPct[fundToDelete.id] || 0;
    delete updatedPct[fundToDelete.id];

    // Reallocate freed percentage to first remaining fund so sum remains 100%
    if (updatedFunds.length > 0 && freedPct > 0) {
      const firstId = updatedFunds[0].id;
      updatedPct[firstId] = Math.round(((updatedPct[firstId] || 0) + freedPct) * 100) / 100;
    }

    setCurrentFunds(updatedFunds);
    setCustomPercentages(updatedPct);
    if (onUpdateFunds) {
      onUpdateFunds(updatedFunds, updatedPct);
    } else if (onUpdatePercentages) {
      onUpdatePercentages(updatedPct);
    }
    triggerHapticSound('delete');
    showFeedback('success', tStr(`फंड "${fundToDelete.label}" हटा दिया गया!`, `Fund "${fundToDelete.label}" remove ho gaya!`, `Fund "${fundToDelete.label}" removed!`));
    setFundToDelete(null);
  };

  // Custom Categories Add/Delete
  const handleAddExpenseCategory = () => {
    const trimmed = customExpCategoryInput.trim();
    if (trimmed && !currentCategories.includes(trimmed)) {
      const updated = [...currentCategories, trimmed];
      if (onUpdateCategories) onUpdateCategories(updated);
      setCustomExpCategoryInput('');
      triggerHapticSound('save');
      showFeedback('success', `${tStr('नई श्रेणी जोड़ी गई', 'Nayi category add hui', 'Category added')}: ${trimmed}`);
    }
  };

  const handleDeleteExpenseCategory = (cat: string) => {
    const updated = currentCategories.filter((c) => c !== cat);
    if (onUpdateCategories) onUpdateCategories(updated);
    triggerHapticSound('click');
  };

  // Custom Income Sources Add/Delete
  const handleAddIncomeSource = () => {
    const trimmed = customIncomeSourceInput.trim();
    if (trimmed && !currentIncomeSources.includes(trimmed)) {
      const updated = [...currentIncomeSources, trimmed];
      if (onUpdateIncomeSources) onUpdateIncomeSources(updated);
      setCustomIncomeSourceInput('');
      triggerHapticSound('save');
      showFeedback('success', `${tStr('नया आय स्रोत जोड़ा गया', 'Naya income source add hua', 'Income source added')}: ${trimmed}`);
    }
  };

  const handleDeleteIncomeSource = (src: string) => {
    const updated = currentIncomeSources.filter((s) => s !== src);
    if (onUpdateIncomeSources) onUpdateIncomeSources(updated);
    triggerHapticSound('click');
  };

  // Custom Work Categories Add/Delete
  const handleAddWorkCategory = () => {
    const trimmed = customWorkCategoryInput.trim();
    if (trimmed && !currentWorkCategories.includes(trimmed)) {
      const updated = [...currentWorkCategories, trimmed];
      if (onUpdateWorkCategories) onUpdateWorkCategories(updated);
      setCustomWorkCategoryInput('');
      triggerHapticSound('save');
      showFeedback('success', `${tStr('कार्य श्रेणी जोड़ी गई', 'Work category add hui', 'Work category added')}: ${trimmed}`);
    }
  };

  const handleDeleteWorkCategory = (cat: string) => {
    const updated = currentWorkCategories.filter((c) => c !== cat);
    if (onUpdateWorkCategories) onUpdateWorkCategories(updated);
    triggerHapticSound('click');
  };

  // Custom Life Tags Add/Delete
  const handleAddLifeTag = () => {
    const trimmed = customLifeTagInput.trim();
    if (trimmed && !currentLifeTags.includes(trimmed)) {
      const updated = [...currentLifeTags, trimmed];
      if (onUpdateLifeTags) onUpdateLifeTags(updated);
      setCustomLifeTagInput('');
      triggerHapticSound('save');
      showFeedback('success', `${tStr('टैग जोड़ा गया', 'Tag add hua', 'Life tag added')}: #${trimmed}`);
    }
  };

  const handleDeleteLifeTag = (tag: string) => {
    const updated = currentLifeTags.filter((t) => t !== tag);
    if (onUpdateLifeTags) onUpdateLifeTags(updated);
    triggerHapticSound('click');
  };

  const themeList: { id: AppTheme; label: string; dot: string; isLight?: boolean }[] = [
    { id: 'blue', label: 'Electric Blue', dot: '#38BDF8' },
    { id: 'yellow', label: 'Volt Gold', dot: '#FFC700' },
    { id: 'orange', label: 'Sunset Orange', dot: '#F97316' },
    { id: 'emerald', label: 'Emerald Green', dot: '#10B981' },
    { id: 'purple', label: 'Royal Violet', dot: '#A855F7' },
    { id: 'cyan', label: 'Ocean Teal', dot: '#06B6D4' },
    { id: 'pink', label: 'Crimson Pink', dot: '#F472B6' },
    { id: 'black', label: 'Obsidian Black', dot: '#171717' },
    { id: 'light', label: tStr('दिन / वाइट मोड (Daylight)', 'Day / White Mode (Daylight)', 'Daylight White'), dot: '#0284C7', isLight: true },
    { id: 'white', label: tStr('आउटडोर प्योर वाइट', 'Outdoor Pure White', 'Outdoor Pure White'), dot: '#2563EB', isLight: true }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--theme-card,#132438)] border-0 sm:border border-[var(--theme-border,#213E61)] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[92vh] max-w-2xl flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-3">
            <AppLogo size={32} />
            <div>
              <h3 className="font-bold text-[16px] sm:text-[17px] text-[var(--theme-text,#F8FAFC)]">
                {tr.settings.title}
              </h3>
              <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                {tr.settings.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-bg,#070E18)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {modalFeedback && (
          <div
            className={`px-4 py-2.5 text-[12.5px] font-bold flex items-center gap-2 border-b animate-in fade-in ${
              modalFeedback.type === 'success'
                ? 'bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)]/30'
                : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
            }`}
          >
            {modalFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{modalFeedback.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)]/70 px-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'preferences', label: tr.settings.tabPreferences, icon: Palette },
            { id: 'custom', label: tr.settings.tabCustomOptions, icon: Tag },
            { id: 'rules', label: tr.settings.tabRules, icon: Percent },
            { id: 'backup', label: tr.settings.tabBackup, icon: Download },
            { id: 'privacy', label: tr.settings.tabPrivacy, icon: ShieldCheck },
            { id: 'legal', label: tr.settings.tabLegal, icon: Scale }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  triggerHapticSound('click');
                }}
                className={`py-3 px-3.5 border-b-2 text-[12.5px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                    : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text-muted,#CBD5E1)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-[13px] flex-1">
          {/* TAB 1: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              {/* Language Selector */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  <label className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                    {tStr('ऐप की भाषा', 'App Ki Language', 'Application Language')}
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
                  {[
                    { id: 'en', label: 'English', sub: 'Global' },
                    { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                    { id: 'hinglish', label: 'Hinglish', sub: 'India' },
                    { id: 'es', label: 'Español', sub: 'Spanish' },
                    { id: 'ar', label: 'العربية', sub: 'Arabic' },
                    { id: 'fr', label: 'Français', sub: 'French' },
                    { id: 'de', label: 'Deutsch', sub: 'German' },
                    { id: 'ru', label: 'Русский', sub: 'Russian' },
                    { id: 'pt', label: 'Português', sub: 'Portuguese' },
                    { id: 'bn', label: 'বাংলা', sub: 'Bengali' },
                    { id: 'ur', label: 'اردو', sub: 'Urdu' },
                    { id: 'id', label: 'Bahasa Indonesia', sub: 'Indonesian' },
                    { id: 'ja', label: '日本語', sub: 'Japanese' },
                    { id: 'zh', label: '中文 (简体)', sub: 'Chinese' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => onLanguageChange && onLanguageChange(l.id as AppLanguage)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        language === l.id
                          ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)] font-extrabold shadow-sm'
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)]/50'
                      }`}
                    >
                      <div className="text-[12.5px] font-bold truncate">{l.label}</div>
                      <div className="text-[10px] opacity-75 truncate">{l.sub}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--theme-border,#213E61)] flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      <label className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                        {tStr('गूगल ट्रांसलेट (Google Translate - 100+ भाषाएं)', 'Google Translate (100+ Languages)', 'Google Translate (100+ Languages)')}
                      </label>
                    </div>
                    {onOpenGoogleTranslate && (
                      <button
                        type="button"
                        onClick={onOpenGoogleTranslate}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                        id="settings-open-translate-modal-btn"
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>{tStr('सभी भाषाएं ब्राउज़ करें', 'Browse All Languages', 'Browse All Languages')}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                    {tStr(
                      'Google Translate द्वारा तुरंत पूरे ऐप को अपनी पसंदीदा भाषा में अनुवाद करें:',
                      'Instantly translate the entire app into your preferred language with Google Translate:',
                      'Instantly translate the entire app into your preferred language with Google Translate:'
                    )}
                  </p>

                  {/* Quick popular Indian and Global language buttons */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                    {[
                      { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
                      { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
                      { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
                      { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
                      { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
                      { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
                      { code: 'ur', label: 'اردو', flag: '🇮🇳' },
                      { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
                      { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
                      { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
                      { code: 'ar', label: 'العربية', flag: '🇸🇦' },
                      { code: 'es', label: 'Español', flag: '🇪🇸' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => applyGoogleTranslateLanguage(item.code)}
                        className="p-1.5 rounded-lg bg-[var(--theme-bg,#070E18)] hover:bg-indigo-500/20 border border-[var(--theme-border,#213E61)] hover:border-indigo-500/50 text-[var(--theme-text,#F8FAFC)] text-center text-xs font-semibold transition-all cursor-pointer truncate"
                      >
                        <span className="mr-1">{item.flag}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                    <span>{tStr('गूगल रीयल-टाइम अनुवाद इंजन', 'Google Real-time Translation Engine', 'Google Real-time Translation Engine')}</span>
                    <button
                      type="button"
                      onClick={() => resetGoogleTranslate()}
                      className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                    >
                      {tStr('मूल भाषा (Reset)', 'Reset Language', 'Reset Language')}
                    </button>
                  </div>
                </div>
              </div>

              
              {/* Color Theme Selector */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  <label className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                    {tStr('कलर थीम', 'Theme Color Palette', 'Accent Color Palette')}
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {themeList.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => onThemeChange && onThemeChange(th.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        theme === th.id
                          ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] font-bold shadow-xs'
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text-muted,#CBD5E1)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: th.dot }} />
                        <span className="text-[12.5px]">{th.label}</span>
                      </div>
                      {theme === th.id && <Check className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Eye Mask Mode */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                    {privacyMask ? <EyeOff className="w-4 h-4 text-[#F59E0B]" /> : <Eye className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)]" />}
                    <span>{tStr('संख्या गोपनीयता मोड (Privacy Mask)', 'Privacy Masking Mode', 'Rupee Value Privacy Masking')}</span>
                  </div>
                  <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                    {tStr(
                      'सार्वजनिक स्थानों पर स्क्रीन पर दिखने वाली रुपये की राशि को छुपाएं।',
                      'Public jagahon par screen par rupee amount chupayein.',
                      'Mask numerical rupee amounts with dots for private viewing in public spaces.'
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onTogglePrivacyMask}
                  className={`px-3.5 py-2 rounded-xl font-bold text-[12.5px] border transition-all cursor-pointer ${
                    privacyMask
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                      : 'bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)] hover:text-[var(--theme-text,#F8FAFC)]'
                  }`}
                >
                  {privacyMask ? tStr('सक्रिय (Masked)', 'Active (Masked)', 'Enabled') : tStr('निष्क्रिय', 'Band (Off)', 'Disabled')}
                </button>
              </div>

              {/* Sound & Audio Effects Settings */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      )}
                      <span>{tStr('ऑडियो साउंड इफेक्ट्स (Audio Sound Effects)', 'Audio Sound Effects', 'Audio Sound Effects')}</span>
                    </div>
                    <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                      {tStr(
                        'आय, खर्च जोड़ने, डिलीट करने, लक्ष्य पूरा होने और कीपैड पर वास्तविक ऑडियो टोन सुनें।',
                        'Income, expense jodne, delete karne, goal complete hone par sound effect sunein.',
                        'Play realistic audio synthesized tones on transaction entry, goal achievement, and keypad taps.'
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      setAudioEnabled(next);
                      if (next) {
                        playIncomeSound();
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl font-bold text-[12.5px] border transition-all cursor-pointer ${
                      soundEnabled
                        ? 'bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)]/40'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {soundEnabled ? tStr('चालू (Sound ON)', 'Chalu (Sound ON)', 'Sound ON') : tStr('म्यूट (Sound OFF)', 'Band (Sound OFF)', 'Sound OFF')}
                  </button>
                </div>

                {/* Volume slider & presets */}
                {soundEnabled && (
                  <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/70 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--theme-text-dim,#94A3B8)] font-medium flex items-center gap-1.5">
                        <Volume1 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                        {tStr('आवाज़ का स्तर (Volume)', 'Awaaz Volume', 'Sound Volume')}: {Math.round(soundVol * 100)}%
                      </span>
                      <div className="flex items-center gap-1">
                        {[
                          { label: '30%', val: 0.3 },
                          { label: '60%', val: 0.6 },
                          { label: '100%', val: 1.0 }
                        ].map((v) => (
                          <button
                            key={v.label}
                            type="button"
                            onClick={() => {
                              setSoundVol(v.val);
                              setAudioVolume(v.val);
                              playKeypadSound('5');
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              Math.abs(soundVol - v.val) < 0.05
                                ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)]'
                                : 'bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)] hover:text-white'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={soundVol}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSoundVol(val);
                        setAudioVolume(val);
                      }}
                      className="w-full h-1.5 bg-[var(--theme-border,#213E61)] rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary,#38BDF8)]"
                    />

                    {/* Interactive Sound Preview Test Buttons */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] mb-1.5">
                        {tStr('साउंड टेस्ट करके देखें (Click to Test Sounds):', 'Sound test karein:', 'Test Sound Effects:')}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => playIncomeSound()}
                          className="p-2 rounded-lg bg-[var(--theme-bg,#070E18)] border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer active:scale-95"
                        >
                          <span>💰</span>
                          <span>{tStr('+ आय (Income)', '+ Income Sound', '+ Income')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => playExpenseSound()}
                          className="p-2 rounded-lg bg-[var(--theme-bg,#070E18)] border border-rose-500/30 text-rose-400 font-semibold hover:bg-rose-500/10 flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer active:scale-95"
                        >
                          <span>🛒</span>
                          <span>{tStr('- खर्च (Expense)', '- Expense Sound', '- Expense')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => playCelebrationSound()}
                          className="p-2 rounded-lg bg-[var(--theme-bg,#070E18)] border border-amber-500/30 text-amber-400 font-semibold hover:bg-amber-500/10 flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer active:scale-95"
                        >
                          <span>🎉</span>
                          <span>{tStr('लक्ष्य पूरा (Goal)', 'Goal Complete', 'Celebration')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => playBellSound()}
                          className="p-2 rounded-lg bg-[var(--theme-bg,#070E18)] border border-blue-500/30 text-blue-400 font-semibold hover:bg-blue-500/10 flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer active:scale-95"
                        >
                          <span>🔔</span>
                          <span>{tStr('घंटी (Bell)', 'Reminder Bell', 'Reminder Bell')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => playKeypadSound('9')}
                          className="p-2 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-semibold hover:bg-white/5 flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer active:scale-95"
                        >
                          <span>👆</span>
                          <span>{tStr('कीपैड टैप', 'Keypad Click', 'Keypad Click')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => playDeleteSound()}
                          className="p-2 rounded-lg bg-[var(--theme-bg,#070E18)] border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer active:scale-95"
                        >
                          <span>🗑️</span>
                          <span>{tStr('डिलीट / ट्रैश', 'Delete Sound', 'Delete Sound')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Install & Download Offline App */}
              {onOpenInstall && (
                <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      <Download className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{tStr('ऐप इंस्टॉल / डाउनलोड करें', 'App Install / Download Karein', 'Install & Download App')}</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                        100% Offline
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                      {tStr(
                        'बिना इंटरनेट चलाने के लिए मोबाइल या कंप्यूटर की होम स्क्रीन पर जोड़ें या ऑफलाइन पैकेज लें।',
                        'Bina internet chalane ke liye mobile ya desktop par install karein.',
                        'Add to mobile/desktop home screen or download offline launcher for zero-internet use.'
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenInstall();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12px] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{tStr('इंस्टॉल', 'Install Karein', 'Install')}</span>
                  </button>
                </div>
              )}

              {/* Share Direct Page Links */}
              {onOpenShare && (
                <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      <Share2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{tStr('पेज डायरेक्ट लिंक शेयर करें', 'Direct Page Links Share Karein', 'Share Direct Page Links')}</span>
                    </div>
                    <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                      {tStr(
                        'होम, रिकॉर्ड, लक्ष्य या ट्रैकर का डायरेक्ट लिंक WhatsApp या सोशल मीडिया पर शेयर करें।',
                        'Home, record, goals ya tracker ke links WhatsApp par share karein.',
                        'Share deep links to Home, History, Goals, or Tracker on WhatsApp, X, or Telegram.'
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenShare();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-extrabold text-[12px] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{tStr('शेयर करें', 'Share Karein', 'Share')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM OPTIONS & CATEGORIES */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              {/* Expense Categories Manager */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#EF4444]" />
                    <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {tStr('खर्च श्रेणियां (Expense Categories)', 'Custom Expense Categories', 'Custom Expense Categories')} ({currentCategories.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={tStr('नई खर्च श्रेणी का नाम...', 'Nayi expense category ka naam...', 'Add new expense category...')}
                    value={customExpCategoryInput}
                    onChange={(e) => setCustomExpCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpenseCategory())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddExpenseCategory}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + {tStr('जोड़ें', 'Add', 'Add')}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-muted,#CBD5E1)] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpenseCategory(cat)}
                        className="text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] cursor-pointer"
                        title="Delete Category"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Income Sources Manager */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {tStr('कमाई के स्रोत (Income Sources)', 'Custom Income Sources', 'Custom Income Sources')} ({currentIncomeSources.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={tStr('नया कमाई स्रोत नाम...', 'Naya income source ka naam...', 'Add new income source...')}
                    value={customIncomeSourceInput}
                    onChange={(e) => setCustomIncomeSourceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncomeSource())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddIncomeSource}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + {tStr('जोड़ें', 'Add', 'Add')}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentIncomeSources.map((src) => (
                    <span
                      key={src}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-muted,#CBD5E1)] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>{src}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteIncomeSource(src)}
                        className="text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] cursor-pointer"
                        title="Delete Source"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Categories Manager */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {tStr('कार्य श्रेणियां (Work Categories)', 'Custom Work Categories', 'Custom Work Categories')} ({currentWorkCategories.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={tStr('नई कार्य श्रेणी नाम...', 'Nayi work category ka naam...', 'Add new work category...')}
                    value={customWorkCategoryInput}
                    onChange={(e) => setCustomWorkCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWorkCategory())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddWorkCategory}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + {tStr('जोड़ें', 'Add', 'Add')}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentWorkCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-muted,#CBD5E1)] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkCategory(cat)}
                        className="text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] cursor-pointer"
                        title="Delete Work Category"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Life Tags Manager */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[var(--theme-secondary,#FFC700)]" />
                    <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {tStr('दैनिक डायरी टैग्स (Life Tags)', 'Custom Journal Tags', 'Custom Journal Tags')} ({currentLifeTags.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={tStr('नया डायरी टैग...', 'Naya diary / life tag...', 'Add new life tag...')}
                    value={customLifeTagInput}
                    onChange={(e) => setCustomLifeTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLifeTag())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddLifeTag}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-secondary,#FFC700)] text-[#040D17] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + {tStr('जोड़ें', 'Add', 'Add')}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentLifeTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-muted,#CBD5E1)] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLifeTag(tag)}
                        className="text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] cursor-pointer"
                        title="Delete Tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC FUND ALLOCATION RULES & CATEGORIES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h4 className="font-bold text-[14.5px] text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{tStr('फंड श्रेणियां व विभाजन प्रतिशत अनुकूलक', 'Fund Categories Aur Split Allocation Rules', 'Fund Categories & Split Allocation Rules')}</span>
                    </h4>
                    <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                      {tStr(
                        'अपनी जरूरत के अनुसार नए फंड जोड़ें, नाम/आइकन बदलें या हटाएं। कुल आवंटन ठीक 100% होना चाहिए।',
                        'Naye funds add karein, icons/labels edit karein. Total allocation 100% hona chahiye.',
                        'Add custom funds, edit icons/labels, or remove funds. Incoming income will be split according to these rules (Total must equal 100%).'
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFundItem(null);
                        setIsFundEditorOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12px] flex items-center gap-1.5 hover:brightness-110 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{tStr('+ नया फंड जोड़ें', '+ Naya Fund Add Karein', '+ Add Fund')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetPercentages}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] font-semibold text-[11.5px] flex items-center gap-1 cursor-pointer"
                      title="Reset all funds & percentages to defaults"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{tStr('रीसेट', 'Reset', 'Reset')}</span>
                    </button>
                  </div>
                </div>

                {/* Fund cards list with Edit, Delete, Icon & Percentage input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {currentFunds.map((cfg) => {
                    const FundIcon = getFundIcon(cfg.id, cfg.iconName);
                    const val = customPercentages[cfg.id] ?? cfg.defaultPct;

                    return (
                      <div
                        key={cfg.id}
                        className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2.5 hover:border-[var(--theme-primary,#38BDF8)]/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                            style={{ backgroundColor: `${cfg.color}25`, color: cfg.color }}
                          >
                            <FundIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)] truncate">
                                {cfg.label}
                              </span>
                              {cfg.isCustom && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30 shrink-0">
                                  Custom
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] block truncate">
                              {cfg.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="100"
                              value={val}
                              onChange={(e) => {
                                const num = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                                setCustomPercentages({
                                  ...customPercentages,
                                  [cfg.id]: num
                                });
                              }}
                              className="w-14 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg px-2 py-1 text-right text-[12.5px] font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                            />
                            <span className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] font-bold">%</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingFundItem(cfg);
                              setIsFundEditorOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)] cursor-pointer transition-colors"
                            title="Edit Fund"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setFundToDelete(cfg)}
                            className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] hover:border-[#EF4444]/40 cursor-pointer transition-colors"
                            title="Remove Fund"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live total verification indicator & Auto Balance */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--theme-border,#213E61)]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
                        {tStr('कुल प्रतिशत योग', 'Total Allocation', 'Total Allocation')}:
                      </span>
                      <span
                        className={`font-mono font-bold text-[14px] ${
                          isPercentValid ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {totalPercent.toFixed(2)}%
                      </span>
                    </div>

                    {!isPercentValid && (
                      <button
                        type="button"
                        onClick={handleAutoBalance}
                        className="px-2.5 py-1 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] font-bold text-[11px] flex items-center gap-1 hover:bg-[#F59E0B]/25 cursor-pointer transition-all active:scale-95"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{tStr('स्वतः 100% करें', 'Auto-Balance Karein', 'Auto-Balance')}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePercentages}
                    disabled={!isPercentValid}
                    className={`py-2 px-4 rounded-xl font-bold text-[12.5px] transition-all cursor-pointer ${
                      isPercentValid
                        ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] hover:brightness-110 shadow-sm'
                        : 'bg-[var(--theme-border,#213E61)] text-[#64748B] cursor-not-allowed'
                    }`}
                  >
                    {tStr('नियम सहेजें', 'Rules Save Karein', 'Save Allocation Rules')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & LOCAL DATA */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              {/* GOOGLE DRIVE 1-CLICK BACKUP & AUTO-SYNC CARD */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-[var(--theme-surface,#0E1A29)] to-sky-950/30 border border-blue-500/35 space-y-3.5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/35 flex items-center justify-center text-blue-400 shrink-0">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)]">
                          {tStr('गूगल ड्राइव 1-क्लिक बैकअप व ऑटो सिंक', 'Google Drive 1-Click Backup Aur Auto Sync', 'Google Drive 1-Click Backup & Auto-Sync')}
                        </h4>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          CLOUD SAFE
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                        {tStr(
                          'डेटा सुरक्षित रखने के लिए अपने गूगल ड्राइव में सहेजें। वन-क्लिक बैकअप व ऑटोमैटिक अपडेट उपलब्ध है।',
                          'Data safe rakhne ke liye Google Drive mein backup lein. 1-click aur auto-sync available hai.',
                          'Safeguard your accounts by saving to your Google Drive with 1-click and automatic sync.'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Account Status Badge */}
                  {auth.currentUser ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shrink-0 self-start sm:self-auto">
                      <CloudCheck className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[140px]">{auth.currentUser.displayName || auth.currentUser.email || 'Connected'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/15 border border-slate-500/30 text-slate-400 text-[11px] font-medium shrink-0 self-start sm:self-auto">
                      <span>{tStr('अनकनेक्टेड', 'Not Linked', 'Not Connected')}</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* 1-Click Backup Now */}
                  <button
                    type="button"
                    onClick={handleQuickDriveBackup}
                    disabled={isQuickBackingUp}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-between gap-3 shadow-md shadow-blue-950/50 transition-all cursor-pointer disabled:opacity-70 active:scale-[0.98]"
                    id="settings-gdrive-1click-btn"
                  >
                    <div className="flex items-center gap-2.5 text-left min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        {isQuickBackingUp ? (
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <CloudUpload className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold truncate">
                          {isQuickBackingUp
                            ? tStr('अपलोड हो रहा है...', 'Uploading to Drive...', 'Uploading to Drive...')
                            : tStr('1-क्लिक बैकअप लें', '1-Click Backup Lein', '1-Click Backup Now')}
                        </div>
                        <div className="text-[10.5px] text-blue-100/80 font-normal truncate">
                          {tStr('गूगल ड्राइव में तुरंत सहेजें', 'Google Drive par turant save karein', 'Instant upload to Google Drive')}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Manage Drive Backups & Restore Modal Button */}
                  {onOpenGoogleDrive && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        onOpenGoogleDrive();
                      }}
                      className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-blue-500/30 hover:border-blue-400/70 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                      id="settings-gdrive-manage-btn"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                          <RotateCcw className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                            {tStr('बैकअप लिस्ट व रिस्टोर हब', 'Backup List Aur Restore Hub', 'View Backups & Restore')}
                          </div>
                          <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                            {tStr('फ़ाइलें देखें, रिस्टोर व प्रबंधित करें', 'Files dekhein, restore aur manage karein', 'List drive files & 1-click restore')}
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* Auto Sync Toggle Strip */}
                {onToggleAutoSync && (
                  <div className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${autoSyncEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      <div className="min-w-0">
                        <span className="text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                          {tStr('ऑटोमैटिक अपडेट (Auto-Sync)', 'Automatic Update (Auto-Sync)', 'Automatic Update (Auto-Sync)')}
                        </span>
                        <span className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] block truncate">
                          {autoSyncEnabled
                            ? lastSyncTime
                              ? tStr(`सक्रिय: अंतिम अपडेट ${lastSyncTime} पर`, `Active: Last synced at ${lastSyncTime}`, `Active: Last synced at ${lastSyncTime}`)
                              : tStr('सक्रिय: बदलाव होने पर स्वचालित अपडेट होगा', 'Active: Automatically updates on changes', 'Active: Automatically syncs when data changes')
                            : tStr('बंद: केवल 1-क्लिक करने पर ही बैकअप होगा', 'Off: Only saves when you click backup', 'Off: Only saves on manual click')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        onToggleAutoSync(!autoSyncEnabled);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      id="settings-auto-sync-toggle"
                      role="switch"
                      aria-checked={autoSyncEnabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div>
                  <h4 className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)]">
                    {tStr('लोकल स्टोरेज बैकअप और रिस्टोर', 'Local Storage Backup Aur Restore', 'Local Storage Backup & Restore')}
                  </h4>
                  <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                    {tStr(
                      'आपका संपूर्ण खाता डेटा 100% आपके डिवाइस में सुरक्षित है। नियमित बैकअप JSON डाउनलोड करें।',
                      'Aapka financial data 100% aapke device mein safe hai. Regular JSON backup download karein.',
                      'Your financial data is 100% client-side. Export offline backups regularly to prevent cache loss.'
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-left flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <div>
                      <div className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                        {tStr('JSON बैकअप डाउनलोड करें', 'JSON Backup Download Karein', 'Export JSON Backup')}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                        {tStr('पूर्ण डेटा, सेटिंग्स व इतिहास', 'Complete data, goals aur logs', 'Complete data, goals & logs')}
                      </div>
                    </div>
                  </button>

                  <label className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-secondary,#FFC700)] text-left flex items-center gap-3 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-[var(--theme-secondary,#FFC700)] shrink-0" />
                    <div>
                      <div className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                        {tStr('JSON फ़ाइल से रिस्टोर करें', 'JSON File Se Restore Karein', 'Restore from JSON File')}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                        {tStr('पहले सहेजा बैकअप लोड करें', 'Pehle ka saved backup load karein', 'Import previously saved record')}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sample Data & Reset Danger Zone */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <h4 className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                  {tStr('नमूना डेटा व रीसेट', 'Sample Data Aur Reset Control', 'Sample Data & Reset Control')}
                </h4>

                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => setConfirmAction('sample')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text-muted,#CBD5E1)] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{tStr('नमूना डेटा लोड करें', 'Sample Demo Data Load Karein', 'Load Demo Sample Data')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmAction('reset')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 hover:bg-[#EF4444]/25 text-[#EF4444] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{tStr('सभी डेटा मिटाएं व रीसेट करें', 'Sabhi Data Wipe Aur Reset Karein', 'Wipe & Reset All Khata Data')}</span>
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setConfirmAction('reset_settings')}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-500/15 border border-orange-500/30 hover:bg-orange-500/25 text-orange-400 text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>{tStr('सिर्फ सेटिंग्स डिफ़ॉल्ट पर रीसेट करें', 'Sirf Settings Default Par Reset Karein', 'Reset Settings to Default (Keep Data)')}</span>
                  </button>
                </div>
              </div>

              {/* PWA Cache Versioning & Instant Update */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                    <Sparkles className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {tStr('ऐप वर्शन व कैश कंट्रोल', 'App Version Aur Cache Control', 'App Version & PWA Cache Control')}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                    {APP_VERSION_FULL}
                  </span>
                </div>

                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                  {tStr(
                    'GitHub या Vercel पर अपडेट होने पर नया वर्शन ऑटोमैटिक लोड होता है। यदि तुरंत नया लोगो, JS या CSS लोड करना हो, तो नीचे क्लिक करें।',
                    'Naya update aane par app auto-detect karta hai. Instant cache wipe aur fresh reload ke liye neeche click karein.',
                    'App automatically detects and installs latest updates on launch. Click below if you need an instant manual cache wipe & fresh asset reload.'
                  )}
                </p>

                <button
                  type="button"
                  onClick={handleForceUpdateApp}
                  disabled={isUpdatingApp}
                  className="w-full py-2.5 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-primary,#38BDF8)]/50 hover:bg-[var(--theme-primary,#38BDF8)]/10 text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className={`w-4 h-4 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                  <span>
                    {isUpdatingApp
                      ? tStr('अपडेट किया जा रहा है...', 'Refresh ho raha hai...', 'Refreshing...')
                      : tStr('नवीनतम वर्शन चेक करें व कैश रीसेट करें', 'Updates Check Karein Aur Cache Reset Karein', 'Check for Updates & Force Fresh Cache')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PRIVACY & SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              {/* App Lock / Passcode Card */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                    <Lock className="w-5 h-5" />
                    <div>
                      <h4 className="font-bold text-[15px] text-[var(--theme-text,#F8FAFC)]">
                        {tStr('ऐप पासकोड व पिन लॉक', 'App Passcode Aur PIN Lock', 'App Passcode & PIN Lock')}
                      </h4>
                      <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                        {tStr(
                          'वित्तीय प्रविष्टियों और डायरी को सुरक्षित रखने हेतु 4-अंकीय पिन व रिकवरी सवाल',
                          'Financial records aur diary ko protect karne ke liye 4-digit PIN aur recovery question',
                          'Protect financial records and journal entries with a 4-digit PIN & recovery question'
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      securityLock?.isEnabled
                        ? 'bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)]/40'
                        : 'bg-[#64748B]/20 text-[var(--theme-text-dim,#94A3B8)] border-[#64748B]/40'
                    }`}
                  >
                    {securityLock?.isEnabled
                      ? tStr('सुरक्षा सक्रिय (Active)', 'Security Active', 'Locked / Protected')
                      : tStr('अक्रिय (Disabled)', 'Security Off (Disabled)', 'Disabled')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {onOpenSecurityModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSecurityModal();
                        onClose();
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {securityLock?.isEnabled
                          ? tStr('पिन व रिकवरी सेटिंग्स बदलें', 'PIN Aur Recovery Settings Badlein', 'Modify Passcode & Recovery')
                          : tStr('सुरक्षा पिन सेट करें (Set PIN)', 'Security PIN Set Karein', 'Set Up App Passcode')}
                      </span>
                    </button>
                  )}

                  {securityLock?.isEnabled && onInstantLock && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onInstantLock();
                      }}
                      className="py-2.5 px-4 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 hover:bg-[#EF4444]/25 text-[#EF4444] text-[12.5px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{tStr('अभी लॉक करें', 'Abhi Lock Karein', 'Lock Now')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Offline Architecture Info */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3.5">
                <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                  <ShieldCheck className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                  <h4 className="font-bold text-[15px] text-[var(--theme-text,#F8FAFC)]">
                    {tStr('100% ऑफलाइन व सुरक्षित आर्किटेक्चर', '100% Offline Aur Secure Architecture', '100% Offline & Client-Side Architecture')}
                  </h4>
                </div>
                <p className="text-[12.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  Daily Khata Pro operates strictly on your local device memory (IndexedDB / localStorage). Your
                  financial records, invoices, work deliverables, and daily journals are never transmitted to external
                  servers or cloud databases without your explicit export.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11.5px]">
                  <div className="p-2.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span>Zero Server Tracking</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span>Instant Client Math</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span>Local JSON Portability</span>
                  </div>
                </div>

                {/* Cookie & Storage Preferences Card */}
                <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
                      <Cookie className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
                        {tStr('कुकीज़ व लोकल स्टोरेज सेटिंग्स', 'Cookies & Local Storage Preferences', 'Cookies & Storage Permissions')}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                        {tStr('अपनी स्टोरेज सहमति व कुकीज़ प्राथमिकताओं को बदलें', 'Manage device storage consent and cookie preferences', 'Manage device storage consent and cookie preferences')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onOpenCookieSettings && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCookieSettings();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] text-[11.5px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{tStr('प्राथमिकताएं बदलें', 'Manage Preferences', 'Manage Preferences')}</span>
                      </button>
                    )}
                    {onOpenCookiesPolicy && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCookiesPolicy();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{tStr('नीति पढ़ें', 'Read Policy', 'Read Policy')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* GitHub Repo Card */}
                <div className="p-3 rounded-xl bg-[#060B11] border border-[#213E61] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 className="w-5 h-5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <div>
                      <div className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)]">GitHub Open Source Repository</div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">GitHub / Daily-Khata-Pro</div>
                    </div>
                  </div>
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-primary,#38BDF8)]/40 text-[var(--theme-primary,#38BDF8)] text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Inspect Code</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ENTITY & LEGAL */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              {/* Commercial Terms & Standard Edition Policy */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5 shadow-md">
                <div className="flex items-center gap-2 text-cyan-400">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-[14.5px] text-[var(--theme-text,#F8FAFC)]">
                    {tStr('मुफ़्त मानक संस्करण व व्यवसायिक शर्तें', 'Free Standard Edition & Commercial Terms', 'Free Standard Edition & Commercial Terms')}
                  </h4>
                </div>
                <p className="text-[12px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {tStr(
                    'डेली खाता प्रो के मुख्य फीचर्स MIT लाइसेंस के तहत मुफ़्त उपलब्ध हैं। भविष्य के विकास, क्लाउड संवर्द्धन और सर्वर इन्फ्रास्ट्रक्चर को बनाए रखने के लिए, प्लेटफॉर्म भविष्य के संस्करणों में वैकल्पिक प्रीमियम सदस्यता (Subscriptions), स्पॉन्सर्ड पार्टनर टूल्स, या विज्ञापन (Ads) प्रस्तुत करने का अधिकार सुरक्षित रखता है। मुख्य ऑफलाइन लेजर कार्यक्षमता हमेशा बिना किसी अनिवार्य शुल्क के उपलब्ध रहेगी।',
                    'Daily Khata Pro standard core features are provided free under MIT Open Source License. To support ongoing maintenance, server operations and ecosystem enhancements, the platform reserves the flexibility in future releases to introduce optional pro subscriptions, curated sponsor partnerships, or non-intrusive contextual ads while keeping core offline ledger tools accessible without mandatory paywalls.',
                    'Daily Khata Pro standard core features are provided free under MIT Open Source License. To support ongoing maintenance, server operations and ecosystem enhancements, the platform reserves the flexibility in future releases to introduce optional pro subscriptions, curated sponsor partnerships, or non-intrusive contextual ads while keeping core offline ledger tools accessible without mandatory paywalls.'
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-[var(--theme-text-dim,#94A3B8)]">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">License: MIT Open Source</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">Core Ledger: Free Access</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">Terms: Flexible Policy</span>
                </div>
              </div>

              {/* App Links & Navigation Section */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-4 shadow-md">
                <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] border-b border-[var(--theme-border,#213E61)] pb-2.5">
                  <Info className="w-5 h-5" />
                  <h4 className="font-bold text-[15px] text-[var(--theme-text,#F8FAFC)]">App Information & Navigation</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'about', label: language === 'hi' ? 'हमारे बारे में' : 'About Us', icon: Info },
                    { id: 'academy', label: language === 'hi' ? 'वेल्थ अकादमी' : 'Wealth Academy', icon: Sparkles, color: 'text-[var(--theme-primary,#38BDF8)]' },
                    { id: 'guide', label: language === 'hi' ? 'यूज़र गाइड' : 'User Guide', icon: BookOpen },
                    { id: 'calculator', label: language === 'hi' ? 'कैलकुलेटर' : 'Calculators', icon: Calculator },
                    { id: 'privacy', label: language === 'hi' ? 'प्राइवेसी' : 'Privacy Policy', icon: Shield },
                    { id: 'cookies', label: language === 'hi' ? 'कुकीज़' : 'Cookies', icon: Cookie },
                    { id: 'terms', label: language === 'hi' ? 'शर्तें' : 'Terms', icon: FileText },
                    { id: 'disclaimer', label: language === 'hi' ? 'डिस्क्लेमर' : 'Disclaimer', icon: AlertCircle },
                    { id: 'safety', label: language === 'hi' ? 'सोर्स सेफ्टी' : 'Code Safety', icon: ShieldCheck, color: 'text-[var(--theme-primary,#38BDF8)]' },
                    { id: 'support-project', label: language === 'hi' ? 'प्रोजेक्ट सपोर्ट' : 'Support Project', icon: Heart, color: 'text-red-500' }
                  ].map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onNavigate) onNavigate(link.id);
                        }}
                        className={`p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group ${link.color || 'text-[var(--theme-text-dim,#94A3B8)]'}`}
                      >
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold leading-tight">{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social Connect Section */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-4 shadow-md">
                <div className="flex items-center gap-2 text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,#213E61)] pb-2.5">
                  <Globe className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
                  <h4 className="font-bold text-[15px]">{language === 'hi' ? 'सोशल मीडिया व कनेक्ट' : 'Connect & Social Media'}</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#24292F]/10 border border-[#24292F]/30 hover:bg-[#24292F] hover:text-white text-[var(--theme-text-dim,#94A3B8)] flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-[11px] font-bold">GitHub</span>
                  </a>
                  <a
                    href="mailto:daily-Khata-Pro@gmail.com"
                    className="p-3 rounded-xl bg-[#EA4335]/10 border border-[#EA4335]/30 hover:bg-[#EA4335] hover:text-white text-[var(--theme-text-dim,#94A3B8)] flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[11px] font-bold">Email</span>
                  </a>
                  <a
                    href="https://www.instagram.com/dailykhatapro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/30 hover:bg-[#E1306C] hover:text-white text-[var(--theme-text-dim,#94A3B8)] flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-[11px] font-bold">Instagram</span>
                  </a>
                  <a
                    href="https://x.com/Dailykhatapro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 hover:bg-[#1DA1F2] hover:text-white text-[var(--theme-text-dim,#94A3B8)] flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="text-[11px] font-bold">X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] hover:brightness-110 font-bold text-[13px] shadow-sm cursor-pointer transition-all active:scale-98"
          >
            {tStr('पूर्ण', 'Done', 'Done')}
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {confirmAction === 'reset' && (
        <ConfirmModal
          isOpen={true}
          title={tStr('सभी डेटा रीसेट करें?', 'Sabhi Data Reset Karein?', 'Reset All Record Data?')}
          description={
            tStr(
              'यह आपके सभी लेन-देन, लक्ष्य और कार्य रिकॉर्ड को मिटा देगा। यह क्रिया वापस नहीं ली जा सकती।',
              'Yeh aapke sabhi transactions, goals aur work records ko delete kar dega. Yeh action undo nahi ho sakta.',
              'This will permanently erase all record transactions, goals and work deliverables from local memory.'
            )
          }
          confirmLabel={tStr('हां, सब मिटाएं', 'Haan, Sab Delete Karein', 'Yes, Wipe Everything')}
          cancelLabel={tStr('रद्द करें', 'Cancel Karein', 'Cancel')}
          isDanger={true}
          onConfirm={() => {
            onResetData();
            setConfirmAction(null);
            showFeedback('success', tStr('सभी डेटा रीसेट हो गया।', 'Sabhi data reset ho gaya.', 'All record data reset.'));
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'sample' && (
        <ConfirmModal
          isOpen={true}
          title={tStr('नमूना डेटा लोड करें?', 'Sample Demo Data Load Karein?', 'Load Demo Sample Data?')}
          description={
            tStr(
              'यह आपके मौजूदा डेटा को नए व्यावहारिक उदाहरण लेन-देन के साथ बदल देगा।',
              'Yeh aapke current data ko sample income entries aur fund allocations ke sath replace kar dega.',
              'This will populate your record with sample income entries and active fund allocations.'
            )
          }
          confirmLabel={tStr('लोड करें', 'Load Karein', 'Load Demo')}
          cancelLabel={tStr('रद्द करें', 'Cancel Karein', 'Cancel')}
          onConfirm={() => {
            onLoadSampleData();
            setConfirmAction(null);
            showFeedback('success', tStr('नमूना डेटा लोड हो गया!', 'Sample demo data load ho gaya!', 'Sample demo data loaded!'));
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'reset_settings' && (
        <ConfirmModal
          isOpen={true}
          title={tStr('सेटिंग्स डिफ़ॉल्ट पर रीसेट करें?', 'Settings Default Par Reset Karein?', 'Reset Settings to Defaults?')}
          description={
            tStr(
              'यह आपके द्वारा कस्टमाइज़ की गई सेटिंग्स (जैसे थीम, लेआउट, श्रेणियां) को डिफ़ॉल्ट पर सेट कर देगा। आपका रिकॉर्डेड डेटा सुरक्षित रहेगा।',
              'Yeh aapki custom settings (theme, categories) ko default par set kar dega. Aapka main data safe rahega.',
              'This will restore UI settings, themes, categories, and percentages to their defaults. Your financial records will remain safe.'
            )
          }
          confirmLabel={tStr('हां, रीसेट करें', 'Haan, Reset Karein', 'Yes, Reset Settings')}
          cancelLabel={tStr('रद्द करें', 'Cancel Karein', 'Cancel')}
          isDanger={true}
          onConfirm={() => {
            if (onUpdateFunds) onUpdateFunds(DEFAULT_FUNDS, DEFAULT_PERCENTAGES);
            if (onUpdateCategories) onUpdateCategories(DEFAULT_CATEGORIES);
            if (onUpdateIncomeSources) onUpdateIncomeSources(DEFAULT_INCOME_SOURCES);
            if (onUpdateWorkCategories) onUpdateWorkCategories(DEFAULT_WORK_CATEGORIES);
            if (onUpdateLifeTags) onUpdateLifeTags(DEFAULT_LIFE_TAGS);
            if (onLayoutChange) onLayoutChange('dashboard');
            if (onViewModeChange) onViewModeChange('auto');
            if (onThemeChange) onThemeChange('blue');
            setConfirmAction(null);
            showFeedback('success', tStr('सभी सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गईं!', 'Sabhi settings default par reset ho gayin!', 'All settings restored to defaults!'));
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {/* Fund Deletion Confirmation */}
      {fundToDelete && (
        <ConfirmModal
          isOpen={true}
          title={tStr(`फंड "${fundToDelete.label}" हटाएं?`, `Fund "${fundToDelete.label}" delete karein?`, `Remove Fund "${fundToDelete.label}"?`)}
          description={
            tStr(
              `क्या आप वाकई "${fundToDelete.label}" फंड हटाना चाहते हैं? इसका प्रतिशत शेष फंड्स में स्वतः समायोजित हो जाएगा।`,
              `Kya aap waqai "${fundToDelete.label}" fund remove karna chahte hain? Iska percentage bache hue funds mein adjust ho jayega.`,
              `Are you sure you want to remove "${fundToDelete.label}"? Its split allocation percentage will be automatically reallocated to keep the total at 100%.`
            )
          }
          confirmLabel={tStr('हां, हटाएं', 'Haan, Remove Karein', 'Yes, Remove')}
          cancelLabel={tStr('रद्द करें', 'Cancel Karein', 'Cancel')}
          isDanger={true}
          onConfirm={handleConfirmDeleteFund}
          onCancel={() => setFundToDelete(null)}
        />
      )}

      {/* Fund Editor Modal (Add/Edit) */}
      <FundEditorModal
        isOpen={isFundEditorOpen}
        onClose={() => {
          setIsFundEditorOpen(false);
          setEditingFundItem(null);
        }}
        onSave={handleSaveFund}
        editingFund={editingFundItem}
        existingFunds={currentFunds}
        language={language}
      />
    </div>
  );
};
