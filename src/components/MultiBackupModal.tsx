import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  Upload,
  FileText,
  Cloud,
  Camera,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ShieldCheck,
  CalendarCheck,
  Landmark,
  Coins,
  History,
  CheckSquare,
  Square,
  Calendar,
  Filter,
  Printer,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { KhataData, AppLanguage } from '../types';
import {
  downloadCompleteJsonBackup,
  downloadCompleteCSVBackup,
  exportOneClickComprehensivePDF,
  createLocalSnapshot,
  getLocalSnapshots,
  deleteLocalSnapshot,
  LocalSnapshot,
  ExportFilterOptions,
  DEFAULT_EXPORT_OPTIONS,
  filterKhataDataByOptions
} from '../utils/backupService';
import { validateAndSanitizeKhataBackup } from '../utils/security';
import { triggerHapticSound, triggerCelebration } from '../utils/khataCalculations';
import { getLocalDateString } from '../utils/dateUtils';
import { getCurrencyConfig, getCurrentLanguage } from '../utils/currencyConfig';

interface MultiBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullKhataData: KhataData;
  onRestoreData: (restored: KhataData) => void;
  onOpenGoogleDrive?: () => void;
  isDriveConnected?: boolean;
  isAutoSyncing?: boolean;
  language?: AppLanguage;
}

