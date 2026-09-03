const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// Update background classes to use theme variables
content = content.replace(
  /className="relative bg-gradient-to-br from-\[#0a192f\] via-\[#112240\] to-\[#020c1b\] border border-\[var\(--theme-border,#213E61\)\]\/50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-\[0_20px_40px_rgba\(0,0,0,0\.4\)\] overflow-hidden cursor-crosshair"/g,
  'className="relative bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden cursor-crosshair"'
);

// Update Header Text colors
content = content.replace(
  /text-white\/80/g,
  'text-[var(--theme-text,#F8FAFC)]/80'
);

content = content.replace(
  /text-white\/60/g,
  'text-[var(--theme-text,#F8FAFC)]/60'
);

content = content.replace(
  /bg-white\/5/g,
  'bg-[var(--theme-text,#F8FAFC)]/5'
);

content = content.replace(
  /border-white\/10/g,
  'border-[var(--theme-border,#213E61)]/50'
);

content = content.replace(
  /text-white\/50/g,
  'text-[var(--theme-text-muted,#94A3B8)]'
);

content = content.replace(
  /text-white tracking-tight/g,
  'text-[var(--theme-text,#F8FAFC)] tracking-tight'
);

// Update Buttons text
content = content.replace(
  /<span>Deposit<\/span>/g,
  '<span>Add Income</span>'
);

content = content.replace(
  /<span>Withdraw<\/span>/g,
  '<span>Add Expense</span>'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
console.log("Patched BankingCard3D");
