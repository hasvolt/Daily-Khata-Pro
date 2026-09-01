const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  "        appLayout={appLayout}\n        onLayoutChange={handleAppLayoutChange}\n        />",
  "        onLayoutChange={handleAppLayoutChange}\n        />"
);
fs.writeFileSync('src/App.tsx', content, 'utf8');
