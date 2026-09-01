import React, { useState } from 'react';
import {
  X,
  BookOpen,
  HelpCircle,
  Sparkles,
  Wallet,
  PieChart,
  PlusCircle,
  MinusCircle,
  Target,
  FileText,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Percent,
  Search,
  Zap,
  TrendingUp,
  Coins,
  Receipt,
  Layers,
  LucideIcon,
  Code2,
  Mail,
  Instagram,
  Twitter,
  ExternalLink,
  FolderGit2,
  Copy,
  Check,
  User,
  Lock,
  KeyRound,
  EyeOff,
  AlertTriangle,
  Briefcase,
  Calendar,
  Globe,
  Lightbulb,
  CheckSquare
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

  if (!isOpen) return null;

  const manual = getUserManualContent(language);

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

  const currentSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const CurrentIcon = currentSection?.icon || BookOpen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-bg,#070E18)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                  {manual.title}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                  {manual.officialGuide}
                </span>
              </div>
              <p className="text-[12px] text-[#94A3B8]">
                {manual.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card,#132438)] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - Responsive Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar / Section List */}
          <div className="w-full md:w-80 border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-[var(--theme-border,#213E61)]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={manual.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-[12.5px] rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                {manual.tableOfContents}
              </div>
              {filteredSections.map((s) => {
                const Icon = s.icon;
                const isActive = activeSectionId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSectionId(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/50 text-[var(--theme-primary,#38BDF8)] font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[#64748B]'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] truncate">{s.title}</div>
                      <div className="text-[10.5px] text-[#64748B] truncate">{s.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[var(--theme-surface,#0E1A29)] custom-scrollbar">
            {currentSection && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Chapter Heading */}
                <div className="border-b border-[var(--theme-border,#213E61)] pb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] mb-1">
                      <CurrentIcon className="w-5 h-5" />
                      <span className="text-[12px] font-bold uppercase tracking-wider">Chapter Guide</span>
                    </div>
                    <h3 className="font-serif-display text-[22px] font-bold text-[#F8FAFC]">
                      {currentSection.title}
                    </h3>
                    <p className="text-[13px] text-[#94A3B8] mt-1">
                      {currentSection.subtitle}
                    </p>
                  </div>
                </div>

                {/* Overview Card */}
                {currentSection.overviewText && (
                  <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 space-y-2.5 shadow-sm">
                    {currentSection.overviewHeading && (
                      <h4 className="text-[14px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
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
                  <div className="space-y-3">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">
                      {currentSection.cardsHeading || '6 Dedicated Fund Pots'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {FUND_ORDER.map((f, idx) => {
                        const cfg = FUND_CONFIGS[f];
                        const cardData = currentSection.cards?.[idx];
                        return (
                          <div
                            key={f}
                            className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2 relative overflow-hidden"
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
                                <span className="font-bold text-[#F8FAFC] text-[13.5px]">
                                  {cardData?.title || FUND_LABELS[f]}
                                </span>
                              </div>
                              <span className="text-[12px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-card,#132438)] px-2 py-0.5 rounded-md border border-[var(--theme-border,#213E61)]">
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
                  <div className="space-y-3">
                    {currentSection.cardsHeading && (
                      <div className="text-[13px] font-bold text-[#F8FAFC]">
                        {currentSection.cardsHeading}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSection.cards.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 shadow-sm"
                        >
                          <div className="font-bold text-[13.5px] text-[#F8FAFC] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            <span>{c.title}</span>
                          </div>
                          <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
                            {c.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Step-by-Step Instructions */}
                {currentSection.steps && currentSection.steps.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-[13.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                      <span>{currentSection.stepsHeading || manual.stepByStep}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSection.steps.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5"
                        >
                          <div className="text-[11px] font-mono font-bold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider">
                            {st.step}
                          </div>
                          <h5 className="font-bold text-[13.5px] text-[#F8FAFC]">
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
                  <div className="p-5 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
                    <div className="text-[13.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      <span>{currentSection.featuresHeading || manual.keyHighlights}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSection.features.map((f, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="font-bold text-[13px] text-[#F8FAFC] flex items-center gap-1.5">
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
                  <div className="space-y-3">
                    <div className="text-[13.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
                      <span>{currentSection.overviewHeading || 'Frequently Asked Questions'}</span>
                    </div>
                    <div className="space-y-2.5">
                      {currentSection.faqList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 shadow-sm"
                        >
                          <div className="font-bold text-[13.5px] text-[#F8FAFC] flex items-start gap-2">
                            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">Q:</span>
                            <span>{item.q}</span>
                          </div>
                          <p className="text-[12.5px] text-[#94A3B8] pl-5 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Tip Banner */}
                {currentSection.proTip && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300">
                    <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
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
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex items-center justify-between text-[11.5px] text-[#64748B] shrink-0">
          <div className="flex items-center gap-1.5">
            <HasVoltLogo size="sm" />
            <span>• HasVolt Digital Tools</span>
          </div>
          <button
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
