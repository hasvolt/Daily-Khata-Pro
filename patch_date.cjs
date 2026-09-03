const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

content = content.replace(
  /<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">/,
  '<div className="flex items-center justify-between">'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
console.log("Patched Date Flex");
