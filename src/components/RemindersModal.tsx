import React, { useState, useMemo, useEffect } from 'react';
import { AppReminder, ReminderType, AppLanguage } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import {
  X,
  Bell,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  RotateCcw,
  Calendar,
  Layers,
  Sparkles,
  DollarSign,
  Briefcase,
  Check,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Volume2,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { NativeTimePicker } from './NativeTimePicker';
import { ConfirmModal } from './ConfirmModal';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
  scheduleLockScreenTest,
  snoozeReminder,
  isNotificationSupported
} from '../utils/reminderService';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: AppReminder[];
  onSaveReminder: (reminderData: Omit<AppReminder, 'id' | 'createdAt'>, editingId?: string) => void;
  onToggleCompleteReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  language?: AppLanguage;
  hasTransactionsToday?: boolean;
  hasAttendanceToday?: boolean;
  pendingPaymentCount?: number;
  onNavigateAdd?: () => void;
  onNavigateAttendance?: () => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  reminders = [],
  onSaveReminder,
  onToggleCompleteReminder,
  onDeleteReminder,
  language = 'en',
  hasTransactionsToday = true,
  hasAttendanceToday = true,
  pendingPaymentCount = 0,
  onNavigateAdd,
  onNavigateAttendance
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const todayStr = new Date().toISOString().slice(0, 10);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<ReminderType>('payment');
  const [formAmount, setFormAmount] = useState('');
  const [formDueDate, setFormDueDate] = useState(todayStr);
  const [formDueTime, setFormDueTime] = useState('10:00');
  const [formRepeat, setFormRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [formNotifyBrowser, setFormNotifyBrowser] = useState(true);

  // Browser notification permission state
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(getNotificationPermission);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [isTestingLockScreen, setIsTestingLockScreen] = useState(false);
  const [lockCountdown, setLockCountdown] = useState<number | null>(null);
  const [showLockScreenGuide, setShowLockScreenGuide] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBrowserPermission(getNotificationPermission());
    }
  }, [isOpen]);

  const requestBrowserPermission = async () => {
    triggerHapticSound('click');
    const perm = await requestNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      await sendTestNotification(isHindi);
    }
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    setTestResultMsg(null);
    const res = await sendTestNotification(isHindi);
    setIsTestingNotification(false);
    setBrowserPermission(getNotificationPermission());
    if (res.success) {
      setTestResultMsg(isHindi ? 'तुरंत नोटिफिकेशन टेस्ट भेजा गया! (डिवाइस पर अलर्ट चेक करें)' : 'Immediate notification test sent to your device!');
    } else {
      setTestResultMsg(res.error || (isHindi ? 'नोटिफिकेशन भेजने में समस्या आई' : 'Notification failed to deliver'));
    }
    setTimeout(() => setTestResultMsg(null), 6000);
  };

  const handleLockScreenTest = async () => {
    setIsTestingLockScreen(true);
    setTestResultMsg(null);
    setLockCountdown(10);
    const res = await scheduleLockScreenTest(10, isHindi);
    setBrowserPermission(getNotificationPermission());

    if (res.success) {
      triggerHapticSound('bell');
      let count = 10;
      const interval = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(interval);
          setLockCountdown(null);
          setIsTestingLockScreen(false);
          setTestResultMsg(
            isHindi
              ? '✅ 10 सेकंड पूरे हुए! यदि स्क्रीन लॉक थी तो अलर्ट आ चुका होगा।'
              : '✅ 10s elapsed! If your screen was locked, the alert should have appeared.'
          );
          setTimeout(() => setTestResultMsg(null), 8000);
        } else {
          setLockCountdown(count);
        }
      }, 1000);
    } else {
      setIsTestingLockScreen(false);
      setLockCountdown(null);
      setTestResultMsg(res.error || (isHindi ? 'टेस्ट शेड्यूल करने में समस्या आई' : 'Failed to schedule lock screen test'));
      setTimeout(() => setTestResultMsg(null), 6000);
    }
  };

  const filteredReminders = useMemo(() => {
    return reminders
      .filter((r) => {
        if (activeTab === 'pending') return !r.isCompleted;
        if (activeTab === 'completed') return r.isCompleted;
        return true;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [reminders, activeTab]);

  const pendingCount = useMemo(() => {
    return reminders.filter((r) => !r.isCompleted).length;
  }, [reminders]);

  const isOverdue = (dateStr: string) => {
    return dateStr < todayStr;
  };

  const isDueToday = (dateStr: string) => {
    return dateStr === todayStr;
  };

  const handleSnooze = (r: AppReminder, type: '1hour' | '1day' = '1day') => {
    triggerHapticSound('click');
    const snoozed = snoozeReminder(r, type);
    onSaveReminder(
      {
        ...snoozed
      },
      r.id
    );
  };

  const handleSubmitNewReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (formNotifyBrowser && browserPermission !== 'granted') {
      const perm = await requestNotificationPermission();
      setBrowserPermission(perm);
    }

    triggerHapticSound('save');
    onSaveReminder({
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      type: formType,
      amount: parseFloat(formAmount) || undefined,
      dueDate: formDueDate,
      dueTime: formDueTime || undefined,
      repeat: formRepeat,
      notifyViaBrowser: formNotifyBrowser,
      isCompleted: false
    });

    // Reset
    setFormTitle('');
    setFormDescription('');
    setFormAmount('');
    setFormDueDate(todayStr);
    setIsCreateOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'चेतावनी एवं रिमाइंडर (Alerts & Reminders)' : 'Smart Reminders & Alerts'}
                </h2>
                {pendingCount > 0 && (
                  <span className="text-[11px] font-mono font-bold text-white bg-[#EF4444] px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi
                  ? 'भुगतान, दैनिक खाता प्रविष्टि व उपस्थिति हेतु समय पर याद दिलाएं'
                  : 'Timely reminders for pending bills, daily khata check-in, and attendance.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--theme-text-dim,#94A3B8)] hover:text-white hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 flex flex-col">
          {/* Smart Live Warnings Banner */}
          <div className="p-4 bg-[var(--theme-surface,#0E1A29)]/70 border-b border-[var(--theme-border,#213E61)] space-y-2.5 shrink-0">
            {/* Daily Khata Entry Alert */}
          {!hasTransactionsToday && (
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[12.5px]">
              <div className="flex items-center gap-2 text-[#F59E0B] font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'आज का दैनिक खाता अभी तक दर्ज नहीं किया गया!' : 'No transaction recorded today yet!'}</span>
              </div>
              {onNavigateAdd && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateAdd();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#F59E0B] text-[#070E18] font-bold text-[11px] shrink-0 cursor-pointer"
                >
                  {isHindi ? '+ अभी दर्ज करें' : '+ Add Entry'}
                </button>
              )}
            </div>
          )}

          {/* Daily Attendance Alert */}
          {!hasAttendanceToday && (
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[12.5px]">
              <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'आज की उपस्थिति (Attendance) मार्क नहीं हुई!' : "Today's attendance not marked yet!"}</span>
              </div>
              {onNavigateAttendance && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateAttendance();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold text-[11px] shrink-0 cursor-pointer"
                >
                  {isHindi ? 'मार्क करें' : 'Mark Now'}
                </button>
              )}
            </div>
          )}

          {/* Browser / Device Permission & Test Notification Panel */}
          {browserPermission === 'granted' ? (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[12px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{isHindi ? 'पुश व साउंड नोटिफिकेशन सक्रिय हैं' : 'Device alerts & sound active'}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    disabled={isTestingNotification || isTestingLockScreen}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-[11px] shrink-0 cursor-pointer flex items-center gap-1.5 hover:bg-emerald-500/20 transition-all"
                    title={isHindi ? 'तुरंत साउंड और नोटिफिकेशन चेक करें' : 'Verify sound and notification alert right now'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isTestingNotification ? (isHindi ? 'जांच जारी...' : 'Testing...') : (isHindi ? '🔔 तुरंत टेस्ट' : '🔔 Instant Test')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLockScreenTest}
                    disabled={isTestingNotification || isTestingLockScreen}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:text-amber-100 border border-amber-500/40 font-bold text-[11px] shrink-0 cursor-pointer flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
                    title={isHindi ? '10 सेकंड बाद लॉक स्क्रीन पर नोटिफिकेशन चेक करें' : 'Test notification delivery with screen locked in 10s'}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isTestingLockScreen ? (isHindi ? `लॉकिंग (${lockCountdown}s)...` : `Testing (${lockCountdown}s)...`) : (isHindi ? '📲 10s लॉक स्क्रीन टेस्ट' : '📲 Lock Screen Test')}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Lock Screen Help */}
              <div className="pt-1 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => setShowLockScreenGuide((prev) => !prev)}
                  className="text-[11px] text-emerald-300/90 hover:text-emerald-200 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'फोन लॉक होने पर नोटिफिकेशन पाने के 3 जरूरी नियम' : '3 critical settings for Lock Screen notification delivery'}</span>
                  {showLockScreenGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showLockScreenGuide && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[11.5px] space-y-2 text-slate-300 animate-in fade-in">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      {isHindi ? 'स्क्रीन लॉक होने पर फोन द्वारा ऐप बंद करने से कैसे रोकें:' : 'How to prevent Android from sleeping the reminder alarm:'}
                    </p>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">
                      <li>
                        <strong className="text-white">{isHindi ? 'बैटरी ऑप्टिमाइजेशन बंद करें:' : 'Disable Battery Saver / Optimization:'}</strong>{' '}
                        {isHindi
                          ? 'Phone Settings → Apps → Chrome (या Daily Khata) → Battery → "Unrestricted" (अनरेस्ट्रिक्टेड / बंद न करें) चुनें।'
                          : 'Phone Settings → Apps → Chrome/Daily Khata → Battery → Select "Unrestricted".'}
                      </li>
                      <li>
                        <strong className="text-white">{isHindi ? 'लॉक स्क्रीन नोटिफिकेशन:' : 'Lock Screen Display:'}</strong>{' '}
                        {isHindi
                          ? 'Settings → Notifications → Lock Screen → "Show all notification content" चालू रखें।'
                          : 'Settings → Notifications → Lock Screen → Set to "Show all content".'}
                      </li>
                      <li>
                        <strong className="text-white">{isHindi ? 'ऐप इंस्टॉल करें (Add to Home Screen):' : 'Install PWA:'}</strong>{' '}
                        {isHindi
                          ? 'ब्राउज़र मेनू (⋮) से "Add to Home screen" या "Install App" करें, जिससे बैकग्राउंड अलार्म को हाई-प्रायोरिटी मिले।'
                          : 'Tap browser menu (⋮) → "Add to Home screen" / "Install App" for full OS background alarm priority.'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : browserPermission === 'denied' ? (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[12px] text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{isHindi ? 'ब्राउज़र में नोटिफिकेशन ब्लॉक हैं:' : 'Notifications blocked in browser:'} </span>
                <span>{isHindi ? 'साइट सेटिंग्स (URL बार के पास लॉक 🔒 आइकन) में जाकर Notifications को "Allow" करें।' : 'Tap the site settings or lock icon in URL bar and set Notifications to "Allow".'}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[12px]">
              <div className="flex items-center gap-2 text-amber-300 font-medium">
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isHindi ? 'समय पर अलर्ट व रिंग के लिए डिवाइस नोटिफिकेशन चालू करें' : 'Enable device notifications to receive timely alerts and sounds'}</span>
              </div>
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shrink-0 cursor-pointer self-start sm:self-auto shadow-xs active:scale-95 transition-all"
              >
                {isHindi ? 'अनुमति दें (Enable)' : 'Enable Alerts'}
              </button>
            </div>
          )}

          {/* Active Lock-Screen Test Countdown Banner */}
          {lockCountdown !== null && (
            <div className="p-3 rounded-xl bg-amber-500/20 border-2 border-amber-400/80 text-[12px] space-y-1.5 animate-pulse">
              <div className="flex items-center justify-between font-black text-amber-300">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? '📲 अभी फोन का पावर बटन दबाकर स्क्रीन लॉक करें!' : '📲 Lock Your Phone Screen Now!'}</span>
                </div>
                <span className="text-sm px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black font-mono">
                  {lockCountdown}s
                </span>
              </div>
              <p className="text-amber-100/90 text-[11.5px] leading-relaxed">
                {isHindi
                  ? 'पावर बटन दबाकर फोन लॉक कर दें। 10 सेकंड पूरे होते ही फोन वाइब्रेट और आवाज के साथ लॉक स्क्रीन पर अलर्ट भेजेगा।'
                  : 'Press power button to lock your device. When countdown finishes, it will ring and vibrate on the lock screen.'}
              </p>
            </div>
          )}

          {/* Test Alert Result Toast inside modal */}
          {testResultMsg && (
            <div className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/40 text-[12px] text-[var(--theme-primary,#38BDF8)] font-bold text-center animate-in fade-in duration-200">
              {testResultMsg}
            </div>
          )}
        </div>

        {/* Tabs & Add Button */}
        <div className="px-4 py-3 border-b border-[var(--theme-border,#213E61)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--theme-card,#132438)] shrink-0">
          <div className="flex w-full sm:w-auto rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-0.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending');
                triggerHapticSound('click');
              }}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              {isHindi ? 'लंबित' : 'Pending'} ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('completed');
                triggerHapticSound('click');
              }}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              {isHindi ? 'पूर्ण' : 'Completed'}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                triggerHapticSound('click');
              }}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              {isHindi ? 'सभी' : 'All'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="w-full sm:w-auto justify-center px-3 py-2 sm:py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] text-[12px] font-extrabold flex items-center gap-1.5 cursor-pointer hover:opacity-95 shadow-xs shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{isCreateOpen ? (isHindi ? 'बंद करें' : 'Close') : (isHindi ? 'नया रिमाइंडर' : 'New Reminder')}</span>
          </button>
        </div>

        {/* Create Reminder Form (Collapsible) */}
        {isCreateOpen && (
          <form onSubmit={handleSubmitNewReminder} className="p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'रिमाइंडर शीर्षक' : 'Reminder Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Pay Shop Rent, Collect Udhar, Mark Khata"
                  className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'प्रकार (Type)' : 'Category / Type'}
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as ReminderType)}
                  className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)]"
                >
                  <option value="payment">{isHindi ? 'भुगतान / बिल (Payment)' : 'Payment / Bill'}</option>
                  <option value="khata">{isHindi ? 'खाता लॉग (Khata Record)' : 'Khata Record Check'}</option>
                  <option value="attendance">{isHindi ? 'उपस्थिति (Attendance)' : 'Attendance'}</option>
                  <option value="custom">{isHindi ? 'कस्टम कार्य (Custom Task)' : 'Custom Task'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'देय दिनांक (Due Date)' : 'Due Date'} *
                </label>
                <input
                  type="date"
                  required
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)]"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'समय (Due Time)' : 'Due Time'}
                </label>
                <NativeTimePicker
                  value={formDueTime}
                  onChange={setFormDueTime}
                  className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)]"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                  {isHindi ? 'राशि (यदि लागू हो)' : 'Amount (Optional)'}
                </label>
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] px-3 py-2 rounded-xl border border-[var(--theme-border,#213E61)] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#CBD5E1)] text-[12px] font-bold border border-[var(--theme-border,#213E61)] cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] text-[12px] font-extrabold cursor-pointer hover:opacity-95 shadow-md"
              >
                {isHindi ? 'रिमाइंडर जोड़ें' : 'Save Reminder'}
              </button>
            </div>
          </form>
        )}

        {/* Reminders List */}
        <div className="p-4 space-y-3 pb-8">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 px-4 text-[var(--theme-text-dim,#94A3B8)] space-y-2">
              <Bell className="w-9 h-9 mx-auto text-[#64748B]" />
              <p className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)]">
                {activeTab === 'pending'
                  ? (isHindi ? 'कोई लंबित रिमाइंडर नहीं है!' : 'No pending reminders right now!')
                  : (isHindi ? 'कोई रिमाइंडर नहीं मिला' : 'No reminders found')}
              </p>
              <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)] max-w-sm mx-auto">
                {isHindi
                  ? 'ऊपर "+ नया रिमाइंडर" बटन दबाकर भुगतान या कार्य का अलार्म सेट करें।'
                  : 'Click "+ New Reminder" above to schedule bill reminders, daily record checks, or tasks.'}
              </p>
            </div>
          ) : (
            filteredReminders.map((r) => {
              const overdue = !r.isCompleted && isOverdue(r.dueDate);
              const dueToday = !r.isCompleted && isDueToday(r.dueDate);

              return (
                <div
                  key={r.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    r.isCompleted
                      ? 'bg-[var(--theme-card,#132438)]/40 border-[var(--theme-border,#213E61)]/40 opacity-70'
                      : overdue
                      ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                      : dueToday
                      ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30'
                      : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)]'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Completion Checkbox */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHapticSound('click');
                        onToggleCompleteReminder(r.id);
                      }}
                      className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center cursor-pointer transition-all ${
                        r.isCompleted
                          ? 'bg-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                          : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]'
                      }`}
                    >
                      {r.isCompleted && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-[13.5px] ${r.isCompleted ? 'line-through text-[var(--theme-text-dim,#94A3B8)]' : 'text-[var(--theme-text,#F8FAFC)]'}`}>
                          {r.title}
                        </span>

                        {overdue && (
                          <span className="text-[10px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded">
                            OVERDUE
                          </span>
                        )}

                        {dueToday && (
                          <span className="text-[10px] font-bold text-[#070E18] bg-[#F59E0B] px-1.5 py-0.5 rounded">
                            TODAY
                          </span>
                        )}

                        {r.amount ? (
                          <span className="text-[11.5px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] px-2 py-0.5 rounded">
                            {formatCurrency(r.amount)}
                          </span>
                        ) : null}
                        {r.repeat && r.repeat !== 'none' && (
                          <span className="text-[10px] font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.5 rounded capitalize">
                            🔄 {r.repeat}
                          </span>
                        )}

                        {r.notifyViaBrowser && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded" title={isHindi ? 'ब्राउज़र नोटिफिकेशन सक्षम' : 'Push Notification On'}>
                            🔔
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{r.dueDate}</span>
                        </div>

                        {r.dueTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{r.dueTime}</span>
                          </div>
                        )}

                        {r.description && (
                          <span>· {r.description}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Snooze & Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!r.isCompleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSnooze(r, '1hour')}
                          className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold cursor-pointer transition-all"
                          title={isHindi ? '1 घंटे बाद याद दिलाएं' : 'Snooze 1 Hour'}
                        >
                          +1 Hr
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSnooze(r, '1day')}
                          className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[11px] font-bold cursor-pointer transition-all"
                          title={isHindi ? 'कल याद दिलाएं' : 'Snooze 1 Day'}
                        >
                          +1 Day
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(r.id)}
                      className="p-1.5 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-[#EF4444] hover:bg-[var(--theme-surface,#0E1A29)] cursor-pointer transition-all"
                      title="Move to Trash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] shrink-0">
          <span>{isHindi ? 'सभी अलर्ट्स आपके डिवाइस में सुरक्षित रहते हैं।' : 'All reminders and alerts are stored locally.'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[var(--theme-text-muted,#CBD5E1)] font-bold border border-[var(--theme-border,#213E61)] cursor-pointer hover:text-white"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title={isHindi ? 'रिमाइंडर हटाएं?' : 'Delete Reminder?'}
        message={
          isHindi
            ? 'यह रिमाइंडर रीसायकल बिन (Trash) में भेज दिया जाएगा। आप इसे कभी भी पुनर्स्थापित कर सकते हैं।'
            : 'This reminder will be safely moved to Trash (Recycle Bin), where it can be restored anytime.'
        }
        confirmLabel={isHindi ? 'हटाएं (Move to Trash)' : 'Move to Trash'}
        cancelLabel={isHindi ? 'रद्द करें' : 'Cancel'}
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteReminder(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
