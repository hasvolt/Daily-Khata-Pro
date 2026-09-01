const fs = require('fs');
const lines = fs.readFileSync('src/components/HomeView.tsx', 'utf8').split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/\(/g) || []).length;
  const closes = (line.match(/\)/g) || []).length;
  depth += opens - closes;
  if (opens !== closes) {
    console.log(`Line ${i+1}: Depth ${depth} (+${opens} -${closes})`);
  }
}
