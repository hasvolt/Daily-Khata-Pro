import React, { useState, useMemo } from 'react';
import {
  PersonalNote,
  PersonalNoteCategory,
  NotePriority,
  NoteChecklistItem,
  AppLanguage
} from '../types';
import { DEFAULT_NOTE_CATEGORIES } from '../data/defaults';
import { triggerHapticSound } from '../utils/khataCalculations';
import { getNotesText, localizeCategory } from '../utils/localization';
import {
  getLocalDateString,
  getDaysAgoDateString,
  getNoteDisplayDateTime,
  formatTime12h
} from '../utils/dateUtils';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  Download,
  Share2,
  Tag,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  FolderLock,
  Flag,
  CheckSquare,
  Square,
  Maximize2,
  X,
  Printer,
  SlidersHorizontal,
  ArrowUpDown,
  Bell,
  HardDrive
} from 'lucide-react';
import { AdsterraBanner } from './AdUnits';

interface PersonalNotesViewProps {
  notes: PersonalNote[];
  onAddNote?: () => void;
  onOpenCreateModal?: () => void;
  onQuickAddNote?: (title: string, content: string) => void;
  onQuickAdd?: (title: string, content: string) => void;
  onEditNote: (note: PersonalNote) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleLock: (noteId: string) => void;
  onOpenSecurityModal?: () => void;
  onSaveNoteInline?: (note: PersonalNote) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
  onOpenMultiBackup?: () => void;
  onOneClickPdf?: () => void;
}

type DateFilterType = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';
type SortOption = 'date_desc' | 'date_asc' | 'updated_desc' | 'priority' | 'title_asc';

