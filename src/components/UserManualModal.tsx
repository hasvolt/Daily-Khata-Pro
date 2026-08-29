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
  User
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { FUND_LABELS, FUND_ORDER, DEFAULT_PERCENTAGES, FUND_CONFIGS } from '../data/defaults';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSourceCode?: () => void;
}

interface SectionItem {
  id: string;
  title: string;
  icon: LucideIcon;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onOpenSourceCode
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const sections: SectionItem[] = [
    { id: 'intro', title: '1. Introduction & Overview', icon: Zap },
    { id: 'six_funds', title: '2. 6-Fund Formula Allocation', icon: Layers },
    { id: 'add_income', title: '3. Recording Income', icon: Coins },
    { id: 'add_expense', title: '4. Logging Expenses', icon: Receipt },
    { id: 'goals', title: '5. Financial Goal Targets', icon: Target },
    { id: 'reports', title: '6. Reports & PDF Statements', icon: FileText },
    { id: 'settings', title: '7. Custom Settings & Rules', icon: Settings },
    { id: 'backup', title: '8. Backup & Privacy Security', icon: ShieldCheck },
    { id: 'source_code', title: '9. Source Code & Trust Verification', icon: Code2 },
    { id: 'faq', title: '10. Frequently Asked Questions', icon: HelpCircle },
    { id: 'developer', title: '11. Developer & Creator Info', icon: User }
  ];

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#111A24] border border-[#253648] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#253648] flex items-center justify-between bg-[#162230]">
          <div className="flex items-center gap-3">
            <HasVoltLogo size={36} />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[18px] font-bold text-[#F8FAFC]">
                  Daily Khata: Pro — User Manual &amp; Comprehensive Guide
                </h2>
                <span className="text-[10px] font-bold bg-[#FFC700]/20 text-[#FFC700] px-2 py-0.5 rounded-full border border-[#FFC700]/40 uppercase tracking-wider">
                  Official Guide
                </span>
              </div>
              <p className="text-[12px] text-[#94A3B8]">
                Professional guidelines for systematic financial discipline &amp; wealth tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Mobile Navigation Chips */}
        <div className="px-4 py-2.5 bg-[#0B1017] border-b border-[#253648] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user guide (e.g. 6 funds, backup, goals, pdf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111A24] border border-[#253648] text-[#F8FAFC] placeholder-[#64748B] text-[12.5px] rounded-lg pl-9 pr-3 py-1.5 focus:border-[#FFC700] focus:outline-none"
            />
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1 shrink-0">
            <span>Powered by</span>
            <a
              href="https://www.hasvolt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFC700] hover:underline font-bold"
            >
              HasVolt.com
            </a>
          </div>
        </div>

