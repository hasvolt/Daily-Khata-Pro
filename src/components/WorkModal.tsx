import React, { useState, useEffect } from 'react';
import { WorkLog, WorkStatus, AppLanguage } from '../types';
import { DEFAULT_WORK_CATEGORIES } from '../data/defaults';
import { getWorkCategoryIcon } from '../utils/iconMap';
import { triggerHapticSound } from '../utils/khataCalculations';
import {
  X,
  Briefcase,
  Calendar,
  Building,
  Clock,
  IndianRupee,
  CheckCircle2,
  Check,
  Plus,
  Tag,
  AlignLeft,
  Trash2
} from 'lucide-react';

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: Omit<WorkLog, 'id' | 'createdAt'>, id?: string) => void;
  initialLog?: WorkLog | null;
  workCategories?: string[];
  onAddWorkCategory?: (category: string) => void;
  language?: AppLanguage;
}

export const WorkModal: React.FC<WorkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLog,
  workCategories = DEFAULT_WORK_CATEGORIES,
  onAddWorkCategory,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  const [title, setTitle] = useState('');
  const [clientOrCompany, setClientOrCompany] = useState('');
  const [category, setCategory] = useState(workCategories[0] || 'Client Project');
  const [status, setStatus] = useState<WorkStatus>('completed');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hoursSpent, setHoursSpent] = useState<string>('');
  const [earningsOrCost, setEarningsOrCost] = useState<string>('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [error, setError] = useState('');

  // Inline custom category state
  const [isAddingCustomCat, setIsAddingCustomCat] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  useEffect(() => {
    if (initialLog) {
      setTitle(initialLog.title);
      setClientOrCompany(initialLog.clientOrCompany || '');
      setCategory(initialLog.category || workCategories[0]);
      setStatus(initialLog.status || 'completed');
      setDate(initialLog.date || new Date().toISOString().slice(0, 10));
      setHoursSpent(initialLog.hoursSpent ? String(initialLog.hoursSpent) : '');
      setEarningsOrCost(initialLog.earningsOrCost ? String(initialLog.earningsOrCost) : '');
      setLocation(initialLog.location || '');
      setNotes(initialLog.notes || '');
      setDeliverables(initialLog.deliverables || []);
    } else {
      setTitle('');
      setClientOrCompany('');
      setCategory(workCategories[0] || 'Client Project');
      setStatus('completed');
      setDate(new Date().toISOString().slice(0, 10));
      setHoursSpent('');
      setEarningsOrCost('');
      setLocation('');
      setNotes('');
      setDeliverables([]);
    }
    setError('');
  }, [initialLog, isOpen, workCategories]);

  if (!isOpen) return null;

  const handleAddDeliverable = () => {
    const trimmed = newDeliverable.trim();
    if (trimmed && !deliverables.includes(trimmed)) {
      setDeliverables([...deliverables, trimmed]);
      setNewDeliverable('');
      triggerHapticSound('click');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
    triggerHapticSound('click');
  };

  const handleCreateCustomCategory = () => {
    const trimmed = customCatInput.trim();
    if (!trimmed) return;
    if (onAddWorkCategory) {
      onAddWorkCategory(trimmed);
    }
    setCategory(trimmed);
    setCustomCatInput('');
    setIsAddingCustomCat(false);
    triggerHapticSound('save');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(isHindi ? 'कार्य का शीर्षक दर्ज करना आवश्यक है' : 'Work title is required');
      triggerHapticSound('error');
      return;
    }

    const logData: Omit<WorkLog, 'id' | 'createdAt'> = {
      title: title.trim(),
      clientOrCompany: clientOrCompany.trim() || undefined,
      category,
      status,
      date,
      hoursSpent: hoursSpent ? parseFloat(hoursSpent) : undefined,
      earningsOrCost: earningsOrCost ? parseFloat(earningsOrCost) : undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      deliverables: deliverables.length > 0 ? deliverables : undefined
    };

    triggerHapticSound('save');
    onSave(logData, initialLog?.id);
    onClose();
  };

  const statusOptions: { id: WorkStatus; labelEn: string; labelHi: string }[] = [
    { id: 'completed', labelEn: 'Completed', labelHi: 'पूर्ण (Completed)' },
    { id: 'in_progress', labelEn: 'In Progress', labelHi: 'प्रगति पर (In Progress)' },
    { id: 'pending', labelEn: 'Pending', labelHi: 'लंबित (Pending)' },
    { id: 'on_hold', labelEn: 'On Hold', labelHi: 'रोका गया (On Hold)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#F8FAFC]">
                {initialLog
                  ? isHindi
                    ? 'कार्य प्रविष्टि संपादित करें'
                    : 'Edit Work Deliverable'
                  : isHindi
                  ? 'नया कार्य रिकॉर्ड जोड़ें'
                  : 'Log Work Deliverable'}
              </h3>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi
                  ? 'व्यावसायिक परियोजनाओं, कार्यों और डिलीवरेबल्स का रिकॉर्ड'
                  : 'Record client projects, billable tasks and milestones'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[13px] flex-1">
          {/* Work Title */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8]">
              {isHindi ? 'कार्य का शीर्षक / विवरण' : 'Work Title / Project Deliverable'}{' '}
              <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              placeholder={isHindi ? 'उदा. क्लाइंट प्रेजेंटेशन, वेबसाइट ऑडिट, सिस्टम रिपेयर...' : 'e.g. Client Presentation, UI Redesign, System Audit...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              autoFocus
            />
          </div>

          {/* Client / Organization & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{isHindi ? 'ग्राहक / कंपनी नाम' : 'Client / Company / Entity'}</span>
              </label>
              <input
                type="text"
                placeholder={isHindi ? 'उदा. रमेश जी, टेक कॉर्प, दुकान संदर्भ' : 'e.g. Acme Corp, Client Name, Department'}
                value={clientOrCompany}
                onChange={(e) => setClientOrCompany(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{isHindi ? 'तारीख' : 'Date'}</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] font-mono focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>
          </div>

          {/* Category Selector with Custom Creation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'कार्य श्रेणी' : 'Work Category'}
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomCat(!isAddingCustomCat)}
                className="text-[11.5px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? '+ कस्टम श्रेणी जोड़ें' : '+ Custom Category'}</span>
              </button>
            </div>

            {isAddingCustomCat && (
              <div className="p-2.5 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/50 rounded-xl flex gap-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder={isHindi ? 'नई श्रेणी का नाम...' : 'New work category name...'}
                  value={customCatInput}
                  onChange={(e) => setCustomCatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCustomCategory())}
                  className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-lg px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateCustomCategory}
                  className="px-3 py-1.5 bg-[var(--theme-primary,#38BDF8)] text-[#040D17] rounded-lg text-[12px] font-bold cursor-pointer hover:brightness-110"
                >
                  {isHindi ? 'जोड़ें' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCat(false)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {workCategories.map((c) => {
                const CatIcon = getWorkCategoryIcon(c);
                const isSelected = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`py-2 px-2.5 rounded-xl border text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)] shadow-xs'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8]">
              {isHindi ? 'कार्य स्थिति' : 'Work Status'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    className={`py-2 px-2.5 rounded-xl border text-[11.5px] font-bold transition-all cursor-pointer truncate ${
                      isSelected
                        ? opt.id === 'completed'
                          ? 'bg-[#10B981] text-[#04140D] border-[#10B981]'
                          : opt.id === 'in_progress'
                          ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)]'
                          : 'bg-[#F59E0B] text-[#04140D] border-[#F59E0B]'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {isHindi ? opt.labelHi : opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billables & Time Spent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{isHindi ? 'बिल योग्य आय / राशि (₹)' : 'Earnings / Value (₹)'}</span>
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={earningsOrCost}
                onChange={(e) => setEarningsOrCost(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] font-mono focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>{isHindi ? 'समय (घंटे)' : 'Logged Hours'}</span>
              </label>
              <input
                type="number"
                step="0.25"
                placeholder="e.g. 3.5"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] font-mono focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>
          </div>

          {/* Deliverables / Checklist Tags */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{isHindi ? 'डिलीवरेबल्स / चेकलिस्ट' : 'Deliverables & Sub-items'}</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isHindi ? 'उदा. कोड डिप्लॉय किया, इनवॉइस भेजा...' : 'e.g. Deployed API, Sent Wireframes, Repaired wiring...'}
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] font-bold text-[12px] cursor-pointer hover:bg-[var(--theme-border,#213E61)]"
              >
                + Add
              </button>
            </div>

            {deliverables.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {deliverables.map((d, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] text-[#CBD5E1] text-[11.5px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                    <span>{d}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes & Description */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{isHindi ? 'अतिरिक्त नोट्स' : 'Additional Notes & Details'}</span>
            </label>
            <textarea
              rows={2}
              placeholder={isHindi ? 'कार्य का विवरण, सामग्री या ग्राहक फीडबैक...' : 'Details, client feedback, or special instructions...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          {error && <p className="text-[12.5px] font-bold text-[#EF4444]">{error}</p>}
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] text-[#94A3B8] hover:text-[#F8FAFC] font-bold text-[13px] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] hover:brightness-110 font-extrabold text-[13.5px] shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>{initialLog ? (isHindi ? 'अपडेट करें' : 'Update Log') : isHindi ? 'सहेजें' : 'Save Work Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
