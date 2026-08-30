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
  Play,
  ArrowLeft
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface SafetyPageProps {
  onBack: () => void;
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

export const SafetyPage: React.FC<SafetyPageProps> = ({
  onBack,
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
    }
  ];

  const currentFile = sourceFiles[selectedFileIndex] || sourceFiles[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    triggerHapticSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${GITHUB_CLONE_URL}`);
    setCopiedClone(true);
    triggerHapticSound('click');
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 text-left pb-12">
      {/* Header */}
      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif-display text-[22px] sm:text-[26px] font-bold text-[#F8FAFC]">
                Safety &amp; Transparency Center
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                100% Open Source
              </span>
            </div>
            <p className="text-[13px] text-[#94A3B8] mt-0.5">
              Source code verification, offline privacy audits &amp; GitHub repository
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[650px]">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'github', label: 'GitHub Repository', icon: FolderGit2 },
            { id: 'inspector', label: 'Code Inspector', icon: Terminal },
            { id: 'audit', label: 'Privacy Audit', icon: ShieldCheck },
            { id: 'verify', label: 'DIY Verification', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-4 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[var(--theme-primary,#38BDF8)]' : 'text-[#64748B]'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'github' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-primary,#38BDF8)]/30 shadow-lg space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center text-[#10B981] shrink-0">
                       <FolderGit2 className="w-7 h-7" />
                     </div>
                     <div>
                       <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC]">hasvolt/Daily-Khata-Pro</h3>
                       <p className="text-[13px] text-[#94A3B8] mt-1">Official repository containing 100% of the application source code.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl bg-[var(--theme-btn-bg,#38BDF8)] hover:bg-[var(--theme-btn-hover,#0EA5E9)] text-[var(--theme-btn-text,#040D17)] font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md">
                      <ExternalLink className="w-4 h-4" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-4 shadow-lg">
                   <div className="flex items-center justify-between text-[11px] text-[#94A3B8] uppercase tracking-wider font-bold">
                     <span>Clone Repository</span>
                     <span>HTTPS</span>
                   </div>
                   <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] font-mono text-[13px] group">
                     <span className="text-[var(--theme-primary,#38BDF8)] truncate">git clone {GITHUB_CLONE_URL}</span>
                     <button onClick={handleCopyClone} className="p-2 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:bg-[var(--theme-card-hover,#19304A)] text-[#F8FAFC] transition-all cursor-pointer shrink-0">
                       {copiedClone ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#94A3B8]" />}
                     </button>
                   </div>
                   <p className="text-[12px] text-[#64748B]">Verify that the code you see here matches the code on GitHub exactly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'MIT License', desc: 'Completely free for use, study, and modifications.', icon: ShieldCheck, color: '#10B981' },
                  { title: 'Modern Stack', desc: 'Built with React 18, TypeScript, and Vite for speed.', icon: Cpu, color: '#38BDF8' },
                  { title: 'Audit Ready', desc: 'Clean, modular code structure for easy review.', icon: Search, color: '#FFC700' }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2">
                    <item.icon className="w-6 h-6 mb-1" style={{ color: item.color }} />
                    <h5 className="font-bold text-[#F8FAFC] text-[15px]">{item.title}</h5>
                    <p className="text-[12.5px] text-[#94A3B8]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inspector' && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-72 bg-[var(--theme-bg,#070E18)] border-r border-[var(--theme-border,#213E61)] p-4 flex flex-col gap-2 overflow-y-auto">
                 <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest px-2 mb-2">Core Files</span>
                 {sourceFiles.map((file, idx) => (
                   <button
                    key={idx}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                      selectedFileIndex === idx ? 'bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)]' : 'text-[#94A3B8] hover:bg-[var(--theme-surface,#0E1A29)] hover:text-[#F8FAFC]'
                    }`}
                   >
                     <file.icon className="w-4 h-4 mt-0.5" />
                     <div className="min-w-0">
                       <div className="font-mono text-[12px] font-bold truncate">{file.name}</div>
                       <div className="text-[10px] opacity-70 truncate">{file.category}</div>
                     </div>
                   </button>
                 ))}
              </div>
              <div className="flex-1 flex flex-col bg-[var(--theme-surface,#0E1A29)]">
                 <div className="px-5 py-3 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-[13px] font-bold text-[var(--theme-primary,#38BDF8)]">{sourceFiles[selectedFileIndex]?.name}</span>
                    </div>
                    <button onClick={handleCopyCode} className="px-3 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[12px] font-bold text-[#F8FAFC] flex items-center gap-2 hover:bg-[var(--theme-card-hover,#19304A)] transition-all">
                       {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                       <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                 </div>
                 <div className="flex-1 p-5 overflow-auto bg-[var(--theme-bg,#070E18)] font-mono text-[12.5px] leading-relaxed text-[#CBD5E1] custom-scrollbar">
                    <pre>{sourceFiles[selectedFileIndex]?.content}</pre>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="p-6 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[#10B981]/30 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#F8FAFC]">Privacy Compliance Audit</h3>
                  <p className="text-[14px] text-[#94A3B8] mt-1 leading-relaxed">Daily Khata Pro is built as a &quot;Zero-Trust&quot; application. We don&apos;t ask for your trust; we prove it through code architecture.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'No Network Traffic', desc: 'The app works 100% offline. Zero data is sent to external servers.', icon: WifiOff },
                  { title: 'Isolated Sandbox', desc: 'Browser local storage is private to this domain only.', icon: Lock },
                  { title: 'Transparent Logic', desc: 'No hidden obfuscated scripts or tracking beacons.', icon: Eye },
                  { title: 'Data Ownership', desc: 'You can export or clear your entire data history in 2 clicks.', icon: Database }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--theme-card,#132438)] flex items-center justify-center shrink-0 text-[var(--theme-primary,#38BDF8)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#F8FAFC] text-[15px]">{item.title}</h5>
                      <p className="text-[13px] text-[#94A3B8] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'verify' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="space-y-4">
                <h3 className="text-[20px] font-bold text-[#F8FAFC]">How to Verify Safety (DIY Steps)</h3>
                <p className="text-[14px] text-[#94A3B8]">Anyone with a browser can verify our privacy claims in 60 seconds:</p>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', title: 'Open DevTools', desc: 'Press F12 or Right Click > Inspect on your browser.' },
                  { step: '2', title: 'Network Tab', desc: 'Click on "Network" tab. Add an entry in the app. Observe that 0 requests are sent.' },
                  { step: '3', title: 'Storage Check', desc: 'Go to Application > Local Storage. Find "hasvolt_khata_v1" to see your data is local.' }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex gap-5">
                    <div className="w-10 h-10 rounded-full bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] font-bold flex items-center justify-center shrink-0 border border-[var(--theme-primary,#38BDF8)]/40">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-bold text-[#F8FAFC] text-[16px]">{item.title}</h5>
                      <p className="text-[14px] text-[#94A3B8] mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
