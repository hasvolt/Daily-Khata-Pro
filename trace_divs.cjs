const fs = require('fs');
const lines = fs.readFileSync('src/components/HomeView.tsx', 'utf8').split('\n');

let depth = 0;
for (let i = 95; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/<div(\s|>)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += opens - closes;
  if (opens > 0 || closes > 0) {
    console.log(`Line ${i+1}: Depth ${depth} (+${opens} -${closes})`);
  }
}
