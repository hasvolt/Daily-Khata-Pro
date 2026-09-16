import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Search,
  X,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Languages
} from 'lucide-react';
import {
  INDIAN_LANGUAGES,
  GLOBAL_LANGUAGES,
  ALL_GOOGLE_LANGUAGES,
  getActiveGoogleLanguage,
  applyGoogleTranslateLanguage,
  resetGoogleTranslate,
  GoogleLanguage
} from '../utils/googleTranslate';

interface GoogleTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHindi?: boolean;
}

export const GoogleTranslateModal: React.FC<GoogleTranslateModalProps> = ({
  isOpen,
  onClose,
  isHindi = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'indian' | 'global'>('all');
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getActiveGoogleLanguage();
      setActiveLang(current);
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    let list: GoogleLanguage[] = [];
    if (activeCategory === 'all') {
      list = ALL_GOOGLE_LANGUAGES;
    } else if (activeCategory === 'indian') {
      list = INDIAN_LANGUAGES;
    } else {
      list = GLOBAL_LANGUAGES;
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelectLanguage = (code: string) => {
    setIsApplying(code);
    applyGoogleTranslateLanguage(code);
    setActiveLang(code);
    setTimeout(() => {
      setIsApplying(null);
      onClose();
    }, 400);
  };

  const handleReset = () => {
    setIsApplying('reset');
    resetGoogleTranslate();
    setActiveLang(null);
    setTimeout(() => {
      setIsApplying(null);
      onClose();
    }, 400);
  };

  const currentLangObj = ALL_GOOGLE_LANGUAGES.find((l) => l.code === activeLang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      id="google-translate-modal-backdrop"
    >
      <div
        className="w-full max-w-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
        id="google-translate-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight truncate">
                  {isHindi ? 'गूगल ट्रांसलेट (Google Translate)' : 'Google Translate'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  100+ LANGUAGES
                </span>
              </div>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi
                  ? 'ऐप को अपनी पसंदीदा भाषा में तुरंत अनुवाद करें'
                  : 'Translate the entire app into your preferred language instantly'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-surface,#0E1A29)] border border-transparent hover:border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
            id="close-translate-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Translation Status Banner */}
        {activeLang && (
          <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-emerald-300 font-semibold truncate">
                {isHindi ? 'सक्रिय अनुवाद:' : 'Active Translation:'}{' '}
                <strong className="text-white">
                  {currentLangObj ? `${currentLangObj.flag} ${currentLangObj.name} (${currentLangObj.nativeName})` : activeLang}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={Boolean(isApplying)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              id="reset-translate-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHindi ? 'मूल भाषा (Reset)' : 'Reset to Original'}</span>
            </button>
          </div>
        )}

        {/* Search and Category Filter */}
        <div className="p-3.5 sm:p-4 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--theme-text-dim,#64748B)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? 'भाषा खोजें... (जैसे हिन्दी, मराठी, বাংলা, தமிழ், English, Arabic)'
                  : 'Search language... (e.g. Hindi, Bengali, Tamil, Spanish, French)'
              }
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2 text-sm text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#64748B)] outline-none transition-all"
              id="search-translate-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--theme-text-dim,#64748B)] hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-indigo-500 text-white shadow-xs'
                  : 'bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white border border-[var(--theme-border,#213E61)]'
              }`}
            >
              {isHindi ? 'सभी भाषाएं (All)' : 'All Languages'} ({ALL_GOOGLE_LANGUAGES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('indian')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'indian'
                  ? 'bg-indigo-500 text-white shadow-xs'
                  : 'bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white border border-[var(--theme-border,#213E61)]'
              }`}
            >
              🇮🇳 {isHindi ? 'भारतीय भाषाएं' : 'Indian Languages'} ({INDIAN_LANGUAGES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('global')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'global'
                  ? 'bg-indigo-500 text-white shadow-xs'
                  : 'bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white border border-[var(--theme-border,#213E61)]'
              }`}
            >
              🌍 {isHindi ? 'अंतरराष्ट्रीय' : 'Global / World'} ({GLOBAL_LANGUAGES.length})
            </button>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Globe className="w-10 h-10 text-[var(--theme-text-dim,#64748B)] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[var(--theme-text-muted,#8BA4D0)]">
                {isHindi ? 'कोई भाषा नहीं मिली' : 'No matching language found'}
              </p>
              <p className="text-xs text-[var(--theme-text-dim,#64748B)]">
                {isHindi
                  ? 'कृपया दूसरा नाम टाइप करें या नीचे दिए गए ड्रॉपडाउन का उपयोग करें'
                  : 'Try typing a different name or use the native selector below'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredLanguages.map((lang) => {
                const isSelected = activeLang === lang.code;
                const isCurrentApplying = isApplying === lang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    disabled={Boolean(isApplying)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-xs'
                        : 'bg-[var(--theme-card,#132438)]/70 hover:bg-[var(--theme-card,#132438)] border-[var(--theme-border,#213E61)] hover:border-indigo-500/50 text-[var(--theme-text,#F8FAFC)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0 select-none">{lang.flag}</span>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-bold block truncate group-hover:text-indigo-400 transition-colors">
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] block truncate">
                          {lang.name}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    {isCurrentApplying && (
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer with quick note and reset */}
        <div className="p-3 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              {isHindi
                ? 'Google Translate स्वचालित रूप से पूरे ऐप और डाटा को अनुवादित करता है'
                : 'Google Translate dynamically translates all pages and interface texts'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={Boolean(isApplying)}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#8BA4D0)] hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              {isHindi ? 'मूल भाषा (Reset)' : 'Reset Language'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {isHindi ? 'बंद करें (Done)' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