        {/* Modal Main Content (Sidebar + Reader) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 bg-[#0E151E] border-r border-[#253648] p-3 overflow-y-auto shrink-0 flex md:flex-col gap-1.5 no-scrollbar max-md:flex-row max-md:overflow-x-auto max-md:py-2">
            {filteredSections.map((sec) => {
              const SecIcon = sec.icon;
              const isSelected = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-semibold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#FFC700] text-[#0B1017] shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162230]'
                  }`}
                >
                  <SecIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Reader Area */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6 text-[#94A3B8] text-[13.5px] leading-relaxed">
            {activeSection === 'intro' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#FFC700]" />
                    <span>Welcome to Daily Khata: Pro</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Your personal and enterprise financial discipline companion.
                  </p>
                </div>

                <div className="bg-[#162230] border border-[#253648] rounded-xl p-4 space-y-2.5">
                  <h4 className="text-[14px] font-bold text-[#FFC700]">
                    Core Design Philosophy
                  </h4>
                  <p>
                    Daily Khata: Pro helps freelancers, business professionals, and households implement mathematical budgeting. Every earned rupee is immediately partitioned across 6 distinct purpose-driven pots before discretionary spending occurs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1">
                    <div className="text-[12px] font-bold text-[#10B981] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Private
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      All financial data stays strictly on your local browser storage.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1">
                    <div className="text-[12px] font-bold text-[#FFC700] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Auto 6-Fund Split
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      Zero manual calculations needed when entering new earnings.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1">
                    <div className="text-[12px] font-bold text-[#38BDF8] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Clean Audit Reports
                    </div>
                    <p className="text-[11.5px] text-[#94A3B8]">
                      Download statements in print-ready PDF or raw CSV formats anytime.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'six_funds' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#FFC700]" />
                    <span>The 6-Fund Allocation Rule</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Systematic money division strategy designed for sustained financial resilience.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUND_ORDER.map((f) => {
                    const cfg = FUND_CONFIGS[f];
                    return (
                      <div key={f} className="p-3.5 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                            <span className="font-bold text-[#F8FAFC] text-[13.5px]">{FUND_LABELS[f]}</span>
                          </div>
                          <span className="text-[12px] font-mono font-bold text-[#FFC700]">{DEFAULT_PERCENTAGES[f]}%</span>
                        </div>
                        <p className="text-[11.5px] text-[#94A3B8]">{cfg.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'add_income' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#10B981]" />
                    <span>Recording Income &amp; Earnings</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    How earnings are split across your portfolio automatically.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#162230] border border-[#253648]">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">1. Enter Total Received Amount</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Input your salary, freelance payment, client advance, or profit.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#162230] border border-[#253648]">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">2. Select Income Category &amp; Payment Mode</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Choose Cash, UPI, or Bank Transfer to keep accurate liquidity logs.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#162230] border border-[#253648]">
                    <div className="text-[13px] font-bold text-[#F8FAFC]">3. Save and Review Splits</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      The system calculates the exact share for each fund pot instantly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'add_expense' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#EF4444]" />
                    <span>Logging Expenses</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Deduct outlays directly from their respective pots to maintain balance.
                  </p>
                </div>

                <p>
                  When making purchases or paying utility bills, always select the designated fund pot:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[12.5px]">
                  <li><strong className="text-[#F8FAFC]">Family Fund:</strong> Groceries, school fees, electricity &amp; house rent.</li>
                  <li><strong className="text-[#F8FAFC]">Personal Fund:</strong> Mobile recharges, dining out, personal fuel, grooming.</li>
                  <li><strong className="text-[#F8FAFC]">Emergency Fund:</strong> Urgent medical fees, unexpected hardware/vehicle repairs.</li>
                  <li><strong className="text-[#F8FAFC]">Buffer Fund:</strong> Shortfalls or petty business expenses.</li>
                </ul>
              </div>
            )}

            {activeSection === 'goals' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#FFC700]" />
                    <span>Financial Goal Targets</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Establish long-term targets and track systematic deposits.
                  </p>
                </div>

                <p>
                  Use the <strong>Goals</strong> tab to track targets such as Emergency Reserves, Vehicle Purchases, New Hardware, Gold, or Education funds. You can link any goal to a specific pot (e.g. Saving or Investment) and deposit funds incrementally.
                </p>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#FFC700]" />
                    <span>Reports &amp; PDF Export</span>
                  </h3>
                  <p className="text-[12.5px] text-[#94A3B8] mt-1">
                    Generate professional financial statements and ledger downloads.
                  </p>
                </div>

                <p>
                  Navigate through past months to view net savings, category breakdown charts, and download verified statements in PDF format or CSV spreadsheets.
                </p>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#FFC700]" />
                    <span>Custom Settings &amp; Allocation Percentages</span>
                  </h3>
                </div>

                <p>
                  You can adjust the fund percentages in the Reports settings panel to suit your specific lifestyle (e.g. higher investment percentage or lower personal allowance). Ensure the sum always equals 100%.
                </p>
              </div>
            )}

            {activeSection === 'backup' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <span>Backup &amp; Privacy Security</span>
                  </h3>
                </div>

                <p>
                  Daily Khata: Pro works entirely offline without server dependencies. To safeguard your records across devices or browser clears, click <strong>Export JSON</strong> in Settings regularly and save the file in your secure drive.
                </p>
              </div>
            )}

            {activeSection === 'source_code' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#10B981]" />
                    <span>Source Code &amp; Trust Verification</span>
                  </h3>
                  <p className="text-[12px] text-[#94A3B8] mt-1">
                    Complete transparency — Verify mathematical safety &amp; offline privacy architecture
                  </p>
                </div>

                <div className="space-y-3">
                  <p>
                    Unlike traditional cloud accounting and bookkeeping apps that store your finances on remote databases, <strong>Daily Khata: Pro</strong> is engineered as a 100% client-side application.
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#0B1017] border border-[#253648] space-y-2">
                    <div className="font-bold text-[#10B981] text-[13px]">How To Verify Security:</div>
                    <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-[#CBD5E1]">
                      <li><strong>Zero Network Calls</strong>: Open Browser DevTools (F12) → Network Tab → Add an entry. Observe 0 outbound requests.</li>
                      <li><strong>Local Storage Only</strong>: Open Application Tab → LocalStorage → Verify key <code className="text-[#38BDF8]">hasvolt_khata_v1</code>.</li>
                      <li><strong>Pure Math Calculations</strong>: All 6-Fund allocations and goal trackers execute purely on your local device CPU.</li>
                    </ul>
                  </div>

                  {onOpenSourceCode && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSourceCode();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#38BDF8]/20 border border-[#10B981]/40 text-[#F8FAFC] hover:border-[#10B981] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Code2 className="w-4 h-4 text-[#10B981]" />
                      <span>Open Interactive Source Code &amp; Security Inspector</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#FFC700]" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1">
                    <div className="font-bold text-[#F8FAFC] text-[13px]">Does Daily Khata: Pro require internet?</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      No, Daily Khata: Pro works completely offline as an autonomous local client application.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1">
                    <div className="font-bold text-[#F8FAFC] text-[13px]">Can I edit or delete old transactions?</div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Yes, every transaction in the History view can be modified or deleted at any time with recalculations occurring instantly.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B1017] border border-[#253648] space-y-2.5">
                    <div className="font-bold text-[#F8FAFC] text-[13px] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#38BDF8]" />
                      <span>Official Contact &amp; Support Channels</span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">
                      Have feedback, questions, or need assistance? Reach out directly to our official handles:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href="https://github.com/hasvolt/Daily-Khata-Pro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[#111A24] border border-[#253648] hover:border-[#10B981] text-[11.5px] text-[#CBD5E1] hover:text-[#10B981] flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate font-bold">
                          <FolderGit2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>GitHub: hasvolt/Daily-Khata-Pro</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </a>
                      <a
                        href="mailto:daily-Khata-Pro@gmail.com"
                        className="p-2.5 rounded-lg bg-[#111A24] border border-[#253648] hover:border-[#38BDF8] text-[11.5px] text-[#CBD5E1] hover:text-[#38BDF8] flex items-center gap-2 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span className="truncate">daily-Khata-Pro@gmail.com</span>
                      </a>
                      <a
                        href="https://www.instagram.com/dailykhatapro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[#111A24] border border-[#253648] hover:border-[#E1306C] text-[11.5px] text-[#CBD5E1] hover:text-[#E1306C] flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Instagram className="w-3.5 h-3.5 text-[#E1306C] shrink-0" />
                          <span>@dailykhatapro</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </a>
                      <a
                        href="https://x.com/Dailykhatapro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-[#111A24] border border-[#253648] hover:border-[#1DA1F2] text-[11.5px] text-[#CBD5E1] hover:text-[#1DA1F2] flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Twitter className="w-3.5 h-3.5 text-[#1DA1F2] shrink-0" />
                          <span>@Dailykhatapro</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'developer' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#253648] pb-3">
                  <h3 className="font-serif-display text-[20px] font-bold text-[#F8FAFC] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#38BDF8]" />
                    <span>Developer &amp; Creator Information</span>
                  </h3>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1017] border border-[#253648] space-y-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-28 h-auto max-h-36 sm:w-32 sm:max-h-40 rounded-2xl overflow-hidden border-2 border-[#38BDF8] shadow-lg bg-[#162230] p-1">
                        <img
                          src="/md-zafeer-hasan-yazdaan.jpg"
                          alt="MD Zafeer Hasan (YAZDAAN)"
                          className="w-full h-auto object-contain rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-1.5 px-2 py-0.5 rounded bg-[#10B981] text-[#04140D] text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Creator &amp; Founder</span>
                      </div>
                    </div>

                    <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h4 className="font-serif-display text-[18px] sm:text-[20px] font-bold text-[#F8FAFC]">
                          MD Zafeer Hasan
                        </h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                          (YAZDAAN)
                        </span>
                      </div>

                      <div className="text-[12.5px] font-medium text-[#38BDF8]">
                        Independent Developer, Creator &amp; Founder
                      </div>

                      <div className="text-[11.5px] text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                        <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <a href="mailto:yazdaantalk@gmail.com" className="hover:underline text-[#CBD5E1] hover:text-[#38BDF8] font-mono">
                          yazdaantalk@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mr-1">Focus:</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      Open Source
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                      Productivity
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                      Personal Finance
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                      Digital Tools
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#111A24] border border-[#253648] space-y-2 text-[12.5px] text-[#CBD5E1] leading-relaxed">
                    <p>
                      I&apos;m an independent developer focused on creating simple, practical, and privacy-conscious digital tools that are useful in everyday life.
                    </p>
                    <p>
                      This project is developed with the goal of providing a simple and accessible way for users to manage their daily income, expenses, and financial records.
                    </p>
                    <p className="text-[#F8FAFC] font-medium italic border-l-2 border-[#38BDF8] pl-2.5 text-[12px]">
                      &ldquo;I believe in building useful software that is transparent, easy to use, and accessible to everyone.&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1017] border border-[#253648] space-y-1.5 text-[11.5px]">
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="font-semibold text-[#CBD5E1]">Project:</span>
                      <span className="text-[#F8FAFC] font-bold">Daily Income &amp; Expense Tracker (Daily Khata Pro)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="font-semibold text-[#CBD5E1]">License:</span>
                      <span className="text-[#10B981] font-mono font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                        Open Source (MIT)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span className="font-semibold text-[#CBD5E1]">Support &amp; Feedback:</span>
                      <a href="mailto:yazdaantalk@gmail.com" className="text-[#38BDF8] hover:underline font-mono">
                        yazdaantalk@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href="mailto:yazdaantalk@gmail.com"
                      className="p-2.5 rounded-lg bg-[#38BDF8] hover:brightness-110 text-[#0B1017] font-bold text-[12px] flex items-center justify-center gap-2 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email: yazdaantalk@gmail.com</span>
                    </a>
                    <a
                      href="https://github.com/hasvolt/Daily-Khata-Pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-[#111A24] hover:bg-[#162230] border border-[#253648] hover:border-[#10B981] text-[#CBD5E1] hover:text-[#10B981] font-bold text-[12px] flex items-center justify-center gap-2 transition-all"
                    >
                      <FolderGit2 className="w-4 h-4 text-[#10B981]" />
                      <span>GitHub: hasvolt/Daily-Khata-Pro</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#253648] bg-[#162230] flex items-center justify-between">
          <div className="text-[11.5px] text-[#94A3B8]">
            Official HasVolt Digital Companion
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FFC700] hover:bg-[#FFD233] text-[#0B1017] font-bold text-[13px] cursor-pointer transition-colors shadow-xs"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
