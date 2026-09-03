const fs = require('fs');
let content = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (!content.includes('GenericCard3D')) {
  content = content.replace(
    /import \{ ChevronLeft, ChevronRight/g,
    "import { GenericCard3D } from './GenericCard3D';\nimport { ChevronLeft, ChevronRight"
  );
}

// 1. Snapshot card
content = content.replace(
  /<div className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl p-3\.5 sm:p-5 shadow-md space-y-3\.5 min-w-0">/g,
  `<GenericCard3D intensity={5} className="p-3.5 sm:p-5 space-y-3.5">`
);

// 2. Fund Breakdown card
content = content.replace(
  /<div className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl p-3\.5 sm:p-5 shadow-md space-y-3 min-w-0">/g,
  `<GenericCard3D intensity={5} className="p-3.5 sm:p-5 space-y-3">`
);

// 3. Category Breakdown card
content = content.replace(
  /<div className="bg-\[var\(--theme-card,#132438\)\] border border-\[var\(--theme-border,#213E61\)\] rounded-2xl p-3\.5 sm:p-5 shadow-md space-y-3\.5 w-full min-w-0 overflow-hidden">/g,
  `<GenericCard3D intensity={5} className="p-3.5 sm:p-5 space-y-3.5 w-full">`
);

// 4. Any other matching cards
content = content.replace(
  /<\/div>\s*\{\/\* Fund Breakdown \*\/\}/g,
  `</GenericCard3D>\n\n        {/* Fund Breakdown */}`
);

content = content.replace(
  /<\/div>\s*\{\/\* Category Breakdown \*\/\}/g,
  `</GenericCard3D>\n\n        {/* Category Breakdown */}`
);

content = content.replace(
  /<\/div>\s*\{\/\* Category Management \*\/\}/g,
  `</GenericCard3D>\n\n        {/* Category Management */}`
);

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*$/g,
  `</GenericCard3D>\n      </div>\n    </div>\n  );\n};`
);

fs.writeFileSync('src/components/ReportView.tsx', content);
