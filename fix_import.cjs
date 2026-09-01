const fs = require('fs');
let content = fs.readFileSync('src/components/UserManualModal.tsx', 'utf8');
content = content.replace('import {\n  X,', 'import {\n  X,\n  ChevronLeft,');
fs.writeFileSync('src/components/UserManualModal.tsx', content, 'utf8');
