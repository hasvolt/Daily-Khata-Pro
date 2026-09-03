const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// Remove Mastercard circles
content = content.replace(
  /<div className="flex items-center gap-1 opacity-50">\s*<div className="w-6 h-6 rounded-full bg-\[var\(--theme-text,#F8FAFC\)\]\/10"><\/div>\s*<div className="w-6 h-6 rounded-full bg-\[var\(--theme-text,#F8FAFC\)\]\/10 -ml-3"><\/div>\s*<\/div>/,
  ''
);

// Fix Date format
content = content.replace(
  /className="text-\[10px\] sm:text-\[12px\] font-bold text-\[var\(--theme-text,#F8FAFC\)\] bg-\[var\(--theme-surface,#0E1A29\)\]\/50 px-3 py-1 rounded-full border border-\[var\(--theme-border,#213E61\)\] shadow-sm backdrop-blur-md"/,
  'className="text-[10px] sm:text-[11px] font-medium text-[var(--theme-text-muted,#94A3B8)]"'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
console.log("Patched BankingCard3D");
