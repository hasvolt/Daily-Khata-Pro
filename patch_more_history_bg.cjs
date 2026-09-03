const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

content = content.replace(
  /className="w-full bg-gradient-to-b from-\[var\(--theme-card,#132438\)\] to-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl sm:rounded-3xl shadow-\[0_4px_20px_rgba\(0,0,0,0\.15\)\] overflow-hidden transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\]"/g,
  'className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"'
);

fs.writeFileSync('src/components/HistoryView.tsx', content);
console.log("Patched more history cards bg");
