const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  "    viewMode?: AppViewMode;",
  "    viewMode?: AppViewMode;\n    appLayout?: AppLayout;"
);

fs.writeFileSync('src/types.ts', content, 'utf8');
