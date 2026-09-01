const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

const section5 = `
      {appLayout !== 'minimal' && (
      <>
      {/* 5. 6-FUND ALLOCATION BAR & INSTANT SHORTCUTS STRIP */}
        <div className="bg-[var(--theme-card,#132438)]/70 border border-[var(--theme-border,#213E61)]/70 rounded-lg sm:rounded-2xl p-2 sm:p-4 space-y-2 sm:space-y-3 mt-1">
          {/* Multi-color Segments Allocation Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9.5px] sm:text-[11.5px] text-[#94A3B8]">
              <span className="flex items-center gap-1 sm:gap-1.5 font-semibold text-[#F8FAFC]">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F59E0B]" />
                <span className="truncate">{pageT.common.disciplinedSplit}</span>
              </span>
              <span className="font-mono text-[9.5px] sm:text-[11px] text-[#10B981] font-bold shrink-0">100% Allocated</span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full h-1.5 sm:h-2.5 bg-[#070E18] rounded-full overflow-hidden flex border border-[var(--theme-border,#213E61)]/50">
              {FUND_ORDER.map((f) => {
                const config = FUND_CONFIGS[f];
                const pct = percentages[f] ?? config.defaultPct;
                return (
                  <div
                    key={f}
                    style={{ width: \`\${pct}%\`, backgroundColor: config.color }}
                    className="h-full transition-all duration-300 relative group"
                    title={\`\${FUND_LABELS[f]}: \${pct}%\`}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Action Navigation & Privacy Badge */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-[var(--theme-border,#213E61)]/40 text-[9.5px] sm:text-[11.5px]">
            <div className="flex items-center gap-1 text-[#10B981] font-medium text-[9.5px] sm:text-[11px]">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">{pageT.common.safeOffline}</span>
            </div>

            {onViewHistory && (
              <button
                type="button"
                onClick={onViewHistory}
                className="inline-flex items-center gap-1 text-[var(--theme-primary,#38BDF8)] hover:text-white font-semibold cursor-pointer transition-colors"
              >
                <span className="truncate">{pageT.common.viewLedger}</span>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </>
      )}
`;

content = content.replace("    </div>\n  );\n};\n\nexport default HomeView;", section5 + "    </div>\n  );\n};\n\nexport default HomeView;");

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
