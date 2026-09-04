import React, { useState, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

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
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        triggerHapticSound('click');
        if (perm === 'granted') {
          new Notification('Daily Khata Pro', {
            body: isHindi ? 'पुश नोटिफिकेशन सक्रिय हो गए हैं!' : 'Reminders & alerts enabled successfully!',
            icon: '/icon-192.png'
          });
        }
      } catch (err) {
        console.error('Notification permission error', err);
      }
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

  const handleSnooze = (r: AppReminder, days = 1) => {
    triggerHapticSound('click');
    const [y, m, d] = r.dueDate.split('-').map(Number);
    const date = new Date(y, m - 1, d + days);
    const newDueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    onSaveReminder(
      {
        ...r,
        dueDate: newDueDate,
        isCompleted: false
      },
      r.id
    );
  };

  const handleSubmitNewReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

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
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[var(--theme-card,#132438)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

          {/* Browser Permission Prompt */}
          {browserPermission !== 'granted' && (
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px]">
              <div className="flex items-center gap-2 text-[var(--theme-text,#F8FAFC)]">
                <Smartphone className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                <span>{isHindi ? 'ब्राउज़र पुश नोटिफिकेशन चालू करें' : 'Enable device/browser push notifications for instant alerts'}</span>
              </div>
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold text-[11px] shrink-0 cursor-pointer hover:opacity-95"
              >
                {isHindi ? 'चालू करें' : 'Enable'}
              </button>
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
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
                  <option value="khata">{isHindi ? 'खाता लॉग (Khata Ledger)' : 'Khata Ledger Check'}</option>
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
                <input
                  type="time"
                  value={formDueTime}
                  onChange={(e) => setFormDueTime(e.target.value)}
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
                className="px-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[#CBD5E1] text-[12px] font-bold border border-[var(--theme-border,#213E61)] cursor-pointer"
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
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#94A3B8] space-y-2">
              <Bell className="w-9 h-9 mx-auto text-[#64748B]" />
              <p className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)]">
                {activeTab === 'pending'
                  ? (isHindi ? 'कोई लंबित रिमाइंडर नहीं है!' : 'No pending reminders right now!')
                  : (isHindi ? 'कोई रिमाइंडर नहीं मिला' : 'No reminders found')}
              </p>
              <p className="text-[12px] text-[#94A3B8] max-w-sm mx-auto">
                {isHindi
                  ? 'ऊपर "+ नया रिमाइंडर" बटन दबाकर भुगतान या कार्य का अलार्म सेट करें।'
                  : 'Click "+ New Reminder" above to schedule bill reminders, daily ledger checks, or tasks.'}
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
                        <span className={`font-bold text-[13.5px] ${r.isCompleted ? 'line-through text-[#94A3B8]' : 'text-[var(--theme-text,#F8FAFC)]'}`}>
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
                  <div className="flex items-center gap-1 shrink-0">
                    {!r.isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleSnooze(r, 1)}
                        className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] text-[11px] font-bold cursor-pointer"
                        title="Snooze 1 Day"
                      >
                        +1 Day
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(r.id)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[var(--theme-surface,#0E1A29)] cursor-pointer"
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

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between text-[11.5px] text-[var(--theme-text-muted,#94A3B8)]">
          <span>{isHindi ? 'सभी अलर्ट्स आपके डिवाइस में सुरक्षित रहते हैं।' : 'All reminders and alerts are stored locally.'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] text-[#CBD5E1] font-bold border border-[var(--theme-border,#213E61)] cursor-pointer hover:text-white"
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
