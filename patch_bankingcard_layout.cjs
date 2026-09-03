const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// The header part
const regex = /<div className="flex items-center justify-between">\s*<div className="flex items-center gap-2">[\s\S]*?<\/div>\s*<span className="text-\[9px\] sm:text-\[10px\] font-semibold tracking-wider text-\[var\(--theme-text,#F8FAFC\)\]\/70 bg-\[var\(--theme-text,#F8FAFC\)\]\/5 px-2\.5 sm:px-3 py-1 rounded-full border border-\[var\(--theme-text,#F8FAFC\)\]\/10 backdrop-blur-md\">\s*\{dateFormatted\}\s*<\/span>\s*<\/div>/;

const replacement = `
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--theme-text,#F8FAFC)]/10 backdrop-blur-md">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-text,#F8FAFC)]" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-bold tracking-widest text-[var(--theme-text,#F8FAFC)]/90 uppercase">
                {t.home.netBalance}
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[var(--theme-text,#F8FAFC)]/50 uppercase">
              {dateFormatted}
            </div>
          </div>`;

content = content.replace(/<div className="flex items-center justify-between">\s*<div className="flex items-center gap-2">[\s\S]*?<\/div>\s*<span className="[^"]*">\s*\{dateFormatted\}\s*<\/span>\s*<\/div>/, replacement);

// Make the background gradient fixed
content = content.replace(
  /className="relative bg-gradient-to-br from-\[var\(--theme-card,#132438\)\] to-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-\[0_20px_40px_rgba\(0,0,0,0\.15\)\] overflow-hidden cursor-crosshair"/,
  'className="relative bg-gradient-to-br from-[#121212] via-[#0D0D0D] to-[#000000] border border-[#2A2A2A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden cursor-crosshair"'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
console.log("Patched BankingCard layout");
