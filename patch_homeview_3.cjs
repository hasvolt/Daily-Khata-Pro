const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Add sparklines for Today's Net
content = content.replace(
  /<div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\]\/60 text-\[10px\] sm:text-\[12\.5px\] min-w-0 overflow-hidden">\s*<span className="text-\[var\(--theme-text-muted,#94A3B8\)\] font-medium truncate mr-1\.5">\{pageT\.common\.todaysNet\}<\/span>\s*<span className=\{`font-mono font-bold text-\[11px\] sm:text-\[13\.5px\] truncate max-w-\[60%\] text-right \$\{todayStats\.net >= 0 \? 'text-\[#10B981\]' : 'text-\[#EF4444\]'\}`\} title=\{formatCurrency\(todayStats\.net, privacyMask\)\}>\s*\{todayStats\.net >= 0 \? '\+' : ''\}\{formatCurrency\(todayStats\.net, privacyMask\)\}\s*<\/span>\s*<\/div>/,
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
  /<div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\]\/60 text-\[10px\] sm:text-\[12\.5px\] min-w-0 overflow-hidden">\s*<span className="text-\[var\(--theme-text-muted,#94A3B8\)\] font-medium truncate mr-1\.5">\{pageT\.common\.monthNet\}<\/span>\s*<span className=\{`font-mono font-bold text-\[11px\] sm:text-\[13\.5px\] truncate max-w-\[60%\] text-right \$\{monthStats\.net >= 0 \? 'text-\[#10B981\]' : 'text-\[#EF4444\]'\}`\} title=\{formatCurrency\(monthStats\.net, privacyMask\)\}>\s*\{monthStats\.net >= 0 \? '\+' : ''\}\{formatCurrency\(monthStats\.net, privacyMask\)\}\s*<\/span>\s*<\/div>/,
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

fs.writeFileSync('src/components/HomeView.tsx', content);
