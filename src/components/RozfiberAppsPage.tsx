import React, { useState } from 'react';
import {
  ArrowLeft,
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
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ROZFIBER_APPS, ROZFIBER_ECOSYSTEM_META, RozfiberAppItem } from '../data/rozfiberApps';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface RozfiberAppsPageProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const RozfiberAppsPage: React.FC<RozfiberAppsPageProps> = ({
  onBack,
  language = 'en'
}) => {
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'business' | 'documentation' | 'finance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isHindi = language === 'hi';

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
        return <Users className="w-6 h-6" />;
      case 'book-open':
        return <BookOpen className="w-6 h-6" />;
      case 'wallet':
        return <Wallet className="w-6 h-6" />;
      case 'building':
        return <Building2 className="w-6 h-6" />;
      default:
        return <Layers className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] pb-24">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 bg-[var(--theme-surface,#0E1A29)]/95 backdrop-blur-md border-b border-[var(--theme-border,#213E61)] shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white transition-all cursor-pointer text-xs font-bold active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'वापस जाएं' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--theme-primary,#38BDF8)]">Rozfiber Digital</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-mono text-[var(--theme-text-dim,#94A3B8)]">Ecosystem</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[var(--theme-card,#132438)] via-[var(--theme-surface,#0E1A29)] to-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] p-6 sm:p-8 relative overflow-hidden shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--theme-primary,#38BDF8)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-primary,#38BDF8)] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? 'आधिकारिक ऐप्स व डिजिटल टूल्स' : 'Official Applications Suite'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--theme-text,#F8FAFC)] tracking-tight">
              {isHindi ? ROZFIBER_ECOSYSTEM_META.ecosystemTitle.hi : ROZFIBER_ECOSYSTEM_META.ecosystemTitle.en}
            </h1>

            <p className="text-sm sm:text-base text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
              {isHindi ? ROZFIBER_ECOSYSTEM_META.ecosystemSubtitle.hi : ROZFIBER_ECOSYSTEM_META.ecosystemSubtitle.en}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Privacy-First</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>High Performance</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>Zero Telemetry</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim,#94A3B8)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'ऐप या फ़ीचर खोजें...' : 'Search apps or features...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'all', label: isHindi ? 'सभी ऐप्स' : 'All Apps' },
              { id: 'business', label: isHindi ? 'व्यापार व स्टाफ' : 'Business' },
              { id: 'documentation', label: isHindi ? 'डॉक्स व गाइड' : 'Documentation' },
              { id: 'finance', label: isHindi ? 'वित्तीय लेजर' : 'Finance' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHapticSound('click');
                  setSelectedCategory(cat.id as typeof selectedCategory);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
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

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredApps.map((app) => {
            const isCopied = copiedAppId === app.id;
            return (
              <div
                key={app.id}
                className={`rounded-3xl border transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 relative ${
                  app.featured
                    ? 'bg-[var(--theme-card,#132438)]/90 border-[var(--theme-primary,#38BDF8)]/50 shadow-lg ring-1 ring-[var(--theme-primary,#38BDF8)]/20'
                    : 'bg-[var(--theme-card,#132438)]/60 border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/40 shadow-sm'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                        {getAppIcon(app.iconType)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-[var(--theme-text,#F8FAFC)]">
                            {app.name}
                          </h3>
                        </div>
                        <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mt-1 ${
                          app.isCurrentApp
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : app.badgeTheme === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : app.badgeTheme === 'sky'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {app.isCurrentApp ? (isHindi ? 'वर्तमान ऐप' : 'Current App') : (isHindi ? app.statusBadge.hi : app.statusBadge.en)}
                        </span>
                      </div>
                    </div>

                    {!app.isCurrentApp ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary,#38BDF8)]/90 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                      >
                        <span>{isHindi ? 'ऐप खोलें' : 'Open'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[11px] font-semibold text-slate-300 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="text-xs font-semibold text-[var(--theme-primary,#38BDF8)] leading-snug">
                    {isHindi ? app.tagline.hi : app.tagline.en}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                    {isHindi ? app.description.hi : app.description.en}
                  </p>

                  {/* Features List */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1.5 uppercase tracking-wider font-mono">
                      {isHindi ? 'प्रमुख विशेषताएं' : 'Core Capabilities'}
                    </span>
                    <div className="space-y-1.5">
                      {(isHindi ? app.highlights.hi : app.highlights.en).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[var(--theme-text-muted,#CBD5E1)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: URL & Action Chips */}
                <div className="pt-3 border-t border-[var(--theme-border,#213E61)]/60 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 text-[var(--theme-text-dim,#94A3B8)]">
                    <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                    <span className="font-mono text-xs truncate">{app.displayUrl}</span>
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
                          <span className="text-emerald-400 font-bold">{isHindi ? 'कॉपी' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isHindi ? 'लिंक' : 'Copy'}</span>
                        </>
                      )}
                    </button>

                    {!app.isCurrentApp && (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--theme-primary,#38BDF8)] hover:underline"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Apps Pipeline Banner */}
        <div className="rounded-3xl border border-dashed border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? 'भविष्य में और भी नए ऐप्स जोड़े जा रहे हैं' : 'More Rozfiber Apps Launching Soon'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
              {isHindi
                ? 'Rozfiber की टीम स्थानीय व्यापारों, दुकानों, ठेकेदारों और कामगारों के लिए आधुनिक व सुरक्षित सॉफ्टवेयर टूल्स तैयार कर रही है। जब भी नया ऐप लाइव होगा, वह इसी हब में स्वतः जुड़ जाएगा।'
                : 'The Rozfiber engineering team is actively building tailored software applications for local businesses, contractors, and craftsmen. Newly deployed platforms will be automatically listed in this directory.'}
            </p>
            <div className="pt-2 text-xs text-[var(--theme-text-dim,#94A3B8)]">
              <span>Official contact: </span>
              <a href="mailto:daily-Khata-Pro@gmail.com" className="text-[var(--theme-primary,#38BDF8)] hover:underline font-mono">
                daily-Khata-Pro@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
