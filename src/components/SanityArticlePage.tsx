import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  ChevronRight,
  Info,
  Globe,
  Flag,
  MessageSquare,
  Play,
  Square,
  Send,
  X
} from 'lucide-react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { AppLanguage } from '../types';
import { getSanityPostBySlug, urlFor, SanityBlogPost } from '../utils/sanityClient';
import { COMMERCIAL_ARTICLES, CommercialArticle } from '../data/newsPortalData';
import { GoogleTranslateModal } from './GoogleTranslateModal';

interface SanityArticlePageProps {
  slugOrId: string;
  language: AppLanguage;
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface ArticleComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export const SanityArticlePage: React.FC<SanityArticlePageProps> = ({
  slugOrId,
  language,
  onBack,
  onNavigateTab
}) => {
  const [post, setPost] = useState<SanityBlogPost | null>(null);
  const [fallbackArticle, setFallbackArticle] = useState<CommercialArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Factual inaccuracy');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  const isHindi = language === 'hi' || language === 'hinglish';

  // Load article from Sanity by slug or id, with seamless fallback
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getSanityPostBySlug(slugOrId).then(sanityData => {
      if (!isMounted) return;
      if (sanityData) {
        setPost(sanityData);
        setLoading(false);
        document.title = `${sanityData.title} | Daily Khata Pro Finance Blog`;
      } else {
        const match = COMMERCIAL_ARTICLES.find(
          a => a.id === slugOrId || (a as any).slug === slugOrId
        );
        if (match) {
          setFallbackArticle(match);
          document.title = `${match.title} | Daily Khata Pro Finance Blog`;
        }
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Failed to fetch post by slug:', err);
      if (isMounted) {
        const match = COMMERCIAL_ARTICLES.find(
          a => a.id === slugOrId || (a as any).slug === slugOrId
        );
        if (match) {
          setFallbackArticle(match);
          document.title = `${match.title} | Daily Khata Pro Finance Blog`;
        }
        setLoading(false);
      }
    });

    // Check bookmark state
    try {
      const stored = localStorage.getItem('khata_bookmarked_sanity');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        setIsBookmarked(ids.includes(slugOrId));
      }
    } catch {
      // ignore storage error
    }

    // Load comments for this article
    try {
      const storedComments = localStorage.getItem(`khata_blog_comments_${slugOrId}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }

    return () => {
      isMounted = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slugOrId]);

  // Comprehensive SEO Metadata & Structured Data (JSON-LD)
  useEffect(() => {
    const activeTitle = post?.title || fallbackArticle?.title;
    if (!activeTitle) return;

    const CANONICAL_DOMAIN = 'https://www.rozfiber.com';
    const slug = post?.slug?.current || fallbackArticle?.slug || slugOrId;
    const canonicalUrl = `${CANONICAL_DOMAIN}/blog/${slug}`;

    const description =
      post?.summary ||
      fallbackArticle?.subtitle ||
      (post?.body && Array.isArray(post.body)
        ? post.body
            .map(b => (b.children ? b.children.map((c: any) => c.text).join('') : ''))
            .join(' ')
            .slice(0, 160)
        : '') ||
      'Rozfiber Finance editorial dispatch and research.';

    const authorName = post?.authorName || fallbackArticle?.author?.name || 'MD Zafeer Hasan (YAZDAAN)';
    const authorRole = post?.authorRole || fallbackArticle?.author?.role || 'Author & Independent Researcher';
    const publishedDate = post?.publishedAt || fallbackArticle?.publishedAt || new Date().toISOString();
    const modifiedDate = post?.updatedAt || publishedDate;
    const imageUrl = post?.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : `${CANONICAL_DOMAIN}/daily-khata-pro-v4.png`;

    const prevTitle = document.title;
    document.title = `${activeTitle} | Rozfiber Finance`;

    // Canonical link management
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    const prevCanonical = canonicalLink ? canonicalLink.href : null;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
    }

    // Helper to safely set meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.replace(/[\[\]]/g, '').split('=');
        el.setAttribute(parts[0], parts[1].replace(/["']/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[property="og:title"]', 'content', activeTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'content', 'article');
    setMetaTag('meta[property="og:image"]', 'content', imageUrl);
    setMetaTag('meta[property="article:published_time"]', 'content', publishedDate);
    setMetaTag('meta[property="article:modified_time"]', 'content', modifiedDate);
    setMetaTag('meta[property="article:author"]', 'content', authorName);

    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', activeTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

    // JSON-LD Structured Data: BlogPosting & strictly real BreadcrumbList (Home -> Blog -> Article)
    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${canonicalUrl}#article`,
          "isPartOf": {
            "@type": "Blog",
            "@id": `${CANONICAL_DOMAIN}/blog#blog`,
            "name": "Rozfiber Finance Blog",
            "publisher": {
              "@type": "Organization",
              "name": "Rozfiber Finance",
              "url": CANONICAL_DOMAIN,
              "logo": {
                "@type": "ImageObject",
                "url": `${CANONICAL_DOMAIN}/daily-khata-pro-v4.png`
              }
            }
          },
          "headline": activeTitle,
          "description": description,
          "mainEntityOfPage": canonicalUrl,
          "url": canonicalUrl,
          "datePublished": publishedDate,
          "dateModified": modifiedDate,
          "image": imageUrl,
          "author": {
            "@type": "Person",
            "name": authorName,
            "jobTitle": authorRole,
            "url": CANONICAL_DOMAIN
          },
          "publisher": {
            "@type": "Organization",
            "name": "Rozfiber Finance",
            "url": CANONICAL_DOMAIN
          },
          "articleSection": "Finance"
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${CANONICAL_DOMAIN}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `${CANONICAL_DOMAIN}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": activeTitle,
              "item": canonicalUrl
            }
          ]
        }
      ]
    };

    let scriptTag = document.getElementById('sanity-article-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'sanity-article-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData);

    return () => {
      document.title = prevTitle;
      if (canonicalLink && prevCanonical) {
        canonicalLink.href = prevCanonical;
      }
      const tagToRemove = document.getElementById('sanity-article-jsonld');
      if (tagToRemove) {
        tagToRemove.remove();
      }
    };
  }, [post, fallbackArticle, slugOrId]);

  const toggleBookmark = () => {
    try {
      const stored = localStorage.getItem('khata_bookmarked_sanity');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(slugOrId)) {
        ids = ids.filter(i => i !== slugOrId);
        setIsBookmarked(false);
      } else {
        ids.push(slugOrId);
        setIsBookmarked(true);
      }
      localStorage.setItem('khata_bookmarked_sanity', JSON.stringify(ids));
    } catch (e) {
      console.error('Bookmark error:', e);
    }
  };

  const handleShare = async () => {
    const title = post?.title || fallbackArticle?.title || 'Daily Khata Pro Blog Post';
    const text = post?.summary || fallbackArticle?.subtitle || title;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedback(isHindi ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch {
      setCopyFeedback('URL: ' + url);
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert(isHindi ? 'आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता।' : 'Text-to-speech is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const title = post?.title || fallbackArticle?.title || '';
      const summary = post?.summary || fallbackArticle?.subtitle || '';
      let bodyText = '';
      if (post?.body && Array.isArray(post.body)) {
        bodyText = post.body
          .map(b => (b.children ? b.children.map((c: any) => c.text).join('') : ''))
          .join('. ');
      } else if (post?.bodyText) {
        bodyText = post.bodyText.replace(/<[^>]*>?/gm, ' ');
      }
      const fullText = `${title}. ${summary}. ${bodyText}`.replace(/\s+/g, ' ').trim();
      if (!fullText) return;

      const utterance = new SpeechSynthesisUtterance(fullText.slice(0, 4500));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (isHindi) {
        const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.toLowerCase().includes('hindi'));
        if (hiVoice) utterance.voice = hiVoice;
        utterance.lang = 'hi-IN';
      } else {
        const enVoice = voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-IN';
      }

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => {
        setIsPlayingAudio(false);
        (window as any)._khataSpeechUtterance = null;
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        (window as any)._khataSpeechUtterance = null;
      };

      // Prevent Chrome garbage collection bug
      (window as any)._khataSpeechUtterance = utterance;

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    } catch (err) {
      console.error('TTS Audio error:', err);
      setIsPlayingAudio(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: ArticleComment = {
      id: Date.now().toString(),
      name: commentName.trim(),
      text: commentText.trim(),
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setCommentText('');
    try {
      localStorage.setItem(`khata_blog_comments_${slugOrId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stored = localStorage.getItem('khata_reported_articles');
      const reports = stored ? JSON.parse(stored) : [];
      reports.push({
        articleSlug: slugOrId,
        title: post?.title || fallbackArticle?.title,
        reason: reportReason,
        details: reportDetails,
        date: new Date().toISOString()
      });
      localStorage.setItem('khata_reported_articles', JSON.stringify(reports));
    } catch {
      // ignore
    }
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSubmitted(false);
      setReportDetails('');
    }, 1800);
  };

