const fs = require('fs');

function replaceColors(content) {
  let res = content;
  // Backgrounds
  res = res.replace(/bg-\[\#09090B\]/g, 'bg-[var(--theme-card,#09090B)]');
  res = res.replace(/bg-\[\#050505\]/g, 'bg-[var(--theme-surface,#050505)]');
  res = res.replace(/bg-\[\#0A0A0A\]/g, 'bg-[var(--theme-surface,#0A0A0A)]');
  res = res.replace(/bg-\[\#0F0F0F\]/g, 'bg-[var(--theme-card,#0F0F0F)]');
  
  // Borders
  res = res.replace(/border-\[\#1C1C1E\]/g, 'border-[var(--theme-border,#1C1C1E)]');
  res = res.replace(/border-\[\#1A1A1A\]/g, 'border-[var(--theme-border,#1A1A1A)]');
  res = res.replace(/border-\[\#1F1F1F\]/g, 'border-[var(--theme-border,#1F1F1F)]');
  
  // Text
  // If we had text-[#0A0A0A], only change it if it's not the green button text, or maybe it's fine for the button to have a specific color. Let's leave text alone unless necessary.
  
  return res;
}

const files = [
  'src/components/HomeView.tsx',
  'src/components/BankingCard3D.tsx',
  'src/components/FundCard3D.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replaceColors(content);
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
});
