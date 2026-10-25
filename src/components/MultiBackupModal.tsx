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
  ChevronRight,
  SlidersHorizontal
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col rounded-2xl bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#1E293B)] shadow-2xl text-[var(--theme-text,#F8FAFC)] overflow-hidden">
        
        {/* Header Bar - Compact for mobile */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-[var(--theme-border,#1E293B)] bg-[var(--theme-surface,#0F172A)] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[14.5px] sm:text-[16px] text-white truncate">
                {isHindi ? 'डाउनलोड, PDF व बैकअप' : 'Export, PDF & Backup'}
              </h3>
              <p className="text-[11px] sm:text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi
                  ? 'चुनें कि क्या और किस अवधि का बैकअप या PDF बनाना है'
                  : 'Choose modules & date range to export'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] flex items-center justify-center text-[var(--theme-text-dim,#94A3B8)] hover:text-white cursor-pointer transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert Toast inside Modal */}
        {feedback && (
          <div
            className={`px-3.5 py-2 text-[11.5px] font-semibold flex items-center gap-2 transition-all shrink-0 ${
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
            <span className="truncate">{feedback.text}</span>
          </div>
        )}

        {/* Top Navigation Tabs - Horizontal Scroll on small screens */}
        <div className="flex border-b border-[var(--theme-border,#1E293B)] px-3.5 sm:px-5 pt-1.5 bg-[var(--theme-surface,#0F172A)] overflow-x-auto no-scrollbar gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-3 sm:px-4 py-2 font-semibold text-[12px] sm:text-[13px] border-b-2 cursor-pointer transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डाउनलोड व PDF' : 'Export & PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('snapshots')}
            className={`px-3 sm:px-4 py-2 font-semibold text-[12px] sm:text-[13px] border-b-2 cursor-pointer transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'snapshots'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isHindi ? 'चेकपॉइंट्स' : 'Snapshots'}</span>
            {snapshots.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/20 text-sky-400 font-mono">
                {snapshots.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-3 sm:px-4 py-2 font-semibold text-[12px] sm:text-[13px] border-b-2 cursor-pointer transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'import'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isHindi ? 'रिस्टोर डेटा' : 'Restore'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
          {activeTab === 'export' && (
            <div className="space-y-3.5 sm:space-y-4">
              
              {/* SECTION 1: MODULE SELECTION CHECKBOXES */}
              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] space-y-2.5">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[12.5px] sm:text-[13px] font-bold text-white">
                      {isHindi ? '1. क्या शामिल करना है?' : '1. Select Modules'}
                    </span>
                  </div>

                  {/* Master Switch: Select All / एक बार में सब */}
                  <button
                    type="button"
                    onClick={toggleSelectAllModules}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] hover:border-emerald-500/50 text-[11.5px] font-semibold text-white cursor-pointer transition-colors self-start xs:self-auto"
                  >
                    {allModulesSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{isHindi ? 'एक बार में सब' : 'Select All'}</span>
                  </button>
                </div>

                {/* 6 Module Checkbox Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  {/* Financial Entries */}
                  <div
                    onClick={() => toggleModule('entries')}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.entries
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {modules.entries ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[12.5px] font-semibold truncate">
                          {isHindi ? 'लेन-देन प्रविष्टियां' : 'Financial Entries'}
                        </div>
                        <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.entries?.length || 0} {isHindi ? 'रिकॉर्ड्स' : 'records'}
                        </div>
                      </div>
                    </div>
                    <Coins className="w-4 h-4 text-emerald-400/60 shrink-0" />
                  </div>

                  {/* Attendance & Advances */}
                  <div
                    onClick={() => toggleModule('attendance')}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.attendance
                        ? 'bg-sky-500/10 border-sky-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {modules.attendance ? (
                        <CheckSquare className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[12.5px] font-semibold truncate">
                          {isHindi ? 'उपस्थिति व एडवांस' : 'Attendance & Advances'}
                        </div>
                        <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.attendanceLogs?.length || 0} {isHindi ? 'दिन' : 'logs'}
                        </div>
                      </div>
                    </div>
                    <CalendarCheck className="w-4 h-4 text-sky-400/60 shrink-0" />
                  </div>

                  {/* Loans & Udhar */}
                  <div
                    onClick={() => toggleModule('loans')}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.loans
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {modules.loans ? (
                        <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[12.5px] font-semibold truncate">
                          {isHindi ? 'ऋण व उधार खाता' : 'Loans & Udhar Book'}
                        </div>
                        <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.debtItems?.length || 0} {isHindi ? 'खाते' : 'items'}
                        </div>
                      </div>
                    </div>
                    <Landmark className="w-4 h-4 text-amber-400/60 shrink-0" />
                  </div>

                  {/* Personal Notes */}
                  <div
                    onClick={() => toggleModule('notes')}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.notes
                        ? 'bg-purple-500/10 border-purple-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {modules.notes ? (
                        <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[12.5px] font-semibold truncate">
                          {isHindi ? 'पर्सनल नोट्स व डायरी' : 'Personal Notes & Tasks'}
                        </div>
                        <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.personalNotes?.length || 0} {isHindi ? 'नोट्स' : 'notes'}
                        </div>
                      </div>
                    </div>
                    <FileText className="w-4 h-4 text-purple-400/60 shrink-0" />
                  </div>

                  {/* Goals & Budgets */}
                  <div
                    onClick={() => toggleModule('goals')}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.goals
                        ? 'bg-teal-500/10 border-teal-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {modules.goals ? (
                        <CheckSquare className="w-4 h-4 text-teal-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[12.5px] font-semibold truncate">
                          {isHindi ? 'लक्ष्य व बजट' : 'Goals & Budgets'}
                        </div>
                        <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                          {filteredPreview.goals?.length || 0} {isHindi ? 'लक्ष्य' : 'goals'}
                        </div>
                      </div>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-teal-400/60 shrink-0" />
                  </div>

                  {/* App Settings */}
                  <div
                    onClick={() => toggleModule('settings')}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      modules.settings
                        ? 'bg-blue-500/10 border-blue-500/40 text-white'
                        : 'bg-[var(--theme-surface,#0F172A)]/60 border-[var(--theme-border,#334155)] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {modules.settings ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[12.5px] font-semibold truncate">
                          {isHindi ? 'सेटिंग्स व श्रेणियां' : 'Settings & Categories'}
                        </div>
                        <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                          {isHindi ? 'थीम, फंड्स व श्रेणियां' : 'Theme, funds & categories'}
                        </div>
                      </div>
                    </div>
                    <SlidersHorizontal className="w-4 h-4 text-blue-400/60 shrink-0" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATE RANGE SELECTOR */}
              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[12.5px] sm:text-[13px] font-bold text-white">
                    {isHindi ? '2. कितनी अवधि का डेटा?' : '2. Date Range'}
                  </span>
                </div>

                {/* Range Pills - Touch friendly */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    { id: 'all', label: isHindi ? 'सम्पूर्ण (All Time)' : 'All Time' },
                    { id: 'this_month', label: isHindi ? 'इस महीने' : 'This Month' },
                    { id: 'last_month', label: isHindi ? 'पिछले महीने' : 'Last Month' },
                    { id: 'last_3_months', label: isHindi ? '3 महीने' : '3 Months' },
                    { id: 'custom', label: isHindi ? 'कस्टम' : 'Custom' }
                  ].map((range) => {
                    const active = dateRangeType === range.id;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => setDateRangeType(range.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-semibold border cursor-pointer transition-all ${
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

                {/* Custom Date Pickers */}
                {dateRangeType === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-400 mb-1">
                        {isHindi ? 'प्रारंभिक तिथि (From)' : 'From Date'}
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-400 mb-1">
                        {isHindi ? 'अंतिम तिथि (To)' : 'To Date'}
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: EXPORT ACTION BUTTONS */}
              <div className="space-y-2.5">
                <div className="text-[12.5px] sm:text-[13px] font-bold text-white flex items-center justify-between">
                  <span>{isHindi ? '3. माध्यम चुनें:' : '3. Choose Format:'}</span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {filteredPreview.entries?.length || 0} {isHindi ? 'प्रविष्टियां' : 'entries'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {/* Option 1: PDF Download */}
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    disabled={isGeneratingPdf}
                    className="p-3 rounded-xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border border-emerald-500/40 hover:border-emerald-400 text-left flex items-center sm:flex-col sm:items-start justify-between cursor-pointer transition-all active:scale-98 group gap-2"
                  >
                    <div className="flex items-center gap-2.5 sm:w-full sm:justify-between sm:mb-1.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        PDF
                      </span>
                    </div>
                    <div className="min-w-0 text-right sm:text-left">
                      <div className="font-bold text-[12.5px] text-white group-hover:text-emerald-300 truncate">
                        {isGeneratingPdf
                          ? isHindi ? 'PDF बन रही है...' : 'Generating...'
                          : isHindi ? 'PDF स्टेटमेंट डाउनलोड' : 'Download PDF'}
                      </div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)]">
                        {isHindi ? 'प्रिंट व शेयर फ्रेंडली' : 'Printable statement'}
                      </div>
                    </div>
                  </button>

                  {/* Option 2: JSON Backup */}
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="p-3 rounded-xl bg-gradient-to-b from-sky-500/15 to-sky-500/5 border border-sky-500/40 hover:border-sky-400 text-left flex items-center sm:flex-col sm:items-start justify-between cursor-pointer transition-all active:scale-98 group gap-2"
                  >
                    <div className="flex items-center gap-2.5 sm:w-full sm:justify-between sm:mb-1.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                        <Download className="w-4 h-4" />
                      </div>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">
                        JSON
                      </span>
                    </div>
                    <div className="min-w-0 text-right sm:text-left">
                      <div className="font-bold text-[12.5px] text-white group-hover:text-sky-300 truncate">
                        {isHindi ? 'पूर्ण JSON बैकअप' : 'Complete JSON'}
                      </div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)]">
                        {isHindi ? '100% डेटा बैकअप फ़ाइल' : 'Full backup for restore'}
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Excel CSV */}
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="p-3 rounded-xl bg-gradient-to-b from-purple-500/15 to-purple-500/5 border border-purple-500/40 hover:border-purple-400 text-left flex items-center sm:flex-col sm:items-start justify-between cursor-pointer transition-all active:scale-98 group gap-2"
                  >
                    <div className="flex items-center gap-2.5 sm:w-full sm:justify-between sm:mb-1.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                        CSV
                      </span>
                    </div>
                    <div className="min-w-0 text-right sm:text-left">
                      <div className="font-bold text-[12.5px] text-white group-hover:text-purple-300 truncate">
                        {isHindi ? 'एक्सेल (Excel / CSV)' : 'Excel / CSV Sheet'}
                      </div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)]">
                        {isHindi ? 'स्प्रेडशीट व अकाउंटिंग' : 'Open in Excel/Sheets'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cloud Backup Link if available */}
              {onOpenGoogleDrive && (
                <div className="p-3 rounded-xl bg-[var(--theme-card,#1E293B)]/40 border border-[var(--theme-border,#1E293B)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-white flex items-center gap-1.5 truncate">
                        <span>{isHindi ? 'गूगल ड्राइव सिंक' : 'Google Drive Sync'}</span>
                        {isDriveConnected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                        {isDriveConnected
                          ? isHindi ? 'कनेक्टेड: सुरक्षित ऑटो सिंक' : 'Connected: 1-Click Sync'
                          : isHindi ? 'क्लाउड में बैकअप सहेजें' : 'Save to Google Drive'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGoogleDrive();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 text-[11px] font-bold cursor-pointer transition-colors shrink-0"
                  >
                    {isHindi ? 'खोलें' : 'Open'}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LOCAL SNAPSHOTS */}
          {activeTab === 'snapshots' && (
            <div className="space-y-3">
              {/* Snapshot Creation */}
              <div className="p-3 sm:p-4 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[12.5px] font-bold text-white">
                    {isHindi ? 'त्वरित चेकपॉइंट बनाएं' : 'Create Safe Checkpoint'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder={
                      isHindi
                        ? 'चेकपॉइंट नाम (उदा: माह अंत, वेतन पूर्व)'
                        : 'Name (e.g. Month End, Before Salary)'
                    }
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400 placeholder:text-slate-500 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={handleCreateSnapshot}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-bold text-[11.5px] flex items-center gap-1 cursor-pointer transition-all shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सहेजें' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Snapshots List */}
              <div className="space-y-2">
                <div className="text-[11.5px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'लोकल चेकपॉइंट्स (अधिकतम 6):' : 'Recent checkpoints in storage:'}
                </div>

                {snapshots.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-[var(--theme-border,#334155)] rounded-xl space-y-1.5">
                    <Camera className="w-6 h-6 mx-auto text-slate-500 opacity-60" />
                    <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] font-semibold">
                      {isHindi ? 'कोई लोकल स्नैपशॉट नहीं है' : 'No snapshots created yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {snapshots.map((snap) => (
                      <div
                        key={snap.id}
                        className="p-2.5 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-[12px] sm:text-[12.5px] text-white flex items-center gap-1.5 truncate">
                            <span className="truncate">{snap.name}</span>
                            <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-normal shrink-0">
                              ({snap.createdAt})
                            </span>
                          </div>
                          <div className="text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] flex gap-1.5 mt-0.5 truncate">
                            <span>{snap.stats.entriesCount} entries</span>
                            <span>•</span>
                            <span>{snap.stats.attendanceCount} logs</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRestoreSnapshot(snap)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isHindi ? 'लोड' : 'Restore'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSnapshot(snap.id)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
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
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--theme-card,#1E293B)]/60 border border-[var(--theme-border,#1E293B)] text-center space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[13.5px] text-white">
                    {isHindi ? 'JSON बैकअप फ़ाइल से रिस्टोर करें' : 'Restore from JSON file'}
                  </h4>
                  <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1 max-w-md mx-auto">
                    {isHindi
                      ? 'अपनी पहले डाउनलोड की गई .json बैकअप फ़ाइल चुनें। वित्तीय प्रविष्टियां, अटेंडेंस व नोट्स स्वतः लोड हो जाएंगे।'
                      : 'Choose your saved .json backup file to restore entries, attendance, notes & loans.'}
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-[12px] cursor-pointer transition-all shadow-md">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'फ़ाइल चुनें (.json)' : 'Choose File (.json)'}</span>
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

        {/* Footer Note - Sticky at bottom */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[var(--theme-surface,#0F172A)] border-t border-[var(--theme-border,#1E293B)] flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)] shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {isHindi ? '100% ऑफ़लाइन सुरक्षित' : '100% Client-Side Safe'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 rounded-lg bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:bg-[var(--theme-card-hover,#334155)] text-white font-semibold text-[11.5px] cursor-pointer transition-colors shrink-0 ml-2"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
