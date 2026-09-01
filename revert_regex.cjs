const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Remove {appLayout !== 'minimal' && (<>
content = content.replace(/\{appLayout !== 'minimal' && \(\s*<>\s*/g, "");

// Remove {appLayout === 'dashboard' && (<>
content = content.replace(/\{appLayout === 'dashboard' && \(\s*<>\s*/g, "");

// Remove </> )}
content = content.replace(/\s*<\/>\s*\)\}/g, "");

// Remove the Compact Layout block entirely
// I will just use regex to match from {/* Compact Layout List */} to {/* 5. 6-FUND
const regexCompact = /\{\/\* Compact Layout List \*\/\}.*?(?=\{\/\* 5\. 6-FUND)/s;
content = content.replace(regexCompact, "");

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
