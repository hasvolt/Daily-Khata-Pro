const fs = require('fs');
let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

content = content.replace(
  /className=\{`flex flex-col items-center justify-center py-0\.5 sm:py-2 px-0\.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer select-none w-full \$\{/g,
  `className={\`relative flex flex-col items-center justify-center py-0.5 sm:py-2 px-0.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer select-none w-full \${`
);

content = content.replace(
  /<div\s*className=\{`p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all \$\{/g,
  `{isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--theme-primary,#38BDF8)] rounded-b-full shadow-[0_2px_8px_rgba(56,189,248,0.5)] animate-in fade-in zoom-in duration-300"></div>
              )}
              <div
                className={\`relative p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 \${`
);

fs.writeFileSync('src/components/BottomNav.tsx', content);
