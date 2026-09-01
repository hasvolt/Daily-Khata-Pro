const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  "{appLayout === 'compact' && (",
  "{(appLayout === 'compact' || appLayout === 'minimal') && ("
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
