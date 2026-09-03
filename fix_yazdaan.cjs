const fs = require('fs');
let content = fs.readFileSync('src/components/DeveloperPage.tsx', 'utf8');

content = content.replace(
  /MD Zafeer Hasan \(YAZDAAN\) <span className="text-\[var\(--theme-primary,#38BDF8\)\]">\(YAZDAAN\)<\/span>/g,
  'MD Zafeer Hasan <span className="text-[var(--theme-primary,#38BDF8)]">(YAZDAAN)</span>'
);

fs.writeFileSync('src/components/DeveloperPage.tsx', content);
