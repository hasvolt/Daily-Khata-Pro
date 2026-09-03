const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

const regex = /<div className="bg-gradient-to-br from-\[var\(--theme-card,#132438\)\] to-\[var\(--theme-surface,#0E1A29\)\] border border-\[var\(--theme-border,#213E61\)\]\/70 hover:border-\[var\(--theme-primary,#38BDF8\)\]\/30 rounded-lg sm:rounded-2xl p-2 sm:p-4 hover:shadow-lg transition-all duration-300 space-y-2 sm:space-y-3 mt-1">[\s\S]*?<\/div>\n      <\/div>/;

const targetStr = content.match(regex);

if (targetStr) {
  const replacement = `
      {/* Recent Transactions Replacement */}
      <div className="bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]/70 hover:border-[var(--theme-primary,#38BDF8)]/30 rounded-lg sm:rounded-2xl p-2.5 sm:p-4 hover:shadow-lg transition-all duration-300 space-y-2.5 mt-1">
        <div className="flex items-center justify-between text-[11px] sm:text-[13px] font-semibold text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,#213E61)]/50 pb-2">
          <span className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary,#38BDF8)]" />
            {isHindi ? 'हाल ही के लेन-देन' : 'Recent Transactions'}
          </span>
          {onViewHistory && (
            <button onClick={onViewHistory} className="text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-0.5 font-bold transition-all hover:scale-105 active:scale-95">
              {isHindi ? 'सभी देखें' : 'View All'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          {entries.slice().sort((a,b) => b.createdAt - a.createdAt).slice(0, 3).map(entry => (
            <div key={entry.id} className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/50 border border-[var(--theme-border,#213E61)]/40 hover:bg-[var(--theme-surface,#0E1A29)] transition-colors">
               <div className="flex items-center gap-2.5">
                  <div className={\`p-1.5 rounded-lg \${entry.type === 'income' ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'}\`}>
                    {entry.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11.5px] sm:text-[13px] font-bold text-[var(--theme-text,#F8FAFC)] truncate max-w-[120px]">{entry.category}</span>
                    <span className="text-[9.5px] sm:text-[11px] text-[var(--theme-text-muted,#94A3B8)] truncate max-w-[120px]">{entry.date}</span>
                  </div>
               </div>
               <div className={\`font-mono font-bold text-[11.5px] sm:text-[13.5px] \${entry.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'}\`}>
                  {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount, privacyMask)}
               </div>
            </div>
          ))}
          {entries.length === 0 && (
             <div className="text-center py-4 text-[11px] sm:text-[12px] text-[var(--theme-text-muted,#94A3B8)] font-medium">
               {isHindi ? 'कोई लेन-देन नहीं मिला' : 'No recent transactions'}
             </div>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-1 pt-2 border-t border-[var(--theme-border,#213E61)]/40 text-[#10B981] font-medium text-[9.5px] sm:text-[11px]">
          <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#10B981] shrink-0" />
          <span className="truncate">{pageT.common.safeOffline}</span>
        </div>
      </div>`;

  content = content.replace(regex, replacement);
  
  fs.writeFileSync('src/components/HomeView.tsx', content);
  console.log("Patched!");
} else {
  console.log("Not found.");
}
