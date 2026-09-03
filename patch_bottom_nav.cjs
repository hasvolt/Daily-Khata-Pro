const fs = require('fs');
let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

content = content.replace(/bg-\[\#10B981\]/g, 'bg-[var(--theme-primary,#00D26A)]');
content = content.replace(/text-\[\#10B981\]/g, 'text-[var(--theme-primary,#00D26A)]');
content = content.replace(/shadow-\[\#10B981\]/g, 'shadow-[var(--theme-primary,#00D26A)]');
content = content.replace(/ring-\[\#10B981\]/g, 'ring-[var(--theme-primary,#00D26A)]');
content = content.replace(/from-\[\#10B981\] to-\[\#34D399\]/g, 'from-[#00D26A] to-[#00E676]');
// Change the active state colors of normal nav tabs
content = content.replace(/text-\[var\(--theme-primary,#38BDF8\)\]/g, 'text-[var(--theme-primary,#00D26A)]');
content = content.replace(/bg-\[var\(--theme-primary,#38BDF8\)\]\/10/g, 'bg-[var(--theme-primary,#00D26A)]/10');
content = content.replace(/bg-\[var\(--theme-primary,#38BDF8\)\]/g, 'bg-[var(--theme-primary,#00D26A)]');
content = content.replace(/text-\[\#38BDF8\]/g, 'text-[var(--theme-primary,#00D26A)]');


fs.writeFileSync('src/components/BottomNav.tsx', content);
console.log("Patched BottomNav");
