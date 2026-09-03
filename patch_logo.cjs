const fs = require('fs');
let content = fs.readFileSync('src/components/HasVoltLogo.tsx', 'utf8');

const regex = /<img[\s\S]*?onError=\{\(\) => setImageError\(true\)\}[\s\S]*?\/>/;
const fallbackSvg = `
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #00D26A)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="p-0.5">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <rect x="6" y="6" width="12" height="12" rx="3" />
            <rect x="10" y="10" width="4" height="4" rx="1" />
          </svg>
`;

content = content.replace(regex, fallbackSvg).replace('setImageError(true)', 'setImageError(false)');
// Force it to use the SVG by setting imageError true or just replacing the whole block.
const wholeBlock = /\{\!imageError \? \([\s\S]*?\) : \([\s\S]*?\)\}/;
const newLogo = `
      <div
        style={{ width: dimension, height: dimension }}
        className="shrink-0 rounded-[22%] bg-[#0A0A0A] border border-[var(--theme-primary,#00D26A)]/30 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 select-none"
      >
        <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #00D26A)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      </div>
`;
content = content.replace(wholeBlock, newLogo);

fs.writeFileSync('src/components/HasVoltLogo.tsx', content);
console.log("Patched Logo");
