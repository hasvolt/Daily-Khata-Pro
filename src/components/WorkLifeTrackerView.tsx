import React, { useState } from 'react';
import { WorkLog, DailyLifeLog, AppLanguage } from '../types';
import { formatCurrency } from '../utils/khataCalculations';
import { getWorkCategoryIcon, getMoodVisual } from '../utils/iconMap';
import {
  localizeWorkStatus,
  localizeMood,
  localizeCategory,
  getTrackerText
} from '../utils/localization';
import { TRANSLATIONS } from '../utils/translations';
import {
  Briefcase,
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Sparkles,
  Calendar,
  Building,
  DollarSign,
  Tag,
  Search,
  Filter,
  Trash2,
  Edit2,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  Check,
  Printer,
  FileText
} from 'lucide-react';

interface WorkLifeTrackerViewProps {
  workLogs: WorkLog[];
  dailyLifeLogs: DailyLifeLog[];
  onOpenWorkModal: (log?: WorkLog) => void;
  onOpenDailyLifeModal: (log?: DailyLifeLog) => void;
  onDeleteWorkLog: (id: string) => void;
  onDeleteDailyLifeLog: (id: string) => void;
  onRecordWorkAsIncome?: (log: WorkLog) => void;
  language?: AppLanguage;
  privacyMask?: boolean;
}

