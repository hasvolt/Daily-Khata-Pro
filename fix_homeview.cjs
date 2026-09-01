const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Add appLayout prop
content = content.replace(
  "privacyMask?: boolean;",
  "privacyMask?: boolean;\n  appLayout?: 'dashboard' | 'compact' | 'minimal';"
);

content = content.replace(
  "privacyMask = false",
  "privacyMask = false,\n  appLayout = 'dashboard'"
);

// We need to wrap specific sections in conditionals based on appLayout.
// Section 2 & 3: DAILY & MONTHLY
content = content.replace(
  "{/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE (Clean 2-Card Desktop Grid) */}",
  "{appLayout !== 'minimal' && (\n      <>\n      {/* 2 & 3. DAILY & MONTHLY INCOME & EXPENSE (Clean 2-Card Desktop Grid) */}"
);

// We need to close the first condition just before Section 4
content = content.replace(
  "{/* 4. THE 6 DEDICATED FUND POTS (Master Control Panel) */}",
  "</>\n      )}\n\n      {/* 4. THE 6 DEDICATED FUND POTS (Master Control Panel) */}"
);

// Fund Pots
content = content.replace(
  "{/* 4. THE 6 DEDICATED FUND POTS (Master Control Panel) */}",
  "{appLayout === 'dashboard' && (\n      <>\n      {/* 4. THE 6 DEDICATED FUND POTS (Master Control Panel) */}"
);

content = content.replace(
  "{/* 5. 6-FUND ALLOCATION BAR & INSTANT SHORTCUTS STRIP */}",
  "</>\n      )}\n\n      {/* Compact Layout List */}\n      {appLayout === 'compact' && (\n        <div className=\"bg-[var(--theme-card,#132438)] rounded-xl sm:rounded-3xl border border-[var(--theme-border,#213E61)] shadow-sm overflow-hidden\">\n          <div className=\"p-3 border-b border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)]\">\n            <div className=\"text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider flex items-center gap-1.5\">\n              <PieChart className=\"w-4 h-4\" /> <span>Funds Overview</span>\n            </div>\n          </div>\n          <div className=\"divide-y divide-[var(--theme-border,#213E61)]\">\n          {FUND_ORDER.map((f) => {\n            const config = FUND_CONFIGS[f];\n            const label = language === 'hi' ? config.hindiLabel : config.label;\n            const val = fundTotals[f] || 0;\n            const isNeg = val < 0;\n            return (\n              <button\n                key={f}\n                onClick={() => onFilterFund(f)}\n                className=\"w-full flex items-center justify-between p-3 sm:p-4 hover:bg-[var(--theme-bg,#070E18)] transition-colors text-left cursor-pointer\"\n              >\n                <div className=\"flex items-center gap-3 min-w-0\">\n                  <div className=\"w-8 h-8 rounded-full flex items-center justify-center shrink-0\" style={{ backgroundColor: config.color + '20', color: config.color }}>\n                    <PieChart className=\"w-4 h-4\" />\n                  </div>\n                  <div className=\"min-w-0\">\n                    <div className=\"text-[13.5px] font-bold text-[#F8FAFC] truncate\">{label}</div>\n                  </div>\n                </div>\n                <div className={\`font-mono font-bold text-[14px] \${isNeg ? 'text-[#EF4444]' : 'text-[#F8FAFC]'}\`}>\n                  {formatCurrency(val, privacyMask)}\n                </div>\n              </button>\n            );\n          })}\n          </div>\n        </div>\n      )}\n\n      {appLayout !== 'minimal' && (\n      <>\n      {/* 5. 6-FUND ALLOCATION BAR & INSTANT SHORTCUTS STRIP */}"
);

// End of section 5
content = content.replace(
  "</div>\n    </div>\n  );\n};",
  "</div>\n      </>\n      )}\n    </div>\n  );\n};"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
