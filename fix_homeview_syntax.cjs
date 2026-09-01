const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// 1. Close the first wrapper (Section 2 & 3) before Section 4
content = content.replace(
  "{/* 4. 6-FUND MONEY ALLOCATION POTS */}",
  "</>\n      )}\n\n      {/* 4. 6-FUND MONEY ALLOCATION POTS */}"
);

// 2. Wrap Section 4
content = content.replace(
  "{/* 4. 6-FUND MONEY ALLOCATION POTS */}",
  "{appLayout === 'dashboard' && (\n      <>\n      {/* 4. 6-FUND MONEY ALLOCATION POTS */}"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
