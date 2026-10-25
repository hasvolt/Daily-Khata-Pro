import React, { useState, useEffect } from 'react';
import {
  PersonalNote,
  PersonalNoteCategory,
  PersonalNoteColor,
  NotePriority,
  NoteChecklistItem,
  AppLanguage
} from '../types';
import { DEFAULT_NOTE_CATEGORIES } from '../data/defaults';
import { triggerHapticSound } from '../utils/khataCalculations';
import {
  getLocalDateString,
  getCurrentTimeString,
  getDaysAgoDateString,
  formatTime12h
} from '../utils/dateUtils';
import {
  X,
  FileText,
  Pin,
  Lock,
  Tag,
  Palette,
  Check,
  AlertCircle,
  Plus,
  Calendar,
  Clock,
  Flag,
  CheckSquare,
  Square,
  Trash2,
  Bell,
  Sparkles
} from 'lucide-react';

interface PersonalNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  initialNote?: PersonalNote | null;
  language?: AppLanguage;
}

const COLOR_OPTIONS: { id: PersonalNoteColor; label: string; bgClass: string; borderClass: string; dotClass: string }[] = [
  { id: 'default', label: 'Classic Slate', bgClass: 'bg-[#132438]', borderClass: 'border-[#213E61]', dotClass: 'bg-[#64748B]' },
  { id: 'emerald', label: 'Emerald Mint', bgClass: 'bg-[#064E3B]/40', borderClass: 'border-[#10B981]/50', dotClass: 'bg-[#10B981]' },
  { id: 'blue', label: 'Electric Blue', bgClass: 'bg-[#0C4A6E]/40', borderClass: 'border-[#38BDF8]/50', dotClass: 'bg-[#38BDF8]' },
  { id: 'amber', label: 'Warm Amber', bgClass: 'bg-[#78350F]/40', borderClass: 'border-[#F59E0B]/50', dotClass: 'bg-[#F59E0B]' },
  { id: 'purple', label: 'Royal Violet', bgClass: 'bg-[#581C87]/40', borderClass: 'border-[#A855F7]/50', dotClass: 'bg-[#A855F7]' },
  { id: 'rose', label: 'Rose Gold', bgClass: 'bg-[#881337]/40', borderClass: 'border-[#FB7185]/50', dotClass: 'bg-[#FB7185]' },
  { id: 'slate', label: 'Midnight Onyx', bgClass: 'bg-[#0F172A]', borderClass: 'border-[#334155]', dotClass: 'bg-[#94A3B8]' }
];

