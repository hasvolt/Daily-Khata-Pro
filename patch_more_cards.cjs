const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  /className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-xl sm:rounded-3xl p-2\.5 sm:p-5 shadow-md space-y-2 sm:space-y-4"/g,
  'className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/30 rounded-xl sm:rounded-3xl p-2.5 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 space-y-2 sm:space-y-4"'
);

content = content.replace(
  /className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-xl sm:rounded-3xl p-2\.5 sm:p-5 shadow-md space-y-2 sm:space-y-4 min-w-0 overflow-hidden"/g,
  'className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)]/30 rounded-xl sm:rounded-3xl p-2.5 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 space-y-2 sm:space-y-4 min-w-0 overflow-hidden"'
);

content = content.replace(
  /className="bg-\[var\(--theme-card,#132438\)\]\/80 border border-\[var\(--theme-border,#213E61\)\]\/70 rounded-lg sm:rounded-2xl p-2 sm:p-4 space-y-2 sm:space-y-3 mt-1"/g,
  'className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 hover:border-[var(--theme-primary,#38BDF8)]/30 rounded-lg sm:rounded-2xl p-2 sm:p-4 hover:shadow-lg transition-all duration-300 space-y-2 sm:space-y-3 mt-1"'
);

fs.writeFileSync('src/components/HomeView.tsx', content);
console.log("Patched more cards in HomeView");
