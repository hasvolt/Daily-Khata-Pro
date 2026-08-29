import React, { useState } from 'react';
import {
  X,
  Code2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
  Terminal,
  Lock,
  WifiOff,
  Cpu,
  FileCode,
  ExternalLink,
  Check,
  Eye,
  Layers,
  Database,
  Search,
  Sparkles,
  GitBranch,
  FolderGit2,
  Star,
  Play
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
  entriesCount?: number;
  goalsCount?: number;
}

interface SourceFile {
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  language: string;
  content: string;
}

const GITHUB_REPO_URL = 'https://github.com/hasvolt/Daily-Khata-Pro';
const GITHUB_CLONE_URL = 'https://github.com/hasvolt/Daily-Khata-Pro.git';

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  entriesCount = 0,
  goalsCount = 0
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'github' | 'inspector' | 'audit' | 'verify'>('github');
  const [copied, setCopied] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const sourceFiles: SourceFile[] = [
    {
      name: 'khataCalculations.ts',
      category: 'Financial Core',
      description: '6-Fund allocation formula, balance aggregation, CSV exporter & currency formatting',
      icon: FileCode,
      language: 'typescript',
      content: `/**
 * Daily Khata: Pro — Core Financial Calculations Engine
 * 100% Client-Side Pure Functions | Zero External Telemetry
 */

import { Entry, FundType, Goal } from '../types';
import { DEFAULT_PERCENTAGES, FUND_ORDER } from '../data/defaults';

// Calculate total balances across all 6 funds
export function calculateFundTotals(entries: Entry[]): Record<FundType, number> {
  const totals: Record<FundType, number> = {
    emergency: 0,
    needs: 0,
    investments: 0,
    personal: 0,
    learning: 0,
    charity: 0
  };

  for (const entry of entries) {
    if (entry.type === 'income') {
      // Split income mathematically across 6 funds according to user percentages
      for (const fund of FUND_ORDER) {
        const pct = entry.splitPercentages?.[fund] ?? DEFAULT_PERCENTAGES[fund];
        const fundAmount = (entry.amount * pct) / 100;
        totals[fund] += fundAmount;
      }
    } else if (entry.type === 'expense' && entry.fund) {
      // Deduct expense from specific designated fund pot
      totals[entry.fund] -= entry.amount;
    }
  }

  return totals;
}

// Indian Rupee currency formatter
export function formatCurrency(val: number): string {
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(absVal);
  return \`\${isNeg ? '- ' : ''}₹\${formatted}\`;
}

// 100% Client-side CSV export generator (runs entirely in user's browser)
export function downloadCSVReport(entries: Entry[], targetMonth: Date): void {
  const monthKey = \`\${targetMonth.getFullYear()}-\${String(targetMonth.getMonth() + 1).padStart(2, '0')}\`;
  const monthEntries = entries.filter((e) => e.date.startsWith(monthKey));

  const headers = ['Date', 'Type', 'Category/Source', 'Fund', 'Amount', 'Note'];
  const rows = monthEntries.map((e) => [
    e.date,
    e.type,
    e.type === 'income' ? (e.source || 'Income') : (e.category || 'Expense'),
    e.type === 'income' ? '6-Fund Split' : (e.fund || 'personal'),
    e.amount,
    \`"\${(e.note || '').replace(/"/g, '""')}"\`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', \`DailyKhata-Report-\${monthKey}.csv\`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}`
    },
    {
      name: 'storageManager.ts',
      category: 'Data Privacy & LocalStorage',
      description: 'Zero remote database access; all data reads/writes stay inside browser localStorage',
      icon: Database,
      language: 'typescript',
      content: `/**
 * Daily Khata: Pro — Storage & Data Privacy Architecture
 * Proof of Offline-First / Zero Remote Database Architecture
 */

export const STORAGE_KEY = 'hasvolt_khata_v1';

export interface StorageDataModel {
  entries: any[];
  goals: any[];
  categories: string[];
  settings: {
    percentages: Record<string, number>;
    theme: string;
    language: string;
    privacyMask: boolean;
  };
}

// Read purely from local device storage
export function loadFromLocalStorage(): StorageDataModel | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Daily Khata] Local storage read error:', err);
    return null;
  }
}

// Write exclusively to local browser storage
export function saveToLocalStorage(data: StorageDataModel): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[Daily Khata] Local storage write error:', err);
  }
}

// Verification proof: There are ZERO fetch(), XMLHttpRequest, axios, or WebSocket calls transmitting user transactions.`
    },
    {
      name: 'types.ts',
      category: 'Schema & Types',
      description: 'TypeScript definitions for financial ledger records, goals, and fund rules',
      icon: Code2,
      language: 'typescript',
      content: `/**
 * Daily Khata: Pro — TypeScript Data Schema
 */

export type FundType = 'emergency' | 'needs' | 'investments' | 'personal' | 'learning' | 'charity';

export interface Entry {
  id: string;
  date: string;                 // YYYY-MM-DD
  type: 'income' | 'expense';
  amount: number;
  source?: string;              // For income
  category?: string;            // For expense
  fund?: FundType;              // Fund from which expense is deducted
  note?: string;
  splitPercentages?: Record<FundType, number>;
  createdAt: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  fundCategory: FundType;
  color?: string;
  createdAt: number;
}

export interface KhataData {
  entries: Entry[];
  goals: Goal[];
  categories: string[];
  settings: {
    percentages: Record<FundType, number>;
    theme: string;
    language: string;
    privacyMask?: boolean;
  };
}`
    },
    {
      name: 'securityAudit.json',
      category: 'Security & Audit Verification',
      description: 'Detailed compliance audit checklist against telemetry, ad scripts, and tracking cookies',
      icon: ShieldCheck,
      language: 'json',
      content: `{
  "application": "Daily Khata: Pro",
  "developer": "HasVolt Official",
  "license": "MIT / Open Transparency",
  "architecture": "Single-Page Client-Side Application (SPA)",
  "securityAudit": {
    "offlineCapable": true,
    "localStorageKey": "hasvolt_khata_v1",
    "remoteDatabaseConnected": false,
    "telemetryEnabled": false,
    "thirdPartyTrackers": 0,
    "advertisingScripts": 0,
    "cookieTracking": false,
    "crossSiteScriptingProtection": true,
    "dataOwnership": "100% User (Stored locally on your device)",
    "exportability": "JSON + CSV + Printable PDF HTML"
  },
  "compliance": {
    "gdprCompliant": true,
    "zeroDataCollection": true,
    "airGapSafe": true
  }
}`
    }
  ];

  const filteredFiles = searchQuery.trim()
    ? sourceFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sourceFiles;

  const currentFile = sourceFiles[selectedFileIndex] || sourceFiles[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    triggerHapticSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAllSource = () => {
    const combined = sourceFiles
      .map(
        (f) =>
          `// ==========================================\n// FILE: ${f.name} (${f.category})\n// Description: ${f.description}\n// ==========================================\n\n${f.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DailyKhata-Pro-SourceCode-${new Date().toISOString().slice(0, 10)}.ts`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    triggerHapticSound('save');
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${GITHUB_CLONE_URL}`);
    setCopiedClone(true);
    triggerHapticSound('click');
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCopySetup = () => {
    const commands = `git clone ${GITHUB_CLONE_URL}\ncd Daily-Khata-Pro\nnpm install\nnpm run dev`;
    navigator.clipboard.writeText(commands);
    setCopiedSetup(true);
    triggerHapticSound('click');
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 no-print">
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                  Source Code &amp; GitHub Repository
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  100% Open &amp; Safe
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Open Transparency Hub · GitHub Repo, 100% client-side algorithms &amp; offline privacy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] px-4 gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2.5 px-3 text-[12px] font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>GitHub Repository</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`py-2.5 px-3 text-[12px] font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Code Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 px-3 text-[12px] font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security &amp; Privacy Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`py-2.5 px-3 text-[12px] font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'verify'
                ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>How to Verify (DIY)</span>
          </button>
        </div>

        {/* Tab 0: Official GitHub Repository */}
        {activeTab === 'github' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-[var(--theme-bg,#070E18)]">
            {/* Main GitHub Hero Banner */}
            <div className="p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 shadow-md">
                    <FolderGit2 className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-display text-[18px] font-bold text-[#F8FAFC]">
                        hasvolt / Daily-Khata-Pro
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/40">
                        Public
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#94A3B8] mt-0.5">
                      Official GitHub Source Code Repository &amp; Offline Accounting Engine
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:bg-[var(--theme-btn-hover,#0EA5E9)] text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12.5px] flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open GitHub Repo</span>
                  </a>
                  <a
                    href={`${GITHUB_REPO_URL}/stargazers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12px] flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 text-[#FFC700]" />
                    <span>Star Repo</span>
                  </a>
                </div>
              </div>

              {/* Quick Git Clone Card */}
              <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="font-bold flex items-center gap-1.5 text-[#CBD5E1]">
                    <Terminal className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>Git Clone HTTPS URL</span>
                  </span>
                  <span className="text-[10.5px] text-[#64748B]">Click copy to clone anywhere</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-[12px]">
                  <span className="text-[var(--theme-primary,#38BDF8)] truncate select-all">
                    git clone {GITHUB_CLONE_URL}
                  </span>
                  <button
                    onClick={handleCopyClone}
                    className="px-2.5 py-1 rounded bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    {copiedClone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Run Locally Quickstart Guide */}
            <div className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[14px] text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#10B981]" />
                  <span>How to Run Locally from GitHub</span>
                </h4>
                <button
                  onClick={handleCopySetup}
                  className="text-[11.5px] text-[var(--theme-primary,#38BDF8)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSetup ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Commands Copied</span>
                    </>
                  ) : (
                    'Copy All 4 Commands'
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] font-mono text-[11.5px] text-[#0F172A] dark:text-[#CBD5E1] space-y-1.5 shadow-inner">
                <p className="text-[#64748B] dark:text-[#94A3B8]"># 1. Clone repository from GitHub</p>
                <p className="text-[var(--theme-primary,#38BDF8)] font-bold">git clone {GITHUB_CLONE_URL}</p>
                <p className="text-[#64748B] dark:text-[#94A3B8] pt-1"># 2. Enter project folder</p>
                <p className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">cd Daily-Khata-Pro</p>
                <p className="text-[#64748B] dark:text-[#94A3B8] pt-1"># 3. Install packages</p>
                <p className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">npm install</p>
                <p className="text-[#64748B] dark:text-[#94A3B8] pt-1"># 4. Launch local dev server</p>
                <p className="text-[#059669] dark:text-[#10B981] font-bold">npm run dev</p>
              </div>
            </div>

            {/* Repository Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8]">Open License</div>
                <div className="font-bold text-[13px] text-[#0F172A] dark:text-[#F8FAFC]">MIT / Free Open-Source</div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Full freedom to audit, fork, customize, and self-host</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8]">Modern Stack</div>
                <div className="font-bold text-[13px] text-[#0F172A] dark:text-[#F8FAFC]">React 18 + TypeScript + Vite</div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Tailwind CSS, Lucide Icons &amp; PWA Service Worker</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8]">Privacy Standard</div>
                <div className="font-bold text-[13px] text-[#059669] dark:text-[#10B981]">Zero Telemetry / 100% Local</div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">All calculations and records stay in browser storage</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Live Code Inspector */}
        {activeTab === 'inspector' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
            {/* Sidebar File List */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] p-3 flex flex-col gap-2 shrink-0">
              <div className="text-[10.5px] uppercase tracking-wider font-extrabold text-[#64748B] dark:text-[#94A3B8] px-2 pt-1">
                Core Source Modules
              </div>

              <div className="space-y-1 overflow-y-auto max-h-48 md:max-h-none flex-1">
                {sourceFiles.map((file, idx) => {
                  const Icon = file.icon;
                  const isSelected = selectedFileIndex === idx;
                  return (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-sm'
                          : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isSelected ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[#64748B]'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[12px] font-bold truncate text-[#0F172A] dark:text-[#F8FAFC]">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate">
                          {file.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Local Storage Live Stats */}
              <div className="p-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl text-[11px] space-y-1.5 mt-auto hidden md:block">
                <div className="text-[#64748B] dark:text-[#94A3B8] font-bold text-[10px] uppercase">Device Storage Info</div>
                <div className="flex justify-between text-[#334155] dark:text-[#CBD5E1]">
                  <span>Storage Key:</span>
                  <span className="font-mono text-[var(--theme-primary,#38BDF8)] font-bold">hasvolt_khata_v1</span>
                </div>
                <div className="flex justify-between text-[#334155] dark:text-[#CBD5E1]">
                  <span>Local Entries:</span>
                  <span className="font-mono font-bold text-[#059669] dark:text-[#10B981]">{entriesCount} records</span>
                </div>
                <div className="flex justify-between text-[#334155] dark:text-[#CBD5E1]">
                  <span>Active Goals:</span>
                  <span className="font-mono text-[#D97706] dark:text-[#FFC700] font-bold">{goalsCount}</span>
                </div>
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-1 flex flex-col bg-[var(--theme-surface,#0E1A29)] overflow-hidden">
              {/* File Info Bar */}
              <div className="px-4 py-2.5 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-bold text-[var(--theme-primary,#38BDF8)]">
                      {currentFile.name}
                    </span>
                    <span className="text-[9.5px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#0F172A] dark:text-[#CBD5E1] font-bold">
                      {currentFile.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">{currentFile.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#0F172A] dark:text-[#F8FAFC] text-[11.5px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="Copy code to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Pre Block with high contrast on Day and Night themes */}
              <div className="flex-1 p-4 overflow-auto font-mono text-[12px] leading-relaxed bg-[var(--theme-bg,#070E18)] border-t border-[var(--theme-border,#213E61)]/30 selection:bg-[var(--theme-primary,#38BDF8)]/20 code-inspector-container">
                <pre className="whitespace-pre font-mono code-inspector-pre">{currentFile.content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security & Privacy Audit */}
        {activeTab === 'audit' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-[var(--theme-bg,#070E18)]">
            {/* Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-display text-[16px] font-bold text-[#F8FAFC]">
                  100% Client-Side Privacy Guarantee
                </h3>
                <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
                  Daily Khata: Pro is engineered with an <strong>offline-first, zero-knowledge architecture</strong>. Your financial data never leaves your browser and is never transmitted to any third-party or cloud server without your explicit manual export.
                </p>
              </div>
            </div>

            {/* Audit Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Zero Network Telemetry</span>
                </div>
                <p className="text-[11.5px] text-[#94A3B8] leading-relaxed">
                  There are no background Google Analytics, Facebook Pixels, Sentry, or tracking beacons sending your income or expense figures.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Isolated LocalStorage</span>
                </div>
                <p className="text-[11.5px] text-[#94A3B8] leading-relaxed">
                  All ledger records live securely in your browser&apos;s sandboxed storage (<code className="text-[var(--theme-primary,#38BDF8)]">hasvolt_khata_v1</code>). Other websites cannot access it.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Works 100% Offline</span>
                </div>
                <p className="text-[11.5px] text-[#94A3B8] leading-relaxed">
                  You can turn off Wi-Fi or mobile data completely and the application, calculator, PDF generator, and khata split engine work without disruption.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>No Ads, No Popups, No Lock-in</span>
                </div>
                <p className="text-[11.5px] text-[#94A3B8] leading-relaxed">
                  You can export your complete ledger as a standard JSON or CSV at any time, giving you 100% unconstrained ownership of your data.
                </p>
              </div>
            </div>

            {/* Architecture Comparison */}
            <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-3">
              <div className="text-[12px] font-bold text-[#F8FAFC] uppercase tracking-wider">
                Architecture Comparison
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 space-y-1 text-[#EF4444]">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <span>Traditional Cloud Accounting Apps</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                    Stores income &amp; bank data on remote servers; vulnerable to cloud leaks, ad profiling, and monthly subscription lock-ins.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 space-y-1 text-[#10B981]">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Daily Khata: Pro Architecture</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                    100% on your device. Client-side state + LocalStorage. Mathematical calculations execute on your CPU. Zero data scraping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: How to Verify */}
        {activeTab === 'verify' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-[var(--theme-bg,#070E18)] text-[#F8FAFC] text-[13px]">
            <div className="space-y-1">
              <h3 className="font-serif-display text-[16px] font-bold text-[#F8FAFC]">
                Verify Safety Yourself in 3 Steps
              </h3>
              <p className="text-[12px] text-[#94A3B8]">
                You do not need to take our word for it. Any user or engineer can verify that no network traffic occurs using standard browser Developer Tools:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center font-bold text-[12px] shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-[#F8FAFC]">Open Developer Tools</div>
                  <p className="text-[12px] text-[#94A3B8]">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] font-mono text-[11px]">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] font-mono text-[11px]">Ctrl + Shift + I</kbd> (Mac: <kbd className="px-1.5 py-0.5 rounded bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)] font-mono text-[11px]">Cmd + Option + I</kbd>).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center font-bold text-[12px] shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-[#F8FAFC]">Inspect the &quot;Network&quot; Tab</div>
                  <p className="text-[12px] text-[#94A3B8]">
                    Switch to the <strong>Network</strong> tab. Add an income entry or delete an expense in the app. You will see <strong>0 requests</strong> being sent to any server.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center font-bold text-[12px] shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-[#F8FAFC]">Inspect the &quot;Application&quot; Tab (Storage)</div>
                  <p className="text-[12px] text-[#94A3B8]">
                    Navigate to <strong>Application → Local Storage</strong> and click your domain. Look for the key <code className="text-[var(--theme-primary,#38BDF8)] font-mono">hasvolt_khata_v1</code>. You will see all your data cleanly stored in plain JSON format on your computer or phone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11.5px] text-[#94A3B8]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Open Source Standard · MIT License · 100% Verifiable</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-primary,#38BDF8)]/40 text-[var(--theme-primary,#38BDF8)] font-bold text-[12px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <button
              onClick={handleDownloadAllSource}
              className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:text-[var(--theme-primary,#38BDF8)] font-bold text-[12px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Source</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:bg-[var(--theme-btn-hover,#0EA5E9)] text-[var(--theme-btn-text,#040D17)] font-bold text-[12.5px] cursor-pointer transition-all shadow-md active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
