const fs = require('fs');

let cssContent = fs.readFileSync('src/index.css', 'utf8');

const regexRoot = /:root\s*\{([^}]*)\}/;
let rootMatch = cssContent.match(regexRoot);
if (rootMatch) {
  let rootContent = rootMatch[1]
    .replace(/--theme-primary: #[0-9A-Fa-f]+;/g, '--theme-primary: #00D26A;')
    .replace(/--theme-primary-hover: #[0-9A-Fa-f]+;/g, '--theme-primary-hover: #00E676;')
    .replace(/--theme-bg: #[0-9A-Fa-f]+;/g, '--theme-bg: #050505;')
    .replace(/--theme-surface: #[0-9A-Fa-f]+;/g, '--theme-surface: #0A0A0A;')
    .replace(/--theme-card: #[0-9A-Fa-f]+;/g, '--theme-card: #0F0F0F;')
    .replace(/--theme-card-hover: #[0-9A-Fa-f]+;/g, '--theme-card-hover: #141414;')
    .replace(/--theme-border: #[0-9A-Fa-f]+;/g, '--theme-border: #1F1F1F;')
    .replace(/--theme-btn-bg: #[0-9A-Fa-f]+;/g, '--theme-btn-bg: #00D26A;')
    .replace(/--theme-badge-text: #[0-9A-Fa-f]+;/g, '--theme-badge-text: #00D26A;');
  cssContent = cssContent.replace(rootMatch[0], `:root {${rootContent}}`);
}

const regexBlue = /\[data-theme="blue"\]\s*\{([^}]*)\}/;
let blueMatch = cssContent.match(regexBlue);
if (blueMatch) {
  let blueContent = blueMatch[1]
    .replace(/--theme-primary: #[0-9A-Fa-f]+;/g, '--theme-primary: #00D26A;')
    .replace(/--theme-primary-hover: #[0-9A-Fa-f]+;/g, '--theme-primary-hover: #00E676;')
    .replace(/--theme-bg: #[0-9A-Fa-f]+;/g, '--theme-bg: #050505;')
    .replace(/--theme-surface: #[0-9A-Fa-f]+;/g, '--theme-surface: #0A0A0A;')
    .replace(/--theme-card: #[0-9A-Fa-f]+;/g, '--theme-card: #0F0F0F;')
    .replace(/--theme-card-hover: #[0-9A-Fa-f]+;/g, '--theme-card-hover: #141414;')
    .replace(/--theme-border: #[0-9A-Fa-f]+;/g, '--theme-border: #1F1F1F;')
    .replace(/--theme-btn-bg: #[0-9A-Fa-f]+;/g, '--theme-btn-bg: #00D26A;')
    .replace(/--theme-badge-text: #[0-9A-Fa-f]+;/g, '--theme-badge-text: #00D26A;');
  cssContent = cssContent.replace(blueMatch[0], `[data-theme="blue"] {${blueContent}}`);
}

fs.writeFileSync('src/index.css', cssContent);
console.log("Patched CSS");

