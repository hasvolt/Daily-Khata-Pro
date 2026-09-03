const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  /className="w-full max-w-6xl mx-auto pb-4 space-y-3 sm:space-y-6 animate-in fade-in duration-200"/g,
  'className="w-full max-w-6xl mx-auto pb-4 space-y-4 sm:space-y-7 animate-in fade-in duration-200"'
);

content = content.replace(
  /className="grid grid-cols-1 md:grid-cols-2 gap-2\.5 sm:gap-5"/g,
  'className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"'
);

fs.writeFileSync('src/components/HomeView.tsx', content);
