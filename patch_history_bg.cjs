const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

// Fix Day Container Background
content = content.replace(
  /className="w-full bg-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl sm:rounded-3xl shadow-\[0_4px_20px_rgba\(0,0,0,0\.15\)\] overflow-hidden transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\]"/g,
  'className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"'
);

// Fix Day Header Background
content = content.replace(
  /className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 bg-white\/5 border-b border-\[var\(--theme-border,#213E61\)\]\/50 backdrop-blur-sm"/g,
  'className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 bg-[var(--theme-surface,#0E1A29)]/50 border-b border-[var(--theme-border,#213E61)]/50 backdrop-blur-sm"'
);

// Fix Day Header Net text background
content = content.replace(
  /bg-black\/20 px-2 py-1 rounded-lg border border-white\/5/g,
  'bg-[var(--theme-card,#132438)] px-2 py-1 rounded-lg border border-[var(--theme-border,#213E61)]/50'
);

// Fix Entry Row hover
content = content.replace(
  /className="w-full flex items-center justify-between p-3\.5 sm:p-5 border-b border-\[var\(--theme-border,#213E61\)\]\/30 hover:bg-white\/5 transition-colors group overflow-hidden min-w-0 last:border-b-0"/g,
  'className="w-full flex items-center justify-between p-3.5 sm:p-5 border-b border-[var(--theme-border,#213E61)]/30 hover:bg-[var(--theme-surface,#0E1A29)]/50 transition-colors group overflow-hidden min-w-0 last:border-b-0"'
);

fs.writeFileSync('src/components/HistoryView.tsx', content);
