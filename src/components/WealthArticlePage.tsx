import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, BookOpen, Clock, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import { AppLanguage } from '../types';
import { ACADEMY_ARTICLES, AcademyArticle } from '../data/wealthAcademy';
import * as LucideIcons from 'lucide-react';
import { GoogleAdBanner } from './GoogleAdBanner';

interface WealthArticlePageProps {
  articleId: string;
  onBack: () => void;
  onNavigateArticle: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
  language: AppLanguage;
}

export const WealthArticlePage: React.FC<WealthArticlePageProps> = ({
  articleId,
  onBack,
  onNavigateArticle,
  onNavigateTab,
  language
}) => {
  const article = ACADEMY_ARTICLES.find(a => a.id === articleId);
  const currentIndex = ACADEMY_ARTICLES.findIndex(a => a.id === articleId);
  
  const prevArticle = currentIndex > 0 ? ACADEMY_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ACADEMY_ARTICLES.length - 1 ? ACADEMY_ARTICLES[currentIndex + 1] : null;

  if (!article) return null;

  const tStr = (hi: string, en: string) => (language === 'hi' ? hi : en);
  const Icon = (LucideIcons as any)[article.icon] || BookOpen;

  const handleShare = async () => {
    const shareData = {
      title: tStr(article.hindiTitle, article.title),
      text: tStr(article.hindiDescription, article.description),
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert(tStr('लिंक कॉपी किया गया!', 'Link copied to clipboard!'));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[#F8FAFC]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[var(--theme-bg,#070E18)]/80 backdrop-blur-md border-b border-[var(--theme-border,#213E61)] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[var(--theme-surface,#0E1A29)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-[var(--theme-surface,#0E1A29)] transition-colors text-[var(--theme-primary,#38BDF8)]"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        {/* Article Meta */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">{article.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC] leading-tight">
            {tStr(article.hindiTitle, article.title)}
          </h1>
          
          <div className="flex items-center justify-center md:justify-start gap-4 text-[#94A3B8] text-[13px]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(article.content.split(' ').length / 200)} min read</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#334155]" />
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Wealth Academy</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration Placeholder */}
        <div className="w-full aspect-video rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[var(--theme-border,#213E61)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <Icon className="w-24 h-24 text-[var(--theme-primary,#38BDF8)]/20" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-invert max-w-none prose-headings:text-[var(--theme-primary,#38BDF8)] prose-p:text-[#CBD5E1] prose-p:leading-loose text-[16px] md:text-[18px]"
        >
          <div className="whitespace-pre-wrap font-medium space-y-6">
            {(() => {
              const fullContent = tStr(article.hindiContent, article.content);
              const paragraphs = fullContent.split('\n\n');
              
              if (paragraphs.length <= 3) {
                return (
                  <>
                    {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    <div className="py-4">
                      <GoogleAdBanner label="ADVERTISEMENT" />
                    </div>
                  </>
                );
              }

              return (
                <>
                  {paragraphs.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
                  <div className="py-4 my-8 border-y border-[var(--theme-border,#213E61)]/30">
                    <GoogleAdBanner label="SPONSORED AD" />
                  </div>
                  {paragraphs.slice(2, -1).map((p, i) => <p key={i}>{p}</p>)}
                  <div className="py-4 my-8 border-y border-[var(--theme-border,#213E61)]/30">
                    <GoogleAdBanner label="PROMOTED CONTENT" />
                  </div>
                  {paragraphs.slice(-1).map((p, i) => <p key={i}>{p}</p>)}
                </>
              );
            })()}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--theme-border,#213E61)] to-transparent my-12" />

        {/* Navigation Between Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <button
              onClick={() => onNavigateArticle(prevArticle.id)}
              className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-left hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all group"
            >
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mb-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS</span>
              </div>
              <div className="font-bold text-[13.5px] text-[#F8FAFC] line-clamp-1 group-hover:text-[var(--theme-primary,#38BDF8)]">
                {tStr(prevArticle.hindiTitle, prevArticle.title)}
              </div>
            </button>
          ) : <div />}

          {nextArticle ? (
            <button
              onClick={() => onNavigateArticle(nextArticle.id)}
              className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-right hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all group"
            >
              <div className="flex items-center justify-end gap-2 text-[11px] text-[#94A3B8] mb-1">
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-[13.5px] text-[#F8FAFC] line-clamp-1 group-hover:text-[var(--theme-primary,#38BDF8)]">
                {tStr(nextArticle.hindiTitle, nextArticle.title)}
              </div>
            </button>
          ) : <div />}
        </div>

        {/* Navigation Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-12 text-[12px] text-[#94A3B8] border-t border-[var(--theme-border,#213E61)]/30">
          <button
            onClick={onBack}
            className="hover:text-white underline cursor-pointer"
          >
            {tStr('वापस', 'Back')}
          </button>
          {onNavigateTab && (
            <>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('privacy')}
                className="hover:text-white underline cursor-pointer"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('cookies')}
                className="hover:text-white underline cursor-pointer"
              >
                Cookies
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('terms')}
                className="hover:text-white underline cursor-pointer"
              >
                Terms
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
