const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

const regex = /\{\/\* Month Filter Chips \*\/\}[\s\S]*?<\/div>\n      \)\}/;

const replacement = `
      {/* Month Filter Navigator */}
      {uniqueMonths.length > 0 && (
        <div className="flex items-center justify-between mt-2 mb-1 p-1.5 sm:p-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-sm w-full no-print">
          <button
            onClick={() => {
              if (activeMonth === 'all') {
                setActiveMonth(uniqueMonths[0]);
              } else {
                const idx = uniqueMonths.indexOf(activeMonth);
                if (idx < uniqueMonths.length - 1) setActiveMonth(uniqueMonths[idx + 1]);
              }
            }}
            disabled={activeMonth !== 'all' && uniqueMonths.indexOf(activeMonth) === uniqueMonths.length - 1}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          
          <div className="flex-1 flex justify-center text-center truncate px-2">
            <button 
              onClick={() => setActiveMonth('all')}
              className={\`px-3 sm:px-4 py-1.5 rounded-lg text-[12.5px] sm:text-[14px] font-bold transition-all truncate \${
                activeMonth === 'all' 
                  ? 'text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/10 border border-[var(--theme-primary,#38BDF8)]/20'
                  : 'text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)]'
              }\`}
            >
              {activeMonth === 'all' ? (isHindi ? 'सभी महीने' : 'All Months') : (
                new Date(\`\${activeMonth}-01T00:00:00\`).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long', year: 'numeric' })
              )}
            </button>
          </div>
          
          <button
            onClick={() => {
              if (activeMonth !== 'all') {
                const idx = uniqueMonths.indexOf(activeMonth);
                if (idx > 0) setActiveMonth(uniqueMonths[idx - 1]);
                else if (idx === 0) setActiveMonth('all');
              }
            }}
            disabled={activeMonth === 'all'}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      )}`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/HistoryView.tsx', content);
console.log("Patched month navigator!");
