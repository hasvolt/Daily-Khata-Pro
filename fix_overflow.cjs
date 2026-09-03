const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

let count = 0;
content = content.replace(/isPrimary=\{true\}/g, (match) => {
  count++;
  if (count === 2) {
    return 'isPrimary={false}';
  }
  return match;
});

fs.writeFileSync('src/components/HomeView.tsx', content);
