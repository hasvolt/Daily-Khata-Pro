const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /<HomeView\s+entries=\{entries\}/g,
  '<HomeView\n              appLayout={appLayout}\n              entries={entries}'
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
