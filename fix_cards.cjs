const fs = require('fs');

// Fix BankingCard3D
let bankingContent = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// Remove floating chip
bankingContent = bankingContent.replace(/\{\/\* Floating Banking Chip \/ Accents \*\/\}[\s\S]*?<\/svg>\s*<\/div>/, '');

// Fix Action Buttons
bankingContent = bankingContent.replace(/bg-\[\#10B981\]/g, 'bg-[#00E676]');
bankingContent = bankingContent.replace(/hover:bg-\[\#059669\]/g, 'hover:bg-[#00C853]');
bankingContent = bankingContent.replace(/shadow-\[0_4px_15px_rgba\(16,185,129,0\.3\)\]/g, 'shadow-[0_4px_15px_rgba(0,230,118,0.3)]');
bankingContent = bankingContent.replace(/text-white/g, 'text-[#0A0A0A]');

bankingContent = bankingContent.replace(/bg-\[\#EF4444\]/g, 'bg-[#FF334B]');
bankingContent = bankingContent.replace(/hover:bg-\[\#DC2626\]/g, 'hover:bg-[#FF1733]');
bankingContent = bankingContent.replace(/shadow-\[0_4px_15px_rgba\(239,68,68,0\.3\)\]/g, 'shadow-[0_4px_15px_rgba(255,51,75,0.3)]');
bankingContent = bankingContent.replace(/text-\[\#0A0A0A\] font-bold text-\[12px\] sm:text-\[14px\] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-\[0_4px_15px_rgba\(255,51,75,0\.3\)\]/g, 'text-white font-bold text-[12px] sm:text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(255,51,75,0.3)]'); // Fix the text color for expense button specifically

// Replace the full button block to be safe
bankingContent = bankingContent.replace(/<div className="flex items-center gap-3">[\s\S]*?<\/div>/, `<div className="flex items-center gap-3 w-full">
               <button
                 type="button"
                 onClick={() => onAddClick('income')}
                 className="flex-1 py-2 sm:py-2.5 px-4 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-[#0A0A0A] font-bold text-[13px] sm:text-[15px] flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(0,230,118,0.2)]"
               >
                 <Plus className="w-4 h-4 stroke-[3]" />
                 <span className="truncate">Add Income</span>
               </button>
               <button
                 type="button"
                 onClick={() => onAddClick('expense')}
                 className="flex-1 py-2 sm:py-2.5 px-4 rounded-xl bg-[#FF334B] hover:bg-[#FF1733] text-white font-bold text-[13px] sm:text-[15px] flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(255,51,75,0.2)]"
               >
                 <Minus className="w-4 h-4 stroke-[3]" />
                 <span className="truncate">Add Expense</span>
               </button>
             </div>`);


fs.writeFileSync('src/components/BankingCard3D.tsx', bankingContent);

// Fix FundCard3D
let fundContent = fs.readFileSync('src/components/FundCard3D.tsx', 'utf8');

fundContent = fundContent.replace(
  /className=\{`relative \$\{isPrimary \? 'min-h-\[125px\] sm:min-h-\[145px\] p-3 sm:p-4' : 'min-h-\[92px\] sm:min-h-\[115px\] p-2 sm:p-3'\} bg-gradient-to-br from-\[var\(--theme-surface,#0E1A29\)\] to-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\]/g,
  "className={`relative ${isPrimary ? 'min-h-[125px] sm:min-h-[145px] p-3 sm:p-4' : 'min-h-[92px] sm:min-h-[115px] p-2 sm:p-3'} bg-[#0F0F0F] border border-[#1A1A1A]"
);

fs.writeFileSync('src/components/FundCard3D.tsx', fundContent);
console.log("Patched cards");
