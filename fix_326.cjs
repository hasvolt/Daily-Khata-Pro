const fs = require('fs');
let lines = fs.readFileSync('src/components/HomeView.tsx', 'utf8').split('\n');
lines[325] = "      </div></>)}"; // line 326 is index 325
fs.writeFileSync('src/components/HomeView.tsx', lines.join('\n'), 'utf8');
