const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace("{appLayout !== 'minimal' && (\n      <>\n      {/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE (Clean 2-Card Desktop Grid) */}", "{/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE (Clean 2-Card Desktop Grid) */}");
content = content.replace("      </div>\n      </>\n      )}\n      {appLayout === 'dashboard' && (\n      <>\n      {/* 4. 6-FUND MONEY ALLOCATION POTS */}", "      </div>\n      {/* 4. 6-FUND MONEY ALLOCATION POTS */}");

const compactString = `        </div>
        </>
      )}
      {/* Compact Layout List */}
      {appLayout === 'compact' && (
        <div className="bg-[var(--theme-card,#132438)] rounded-xl sm:rounded-3xl border border-[var(--theme-border,#213E61)] shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]">
            <div className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4" /> <span>Funds Overview</span>
            </div>
          </div>
          <div className="divide-y divide-[var(--theme-border,#213E61)]">
          {FUND_ORDER.map((f) => {
            const config = FUND_CONFIGS[f];
            const label = language === 'hi' ? config.hindiLabel : config.label;
            const val = fundTotals[f] || 0;
            const isNeg = val < 0;
            return (
              <button
                key={f}
                onClick={() => onFilterFund(f)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-[var(--theme-bg,#070E18)] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.color + '20', color: config.color }}>
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-[#F8FAFC] truncate">{label}</div>
                  </div>
                </div>
                <div className={\`font-mono font-bold text-[14px] \${isNeg ? 'text-[#EF4444]' : 'text-[#F8FAFC]'}\`}>
                  {formatCurrency(val, privacyMask)}
                </div>
              </button>
            );
          })}
          </div>
        </div>
      )}
      {appLayout !== 'minimal' && (
      <>
      {/* 5. 6-FUND ALLOCATION BAR & INSTANT SHORTCUTS STRIP */}`;

content = content.replace(compactString, "        </div>\n      </div>\n      {/* 5. 6-FUND ALLOCATION BAR & INSTANT SHORTCUTS STRIP */}");

content = content.replace("          </div>\n        </div>\n      </>\n      )}\n    </div>\n  );\n};\n\nexport default HomeView;", "          </div>\n        </div>\n    </div>\n  );\n};\n\nexport default HomeView;");

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
