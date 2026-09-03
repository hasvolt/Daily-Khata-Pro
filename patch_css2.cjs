const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

const regexRoot = /:root\s*\{([^}]*)\}/;
let rootMatch = content.match(regexRoot);
if (rootMatch) {
  let rootContent = rootMatch[1]
    .replace(/--theme-bg: #[0-9A-Fa-f]+;/g, '--theme-bg: #000000;')
    .replace(/--theme-surface: #[0-9A-Fa-f]+;/g, '--theme-surface: #09090b;')
    .replace(/--theme-card: #[0-9A-Fa-f]+;/g, '--theme-card: #09090b;')
    .replace(/--theme-card-hover: #[0-9A-Fa-f]+;/g, '--theme-card-hover: #18181b;')
    .replace(/--theme-border: #[0-9A-Fa-f]+;/g, '--theme-border: #27272a;');
  content = content.replace(rootMatch[0], `:root {${rootContent}}`);
}

const regexBlue = /\[data-theme="blue"\]\s*\{([^}]*)\}/;
let blueMatch = content.match(regexBlue);
if (blueMatch) {
  let blueContent = blueMatch[1]
    .replace(/--theme-bg: #[0-9A-Fa-f]+;/g, '--theme-bg: #000000;')
    .replace(/--theme-surface: #[0-9A-Fa-f]+;/g, '--theme-surface: #09090b;')
    .replace(/--theme-card: #[0-9A-Fa-f]+;/g, '--theme-card: #09090b;')
    .replace(/--theme-card-hover: #[0-9A-Fa-f]+;/g, '--theme-card-hover: #18181b;')
    .replace(/--theme-border: #[0-9A-Fa-f]+;/g, '--theme-border: #27272a;');
  content = content.replace(blueMatch[0], `[data-theme="blue"] {${blueContent}}`);
}

fs.writeFileSync('src/index.css', content);
console.log("Patched CSS");