export const PersonalNotesView: React.FC<PersonalNotesViewProps> = ({
  notes = [],
  onAddNote,
  onOpenCreateModal,
  onQuickAddNote,
  onQuickAdd,
  onEditNote,
  onDeleteNote,
  onTogglePin,
  onToggleLock,
  onOpenSecurityModal,
  onSaveNoteInline,
  language = 'en',
  privacyMask = false,
  onOpenMultiBackup,
  onOneClickPdf
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';
  const handleOpenCreate = onOpenCreateModal || onAddNote || (() => {});
  const handleQuickAdd = onQuickAdd || onQuickAddNote;

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customFilterDate, setCustomFilterDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');

  // UI States
  const [revealedNoteIds, setRevealedNoteIds] = useState<Record<string, boolean>>({});
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [isQuickBoxExpanded, setIsQuickBoxExpanded] = useState(false);

  // Full Screen Reader Modal
  const [readingNote, setReadingNote] = useState<PersonalNote | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Unique Tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((n) => {
      n.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [notes]);

  // Statistics Summary
  const stats = useMemo(() => {
    const todayStr = getLocalDateString();
    let todayCount = 0;
    let pinnedCount = 0;
    let lockedCount = 0;
    let checklistCount = 0;

    notes.forEach((n) => {
      if (n.isPinned) pinnedCount++;
      if (n.isLocked) lockedCount++;
      if (n.checklist && n.checklist.length > 0) checklistCount++;

      const noteEffectiveDate = n.date || (n.createdAt ? getLocalDateString(new Date(n.createdAt)) : '');
      if (noteEffectiveDate === todayStr) todayCount++;
    });

    return {
      total: notes.length,
      today: todayCount,
      pinned: pinnedCount,
      locked: lockedCount,
      checklists: checklistCount
    };
  }, [notes]);

  // Filter and Sort Notes with Date & Time System
  const filteredNotes = useMemo(() => {
    const todayStr = getLocalDateString();
    const yesterdayStr = getDaysAgoDateString(1);

    // Calculate Week start (7 days ago) & Month start (YYYY-MM)
    const sevenDaysAgo = getDaysAgoDateString(7);
    const thisMonthPrefix = todayStr.slice(0, 7);

    return notes
      .filter((note) => {
        // Category filter
        if (activeCategory === 'pinned' && !note.isPinned) return false;
        if (activeCategory === 'secret' && !note.isLocked) return false;
        if (activeCategory !== 'all' && activeCategory !== 'pinned' && activeCategory !== 'secret') {
          if (note.category !== activeCategory) return false;
        }

        // Tag filter
        if (activeTag && (!note.tags || !note.tags.includes(activeTag))) {
          return false;
        }

        // Date filter
        const noteEffectiveDate = note.date || (note.createdAt ? getLocalDateString(new Date(note.createdAt)) : '');
        if (dateFilter === 'today' && noteEffectiveDate !== todayStr) return false;
        if (dateFilter === 'yesterday' && noteEffectiveDate !== yesterdayStr) return false;
        if (dateFilter === 'week' && noteEffectiveDate < sevenDaysAgo) return false;
        if (dateFilter === 'month' && !noteEffectiveDate.startsWith(thisMonthPrefix)) return false;
        if (dateFilter === 'custom' && customFilterDate && noteEffectiveDate !== customFilterDate) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(query);
          const matchContent = note.content.toLowerCase().includes(query);
          const matchTag = note.tags?.some((t) => t.toLowerCase().includes(query));
          const matchDate = noteEffectiveDate.includes(query);
          return matchTitle || matchContent || matchTag || matchDate;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned notes always stay on top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Effective date/time timestamps
        const getTimeStamp = (n: PersonalNote): number => {
          if (n.date) {
            const timePart = n.time || '12:00';
            const parsed = new Date(`${n.date}T${timePart}:00`).getTime();
            if (!isNaN(parsed)) return parsed;
          }
          return n.createdAt || 0;
        };

        if (sortBy === 'date_desc') {
          return getTimeStamp(b) - getTimeStamp(a);
        }
        if (sortBy === 'date_asc') {
          return getTimeStamp(a) - getTimeStamp(b);
        }
        if (sortBy === 'updated_desc') {
          return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
        }
        if (sortBy === 'priority') {
          const score = (p?: NotePriority) => (p === 'urgent' ? 3 : p === 'high' ? 2 : 1);
          const diff = score(b.priority) - score(a.priority);
          if (diff !== 0) return diff;
          return getTimeStamp(b) - getTimeStamp(a);
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }

        return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
      });
  }, [notes, activeCategory, activeTag, dateFilter, customFilterDate, searchQuery, sortBy]);

  const handleCopyNote = (note: PersonalNote) => {
    const dt = getNoteDisplayDateTime(note, isHindi);
    const textToCopy = `📌 ${note.title}\n📅 ${dt.formattedDate} • 🕒 ${dt.formattedTime}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    triggerHapticSound('click');
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleShareNote = (note: PersonalNote) => {
    const dt = getNoteDisplayDateTime(note, isHindi);
    const shareText = `📌 *${note.title}*\n📅 ${dt.formattedDate} • 🕒 ${dt.formattedTime}\n\n${note.content}\n\n— Daily Khata Pro`;

    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: shareText
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadNote = (note: PersonalNote) => {
    const dt = getNoteDisplayDateTime(note, isHindi);
    const content = `TITLE: ${note.title}\nDATE: ${dt.formattedDate}\nTIME: ${dt.formattedTime}\nCATEGORY: ${note.category}\nTAGS: ${note.tags?.join(', ') || 'None'}\n\n${'='.repeat(40)}\n\n${note.content}\n\n${note.checklist ? '\nCHECKLIST:\n' + note.checklist.map(c => `[${c.isDone ? 'X' : ' '}] ${c.text}`).join('\n') : ''}`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${dt.effectiveDate}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerHapticSound('save');
  };

  const toggleReveal = (noteId: string) => {
    setRevealedNoteIds((prev) => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const handleToggleChecklistFromCard = (note: PersonalNote, itemId: string) => {
    if (!note.checklist) return;
    const updatedChecklist = note.checklist.map((item) =>
      item.id === itemId ? { ...item, isDone: !item.isDone } : item
    );
    const updatedNote: PersonalNote = {
      ...note,
      checklist: updatedChecklist,
      updatedAt: Date.now()
    };
    if (onSaveNoteInline) {
      onSaveNoteInline(updatedNote);
    } else {
      onEditNote(updatedNote);
    }
    triggerHapticSound('click');
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() && !quickContent.trim()) return;

    if (handleQuickAdd) {
      handleQuickAdd(
        quickTitle.trim() || (isHindi ? 'त्वरित मेमो' : 'Quick Memo'),
        quickContent.trim()
      );
      setQuickTitle('');
      setQuickContent('');
      setIsQuickBoxExpanded(false);
      triggerHapticSound('save');
    }
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-[#064E3B]/25 border-[#10B981]/40 text-[#10B981]';
      case 'blue':
        return 'bg-[#0C4A6E]/25 border-[#38BDF8]/40 text-[#38BDF8]';
      case 'amber':
        return 'bg-[#78350F]/25 border-[#F59E0B]/40 text-[#F59E0B]';
      case 'purple':
        return 'bg-[#581C87]/25 border-[#A855F7]/40 text-[#A855F7]';
      case 'rose':
        return 'bg-[#881337]/25 border-[#FB7185]/40 text-[#FB7185]';
      case 'slate':
        return 'bg-[#0F172A] border-[#334155] text-[#94A3B8]';
      default:
        return 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)]';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* 1. Header & Primary Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-lg space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))] shadow-sm">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display font-extrabold text-[18px] sm:text-[22px] text-[var(--theme-text,#F8FAFC)] tracking-tight">
                  {getNotesText('title', language)}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[var(--theme-primary,#38BDF8)] text-[#070E18]">
                  {notes.length}
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12.5px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi
                  ? 'निजी विचार, गुप्त पासवर्ड, टू-डू व मेमो — 100% ऑफलाइन एवं सुरक्षित'
                  : 'Private ideas, credentials, checklists & daily logs — 100% Offline'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1-Click PDF Button */}
            {onOneClickPdf && (
              <button
                onClick={onOneClickPdf}
                className="py-2 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                title={isHindi ? '1-क्लिक सम्पूर्ण PDF डाउनलोड' : '1-Click Comprehensive PDF'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHindi ? '1-क्लिक PDF' : '1-Click PDF'}</span>
              </button>
            )}

            {/* Multi-Backup System Button */}
            {onOpenMultiBackup && (
              <button
                onClick={onOpenMultiBackup}
                className="py-2 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] hover:bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#10B981] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                title={isHindi ? 'मल्टीपल बैकअप व रीस्टोर' : 'Multi Backup & Restore'}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHindi ? 'बैकअप' : 'Backup'}</span>
              </button>
            )}

            {/* Create Note Button */}
            <button
              onClick={handleOpenCreate}
              className="py-2 sm:py-2.5 px-3.5 sm:px-4.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[12.5px] sm:text-[13px] shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{getNotesText('createNote', language)}</span>
            </button>
          </div>
        </div>

        {/* Statistics Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[var(--theme-border,#213E61)]/50 text-[11px] sm:text-[12px]">
          <div className="p-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between">
            <span className="text-[var(--theme-text-dim,#94A3B8)]">{isHindi ? 'कुल नोट्स' : 'Total Notes'}:</span>
            <span className="font-extrabold text-[var(--theme-text,#F8FAFC)]">{stats.total}</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between">
            <span className="text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'आज के नोट्स' : 'Today'}</span>:
            </span>
            <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">{stats.today}</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between">
            <span className="text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1">
              <Pin className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'पिन किए गए' : 'Pinned'}</span>:
            </span>
            <span className="font-extrabold text-[var(--theme-primary,#38BDF8)]">{stats.pinned}</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between">
            <span className="text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#10B981]" />
              <span>{isHindi ? 'सीक्रेट वॉल्ट' : 'Masked'}</span>:
            </span>
            <span className="font-extrabold text-[#10B981]">{stats.locked}</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between col-span-2 sm:col-span-1">
            <span className="text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-[#F59E0B]" />
              <span>{isHindi ? 'चेकलिस्ट्स' : 'Checklists'}</span>:
            </span>
            <span className="font-extrabold text-[#F59E0B]">{stats.checklists}</span>
          </div>
        </div>
      </div>

      {/* 2. Fast Quick-Add Memo Box with Date/Time Stamp */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-md">
        <form onSubmit={handleQuickSubmit} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onFocus={() => setIsQuickBoxExpanded(true)}
              placeholder={isHindi ? 'त्वरित मेमो लिखें (शीर्षक)...' : 'Write a quick memo (title)...'}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[13px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[12.5px] flex items-center gap-1 cursor-pointer shrink-0 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isHindi ? 'सहेजें' : 'Save'}</span>
            </button>
          </div>

          {isQuickBoxExpanded && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
              <textarea
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
                rows={2}
                placeholder={isHindi ? 'विस्तार से विवरण या जरूरी नोट्स लिखें...' : 'Add notes, items or details...'}
                className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[12.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
              <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'वर्तमान समय पर स्वतः टाइमस्टैम्प होगा' : 'Auto-timestamped with current date & time'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuickBoxExpanded(false)}
                  className="hover:underline text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] cursor-pointer"
                >
                  {isHindi ? 'छोटा करें' : 'Collapse'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 3. Advanced Search, Date-Time Filter & Category Navigation */}
      <div className="space-y-2.5">
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'नोट्स में खोजें (शीर्षक, विवरण, टैग्स या तारीख)...' : 'Search notes by title, content, tags, or date...'}
              className="w-full pl-9.5 pr-8 py-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[13px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[var(--theme-text,#F8FAFC)] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#64748B]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12px] font-bold focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] shadow-sm"
            >
              <option value="date_desc">{isHindi ? 'दिनांक: नया पहले' : 'Date: Newest First'}</option>
              <option value="date_asc">{isHindi ? 'दिनांक: पुराना पहले' : 'Date: Oldest First'}</option>
              <option value="updated_desc">{isHindi ? 'हाल ही में एडिट' : 'Recently Edited'}</option>
              <option value="priority">{isHindi ? 'प्राथमिकता अनुसार' : 'Priority (Urgent/High)'}</option>
              <option value="title_asc">{isHindi ? 'शीर्षक (A-Z)' : 'Title (A-Z)'}</option>
            </select>
          </div>
        </div>

        {/* Date Filter Timeline Toolbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px] sm:text-[12px]">
          <span className="text-[#64748B] font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
            <span>{isHindi ? 'तारीख' : 'Date'}:</span>
          </span>
          <button
            onClick={() => {
              setDateFilter('all');
              setCustomFilterDate('');
            }}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
              dateFilter === 'all'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            {isHindi ? 'सभी समय' : 'All Time'}
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
              dateFilter === 'today'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            {isHindi ? 'आज (Today)' : 'Today'}
          </button>
          <button
            onClick={() => setDateFilter('yesterday')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
              dateFilter === 'yesterday'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            {isHindi ? 'कल (Yesterday)' : 'Yesterday'}
          </button>
          <button
            onClick={() => setDateFilter('week')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
              dateFilter === 'week'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            {isHindi ? 'इस सप्ताह' : 'This Week'}
          </button>
          <button
            onClick={() => setDateFilter('month')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
              dateFilter === 'month'
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            {isHindi ? 'इस माह' : 'This Month'}
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="date"
              value={customFilterDate}
              onChange={(e) => {
                setCustomFilterDate(e.target.value);
                if (e.target.value) setDateFilter('custom');
              }}
              className="px-2 py-0.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[11px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveTag(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            {getNotesText('allNotes', language)} ({notes.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('pinned');
              setActiveTag(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
              activeCategory === 'pinned'
                ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{getNotesText('pinnedNotes', language)}</span> ({stats.pinned})
          </button>

          <button
            onClick={() => {
              setActiveCategory('secret');
              setActiveTag(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
              activeCategory === 'secret'
                ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{getNotesText('secretVault', language)}</span> ({stats.locked})
          </button>

          {DEFAULT_NOTE_CATEGORIES.map((cat) => {
            const count = notes.filter((n) => n.category === cat.id).length;
            if (count === 0 && activeCategory !== cat.id) return null;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveTag(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                    : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
              >
                {localizeCategory(cat.label, language)} ({count})
              </button>
            );
          })}
        </div>

        {/* Tag Filters (if any exist) */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
            <span className="text-[#64748B] font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
              <span>Tags:</span>
            </span>
            {allTags.map((tag) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(isSelected ? null : tag)}
                  className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)]'
                      : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-4 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] mx-auto flex items-center justify-center border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-[18px] font-bold text-[var(--theme-text,#F8FAFC)]">
              {getNotesText('emptyVault', language)}
            </h3>
            <p className="text-[13px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
              {getNotesText('emptyVaultDesc', language)}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="py-2.5 px-5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[13.5px] shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{getNotesText('createFirstNote', language)}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const isMasked = note.isLocked && !revealedNoteIds[note.id] && !privacyMask;
            const categoryObj = DEFAULT_NOTE_CATEGORIES.find((c) => c.id === note.category);
            const dt = getNoteDisplayDateTime(note, isHindi);

            const hasChecklist = note.checklist && note.checklist.length > 0;
            const completedItems = hasChecklist ? note.checklist!.filter((c) => c.isDone).length : 0;
            const totalItems = hasChecklist ? note.checklist!.length : 0;
            const checklistPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            return (
              <div
                key={note.id}
                className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-200 relative group shadow-md hover:shadow-lg ${getColorClasses(
                  note.color
                )}`}
              >
                {/* Card Top: Category, Date-Time, Pin & Actions */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#070E18]/60 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]">
                        {categoryObj ? localizeCategory(categoryObj.label, language) : note.category}
                      </span>

                      {/* Priority Tag */}
                      {note.priority === 'urgent' && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 flex items-center gap-0.5">
                          <Flag className="w-2.5 h-2.5" />
                          <span>{isHindi ? 'अति आवश्यक' : 'URGENT'}</span>
                        </span>
                      )}
                      {note.priority === 'high' && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 flex items-center gap-0.5">
                          <Flag className="w-2.5 h-2.5" />
                          <span>{isHindi ? 'महत्वपूर्ण' : 'HIGH'}</span>
                        </span>
                      )}

                      {/* Locked/Secret Tag */}
                      {note.isLocked && (
                        <span className="p-1 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30" title="Secret Vault Masked">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}

                      {/* Reminder Alarm Indicator */}
                      {note.reminderDateTime && (
                        <span className="p-1 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30" title="Reminder Alert">
                          <Bell className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Pin Toggle */}
                      <button
                        onClick={() => onTogglePin(note.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          note.isPinned
                            ? 'text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))]'
                            : 'text-[#64748B] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[#070E18]/50'
                        }`}
                        title={note.isPinned ? 'Unpin Note' : 'Pin to Top'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
                      </button>

                      {/* Maximize / Read */}
                      <button
                        onClick={() => setReadingNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[#070E18]/50 transition-colors cursor-pointer"
                        title={isHindi ? 'विस्तार से पढ़ें' : 'Full Screen View'}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => setReadingNote(note)}
                    className="font-serif-display font-bold text-[16px] sm:text-[17px] text-[var(--theme-text,#F8FAFC)] leading-snug tracking-tight cursor-pointer hover:text-[var(--theme-primary,#38BDF8)] transition-colors"
                  >
                    {note.title}
                  </h4>

                  {/* Body Content / Mask / Checklist */}
                  <div className="relative min-h-[50px] pt-0.5">
                    {isMasked ? (
                      <div
                        onClick={() => toggleReveal(note.id)}
                        className="p-3 rounded-xl bg-[#070E18]/80 border border-[#10B981]/30 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer hover:border-[#10B981] transition-all group/mask"
                      >
                        <div className="flex items-center gap-1.5 text-[#10B981] text-[12px] font-bold">
                          <Eye className="w-4 h-4" />
                          <span>{getNotesText('secretNoteClick', language)}</span>
                        </div>
                        <span className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                          {getNotesText('hiddenForPrivacy', language)}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Interactive Checklist Preview */}
                        {hasChecklist && (
                          <div className="space-y-1.5 p-2 rounded-xl bg-[#070E18]/50 border border-[var(--theme-border,#213E61)]/50">
                            <div className="flex items-center justify-between text-[10.5px] text-[var(--theme-text-dim,#94A3B8)]">
                              <span>Checklist: {completedItems}/{totalItems}</span>
                              <span className="font-bold text-[var(--theme-primary,#38BDF8)]">{checklistPct}%</span>
                            </div>
                            <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#10B981] h-full transition-all duration-300"
                                style={{ width: `${checklistPct}%` }}
                              />
                            </div>
                            <div className="space-y-1 pt-1 max-h-32 overflow-y-auto custom-scrollbar">
                              {note.checklist!.slice(0, 4).map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleChecklistFromCard(note, item.id);
                                  }}
                                  className="flex items-center gap-2 w-full text-left text-[12px] cursor-pointer hover:bg-[#070E18]/60 p-1 rounded-lg transition-colors"
                                >
                                  {item.isDone ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                                  )}
                                  <span className={item.isDone ? 'line-through text-[#64748B]' : 'text-[var(--theme-text,#F8FAFC)]'}>
                                    {item.text}
                                  </span>
                                </button>
                              ))}
                              {totalItems > 4 && (
                                <div className="text-[11px] text-[var(--theme-primary,#38BDF8)] font-semibold pt-0.5">
                                  +{totalItems - 4} {isHindi ? 'और आइटम्स...' : 'more items...'}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Text Content */}
                        {note.content && (
                          <div className="text-[13px] text-[var(--theme-text-muted,#CBD5E1)] whitespace-pre-wrap leading-relaxed break-words font-sans max-h-40 overflow-y-auto custom-scrollbar">
                            {note.content}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Tags, Exact Date & Time, Action Icons */}
                <div className="pt-3 mt-3 border-t border-[var(--theme-border,#213E61)]/50 space-y-2">
                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          onClick={() => setActiveTag(t)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#070E18]/70 text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] cursor-pointer transition-colors border border-[var(--theme-border,#213E61)]/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Date & Time Display + Card Actions */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    {/* ACCURATE DATE & TIME BADGE */}
                    <div className="flex flex-col text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                      <div className="flex items-center gap-1 font-medium text-[var(--theme-text,#F8FAFC)]">
                        <Calendar className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
                        <span>{dt.formattedDate}</span>
                        <span className="text-[#64748B]">•</span>
                        <Clock className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />
                        <span>{dt.formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] pt-0.5">
                        <span className="font-semibold text-[var(--theme-primary,#38BDF8)]">{dt.relativeBadge}</span>
                        {dt.isEdited && dt.editedTimeStr && (
                          <>
                            <span>•</span>
                            <span className="italic text-[#94A3B8]">{dt.editedTimeStr}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                        title={isHindi ? 'कॉपी करें' : 'Copy'}
                      >
                        {copiedNoteId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShareNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#10B981] transition-colors cursor-pointer"
                        title={isHindi ? 'शेयर करें (WhatsApp)' : 'Share Note'}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Download .txt */}
                      <button
                        onClick={() => handleDownloadNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
                        title="Download Note (.txt)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Note */}
                      <button
                        onClick={() => onEditNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[var(--theme-primary,#38BDF8)] transition-colors cursor-pointer"
                        title="Edit Note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Note */}
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. FULL SCREEN DISTRACTION-FREE NOTE READER MODAL */}
      {readingNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#070E18]/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setReadingNote(null)}
        >
          <div
            className="w-full max-w-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reader Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] text-[var(--theme-primary,#38BDF8)]">
                  <FileText className="w-4 h-4" />
                </span>
                <span className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                  {readingNote.category}
                </span>
                {readingNote.priority && readingNote.priority !== 'normal' && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${readingNote.priority === 'urgent' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                    {readingNote.priority.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Reader Controls: Font Size & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-lg p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${readerFontSize === 'sm' ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18]' : 'text-[var(--theme-text-dim,#94A3B8)]'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setReaderFontSize('base')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${readerFontSize === 'base' ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18]' : 'text-[var(--theme-text-dim,#94A3B8)]'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${readerFontSize === 'lg' ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18]' : 'text-[var(--theme-text-dim,#94A3B8)]'}`}
                  >
                    A+
                  </button>
                </div>

                <button
                  onClick={() => setReadingNote(null)}
                  className="p-1.5 text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              <div>
                <h3 className="font-serif-display font-extrabold text-[22px] sm:text-[26px] text-[var(--theme-text,#F8FAFC)] leading-snug tracking-tight">
                  {readingNote.title}
                </h3>
                {/* Full Date & Time Metadata */}
                {(() => {
                  const dt = getNoteDisplayDateTime(readingNote, isHindi);
                  return (
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
                      <div className="flex items-center gap-1 font-semibold text-[var(--theme-primary,#38BDF8)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dt.formattedDate}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 font-semibold text-[var(--theme-primary,#38BDF8)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{dt.formattedTime}</span>
                      </div>
                      <span>•</span>
                      <span className="text-[#64748B]">{dt.relativeBadge}</span>
                      {dt.isEdited && dt.editedTimeStr && (
                        <>
                          <span>•</span>
                          <span className="italic text-[#94A3B8]">{dt.editedTimeStr}</span>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Tags in Reader */}
              {readingNote.tags && readingNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {readingNote.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary-border,rgba(56,189,248,0.3))]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Checklist items in Reader */}
              {readingNote.checklist && readingNote.checklist.length > 0 && (
                <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                  <div className="font-bold text-[13px] text-[var(--theme-text,#F8FAFC)]">
                    {isHindi ? 'चेकलिस्ट टास्क' : 'Checklist Items'}
                  </div>
                  <div className="space-y-1.5">
                    {readingNote.checklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleChecklistFromCard(readingNote, item.id)}
                        className="flex items-center gap-2.5 w-full text-left text-[13.5px] cursor-pointer hover:bg-[#070E18]/60 p-1.5 rounded-xl transition-colors"
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
                    ))}
                  </div>
                </div>
              )}

              {/* Text Content */}
              {readingNote.content && (
                <div
                  className={`text-[var(--theme-text-muted,#CBD5E1)] whitespace-pre-wrap leading-relaxed break-words font-sans pt-2 border-t border-[var(--theme-border,#213E61)]/60 ${
                    readerFontSize === 'sm'
                      ? 'text-[13px]'
                      : readerFontSize === 'lg'
                      ? 'text-[17px]'
                      : 'text-[14.5px]'
                  }`}
                >
                  {readingNote.content}
                </div>
              )}
            </div>

            {/* Reader Footer Actions */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyNote(readingNote)}
                  className="py-1.5 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'कॉपी' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleShareNote(readingNote)}
                  className="py-1.5 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] hover:border-[#10B981] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleDownloadNote(readingNote)}
                  className="py-1.5 px-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = readingNote;
                    setReadingNote(null);
                    onEditNote(toEdit);
                  }}
                  className="py-1.5 px-3.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#070E18] text-[12px] font-extrabold flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'एडिट करें' : 'Edit Note'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sponsored Partner Medium Rectangle (300x250) */}
      <AdsterraBanner size="300x250" className="my-4" />
    </div>
  );
};
