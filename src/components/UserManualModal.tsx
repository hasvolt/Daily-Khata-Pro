import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  Target,
  FileText,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Search,
  Zap,
  Coins,
  Receipt,
  Layers,
  LucideIcon,
  Code2,
  User,
  Lock,
  Briefcase,
  Lightbulb,
  CheckSquare,
  List,
  ArrowUp
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { FUND_LABELS, FUND_ORDER, DEFAULT_PERCENTAGES, FUND_CONFIGS } from '../data/defaults';
import { AppLanguage } from '../types';
import { getUserManualContent } from '../utils/userManualContent';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSourceCode?: () => void;
  onOpenSecurityLock?: () => void;
  language?: AppLanguage;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onOpenSourceCode,
  onOpenSecurityLock,
  language = 'en'
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'reader' | 'chapters'>('reader');

  const contentRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  const manual = getUserManualContent(language);
  const isHindi = language === 'hi';

  const SECTION_ICONS: Record<string, LucideIcon> = {
    intro: Zap,
    app_lock: Lock,
    personal_notes: FileText,
    six_funds: Layers,
    add_income: Coins,
    add_expense: Receipt,
    work_life: Briefcase,
    goals: Target,
    reports: FileText,
    settings: Settings,
    backup: ShieldCheck,
    source_code: Code2,
    faq: HelpCircle,
    developer: User
  };

  const sections = manual.sections.map((s) => ({
    ...s,
    icon: SECTION_ICONS[s.id] || FileText
  }));

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.overviewText.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
  const currentSection = sections[currentIndex >= 0 ? currentIndex : 0] || sections[0];
  const CurrentIcon = currentSection?.icon || BookOpen;

  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id);
    setMobileTab('reader');
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll active chip into view on mobile
  useEffect(() => {
    if (chipsContainerRef.current) {
      const activeChip = chipsContainerRef.current.querySelector('[data-active="true"]');
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeSectionId, mobileTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--theme-surface,#0E1A29)] sm:border border-[var(--theme-border,#213E61)] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[92vh] max-w-5xl shadow-2xl flex flex-col overflow-hidden text-left">
        {/* Modal Top Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-bg,#070E18)] shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[16px] sm:text-[20px] font-bold text-[#F8FAFC] truncate">
                  {manual.title}
                </h2>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30 shrink-0">
                  {manual.officialGuide}
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12px] text-[#94A3B8] truncate">
                {manual.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)] transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Tab Switcher inside Modal */}
        <div className="md:hidden p-2 bg-[var(--theme-bg,#070E18)] border-b border-[var(--theme-border,#213E61)] space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl">
            <button
              type="button"
              onClick={() => setMobileTab('reader')}
              className={`py-1.5 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'reader'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isHindi ? 'अध्याय पढ़ें' : 'Read Chapter'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileTab('chapters')}
              className={`py-1.5 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'chapters'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{isHindi ? `सूची (${sections.length})` : `Chapters (${sections.length})`}</span>
            </button>
          </div>

          {/* Horizontal quick jump chips on mobile in reader mode */}
          {mobileTab === 'reader' && (
            <div
              ref={chipsContainerRef}
              className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth"
            >
              {sections.map((s, idx) => {
                const isActive = activeSectionId === s.id;
                return (
                  <button
                    key={s.id}
                    data-active={isActive ? 'true' : 'false'}
                    type="button"
                    onClick={() => handleSelectSection(s.id)}
                    className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap shrink-0 border transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)] shadow-sm'
                        : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <span className="opacity-70 text-[9.5px]">#{idx + 1}</span>
                    <span>{s.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar / Chapters List */}
          <div
            className={`w-full md:w-80 h-full md:h-auto md:flex-none border-b md:border-b-0 md:border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex-col shrink-0 ${
              mobileTab === 'chapters' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Search Box */}
            <div className="p-3 border-b border-[var(--theme-border,#213E61)]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={manual.searchPlaceholder}
                  className="w-full pl-9 pr-8 py-2 text-[12.5px] rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List Menu */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
                <span>{manual.tableOfContents}</span>
                <span className="text-[10px] text-[var(--theme-primary,#38BDF8)] font-mono">
                  {filteredSections.length} {isHindi ? 'अध्याय' : 'Chapters'}
                </span>
              </div>
              {filteredSections.map((s, idx) => {
                const Icon = s.icon;
                const isActive = activeSectionId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSection(s.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[var(--theme-card,#132438)] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] font-bold shadow-sm'
                        : 'border-transparent text-[#94A3B8] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)]'
                          : 'bg-[var(--theme-surface,#0E1A29)] text-[#64748B]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="text-[12.5px] font-bold text-[#F8FAFC] truncate">
                          {s.title}
                        </div>
                        <span className="text-[10px] font-mono opacity-60">#{idx + 1}</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                        {s.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reader Area */}
          <div
            ref={contentRef}
            className={`flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6 bg-[var(--theme-surface,#0E1A29)] custom-scrollbar ${
              mobileTab === 'reader' ? 'block' : 'hidden md:block'
            }`}
          >
            {currentSection && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
                {/* Chapter Heading Card */}
                <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                      <CurrentIcon className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {isHindi ? `अध्याय ${currentIndex + 1} / ${sections.length}` : `Chapter ${currentIndex + 1} of ${sections.length}`}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                      {prevSection && (
                        <button
                          type="button"
                          onClick={() => handleSelectSection(prevSection.id)}
                          className="px-2 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <ChevronLeft className="w-3 h-3" />
                          <span>{isHindi ? 'पिछला' : 'Prev'}</span>
                        </button>
                      )}
                      {nextSection && (
                        <button
                          type="button"
                          onClick={() => handleSelectSection(nextSection.id)}
                          className="px-2 py-1 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <span>{isHindi ? 'अगला' : 'Next'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif-display text-[18px] sm:text-[22px] font-bold text-[#F8FAFC]">
                      {currentSection.title}
                    </h3>
                    <p className="text-[12.5px] sm:text-[13px] text-[#94A3B8] mt-1 leading-relaxed">
                      {currentSection.subtitle}
                    </p>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-[var(--theme-bg,#070E18)] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[var(--theme-primary,#38BDF8)] transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Overview Card */}
                {currentSection.overviewText && (
                  <div className="bg-[var(--theme-card,#132438)]/70 border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 space-y-2 shadow-sm">
                    {currentSection.overviewHeading && (
                      <h4 className="text-[13.5px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{currentSection.overviewHeading}</span>
                      </h4>
                    )}
                    <p className="text-[13px] text-[#CBD5E1] leading-relaxed">
                      {currentSection.overviewText}
                    </p>
                  </div>
                )}

                {/* Dedicated 6-Fund Formula Visualizer */}
                {currentSection.id === 'six_funds' ? (
                  <div className="space-y-2.5">
                    <div className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{currentSection.cardsHeading || '6 Dedicated Fund Pots'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {FUND_ORDER.map((f, idx) => {
                        const cfg = FUND_CONFIGS[f];
                        const cardData = currentSection.cards?.[idx];
                        return (
                          <div
                            key={f}
                            className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 relative overflow-hidden"
                          >
                            <div
                              className="absolute top-0 left-0 right-0 h-1"
                              style={{ backgroundColor: cfg.color }}
                            />
                            <div className="flex justify-between items-center pt-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: cfg.color }}
                                />
                                <span className="font-bold text-[#F8FAFC] text-[13px]">
                                  {cardData?.title || FUND_LABELS[f]}
                                </span>
                              </div>
                              <span className="text-[11.5px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-card,#132438)] px-2 py-0.5 rounded-md border border-[var(--theme-border,#213E61)]">
                                {DEFAULT_PERCENTAGES[f]}%
                              </span>
                            </div>
                            <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                              {cardData?.desc || cfg.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : currentSection.cards && currentSection.cards.length > 0 ? (
                  <div className="space-y-2.5">
                    {currentSection.cardsHeading && (
                      <div className="text-[13px] font-bold text-[#F8FAFC]">
                        {currentSection.cardsHeading}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSection.cards.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1 shadow-sm"
                        >
                          <div className="font-bold text-[13px] text-[#F8FAFC] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            <span>{c.title}</span>
                          </div>
                          <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                            {c.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Step-by-Step Instructions */}
                {currentSection.steps && currentSection.steps.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{currentSection.stepsHeading || manual.stepByStep}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSection.steps.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1"
                        >
                          <div className="text-[10.5px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider">
                            {st.step}
                          </div>
                          <h5 className="font-bold text-[13px] text-[#F8FAFC]">
                            {st.title}
                          </h5>
                          <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                            {st.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features List */}
                {currentSection.features && currentSection.features.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                    <div className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{currentSection.featuresHeading || manual.keyHighlights}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSection.features.map((f, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="font-bold text-[12.5px] text-[#F8FAFC] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary,#38BDF8)]" />
                            <span>{f.title}</span>
                          </div>
                          <p className="text-[12px] text-[#94A3B8] pl-3 leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ List */}
                {currentSection.faqList && currentSection.faqList.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{currentSection.overviewHeading || 'Frequently Asked Questions'}</span>
                    </div>
                    <div className="space-y-2">
                      {currentSection.faqList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1 shadow-sm"
                        >
                          <div className="font-bold text-[13px] text-[#F8FAFC] flex items-start gap-2">
                            <span className="text-[var(--theme-primary,#38BDF8)] font-mono font-bold">Q:</span>
                            <span>{item.q}</span>
                          </div>
                          <p className="text-[12px] text-[#94A3B8] pl-5 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Tip Banner */}
                {currentSection.proTip && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                        {manual.proTipLabel}
                      </div>
                      <p className="text-[12.5px] text-[#F8FAFC] mt-0.5 leading-relaxed">
                        {currentSection.proTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons for quick navigation */}
                {currentSection.id === 'app_lock' && onOpenSecurityLock && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSecurityLock();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#F8FAFC] hover:border-[#10B981] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Lock className="w-4 h-4 text-[#10B981]" />
                    <span>{manual.quickAction}</span>
                  </button>
                )}

                {currentSection.id === 'source_code' && onOpenSourceCode && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSourceCode();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/40 text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Code2 className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{manual.quickAction}</span>
                  </button>
                )}

                {/* Bottom Prev / Next Navigation in Modal */}
                <div className="border-t border-[var(--theme-border,#213E61)]/70 pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {prevSection ? (
                      <button
                        type="button"
                        onClick={() => handleSelectSection(prevSection.id)}
                        className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/60 text-left transition-all cursor-pointer flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#94A3B8] shrink-0">
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-[#64748B]">
                            {isHindi ? '← पिछला अध्याय' : '← Previous'}
                          </div>
                          <div className="text-[12.5px] font-bold text-[#F8FAFC] truncate">
                            {prevSection.title}
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    {nextSection && (
                      <button
                        type="button"
                        onClick={() => handleSelectSection(nextSection.id)}
                        className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/60 text-right transition-all cursor-pointer flex items-center justify-end gap-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-[#64748B]">
                            {isHindi ? 'अगला अध्याय →' : 'Next →'}
                          </div>
                          <div className="text-[12.5px] font-bold text-[#F8FAFC] truncate">
                            {nextSection.title}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#94A3B8] shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex items-center justify-between text-[11.5px] text-[#64748B] shrink-0">
          <div className="flex items-center gap-1.5">
            <HasVoltLogo size="sm" />
            <span className="truncate">• HasVolt Digital Tools</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:bg-[var(--theme-card-hover,#19304A)] text-[12px] font-bold transition-all cursor-pointer"
          >
            {manual.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManualModal;
