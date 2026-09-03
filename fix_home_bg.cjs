const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Fix Today and Monthly card backgrounds
content = content.replace(/bg-gradient-to-br from-\[var\(--theme-card,#132438\)\] to-\[var\(--theme-surface,#0E1A29\)\]/g, 'bg-[#0F0F0F]');
// Fix the text variable for hover border
content = content.replace(/hover:border-\[var\(--theme-primary,#38BDF8\)\]/g, 'hover:border-[var(--theme-primary,#00D26A)]');
content = content.replace(/border-\[var\(--theme-primary,#38BDF8\)\]/g, 'border-[var(--theme-primary,#00D26A)]');
content = content.replace(/bg-\[var\(--theme-primary,#38BDF8\)\]\/15/g, 'bg-[#00D26A]/10');
content = content.replace(/bg-\[var\(--theme-primary,#38BDF8\)\]/g, 'bg-[#00D26A]');
content = content.replace(/text-\[var\(--theme-primary,#38BDF8\)\]/g, 'text-[#00D26A]');

fs.writeFileSync('src/components/HomeView.tsx', content);
console.log("Patched HomeView dark backgrounds");
