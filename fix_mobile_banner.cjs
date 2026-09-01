const fs = require('fs');
const filePath = 'src/components/HasVoltPromoBanner.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Container padding and gap
content = content.replace(
  'className="p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"',
  'className="p-1.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3"'
);

// 2. Left section gap
content = content.replace(
  'className="flex items-center gap-3 min-w-0 w-full sm:w-auto flex-1"',
  'className="flex items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto flex-1"'
);

// 3. Thumbnail size
content = content.replace(
  'className="relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg',
  'className="relative w-11 h-8 sm:w-20 sm:h-14 shrink-0 rounded-lg'
);

// 4. Info wrapper gaps
content = content.replace(
  'className="flex items-center gap-2 flex-wrap"',
  'className="flex items-center gap-1.5 sm:gap-2 flex-wrap"'
);

// 5. Sponsored Tag
content = content.replace(
  'px-2 py-0.5 rounded-md text-[9.5px]',
  'px-1.5 sm:px-2 py-0.5 rounded-md text-[8.5px] sm:text-[9.5px]'
);
content = content.replace(
  '<Sparkles className="w-2.5 h-2.5 shrink-0" /> SPONSORED',
  '<Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" /> SPONSORED'
);

// 6. HasVolt text
content = content.replace(
  'text-[13.5px]',
  'text-[11.5px] sm:text-[13.5px]'
);

// 7. Professional Electrical Services
content = content.replace(
  'text-[12px] font-medium truncate">Professional Electrical Services',
  'text-[10px] sm:text-[12px] font-medium truncate">Professional Electrical Services'
);

// 8. Description text
content = content.replace(
  'className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] truncate mt-0.5 font-normal"',
  'className="text-[9.5px] sm:text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] truncate mt-0.5 font-normal"'
);

// 9. Info Row
content = content.replace(
  'className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1 flex-wrap"',
  'className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] text-[#64748B] mt-0.5 sm:mt-1 flex-wrap"'
);
content = content.replace(
  '<Clock className="w-3 h-3 text-[#64748B] shrink-0" />',
  '<Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#64748B] shrink-0" />'
);
content = content.replace(
  '<MapPin className="w-3 h-3 text-[#64748B] shrink-0" />',
  '<MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#64748B] shrink-0" />'
);

// 10. Action Buttons Container
content = content.replace(
  'gap-1.5 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0',
  'gap-1.5 shrink-0 w-full sm:w-auto justify-end pt-1.5 sm:pt-0'
);

// 11. Buttons text and padding
content = content.replace(
  'px-2.5 py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)]',
  'px-2 sm:px-2.5 py-1 sm:py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)]'
);
content = content.replace(
  'text-[11px] flex items-center gap-1 transition-all',
  'text-[9.5px] sm:text-[11px] flex items-center gap-1 transition-all'
);
content = content.replace(
  '<Maximize2 className="w-3 h-3 text-[var(--theme-primary,#38BDF8)]" />',
  '<Maximize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--theme-primary,#38BDF8)]" />'
);

content = content.replace(
  'px-2.5 py-1.2 rounded-lg bg-[#10B981]/15',
  'px-2 sm:px-2.5 py-1 sm:py-1.2 rounded-lg bg-[#10B981]/15'
);
content = content.replace(
  'text-[11px] flex items-center gap-1 transition-colors cursor-pointer',
  'text-[9.5px] sm:text-[11px] flex items-center gap-1 transition-colors cursor-pointer'
);
content = content.replace(
  '<MessageSquare className="w-3 h-3" />',
  '<MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />'
);

// Search for telephone button
content = content.replace(
  'className="p-1.2 rounded-lg bg-[#0284C7]/15',
  'className="p-1 sm:p-1.2 rounded-lg bg-[#0284C7]/15'
);

// Telephone icon (need to check the code but generally <Phone className="w-3 h-3" />)
content = content.replace(
  '<Phone className="w-3.5 h-3.5" />',
  '<Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />'
);


fs.writeFileSync(filePath, content, 'utf8');
