const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldSignature = `    newViewMode, newAppLayout?: AppViewMode, newAppLayout?: AppLayout,
    newAppLayout?: AppLayout
  ) => {`;

const newSignature = `    newViewMode?: AppViewMode,
    newAppLayout?: AppLayout
  ) => {`;

content = content.replace(oldSignature, newSignature);
fs.writeFileSync('src/App.tsx', content, 'utf8');
