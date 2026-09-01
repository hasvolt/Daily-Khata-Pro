const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  "      {appLayout === 'dashboard' && (\n      {/* 4. 6-FUND MONEY ALLOCATION POTS */}",
  "      {appLayout === 'dashboard' && (\n      <>\n      {/* 4. 6-FUND MONEY ALLOCATION POTS */}"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
