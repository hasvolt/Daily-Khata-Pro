const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// 1. Total Net Balance Banner Replacement
content = content.replace(
  /\{\/\* 1\. TOTAL NET BALANCE BANNER \*\/\}\n\s*<div className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-xl sm:rounded-3xl p-3 sm:p-6 md:p-7 shadow-xl relative overflow-hidden transition-all">/,
  `{/* 1. TOTAL NET BALANCE BANNER */}
      <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] via-[var(--theme-surface,#0E1A29)] to-[#0B1524] border border-[var(--theme-border,#213E61)]/80 rounded-xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all">
        {/* Glassmorphism Glows */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-[var(--theme-primary,#38BDF8)] to-[#8B5CF6] opacity-[0.08] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-br from-[#10B981] to-[#3B82F6] opacity-[0.06] rounded-full blur-3xl pointer-events-none"></div>`
);

// Net Balance Heading
content = content.replace(
  /<span className="text-\[10px\] sm:text-\[13px\] font-extrabold uppercase tracking-widest text-\[var\(--theme-primary,#38BDF8\)\] flex items-center gap-1 sm:gap-1\.5">\s*<Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-\[var\(--theme-primary,#38BDF8\)\]" \/>\s*<span>\{t\.home\.netBalance\}<\/span>\s*<\/span>\s*<span className="text-\[9px\] sm:text-\[11px\] font-semibold text-\[var\(--theme-text-muted,#94A3B8\)\] bg-\[var\(--theme-surface,#070E18\)\] px-1\.5 py-0\.5 sm:px-2 sm:py-0\.5 rounded-full border border-\[var\(--theme-border,#213E61\)\]">/g,
  `<span className="text-[11.5px] sm:text-[14px] font-semibold tracking-normal text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 sm:gap-2">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/20 shadow-sm">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
                </div>
                <span>{t.home.netBalance}</span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-medium text-[var(--theme-text-muted,#94A3B8)] bg-[var(--theme-surface,#070E18)]/40 px-2 sm:px-3 py-1 rounded-full border border-[var(--theme-border,#213E61)] backdrop-blur-sm shadow-inner">`
);

// Net Balance Value
content = content.replace(
  /<div className="font-serif-display text-\[18px\] xs:text-\[20px\] sm:text-\[28px\] md:text-\[34px\] font-bold/g,
  `<div className="font-mono text-[24px] xs:text-[28px] sm:text-[38px] md:text-[46px] font-extrabold`
);

// Add Buttons Micro-interactions (hover, active scale, transition)
content = content.replace(
  /className="py-2 sm:py-2\.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] hover:bg-\[#10B981\]\/15 border border-\[var\(--theme-border,#213E61\)\] hover:border-\[#10B981\] text-\[#10B981\] font-bold text-\[11\.5px\] sm:text-\[13px\] flex items-center justify-center gap-1\.5 sm:gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"/g,
  `className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[#10B981] hover:text-[#04140D] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[#10B981] font-bold text-[11.5px] sm:text-[13px] flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95 active:shadow-none transition-all duration-200 cursor-pointer whitespace-nowrap"`
);

content = content.replace(
  /className="py-2 sm:py-2\.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] hover:bg-\[#EF4444\]\/15 border border-\[var\(--theme-border,#213E61\)\] hover:border-\[#EF4444\] text-\[#EF4444\] font-bold text-\[11\.5px\] sm:text-\[13px\] flex items-center justify-center gap-1\.5 sm:gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"/g,
  `className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[#EF4444] hover:text-[#fff] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-[var(--theme-border,#213E61)] hover:border-[#EF4444] text-[#EF4444] font-bold text-[11.5px] sm:text-[13px] flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95 active:shadow-none transition-all duration-200 cursor-pointer whitespace-nowrap"`
);

// 2. DAILY & MONTHLY
content = content.replace(
  /<div className="flex items-center gap-1\.5 sm:gap-2 text-\[10\.5px\] sm:text-\[13px\] font-extrabold uppercase tracking-wider text-\[var\(--theme-primary,#38BDF8\)\]">\s*<div className="p-1 sm:p-1\.5 rounded-md sm:rounded-lg bg-\[var\(--theme-primary,#38BDF8\)\]\/15">\s*<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-\[var\(--theme-primary,#38BDF8\)\]" \/>\s*<\/div>\s*<span className="truncate">\{t\.home\.dailySummaryHeading\}<\/span>\s*<\/div>/g,
  `<div className="flex items-center gap-1.5 sm:gap-2 text-[11.5px] sm:text-[14px] font-semibold tracking-normal text-[var(--theme-text,#F8FAFC)]">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/20 shadow-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
              </div>
              <span className="truncate">{t.home.dailySummaryHeading}</span>
            </div>`
);

content = content.replace(
  /<div className="flex items-center gap-1\.5 sm:gap-2 text-\[10\.5px\] sm:text-\[13px\] font-extrabold uppercase tracking-wider text-\[var\(--theme-text-muted,#94A3B8\)\] min-w-0">\s*<div className="p-1 sm:p-1\.5 rounded-md sm:rounded-lg bg-\[var\(--theme-primary,#38BDF8\)\]\/15 text-\[var\(--theme-primary,#38BDF8\)\] shrink-0">\s*<CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" \/>\s*<\/div>\s*<span className="truncate">\{t\.home\.monthlySummaryHeading\}<\/span>\s*<\/div>/g,
  `<div className="flex items-center gap-1.5 sm:gap-2 text-[11.5px] sm:text-[14px] font-semibold tracking-normal text-[var(--theme-text,#F8FAFC)] min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/20 shadow-sm text-[var(--theme-primary,#38BDF8)] shrink-0">
                <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="truncate">{t.home.monthlySummaryHeading}</span>
            </div>`
);

// Today's Net (add sparkline)
content = content.replace(
  /<div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\]\/60 text-\[10px\] sm:text-\[12\.5px\] min-w-0 overflow-hidden">\s*<span className="text-\[var\(--theme-text-muted,#94A3B8\)\] font-medium truncate mr-1\.5">\{pageT\.common\.todaysNet\}<\/span>\s*<span className=\{`font-mono font-bold text-\[11px\] sm:text-\[13\.5px\] truncate max-w-\[60%\] text-right \$\{todayStats\.net >= 0 \? 'text-\[#10B981\]' : 'text-\[#EF4444\]'\} `\}/, // this regex has issue, better to replace just the container
  `` // I'll do this carefully via string split or multiple replaces
);

fs.writeFileSync('src/components/HomeView.tsx', content);
