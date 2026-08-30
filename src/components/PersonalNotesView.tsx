import React, { useState, useMemo } from 'react';
import { PersonalNote, PersonalNoteCategory, AppLanguage } from '../types';
import { DEFAULT_NOTE_CATEGORIES } from '../data/defaults';
import { triggerHapticSound } from '../utils/khataCalculations';
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
  Layers,
  ArrowRight,
  FolderLock
} from 'lucide-react';

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
  language?: AppLanguage;
  privacyMask?: boolean;
}

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
  language = 'en',
  privacyMask = false
}) => {
  const isHindi = language === 'hi';
  const handleOpenCreate = onOpenCreateModal || onAddNote || (() => {});
  const handleQuickAdd = onQuickAdd || onQuickAddNote;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [revealedNoteIds, setRevealedNoteIds] = useState<Record<string, boolean>>({});
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [isQuickBoxExpanded, setIsQuickBoxExpanded] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((n) => {
      n.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
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

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(query);
          const matchContent = note.content.toLowerCase().includes(query);
          const matchTag = note.tags?.some((t) => t.toLowerCase().includes(query));
          return matchTitle || matchContent || matchTag;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned notes come first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, activeCategory, activeTag, searchQuery]);

  const handleCopyNote = (note: PersonalNote) => {
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    triggerHapticSound('click');
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleDownloadNote = (note: PersonalNote) => {
    const element = document.createElement('a');
    const file = new Blob([`${note.title}\n\nDate: ${new Date(note.createdAt).toLocaleString()}\n\n${note.content}`], {
      type: 'text/plain;charset=utf-8'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_note.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleReveal = (noteId: string) => {
    setRevealedNoteIds((prev) => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() && !quickContent.trim()) return;

    if (handleQuickAdd) {
      handleQuickAdd(quickTitle.trim() || (isHindi ? 'त्वरित नोट' : 'Quick Memo'), quickContent.trim());
      setQuickTitle('');
      setQuickContent('');
      setIsQuickBoxExpanded(false);
      triggerHapticSound('save');
    } else {
      handleOpenCreate();
    }
  };

  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const lockedCount = notes.filter((n) => n.isLocked).length;

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-[#064E3B]/25 border-[#10B981]/40 text-[#ECFDF5]';
      case 'blue':
        return 'bg-[#0C4A6E]/25 border-[#38BDF8]/40 text-[#F0F9FF]';
      case 'amber':
        return 'bg-[#78350F]/25 border-[#F59E0B]/40 text-[#FFFBEB]';
      case 'purple':
        return 'bg-[#581C87]/25 border-[#A855F7]/40 text-[#FAF5FF]';
      case 'rose':
        return 'bg-[#881337]/25 border-[#FB7185]/40 text-[#FFF1F2]';
      case 'slate':
        return 'bg-[#0F172A] border-[#334155] text-[#F8FAFC]';
      default:
        return 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#F8FAFC]';
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 text-left max-w-5xl mx-auto pb-12">
      {/* 1. Top Hero Section */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)]">
                <FileText className="w-4 h-4" />
              </span>
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)]">
                {isHindi ? '100% प्राइवेट व सेपरेट वॉल्ट' : 'Private Personal Vault'}
              </span>
            </div>
            <h2 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
              {isHindi ? 'पर्सनल नोट्स एवं सीक्रेट डायरी' : 'Personal Notes & Private Memos'}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#94A3B8] leading-relaxed">
              {isHindi
                ? 'खाता और खर्चों से बिल्कुल अलग अपना पर्सनल स्पेस। यहाँ अपने गुप्त विचार, जरूरी क्रेडेंशियल्स, पासवर्ड हिंट्स, टू-डू लिस्ट और मेमो 100% सुरक्षित और ऑफलाइन रखें।'
                : 'A dedicated private space isolated from ledgers and finances. Keep your personal reflections, passwords hints, ideas, and checklists 100% offline in your browser.'}
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="self-start sm:self-center min-h-[46px] py-2.5 px-5 sm:px-6 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[14px] flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4.5 h-4.5 stroke-[3]" />
            <span>{isHindi ? 'नया नोट लिखें' : 'Create Note'}</span>
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-5 pt-4 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)]/60 text-center sm:text-left">
            <div className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {isHindi ? 'कुल नोट्स' : 'Total Notes'}
            </div>
            <div className="text-[18px] sm:text-[22px] font-bold text-[#F8FAFC] mt-0.5">
              {notes.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)]/60 text-center sm:text-left">
            <div className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[var(--theme-primary,#38BDF8)] flex items-center justify-center sm:justify-start gap-1">
              <Pin className="w-3 h-3 fill-current" />
              <span>{isHindi ? 'पिन किए गए' : 'Pinned'}</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5">
              {pinnedCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)]/80 border border-[var(--theme-border,#213E61)]/60 text-center sm:text-left">
            <div className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#10B981] flex items-center justify-center sm:justify-start gap-1">
              <Lock className="w-3 h-3" />
              <span>{isHindi ? 'मास्क्ड / सीक्रेट' : 'Secret / Masked'}</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-bold text-[#10B981] mt-0.5">
              {lockedCount}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Scratchpad / Fast Note Capture */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-4 shadow-md transition-all">
        {!isQuickBoxExpanded ? (
          <div
            onClick={() => setIsQuickBoxExpanded(true)}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] cursor-pointer hover:text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)] transition-all text-[13px]"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'त्वरित पर्सनल नोट लिखें (क्लिक करें)...' : 'Write a quick personal note / scratchpad here...'}</span>
            </div>
            <Plus className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          </div>
        ) : (
          <form onSubmit={handleQuickSubmit} className="space-y-3 animate-in fade-in duration-150">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder={isHindi ? 'नोट का शीर्षक (Title)...' : 'Note title / subject...'}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[13.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              autoFocus
            />
            <textarea
              value={quickContent}
              onChange={(e) => setQuickContent(e.target.value)}
              rows={3}
              placeholder={isHindi ? 'यहाँ अपनी बात लिखें...' : 'Write note content...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[13px] leading-relaxed focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsQuickBoxExpanded(false);
                  setQuickTitle('');
                  setQuickContent('');
                }}
                className="py-1.5 px-3 rounded-lg text-[12px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
              >
                {isHindi ? 'बंद करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[12.5px] shadow-sm cursor-pointer active:scale-95"
              >
                {isHindi ? 'सहेजें' : 'Save Note'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Search & Category Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'नोट्स में खोजें (शीर्षक, शब्द या #टैग)...' : 'Search in notes (title, body or #tags)...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[13.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] text-[11.5px] px-1.5 py-0.5 rounded bg-[#070E18] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveTag(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border cursor-pointer ${
              activeCategory === 'all' && !activeTag
                ? 'bg-[var(--theme-primary,#38BDF8)] text-[#070E18] border-[var(--theme-primary,#38BDF8)] shadow-sm'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {isHindi ? 'सभी नोट्स' : 'All Notes'} ({notes.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('pinned');
              setActiveTag(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
              activeCategory === 'pinned'
                ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Pin className="w-3.5 h-3.5 fill-current" />
            <span>{isHindi ? 'पिन किए गए' : 'Pinned'}</span> ({pinnedCount})
          </button>

          <button
            onClick={() => {
              setActiveCategory('secret');
              setActiveTag(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
              activeCategory === 'secret'
                ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isHindi ? 'गोपनीय / सीक्रेट' : 'Secret Vault'}</span> ({lockedCount})
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
                    : 'bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {isHindi ? cat.hindiLabel : cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Tag Filters (if any exist) */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
            <span className="text-[#64748B] font-bold uppercase tracking-wider shrink-0 mr-1">
              Tags:
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
                      : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
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
            <h3 className="text-[18px] font-bold text-[#F8FAFC]">
              {searchQuery || activeCategory !== 'all' || activeTag
                ? isHindi ? 'कोई नोट नहीं मिला' : 'No matching notes found'
                : isHindi ? 'कोई पर्सनल नोट मौजूद नहीं है' : 'Your Personal Notes Vault is Empty'}
            </h3>
            <p className="text-[13px] text-[#94A3B8] leading-relaxed">
              {searchQuery || activeCategory !== 'all' || activeTag
                ? isHindi ? 'फ़िल्टर साफ़ करें या नया नोट जोड़ें।' : 'Try clearing filters or search terms.'
                : isHindi
                  ? 'अपने व्यक्तिगत विचार, गुप्त पासवर्ड्स, जरूरी टू-डू लिस्ट या महत्वपूर्ण मेमो यहाँ सुरक्षित रखें।'
                  : 'Start jotting down private thoughts, project ideas, to-do checklists, or secret credentials.'}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="py-2.5 px-5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#070E18] font-extrabold text-[13.5px] shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isHindi ? 'पहला नोट लिखें' : 'Create First Note'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const isMasked = note.isLocked && !revealedNoteIds[note.id] && !privacyMask;
            const categoryObj = DEFAULT_NOTE_CATEGORIES.find((c) => c.id === note.category);
            const dateStr = new Date(note.updatedAt || note.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={note.id}
                className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-200 relative group shadow-md hover:shadow-lg ${getColorClasses(
                  note.color
                )}`}
              >
                {/* Card Top: Category, Pin, and Quick Actions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#070E18]/60 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-border,#213E61)]">
                        {isHindi && categoryObj?.hindiLabel ? categoryObj.hindiLabel : categoryObj?.label || note.category}
                      </span>
                      {note.isLocked && (
                        <span className="p-1 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30" title="Secret Vault Masked">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Pin Toggle */}
                      <button
                        onClick={() => onTogglePin(note.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          note.isPinned
                            ? 'text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))]'
                            : 'text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#070E18]/50'
                        }`}
                        title={note.isPinned ? 'Unpin Note' : 'Pin to Top'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
                      </button>

                      {/* Copy Action */}
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#070E18]/50 transition-colors cursor-pointer"
                        title="Copy Note Text"
                      >
                        {copiedNoteId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif-display font-bold text-[17px] text-[#F8FAFC] leading-snug tracking-tight">
                    {note.title}
                  </h4>

                  {/* Body Content */}
                  <div className="relative min-h-[60px] pt-1">
                    {isMasked ? (
                      <div
                        onClick={() => toggleReveal(note.id)}
                        className="p-3 rounded-xl bg-[#070E18]/80 border border-[#10B981]/30 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer hover:border-[#10B981] transition-all group/mask"
                      >
                        <div className="flex items-center gap-1.5 text-[#10B981] text-[12px] font-bold">
                          <Eye className="w-4 h-4" />
                          <span>{isHindi ? 'सीक्रेट नोट: देखने के लिए क्लिक करें' : 'Secret Note: Click to View'}</span>
                        </div>
                        <span className="text-[11px] text-[#94A3B8]">
                          {isHindi ? 'गोपनीयता के लिए मास्क्ड' : 'Hidden for privacy'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[13px] text-[#CBD5E1] whitespace-pre-wrap leading-relaxed break-words font-sans max-h-48 overflow-y-auto custom-scrollbar">
                        {note.content}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Tags, Timestamp & Card Actions */}
                <div className="pt-3 mt-3 border-t border-[var(--theme-border,#213E61)]/50 space-y-2">
                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          onClick={() => setActiveTag(t)}
                          className="text-[10.5px] px-2 py-0.5 rounded-md bg-[#070E18]/70 text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] cursor-pointer transition-colors border border-[var(--theme-border,#213E61)]/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#64748B]" />
                      <span>{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Mask Toggle */}
                      <button
                        onClick={() => onToggleLock(note.id)}
                        className={`p-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                          note.isLocked
                            ? 'text-[#10B981] hover:bg-[#10B981]/20'
                            : 'text-[#64748B] hover:text-[#F8FAFC]'
                        }`}
                        title={note.isLocked ? 'Disable Mask' : 'Mask Note Content'}
                      >
                        {note.isLocked ? <EyeOff className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>

                      {/* Download .txt */}
                      <button
                        onClick={() => handleDownloadNote(note)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F8FAFC] transition-colors cursor-pointer"
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
    </div>
  );
};
