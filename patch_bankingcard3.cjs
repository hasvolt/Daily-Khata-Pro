const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// Remove SIM Card SVG completely
content = content.replace(
  /<div className="absolute top-6 right-6 sm:top-8 sm:right-8 opacity-\[0\.15\] pointer-events-none transform-gpu" style=\{\{ transform: "translateZ\(-10px\)" \}\}>\s*<svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http:\/\/www\.w3\.org\/2000\/svg">\s*<path d="M4 0C1\.79086 0 0 1\.79086 0 4V26C0 28\.2091 1\.79086 30 4 30H36C38\.2091 30 40 28\.2091 40 26V4C40 1\.79086 38\.2091 0 36 0H4ZM6 4H10V10H6V4ZM14 4H26V10H14V4ZM30 4H34V10H30V4ZM6 12H10V18H6V12ZM14 12H26V18H14V12ZM30 12H34V18H30V12ZM6 20H10V26H6V20ZM14 20H26V26H14V20ZM30 20H34V26H30V20Z" fill="currentColor"\/>\s*<\/svg>\s*<\/div>/,
  ''
);

// Format Date as a pill
content = content.replace(
  /<span className="text-\[10px\] sm:text-\[11px\] font-medium text-\[var\(--theme-text-muted,#94A3B8\)\]">\s*\{dateFormatted\}\s*<\/span>/,
  '<span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-[var(--theme-text,#F8FAFC)]/70 bg-[var(--theme-text,#F8FAFC)]/5 px-2.5 sm:px-3 py-1 rounded-full border border-[var(--theme-text,#F8FAFC)]/10 backdrop-blur-md">\n              {dateFormatted}\n            </span>'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
console.log("Patched BankingCard3D again");
