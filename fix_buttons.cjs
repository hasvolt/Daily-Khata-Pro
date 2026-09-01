const fs = require('fs');
const filePath = 'src/components/HasVoltPromoBanner.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'className="px-2.5 py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"',
  'className="px-2 sm:px-2.5 py-1 sm:py-1.2 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"'
);
content = content.replace(
  '<Phone className="w-3 h-3 text-[var(--theme-text-muted,#94A3B8)]" />',
  '<Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--theme-text-muted,#94A3B8)]" />'
);

content = content.replace(
  'className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"',
  'className="p-1 sm:p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#94A3B8)] hover:text-[var(--theme-text,#F8FAFC)] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"'
);

content = content.replace(
  'className="p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"',
  'className="p-1 sm:p-1.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"'
);

content = content.replace(
  '<Globe className="w-3.5 h-3.5" />',
  '<Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />'
);
content = content.replace(
  '<Star className="w-3.5 h-3.5" />',
  '<Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" />'
);

fs.writeFileSync(filePath, content, 'utf8');
