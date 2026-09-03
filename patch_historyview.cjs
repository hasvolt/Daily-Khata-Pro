const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

// Replace the Day Header and Day Items List container structure
content = content.replace(
  /<div key=\{dateStr\} className="space-y-2\.5 w-full">\s*\{\/\* Day Header \*\/\}\s*<div className="flex justify-between items-center px-1 text-\[13px\] sm:text-\[14px\] text-\[#94A3B8\]">\s*<span className="font-bold text-\[#F8FAFC\] flex items-center gap-2">\s*<Calendar className="w-4 h-4 text-\[var\(--theme-primary,#38BDF8\)\]" \/>\s*<span>\{dayLabel\}<\/span>\s*<\/span>\s*<span className="font-mono text-\[#94A3B8\]">\s*Net: <span className=\{dayNet < 0 \? 'text-\[#EF4444\] font-bold' : 'text-\[#10B981\] font-bold'\}>\{formatCurrency\(dayNet, privacyMask\)\}<\/span>\s*<\/span>\s*<\/div>\s*\{\/\* Day Items List \*\/\}\s*<div className="space-y-2\.5 w-full">/g,
  `<div key={dateStr} className="w-full bg-gradient-to-b from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                {/* Day Header */}
                <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border-b border-[var(--theme-border,#213E61)]/50 backdrop-blur-sm">
                  <span className="font-bold text-[#F8FAFC] flex items-center gap-2 text-[13px] sm:text-[14px]">
                    <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/20 shadow-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
                    </div>
                    <span>{dayLabel}</span>
                  </span>
                  <span className="font-mono text-[11px] sm:text-[12.5px] font-semibold text-[#94A3B8] bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                    Net: <span className={dayNet < 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}>{formatCurrency(dayNet, privacyMask)}</span>
                  </span>
                </div>

                {/* Day Items List */}
                <div className="flex flex-col w-full">`
);

// We need to replace the closing tags for this block.
// The original was closing the map function.
// Let's first replace the individual entry container.
content = content.replace(
  /<div\s*key=\{entry\.id\}\s*id=\{`entry-row-\$\{entry\.id\}`\}\s*className="w-full flex items-center justify-between bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] hover:border-\[var\(--theme-primary,#38BDF8\)\]\/50 rounded-2xl p-3 sm:p-4 shadow-sm transition-all group overflow-hidden min-w-0"\s*>/g,
  `<div
                        key={entry.id}
                        id={\`entry-row-\${entry.id}\`}
                        className="w-full flex items-center justify-between p-3.5 sm:p-5 border-b border-[var(--theme-border,#213E61)]/30 hover:bg-white/5 transition-colors group overflow-hidden min-w-0 last:border-b-0"
                      >`
);

// We don't need to replace the closing </div> of Day Items List because in the original,
// it was <div className="space-y-2.5 w-full">...</div>, and my replacement also opens a <div className="flex flex-col w-full">
// So the original </div> closing tags will still correctly close the day structure.

fs.writeFileSync('src/components/HistoryView.tsx', content);
