const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const regex = /<div className="flex flex-col text-left min-w-0">[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `
          <div className="flex flex-col text-left min-w-0 justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                onClick={() => onSelectTab && onSelectTab('home')}
                className="font-bold text-[15px] sm:text-[18px] tracking-tight cursor-pointer transition-colors truncate text-white"
              >
                Daily Khata Pro
              </span>
              <span
                className="inline-flex text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded-sm transition-colors tracking-widest"
                style={{
                  backgroundColor: 'var(--theme-primary, #00D26A)',
                  color: '#000000',
                }}
              >
                OFFICIAL
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted,#94A3B8)] truncate tracking-wide mt-0.5">
              Income & Expense Tracker <span className="mx-1 opacity-50">•</span> e-Fund Ledger
            </span>
          </div>`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/Header.tsx', content);
console.log("Patched Header");
