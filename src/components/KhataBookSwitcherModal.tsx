import React, { useState } from 'react';
import { KhataBook, AppLanguage, Entry } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';
import { X, BookOpen, Briefcase, Store, Home, Plus, Check, Trash2, Info, ShieldCheck } from 'lucide-react';

interface KhataBookSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: KhataBook[];
  activeBookId: string;
  onSelectBook: (bookId: string) => void;
  onCreateBook: (name: string, type: 'personal' | 'business' | 'family' | 'custom') => void;
  onDeleteBook?: (bookId: string) => void;
  entries?: Entry[];
  language?: AppLanguage;
}

export const KhataBookSwitcherModal: React.FC<KhataBookSwitcherModalProps> = ({
  isOpen,
  onClose,
  books,
  activeBookId,
  onSelectBook,
  onCreateBook,
  onDeleteBook,
  entries = [],
  language = 'en'
}) => {
  const [newBookName, setNewBookName] = useState<string>('');
  const [newBookType, setNewBookType] = useState<'personal' | 'business' | 'family' | 'custom'>('business');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newBookName.trim();
    if (!trimmed) return;
    onCreateBook(trimmed, newBookType);
    setNewBookName('');
    setIsCreating(false);
    triggerHapticSound('save');
  };

  const getBookIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Store className="w-4 h-4 text-amber-400" />;
      case 'family':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'personal':
      default:
        return <Briefcase className="w-4 h-4 text-sky-400" />;
    }
  };

  const getBookEntriesCount = (bookId: string) => {
    return entries.filter((e) => {
      if (!e.bookId) {
        return bookId === 'book-default';
      }
      return e.bookId === bookId;
    }).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-base font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'खाता बही स्विचर (Khata Books)' : 'Multi-Khata Book Switcher'}
              </h3>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? 'पर्सनल और बिज़नेस लेन-देन अलग-अलग रखें' : 'Separate records for Personal, Business & Custom'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* How it works info banner */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-[var(--theme-text-muted,#94A3B8)] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[var(--theme-primary,#38BDF8)]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{isHindi ? 'यह कैसे काम करता है? (100% अलग डेटा)' : 'How Khata Books Work (100% Data Isolation)'}</span>
          </div>
          <p className="leading-relaxed">
            {isHindi
              ? 'प्रत्येक खाता बही (Personal या Business) के लेन-देन, बैलेंस और रिपोर्ट्स पूरी तरह अलग रहते हैं। जो खाता चुना होगा, सिर्फ उसी के आंकड़े दिखेंगे।'
              : 'Entries, totals, budgets and reports in each book are strictly isolated. Switching books changes the active view without mixing your personal and business records.'}
          </p>
        </div>

        {/* Books List */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 text-xs sm:text-sm">
          <div className="space-y-2">
            {books.map((book) => {
              const isActive = book.id === activeBookId;
              const count = getBookEntriesCount(book.id);
              return (
                <div
                  key={book.id}
                  onClick={() => {
                    onSelectBook(book.id);
                    triggerHapticSound('click');
                    onClose();
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-primary,#38BDF8)] shadow-sm'
                      : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shrink-0">
                      {getBookIcon(book.type)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[var(--theme-text,#F8FAFC)] block truncate">
                        {book.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                        <span className="capitalize">{book.type} Khata</span>
                        <span>•</span>
                        <span className="font-mono font-medium">{count} {count === 1 ? 'entry' : 'entries'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isActive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        <span>{isHindi ? 'सक्रिय' : 'Active'}</span>
                      </span>
                    )}
                    {onDeleteBook && !book.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBook(book.id);
                        }}
                        className="p-1.5 hover:text-rose-400 text-[var(--theme-text-dim,#94A3B8)] rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Book Form Toggle */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-text,#F8FAFC)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? '+ नई खाता बही बनाएं' : '+ Create New Khata Book'}</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
              <span className="font-semibold text-xs text-[var(--theme-text,#F8FAFC)] block">
                {isHindi ? 'नई खाता बही बनाएं' : 'Create New Book'}
              </span>
              <div>
                <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mb-1">
                  {isHindi ? 'बही का नाम' : 'Book Name'}
                </label>
                <input
                  type="text"
                  placeholder={isHindi ? 'उदा. मेरी दुकान, ऑफिस खर्च, साइड गिग' : 'e.g. My Shop, Office Expense, Home'}
                  value={newBookName}
                  onChange={(e) => setNewBookName(e.target.value)}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-lg p-2 text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] block mb-1">
                  {isHindi ? 'श्रेणी प्रकार' : 'Account Category'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['personal', 'business', 'family'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewBookType(t)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                        newBookType === t
                          ? 'border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-primary,#38BDF8)]'
                          : 'border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-1.5 rounded-lg border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text-dim,#94A3B8)] cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] font-bold text-xs cursor-pointer"
                >
                  {isHindi ? 'सुरक्षित करें' : 'Save Book'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
