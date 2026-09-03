const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Replace the percentage text in primary and overflow funds with circular progress
const progressRingCode = `
                        <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--theme-border,#213E61)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" stroke={config.color} strokeWidth="3" strokeDasharray="94.248" strokeDashoffset={94.248 - (94.248 * pct) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                          </svg>
                          <span className="absolute text-[7px] sm:text-[9px] font-mono font-bold text-[var(--theme-text,#F8FAFC)]">{pct}%</span>
                        </div>
`;

content = content.replace(
  /<span className="text-\[9px\] sm:text-\[11\.5px\] text-\[var\(--theme-text,#F8FAFC\)\] font-mono font-bold bg-\[var\(--theme-surface,#070E18\)\] px-1\.5 py-0\.5 rounded border border-\[var\(--theme-border,#213E61\)\] shrink-0">\s*\{pct\}%\s*<\/span>/g,
  progressRingCode
);

// Add hover states and gradient to the fund cards (both primary and overflow)
content = content.replace(
  /className="group bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] hover:border-\[var\(--theme-primary,#38BDF8\)\] rounded-lg sm:rounded-2xl p-2 sm:p-3\.5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0\.5 active:scale-\[0\.98\] text-left flex flex-col justify-between min-h-\[92px\] sm:min-h-\[135px\] min-w-0 w-full overflow-hidden"/g,
  `className="group relative bg-gradient-to-b from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-lg sm:rounded-2xl p-2 sm:p-3.5 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-[0.98] text-left flex flex-col justify-between min-h-[92px] sm:min-h-[135px] min-w-0 w-full overflow-hidden"`
);

// Add sparklines for Today's Net
content = content.replace(
  /<div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\]\/60 text-\[10px\] sm:text-\[12\.5px\] min-w-0 overflow-hidden">\s*<span className="text-\[var\(--theme-text-muted,#94A3B8\)\] font-medium truncate mr-1\.5">\{pageT\.common\.todaysNet\}<\/span>\s*<span className=\{`font-mono font-bold text-\[11px\] sm:text-\[13\.5px\] truncate max-w-\[60%\] text-right \$\{todayStats\.net >= 0 \? 'text-\[#10B981\]' : 'text-\[#EF4444\]'\} `\} title=\{formatCurrency\(todayStats\.net, privacyMask\)\}>\s*\{todayStats\.net >= 0 \? '\+' : ''\}\{formatCurrency\(todayStats\.net, privacyMask\)\}\s*<\/span>\s*<\/div>/,
  `<div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/60 text-[10px] sm:text-[12.5px] min-w-0 overflow-hidden relative">
            <span className="text-[var(--theme-text-muted,#94A3B8)] font-medium truncate mr-1.5 z-10">{pageT.common.todaysNet}</span>
            <div className="absolute left-1/3 opacity-20 pointer-events-none">
              <svg width="40" height="15" viewBox="0 0 40 15" fill="none">
                <path d={todayStats.net >= 0 ? "M0 12 Q 10 5, 20 8 T 40 2" : "M0 2 Q 10 8, 20 5 T 40 12"} stroke={todayStats.net >= 0 ? "#10B981" : "#EF4444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={\`font-mono font-bold text-[11px] sm:text-[14px] truncate max-w-[60%] text-right z-10 \${todayStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}\`} title={formatCurrency(todayStats.net, privacyMask)}>
              {todayStats.net >= 0 ? '+' : ''}{formatCurrency(todayStats.net, privacyMask)}
            </span>
          </div>`
);

// Add sparklines for Month Net
content = content.replace(
  /<div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\]\/60 text-\[10px\] sm:text-\[12\.5px\] min-w-0 overflow-hidden">\s*<span className="text-\[var\(--theme-text-muted,#94A3B8\)\] font-medium truncate mr-1\.5">\{pageT\.common\.monthNet\}<\/span>\s*<span className=\{`font-mono font-bold text-\[11px\] sm:text-\[13\.5px\] truncate max-w-\[60%\] text-right \$\{monthStats\.net >= 0 \? 'text-\[#10B981\]' : 'text-\[#EF4444\]'\} `\} title=\{formatCurrency\(monthStats\.net, privacyMask\)\}>\s*\{monthStats\.net >= 0 \? '\+' : ''\}\{formatCurrency\(monthStats\.net, privacyMask\)\}\s*<\/span>\s*<\/div>/,
  `<div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/60 text-[10px] sm:text-[12.5px] min-w-0 overflow-hidden relative">
            <span className="text-[var(--theme-text-muted,#94A3B8)] font-medium truncate mr-1.5 z-10">{pageT.common.monthNet}</span>
            <div className="absolute left-1/3 opacity-20 pointer-events-none">
              <svg width="60" height="15" viewBox="0 0 60 15" fill="none">
                <path d={monthStats.net >= 0 ? "M0 12 Q 15 2, 30 7 T 60 2" : "M0 2 Q 15 12, 30 7 T 60 12"} stroke={monthStats.net >= 0 ? "#10B981" : "#EF4444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={\`font-mono font-bold text-[11px] sm:text-[14px] truncate max-w-[60%] text-right z-10 \${monthStats.net >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}\`} title={formatCurrency(monthStats.net, privacyMask)}>
              {monthStats.net >= 0 ? '+' : ''}{formatCurrency(monthStats.net, privacyMask)}
            </span>
          </div>`
);

// Add Tabular Bold to 6-Fund Pots values
content = content.replace(
  /className=\{`font-mono text-\[11px\] xs:text-\[12px\] sm:text-\[14px\] font-bold tracking-tight truncate max-w-full block mt-0\.5 \$\{/g,
  `className={\`font-mono text-[12px] xs:text-[13px] sm:text-[16px] font-extrabold tracking-tight truncate max-w-full block mt-0.5 \${`
);

fs.writeFileSync('src/components/HomeView.tsx', content);
