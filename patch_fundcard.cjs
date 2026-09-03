const fs = require('fs');
let content = fs.readFileSync('src/components/FundCard3D.tsx', 'utf8');

// Round the displayed percentage to avoid long decimals breaking the layout
// E.g., {pct}% -> {Math.round(pct)}%
content = content.replace(
  /<span className="absolute text-\[8px\] sm:text-\[10px\] font-mono font-bold text-\[var\(--theme-text,#F8FAFC\)\]">\{pct\}%<\/span>/g,
  '<span className="absolute text-[8.5px] sm:text-[10px] font-mono font-bold text-[var(--theme-text,#F8FAFC)] tracking-tighter">{Number(pct).toFixed(0)}%</span>'
);

fs.writeFileSync('src/components/FundCard3D.tsx', content);
