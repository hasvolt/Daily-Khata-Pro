import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  VolumeX,
  FileText,
  TrendingUp,
  Globe2,
  Cpu,
  Landmark,
  ShieldCheck,
  Scale,
  Building2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Clock,
  User,
  Quote,
  Flame,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  ChevronRight,
  X,
  Mail,
  SlidersHorizontal
} from 'lucide-react';
import { AppLanguage } from '../types';
import {
  LIVE_MARKET_INDICES,
  BREAKING_NEWS_HEADLINES,
  COMMERCIAL_ARTICLES,
  CommercialArticle
} from '../data/newsPortalData';

interface CommercialNewsPortalPageProps {
  onBack: () => void;
  language: AppLanguage;
  initialArticleId?: string | null;
  onNavigateTab?: (tab: string) => void;
}

export const CommercialNewsPortalPage: React.FC<CommercialNewsPortalPageProps> = ({
  onBack,
  language,
  initialArticleId,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<CommercialArticle | null>(() => {
    if (initialArticleId) {
      return COMMERCIAL_ARTICLES.find(a => a.id === initialArticleId) || null;
    }
    return null;
  });

  // Bookmarked articles in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('khata_bookmarked_news');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Audio speech synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'base' | 'lg'>('base');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [breakingIndex, setBreakingIndex] = useState(0);

  const isHindi = language === 'hi' || language === 'hinglish';

  // Toggle bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('khata_bookmarked_news', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save bookmark:', err);
      }
      return updated;
    });
  };

  // Cycling breaking news headlines
  useEffect(() => {
    const timer = setInterval(() => {
      setBreakingIndex(prev => (prev + 1) % BREAKING_NEWS_HEADLINES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return COMMERCIAL_ARTICLES.filter(article => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.hindiTitle.includes(searchQuery) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.hindiSubtitle.includes(searchQuery) ||
        article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'saved') return bookmarkedIds.includes(article.id);
      if (activeCategory === 'trending') return Boolean(article.isTrending);
      if (activeCategory === 'research') return Boolean(article.isResearchPaper);

      return article.category === activeCategory;
    });
  }, [searchQuery, activeCategory, bookmarkedIds]);

  // Audio Text-To-Speech for reader
  const handleToggleAudio = (article: CommercialArticle) => {
    if (!('speechSynthesis' in window)) {
      setCopyFeedback(isHindi ? 'ऑडियो ब्राउज़र में समर्थित नहीं है' : 'Audio speech not supported');
      setTimeout(() => setCopyFeedback(null), 2500);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = isHindi
        ? `${article.hindiTitle}. ${article.hindiSubtitle}. मुख्य निष्कर्ष: ${article.keyTakeaways.map(t => t.hi).join('. ')}`
        : `${article.title}. ${article.subtitle}. Key takeaways: ${article.keyTakeaways.map(t => t.en).join('. ')}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Stop audio if modal closes
  const handleCloseArticle = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSelectedArticle(null);
  };

  const handleShare = (article: CommercialArticle) => {
    const text = isHindi ? article.hindiTitle : article.title;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      setCopyFeedback(isHindi ? 'लिंक कॉपी हो गया!' : 'Article link copied!');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const categoriesList = [
    { id: 'all', label: isHindi ? 'सभी लेख व रिसर्च' : 'All Reports', icon: Globe2 },
    { id: 'economy', label: isHindi ? 'अर्थव्यवस्था व जीडीपी' : 'Macroeconomy & Growth', icon: Landmark },
    { id: 'business', label: isHindi ? 'व्यापार व बाज़ार' : 'Business & Markets', icon: TrendingUp },
    { id: 'tech-ai', label: isHindi ? 'एआई, टेक व फिनटेक' : 'Tech, AI & Fintech', icon: Cpu },
    { id: 'wealth', label: isHindi ? 'पूंजी बाज़ार व वेल्थ' : 'Capital Markets & Wealth', icon: ShieldCheck },
    { id: 'policy', label: isHindi ? 'टैक्स, बजट व नीतियां' : 'Tax & Regulations', icon: Scale },
    { id: 'industry', label: isHindi ? 'स्टार्टअप्स व उद्योग' : 'Startups & Industry', icon: Building2 },
    { id: 'research', label: isHindi ? 'अनुसंधान श्वेतपत्र' : 'Research Whitepapers', icon: FileText },
    { id: 'saved', label: `${isHindi ? 'सहेजे गए' : 'Saved'} (${bookmarkedIds.length})`, icon: Bookmark }
  ];

  const featuredArticle = COMMERCIAL_ARTICLES.find(a => a.isFeatured) || COMMERCIAL_ARTICLES[0];
  const currentBreaking = BREAKING_NEWS_HEADLINES[breakingIndex];

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] pb-24 font-sans selection:bg-[var(--theme-primary,#38BDF8)] selection:text-black">
      {/* 1. Live Market Indices Ticker Strip */}
      <header className="bg-[var(--theme-surface,#0E1A29)] border-b border-[var(--theme-border,#213E61)]/80 text-[11px] overflow-x-auto no-scrollbar py-2 px-3 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[var(--theme-border,#213E61)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono font-bold tracking-wider uppercase text-[10px] text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi ? 'बाज़ार लाइव' : 'MARKET PULSE'}
            </span>
          </div>

          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar whitespace-nowrap">
            {LIVE_MARKET_INDICES.map(idx => (
              <div key={idx.symbol} className="flex items-center gap-1.5 font-mono text-[11.5px]">
                <span className="font-bold text-[var(--theme-text,#F8FAFC)]">{idx.symbol}</span>
                <span className="text-[var(--theme-text-muted,#94A3B8)]">{idx.value}</span>
                <span
                  className={`flex items-center text-[10.5px] font-bold ${
                    idx.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {idx.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 inline" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 inline" />
                  )}
                  {idx.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Top Portal Masthead */}
      <section className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/60 px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer shrink-0 group active:scale-95"
                title={isHindi ? 'वापस जाएं' : 'Back to App'}
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                    {isHindi ? 'वाणिज्यिक अनुसंधान व वित्तीय समाचार' : 'COMMERCIAL INTELLIGENCE & RESEARCH'}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono text-[var(--theme-text-dim,#64748B)]">
                    {new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[var(--theme-text,#F8FAFC)] mt-0.5">
                  {isHindi ? 'ग्लोबल मार्केट, इकोनॉमी व रिसर्च पोर्टल' : 'Global Markets, Macro & Research Portal'}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--theme-text-dim,#94A3B8)] mt-0.5 max-w-2xl">
                  {isHindi
                    ? 'कॉर्पोरेट वित्त, व्यापक आर्थिक नीतियां, फिनटेक नवाचार, उद्योग अनुसंधान और पूंजी बाज़ार की गहन समीक्षा'
                    : 'Institutional economic insights, corporate policy analysis, fintech architecture & industrial research whitepapers'}
                </p>
              </div>
            </div>

            {/* Quick Actions / Search Bar */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--theme-text-dim,#94A3B8)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'समाचार, लेखक या विषय खोजें...' : 'Search articles, topics or authors...'}
                  className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl py-2 pl-9 pr-8 text-xs text-[var(--theme-text,#F8FAFC)] placeholder:text-[var(--theme-text-dim,#64748B)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim,#94A3B8)] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Breaking News Flash Strip */}
          <div className="mt-4 pt-3 border-t border-[var(--theme-border,#213E61)]/60 flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
              {isHindi ? 'ताज़ा अलर्ट' : 'FLASH'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--theme-text,#F8FAFC)] truncate font-medium">
                <span className="font-bold text-[var(--theme-primary,#38BDF8)] mr-1.5">
                  [{currentBreaking.tag}]
                </span>
                {isHindi ? currentBreaking.textHi : currentBreaking.textEn}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs */}
      <nav className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)]/90 sticky top-11 z-20 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categoriesList.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 border-[var(--theme-primary,#38BDF8)] shadow-sm'
                    : 'bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] border-[var(--theme-border,#213E61)] hover:text-white hover:border-[var(--theme-primary,#38BDF8)]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Main Portal Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Lead Featured Article (Cover Story) - shown when no search query and on 'all' tab */}
        {activeCategory === 'all' && !searchQuery.trim() && featuredArticle && (
          <article
            onClick={() => setSelectedArticle(featuredArticle)}
            className="group relative rounded-3xl overflow-hidden border border-[var(--theme-border,#213E61)] bg-gradient-to-br from-slate-900 via-[#0a1626] to-[#040911] cursor-pointer hover:border-[var(--theme-primary,#38BDF8)]/60 transition-all shadow-xl"
          >
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:items-center justify-between relative z-10">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {featuredArticle.heroBadge}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--theme-primary,#38BDF8)] px-2.5 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/25">
                    {isHindi ? featuredArticle.categoryLabel.hi : featuredArticle.categoryLabel.en}
                  </span>
                  <span className="text-xs text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                  <span className="text-xs text-[var(--theme-text-dim,#94A3B8)] font-mono">
                    • {featuredArticle.publishedAt}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                  {isHindi ? featuredArticle.hindiTitle : featuredArticle.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {isHindi ? featuredArticle.hindiSubtitle : featuredArticle.subtitle}
                </p>

                {/* Key Metrics Strip */}
                {featuredArticle.keyStats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {featuredArticle.keyStats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
                      >
                        <div className="text-base sm:text-lg font-mono font-black text-[var(--theme-primary,#38BDF8)]">
                          {stat.value}
                        </div>
                        <div className="text-[10.5px] text-slate-400 truncate">
                          {isHindi ? stat.hindiLabel : stat.label}
                        </div>
                        {stat.change && (
                          <div className="text-[9.5px] font-mono text-emerald-400 font-bold">
                            {stat.change}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Author Credentials */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {featuredArticle.author.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {featuredArticle.author.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {featuredArticle.author.role} • {featuredArticle.author.organization}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={e => toggleBookmark(featuredArticle.id, e)}
                      className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={isHindi ? 'सहेजें' : 'Bookmark'}
                    >
                      {bookmarkedIds.includes(featuredArticle.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-slate-950 font-bold text-xs group-hover:scale-105 transition-transform shadow-md">
                      {isHindi ? 'पूरी रिपोर्ट पढ़ें' : 'Read Full Investigation'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Side Highlights */}
              <div className="hidden lg:flex flex-col justify-between w-72 shrink-0 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="space-y-2">
                  <span className="text-[10.5px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                    {isHindi ? 'मुख्य कार्यकारी निष्कर्ष' : 'EXECUTIVE SUMMARY'}
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {featuredArticle.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-3 text-[11px] leading-relaxed">
                          {isHindi ? takeaway.hi : takeaway.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{isHindi ? 'मार्केट प्रभाव:' : 'Market Impact:'}</span>
                  <span className="font-bold text-emerald-400">
                    {featuredArticle.marketImpact.status}
                  </span>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Article Grid Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
              <span>
                {activeCategory === 'saved'
                  ? isHindi
                    ? 'आपकी सहेजी गई पढ़ने की सूची'
                    : 'Your Saved Reading List'
                  : isHindi
                  ? 'नवीनतम वाणिज्यिक व शोध रिपोर्ट'
                  : 'Latest Commercial & Analytical Reports'}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]">
                {filteredArticles.length}
              </span>
            </h3>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/40 space-y-3">
              <FileText className="w-10 h-10 text-[var(--theme-text-dim,#64748B)] mx-auto" />
              <p className="text-sm text-[var(--theme-text-dim,#94A3B8)] font-medium">
                {activeCategory === 'saved'
                  ? isHindi
                    ? 'आपने अभी तक कोई लेख बुकमार्क नहीं किया है।'
                    : 'You have not saved any articles yet.'
                  : isHindi
                  ? 'खोज मापदंड से मेल खाने वाला कोई लेख नहीं मिला।'
                  : 'No commercial articles matched your search query.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-xs font-bold hover:bg-[var(--theme-primary,#38BDF8)]/25 transition-all cursor-pointer"
              >
                {isHindi ? 'सभी लेख देखें' : 'View All Articles'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map(article => {
                const isBookmarked = bookmarkedIds.includes(article.id);
                return (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)]/80 hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer flex flex-col justify-between p-5 relative overflow-hidden shadow-sm hover:shadow-md"
                  >
                    {/* Top Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9.5px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                              article.isResearchPaper
                                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                : 'bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)]/30'
                            }`}
                          >
                            {article.heroBadge}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--theme-text-dim,#64748B)]">
                            {article.readTime}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={e => toggleBookmark(article.id, e)}
                          className="text-[var(--theme-text-dim,#64748B)] hover:text-[var(--theme-primary,#38BDF8)] transition-colors p-1"
                          title={isBookmarked ? 'Bookmarked' : 'Save for later'}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-[var(--theme-text,#F8FAFC)] leading-snug group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors line-clamp-2">
                        {isHindi ? article.hindiTitle : article.title}
                      </h4>

                      {/* Subtitle */}
                      <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] line-clamp-3 leading-relaxed">
                        {isHindi ? article.hindiSubtitle : article.subtitle}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {article.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Author & Date */}
                    <div className="pt-4 mt-4 border-t border-[var(--theme-border,#213E61)]/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-center text-[10px] font-bold text-[var(--theme-primary,#38BDF8)] shrink-0">
                          {article.author.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11.5px] font-medium text-[var(--theme-text,#F8FAFC)] block truncate">
                            {article.author.name}
                          </span>
                          <span className="text-[9.5px] text-[var(--theme-text-dim,#64748B)] block truncate">
                            {article.publishedAt}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        {isHindi ? 'पढ़ें' : 'Read'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. Commercial Intelligence Dispatch Subscription */}
        <section className="rounded-3xl border border-[var(--theme-border,#213E61)] bg-gradient-to-r from-[var(--theme-card,#132438)] via-[var(--theme-surface,#0E1A29)] to-[var(--theme-card,#132438)] p-6 sm:p-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 text-[var(--theme-primary,#38BDF8)] text-xs font-mono font-bold">
              <Mail className="w-3.5 h-3.5" />
              {isHindi ? 'वाणिज्यिक अनुसंधान बुलेटिन' : 'COMMERCIAL MARKET DISPATCH'}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--theme-text,#F8FAFC)]">
              {isHindi
                ? 'संस्थागत शोध, बाज़ार विश्लेषण और नीति अपडेट सीधे पाएं'
                : 'Get Institutional Research & Policy Briefs Every Morning'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--theme-text-dim,#94A3B8)] max-w-xl mx-auto">
              {isHindi
                ? 'निजी इक्विटी, मैक्रोइकॉनॉमिक्स और कॉर्पोरेट टैक्स के अग्रणी अर्थशास्त्रियों व विश्लेषकों द्वारा तैयार किया गया दैनिक सारांश।'
                : 'Curated financial intelligence, regulatory changes and sector outlooks delivered directly for decision makers.'}
            </p>

            <form
              onSubmit={handleSubscribeNewsletter}
              className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder={isHindi ? 'अपना ईमेल दर्ज करें...' : 'Enter your corporate email...'}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl py-2.5 px-4 text-xs text-[var(--theme-text,#F8FAFC)] placeholder:text-[var(--theme-text-dim,#64748B)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              >
                {newsletterSuccess
                  ? isHindi
                    ? 'सब्सक्राइब हुआ!'
                    : 'Subscribed!'
                  : isHindi
                  ? 'निःशुल्क जुड़ें'
                  : 'Subscribe Free'}
              </button>
            </form>
            {newsletterSuccess && (
              <p className="text-xs text-emerald-400 font-medium">
                {isHindi
                  ? 'धन्यवाद! अगला वाणिज्यिक शोध बुलेटिन आपके इनबॉक्स में भेजा जाएगा।'
                  : 'Subscription confirmed! You will receive our next executive research note.'}
              </p>
            )}
          </div>
        </section>
      </main>

      {/* 6. Full Article Reader Modal (Institutional Reading Experience) */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[92vh] bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[var(--theme-text,#F8FAFC)]"
            >
              {/* Modal Top Action Bar */}
              <div className="px-5 py-3.5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/90 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                    {selectedArticle.categoryLabel.en}
                  </span>
                  <span className="text-xs text-[var(--theme-text-dim,#94A3B8)] font-mono hidden sm:inline">
                    {selectedArticle.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Text to Speech Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleAudio(selectedArticle)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
                    }`}
                    title={
                      isPlayingAudio
                        ? isHindi
                          ? 'ऑडियो रोकें'
                          : 'Stop Audio'
                        : isHindi
                        ? 'ऑडियो सारांश सुनें'
                        : 'Listen to Audio Summary'
                    }
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">
                      {isPlayingAudio
                        ? isHindi
                          ? 'रोकें'
                          : 'Stop'
                        : isHindi
                        ? 'सुनें'
                        : 'Listen'}
                    </span>
                  </button>

                  {/* Font Size Toggle */}
                  <div className="flex items-center rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] p-0.5 text-xs font-mono">
                    {(['sm', 'base', 'lg'] as const).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFontSizeLevel(lvl)}
                        className={`px-2 py-0.5 rounded ${
                          fontSizeLevel === lvl
                            ? 'bg-[var(--theme-primary,#38BDF8)] text-slate-950 font-bold'
                            : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
                        }`}
                      >
                        {lvl === 'sm' ? 'A-' : lvl === 'base' ? 'A' : 'A+'}
                      </button>
                    ))}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => toggleBookmark(selectedArticle.id)}
                    className="p-1.5 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-colors cursor-pointer"
                    title={isHindi ? 'सहेजें' : 'Bookmark'}
                  >
                    {bookmarkedIds.includes(selectedArticle.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={() => handleShare(selectedArticle)}
                    className="p-1.5 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-colors cursor-pointer"
                    title={isHindi ? 'लिंक साझा करें' : 'Share Article'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Close Modal */}
                  <button
                    type="button"
                    onClick={handleCloseArticle}
                    className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-slate-800 text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-colors cursor-pointer ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {copyFeedback && (
                <div className="bg-emerald-500/20 text-emerald-300 text-xs px-4 py-1 text-center font-bold border-b border-emerald-500/30">
                  {copyFeedback}
                </div>
              )}

              {/* Modal Body Content (Scrollable) */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Article Masthead */}
                <div className="space-y-3 pb-6 border-b border-[var(--theme-border,#213E61)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                      {selectedArticle.heroBadge}
                    </span>
                    <span className="text-xs font-mono text-[var(--theme-text-dim,#94A3B8)]">
                      {selectedArticle.publishedAt}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {selectedArticle.marketImpact.status}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {isHindi ? selectedArticle.hindiTitle : selectedArticle.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-serif">
                    {isHindi ? selectedArticle.hindiSubtitle : selectedArticle.subtitle}
                  </p>

                  {/* Author Byline Card */}
                  <div className="flex items-center gap-3 pt-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                      {selectedArticle.author.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {selectedArticle.author.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {selectedArticle.author.role} • {selectedArticle.author.organization}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Executive Takeaways */}
                <div className="p-5 rounded-2xl bg-[var(--theme-card,#132438)]/60 border border-[var(--theme-border,#213E61)] space-y-2.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-400 tracking-wider block">
                    {isHindi ? 'प्रमुख कार्यकारी निष्कर्ष (KEY TAKEAWAYS)' : 'EXECUTIVE SUMMARY TAKEAWAYS'}
                  </span>
                  <ul className="space-y-2">
                    {selectedArticle.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isHindi ? takeaway.hi : takeaway.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Metrics Strip if available */}
                {selectedArticle.keyStats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedArticle.keyStats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)]"
                      >
                        <div className="text-lg font-mono font-black text-[var(--theme-primary,#38BDF8)]">
                          {stat.value}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {isHindi ? stat.hindiLabel : stat.label}
                        </div>
                        {stat.change && (
                          <div className="text-[10px] font-mono text-emerald-400 font-bold">
                            {stat.change}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Content Sections */}
                <div
                  className={`space-y-6 text-slate-200 leading-relaxed ${
                    fontSizeLevel === 'sm'
                      ? 'text-xs'
                      : fontSizeLevel === 'lg'
                      ? 'text-base'
                      : 'text-sm'
                  }`}
                >
                  {selectedArticle.contentSections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white border-l-3 border-[var(--theme-primary,#38BDF8)] pl-3">
                        {isHindi ? section.hindiHeading : section.heading}
                      </h3>

                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">
                          {isHindi ? p.hi : p.en}
                        </p>
                      ))}

                      {/* Pull Quote */}
                      {section.quote && (
                        <div className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-amber-400 my-4 space-y-2">
                          <Quote className="w-5 h-5 text-amber-400/60" />
                          <p className="italic text-slate-200 font-serif text-sm sm:text-base">
                            "{isHindi ? section.quote.hindiText : section.quote.text}"
                          </p>
                          <div className="text-xs font-bold text-amber-400">
                            — {section.quote.speaker},{' '}
                            <span className="text-slate-400 font-normal">
                              {section.quote.speakerRole}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags & Regulatory Disclaimer */}
                <div className="pt-6 border-t border-[var(--theme-border,#213E61)] space-y-4 text-xs text-slate-400">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-300 mr-1">
                      {isHindi ? 'विषय:' : 'Filed Under:'}
                    </span>
                    {selectedArticle.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] font-mono text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    {isHindi
                      ? 'अस्वीकरण: यह सामग्री केवल वाणिज्यिक अनुसंधान, शैक्षणिक एवं सूचनात्मक उद्देश्यों के लिए प्रकाशित की गई है। इसे वित्तीय निवेश सलाह के रूप में न लिया जाए।'
                      : 'Commercial Disclosure: Published strictly for institutional research and general educational intelligence. Does not constitute personal investment or fiduciary advice.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
