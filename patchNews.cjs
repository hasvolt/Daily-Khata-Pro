const fs = require('fs');
let content = fs.readFileSync('src/components/CommercialNewsPortalPage.tsx', 'utf8');

// Unhide the ticker on mobile
content = content.replace(/className="hidden sm:block bg-\[\var\(--theme-surface/g, 'className="block bg-[var(--theme-surface');

fs.writeFileSync('src/components/CommercialNewsPortalPage.tsx', content);
