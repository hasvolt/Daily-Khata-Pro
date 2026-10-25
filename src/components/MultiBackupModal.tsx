import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Landmark,
  Layers,
  Coins,
  History
} from 'lucide-react';
import { KhataData, AppLanguage, FundType } from '../types';
import {
  downloadCompleteJsonBackup,
  downloadCompleteCSVBackup,
  exportOneClickComprehensivePDF,
  createLocalSnapshot,
  getLocalSnapshots,
  deleteLocalSnapshot,
  LocalSnapshot
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

  const [activeTab, setActiveTab] = useState<'options' | 'snapshots'>('options');
  const [snapshots, setSnapshots] = useState<LocalSnapshot[]>([]);
  const [snapshotName, setSnapshotName] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSnapshots(getLocalSnapshots());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showFeedbackMsg = (type: 'success' | 'error' | 'info', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handle1ClickPdf = async () => {
    triggerHapticSound('click');
    setIsGeneratingPdf(true);
    try {
      const currencySymbol = getCurrencyConfig(getCurrentLanguage()).symbol || 'Rs.';
      await exportOneClickComprehensivePDF(fullKhataData, currencySymbol, isHindi);
      showFeedbackMsg(
        'success',
        isHindi
          ? '✓ 1-क्लिक PDF बैकअप रिपोर्ट तैयार होकर डाउनलोड हो गई!'
          : '✓ 1-Click Comprehensive PDF Report downloaded successfully!'
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
      downloadCompleteJsonBackup(fullKhataData);
      showFeedbackMsg(
        'success',
        isHindi
          ? '✓ संपूर्ण डेटा (उपस्थिति, नोट्स, ऋण व खाता) JSON डाउनलोड हो गया!'
          : '✓ Full JSON backup (Attendance, Notes, Loans & Entries) downloaded!'
      );
    } catch (err) {
      showFeedbackMsg('error', 'Download error');
    }
  };

  const handleExportCsv = () => {
    try {
      downloadCompleteCSVBackup(fullKhataData);
      showFeedbackMsg(
        'success',
        isHindi
          ? '✓ सभी श्रेणियों की एक्सेल/CSV फ़ाइल तैयार होकर डाउनलोड हो गई!'
          : '✓ Multi-section Excel/CSV backup file downloaded successfully!'
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
              ? `✓ सम्पूर्ण बैकअप रिस्टोर हुआ (${validated.entries?.length || 0} प्रविष्टियां, ${validated.attendanceLogs?.length || 0} उपस्थिति, ${validated.personalNotes?.length || 0} नोट्स)!`
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
    if (confirm(isHindi ? `क्या आप "${snap.name}" से डेटा रिस्टोर करना चाहते हैं?` : `Restore data from snapshot "${snap.name}"?`)) {
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

  // Metrics
  const entriesCount = fullKhataData.entries?.length || 0;
  const attCount = fullKhataData.attendanceLogs?.length || 0;
  const notesCount = fullKhataData.personalNotes?.length || 0;
  const debtCount = fullKhataData.debtItems?.length || 0;
  const goalsCount = fullKhataData.goals?.length || 0;
  const remindersCount = fullKhataData.reminders?.length || 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#1E293B)] shadow-2xl text-[var(--theme-text,#F8FAFC)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--theme-border,#1E293B)] bg-gradient-to-r from-[var(--theme-surface,#0F172A)] via-[var(--theme-card,#1E293B)] to-[var(--theme-surface,#0F172A)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-[16px] sm:text-[17px] text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{isHindi ? 'मल्टीपल बैकअप व 1-क्लिक PDF' : 'Multi-Backup & 1-Click PDF'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ALL-IN-ONE
                </span>
              </h3>
              <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi
                  ? 'खाता प्रविष्टियां, स्टाफ उपस्थिति, अग्रिम, पर्सनल नोट्स व ऋण रिकॉर्ड्स'
                  : 'Finance, Attendance & Advances, Personal Notes & Loans'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] flex items-center justify-center text-[var(--theme-text-dim,#94A3B8)] hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Counters Overview Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-[var(--theme-bg,#040812)]/80 border-b border-[var(--theme-border,#1E293B)] flex items-center justify-between overflow-x-auto gap-3 text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] select-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>{entriesCount} {isHindi ? 'लेन-देन' : 'Entries'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <CalendarCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>{attCount} {isHindi ? 'उपस्थिति व एडवांस' : 'Attendance'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>{notesCount} {isHindi ? 'नोट्स' : 'Notes'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>{debtCount} {isHindi ? 'ऋण/उधार' : 'Debts'}</span>
          </div>
        </div>

        {/* Feedback Alert Toast inside Modal */}
        {feedback && (
          <div
            className={`px-4 py-2 text-[12px] font-bold flex items-center gap-2 transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/40'
                : feedback.type === 'error'
                ? 'bg-rose-500/20 text-rose-300 border-b border-rose-500/40'
                : 'bg-blue-500/20 text-blue-300 border-b border-blue-500/40'
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

        {/* Tab Toggle: Options vs Snapshots */}
        <div className="flex border-b border-[var(--theme-border,#1E293B)] px-4 sm:px-6 pt-2 bg-[var(--theme-surface,#0F172A)]">
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            className={`px-4 py-2 font-bold text-[12.5px] border-b-2 cursor-pointer transition-all ${
              activeTab === 'options'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            {isHindi ? '⚡ बैकअप व डाउनलोड विकल्प' : '⚡ Backup & Export Options'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('snapshots')}
            className={`px-4 py-2 font-bold text-[12.5px] border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'snapshots'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'border-transparent text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isHindi ? 'लोकल चेकपॉइंट (Snapshots)' : 'Local Snapshots'}</span>
            {snapshots.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/20 text-sky-400">
                {snapshots.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'options' ? (
            <div className="space-y-3.5">
              
              {/* 1. ONE-CLICK COMPREHENSIVE PDF BUTTON */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[var(--theme-card,#1E293B)] to-sky-950/40 border-2 border-emerald-500/40 hover:border-emerald-500/70 transition-all shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-[14px] text-white">
                          {isHindi ? '📥 1-क्लिक सम्पूर्ण PDF बैकअप रिपोर्ट' : '📥 1-Click Comprehensive PDF Report'}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                        {isHindi
                          ? 'वित्तीय सारांश, उपस्थिति व एडवांस रजिस्टर, ऋण लेजर व नोट्स की पूर्ण पीडीएफ'
                          : 'Financials, Staff Attendance with Advances, Loans and Notes in a single printable PDF'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handle1ClickPdf}
                    disabled={isGeneratingPdf}
                    className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-[12.5px] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all shrink-0"
                  >
                    {isGeneratingPdf ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{isHindi ? 'PDF बन रहा है...' : 'Generating...'}</span>
                      </span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{isHindi ? '1-क्लिक PDF डाउनलोड' : 'Download PDF Now'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2-COLUMN GRID FOR JSON EXPORT & IMPORT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full JSON Export */}
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="p-3.5 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:border-[var(--theme-primary,#38BDF8)] text-left flex items-start gap-3 transition-colors cursor-pointer group active:scale-98"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-white">
                      {isHindi ? 'कम्प्लीट JSON बैकअप' : 'Full JSON Backup'}
                    </div>
                    <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                      {isHindi
                        ? 'अटेंडेंस, नोट्स, लोन्स सहित 100% डेटा फ़ाइल'
                        : 'Lossless offline JSON with all 6 data entities'}
                    </div>
                  </div>
                </button>

                {/* Full JSON Import */}
                <label className="p-3.5 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:border-amber-400/50 text-left flex items-start gap-3 transition-colors cursor-pointer group active:scale-98">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Upload className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-white">
                      {isHindi ? 'JSON फ़ाइल से रिस्टोर' : 'Restore from JSON File'}
                    </div>
                    <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                      {isHindi ? 'पहले सहेजा गया सम्पूर्ण डेटा लोड करें' : 'Import previous full backup file'}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 3-COLUMN / ROW FOR EXCEL & CLOUD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Excel CSV Export */}
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="p-3.5 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:border-emerald-500/50 text-left flex items-start gap-3 transition-colors cursor-pointer group active:scale-98"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-white">
                      {isHindi ? 'एक्सेल (Excel / CSV) एक्सपोर्ट' : 'Excel / CSV Spreadsheet'}
                    </div>
                    <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                      {isHindi ? 'मल्टी-शीट टेबल व प्रिंट फ्रेंडली स्प्रेडशीट' : 'Readable CSV with Attendance, Loans & Notes'}
                    </div>
                  </div>
                </button>

                {/* Google Drive Cloud Sync */}
                {onOpenGoogleDrive && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGoogleDrive();
                    }}
                    className="p-3.5 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:border-blue-400/50 text-left flex items-start gap-3 transition-colors cursor-pointer group active:scale-98"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Cloud className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-white flex items-center gap-1.5">
                        <span>{isHindi ? 'गूगल ड्राइव क्लाउड बैकअप' : 'Google Drive Cloud'}</span>
                        {isDriveConnected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                        {isDriveConnected
                          ? isHindi ? 'कनेक्टेड: 1-क्लिक या ऑटो सिंक करें' : 'Connected: 1-Click Sync available'
                          : isHindi ? 'अपने Google Drive में सुरक्षित सहेजें' : 'Save securely in your Google Drive'}
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* QUICK SNAPSHOT CREATION ROW */}
              <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#040812)]/60 border border-[var(--theme-border,#1E293B)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span className="text-[12.5px] font-bold text-white">
                    {isHindi ? 'त्वरित लोकल चेकपॉइंट बनाएं (Instant Safe Checkpoint)' : 'Create Instant Local Checkpoint'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder={isHindi ? 'चेकपॉइंट का नाम (जैसे: माह का अंत, वेतन से पूर्व)' : 'Checkpoint Name (e.g., Before Salary)'}
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--theme-surface,#0F172A)] border border-[var(--theme-border,#334155)] text-[12px] text-white focus:outline-none focus:border-sky-400 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleCreateSnapshot}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-bold text-[12px] flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सहेजें' : 'Save'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* TAB 2: LOCAL SNAPSHOTS LIST */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi
                    ? 'ब्राउज़र में सहेजे गए हालिया रिकवरी पॉइंट्स (अधिकतम 6):'
                    : 'Recent recovery snapshots stored locally in your browser:'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('options')}
                  className="text-[11.5px] font-bold text-sky-400 hover:underline cursor-pointer"
                >
                  {isHindi ? '+ नया चेकपॉइंट' : '+ New Checkpoint'}
                </button>
              </div>

              {snapshots.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-[var(--theme-border,#334155)] rounded-xl space-y-2">
                  <Camera className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                  <p className="text-[12.5px] text-[var(--theme-text-dim,#94A3B8)] font-bold">
                    {isHindi ? 'कोई लोकल स्नैपशॉट उपलब्ध नहीं है' : 'No local snapshots created yet'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    {isHindi
                      ? 'बड़े बदलाव या भुगतान करने से पहले त्वरित चेकपॉइंट बना सकते हैं।'
                      : 'Create safety checkpoints before making bulk settlements or edits.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-3 rounded-xl bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] flex items-center justify-between gap-3 hover:border-sky-500/40 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-[13px] text-white flex items-center gap-2">
                          <span>{snap.name}</span>
                          <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-normal">
                            ({snap.createdAt})
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] flex gap-2.5 mt-0.5">
                          <span>{snap.stats.entriesCount} entries</span>
                          <span>•</span>
                          <span>{snap.stats.attendanceCount} attendance</span>
                          <span>•</span>
                          <span>{snap.stats.notesCount} notes</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRestoreSnapshot(snap)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          title="Restore this state"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isHindi ? 'लोड करें' : 'Restore'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSnapshot(snap.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-all"
                          title="Delete snapshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-4 sm:px-6 py-3 bg-[var(--theme-bg,#040812)]/90 border-t border-[var(--theme-border,#1E293B)] flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isHindi
                ? '100% प्राइवेट व ऑफ़लाइन सुरक्षित • कोई डेटा तीसरे पक्ष को नहीं भेजा जाता'
                : '100% Client-Side Safe & Offline Capable'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[var(--theme-card,#1E293B)] border border-[var(--theme-border,#334155)] hover:bg-[var(--theme-card-hover,#334155)] text-white font-bold cursor-pointer transition-colors"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
