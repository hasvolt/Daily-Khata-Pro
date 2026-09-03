const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  /<h3 className="text-\[12px\] sm:text-\[17px\] font-bold uppercase tracking-wider text-\[var\(--theme-text,#F8FAFC\)\] flex items-center gap-1\.5 sm:gap-2">\s*<PieChart className="w-3\.5 h-3\.5 sm:w-5 sm:h-5 text-\[var\(--theme-primary,#38BDF8\)\]" \/>\s*<span>\{t\.home\.sixFundsHeading \|\| 'Category Allocation'\}<\/span>\s*<\/h3>/,
  `<h3 className="text-[14px] sm:text-[18px] font-semibold tracking-normal text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 sm:gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/20 shadow-sm">
                <PieChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
              </div>
              <span>{t.home.sixFundsHeading || 'Category Allocation'}</span>
            </h3>`
);

fs.writeFileSync('src/components/HomeView.tsx', content);