export const WorkLifeTrackerView: React.FC<WorkLifeTrackerViewProps> = ({
  workLogs = [],
  dailyLifeLogs = [],
  onOpenWorkModal,
  onOpenDailyLifeModal,
  onDeleteWorkLog,
  onDeleteDailyLifeLog,
  onRecordWorkAsIncome,
  language = 'en',
  privacyMask = false
}) => {
  const [activeTab, setActiveTab] = useState<'work' | 'life'>('work');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Work Stats
  const totalWorkHours = workLogs.reduce((s, w) => s + (w.hoursSpent || 0), 0);
  const totalWorkEarnings = workLogs.reduce((s, w) => s + (w.earningsOrCost || 0), 0);
  const completedWorks = workLogs.filter((w) => w.status === 'completed').length;
  const inProgressWorks = workLogs.filter((w) => w.status === 'in_progress').length;

  // Filter Work
  const filteredWorkLogs = workLogs
    .filter((w) => {
      const matchSearch =
        searchQuery === '' ||
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.clientOrCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || w.status === statusFilter;
      const matchCat = categoryFilter === 'all' || w.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  // Filter Daily Life
  const filteredLifeLogs = dailyLifeLogs
    .filter((l) => {
      return (
        searchQuery === '' ||
        l.highlights.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        l.gratitude?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  const getStatusBadge = (status: WorkLog['status']) => {
    const localizedStatus = localizeWorkStatus(status, language);
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{localizedStatus}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>{localizedStatus}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            <AlertCircle className="w-3 h-3" />
            <span>{localizedStatus}</span>
          </span>
        );
      case 'on_hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#94A3B8]/15 text-[#94A3B8] border border-[#94A3B8]/30">
            <PauseCircle className="w-3 h-3" />
            <span>{localizedStatus}</span>
          </span>
        );
    }
  };

  // Distinct work categories for filter dropdown
  const uniqueWorkCategories = Array.from(new Set(workLogs.map((w) => w.category)));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-in fade-in duration-200 text-left pb-12">
      {/* Header & Main Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-4 sm:p-5 shadow-md">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[var(--theme-primary,#38BDF8)]" />
            <span>{getTrackerText('headerTitle', language)}</span>
          </h2>
          <p className="text-[12.5px] text-[#94A3B8] mt-0.5">
            {getTrackerText('headerSubtitle', language)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 mt-3 sm:mt-0">
          <button
            type="button"
            onClick={() => onOpenWorkModal()}
            className="flex-1 sm:flex-initial py-2 px-2.5 sm:px-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-primary,#38BDF8)]/10 text-[var(--theme-primary,#38BDF8)] font-bold text-[11.5px] sm:text-[13px] flex items-center justify-center gap-1 sm:gap-2 shadow-sm cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span>{getTrackerText('logWorkBtn', language)}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDailyLifeModal()}
            className="flex-1 sm:flex-initial py-2 px-2.5 sm:px-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-secondary,#FFC700)] hover:bg-[var(--theme-secondary,#FFC700)]/10 text-[var(--theme-secondary,#FFC700)] font-bold text-[11.5px] sm:text-[13px] flex items-center justify-center gap-1 sm:gap-2 shadow-sm cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span>{getTrackerText('todayStoryBtn', language)}</span>
          </button>
          
          {/* Tracker Export / Print Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:bg-[var(--theme-card-hover,#19304A)] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Backup / Print Options"
            >
              <Printer className="w-4 h-4" />
            </button>
            
            {isExportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl shadow-2xl z-50 p-1.5 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase text-[#94A3B8] border-b border-[var(--theme-border,#213E61)]/60 mb-1">
                    Backup / Export
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      import('../utils/trackerExport').then(m => m.printTrackerData(workLogs, dailyLifeLogs));
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-bold text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer text-left"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      import('../utils/trackerExport').then(m => m.downloadTrackerCSV(workLogs, dailyLifeLogs));
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-bold text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-sm">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            {getTrackerText('totalWorkItems', language)}
          </span>
          <div className="font-serif-display text-[22px] font-bold text-[#F8FAFC] mt-0.5 font-mono">
            {workLogs.length}
          </div>
          <span className="text-[11px] text-[#10B981] font-semibold">
            {completedWorks} {localizeWorkStatus('completed', language)} · {inProgressWorks} {localizeWorkStatus('in_progress', language)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-sm">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            {getTrackerText('loggedHours', language)}
          </span>
          <div className="font-serif-display text-[22px] font-bold text-[var(--theme-primary,#38BDF8)] mt-0.5 font-mono">
            {totalWorkHours} <span className="text-[13px] font-sans">hrs</span>
          </div>
          <span className="text-[11px] text-[#94A3B8]">
            Productive Hours
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-sm">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            {getTrackerText('workRevenue', language)}
          </span>
          <div className="font-serif-display text-[20px] font-bold text-[#10B981] mt-0.5 font-mono truncate">
            {formatCurrency(totalWorkEarnings, privacyMask)}
          </div>
          <span className="text-[11px] text-[#94A3B8]">
            Total Value
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-sm">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            {getTrackerText('lifeJournalDays', language)}
          </span>
          <div className="font-serif-display text-[22px] font-bold text-[var(--theme-secondary,#FFC700)] mt-0.5 font-mono">
            {dailyLifeLogs.length} <span className="text-[13px] font-sans">days</span>
          </div>
          <span className="text-[11px] text-[#94A3B8]">
            Entries Logged
          </span>
        </div>
      </div>

      {/* Sub-Tabs: Work Logs vs Daily Life Timeline */}
      <div className="flex gap-2 border-b border-[var(--theme-border,#213E61)] pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('work')}
          className={`flex-1 sm:flex-initial justify-center py-2 px-3 sm:px-4 rounded-xl font-bold text-[12.5px] sm:text-[14px] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'work'
              ? 'bg-[var(--theme-card,#132438)] text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Briefcase className="w-4 h-4 shrink-0" />
          <span>{getTrackerText('workTab', language)} ({workLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('life')}
          className={`flex-1 sm:flex-initial justify-center py-2 px-3 sm:px-4 rounded-xl font-bold text-[12.5px] sm:text-[14px] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'life'
              ? 'bg-[var(--theme-card,#132438)] text-[var(--theme-secondary,#FFC700)] border border-[var(--theme-secondary,#FFC700)]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>{getTrackerText('lifeTab', language)} ({dailyLifeLogs.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder={
              activeTab === 'work'
                ? 'Search work, client, project or category...'
                : 'Search journal highlights, reflections or tags...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
          />
        </div>

        {activeTab === 'work' && (
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter work by status"
              className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] text-[12.5px] font-bold rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">{localizeWorkStatus('completed', language)}</option>
              <option value="in_progress">{localizeWorkStatus('in_progress', language)}</option>
              <option value="pending">{localizeWorkStatus('pending', language)}</option>
              <option value="on_hold">{localizeWorkStatus('on_hold', language)}</option>
            </select>

            {uniqueWorkCategories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter work by category"
                className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] text-[12.5px] font-bold rounded-xl px-3 py-2.5 focus:outline-none max-w-[150px] truncate"
              >
                <option value="all">All Categories</option>
                {uniqueWorkCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Content Rendering */}
      {activeTab === 'work' ? (
        <div className="space-y-3">
          {filteredWorkLogs.length === 0 ? (
            <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--theme-primary,#38BDF8)]/10 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[16px] text-[#F8FAFC]">
                No Work Logs Found
              </h3>
              <p className="text-[13px] text-[#94A3B8] max-w-sm mx-auto">
                Start tracking professional tasks, deliverables, billable hours and client work.
              </p>
              <button
                type="button"
                onClick={() => onOpenWorkModal()}
                className="py-2.5 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[13px] cursor-pointer hover:brightness-110"
              >
                {getTrackerText('logWorkBtn', language)}
              </button>
            </div>
          ) : (
            filteredWorkLogs.map((item) => {
              const WorkIcon = getWorkCategoryIcon(item.category);
              return (
                <div
                  key={item.id}
                  className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-2xl p-4 sm:p-5 transition-all shadow-sm space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] shrink-0 mt-0.5">
                        <WorkIcon className="w-4.5 h-4.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-[15px] sm:text-[16px] text-[#F8FAFC] group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                            {item.title}
                          </h4>
                          {getStatusBadge(item.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#94A3B8] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                            <span>{item.date}</span>
                          </span>

                          {item.clientOrCompany && (
                            <span className="flex items-center gap-1 font-semibold text-[#CBD5E1]">
                              <Building className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>{item.clientOrCompany}</span>
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[11px] font-bold text-[#CBD5E1]">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Earnings / Hours */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--theme-border,#213E61)]/50">
                      {item.earningsOrCost && item.earningsOrCost > 0 ? (
                        <div className="font-serif-display font-bold text-[16px] text-[#10B981] font-mono">
                          +{formatCurrency(item.earningsOrCost, privacyMask)}
                        </div>
                      ) : null}

                      {item.hoursSpent ? (
                        <div className="text-[12px] font-bold text-[#94A3B8] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.hoursSpent} hrs</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Notes / Deliverables */}
                  {item.notes && (
                    <p className="text-[12.5px] text-[#CBD5E1] bg-[var(--theme-bg,#070E18)]/80 p-2.5 rounded-xl border border-[var(--theme-border,#213E61)]/60">
                      {item.notes}
                    </p>
                  )}

                  {item.deliverables && item.deliverables.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.deliverables.map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] text-[11px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-border,#213E61)]/60 text-[12px]">
                    <div className="flex items-center gap-2">
                      {onRecordWorkAsIncome && item.earningsOrCost && item.earningsOrCost > 0 && (
                        <button
                          type="button"
                          onClick={() => onRecordWorkAsIncome(item)}
                          className="py-1 px-2.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-[#10B981]/30"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Record as Income</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenWorkModal(item)}
                        className="p-1.5 text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                        title="Edit Work Log"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteWorkLog(item.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                        title="Delete Work Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Daily Life Timeline Tab */
        <div className="space-y-3">
          {filteredLifeLogs.length === 0 ? (
            <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--theme-secondary,#FFC700)]/10 text-[var(--theme-secondary,#FFC700)] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[16px] text-[#F8FAFC]">
                No Daily Stories Logged Yet
              </h3>
              <p className="text-[13px] text-[#94A3B8] max-w-sm mx-auto">
                Capture what happened today, key highlights, routines, learnings and gratitude.
              </p>
              <button
                type="button"
                onClick={() => onOpenDailyLifeModal()}
                className="py-2.5 px-4 rounded-xl bg-[var(--theme-secondary,#FFC700)] text-[#040D17] font-bold text-[13px] cursor-pointer hover:brightness-110"
              >
                {getTrackerText('todayStoryBtn', language)}
              </button>
            </div>
          ) : (
            filteredLifeLogs.map((item) => {
              const moodConfig = getMoodVisual(item.mood);
              const MoodIcon = moodConfig.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-secondary,#FFC700)]/50 rounded-2xl p-4 sm:p-5 transition-all shadow-sm space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="p-2 rounded-xl border shrink-0 mt-0.5"
                        style={{
                          backgroundColor: moodConfig.bg,
                          color: moodConfig.color,
                          borderColor: `${moodConfig.color}40`
                        }}
                      >
                        <MoodIcon className="w-4.5 h-4.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-[15px] sm:text-[16px] text-[#F8FAFC]">
                            {item.title || 'Daily Journal Entry'}
                          </h4>
                          <span
                            className="px-2 py-0.5 rounded text-[11px] font-bold"
                            style={{
                              backgroundColor: moodConfig.bg,
                              color: moodConfig.color
                            }}
                          >
                            {localizeMood(item.mood, language)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[12px] text-[#94A3B8] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                            <span>{item.date}</span>
                          </span>

                          {item.wakeTime && (
                            <span className="text-[11.5px] text-[#CBD5E1]">
                              Wake: <strong className="font-mono">{item.wakeTime}</strong>
                            </span>
                          )}
                          {item.sleepTime && (
                            <span className="text-[11.5px] text-[#CBD5E1]">
                              Sleep: <strong className="font-mono">{item.sleepTime}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenDailyLifeModal(item)}
                        className="p-1.5 text-[#94A3B8] hover:text-[var(--theme-secondary,#FFC700)] rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                        title="Edit Story"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDailyLifeLog(item.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
                        title="Delete Story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="text-[13px] text-[#F8FAFC] leading-relaxed bg-[var(--theme-bg,#070E18)]/80 p-3 rounded-xl border border-[var(--theme-border,#213E61)]/60">
                    {item.highlights}
                  </div>

                  {/* Routines Timeline (Morning / Afternoon / Evening) */}
                  {(item.morningRoutine || item.afternoonRoutine || item.eveningRoutine) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[12px]">
                      {item.morningRoutine && (
                        <div className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
                          <span className="text-[10.5px] font-bold uppercase text-[var(--theme-secondary,#FFC700)] flex items-center gap-1 mb-1">
                            <Sun className="w-3 h-3" />
                            <span>Morning</span>
                          </span>
                          <p className="text-[#CBD5E1] text-[11.5px]">{item.morningRoutine}</p>
                        </div>
                      )}
                      {item.afternoonRoutine && (
                        <div className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
                          <span className="text-[10.5px] font-bold uppercase text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 mb-1">
                            <Sunset className="w-3 h-3" />
                            <span>Afternoon</span>
                          </span>
                          <p className="text-[#CBD5E1] text-[11.5px]">{item.afternoonRoutine}</p>
                        </div>
                      )}
                      {item.eveningRoutine && (
                        <div className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
                          <span className="text-[10.5px] font-bold uppercase text-[#A855F7] flex items-center gap-1 mb-1">
                            <Moon className="w-3 h-3" />
                            <span>Evening</span>
                          </span>
                          <p className="text-[#CBD5E1] text-[11.5px]">{item.eveningRoutine}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Learnings & Gratitude */}
                  {(item.keyLearnings || item.gratitude) && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 text-[12px]">
                      {item.keyLearnings && (
                        <div className="flex-1 p-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/30">
                          <span className="text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] block mb-0.5">
                            Key Learning:
                          </span>
                          <p className="text-[#CBD5E1] text-[12px]">{item.keyLearnings}</p>
                        </div>
                      )}
                      {item.gratitude && (
                        <div className="flex-1 p-2.5 rounded-xl bg-[var(--theme-secondary,#FFC700)]/10 border border-[var(--theme-secondary,#FFC700)]/30">
                          <span className="text-[11px] font-bold text-[var(--theme-secondary,#FFC700)] block mb-0.5">
                            Gratitude:
                          </span>
                          <p className="text-[#CBD5E1] text-[12px]">{item.gratitude}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] text-[11px] font-medium border border-[var(--theme-border,#213E61)] flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
