import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  CloudCheck,
  CloudUpload,
  CloudDownload,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Trash2,
  Shield,
  Clock,
  Sparkles,
  Database,
  ArrowDownToLine,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { AppLanguage, KhataData } from '../types';
import {
  auth,
  initAuth,
  googleSignIn,
  googleSignOut,
  listDriveBackups,
  uploadBackupToDrive,
  downloadBackupFromDrive,
  deleteBackupFromDrive,
  DriveFileInfo,
  BACKUP_FILE_NAME,
  AUTO_SYNC_FILE_NAME,
  getAccessToken
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import { triggerHapticSound } from '../utils/khataCalculations';

export interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  currentData: KhataData;
  onRestoreData: (restored: KhataData) => void;
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  lastSyncTime: string | null;
  isAutoSyncing?: boolean;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  language,
  currentData,
  onRestoreData,
  autoSyncEnabled,
  onToggleAutoSync,
  lastSyncTime,
  isAutoSyncing = false
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [hasToken, setHasToken] = useState<boolean>(Boolean(getAccessToken()));
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isManualBackingUp, setIsManualBackingUp] = useState<boolean>(false);
  const [isFetchingBackups, setIsFetchingBackups] = useState<boolean>(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Restore & Delete Confirmation States (MANDATORY User Confirmation)
  const [fileToRestore, setFileToRestore] = useState<DriveFileInfo | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveFileInfo | null>(null);
  const [isActionProcessing, setIsActionProcessing] = useState<boolean>(false);

  const t = (hi: string, en: string) => (language === 'hi' ? hi : en);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(Boolean(token));
      },
      () => {
        setCurrentUser(auth.currentUser);
        setHasToken(Boolean(getAccessToken()));
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch drive files when opened and authenticated
  const loadDriveBackups = useCallback(async () => {
    if (!getAccessToken()) return;
    setIsFetchingBackups(true);
    try {
      const files = await listDriveBackups();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to load drive backups:', err);
    } finally {
      setIsFetchingBackups(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && hasToken) {
      loadDriveBackups();
    }
  }, [isOpen, hasToken, loadDriveBackups]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      setCurrentUser(res.user);
      setHasToken(true);
      triggerHapticSound('save');
      showToast(
        'success',
        t(
          `गूगल ड्राइव से सफलतापूर्वक कनेक्ट हो गया (${res.user.displayName || res.user.email})`,
          `Connected to Google Drive (${res.user.displayName || res.user.email})`
        )
      );
      loadDriveBackups();
    } catch (err: any) {
      triggerHapticSound('error');
      showToast(
        'error',
        err.message?.includes('popup-closed')
          ? t('लॉगिन विंडो बंद कर दी गई।', 'Sign in popup closed.')
          : t(`लॉगिन विफल: ${err.message || 'Error'}`, `Login failed: ${err.message || 'Error'}`)
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await googleSignOut();
      setCurrentUser(null);
      setHasToken(false);
      setDriveFiles([]);
      triggerHapticSound('click');
      showToast('info', t('गूगल खाता डिस्कनेक्ट कर दिया गया।', 'Google account disconnected.'));
    } catch (err: any) {
      showToast('error', err.message || 'Logout failed');
    }
  };

  // 1-Click Backup Handler
  const handleOneClickBackup = async () => {
    if (!hasToken) {
      showToast('error', t('कृपया पहले गूगल खाते से लॉगिन करें।', 'Please sign in with Google first.'));
      return;
    }

    setIsManualBackingUp(true);
    try {
      const result = await uploadBackupToDrive(currentData, BACKUP_FILE_NAME, false);
      triggerHapticSound('save');
      showToast(
        'success',
        t('1-क्लिक बैकअप गूगल ड्राइव पर सफलतापूर्वक सहेज लिया गया!', '1-Click Backup saved to Google Drive successfully!')
      );
      await loadDriveBackups();
    } catch (err: any) {
      triggerHapticSound('error');
      showToast(
        'error',
        t(`बैकअप असफल: ${err.message || 'त्रुटि'}`, `Backup failed: ${err.message || 'Error'}`)
      );
    } finally {
      setIsManualBackingUp(false);
    }
  };

  // Confirm and Execute Restore (MANDATORY User Confirmation)
  const handleExecuteRestore = async () => {
    if (!fileToRestore) return;
    setIsActionProcessing(true);
    try {
      const restored = await downloadBackupFromDrive(fileToRestore.id);
      if (restored && (Array.isArray(restored.entries) || restored.data?.entries)) {
        const payload = restored.entries ? restored : restored.data;
        onRestoreData(payload);
        triggerHapticSound('save');
        showToast(
          'success',
          t(
            `गूगल ड्राइव से बैकअप सफलतापूर्वक रिस्टोर हो गया (${payload.entries?.length || 0} प्रविष्टियाँ)!`,
            `Backup restored from Google Drive (${payload.entries?.length || 0} entries)!`
          )
        );
        setFileToRestore(null);
      } else {
        throw new Error('Invalid Daily Khata Pro backup format');
      }
    } catch (err: any) {
      triggerHapticSound('error');
      showToast(
        'error',
        t(`रिस्टोर असफल: ${err.message || 'त्रुटि'}`, `Restore failed: ${err.message || 'Error'}`)
      );
    } finally {
      setIsActionProcessing(false);
    }
  };

  // Confirm and Execute Delete (MANDATORY User Confirmation)
  const handleExecuteDelete = async () => {
    if (!fileToDelete) return;
    setIsActionProcessing(true);
    try {
      await deleteBackupFromDrive(fileToDelete.id);
      triggerHapticSound('delete');
      showToast('success', t('फ़ाइल गूगल ड्राइव से हटा दी गई।', 'File removed from Google Drive.'));
      setFileToDelete(null);
      await loadDriveBackups();
    } catch (err: any) {
      triggerHapticSound('error');
      showToast('error', t(`हटाने में त्रुटि: ${err.message}`, `Failed to delete: ${err.message}`));
    } finally {
      setIsActionProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[16px] text-[var(--theme-text,#F8FAFC)]">
                  {t('गूगल ड्राइव बैकअप व ऑटो अपडेट', 'Google Drive 1-Click Backup & Auto-Sync')}
                </h3>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Cloud Safe
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                {t(
                  '1-क्लिक बैकअप लें और स्वचालित रूप से सभी डेटा को गूगल ड्राइव पर सुरक्षित रखें',
                  'One-click instant backup and automatic cloud syncing to your personal Google Drive'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedback && (
          <div
            className={`px-4 py-2.5 text-[12.5px] font-bold flex items-center gap-2 border-b animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : feedback.type === 'error'
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="flex-1">{feedback.message}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-[13px] flex-1">
          {/* 1. GOOGLE ACCOUNT CONNECTION CARD */}
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                {t('गूगल खाता स्थिति (Account Connection)', 'Google Account Connection')}
              </span>
              {currentUser && hasToken ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t('कनेक्टेड (Connected)', 'Connected')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {t('कनेक्ट नहीं है', 'Not Connected')}
                </span>
              )}
            </div>

            {currentUser && hasToken ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]">
                <div className="flex items-center gap-3 min-w-0">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Google User"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border border-[var(--theme-border,#213E61)] object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] font-bold flex items-center justify-center border border-[var(--theme-primary,#38BDF8)]/30 shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'G'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)] truncate">
                      {currentUser.displayName || t('गूगल उपयोगकर्ता', 'Google User')}
                    </div>
                    <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  title="Disconnect"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('लॉगआउट', 'Sign Out')}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {t(
                    'अपने गूगल खाते से एक बार लॉगिन करें। यह सिर्फ आपके डेली खाता प्रो बैकअप फ़ाइलों को आपके व्यक्तिगत गूगल ड्राइव पर सुरक्षित रूप से सहेजता है।',
                    'Sign in once with your Google Account. Daily Khata Pro will safely save and sync your backup files directly to your personal Google Drive.'
                  )}
                </p>

                {/* Standard Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-[13px] border border-gray-300 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>
                    {isLoggingIn
                      ? t('गूगल से कनेक्ट किया जा रहा है...', 'Connecting to Google...')
                      : t('गूगल खाते से साइन इन करें (Sign in with Google)', 'Sign in with Google')}
                  </span>
                </button>
              </div>
            )}

            {/* Privacy & Safe Scopes Note */}
            <div className="flex items-center gap-2 text-[11px] text-[var(--theme-text-dim,#94A3B8)] pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {t(
                  'सुरक्षित एक्सेस: केवल इस ऐप द्वारा बनाए गए बैकअप को एक्सेस करता है। आपकी निजी फ़ाइलें या फ़ोटो कभी नहीं छुई जातीं।',
                  'Zero privacy invasion: restricted strictly to "drive.file" scope (can only touch files created by Daily Khata Pro).'
                )}
              </span>
            </div>
          </div>

          {/* 2. ONE-CLICK BACKUP & AUTO-UPDATE ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* ONE-CLICK BACKUP NOW */}
            <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] mb-1">
                  <CloudUpload className="w-4 h-4" />
                  <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                    {t('1-क्लिक गूगल ड्राइव बैकअप', '1-Click Drive Backup')}
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                  {t(
                    'वर्तमान सभी लेनदेन, लक्ष्य, नोट्स व सेटिंग्स तुरंत गूगल ड्राइव पर सहेजें।',
                    'Immediately upload full financial ledger, goals, notes, and preferences to Google Drive.'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOneClickBackup}
                disabled={!hasToken || isManualBackingUp}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50 shadow-md"
              >
                <CloudUpload className={`w-4 h-4 ${isManualBackingUp ? 'animate-bounce' : ''}`} />
                <span>
                  {isManualBackingUp
                    ? t('सहेजा जा रहा है...', 'Saving to Drive...')
                    : t('अभी बैकअप लें (1-Click)', 'Backup Now (1-Click)')}
                </span>
              </button>
            </div>

            {/* AUTOMATIC UPDATE / AUTO-SYNC */}
            <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                      {t('ऑटोमैटिक अपडेट (Auto-Sync)', 'Automatic Update')}
                    </span>
                  </div>
                  {/* Status indicator */}
                  {autoSyncEnabled && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isAutoSyncing ? 'animate-ping' : ''}`}></span>
                      {isAutoSyncing ? t('सिंक हो रहा है...', 'Syncing...') : t('सक्रिय', 'Active')}
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                  {t(
                    'हर नया लेनदेन जोड़ने या संपादित करने पर बैकअप अपने आप गूगल ड्राइव पर अपडेट हो जाता है।',
                    'Automatically updates cloud backup on Google Drive in background whenever records change.'
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                  {lastSyncTime ? `${t('अंतिम सिंक', 'Last Sync')}: ${lastSyncTime}` : t('सिंक नहीं हुआ', 'Not synced yet')}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (!hasToken) {
                      showToast('error', t('ऑटो-अपडेट ऑन करने के लिए पहले गूगल लॉगिन करें।', 'Please sign in with Google first.'));
                      return;
                    }
                    const next = !autoSyncEnabled;
                    onToggleAutoSync(next);
                    triggerHapticSound('click');
                    showToast(
                      next ? 'success' : 'info',
                      next
                        ? t('गूगल ड्राइव ऑटोमैटिक अपडेट ऑन हो गया!', 'Google Drive Auto-Sync enabled!')
                        : t('ऑटोमैटिक अपडेट बंद कर दिया गया।', 'Google Drive Auto-Sync disabled.')
                    );
                  }}
                  disabled={!hasToken}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    autoSyncEnabled
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                  } disabled:opacity-40`}
                >
                  <RotateCw className={`w-3 h-3 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                  <span>{autoSyncEnabled ? t('चालू (ON)', 'ON') : t('बंद (OFF)', 'OFF')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. GOOGLE DRIVE BACKUPS LIST & RESTORE */}
          <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-bold text-[13.5px] text-[var(--theme-text,#F8FAFC)]">
                <Database className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{t('गूगल ड्राइव पर उपलब्ध बैकअप फ़ाइलें', 'Backups on Your Google Drive')}</span>
                {driveFiles.length > 0 && (
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)]">
                    {driveFiles.length}
                  </span>
                )}
              </div>

              {hasToken && (
                <button
                  type="button"
                  onClick={loadDriveBackups}
                  disabled={isFetchingBackups}
                  className="text-[11.5px] text-[var(--theme-primary,#38BDF8)] font-bold flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetchingBackups ? 'animate-spin' : ''}`} />
                  <span>{t('रिफ्रेश', 'Refresh')}</span>
                </button>
              )}
            </div>

            {hasToken ? (
              isFetchingBackups ? (
                <div className="py-6 text-center text-[var(--theme-text-dim,#94A3B8)] text-[12px] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--theme-primary,#38BDF8)]" />
                  <span>{t('गूगल ड्राइव चेक किया जा रहा है...', 'Checking Google Drive...')}</span>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="py-6 text-center text-[var(--theme-text-dim,#94A3B8)] text-[12px] space-y-1">
                  <p>{t('गूगल ड्राइव पर अभी कोई बैकअप नहीं मिला।', 'No Daily Khata Pro backup found on Drive yet.')}</p>
                  <p className="text-[11px]">
                    {t(
                      'ऊपर "अभी बैकअप लें (1-Click)" बटन पर क्लिक करके पहला बैकअप बनाएं।',
                      'Click "Backup Now (1-Click)" above to create your first cloud backup.'
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {driveFiles.map((file) => {
                    const modified = file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : '';
                    const isAuto = file.name.includes('auto-sync');

                    return (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3 hover:border-[var(--theme-primary,#38BDF8)]/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)] truncate">
                              {file.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isAuto
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              } shrink-0`}
                            >
                              {isAuto ? 'Auto-Sync' : '1-Click'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[var(--theme-text-dim,#94A3B8)] pt-0.5 truncate">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{modified}</span>
                            {file.description && (
                              <span className="truncate hidden sm:inline">• {file.description}</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Restore Button with safe confirmation */}
                          <button
                            type="button"
                            onClick={() => setFileToRestore(file)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Restore this backup"
                          >
                            <CloudDownload className="w-3.5 h-3.5" />
                            <span>{t('रिस्टोर', 'Restore')}</span>
                          </button>

                          {/* Open in Drive */}
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete from Drive with confirmation */}
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="py-5 text-center text-[var(--theme-text-dim,#94A3B8)] text-[12px]">
                {t(
                  'गूगल ड्राइव की बैकअप फ़ाइलें देखने और रिस्टोर करने के लिए कृपया ऊपर लॉगिन करें।',
                  'Sign in with Google above to view and restore cloud backups from your Drive.'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] text-[12px]">
          <span className="text-[var(--theme-text-dim,#94A3B8)]">
            {t('डेली खाता प्रो — क्लाउड सुरक्षा', 'Daily Khata Pro — Cloud Security')}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:bg-white/5 font-bold text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
          >
            {t('बंद करें', 'Close')}
          </button>
        </div>
      </div>

      {/* MANDATORY CONFIRMATION DIALOG: RESTORE BACKUP */}
      {fileToRestore && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-md p-5 space-y-4 text-left shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <CloudDownload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[15px] text-[var(--theme-text,#F8FAFC)]">
                  {t('बैकअप रिस्टोर की पुष्टि करें?', 'Confirm Backup Restore?')}
                </h4>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                  {fileToRestore.name}
                </p>
              </div>
            </div>

            <p className="text-[12.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
              {t(
                `क्या आप निश्चित हैं कि आप गूगल ड्राइव से "${fileToRestore.name}" को रिस्टोर करना चाहते हैं? इससे आपके वर्तमान लोकल रिकॉर्ड्स इस बैकअप से बदल जाएंगे।`,
                `Are you sure you want to restore "${fileToRestore.name}" from Google Drive? This will replace your current local transactions with this cloud backup.`
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToRestore(null)}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] font-bold text-[12px] cursor-pointer"
              >
                {t('रद्द करें', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[12px] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CloudDownload className={`w-4 h-4 ${isActionProcessing ? 'animate-bounce' : ''}`} />
                <span>
                  {isActionProcessing
                    ? t('रिस्टोर किया जा रहा है...', 'Restoring...')
                    : t('हाँ, रिस्टोर करें', 'Yes, Restore Now')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION DIALOG: DELETE FILE FROM DRIVE */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-md p-5 space-y-4 text-left shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[15px] text-[var(--theme-text,#F8FAFC)]">
                  {t('गूगल ड्राइव से फ़ाइल हटाएं?', 'Delete from Google Drive?')}
                </h4>
                <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                  {fileToDelete.name}
                </p>
              </div>
            </div>

            <p className="text-[12.5px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
              {t(
                `क्या आप निश्चित रूप से "${fileToDelete.name}" को अपने गूगल ड्राइव से स्थायी रूप से हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।`,
                `Are you sure you want to permanently delete "${fileToDelete.name}" from your Google Drive? This action cannot be undone.`
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] font-bold text-[12px] cursor-pointer"
              >
                {t('रद्द करें', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[12px] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trash2 className={`w-4 h-4 ${isActionProcessing ? 'animate-spin' : ''}`} />
                <span>
                  {isActionProcessing
                    ? t('हटाया जा रहा है...', 'Deleting...')
                    : t('हाँ, हटाएं', 'Yes, Delete')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
