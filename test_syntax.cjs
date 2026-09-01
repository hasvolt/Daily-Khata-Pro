const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// I will just remove section 5 completely and see if it compiles
const regex = /\{appLayout !== 'minimal' && \(\s*<>\s*\{\/\* 5\. 6-FUND.*?\s*<\/>\s*\)\}/s;
content = content.replace(regex, "");

fs.writeFileSync('src/components/HomeView_test.tsx', content, 'utf8');
