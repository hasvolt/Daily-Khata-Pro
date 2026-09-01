const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace("    appLayout?: AppLayout;\n  appLayout?: AppLayout;", "  appLayout?: AppLayout;");
fs.writeFileSync('src/types.ts', content, 'utf8');
