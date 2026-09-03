const fs = require('fs');
let content = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Add 3D card wrapper class and hover effects
content = content.replace(
  /className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl p-3\.5 sm:p-5 shadow-md space-y-3\.5 min-w-0"/g,
  'className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3.5 min-w-0"'
);

content = content.replace(
  /className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl p-3\.5 sm:p-5 shadow-md space-y-3 min-w-0"/g,
  'className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3 min-w-0"'
);

content = content.replace(
  /className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl p-3\.5 sm:p-5 shadow-md space-y-3\.5 w-full min-w-0 overflow-hidden"/g,
  'className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[var(--theme-primary,#38BDF8)]/30 transition-all duration-300 space-y-3.5 w-full min-w-0 overflow-hidden"'
);

fs.writeFileSync('src/components/ReportView.tsx', content);
console.log("Patched ReportView");
