const fs = require('fs');
let content = fs.readFileSync('src/components/HasVoltPromoBanner.tsx', 'utf8');

content = content.replace('  if (!showBanner) return null;\n\n  // Keyboard escape listener', '  // Keyboard escape listener');

content = content.replace('  return (\n    <>', '  if (!showBanner) return null;\n\n  return (\n    <>');

fs.writeFileSync('src/components/HasVoltPromoBanner.tsx', content, 'utf8');
