const fs = require('fs');
let content = fs.readFileSync('src/components/HasVoltLogo.tsx', 'utf8');

// The issue was I replaced the ternary with a single element, but maybe it broke surrounding syntax.
// Let's just rewrite the whole file, it's simple enough.
const fullContent = `import React from 'react';

interface HasVoltLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const HasVoltLogo: React.FC<HasVoltLogoProps> = ({
  size = 32,
  className = '',
  showText = false
}) => {
  let pixelSize = 32;
  if (typeof size === 'number') {
    pixelSize = size;
  } else if (size === 'sm') {
    pixelSize = 22;
  } else if (size === 'md') {
    pixelSize = 32;
  } else if (size === 'lg') {
    pixelSize = 42;
  } else {
    pixelSize = parseInt(String(size), 10) || 32;
  }

  const dimension = \`\${pixelSize}px\`;

  return (
    <div className={\`inline-flex items-center gap-2 \${className}\`}>
      <div
        style={{ width: dimension, height: dimension }}
        className="shrink-0 rounded-[22%] bg-[#0A0A0A] border border-[var(--theme-primary,#00D26A)] flex items-center justify-center overflow-hidden transition-transform hover:scale-105 select-none shadow-[0_0_8px_rgba(0,210,106,0.3)]"
      >
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #00D26A)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-bold text-[18px] tracking-tight">
            <span className="text-[#FFFFFF]">Daily</span>
            <span className="text-[#00D26A] ml-1">Khata</span>
            <span className="text-[#F8FAFC] ml-1">Pro</span>
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium">
            Income &amp; Expense Tracker
          </span>
        </div>
      )}
    </div>
  );
};
`;
fs.writeFileSync('src/components/HasVoltLogo.tsx', fullContent);
console.log("Rewrote Logo component entirely");
