const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const layoutSelector = `
              {/* Homepage Layout Selector */}
              <div className="p-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
                  <label className="font-bold text-[13.5px] text-[#F8FAFC]">
                    {isHindi ? 'होमपेज लेआउट' : 'Homepage Layout'}
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'dashboard', label: isHindi ? 'डिफ़ॉल्ट डैशबोर्ड' : 'Default Dashboard', sub: 'Cards & Charts' },
                    { id: 'compact', label: isHindi ? 'कॉम्पैक्ट लिस्ट' : 'Compact List', sub: 'Row-by-Row View' },
                    { id: 'minimal', label: isHindi ? 'मिनिमल व्यू' : 'Minimal View', sub: 'Clean & Simple' }
                  ].map((lo) => (
                    <button
                      key={lo.id}
                      type="button"
                      onClick={() => onLayoutChange && onLayoutChange(lo.id as AppLayout)}
                      className={\`p-2.5 rounded-xl border text-center transition-all cursor-pointer \${
                        appLayout === lo.id
                          ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] border-[var(--theme-primary,#38BDF8)] font-extrabold shadow-sm'
                          : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[var(--theme-primary,#38BDF8)]/50'
                      }\`}
                    >
                      <div className="text-[12.5px] font-bold truncate">{lo.label}</div>
                      <div className="text-[10px] opacity-75 truncate">{lo.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
`;

content = content.replace(
  "{/* Color Theme Selector */}",
  layoutSelector + "\n              {/* Color Theme Selector */}"
);

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