export const PersonalNoteModal: React.FC<PersonalNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote,
  language = 'en'
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PersonalNoteCategory | string>('personal');
  const [color, setColor] = useState<PersonalNoteColor>('default');
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [error, setError] = useState('');

  // Date & Time System
  const [noteDate, setNoteDate] = useState<string>(getLocalDateString());
  const [noteTime, setNoteTime] = useState<string>(getCurrentTimeString());

  // Priority
  const [priority, setPriority] = useState<NotePriority>('normal');

  // Checklist mode
  const [isChecklistMode, setIsChecklistMode] = useState<boolean>(false);
  const [checklistItems, setChecklistItems] = useState<NoteChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState<string>('');

  // Reminder
  const [enableReminder, setEnableReminder] = useState<boolean>(false);
  const [reminderDateTime, setReminderDateTime] = useState<string>('');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setCategory(initialNote.category || 'personal');
      setColor(initialNote.color || 'default');
      setIsPinned(!!initialNote.isPinned);
      setIsLocked(!!initialNote.isLocked);
      setTags(initialNote.tags || []);
      setPriority(initialNote.priority || 'normal');

      // Date & Time
      const effectiveDate = initialNote.date || (initialNote.createdAt ? getLocalDateString(new Date(initialNote.createdAt)) : getLocalDateString());
      setNoteDate(effectiveDate);

      let effectiveTime = initialNote.time;
      if (!effectiveTime && initialNote.createdAt) {
        const d = new Date(initialNote.createdAt);
        effectiveTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }
      setNoteTime(effectiveTime || getCurrentTimeString());

      // Checklist
      if (initialNote.checklist && initialNote.checklist.length > 0) {
        setIsChecklistMode(true);
        setChecklistItems(initialNote.checklist);
      } else {
        setIsChecklistMode(false);
        setChecklistItems([]);
      }

      // Reminder
      if (initialNote.reminderDateTime) {
        setEnableReminder(true);
        setReminderDateTime(initialNote.reminderDateTime);
      } else {
        setEnableReminder(false);
        setReminderDateTime('');
      }
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
      setColor('default');
      setIsPinned(false);
      setIsLocked(false);
      setTags([]);
      setPriority('normal');
      setNoteDate(getLocalDateString());
      setNoteTime(getCurrentTimeString());
      setIsChecklistMode(false);
      setChecklistItems([]);
      setEnableReminder(false);
      setReminderDateTime('');
    }
    setNewTagInput('');
    setNewChecklistText('');
    setError('');
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Checklist handlers
  const handleAddChecklistItem = () => {
    const trimmed = newChecklistText.trim();
    if (!trimmed) return;
    const newItem: NoteChecklistItem = {
      id: 'chk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      text: trimmed,
      isDone: false
    };
    setChecklistItems([...checklistItems, newItem]);
    setNewChecklistText('');
    triggerHapticSound('click');
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
    triggerHapticSound('click');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim() && checklistItems.length === 0) {
      setError(isHindi ? 'कृपया नोट का शीर्षक, विवरण या चेकलिस्ट दर्ज करें।' : 'Please enter a title, content, or checklist items.');
      return;
    }

    triggerHapticSound('save');

    // Build final content string if checklist mode was used
    let finalContent = content.trim();
    if (isChecklistMode && checklistItems.length > 0 && !finalContent) {
      finalContent = checklistItems.map((item) => `[${item.isDone ? 'x' : ' '}] ${item.text}`).join('\n');
    }

    onSave(
      {
        title: title.trim() || (isHindi ? 'बिना शीर्षक का नोट' : 'Untitled Note'),
        content: finalContent,
        category,
        color,
        isPinned,
        isLocked,
        tags,
        date: noteDate || getLocalDateString(),
        time: noteTime || getCurrentTimeString(),
        priority,
        reminderDateTime: enableReminder && reminderDateTime ? reminderDateTime : undefined,
        checklist: isChecklistMode && checklistItems.length > 0 ? checklistItems : undefined
      },
      initialNote ? initialNote.id : undefined
    );
    onClose();
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const completedChecklistCount = checklistItems.filter((c) => c.isDone).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070E18]/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-[17px] sm:text-[19px] text-[var(--theme-text,#F8FAFC)]">
                {initialNote
                  ? isHindi ? 'नोट संपादित करें' : 'Edit Personal Note'
                  : isHindi ? 'नया पर्सनल नोट जोड़ें' : 'Create Personal Note'}
              </h3>
              <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi
                  ? '100% प्राइवेट एवं ऑफलाइन • कस्टम दिनांक व समय समर्थित'
                  : '100% Private & Offline • Exact Date & Time Supported'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] rounded-xl transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-left">
          {error && (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-[12.5px] flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Title Input */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? 'नोट का शीर्षक (Title)' : 'Note Title'} <span className="text-[var(--theme-primary,#38BDF8)]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder={isHindi ? 'उदा. जरूरी पासवर्ड, नया व्यापार विचार, मीटिंग मिनट्स...' : 'e.g. Passwords, Project idea, Meeting notes...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[14px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-colors"
              autoFocus
            />
          </div>

          {/* 2. DATE & TIME SYSTEM (Accurate, User-Configurable) */}
          <div className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                <span>{isHindi ? 'नोट दिनांक व समय (Date & Time)' : 'Note Date & Time'}</span>
              </label>
              <div className="text-[11.5px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime12h(noteTime)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Date Input with Quick Pills */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'तारीख चुनें (Date)' : 'Select Date'}
                </div>
                <input
                  type="date"
                  value={noteDate}
                  onChange={(e) => setNoteDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[13px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
                <div className="flex items-center gap-1 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setNoteDate(getLocalDateString())}
                    className="px-2 py-0.5 rounded-md bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  >
                    {isHindi ? 'आज' : 'Today'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteDate(getDaysAgoDateString(1))}
                    className="px-2 py-0.5 rounded-md bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  >
                    {isHindi ? 'कल' : 'Yesterday'}
                  </button>
                </div>
              </div>

              {/* Time Input with Quick Pills */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'समय चुनें (Time)' : 'Select Time'}
                </div>
                <input
                  type="time"
                  value={noteTime}
                  onChange={(e) => setNoteTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[13px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
                <div className="flex items-center gap-1 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setNoteTime(getCurrentTimeString())}
                    className="px-2 py-0.5 rounded-md bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  >
                    {isHindi ? 'अभी' : 'Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteTime('09:00')}
                    className="px-2 py-0.5 rounded-md bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  >
                    09:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteTime('14:00')}
                    className="px-2 py-0.5 rounded-md bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  >
                    02:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteTime('20:00')}
                    className="px-2 py-0.5 rounded-md bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                  >
                    08:00 PM
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#CBD5E1)]">
                {isHindi ? 'श्रेणी (Category)' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[13px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              >
                {DEFAULT_NOTE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isHindi ? cat.hindiLabel : cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#CBD5E1)] flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{isHindi ? 'प्राथमिकता (Priority)' : 'Priority'}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['normal', 'high', 'urgent'] as NotePriority[]).map((p) => {
                  const isSel = priority === p;
                  const label =
                    p === 'normal'
                      ? isHindi ? 'सामान्य' : 'Normal'
                      : p === 'high'
                      ? isHindi ? 'महत्वपूर्ण' : 'High'
                      : isHindi ? 'अति आवश्यक' : 'Urgent';
                  const activeColor =
                    p === 'urgent'
                      ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                      : p === 'high'
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                      : 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]';

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                        isSel
                          ? activeColor
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Color Card Theme Selector */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#CBD5E1)] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'कार्ड का रंग (Theme Tint)' : 'Note Color Tint'}</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] ring-1 ring-[var(--theme-primary,#38BDF8)]'
                        : 'border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dotClass} shrink-0`} />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Checklist Mode Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'चेकलिस्ट / टू-डू मोड (Checklist Mode)' : 'Checklist / To-Do Mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsChecklistMode(!isChecklistMode)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all border cursor-pointer ${
                isChecklistMode
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                  : 'bg-[var(--theme-bg,#070E18)] text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)]'
              }`}
            >
              {isChecklistMode ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Checklist Manager (if enabled) */}
          {isChecklistMode && (
            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
              <div className="flex items-center justify-between text-[11.5px] text-[var(--theme-text-dim,#94A3B8)]">
                <span>{isHindi ? 'आइटम जोड़ें और टिक करें' : 'Add items to track tasks'}</span>
                {checklistItems.length > 0 && (
                  <span className="font-bold text-[var(--theme-primary,#38BDF8)]">
                    {completedChecklistCount}/{checklistItems.length} {isHindi ? 'पूरे हुए' : 'completed'}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  placeholder={isHindi ? 'नया टास्क या आइटम लिखें...' : 'Type a task or item...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[12.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="px-3 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#070E18] text-[12px] font-extrabold flex items-center gap-1 cursor-pointer hover:brightness-110 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isHindi ? 'जोड़ें' : 'Add'}</span>
                </button>
              </div>

              {checklistItems.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pt-1">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12.5px]"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleChecklistItem(item.id)}
                        className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                      >
                        {item.isDone ? (
                          <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[#64748B] shrink-0" />
                        )}
                        <span className={item.isDone ? 'line-through text-[#64748B]' : 'text-[var(--theme-text,#F8FAFC)]'}>
                          {item.text}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="p-1 text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. Content Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'नोट का विवरण (Content / Details)' : 'Note Content'}
              </label>
              <div className="text-[11px] text-[#64748B] font-mono">
                {wordCount} {isHindi ? 'शब्द' : 'words'} • {charCount} {isHindi ? 'अक्षर' : 'chars'}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              rows={5}
              placeholder={
                isHindi
                  ? 'यहाँ अपनी निजी बातें, विचार, निर्देश या मेमो विस्तार से लिखें...'
                  : 'Write your private thoughts, instructions, or reflections here...'
              }
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[13.5px] leading-relaxed focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-colors resize-y custom-scrollbar font-sans"
            />
          </div>

          {/* 7. Optional Reminder Alarm */}
          <div className="p-3 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{isHindi ? 'रिमाइंडर सेट करें (Set Target Reminder)' : 'Set Reminder Alarm'}</span>
              </label>
              <button
                type="button"
                onClick={() => setEnableReminder(!enableReminder)}
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border transition-colors cursor-pointer ${
                  enableReminder
                    ? 'bg-[#F59E0B] text-[#070E18] border-[#F59E0B]'
                    : 'bg-[var(--theme-card,#132438)] text-[#64748B] border-[var(--theme-border,#213E61)]'
                }`}
              >
                {enableReminder ? 'ON' : 'OFF'}
              </button>
            </div>
            {enableReminder && (
              <input
                type="datetime-local"
                value={reminderDateTime}
                onChange={(e) => setReminderDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
            )}
          </div>

          {/* 8. Toggles: Pin to Top & Mask/Lock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isPinned
                  ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                  : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                <span className="text-[12.5px] font-bold">
                  {isHindi ? 'पिन करें (Pin to Top)' : 'Pin to Top'}
                </span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isPinned ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18]' : 'bg-[#1E293B] text-[#64748B]'}`}>
                {isPinned ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsLocked(!isLocked)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isLocked
                  ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                  : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="text-[12.5px] font-bold">
                  {isHindi ? 'सीक्रेट मास्क (Mask Content)' : 'Mask / Private View'}
                </span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isLocked ? 'bg-[#10B981] text-[#04140D]' : 'bg-[#1E293B] text-[#64748B]'}`}>
                {isLocked ? 'MASKED' : 'OFF'}
              </span>
            </button>
          </div>

          {/* 9. Tags Section */}
          <div className="space-y-2 pt-1 border-t border-[var(--theme-border,#213E61)]/60">
            <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#CBD5E1)] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'टैग्स (Tags)' : 'Tags / Labels'}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={isHindi ? 'टैग लिखें और जोड़ें (उदा. Personal, Ideas)...' : 'Add custom tag (e.g. Travel, Passwords)...'}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[12.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[12.5px] font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? 'जोड़ें' : 'Add'}</span>
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] text-[11.5px] font-medium border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-[#EF4444] transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[var(--theme-border,#213E61)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] font-bold text-[13px] transition-all cursor-pointer text-center"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[13.5px] transition-all cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{initialNote ? (isHindi ? 'अपडेट करें' : 'Update Note') : (isHindi ? 'नोट सहेजें' : 'Save Note')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
