const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  /bg-gradient-to-br from-\[var\(--theme-card,#132438\)\] to-\[var\(--theme-surface,#0E1A29\)\] border border-\[\#1A1A1A\]\/70 hover:border-\[var\(--theme-primary,#38BDF8\)\]\/30/g,
  'bg-[#0F0F0F] border border-[#1F1F1F] hover:border-[var(--theme-primary,#00D26A)]/30'
);

content = content.replace(/text-\[var\(--theme-primary,#38BDF8\)\]/g, 'text-[var(--theme-primary,#00D26A)]');

fs.writeFileSync('src/components/HomeView.tsx', content);
console.log("Patched Recent Transactions");
