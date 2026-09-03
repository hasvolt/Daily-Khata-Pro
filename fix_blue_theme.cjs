const fs = require('fs');

// 1. Update CSS
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const regexRoot = /:root\s*\{([^}]*)\}/;
let rootMatch = cssContent.match(regexRoot);
if (rootMatch) {
  let rootContent = rootMatch[1]
    .replace(/--theme-bg: #[0-9A-Fa-f]+;/g, '--theme-bg: #020813;')
    .replace(/--theme-surface: #[0-9A-Fa-f]+;/g, '--theme-surface: #071324;')
    .replace(/--theme-card: #[0-9A-Fa-f]+;/g, '--theme-card: #0A192F;')
    .replace(/--theme-card-hover: #[0-9A-Fa-f]+;/g, '--theme-card-hover: #112240;')
    .replace(/--theme-border: #[0-9A-Fa-f]+;/g, '--theme-border: #1E2D4A;');
  cssContent = cssContent.replace(rootMatch[0], `:root {${rootContent}}`);
}

const regexBlue = /\[data-theme="blue"\]\s*\{([^}]*)\}/;
let blueMatch = cssContent.match(regexBlue);
if (blueMatch) {
  let blueContent = blueMatch[1]
    .replace(/--theme-bg: #[0-9A-Fa-f]+;/g, '--theme-bg: #020813;')
    .replace(/--theme-surface: #[0-9A-Fa-f]+;/g, '--theme-surface: #071324;')
    .replace(/--theme-card: #[0-9A-Fa-f]+;/g, '--theme-card: #0A192F;')
    .replace(/--theme-card-hover: #[0-9A-Fa-f]+;/g, '--theme-card-hover: #112240;')
    .replace(/--theme-border: #[0-9A-Fa-f]+;/g, '--theme-border: #1E2D4A;');
  cssContent = cssContent.replace(blueMatch[0], `[data-theme="blue"] {${blueContent}}`);
}

fs.writeFileSync('src/index.css', cssContent);
console.log("Patched CSS");

// 2. Update BankingCard3D.tsx
let cardContent = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

// Fix Date format
cardContent = cardContent.replace(
  /<div className="text-\[10px\] sm:text-\[11px\] font-medium tracking-wide text-\[var\(--theme-text,#F8FAFC\)\]\/50 uppercase">\s*\{dateFormatted\}\s*<\/div>/,
  `<span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-[var(--theme-primary,#38BDF8)] uppercase px-2.5 py-1 rounded-full border border-[var(--theme-primary,#38BDF8)]/30 bg-[var(--theme-primary,#38BDF8)]/10 backdrop-blur-md">
              {dateFormatted}
            </span>`
);

// Fix Card Gradient Background
cardContent = cardContent.replace(
  /className="relative bg-gradient-to-br from-\[\#121212\] via-\[\#0D0D0D\] to-\[\#000000\] border border-\[\#2A2A2A\] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-\[0_20px_40px_rgba\(0,0,0,0\.4\)\] overflow-hidden cursor-crosshair"/,
  'className="relative bg-gradient-to-br from-[var(--theme-card,#0A192F)] to-[var(--theme-surface,#071324)] border border-[var(--theme-border,#1E2D4A)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden cursor-crosshair"'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', cardContent);
console.log("Patched BankingCard3D");

