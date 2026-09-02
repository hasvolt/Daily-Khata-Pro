import React, { useState, useMemo } from 'react';
import { TrashItem, TrashItemType, AppLanguage } from '../types';
import { formatCurrency, triggerHapticSound } from '../utils/khataCalculations';
import {
  X,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Search,
  CheckCircle2,
  FileText,
  Target,
  Briefcase,
  Calculator,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CalendarCheck,
  Bell
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  trashItems: TrashItem[];
  onRestoreItem: (item: TrashItem) => void;
  onPermanentlyDeleteItem: (id: string) => void;
  onEmptyTrash: () => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  trashItems,
  onRestoreItem,
  onPermanentlyDeleteItem,
  onEmptyTrash,
  language = 'en',
  privacyMask = false
}) => {
  const [activeTab, setActiveTab] = useState<'all' | TrashItemType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);
  const [permanentDeleteId, setPermanentDeleteId] = useState<string | null>(null);

  const isHindi = language === 'hi' || language === 'hinglish';

  const filteredItems = useMemo(() => {
    return trashItems
      .filter((item) => {
        if (activeTab !== 'all' && item.type !== activeTab) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.type.toLowerCase().includes(q) ||
          (item.amount !== undefined && String(item.amount).includes(q))
        );
      })
      .sort((a, b) => new Date(b.dateDeleted).getTime() - new Date(a.dateDeleted).getTime());
  }, [trashItems, activeTab, searchQuery]);

  if (!isOpen) return null;

  const counts: Record<string, number> = {
    all: trashItems.length,
    entry: trashItems.filter((i) => i.type === 'entry').length,
    goal: trashItems.filter((i) => i.type === 'goal').length,
    note: trashItems.filter((i) => i.type === 'note').length,
    attendance_log: trashItems.filter((i) => i.type === 'attendance_log').length,
    work_log: trashItems.filter((i) => i.type === 'work_log' || i.type === 'daily_log').length,
    reminder: trashItems.filter((i) => i.type === 'reminder').length,
    calc_history: trashItems.filter((i) => i.type === 'calc_history').length
  };

  const getItemIcon = (type: TrashItemType) => {
    switch (type) {
      case 'entry':
        return Layers;
      case 'goal':
        return Target;
      case 'note':
        return FileText;
      case 'attendance_log':
        return CalendarCheck;
      case 'reminder':
        return Bell;
      case 'work_log':
      case 'daily_log':
        return Briefcase;
      case 'calc_history':
        return Calculator;
      default:
        return Trash2;
    }
  };

  const getItemTypeBadge = (type: TrashItemType) => {
    switch (type) {
      case 'entry':
        return { label: isHindi ? 'लेन-देन (Entry)' : 'Transaction', color: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30' };
      case 'goal':
        return { label: isHindi ? 'बचत लक्ष्य (Goal)' : 'Savings Goal', color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' };
      case 'note':
        return { label: isHindi ? 'नोट (Note)' : 'Personal Note', color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' };
      case 'attendance_log':
        return { label: isHindi ? 'उपस्थिति (Attendance)' : 'Attendance Log', color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' };
      case 'reminder':
        return { label: isHindi ? 'रिमाइंडर (Alert)' : 'Reminder / Alert', color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' };
      case 'work_log':
        return { label: isHindi ? 'कार्य लॉग (Work)' : 'Work Log', color: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30' };
      case 'daily_log':
        return { label: isHindi ? 'दैनिक डायरी' : 'Daily Life Log', color: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/30' };
      case 'calc_history':
        return { label: isHindi ? 'कैलकुलेटर हिस्ट्री' : 'Calculation', color: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30' };
      default:
        return { label: 'Item', color: 'text-[#94A3B8] bg-[#94A3B8]/10 border-[#94A3B8]/30' };
    }
  };

  const formatDeletedDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'रीसायकल बिन / ट्रैश (Trash Bin)' : 'Recycle Bin & Trash'}
                </h2>
                <span className="text-[11px] font-mono font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded-full border border-[#EF4444]/30">
                  {trashItems.length}
                </span>
              </div>
              <p className="text-[12px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi
                  ? 'हटाए गए रिकॉर्ड्स यहां सुरक्षित हैं। आप कभी भी पुनर्स्थापित (Restore) कर सकते हैं।'
                  : 'Deleted transactions, notes, and items are safely stored here for easy recovery.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trashItems.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmEmptyOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 text-[12px] font-bold transition-all cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'कचरा खाली करें' : 'Empty Trash'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--theme-text-muted,#94A3B8)] hover:text-white hover:bg-[var(--theme-card,#132438)] border border-transparent hover:border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Filter Tabs */}
        <div className="p-3 sm:p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/50 space-y-2.5 shrink-0">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'हटाए गए रिकॉर्ड्स में खोजें...' : 'Search deleted entries, notes, goals...'}
              className="w-full bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[13px] pl-10 pr-4 py-2 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: isHindi ? 'सभी' : 'All Items', count: counts.all },
              { id: 'entry', label: isHindi ? 'लेन-देन' : 'Transactions', count: counts.entry },
              { id: 'goal', label: isHindi ? 'लक्ष्य' : 'Goals', count: counts.goal },
              { id: 'note', label: isHindi ? 'नोट्स' : 'Notes', count: counts.note },
              { id: 'attendance_log', label: isHindi ? 'उपस्थिति' : 'Attendance', count: counts.attendance_log },
              { id: 'reminder', label: isHindi ? 'अलर्ट' : 'Alerts', count: counts.reminder },
              { id: 'work_log', label: isHindi ? 'कार्य/लाइफ' : 'Work/Life', count: counts.work_log },
              { id: 'calc_history', label: isHindi ? 'कैलकुलेशन' : 'Calculations', count: counts.calc_history }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    triggerHapticSound('click');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[#041424] border-[var(--theme-primary,#38BDF8)] shadow-sm'
                      : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border-[var(--theme-border,#213E61)] hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      active ? 'bg-black/20 text-[#041424]' : 'bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List of Trash Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-14 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center mx-auto text-[#94A3B8]">
                <Trash2 className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {trashItems.length === 0
                  ? isHindi
                    ? 'रीसायकल बिन बिल्कुल खाली है'
                    : 'Trash bin is completely empty'
                  : isHindi
                  ? 'इस फ़िल्टर में कोई हटाया गया रिकॉर्ड नहीं मिला'
                  : 'No deleted items found matching this filter'}
              </p>
              <p className="text-[12.5px] text-[var(--theme-text-muted,#94A3B8)] max-w-sm mx-auto">
                {isHindi
                  ? 'जब भी आप कोई लेन-देन, नोट या लक्ष्य डिलीट करते हैं, वह यहां आता है ताकि कोई ज़रूरी जानकारी खो न जाए।'
                  : 'Whenever you delete an entry, note, goal or log, it appears here with a 1-click restore option.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = getItemIcon(item.type);
              const badge = getItemTypeBadge(item.type);

              return (
                <div
                  key={item.id}
                  className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#64748B]" />
                          {formatDeletedDate(item.dateDeleted)}
                        </span>
                      </div>

                      <div className="text-[13.5px] sm:text-[14.5px] font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                        {item.title}
                      </div>

                      {item.subtitle && (
                        <div className="text-[11.5px] text-[#94A3B8] truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount (if any) and Actions */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {item.amount !== undefined && (
                      <div className="text-right font-mono font-bold text-[13px] sm:text-[15px] text-[var(--theme-primary,#38BDF8)]">
                        {formatCurrency(item.amount, privacyMask)}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--theme-border,#213E61)]">
                      {/* Restore Button */}
                      <button
                        type="button"
                        onClick={() => {
                          triggerHapticSound('save');
                          onRestoreItem(item);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 text-[11.5px] font-bold transition-all cursor-pointer active:scale-95"
                        title={isHindi ? 'पुनर्स्थापित करें' : 'Restore back to active list'}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isHindi ? 'पुनर्स्थापित' : 'Restore'}</span>
                      </button>

                      {/* Permanent Delete Button */}
                      <button
                        type="button"
                        onClick={() => setPermanentDeleteId(item.id)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 border border-transparent hover:border-[#EF4444]/30 transition-all cursor-pointer"
                        title={isHindi ? 'हमेशा के लिए हटाएं' : 'Permanently Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between text-xs text-[#94A3B8] shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>
              {isHindi
                ? 'हटाया गया कोई भी डेटा सुरक्षित रूप से रीसायकल बिन में रहता है।'
                : '100% Zero Data Loss Architecture · Restore anytime.'}
            </span>
          </div>

          {trashItems.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmEmptyOpen(true)}
              className="sm:hidden flex items-center gap-1 text-[#EF4444] font-bold text-[11.5px] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isHindi ? 'खाली करें' : 'Empty All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Empty Trash */}
      <ConfirmModal
        isOpen={confirmEmptyOpen}
        onClose={() => setConfirmEmptyOpen(false)}
        onConfirm={() => {
          triggerHapticSound('delete');
          onEmptyTrash();
          setConfirmEmptyOpen(false);
        }}
        title={isHindi ? 'क्या आप पूरा रीसायकल बिन खाली करना चाहते हैं?' : 'Empty entire Recycle Bin?'}
        message={
          isHindi
            ? `रीसायकल बिन के सभी ${trashItems.length} रिकॉर्ड हमेशा के लिए हटा दिए जाएंगे। यह क्रिया वापस नहीं ली जा सकेगी।`
            : `All ${trashItems.length} items currently in the trash will be permanently deleted. This action cannot be reversed.`
        }
        confirmText={isHindi ? 'हाँ, खाली करें (Permanent Delete)' : 'Yes, Delete Permanently'}
        type="danger"
      />

      {/* Confirmation Modal for Single Permanent Delete */}
      <ConfirmModal
        isOpen={permanentDeleteId !== null}
        onClose={() => setPermanentDeleteId(null)}
        onConfirm={() => {
          if (permanentDeleteId) {
            triggerHapticSound('delete');
            onPermanentlyDeleteItem(permanentDeleteId);
            setPermanentDeleteId(null);
          }
        }}
        title={isHindi ? 'क्या आप इसे हमेशा के लिए हटाना चाहते हैं?' : 'Permanently delete this item?'}
        message={
          isHindi
            ? 'यह रिकॉर्ड हमेशा के लिए हटा दिया जाएगा और इसे दोबारा रीसायकल बिन से रीस्टोर नहीं किया जा सकेगा।'
            : 'This specific record will be permanently purged and cannot be recovered again.'
        }
        confirmText={isHindi ? 'हमेशा के लिए हटाएं' : 'Delete Permanently'}
        type="danger"
      />
    </div>
  );
};
