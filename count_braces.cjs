const fs = require('fs');
const content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

let open = (content.match(/\{/g) || []).length;
let close = (content.match(/\}/g) || []).length;

console.log('Open { :', open, 'Close } :', close);
