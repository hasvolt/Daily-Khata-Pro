const fs = require('fs');
const content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

let divOpen = (content.match(/<div(\s|>)/g) || []).length;
let divClose = (content.match(/<\/div>/g) || []).length;

console.log('Open:', divOpen, 'Close:', divClose);
