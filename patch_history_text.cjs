const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

// Search bar text color
content = content.replace(
  /className="w-full bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] text-\[#F8FAFC\] placeholder-\[#64748B\] text-\[13\.5px\] sm:text-\[14\.5px\] rounded-xl pl-10 pr-8 py-2\.5 focus:outline-none shadow-sm transition-colors focus:border-\[var\(--theme-primary,#38BDF8\)\]"/g,
  'className="w-full bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] placeholder-[#64748B] text-[13.5px] sm:text-[14.5px] rounded-xl pl-10 pr-8 py-2.5 focus:outline-none shadow-sm transition-colors focus:border-[var(--theme-primary,#38BDF8)]"'
);

// Any other text-[#F8FAFC] inside HistoryView ?
content = content.replace(
  /text-\[#F8FAFC\]/g,
  'text-[var(--theme-text,#F8FAFC)]'
);

fs.writeFileSync('src/components/HistoryView.tsx', content);
