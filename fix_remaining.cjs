const fs = require('fs');

// Fix BankingCard3D
let bankingContent = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');
bankingContent = bankingContent.replace(/<div className="absolute -right-16 top-1\/2 -translate-y-1\/2 w-96 h-96 bg-\[var\(--theme-primary\)\] opacity-\[0\.12\] blur-\[100px\] pointer-events-none transform-gpu" style=\{\{ transform: "translateZ\(-20px\)" \}\}\><\/div>/g, '');
bankingContent = bankingContent.replace(/border-\[var\(--theme-border,#213E61\)\]/g, 'border-[#1C1C1E]');
fs.writeFileSync('src/components/BankingCard3D.tsx', bankingContent);

// Fix FundCard3D
let fundContent = fs.readFileSync('src/components/FundCard3D.tsx', 'utf8');
fundContent = fundContent.replace(/stroke="var\(--theme-border,#213E61\)"/g, 'stroke="#1C1C1E"');
fundContent = fundContent.replace(/hover:border-\[var\(--theme-primary,#38BDF8\)\]\/50/g, 'hover:border-[#00D26A]/50');
fs.writeFileSync('src/components/FundCard3D.tsx', fundContent);

console.log("Patched remaining fallbacks and glowing divs");
