const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Replace standard stats grid with exactly the reference layout
// Search for "<div className="grid grid-cols-2 gap-2 sm:gap-3.5 min-w-0">" ... wait, the current layout already has it but colors are wrong.
// Let's patch the text colors and backgrounds.
content = content.replace(/bg-\[var\(--theme-surface,#070E18\)\]/g, 'bg-[#0A0A0A]');
content = content.replace(/border-\[var\(--theme-border,#213E61\)\]/g, 'border-[#1A1A1A]');

// Fix Income green to bright green
content = content.replace(/text-\[\#10B981\]/g, 'text-[#00D26A]');
content = content.replace(/stroke-\[\#10B981\]/g, 'stroke-[#00D26A]');
// Fix Expense red to bright red
content = content.replace(/text-\[\#EF4444\]/g, 'text-[#FF334B]');
content = content.replace(/stroke-\[\#EF4444\]/g, 'stroke-[#FF334B]');

// Wait, the icons inside are inside a box.
// In the current code:
// <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-[#10B981]/15 text-[#10B981]">
content = content.replace(/bg-\[\#10B981\]\/15/g, 'bg-[#00D26A]/10');
content = content.replace(/bg-\[\#EF4444\]\/15/g, 'bg-[#FF334B]/10');

// Fix "Today (Daily)" card header layout
// Current:
// <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
//   <div className="p-1 sm:p-1.5 rounded-lg bg-[var(--theme-surface,#070E18)] border border-[var(--theme-border,#213E61)]">
//     <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-text-muted,#94A3B8)]" />
//   </div>
//   <span className="font-bold text-[12px] sm:text-[14px] text-[var(--theme-text,#F8FAFC)] truncate">{t.home.todayDaily}</span>
// </div>
// It matches reasonably well.

// What about "Today's Net"?
// The text should be text-[var(--theme-text-muted)]
content = content.replace(/text-\[\#10B981\]/g, 'text-[#00D26A]'); // did this already

// 6-Fund Money Pots
// The reference has a dark background for each pot card.
content = content.replace(/bg-\[var\(--theme-card,#132438\)\]/g, 'bg-[#0F0F0F]');
content = content.replace(/bg-\[var\(--theme-surface,#0E1A29\)\]/g, 'bg-[#0A0A0A]');

// Fix header border
content = content.replace(/border-b border-\[var\(--theme-border,#213E61\)\]/g, 'border-b border-[#1A1A1A]');


fs.writeFileSync('src/components/HomeView.tsx', content);
console.log("Patched HomeView colors");
