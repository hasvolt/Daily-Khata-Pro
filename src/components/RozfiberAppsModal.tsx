import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Users,
  BookOpen,
  Wallet,
  Globe,
  Building2,
  Sparkles,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { ROZFIBER_APPS, ROZFIBER_ECOSYSTEM_META, RozfiberAppItem } from '../data/rozfiberApps';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface RozfiberAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
}

export const RozfiberAppsModal: React.FC<RozfiberAppsModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'business' | 'documentation' | 'finance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isHindi = language === 'hi';

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = (app: RozfiberAppItem) => {
    triggerHapticSound('click');
    navigator.clipboard?.writeText(app.url);
    setCopiedAppId(app.id);
    setTimeout(() => {
      setCopiedAppId(null);
    }, 2000);
  };

  const filteredApps = ROZFIBER_APPS.filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      app.name.toLowerCase().includes(q) ||
      app.displayUrl.toLowerCase().includes(q) ||
      app.tagline.en.toLowerCase().includes(q) ||
      app.tagline.hi.toLowerCase().includes(q) ||
      app.description.en.toLowerCase().includes(q) ||
      app.description.hi.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getAppIcon = (iconType: RozfiberAppItem['iconType']) => {
    switch (iconType) {
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5" />;
      case 'wallet':
        return <Wallet className="w-5 h-5" />;
      case 'building':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rozfiber-apps-title"
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--theme-primary,#38BDF8)] to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="rozfiber-apps-title" className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)] truncate">
                  {isHindi ? 'Rozfiber आधिकारिक ऐप्स' : 'Rozfiber Official Apps'}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  ECOSYSTEM
                </span>
              </div>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi ? ROZFIBER_ECOSYSTEM_META.ecosystemSubtitle.hi : ROZFIBER_ECOSYSTEM_META.ecosystemSubtitle.en}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Strip */}
        <div className="px-4 py-3 border-b border-[var(--theme-border,#213E61)]/70 bg-[var(--theme-surface,#0E1A29)]/90 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shrink-0">
          {/* Search box */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim,#94A3B8)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'ऐप या फ़ीचर खोजें...' : 'Search apps or features...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'all', label: isHindi ? 'सभी' : 'All' },
              { id: 'business', label: isHindi ? 'व्यापार' : 'Business' },
              { id: 'documentation', label: isHindi ? 'डॉक्स' : 'Docs' },
              { id: 'finance', label: isHindi ? 'वित्त' : 'Finance' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHapticSound('click');
                  setSelectedCategory(cat.id as typeof selectedCategory);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body - App Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredApps.map((app) => {
            const isCopied = copiedAppId === app.id;
            return (
              <div
                key={app.id}
                className={`rounded-2xl border transition-all p-4 sm:p-5 flex flex-col gap-3.5 relative ${
                  app.featured
                    ? 'bg-[var(--theme-card,#132438)]/90 border-[var(--theme-primary,#38BDF8)]/50 shadow-md ring-1 ring-[var(--theme-primary,#38BDF8)]/20'
                    : 'bg-[var(--theme-card,#132438)]/50 border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/40'
                }`}
              >
                {/* Top Row: Icon, Title, Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                      {getAppIcon(app.iconType)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)]">
                          {app.name}
                        </h3>
                        {app.isCurrentApp ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            {isHindi ? 'वर्तमान ऐप' : 'Current App'}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            app.badgeTheme === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : app.badgeTheme === 'sky'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {isHindi ? app.statusBadge.hi : app.statusBadge.en}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-[var(--theme-primary,#38BDF8)] mt-0.5 leading-snug">
                        {isHindi ? app.tagline.hi : app.tagline.en}
                      </p>
                    </div>
                  </div>

                  {/* External Link or Current Chip */}
                  <div className="shrink-0">
                    {app.isCurrentApp ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[11px] font-semibold text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary,#38BDF8)]/90 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        title={`Open ${app.name}`}
                      >
                        <span>{isHindi ? 'ऐप खोलें' : 'Open App'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {isHindi ? app.description.hi : app.description.en}
                </p>

                {/* Highlights List */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-[var(--theme-text-dim,#94A3B8)] block mb-1.5">
                    {isHindi ? 'मुख्य विशेषताएं (Highlights):' : 'Key Features:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(isHindi ? app.highlights.hi : app.highlights.en).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-[var(--theme-text-muted,#CBD5E1)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer of Card: URL Chip & Copy Button */}
                <div className="pt-2 border-t border-[var(--theme-border,#213E61)]/50 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 text-[var(--theme-text-dim,#94A3B8)]">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-[var(--theme-primary,#38BDF8)]" />
                    <span className="font-mono text-[11.5px] truncate">{app.displayUrl}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(app)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[11px] font-medium text-[var(--theme-text-muted,#CBD5E1)] hover:text-white transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{isHindi ? 'कॉपी हो गया' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isHindi ? 'लिंक कॉपी' : 'Copy Link'}</span>
                        </>
                      )}
                    </button>

                    {!app.isCurrentApp && (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--theme-primary,#38BDF8)] hover:underline"
                      >
                        <span>{app.displayUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="py-12 text-center text-xs text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi ? 'कोई ऐप नहीं मिला' : 'No applications matched your search'}
            </div>
          )}

          {/* Future Extensibility Announcement Box */}
          <div className="rounded-2xl border border-dashed border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'भविष्य में और भी नए ऐप्स जोड़े जा रहे हैं' : 'More Rozfiber Apps Launching Soon'}
              </h4>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] mt-1 leading-relaxed">
                {isHindi
                  ? 'Rozfiber स्थानीय व्यापार, उद्योग, दुकानों और उद्यमियों के लिए नए डिजिटल टूल्स विकसित कर रहा है। सभी नए ऐप्स इसी सूची में स्वतः उपलब्ध होंगे।'
                  : 'Rozfiber is actively engineering new purpose-built software tools for contractors, shops, logistics and local businesses. Newly deployed apps will be automatically added here.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/95 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[var(--theme-text-dim,#94A3B8)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--theme-text,#F8FAFC)]">Rozfiber Digital</span>
            <span>•</span>
            <a
              href="https://www.rozfiber.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--theme-primary,#38BDF8)] hover:underline inline-flex items-center gap-1 font-mono"
            >
              www.rozfiber.com ↗
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-semibold text-xs transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
