const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// 1. Make the modal fullscreen on mobile (remove rounded corners and padding on small screens)
content = content.replace(
  'className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200"',
  'className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200"'
);
content = content.replace(
  'className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left"',
  'className="bg-[var(--theme-card,#132438)] border-0 sm:border border-[var(--theme-border,#213E61)] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[92vh] max-w-2xl flex flex-col shadow-2xl overflow-hidden text-left"'
);

// 2. Adjust grid for languages from grid-cols-2 to grid-cols-3 on mobile to save space, or reduce padding
content = content.replace(
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2',
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2'
);
content = content.replace(
  'p-2.5 rounded-xl border text-center transition-all cursor-pointer',
  'p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer'
);

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
