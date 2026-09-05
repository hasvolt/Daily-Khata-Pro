import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, GraduationCap, Target, Shield, Zap, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { AppLanguage } from '../types';
import { NavTab } from './BottomNav';
import { ACADEMY_ARTICLES } from '../data/wealthAcademy';
import * as LucideIcons from 'lucide-react';

interface WealthAcademyPageProps {
  onBack: () => void;
  onSelectArticle: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
  language: AppLanguage;
}

export const WealthAcademyPage: React.FC<WealthAcademyPageProps> = ({
  onBack,
  onSelectArticle,
  onNavigateTab,
  language
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'basics' | 'advanced' | 'security' | 'strategy'>('all');

  const tStr = (hi: string, en: string) => (language === 'hi' ? hi : en);

  const filteredArticles = ACADEMY_ARTICLES.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.hindiTitle.includes(searchQuery) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: tStr('सभी', 'All'), icon: GraduationCap },
    { id: 'basics', label: tStr('बुनियादी', 'Basics'), icon: BookOpen },
    { id: 'strategy', label: tStr('रणनीति', 'Strategy'), icon: Target },
    { id: 'security', label: tStr('सुरक्षा', 'Security'), icon: Shield },
    { id: 'advanced', label: tStr('उन्नत', 'Advanced'), icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[#F8FAFC]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[var(--theme-bg,#070E18)]/80 backdrop-blur-md border-b border-[var(--theme-border,#213E61)] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[var(--theme-surface,#0E1A29)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{tStr('वेल्थ अकादमी', 'Wealth Academy')}</span>
            </h1>
            <p className="text-[11px] text-[#94A3B8]">
              {tStr('वित्तीय स्वतंत्रता की ओर आपका मार्ग', 'Your roadmap to financial freedom')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
        {/* Search & Hero */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[var(--theme-primary,#38BDF8)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder={tStr('विषय खोजें...', 'Search topics...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl py-3.5 pl-11 pr-4 text-[14px] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] transition-all shadow-lg"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                    : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:border-[#38BDF8]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, idx) => {
              const Icon = (LucideIcons as any)[article.icon] || BookOpen;
              return (
                <motion.button
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onSelectArticle(article.id)}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-left hover:border-[var(--theme-primary,#38BDF8)]/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/20 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-[14.5px] text-[#F8FAFC] line-clamp-1 group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                      {tStr(article.hindiTitle, article.title)}
                    </h3>
                    <p className="text-[12px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {tStr(article.hindiDescription, article.description)}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#132438] text-[var(--theme-primary,#38BDF8)] border border-[#213E61]">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center mx-auto text-[#475569]">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-[#94A3B8] font-medium">{tStr('कोई लेख नहीं मिला', 'No articles found')}</p>
            </div>
          )}
        </div>

        {/* Navigation Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 text-[12px] text-[#94A3B8] border-t border-[var(--theme-border,#213E61)]/30">
          <button
            onClick={() => onBack()}
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
