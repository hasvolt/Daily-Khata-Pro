import React, { useRef, useState } from 'react';
import { KhataData, AppTheme, AppLanguage, AppViewMode, FundType, SecurityLockConfig } from '../types';
import {
  DEFAULT_PERCENTAGES,
  DEFAULT_CATEGORIES,
  DEFAULT_INCOME_SOURCES,
  DEFAULT_WORK_CATEGORIES,
  DEFAULT_LIFE_TAGS,
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
  Lightbulb
} from 'lucide-react';
import { triggerHapticSound } from '../utils/khataCalculations';
import { ConfirmModal } from './ConfirmModal';
import { HasVoltLogo } from './HasVoltLogo';
import { TRANSLATIONS } from '../utils/translations';
import { getAppTranslation } from '../utils/appTranslations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KhataData;
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
  onOpenDeveloper?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenSupport?: (tab?: 'help' | 'bug' | 'suggestion') => void;
  securityLock?: SecurityLockConfig;
  onInstantLock?: () => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  privacyMask?: boolean;
  onTogglePrivacyMask?: () => void;
  viewMode?: AppViewMode;
  onViewModeChange?: (mode: AppViewMode) => void;
}

type TabType = 'preferences' | 'custom' | 'rules' | 'backup' | 'privacy' | 'developer' | 'legal';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  data,
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
  onOpenDeveloper,
  onOpenSecurityModal,
  onOpenSupport,
  securityLock,
  onInstantLock,
  theme = 'blue',
  onThemeChange,
  language = 'en',
  onLanguageChange,
  privacyMask = false,
  onTogglePrivacyMask,
  viewMode = 'auto',
  onViewModeChange
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('preferences');
  const [confirmAction, setConfirmAction] = useState<'reset' | 'sample' | null>(null);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Custom Allocation Rule State
  const [customPercentages, setCustomPercentages] = useState<Record<FundType, number>>(
    data.settings?.percentages || DEFAULT_PERCENTAGES
  );

  // Custom Category & Source State
  const [customExpCategoryInput, setCustomExpCategoryInput] = useState('');
  const [customIncomeSourceInput, setCustomIncomeSourceInput] = useState('');
  const [customWorkCategoryInput, setCustomWorkCategoryInput] = useState('');
  const [customLifeTagInput, setCustomLifeTagInput] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHindi = language === 'hi';
  const tr = getAppTranslation((language as AppLanguage) || 'en');

  if (!isOpen) return null;

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

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daily-khata-pro-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerHapticSound('save');
    showFeedback('success', isHindi ? 'JSON बैकअप सफलतापूर्वक डाउनलोड हो गया!' : 'JSON Backup downloaded successfully!');
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
          showFeedback('success', isHindi ? 'खाता डेटा सफलतापूर्वक रिस्टोर हो गया!' : 'Ledger data restored successfully!');
          setTimeout(() => onClose(), 1200);
        } else {
          showFeedback('error', isHindi ? 'अमान्य प्रारूप। कृपया सही बैकअप फ़ाइल चुनें।' : 'Invalid format. Please select a valid Daily Khata: Pro JSON backup.');
        }
      } catch (err) {
        showFeedback('error', isHindi ? 'JSON पार्सिंग में त्रुटि।' : 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Rule percentage calculations
  const totalPercent: number = FUND_ORDER.reduce((s: number, f: FundType) => s + (Number(customPercentages[f]) || 0), 0);
  const isPercentValid = Math.abs(totalPercent - 100) < 0.01;

  const handleSavePercentages = () => {
    if (!isPercentValid) {
      showFeedback('error', isHindi ? 'कुल प्रतिशत ठीक 100% होना चाहिए।' : 'Total allocation percentage must equal 100% exactly.');
      triggerHapticSound('error');
      return;
    }
    if (onUpdatePercentages) {
      onUpdatePercentages(customPercentages);
    }
    triggerHapticSound('save');
    showFeedback('success', isHindi ? '6-फंड आवंटन नियम सफलतापूर्वक सहेजे गए!' : '6-Fund allocation rule updated successfully!');
  };

  const handleResetPercentages = () => {
    setCustomPercentages(DEFAULT_PERCENTAGES);
    if (onUpdatePercentages) {
      onUpdatePercentages(DEFAULT_PERCENTAGES);
    }
    triggerHapticSound('click');
    showFeedback('success', isHindi ? 'डिफ़ॉल्ट 6-फंड नियमों पर रीसेट कर दिया गया।' : 'Reset to default recommended 6-fund rules.');
  };

  // Custom Categories Add/Delete
  const handleAddExpenseCategory = () => {
    const trimmed = customExpCategoryInput.trim();
    if (trimmed && !currentCategories.includes(trimmed)) {
      const updated = [...currentCategories, trimmed];
      if (onUpdateCategories) onUpdateCategories(updated);
      setCustomExpCategoryInput('');
      triggerHapticSound('save');
      showFeedback('success', `${isHindi ? 'नई श्रेणी जोड़ी गई' : 'Category added'}: ${trimmed}`);
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
      showFeedback('success', `${isHindi ? 'नया आय स्रोत जोड़ा गया' : 'Income source added'}: ${trimmed}`);
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
      showFeedback('success', `${isHindi ? 'कार्य श्रेणी जोड़ी गई' : 'Work category added'}: ${trimmed}`);
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
      showFeedback('success', `${isHindi ? 'टैग जोड़ा गया' : 'Life tag added'}: #${trimmed}`);
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
    { id: 'light', label: isHindi ? 'दिन / वाइट मोड (Daylight)' : 'Daylight White', dot: '#0284C7', isLight: true },
    { id: 'white', label: isHindi ? 'आउटडोर प्योर वाइट' : 'Outdoor Pure White', dot: '#2563EB', isLight: true }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--theme-card,#132438)] border-0 sm:border border-[var(--theme-border,#213E61)] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[92vh] max-w-2xl flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-3">
            <HasVoltLogo size={32} />
            <div>
              <h3 className="font-bold text-[16px] sm:text-[17px] text-[#F8FAFC]">
                {tr.settings.title}
              </h3>
              <p className="text-[11.5px] text-[#94A3B8]">
                {tr.settings.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-bg,#070E18)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {modalFeedback && (
          <div
            className={`px-4 py-2.5 text-[12.5px] font-bold flex items-center gap-2 border-b animate-in fade-in ${
              modalFeedback.type === 'success'
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
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
            { id: 'developer', label: tr.settings.tabDeveloper, icon: User },
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
                    : 'border-transparent text-[#94A3B8] hover:text-[#CBD5E1]'
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
                  <label className="font-bold text-[13.5px] text-[#F8FAFC]">
                    {isHindi ? 'ऐप की भाषा' : 'Application Language'}
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
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)]/50'
                      }`}
                    >
                      <div className="text-[12.5px] font-bold truncate">{l.label}</div>
                      <div className="text-[10px] opacity-75 truncate">{l.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  <label className="font-bold text-[13.5px] text-[#F8FAFC]">
                    {isHindi ? 'कलर थीम' : 'Accent Color Palette'}
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
                          ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] font-bold shadow-xs'
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#CBD5E1]'
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
                  <div className="flex items-center gap-2 font-bold text-[13.5px] text-[#F8FAFC]">
                    {privacyMask ? <EyeOff className="w-4 h-4 text-[#F59E0B]" /> : <Eye className="w-4 h-4 text-[#94A3B8]" />}
                    <span>{isHindi ? 'संख्या गोपनीयता मोड (Privacy Mask)' : 'Rupee Value Privacy Masking'}</span>
                  </div>
                  <p className="text-[11.5px] text-[#94A3B8]">
                    {isHindi
                      ? 'सार्वजनिक स्थानों पर स्क्रीन पर दिखने वाली रुपये की राशि को छुपाएं।'
                      : 'Mask numerical rupee amounts with dots for private viewing in public spaces.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onTogglePrivacyMask}
                  className={`px-3.5 py-2 rounded-xl font-bold text-[12.5px] border transition-all cursor-pointer ${
                    privacyMask
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                      : 'bg-[var(--theme-bg,#070E18)] text-[#94A3B8] border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
                  }`}
                >
                  {privacyMask ? (isHindi ? 'सक्रिय (Masked)' : 'Enabled') : (isHindi ? 'निष्क्रिय' : 'Disabled')}
                </button>
              </div>

              {/* Share Direct Page Links */}
              {onOpenShare && (
                <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[13.5px] text-[#F8FAFC]">
                      <Share2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{isHindi ? 'पेज डायरेक्ट लिंक शेयर करें' : 'Share Direct Page Links'}</span>
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      {isHindi
                        ? 'होम, लेजर, लक्ष्य या ट्रैकर का डायरेक्ट लिंक WhatsApp या सोशल मीडिया पर शेयर करें।'
                        : 'Share deep links to Home, History, Goals, or Tracker on WhatsApp, X, or Telegram.'}
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
                    <span>{isHindi ? 'शेयर करें' : 'Share'}</span>
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
                    <span className="font-bold text-[13.5px] text-[#F8FAFC]">
                      {isHindi ? 'खर्च श्रेणियां (Expense Categories)' : 'Custom Expense Categories'} ({currentCategories.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isHindi ? 'नई खर्च श्रेणी का नाम...' : 'Add new expense category...'}
                    value={customExpCategoryInput}
                    onChange={(e) => setCustomExpCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpenseCategory())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddExpenseCategory}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpenseCategory(cat)}
                        className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer"
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
                    <Store className="w-4 h-4 text-[#10B981]" />
                    <span className="font-bold text-[13.5px] text-[#F8FAFC]">
                      {isHindi ? 'कमाई के स्रोत (Income Sources)' : 'Custom Income Sources'} ({currentIncomeSources.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isHindi ? 'नया कमाई स्रोत नाम...' : 'Add new income source...'}
                    value={customIncomeSourceInput}
                    onChange={(e) => setCustomIncomeSourceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncomeSource())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddIncomeSource}
                    className="px-3 py-1.5 rounded-xl bg-[#10B981] text-[#04140D] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentIncomeSources.map((src) => (
                    <span
                      key={src}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>{src}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteIncomeSource(src)}
                        className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer"
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
                    <span className="font-bold text-[13.5px] text-[#F8FAFC]">
                      {isHindi ? 'कार्य श्रेणियां (Work Categories)' : 'Custom Work Categories'} ({currentWorkCategories.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isHindi ? 'नई कार्य श्रेणी नाम...' : 'Add new work category...'}
                    value={customWorkCategoryInput}
                    onChange={(e) => setCustomWorkCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWorkCategory())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddWorkCategory}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentWorkCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkCategory(cat)}
                        className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer"
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
                    <span className="font-bold text-[13.5px] text-[#F8FAFC]">
                      {isHindi ? 'दैनिक डायरी टैग्स (Life Tags)' : 'Custom Journal Tags'} ({currentLifeTags.length})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isHindi ? 'नया डायरी टैग...' : 'Add new life tag...'}
                    value={customLifeTagInput}
                    onChange={(e) => setCustomLifeTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLifeTag())}
                    className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddLifeTag}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-secondary,#FFC700)] text-[#040D17] font-bold text-[12px] cursor-pointer hover:brightness-110"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {currentLifeTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] text-[#CBD5E1] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLifeTag(tag)}
                        className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer"
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

          {/* TAB 3: 6-FUND ALLOCATION RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[14px] text-[#F8FAFC]">
                      {isHindi ? '6-फंड स्वचालित प्रतिशत विभाजन अनुकूलक' : '6-Fund Allocation Percentage Customizer'}
                    </h4>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      {isHindi
                        ? 'नई आने वाली कमाई का प्रतिशत नियम निर्धारित करें। कुल योग 100% होना चाहिए।'
                        : 'Adjust the automated split ratio for incoming revenue. Total must equal 100% exactly.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetPercentages}
                    className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'डिफ़ॉल्ट रीसेट' : 'Reset Rules'}</span>
                  </button>
                </div>

                {/* Fund percentage inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {FUND_ORDER.map((f) => {
                    const cfg = FUND_CONFIGS[f];
                    const val = customPercentages[f] ?? cfg.defaultPct;
                    return (
                      <div
                        key={f}
                        className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-[13px] text-[#F8FAFC] block truncate">
                            {FUND_LABELS[f]}
                          </span>
                          <span className="text-[11px] text-[#94A3B8] block truncate">{cfg.description}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) => {
                              const num = parseFloat(e.target.value) || 0;
                              setCustomPercentages({
                                ...customPercentages,
                                [f]: num
                              });
                            }}
                            className="w-16 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg px-2 py-1 text-right text-[13px] font-mono font-bold text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                          />
                          <span className="text-[12px] text-[#94A3B8] font-bold">%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live total verification indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border,#213E61)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-bold text-[#94A3B8]">
                      {isHindi ? 'कुल प्रतिशत योग' : 'Total Allocation'}:
                    </span>
                    <span
                      className={`font-mono font-bold text-[14px] ${
                        isPercentValid ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      {totalPercent.toFixed(2)}%
                    </span>
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
                    {isHindi ? 'नया नियम सहेजें' : 'Save Allocation Rule'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & LOCAL DATA */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
                <div>
                  <h4 className="font-bold text-[14px] text-[#F8FAFC]">
                    {isHindi ? 'लोकल स्टोरेज बैकअप और रिस्टोर' : 'Local Storage Backup & Restore'}
                  </h4>
                  <p className="text-[11.5px] text-[#94A3B8]">
                    {isHindi
                      ? 'आपका संपूर्ण खाता डेटा 100% आपके डिवाइस में सुरक्षित है। नियमित बैकअप JSON डाउनलोड करें।'
                      : 'Your financial data is 100% client-side. Export offline backups regularly to prevent cache loss.'}
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
                      <div className="font-bold text-[13px] text-[#F8FAFC]">
                        {isHindi ? 'JSON बैकअप डाउनलोड करें' : 'Export JSON Backup'}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {isHindi ? 'पूर्ण डेटा, सेटिंग्स व इतिहास' : 'Complete data, goals & logs'}
                      </div>
                    </div>
                  </button>

                  <label className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-secondary,#FFC700)] text-left flex items-center gap-3 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-[var(--theme-secondary,#FFC700)] shrink-0" />
                    <div>
                      <div className="font-bold text-[13px] text-[#F8FAFC]">
                        {isHindi ? 'JSON फ़ाइल से रिस्टोर करें' : 'Restore from JSON File'}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {isHindi ? 'पहले सहेजा बैकअप लोड करें' : 'Import previously saved ledger'}
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
                <h4 className="font-bold text-[13.5px] text-[#F8FAFC]">
                  {isHindi ? 'नमूना डेटा व रीसेट' : 'Sample Data & Reset Control'}
                </h4>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfirmAction('sample')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{isHindi ? 'नमूना डेटा लोड करें' : 'Load Demo Sample Data'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmAction('reset')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 hover:bg-[#EF4444]/25 text-[#EF4444] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isHindi ? 'सभी डेटा मिटाएं व रीसेट करें' : 'Wipe & Reset All Khata Data'}</span>
                  </button>
                </div>
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
                      <h4 className="font-bold text-[15px] text-[#F8FAFC]">
                        {isHindi ? 'ऐप पासकोड व पिन लॉक' : 'App Passcode & PIN Lock'}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8]">
                        {isHindi
                          ? 'वित्तीय प्रविष्टियों और डायरी को सुरक्षित रखने हेतु 4-अंकीय पिन व रिकवरी सवाल'
                          : 'Protect financial records and journal entries with a 4-digit PIN & recovery question'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      securityLock?.isEnabled
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                        : 'bg-[#64748B]/20 text-[#94A3B8] border-[#64748B]/40'
                    }`}
                  >
                    {securityLock?.isEnabled
                      ? isHindi
                        ? 'सुरक्षा सक्रिय (Active)'
                        : 'Locked / Protected'
                      : isHindi
                      ? 'अक्रिय (Disabled)'
                      : 'Disabled'}
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
                          ? isHindi
                            ? 'पिन व रिकवरी सेटिंग्स बदलें'
                            : 'Modify Passcode & Recovery'
                          : isHindi
                          ? 'सुरक्षा पिन सेट करें (Set PIN)'
                          : 'Set Up App Passcode'}
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
                      <span>{isHindi ? 'अभी लॉक करें' : 'Lock Now'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Offline Architecture Info */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3.5">
                <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  <h4 className="font-bold text-[15px] text-[#F8FAFC]">
                    {isHindi ? '100% ऑफलाइन व सुरक्षित आर्किटेक्चर' : '100% Offline & Client-Side Architecture'}
                  </h4>
                </div>
                <p className="text-[12.5px] text-[#CBD5E1] leading-relaxed">
                  Daily Khata: Pro operates strictly on your local device memory (IndexedDB / localStorage). Your
                  financial records, invoices, work deliverables, and daily journals are never transmitted to external
                  servers or cloud databases without your explicit export.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11.5px]">
                  <div className="p-2.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Zero Server Tracking</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Instant Client Math</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Local JSON Portability</span>
                  </div>
                </div>

                {/* GitHub Repo Card */}
                <div className="p-3 rounded-xl bg-[#060B11] border border-[#213E61] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 className="w-5 h-5 text-[#10B981] shrink-0" />
                    <div>
                      <div className="text-[12.5px] font-bold text-[#F8FAFC]">GitHub Open Source Repository</div>
                      <div className="text-[11px] text-[#94A3B8]">github.com/hasvolt/Daily-Khata-Pro</div>
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

          {/* TAB: DEVELOPER INFORMATION */}
          {activeTab === 'developer' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Photo - Full Unclipped */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="w-28 h-auto max-h-36 sm:w-32 sm:max-h-40 rounded-2xl overflow-hidden border-2 border-[var(--theme-primary,#38BDF8)] shadow-lg bg-[#060B11] p-1">
                      <img
                        src="/md-zafeer-hasan-yazdaan.jpg"
                        alt="MD Zafeer Hasan (YAZDAAN)"
                        className="w-full h-auto object-contain rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-1.5 px-2 py-0.5 rounded-md bg-[#10B981] text-[#04140D] text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Creator &amp; Founder</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                        MD Zafeer Hasan
                      </h4>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                        (YAZDAAN)
                      </span>
                    </div>

                    <div className="text-[12.5px] font-medium text-[var(--theme-primary,#38BDF8)]">
                      Independent Developer, Creator &amp; Founder
                    </div>

                    <div className="text-[11.5px] text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                      <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                      <a href="mailto:daily-Khata-Pro@gmail.com" className="hover:underline text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] font-mono">
                        daily-Khata-Pro@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Focus Badges */}
                <div className="pt-2 border-t border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mr-1">Focus:</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    Open Source
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                    Productivity
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    Personal Finance
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                    Digital Tools
                  </span>
                </div>

                {/* Bio text */}
                <div className="p-3.5 rounded-xl bg-[#060B11] border border-[#213E61] space-y-2 text-[12.5px] text-[#CBD5E1] leading-relaxed">
                  <p>
                    I&apos;m an independent developer focused on creating simple, practical, and privacy-conscious digital tools that are useful in everyday life.
                  </p>
                  <p>
                    This project is developed with the goal of providing a simple and accessible way for users to manage their daily income, expenses, and financial records.
                  </p>
                  <p className="text-[#F8FAFC] font-medium italic border-l-2 border-[var(--theme-primary,#38BDF8)] pl-2.5 text-[12px]">
                    &ldquo;I believe in building useful software that is transparent, easy to use, and accessible to everyone.&rdquo;
                  </p>
                </div>

                {/* Project Specs */}
                <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 text-[11.5px]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span className="font-semibold text-[#CBD5E1]">Project:</span>
                    <span className="text-[#F8FAFC] font-bold">Daily Income &amp; Expense Tracker (Daily Khata Pro)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span className="font-semibold text-[#CBD5E1]">License:</span>
                    <span className="text-[#10B981] font-mono font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                      Open Source (MIT)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span className="font-semibold text-[#CBD5E1]">Support &amp; Feedback:</span>
                    <a href="mailto:daily-Khata-Pro@gmail.com" className="text-[var(--theme-primary,#38BDF8)] hover:underline font-mono text-[11.5px]">
                      daily-Khata-Pro@gmail.com
                    </a>
                  </div>
                </div>

                {/* Quick Bug / Suggestion / Help buttons */}
                {onOpenSupport && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSupport('help');
                      }}
                      className="p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{isHindi ? 'सहायता केंद्र' : 'Help Centre'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSupport('bug');
                      }}
                      className="p-2 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 text-[#FCA5A5] font-semibold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Bug className="w-3.5 h-3.5 text-[#EF4444]" />
                      <span>{isHindi ? 'बग रिपोर्ट करें' : 'Report Bug'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSupport('suggestion');
                      }}
                      className="p-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 hover:bg-[#F59E0B]/20 text-[#FCD34D] font-semibold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{isHindi ? 'सुझाव दें' : 'Suggestion'}</span>
                    </button>
                  </div>
                )}

                {/* Action Contact Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href="mailto:daily-Khata-Pro@gmail.com"
                    className="p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact via Email</span>
                  </a>

                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                    <span>GitHub Repository</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ENTITY & LEGAL */}
          {activeTab === 'legal' && (
            <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3.5">
              <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                <Scale className="w-5 h-5" />
                <h4 className="font-bold text-[15px] text-[#F8FAFC]">Daily Khata: Pro Legal &amp; Entity</h4>
              </div>
              <p className="text-[12.5px] text-[#CBD5E1] leading-relaxed">
                Developed as a high-precision universal personal and enterprise financial accounting tool. Designed to
                cultivate rigorous wealth discipline using the proven 6-Fund money allocation model.
              </p>

              {/* GitHub & License Card */}
              <div className="p-3.5 rounded-xl bg-[#060B11] border border-[#213E61] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#F8FAFC] flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                    <span>Official Open-Source License</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                    MIT License
                  </span>
                </div>
                <p className="text-[11.5px] text-[#94A3B8]">
                  Repository:{' '}
                  <a
                    href="https://github.com/hasvolt/Daily-Khata-Pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:underline font-mono"
                  >
                    https://github.com/hasvolt/Daily-Khata-Pro.git
                  </a>
                </p>
              </div>

              <div className="pt-2 text-[11.5px] text-[#94A3B8] border-t border-[var(--theme-border,#213E61)]">
                Version 3.0.0 · Production Ready · Offline First · Free Open Source
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
            {isHindi ? 'पूर्ण' : 'Done'}
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {confirmAction === 'reset' && (
        <ConfirmModal
          isOpen={true}
          title={isHindi ? 'सभी डेटा रीसेट करें?' : 'Reset All Ledger Data?'}
          description={
            isHindi
              ? 'यह आपके सभी लेन-देन, लक्ष्य और कार्य रिकॉर्ड को मिटा देगा। यह क्रिया वापस नहीं ली जा सकती।'
              : 'This will permanently erase all ledger transactions, goals and work deliverables from local memory.'
          }
          confirmLabel={isHindi ? 'हां, सब मिटाएं' : 'Yes, Wipe Everything'}
          cancelLabel={isHindi ? 'रद्द करें' : 'Cancel'}
          isDanger={true}
          onConfirm={() => {
            onResetData();
            setConfirmAction(null);
            showFeedback('success', isHindi ? 'सभी डेटा रीसेट हो गया।' : 'All ledger data reset.');
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'sample' && (
        <ConfirmModal
          isOpen={true}
          title={isHindi ? 'नमूना डेटा लोड करें?' : 'Load Demo Sample Data?'}
          description={
            isHindi
              ? 'यह आपके मौजूदा डेटा को नए व्यावहारिक उदाहरण लेन-देन के साथ बदल देगा।'
              : 'This will populate your ledger with sample income entries and active fund allocations.'
          }
          confirmLabel={isHindi ? 'लोड करें' : 'Load Demo'}
          cancelLabel={isHindi ? 'रद्द करें' : 'Cancel'}
          onConfirm={() => {
            onLoadSampleData();
            setConfirmAction(null);
            showFeedback('success', isHindi ? 'नमूना डेटा लोड हो गया!' : 'Sample demo data loaded!');
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};
