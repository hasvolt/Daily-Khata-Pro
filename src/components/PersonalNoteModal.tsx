import React, { useState, useEffect } from 'react';
import { PersonalNote, PersonalNoteCategory, PersonalNoteColor, AppLanguage } from '../types';
import { DEFAULT_NOTE_CATEGORIES } from '../data/defaults';
import { triggerHapticSound } from '../utils/khataCalculations';
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
  Sparkles,
  Shield
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
  const isHindi = language === 'hi';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PersonalNoteCategory | string>('personal');
  const [color, setColor] = useState<PersonalNoteColor>('default');
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setCategory(initialNote.category || 'personal');
      setColor(initialNote.color || 'default');
      setIsPinned(!!initialNote.isPinned);
      setIsLocked(!!initialNote.isLocked);
      setTags(initialNote.tags || []);
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
      setColor('default');
      setIsPinned(false);
      setIsLocked(false);
      setTags([]);
    }
    setNewTagInput('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError(isHindi ? 'कृपया नोट का शीर्षक या विवरण दर्ज करें।' : 'Please enter a title or note content.');
      return;
    }

    triggerHapticSound('save');
    onSave(
      {
        title: title.trim() || (isHindi ? 'बिना शीर्षक का नोट' : 'Untitled Note'),
        content: content.trim(),
        category,
        color,
        isPinned,
        isLocked,
        tags
      },
      initialNote ? initialNote.id : undefined
    );
    onClose();
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070E18]/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] text-[var(--theme-primary,#38BDF8)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-[17px] sm:text-[19px] text-[#F8FAFC]">
                {initialNote
                  ? isHindi ? 'नोट संपादित करें' : 'Edit Personal Note'
                  : isHindi ? 'नया पर्सनल नोट जोड़ें' : 'Create Personal Note'}
              </h3>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi
                  ? '100% प्राइवेट एवं ऑफलाइन — केवल आपके ब्राउज़र में सुरक्षित'
                  : '100% Private & Offline — Stored securely on your device'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)] rounded-xl transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4.5 overflow-y-auto flex-1 custom-scrollbar text-left">
          {error && (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-[12.5px] flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-bold text-[#F8FAFC]">
              {isHindi ? 'नोट का शीर्षक (Title)' : 'Note Title'} <span className="text-[var(--theme-primary,#38BDF8)]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder={isHindi ? 'उदा. महत्वपूर्ण पासवर्ड, गुप्त योजना, निजी विचार...' : 'e.g. Secret credentials, Project Ideas, Private reflections...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[14px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-colors"
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-bold text-[#CBD5E1]">
              {isHindi ? 'श्रेणी (Category)' : 'Category'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEFAULT_NOTE_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 px-2.5 rounded-xl text-[11.5px] font-bold transition-all border text-center cursor-pointer truncate ${
                      isSelected
                        ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.2))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-sm'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[var(--theme-border-hover,#2F5685)]'
                    }`}
                  >
                    {isHindi ? cat.hindiLabel : cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Card Theme Selector */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-bold text-[#CBD5E1] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'कार्ड का रंग (Theme Tint)' : 'Note Color Tint'}</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11.5px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-card,#132438)] text-[#F8FAFC] ring-1 ring-[var(--theme-primary,#38BDF8)]'
                        : 'border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${c.dotClass} shrink-0`} />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[12.5px] font-bold text-[#F8FAFC]">
                {isHindi ? 'नोट का विवरण (Content)' : 'Note Content'}
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
              rows={6}
              placeholder={
                isHindi
                  ? 'यहाँ अपनी निजी बातें, आइडियाज, टू-डू लिस्ट या महत्वपूर्ण मेमो विस्तार से लिखें...'
                  : 'Write your private thoughts, checklists, project notes, or credentials here...'
              }
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[13.5px] leading-relaxed focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-colors resize-y custom-scrollbar font-sans"
            />
          </div>

          {/* Toggles: Pin to Top & Mask/Lock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isPinned
                  ? 'bg-[var(--theme-primary-dim,rgba(56,189,248,0.15))] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                  : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
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
                  : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
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

          {/* Tags Section */}
          <div className="space-y-2 pt-1 border-t border-[var(--theme-border,#213E61)]/60">
            <label className="block text-[12.5px] font-bold text-[#CBD5E1] flex items-center gap-1.5">
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
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] text-[12.5px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
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
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card,#132438)] text-[#94A3B8] font-bold text-[13px] transition-all cursor-pointer text-center"
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
