const fs = require('fs');
let content = fs.readFileSync('src/components/UserManualModal.tsx', 'utf8');

content = content.replace(
  'className="w-full md:w-80 h-[30vh] min-h-[180px] md:h-auto md:flex-1 border-b md:border-b-0 md:border-r',
  'className="w-full md:w-80 h-[30vh] min-h-[180px] md:h-auto md:flex-none border-b md:border-b-0 md:border-r'
);

fs.writeFileSync('src/components/UserManualModal.tsx', content, 'utf8');
