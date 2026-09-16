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
  Printer,
  ChevronRight,
  X,
  Mail,
  SlidersHorizontal,
  Copy,
  Info,
  Check
} from 'lucide-react';
import { AppLanguage } from '../types';
import { PortableText } from '@portabletext/react';
import {
  LIVE_MARKET_INDICES,
  BREAKING_NEWS_HEADLINES,
  COMMERCIAL_ARTICLES,
  CommercialArticle
} from '../data/newsPortalData';
import { getSanityPosts, urlFor } from '../utils/sanityClient';
import { useNavigate } from 'react-router-dom';

interface SanityBlogPageProps {
  onBack: () => void;
  language: AppLanguage;
  initialArticleId?: string | null;
  onSelectArticle?: (slugOrId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SanityBlogPage: React.FC<SanityBlogPageProps> = ({
  onBack,
  language,
  initialArticleId,
  onSelectArticle,
  onNavigateTab
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<CommercialArticle | null>(null);

  // Live dynamic posts from Sanity CMS
  const [sanityArticles, setSanityArticles] = useState<CommercialArticle[]>([]);

  const handleArticleClick = (article: CommercialArticle) => {
    const target = article.slug || article.id;
    if (onSelectArticle) {
      onSelectArticle(target);
    } else {
      navigate(`/blog/${target}`);
    }
  };

  useEffect(() => {
    if (initialArticleId && sanityArticles.length > 0 && !selectedArticle) {
      const found = sanityArticles.find(a => a.id === initialArticleId || a.slug === initialArticleId);
      if (found) {
        handleArticleClick(found);
      }
    }
  }, [initialArticleId, sanityArticles, selectedArticle]);

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

  // SEO management for /blog listing
  useEffect(() => {
    const prevTitle = document.title;
    document.title = isHindi
      ? 'फाइनेंस ब्लॉग — रिसर्च, विश्लेषण एवं टूल्स | Rozfiber'
      : 'Finance Blog — Research, Insights & Tools | Rozfiber';

    const CANONICAL_URL = 'https://www.rozfiber.com/blog';
    const DESCRIPTION = isHindi
      ? 'Rozfiber फाइनेंस ज्ञान और संपादकीय रिसर्च लाइब्रेरी। निष्पक्ष वित्तीय समझ, बजट, बचत और उपयोगी टूल्स।'
      : 'Rozfiber Finance knowledge library and editorial research. Practical financial insights, budgeting, money management, and utilities.';

    // Manage canonical link
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    const prevCanonical = canonicalLink ? canonicalLink.href : null;
    if (canonicalLink) {
      canonicalLink.href = CANONICAL_URL;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = CANONICAL_URL;
      document.head.appendChild(canonicalLink);
    }

    // Helper to update or set meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = selector.replace(/[\[\]]/g, '').split('=');
        el.setAttribute(k, v.replace(/["']/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', DESCRIPTION);
    setMetaTag('meta[property="og:title"]', 'content', 'Finance Blog | Rozfiber');
    setMetaTag('meta[property="og:description"]', 'content', DESCRIPTION);
    setMetaTag('meta[property="og:url"]', 'content', CANONICAL_URL);
    setMetaTag('meta[property="og:type"]', 'content', 'website');

    return () => {
      document.title = prevTitle;
      if (canonicalLink && prevCanonical) {
        canonicalLink.href = prevCanonical;
      }
    };
  }, [isHindi]);

  useEffect(() => {
    let isMounted = true;
    getSanityPosts().then(posts => {
      if (!isMounted || !posts || posts.length === 0) return;
      const formatted: CommercialArticle[] = posts.map(p => ({
        id: p.slug?.current || `sanity-${p._id}`,
        slug: p.slug?.current,
        title: p.title || 'Untitled Post',
        hindiTitle: p.title || 'शीर्षक उपलब्ध नहीं',
        subtitle: p.summary || 'Live editorial dispatch from Sanity CMS',
        hindiSubtitle: p.summary || 'सैनिटी सीएमएस से लाइव प्रकाशित संपादकीय लेख',
        category: 'economy',
        categoryLabel: {
          en: p.category || 'Finance',
          hi: p.category || 'फाइनेंस'
        },
        readTime: p.readTime || '5 min read',
        heroImageGradient: 'from-blue-900 to-indigo-950',
        heroBadge: 'SANITY LIVE',
        publishedAt: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently Published',
        author: {
          name: p.authorName || 'MD Zafeer Hasan (YAZDAAN)',
          role: p.authorRole || 'Author & Independent Researcher',
          organization: 'Rozfiber Finance',
          avatarInitials: p.authorName ? p.authorName.slice(0, 2).toUpperCase() : 'ZH'
        },
        keyTakeaways: [
          {
            en: p.summary || p.title,
            hi: p.summary || p.title
          }
        ],
        marketImpact: {
          status: 'Strategic Outlook',
          sentimentLabel: 'Live Feed'
        },
        contentSections: [
          {
            heading: 'Overview & Analysis',
            hindiHeading: 'मुख्य विश्लेषण व समीक्षा',
            paragraphs: [
              {
                en: p.bodyText || p.summary || '',
                hi: p.bodyText || p.summary || ''
              }
            ]
          }
        ],
        sanityBody: p.body,
        tags: p.tags && p.tags.length > 0 ? p.tags : ['LiveBlog', 'SanityCMS', 'Updates']
      }));
      setSanityArticles(formatted);
    }).catch(err => {
      console.warn('Sanity live fetch notice:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered articles (Only live Sanity CMS dynamic blogs)
  const allArticles = useMemo(() => {
    return sanityArticles;
  }, [sanityArticles]);

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
    return allArticles.filter(article => {
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
      
      return article.category === activeCategory;
    });
  }, [allArticles, searchQuery, activeCategory, bookmarkedIds]);

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
    try {
      const existing = JSON.parse(localStorage.getItem('khata_subscribed_emails') || '[]');
      const newSub = {
        email: newsletterEmail.trim(),
        subscribedAt: new Date().toISOString(),
        device: 'Web Applet'
      };
      if (!existing.some((item: any) => item.email === newSub.email)) {
        existing.push(newSub);
        localStorage.setItem('khata_subscribed_emails', JSON.stringify(existing));
      }
    } catch {
      // ignore
    }
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const categoriesList = [
    { id: 'all', label: isHindi ? 'सभी लेख' : 'All Articles', icon: Globe2 },
    { id: 'economy', label: isHindi ? 'अर्थव्यवस्था' : 'Economy', icon: Landmark },
    { id: 'saved', label: `${isHindi ? 'सहेजे गए' : 'Saved'} (${bookmarkedIds.length})`, icon: Bookmark }
  ];

  const featuredArticle = allArticles.find(a => a.isFeatured) || allArticles[0] || COMMERCIAL_ARTICLES[0];
  const currentBreaking = BREAKING_NEWS_HEADLINES[breakingIndex];

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] pb-24 font-sans selection:bg-[var(--theme-primary,#38BDF8)] selection:text-black">
      {/* 1. Top Portal Masthead */}
      <section className="border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]/60 px-4 py-4 sm:py-6 sticky top-0 z-30 backdrop-blur-md">
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
                    {isHindi ? 'लाइव ब्लॉग' : 'LIVE BLOG'}
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
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-[var(--theme-text,#F8FAFC)] mt-0.5">
                  {isHindi ? 'सैनिटी लाइव ब्लॉग व संपादकीय' : 'Sanity Live CMS Blog & Editorial'}
                </h1>
                <p className="hidden sm:block text-xs sm:text-sm text-[var(--theme-text-dim,#94A3B8)] mt-0.5 max-w-2xl">
                  {isHindi
                    ? 'सैनिटी हेडलेस सीएमएस से सीधे प्रकाशित आपके नए और ताज़ा ब्लॉग व संपादकीय लेख'
                    : 'Your fresh, live blog updates and editorial posts published directly from Sanity CMS'}
                </p>
              </div>
            </div>

            {/* Quick Actions / Search Bar */}
            <div className="w-full md:w-80 mt-2 md:mt-0">
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
            onClick={() => handleArticleClick(featuredArticle)}
            className="group relative rounded-3xl overflow-hidden border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] cursor-pointer hover:border-[var(--theme-primary,#38BDF8)]/60 transition-all shadow-xl"
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

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--theme-text,#F8FAFC)] leading-tight group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                  {isHindi ? featuredArticle.hindiTitle : featuredArticle.title}
                </h2>

                <p className="text-sm sm:text-base text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                  {isHindi ? featuredArticle.hindiSubtitle : featuredArticle.subtitle}
                </p>

                {/* Author Credentials */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-border,#213E61)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {featuredArticle.author.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--theme-text,#F8FAFC)]">
                        {featuredArticle.author.name}
                      </div>
                      <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)]">
                        {featuredArticle.author.role} • {featuredArticle.author.organization}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={e => toggleBookmark(featuredArticle.id, e)}
                      className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#1C2B3E)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] border border-[var(--theme-border,#213E61)] transition-colors"
                      title={isHindi ? 'सहेजें' : 'Bookmark'}
                    >
                      {bookmarkedIds.includes(featuredArticle.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-slate-950 font-bold text-xs group-hover:scale-105 transition-transform shadow-md">
                      {isHindi ? 'पूरा लेख पढ़ें' : 'Read Article'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
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
                    onClick={() => handleArticleClick(article)}
                    className="group rounded-2xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)]/50 hover:bg-[var(--theme-card,#132438)]/80 hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all cursor-pointer flex flex-col justify-between p-5 relative overflow-hidden shadow-sm hover:shadow-md"
                  >
                    {/* Top Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9.5px] font-mono font-black uppercase px-2 py-0.5 rounded border bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)]/30"
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
                placeholder={isHindi ? 'अपना ईमेल दर्ज करें...' : 'Enter your email...'}
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
    </div>
  );
};
