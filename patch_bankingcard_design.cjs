const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// The header part
const headerRegex = /<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">[\s\S]*?<\/div>\s*<\/div>/;

const newHeader = `
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-[var(--theme-surface,#0A0A0A)] border border-[var(--theme-border,#1F1F1F)]">
                <FileText className="w-4 h-4 text-[var(--theme-text-muted,#94A3B8)]" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-bold tracking-widest text-[var(--theme-text,#F8FAFC)]/90 uppercase">
                {t.home.netBalance}
              </span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[var(--theme-text-muted,#94A3B8)] uppercase">
                 {dateFormatted}
               </span>
               <div className="p-1 sm:p-1.5 rounded-lg bg-[var(--theme-surface,#0A0A0A)] border border-[var(--theme-border,#1F1F1F)]">
                 <Calendar className="w-4 h-4 text-[var(--theme-text-muted,#94A3B8)]" />
               </div>
            </div>
          </div>`;

content = content.replace(/<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">[\s\S]*?<\/div>\s*<\/div>/, newHeader);
content = content.replace(/<div className="flex items-center justify-between">\s*<div className="flex items-center gap-2">\s*<div className="p-1\.5 sm:p-2 rounded-lg bg-\[var\(--theme-text,#F8FAFC\)\]\/10 backdrop-blur-md">\s*<Wallet className="w-3\.5 h-3\.5 sm:w-4 sm:h-4 text-\[var\(--theme-text,#F8FAFC\)\]" \/>\s*<\/div>\s*<span className="text-\[11px\] sm:text-\[13px\] font-bold tracking-widest text-\[var\(--theme-text,#F8FAFC\)\]\/90 uppercase">\s*\{t\.home\.netBalance\}\s*<\/span>\s*<\/div>\s*<span className="text-\[9px\] sm:text-\[10px\] font-semibold tracking-wider text-\[var\(--theme-primary,#38BDF8\)\] uppercase px-2\.5 py-1 rounded-full border border-\[var\(--theme-primary,#38BDF8\)\]\/30 bg-\[var\(--theme-primary,#38BDF8\)\]\/10 backdrop-blur-md">\s*\{dateFormatted\}\s*<\/span>\s*<\/div>/, newHeader);


// Change card gradient to dark solid with bright green wavy glow on right
content = content.replace(
  /className="relative bg-gradient-to-br from-\[var\(--theme-card,#0A192F\)\] to-\[var\(--theme-surface,#071324\)\] border border-\[var\(--theme-border,#1E2D4A\)\] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-\[0_20px_40px_rgba\(0,0,0,0\.3\)\] overflow-hidden cursor-crosshair"/,
  'className="relative bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden cursor-crosshair"'
);

// Update background gradients
content = content.replace(
  /<div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-\[\#38BDF8\] to-\[\#8B5CF6\] opacity-10 rounded-full blur-3xl pointer-events-none transform-gpu" style=\{\{ transform: "translateZ\(-20px\)" \}\}><\/div>\s*<div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-br from-\[\#10B981\] to-\[\#3B82F6\] opacity-10 rounded-full blur-3xl pointer-events-none transform-gpu" style=\{\{ transform: "translateZ\(-20px\)" \}\}><\/div>/,
  '<div className="absolute -right-16 top-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--theme-primary)] opacity-[0.12] blur-[100px] pointer-events-none transform-gpu" style={{ transform: "translateZ(-20px)" }}></div>'
);

// Update buttons
content = content.replace(
  /<button\s*onClick=\{([^}]*)\}\s*className="flex-1 flex items-center justify-center gap-1\.5 sm:gap-2 py-2\.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white\/10 hover:bg-white\/20 border border-white\/20 transition-all font-bold text-\[12px\] sm:text-\[14px\] text-white active:scale-95"\s*>\s*<Plus className="w-4 h-4 sm:w-4\.5 sm:h-4\.5" \/>\s*<span className="truncate">\{t\.home\.addIncome\}<\/span>\s*<\/button>\s*<button\s*onClick=\{([^}]*)\}\s*className="flex-1 flex items-center justify-center gap-1\.5 sm:gap-2 py-2\.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-\[\#EF4444\]\/90 hover:bg-\[\#EF4444\] border border-\[\#EF4444\] transition-all font-bold text-\[12px\] sm:text-\[14px\] text-white active:scale-95"\s*>\s*<Minus className="w-4 h-4 sm:w-4\.5 sm:h-4\.5" \/>\s*<span className="truncate">\{t\.home\.addExpense\}<\/span>\s*<\/button>/g,
  `<button
              onClick={() => onAddClick('income')}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#00E676] hover:bg-[#00C853] transition-all font-bold text-[13px] sm:text-[15px] text-[#0A0A0A] active:scale-95 shadow-md shadow-[#00E676]/20"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="truncate tracking-wide">{t.home.addIncome}</span>
            </button>
            <button
              onClick={() => onAddClick('expense')}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#FF334B] hover:bg-[#FF1733] transition-all font-bold text-[13px] sm:text-[15px] text-white active:scale-95 shadow-md shadow-[#FF334B]/20"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="truncate tracking-wide">{t.home.addExpense}</span>
            </button>`
);

content = content.replace("import { Wallet, Sparkles }", "import { Wallet, Sparkles, FileText, Calendar, Plus, Minus }");

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
console.log("Patched BankingCard3D Design");
