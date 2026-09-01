const fs = require('fs');
let content = fs.readFileSync('src/components/UserManualModal.tsx', 'utf8');

// 1. Fullscreen modal on mobile
content = content.replace(
  'className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"',
  'className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"'
);
content = content.replace(
  'className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-left"',
  'className="bg-[var(--theme-surface,#0E1A29)] sm:border border-[var(--theme-border,#213E61)] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-5xl shadow-2xl flex flex-col overflow-hidden text-left"'
);

// 2. Adjust sidebar height on mobile
content = content.replace(
  'className="w-full md:w-80 border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex flex-col shrink-0"',
  'className="w-full md:w-80 h-[30vh] min-h-[180px] md:h-auto md:flex-1 border-b md:border-b-0 md:border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex flex-col shrink-0"'
);

// 3. Make the main content Area take up the rest of the space
content = content.replace(
  'className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[var(--theme-surface,#0E1A29)] custom-scrollbar"',
  'className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6 bg-[var(--theme-surface,#0E1A29)] custom-scrollbar"'
);

// 4. Increase font size slightly in content for readability
content = content.replace(
  'className="text-[13px] text-[#94A3B8] leading-relaxed"',
  'className="text-[13.5px] sm:text-[13px] text-[#94A3B8] leading-relaxed"'
);
content = content.replace(
  'className="text-[13px] text-[#F8FAFC] leading-relaxed"',
  'className="text-[13.5px] sm:text-[13px] text-[#F8FAFC] leading-relaxed"'
);

fs.writeFileSync('src/components/UserManualModal.tsx', content, 'utf8');