export const MultiBackupModal: React.FC<MultiBackupModalProps> = ({
  isOpen,
  onClose,
  fullKhataData,
  onRestoreData,
  onOpenGoogleDrive,
  isDriveConnected = false,
  isAutoSyncing = false,
  language = 'en'
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'snapshots'>('export');
  const [snapshots, setSnapshots] = useState<LocalSnapshot[]>([]);
  const [snapshotName, setSnapshotName] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Filter Options State
  const [modules, setModules] = useState({
    entries: true,
    attendance: true,
    loans: true,
    notes: true,
    goals: true,
    settings: true
  });

  const [dateRangeType, setDateRangeType] = useState<
    'all' | 'this_month' | 'last_month' | 'last_3_months' | 'custom'
  >('all');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return getLocalDateString(d);
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => getLocalDateString(new Date()));

  useEffect(() => {
    if (isOpen) {
      setSnapshots(getLocalSnapshots());
    }
  }, [isOpen]);

  // Are all modules selected?
  const allModulesSelected = useMemo(() => {
    return Object.values(modules).every(Boolean);
  }, [modules]);

  const toggleSelectAllModules = () => {
    triggerHapticSound('click');
    const targetState = !allModulesSelected;
    setModules({
      entries: targetState,
      attendance: targetState,
      loans: targetState,
      notes: targetState,
      goals: targetState,
      settings: targetState
    });
  };

  const toggleModule = (key: keyof typeof modules) => {
    triggerHapticSound('click');
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentExportOptions = useMemo<ExportFilterOptions>(() => {
    return {
      modules,
      dateRange: {
        type: dateRangeType,
        startDate: customStartDate,
        endDate: customEndDate,
        label:
          dateRangeType === 'all'
            ? isHindi ? 'सम्पूर्ण डेटा (All Time)' : 'All Time'
            : dateRangeType === 'this_month'
            ? isHindi ? 'इस महीने (This Month)' : 'This Month'
            : dateRangeType === 'last_month'
            ? isHindi ? 'पिछले महीने (Last Month)' : 'Last Month'
            : dateRangeType === 'last_3_months'
            ? isHindi ? 'पिछले 3 महीने (Last 3 Months)' : 'Last 3 Months'
            : `${customStartDate} - ${customEndDate}`
      }
    };
  }, [modules, dateRangeType, customStartDate, customEndDate, isHindi]);

  // Preview counts based on current filters
  const filteredPreview = useMemo(() => {
    return filterKhataDataByOptions(fullKhataData, currentExportOptions);
  }, [fullKhataData, currentExportOptions]);

  if (!isOpen) return null;

  const showFeedbackMsg = (type: 'success' | 'error' | 'info', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportPdf = async () => {
    triggerHapticSound('click');
    setIsGeneratingPdf(true);
    try {
      const currencySymbol = getCurrencyConfig(getCurrentLanguage()).symbol || 'Rs.';
      await exportOneClickComprehensivePDF(
        fullKhataData,
        currencySymbol,
        isHindi,
        currentExportOptions
      );
      showFeedbackMsg(
        'success',
        isHindi
          ? '✓ चयनित फ़िल्टर अनुसार PDF रिपोर्ट तैयार होकर डाउनलोड हो गई!'
          : '✓ Filtered PDF statement generated and downloaded successfully!'
      );
    } catch (err: any) {
      console.error('PDF export failed:', err);
      showFeedbackMsg(
        'error',
        isHindi
          ? 'PDF निर्माण में त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Failed to generate PDF. Please try again.'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportJson = () => {
    try {
      downloadCompleteJsonBackup(fullKhataData, currentExportOptions);
      showFeedbackMsg(
        'success',
        isHindi
          ? '✓ चयनित डेटा का JSON बैकअप सफलतापूर्वक डाउनलोड हो गया!'
          : '✓ Filtered JSON backup file downloaded successfully!'
      );
    } catch (err) {
      showFeedbackMsg('error', 'Download error');
    }
  };

  const handleExportCsv = () => {
    try {
      downloadCompleteCSVBackup(fullKhataData, currentExportOptions);
      showFeedbackMsg(
        'success',
        isHindi
          ? '✓ चयनित डेटा का एक्सेल/CSV बैकअप डाउनलोड हो गया!'
          : '✓ Filtered Excel/CSV backup file downloaded successfully!'
      );
    } catch (err) {
      showFeedbackMsg('error', 'CSV export error');
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validated = validateAndSanitizeKhataBackup(parsed);

        if (validated) {
          triggerHapticSound('save');
          onRestoreData(validated);
          showFeedbackMsg(
            'success',
            isHindi
              ? `✓ बैकअप रिस्टोर हुआ (${validated.entries?.length || 0} प्रविष्टियां, ${validated.attendanceLogs?.length || 0} उपस्थिति, ${validated.personalNotes?.length || 0} नोट्स)!`
              : `✓ Complete data restored (${validated.entries?.length || 0} entries, ${validated.attendanceLogs?.length || 0} attendance, ${validated.personalNotes?.length || 0} notes)!`
          );
          setTimeout(() => onClose(), 1500);
        } else {
          showFeedbackMsg(
            'error',
            isHindi
              ? 'अमान्य बैकअप फ़ाइल। कृपया सही Daily Khata Pro फ़ाइल चुनें।'
              : 'Invalid backup file format.'
          );
        }
      } catch (err) {
        showFeedbackMsg(
          'error',
          isHindi ? 'JSON पार्सिंग में त्रुटि।' : 'Failed to parse JSON file.'
        );
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateSnapshot = () => {
    if (!snapshotName.trim()) {
      showFeedbackMsg('info', isHindi ? 'कृपया स्नैपशॉट का कोई नाम दें' : 'Please enter a checkpoint name');
      return;
    }
    const newSnap = createLocalSnapshot(snapshotName, fullKhataData);
    setSnapshots(getLocalSnapshots());
    setSnapshotName('');
    triggerHapticSound('save');
    showFeedbackMsg(
      'success',
      isHindi
        ? `✓ लोकल चेकपॉइंट "${newSnap.name}" सुरक्षित सहेजा गया!`
        : `✓ Local snapshot "${newSnap.name}" saved safely in browser storage!`
    );
  };

  const handleRestoreSnapshot = (snap: LocalSnapshot) => {
    if (
      confirm(
        isHindi
          ? `क्या आप "${snap.name}" से डेटा रिस्टोर करना चाहते हैं?`
          : `Restore data from snapshot "${snap.name}"?`
      )
    ) {
      onRestoreData(snap.data);
      triggerCelebration();
      showFeedbackMsg('success', isHindi ? 'चेकपॉइंट सफलतापूर्वक लोड हुआ!' : 'Snapshot restored successfully!');
      setTimeout(() => onClose(), 1200);
    }
  };

  const handleDeleteSnapshot = (id: string) => {
    const updated = deleteLocalSnapshot(id);
    setSnapshots(updated);
    showFeedbackMsg('info', isHindi ? 'स्नैपशॉट हटाया गया' : 'Snapshot removed');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#1E293B)] shadow-2xl text-[var(--theme-text,#F8FAFC)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border,#1E293B)] bg-[var(--theme-surface,#0F172A)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-white flex items-center gap-2">
                <span>{isHindi ? 'डाउनलोड, PDF रिपोर्ट व बैकअप' : 'Export, PDF Statement & Backup'}</span>
              </h3>
              <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi
                  ? 'चयन करें कि क्या और किस समयावधि का बैकअप या PDF बनाना है'
                  : 'Select exact modules and date range to export or save'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] flex items-center justify-center text-[var(--theme-text-dim,#94A3B8)] hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert Toast inside Modal */}
        {feedback && (
          <div
            className={`px-4 py-2.5 text-[12px] font-semibold flex items-center gap-2 transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/30'
                : feedback.type === 'error'
                ? 'bg-rose-500/15 text-rose-300 border-b border-rose-500/30'
                : 'bg-blue-500/15 text-blue-300 border-b border-blue-500/30'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Top Navigation Tabs */}
        <div className="flex border-b border-[var(--theme-border,#1E293B)] px-5 pt-2 bg-[var(--theme-surface,#0F172A)] gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 font-semibold text-[13px] border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'डाउनलोड व PDF विकल्प' : 'Export & PDF Statement'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('snapshots')}
            className={`px-4 py-2.5 font-semibold text-[13px] border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'snapshots'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isHindi ? 'लोकल चेकपॉइंट्स' : 'Local Snapshots'}</span>
            {snapshots.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400 font-mono">
                {snapshots.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2.5 font-semibold text-[13px] border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'import'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{isHindi ? 'बैकअप रिस्टोर' : 'Restore Data'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'export' && (
            <div className="space-y-5">
              
              {/* SECTION 1: MODULE SELECTION CHECKBOXES */}
              <div className="p-4 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-400" />
                    <span className="text-[13px] font-bold text-white">
                      {isHindi ? '1. क्या शामिल करना है? (Select Modules)' : '1. What to include? (Select Modules)'}
                    </span>
                  </div>

                  {/* Master Switch: Select All / एक बार में सब */}
                  <button
                    type="button"
                    onClick={toggleSelectAllModules}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] hover:border-emerald-500/50 text-[12px] font-semibold text-white cursor-pointer transition-colors"
                  >
                    {allModulesSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{isHindi ? 'एक बार में सब (Select All)' : 'Select All'}</span>
                  </button>
                </div>

                {/* 6 Module Checkbox Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Financial Entries */}
                  <label
                    onClick={() => toggleModule('entries')}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.entries
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {modules.entries ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {isHindi ? 'लेन-देन प्रविष्टियां' : 'Financial Entries'}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.entries?.length || 0} {isHindi ? 'रिकॉर्ड्स' : 'records'}
                        </div>
                      </div>
                    </div>
                    <Coins className="w-4 h-4 text-emerald-400/60" />
                  </label>

                  {/* Attendance & Advances */}
                  <label
                    onClick={() => toggleModule('attendance')}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.attendance
                        ? 'bg-sky-500/10 border-sky-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {modules.attendance ? (
                        <CheckSquare className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {isHindi ? 'उपस्थिति व एडवांस' : 'Attendance & Advances'}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.attendanceLogs?.length || 0} {isHindi ? 'दिन' : 'logs'}
                        </div>
                      </div>
                    </div>
                    <CalendarCheck className="w-4 h-4 text-sky-400/60" />
                  </label>

                  {/* Loans & Udhar */}
                  <label
                    onClick={() => toggleModule('loans')}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.loans
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {modules.loans ? (
                        <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {isHindi ? 'ऋण व उधार खाता' : 'Loans & Udhar Book'}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.debtItems?.length || 0} {isHindi ? 'खातेदार' : 'items'}
                        </div>
                      </div>
                    </div>
                    <Landmark className="w-4 h-4 text-amber-400/60" />
                  </label>

                  {/* Personal Notes */}
                  <label
                    onClick={() => toggleModule('notes')}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.notes
                        ? 'bg-purple-500/10 border-purple-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {modules.notes ? (
                        <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {isHindi ? 'पर्सनल नोट्स व डायरी' : 'Personal Notes & Tasks'}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.personalNotes?.length || 0} {isHindi ? 'नोट्स' : 'notes'}
                        </div>
                      </div>
                    </div>
                    <FileText className="w-4 h-4 text-purple-400/60" />
                  </label>

                  {/* Goals & Budgets */}
                  <label
                    onClick={() => toggleModule('goals')}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.goals
                        ? 'bg-teal-500/10 border-teal-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {modules.goals ? (
                        <CheckSquare className="w-4 h-4 text-teal-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {isHindi ? 'लक्ष्य व बजट' : 'Goals & Budgets'}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.goals?.length || 0} {isHindi ? 'लक्ष्य' : 'goals'}
                        </div>
                      </div>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-teal-400/60" />
                  </label>

                  {/* App Settings */}
                  <label
                    onClick={() => toggleModule('settings')}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.settings
                        ? 'bg-blue-500/10 border-blue-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {modules.settings ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[12.5px] font-semibold">
                          {isHindi ? 'सेटिंग्स व श्रेणियां' : 'Settings & Categories'}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {isHindi ? 'थीम, फॉन्ट, श्रेणियां' : 'Theme, Funds, Categories'}
                        </div>
                      </div>
                    </div>
                    <SlidersHorizontalIcon className="w-4 h-4 text-blue-400/60" />
                  </label>
                </div>
              </div>

              {/* SECTION 2: DATE RANGE SELECTOR */}
              <div className="p-4 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span className="text-[13px] font-bold text-white">
                    {isHindi ? '2. कितनी अवधि का डेटा? (Date Range)' : '2. Date Range'}
                  </span>
                </div>

                {/* Range Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: isHindi ? 'सब (All Time)' : 'All Time' },
                    { id: 'this_month', label: isHindi ? 'इस महीने (This Month)' : 'This Month' },
                    { id: 'last_month', label: isHindi ? 'पिछले महीने (Last Month)' : 'Last Month' },
                    { id: 'last_3_months', label: isHindi ? 'पिछले 3 महीने' : 'Last 3 Months' },
                    { id: 'custom', label: isHindi ? 'कस्टम अवधि (Custom)' : 'Custom' }
                  ].map((range) => {
                    const active = dateRangeType === range.id;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => setDateRangeType(range.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all ${
                          active
                            ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                            : 'bg-[var(--theme-surface,#0F172A)] border-[var(--theme-border,#334155)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Date Pickers if selected */}
                {dateRangeType === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {isHindi ? 'प्रारंभिक तिथि (From Date)' : 'From Date'}
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {isHindi ? 'अंतिम तिथि (To Date)' : 'To Date'}
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: EXPORT ACTION BUTTONS */}
              <div className="space-y-3">
                <div className="text-[13px] font-bold text-white flex items-center justify-between">
                  <span>{isHindi ? '3. डाउनलोड माध्यम चुनें:' : '3. Choose Export Format:'}</span>
                  <span className="text-[11.5px] font-semibold text-emerald-400">
                    {isHindi ? 'चयनित कुल' : 'Selected Total'}: {filteredPreview.entries?.length || 0} entries
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: PDF Download */}
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    disabled={isGeneratingPdf}
                    className="p-3.5 rounded-xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border border-emerald-500/40 hover:border-emerald-400 text-left flex flex-col justify-between cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        PDF
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-white group-hover:text-emerald-300">
                        {isGeneratingPdf
                          ? isHindi ? 'PDF बन रही है...' : 'Generating...'
                          : isHindi ? 'PDF स्टेटमेंट डाउनलोड' : 'Download PDF'}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                        {isHindi ? 'प्रिंट व शेयर फ्रेंडली' : 'Clean printable PDF'}
                      </div>
                    </div>
                  </button>

                  {/* Option 2: JSON Backup */}
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="p-3.5 rounded-xl bg-gradient-to-b from-sky-500/15 to-sky-500/5 border border-sky-500/40 hover:border-sky-400 text-left flex flex-col justify-between cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                        JSON
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-white group-hover:text-sky-300">
                        {isHindi ? 'पूर्ण JSON बैकअप' : 'Complete JSON'}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                        {isHindi ? '100% लॉसलेस डेटा फ़ाइल' : 'Full backup for restore'}
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Excel CSV */}
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="p-3.5 rounded-xl bg-gradient-to-b from-purple-500/15 to-purple-500/5 border border-purple-500/40 hover:border-purple-400 text-left flex flex-col justify-between cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                        CSV
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-white group-hover:text-purple-300">
                        {isHindi ? 'एक्सेल (Excel / CSV)' : 'Excel / CSV Sheet'}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                        {isHindi ? 'स्प्रेडशीट व अकाउंटिंग' : 'Open in Excel/Sheets'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cloud Backup Link if available */}
              {onOpenGoogleDrive && (
                <div className="p-3.5 rounded-xl bg-[var(--theme-card,#1E293B)]/40 border border-[var(--theme-border,#1E293B)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold text-white flex items-center gap-1.5">
                        <span>{isHindi ? 'गूगल ड्राइव क्लाउड सिंक' : 'Google Drive Cloud Sync'}</span>
                        {isDriveConnected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                        {isDriveConnected
                          ? isHindi ? 'कनेक्टेड: सुरक्षित ऑटो व 1-क्लिक बैकअप' : 'Connected: Safe 1-Click Sync'
                          : isHindi ? 'अपने Google Drive में क्लाउड बैकअप लें' : 'Backup directly to your Google Drive'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGoogleDrive();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 text-[11.5px] font-bold cursor-pointer transition-colors"
                  >
                    {isHindi ? 'क्लाउड खोलें' : 'Open Cloud'}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LOCAL SNAPSHOTS */}
          {activeTab === 'snapshots' && (
            <div className="space-y-4">
              {/* Snapshot Creation */}
              <div className="p-4 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span className="text-[13px] font-bold text-white">
                    {isHindi ? 'त्वरित चेकपॉइंट बनाएं (Instant Safe Checkpoint)' : 'Create Safe Checkpoint'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder={
                      isHindi
                        ? 'चेकपॉइंट का नाम (उदा: माह अंत, वेतन से पूर्व)'
                        : 'Checkpoint Name (e.g. Month End, Before Salary)'
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleCreateSnapshot}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-bold text-[12px] flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सहेजें' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Snapshots List */}
              <div className="space-y-2">
                <div className="text-[12px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi
                    ? 'ब्राउज़र में सहेजे गए लोकल चेकपॉइंट्स (अधिकतम 6):'
                    : 'Recent recovery snapshots in local storage:'}
                </div>

                {snapshots.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-[var(--theme-border,#334155)] rounded-xl space-y-2">
                    <Camera className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                    <p className="text-[12.5px] text-[var(--theme-text-dim,#94A3B8)] font-semibold">
                      {isHindi ? 'कोई लोकल स्नैपशॉट नहीं है' : 'No local snapshots created yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {snapshots.map((snap) => (
                      <div
                        key={snap.id}
                        className="p-3 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-[13px] text-white flex items-center gap-2">
                            <span>{snap.name}</span>
                            <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] font-normal">
                              ({snap.createdAt})
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] flex gap-2 mt-0.5">
                            <span>{snap.stats.entriesCount} entries</span>
                            <span>•</span>
                            <span>{snap.stats.attendanceCount} attendance</span>
                            <span>•</span>
                            <span>{snap.stats.notesCount} notes</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRestoreSnapshot(snap)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isHindi ? 'लोड करें' : 'Restore'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSnapshot(snap.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT & RESTORE */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-white">
                    {isHindi ? 'JSON बैकअप फ़ाइल से डेटा पुनर्स्थापित करें' : 'Restore data from JSON backup file'}
                  </h4>
                  <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] mt-1 max-w-md mx-auto">
                    {isHindi
                      ? 'अपनी पहले डाउनलोड की गई .json बैकअप फ़ाइल चुनें। वित्तीय प्रविष्टियां, अटेंडेंस, नोट्स और ऋण स्वचालित रूप से लोड हो जाएंगे।'
                      : 'Select a previously saved .json backup. Entries, attendance, loans, and personal notes will be restored safely.'}
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-[13px] cursor-pointer transition-all shadow-md">
                  <Upload className="w-4 h-4" />
                  <span>{isHindi ? 'फ़ाइल चुनें (.json)' : 'Choose Backup File (.json)'}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-[var(--theme-surface,#0F172A)] border-t border-[var(--theme-border,#1E293B)] flex items-center justify-between text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isHindi
                ? '100% प्राइवेट व ऑफ़लाइन सुरक्षित'
                : '100% Client-Side Safe & Offline Capable'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:bg-[var(--theme-card-hover,#334155)] text-white font-semibold text-[12px] cursor-pointer transition-colors"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

// Helper Icon
function SlidersHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </svg>
  );
}