  // PortableText components customized for high contrast & theme support
  const portableTextComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--theme-text,#F8FAFC)] mt-10 mb-4 leading-tight tracking-tight">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--theme-text,#F8FAFC)] mt-10 mb-4 border-l-4 border-[var(--theme-primary,#0284C7)] pl-3.5 leading-snug tracking-tight">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-lg sm:text-xl font-bold text-[var(--theme-text,#F8FAFC)] mt-8 mb-3 leading-snug">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-base sm:text-lg font-bold text-[var(--theme-text,#F8FAFC)] mt-6 mb-2">
          {children}
        </h4>
      ),
      normal: ({ children }) => (
        <p className="text-[var(--theme-text,#F8FAFC)]/90 mb-5 leading-relaxed font-normal text-[16px] sm:text-[17.5px]">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-6 p-4 sm:p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border-l-4 border-[var(--theme-primary,#0284C7)] text-[var(--theme-text,#F8FAFC)] italic shadow-xs">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-6 mb-6 space-y-2 text-[var(--theme-text,#F8FAFC)]/90 text-[16px] sm:text-[17.5px] leading-relaxed">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-[var(--theme-text,#F8FAFC)]/90 text-[16px] sm:text-[17.5px] leading-relaxed">
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-[var(--theme-text,#F8FAFC)]">
          {children}
        </strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--theme-primary,#0284C7)] underline hover:opacity-80 transition-opacity font-medium"
        >
          {children}
        </a>
      ),
    },
    types: {
      html: ({ value }) => {
        if (!value?.html) return null;
        return (
          <div
            className="my-4 text-[var(--theme-text,#F8FAFC)]/90 leading-relaxed text-base"
            dangerouslySetInnerHTML={{ __html: value.html }}
          />
        );
      },
      image: ({ value }) => {
        const imageSource = value?.asset || value;
        if (!imageSource) return null;
        let imageUrl = '';
        try {
          imageUrl = urlFor(value).width(1200).auto('format').fit('max').url();
        } catch {
          return null;
        }
        return (
          <figure className="my-8 rounded-2xl overflow-hidden border border-[var(--theme-border,#213E61)]/70 bg-[var(--theme-surface,#0E1A29)] shadow-sm">
            <img
              src={imageUrl}
              alt={value.alt || 'Article illustration'}
              className="w-full h-auto object-cover max-h-[540px] block"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {(value.caption || value.credit) && (
              <figcaption className="p-3 text-xs text-center text-[var(--theme-text-dim,#64748B)] bg-[var(--theme-surface,#0E1A29)] border-t border-[var(--theme-border,#213E61)]/50 flex flex-col sm:flex-row items-center justify-center gap-1.5">
                {value.caption && <span className="font-medium">{value.caption}</span>}
                {value.caption && value.credit && <span className="hidden sm:inline text-slate-500">•</span>}
                {value.credit && <span className="opacity-75 italic text-[11px]">{value.credit}</span>}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  const fontSizeClass =
    fontSize === 'sm'
      ? 'text-sm'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl'
      : 'text-base sm:text-lg';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--theme-primary,#0284C7)] border-t-transparent animate-spin" />
          <span className="text-sm font-mono text-[var(--theme-text-dim,#94A3B8)]">
            {isHindi ? 'लेख लोड हो रहा है...' : 'Loading article...'}
          </span>
        </div>
      </div>
    );
  }

  if (!post && !fallbackArticle) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] max-w-md space-y-4">
          <Info className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-[var(--theme-text,#F8FAFC)]">
            {isHindi ? 'लेख नहीं मिला' : 'Article Not Found'}
          </h2>
          <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
            {isHindi
              ? 'यह लेख अभी उपलब्ध नहीं है या यूआरएल सही नहीं है।'
              : 'The requested article could not be found or has not yet been published.'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 rounded-xl bg-[var(--theme-primary,#0284C7)] text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
          >
            {isHindi ? 'ब्लॉग सूची पर वापस जाएं' : 'Return to Blog List'}
          </button>
        </div>
      </div>
    );
  }

  // Active article data
  const title = post?.title || fallbackArticle?.title || '';
  const summary = post?.summary || (isHindi ? fallbackArticle?.hindiSubtitle : fallbackArticle?.subtitle) || '';
  const category = post?.category || fallbackArticle?.categoryLabel?.en || 'Finance';
  const readTime = post?.readTime || fallbackArticle?.readTime || '5 min read';
  const authorName = post?.authorName || fallbackArticle?.author?.name || 'MD Zafeer Hasan (YAZDAAN)';
  const authorRole = post?.authorRole || fallbackArticle?.author?.role || 'Author & Independent Researcher';
  const publishedDate = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : fallbackArticle?.publishedAt || '14 September 2026';
  const updatedDate = post?.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col transition-colors duration-200">
      {/* 1. Sticky Navigation Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)]/95 backdrop-blur-md px-4 py-3 notranslate" translate="no">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back to Blog */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-primary,#0284C7)] transition-colors cursor-pointer py-1 px-2 -ml-2 rounded-lg hover:bg-[var(--theme-card-hover,#1C2B3E)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'ब्लॉग पर वापस' : 'Back to Blog'}</span>
          </button>

          {/* Action Bar Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Summary Toggle */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
              }`}
              title={isPlayingAudio ? 'Stop Audio' : 'Listen to Audio Summary'}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isPlayingAudio ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनें' : 'Listen')}
              </span>
            </button>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded ${
                  fontSize === 'sm'
                    ? 'bg-[var(--theme-primary,#0284C7)] text-white'
                    : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
                title="Small text"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded ${
                  fontSize === 'base'
                    ? 'bg-[var(--theme-primary,#0284C7)] text-white'
                    : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
                title="Default text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded ${
                  fontSize === 'lg'
                    ? 'bg-[var(--theme-primary,#0284C7)] text-white'
                    : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)]'
                }`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Bookmark Toggle */}
            <button
              type="button"
              onClick={toggleBookmark}
              className="p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#0284C7)] transition-colors cursor-pointer"
              title={isBookmarked ? 'Bookmarked' : 'Save bookmark'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-[var(--theme-primary,#0284C7)]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Translate Button */}
            <button
              type="button"
              onClick={() => setIsTranslateOpen(true)}
              className="p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#0284C7)] transition-colors cursor-pointer"
              title={isHindi ? 'भाषा बदलें (Google Translate)' : 'Translate Article'}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Report Button */}
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-rose-400 transition-colors cursor-pointer"
              title={isHindi ? 'लेख रिपोर्ट करें' : 'Report Article Issue'}
            >
              <Flag className="w-4 h-4" />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-primary,#0284C7)] transition-colors cursor-pointer"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Copy Feedback Alert */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* 2. Main Article Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--theme-text-dim,#94A3B8)]">
          <button
            type="button"
            onClick={() => onNavigateTab?.('home')}
            className="hover:text-[var(--theme-primary,#0284C7)] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#94A3B8)]/60" />
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[var(--theme-primary,#0284C7)] transition-colors"
          >
            Blog
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-text-dim,#94A3B8)]/60" />
          <span className="text-[var(--theme-primary,#0284C7)] font-medium">Finance</span>
        </nav>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[var(--theme-primary,#0284C7)]/15 text-[var(--theme-primary,#0284C7)] border border-[var(--theme-primary,#0284C7)]/30">
              {category}
            </span>
            {post?.articleType && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] border border-[var(--theme-border,#213E61)]">
                {post.articleType}
              </span>
            )}
            <span className="text-xs text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          </div>

          {/* Article Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--theme-text,#F8FAFC)] leading-tight tracking-tight">
            {title}
          </h1>

          {/* Short Excerpt / Subtitle */}
          {summary && (
            <p className="text-base sm:text-xl text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed font-normal">
              {summary}
            </p>
          )}

          {/* Author Byline & Publication Dates */}
          <div className="pt-4 border-t border-[var(--theme-border,#213E61)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {post?.authorImage ? (
                <img
                  src={urlFor(post.authorImage).width(120).height(120).fit('crop').url()}
                  alt={authorName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[var(--theme-primary,#0284C7)] shadow-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">
                  {authorName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                  By {authorName}
                </div>
                <div className="text-xs text-[var(--theme-text-dim,#94A3B8)]">
                  {authorRole} • Rozfiber Finance
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--theme-text-dim,#94A3B8)] font-mono">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published: {publishedDate}</span>
              </div>
              {updatedDate && (
                <span className="text-[var(--theme-primary,#0284C7)] font-medium">
                  • Updated: {updatedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Audio Narration Bar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white transition-all cursor-pointer shrink-0 shadow-md ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
                  : 'bg-[var(--theme-primary,#0284C7)] hover:opacity-90'
              }`}
              title={isPlayingAudio ? 'Stop Audio' : 'Play Audio Article'}
            >
              {isPlayingAudio ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                  {isHindi ? 'ऑडियो में सुनें' : 'Listen to Article (Audio)'}
                </span>
                {isPlayingAudio && (
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-cyan-400 animate-bounce rounded-full" />
                    <span className="w-1 h-4 bg-cyan-400 animate-bounce delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-cyan-400 animate-bounce delay-150 rounded-full" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isPlayingAudio
                  ? (isHindi ? 'ऑडियो चल रहा है...' : 'Playing narration...')
                  : (isHindi ? 'पूरा लेख अपनी भाषा में सुनें' : 'Full text audio narration')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsTranslateOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] text-xs font-semibold text-[var(--theme-text,#F8FAFC)] hover:border-[var(--theme-primary,#0284C7)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#0284C7)]" />
              <span>{isHindi ? 'अनुवाद' : 'Translate'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] text-xs font-semibold text-[var(--theme-text-dim,#94A3B8)] hover:text-rose-400 hover:border-rose-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isHindi ? 'रिपोर्ट' : 'Report'}</span>
            </button>
          </div>
        </div>

        {/* Featured Image (if available) */}
        {post?.mainImage && (
          <div className="rounded-3xl overflow-hidden border border-[var(--theme-border,#213E61)] shadow-md bg-[var(--theme-surface,#0E1A29)]">
            <img
              src={urlFor(post.mainImage).width(1200).auto('format').fit('max').url()}
              alt={post.mainImage?.alt || post.title}
              className="w-full h-auto object-cover max-h-[500px] block"
              loading="eager"
              referrerPolicy="no-referrer"
            />
            {(post.mainImage?.caption || post.mainImage?.credit) && (
              <div className="p-3 text-xs text-center text-[var(--theme-text-dim,#64748B)] bg-[var(--theme-surface,#0E1A29)] border-t border-[var(--theme-border,#213E61)]/50 flex flex-col sm:flex-row items-center justify-center gap-1.5">
                {post.mainImage.caption && <span className="font-medium">{post.mainImage.caption}</span>}
                {post.mainImage.caption && post.mainImage.credit && <span className="hidden sm:inline text-slate-500">•</span>}
                {post.mainImage.credit && <span className="opacity-75 italic text-[11px]">{post.mainImage.credit}</span>}
              </div>
            )}
          </div>
        )}

        {/* Topics Chips */}
        {post?.topics && post.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.topics.map((t, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)]"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Article Body */}
        <article className={`space-y-6 ${fontSizeClass}`}>
          {post?.body && post.body.length > 0 ? (
            <div className="portable-text-wrapper space-y-4">
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          ) : fallbackArticle?.contentSections ? (
            <div className="space-y-6">
              {fallbackArticle.contentSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--theme-text,#F8FAFC)] border-l-3 border-[var(--theme-primary,#0284C7)] pl-3">
                    {isHindi ? sec.hindiHeading : sec.heading}
                  </h3>
                  <div className="space-y-3 text-[var(--theme-text-muted,#1E293B)] leading-relaxed">
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{isHindi ? p.hi : p.en}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : post?.bodyText && /<[a-z][\s\S]*>/i.test(post.bodyText) ? (
            <div
              className="article-body-html space-y-4 text-[var(--theme-text,#F8FAFC)]/90 leading-relaxed text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: post.bodyText }}
            />
          ) : post?.bodyText ? (
            <div className="space-y-4">
              {post.bodyText.split(/\n\s*\n/).map((paragraph, pIdx) => (
                <p key={pIdx} className="text-[var(--theme-text,#F8FAFC)]/90 leading-relaxed text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[var(--theme-text,#F8FAFC)]/90 leading-relaxed text-base sm:text-lg">
              {summary}
            </p>
          )}
        </article>

        {/* Sources & References Section */}
        {post?.sources && post.sources.length > 0 && (
          <section className="mt-12 p-6 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--theme-primary,#0284C7)]" />
              <span>{isHindi ? 'स्रोत व संदर्भ' : 'Sources & References'}</span>
            </h4>
            <div className="space-y-3">
              {post.sources.map((s, idx) => {
                const sourceTitle = s.title || s.name || 'Reference Source';
                const sourceDesc = s.description || s.notes;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[var(--theme-text,#F8FAFC)]">
                          {sourceTitle}
                        </span>
                        {s.date && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--theme-card,#132438)] text-[var(--theme-text-dim,#94A3B8)] border border-[var(--theme-border,#213E61)] font-mono">
                            {s.date}
                          </span>
                        )}
                      </div>
                      {sourceDesc && (
                        <p className="text-xs text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                          {sourceDesc}
                        </p>
                      )}
                    </div>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#0284C7)]/15 text-[var(--theme-primary,#0284C7)] hover:bg-[var(--theme-primary,#0284C7)]/25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <span>{isHindi ? 'स्रोत लिंक' : 'Source Link'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Financial & Editorial Disclaimer */}
        <section className="mt-8 p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text-dim,#94A3B8)] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-[var(--theme-text,#F8FAFC)] text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'संपादकीय व वित्तीय प्रकटीकरण' : 'Editorial & Finance Disclosure'}</span>
          </div>
          <p>
            {post?.disclaimer ||
              (isHindi
                ? 'यह लेख केवल वित्तीय शिक्षा, अनुसंधान और जागरूकता के उद्देश्य से प्रकाशित किया गया है। यह किसी भी प्रकार की वित्तीय, कर या कानूनी सलाह नहीं है। कोई भी वित्तीय निर्णय लेने से पहले अधिकृत पेशेवर से परामर्श लें।'
                : 'This article is published for educational, research, and general financial awareness purposes only. It does not constitute certified financial, investment, or legal advisory. Always conduct independent due diligence before making financial commitments.')}
          </p>
        </section>

        {/* Reader Comments & Discussion Section */}
        <section className="mt-8 p-6 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--theme-primary,#0284C7)]" />
              <span>{isHindi ? 'टिप्पणियाँ (Comments)' : 'Reader Comments'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-dim,#94A3B8)] border border-[var(--theme-border,#213E61)]">
                {comments.length}
              </span>
            </h4>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder={isHindi ? 'आपका नाम' : 'Your name'}
                value={commentName}
                onChange={e => setCommentName(e.target.value)}
                required
                className="px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder:text-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#0284C7)]"
              />
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder={isHindi ? 'अपनी राय या सवाल लिखें...' : 'Write your comment or thought...'}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder:text-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#0284C7)]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--theme-primary,#0284C7)] hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isHindi ? 'टिप्पणी भेजें' : 'Post Comment'}</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-2.5 pt-2 border-t border-[var(--theme-border,#213E61)]/60">
              {comments.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--theme-text,#F8FAFC)]">{c.name}</span>
                    <span className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-mono">
                      {c.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--theme-text-muted,#CBD5E1)] leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] italic pt-2 border-t border-[var(--theme-border,#213E61)]/60">
              {isHindi
                ? 'अभी कोई टिप्पणी नहीं है। पहली टिप्पणी लिखकर चर्चा शुरू करें!'
                : 'No comments yet. Share your thoughts on this finance guide!'}
            </p>
          )}
        </section>

        {/* Bottom Navigation & Share Bar */}
        <div className="pt-8 border-t border-[var(--theme-border,#213E61)] flex flex-col sm:flex-row items-center justify-between gap-4 notranslate" translate="no">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#1C2B3E)] text-[var(--theme-text,#F8FAFC)] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'सभी ब्लॉग लेख देखें' : 'View All Blog Articles'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[var(--theme-primary,#0284C7)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isHindi ? 'लेख साझा करें' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Google Translate Modal */}
      {isTranslateOpen && (
        <GoogleTranslateModal
          isOpen={isTranslateOpen}
          onClose={() => setIsTranslateOpen(false)}
        />
      )}

      {/* Report Article Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border,#213E61)]">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--theme-text,#F8FAFC)]">
                <Flag className="w-4 h-4 text-rose-400" />
                <span>{isHindi ? 'लेख रिपोर्ट करें' : 'Report Article'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="p-1 rounded-lg text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold">
                {isHindi
                  ? 'आपकी रिपोर्ट दर्ज कर ली गई है। धन्यवाद!'
                  : 'Your report has been received. Thank you!'}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-[var(--theme-text-dim,#94A3B8)] mb-1">
                    {isHindi ? 'समस्या का प्रकार चुनें:' : 'Select reason:'}
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] focus:outline-none cursor-pointer"
                  >
                    <option value="Factual inaccuracy">Factual inaccuracy / गलत जानकारी</option>
                    <option value="Broken source link">Broken source link / लिंक काम नहीं कर रहा</option>
                    <option value="Outdated financial information">Outdated information / पुरानी जानकारी</option>
                    <option value="Formatting or display issue">Formatting issue / टेक्स्ट डिस्प्ले समस्या</option>
                    <option value="Other">Other / अन्य</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[var(--theme-text-dim,#94A3B8)] mb-1">
                    {isHindi ? 'विवरण (वैकल्पिक):' : 'Additional details (optional):'}
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder={isHindi ? 'कृपया समस्या का विवरण दें...' : 'Describe what needs correction...'}
                    className="w-full p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder:text-[var(--theme-text-dim,#94A3B8)] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] font-semibold cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors"
                  >
                    {isHindi ? 'रिपोर्ट भेजें' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
