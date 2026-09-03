const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

// Update entry row to have a 3D animated effect
content = content.replace(
  /<div\s*key=\{entry\.id\}\s*id=\{\`entry-row-\$\{entry\.id\}\`\}\s*className="w-full flex items-center justify-between bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] hover:border-\[var\(--theme-primary,#38BDF8\)\]\/50 rounded-2xl p-3 sm:p-4 shadow-sm transition-all group overflow-hidden min-w-0"\s*>/g,
  `<div
                        key={entry.id}
                        id={\`entry-row-\${entry.id}\`}
                        className="w-full flex items-center justify-between bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/50 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] group overflow-hidden min-w-0 cursor-pointer"
                      >`
);

fs.writeFileSync('src/components/HistoryView.tsx', content);
console.log("Patched HistoryView");
