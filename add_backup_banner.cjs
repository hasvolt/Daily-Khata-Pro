const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

const backupBanner = `
      {/* Backup Reminder Banner */}
      <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center shrink-0">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-[13px] font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? 'अपना डेटा सुरक्षित रखें' : 'Keep your data safe'}
            </span>
            <span className="text-[9px] sm:text-[11px] text-[var(--theme-text-muted,#94A3B8)]">
              {isHindi ? 'नियमित रूप से सेटिंग्स से बैकअप लें' : 'Regularly backup your data from settings'}
            </span>
          </div>
        </div>
      </div>
`;

content = content.replace('{/* Main Net Worth Card */}', backupBanner + '\n      {/* Main Net Worth Card */}');
fs.writeFileSync('src/components/HomeView.tsx', content);
